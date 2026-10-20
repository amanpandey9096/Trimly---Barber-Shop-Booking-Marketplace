/**
 * Pure booking, scheduling, and pricing calculation engine for Trimly.
 * Decoupled from React UI for deterministic testing and rock-solid slot math.
 */

export interface GeneratedSlot {
  time: string; // "14:30"
  displayTime: string; // "2:30 PM"
  endTime: string; // "15:15"
  displayEndTime: string; // "3:15 PM"
  available: boolean;
  unavailableReason?: string;
}

export interface ExistingBooking {
  shopId: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  durationMinutes: number;
}

/**
 * Converts a "HH:MM" 24-hour string to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length !== 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight to "HH:MM" 24-hour string
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const paddedH = h.toString().padStart(2, '0');
  const paddedM = m.toString().padStart(2, '0');
  return `${paddedH}:${paddedM}`;
}

/**
 * Formats "HH:MM" 24-hour string to friendly 12-hour string (e.g., "2:30 PM", "9:00 AM")
 */
export function formatTime12Hour(timeStr: string): string {
  const mins = timeToMinutes(timeStr);
  const h24 = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const paddedM = m.toString().padStart(2, '0');
  return `${h12}:${paddedM} ${period}`;
}

/**
 * Calculates end time given start time and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMins = timeToMinutes(startTime);
  const endMins = startMins + durationMinutes;
  return minutesToTime(endMins);
}

/**
 * Checks if two time intervals overlap
 */
export function isIntervalOverlapping(
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean {
  const endA = startA + durationA;
  const endB = startB + durationB;
  return startA < endB && startB < endA;
}

/**
 * Generates schedule slots for a day given shop operating hours, service duration,
 * and existing bookings.
 */
export function generateTimeSlots(params: {
  openingTime: string; // e.g. "09:00"
  closingTime: string; // e.g. "19:00"
  intervalMinutes?: number; // default 30 mins
  serviceDuration: number; // e.g. 45 mins
  selectedBarberId: string; // specific barber ID or 'any'
  selectedDate: string; // "YYYY-MM-DD"
  existingBookings: ExistingBooking[];
  currentDateStr?: string; // For testing mock "today"
  currentMinutes?: number; // For testing mock current time
}): GeneratedSlot[] {
  const interval = params.intervalMinutes || 30;
  const openMins = timeToMinutes(params.openingTime);
  const closeMins = timeToMinutes(params.closingTime);
  const duration = params.serviceDuration;

  const relevantBookings = params.existingBookings.filter((b) => {
    if (b.date !== params.selectedDate) return false;
    if (params.selectedBarberId === 'any') {
      // If 'any', slot is only blocked if all barbers are booked.
      // But for simplicity in sample data, we check if specific barber matches
      return true;
    }
    return b.barberId === params.selectedBarberId || b.barberId === 'any';
  });

  const slots: GeneratedSlot[] = [];

  for (let current = openMins; current < closeMins; current += interval) {
    const slotStartTime = minutesToTime(current);
    const slotEndTime = minutesToTime(current + duration);
    const slotEndMins = current + duration;

    let available = true;
    let unavailableReason: string | undefined = undefined;

    // Check 1: Does service finish after shop closes?
    if (slotEndMins > closeMins) {
      available = false;
      unavailableReason = 'Exceeds shop closing time';
    }

    // Check 2: Does it clash with an existing booking?
    if (available) {
      for (const booking of relevantBookings) {
        const bookingStartMins = timeToMinutes(booking.startTime);
        if (
          isIntervalOverlapping(
            current,
            duration,
            bookingStartMins,
            booking.durationMinutes
          )
        ) {
          available = false;
          unavailableReason = 'Booked by another client';
          break;
        }
      }
    }

    // Check 3: If date is today, is it in the past?
    if (
      available &&
      params.currentDateStr &&
      params.selectedDate === params.currentDateStr &&
      params.currentMinutes !== undefined
    ) {
      if (current <= params.currentMinutes + 15) {
        // Must book at least 15 mins in advance
        available = false;
        unavailableReason = 'Time slot has passed';
      }
    }

    slots.push({
      time: slotStartTime,
      displayTime: formatTime12Hour(slotStartTime),
      endTime: slotEndTime,
      displayEndTime: formatTime12Hour(slotEndTime),
      available,
      unavailableReason,
    });
  }

  return slots;
}

/**
 * Calculates price breakdown with taxes and booking promo fee
 */
export function calculatePriceBreakdown(
  servicePrice: number,
  options?: { promoApplied?: boolean; customTaxRate?: number; standardFee?: number }
) {
  const promoApplied = options?.promoApplied ?? true; // Trimly launch promo: waived booking fee!
  // In INR, default standard convenience fee is ₹49 (or specified standardFee)
  const standardFee = options?.standardFee ?? (servicePrice > 100 ? 49 : 2.0);
  const bookingFee = promoApplied ? 0 : standardFee;
  const taxRate = options?.customTaxRate ?? (servicePrice > 100 ? 0.05 : 0.08); // 5% GST for INR services
  const tax = Math.round(servicePrice * taxRate * 100) / 100;
  const total = Math.round((servicePrice + bookingFee + tax) * 100) / 100;

  return {
    subtotal: servicePrice,
    standardFee,
    bookingFee,
    promoDiscount: promoApplied ? standardFee : 0,
    promoApplied,
    tax,
    total,
  };
}

/**
 * Formats an amount as Indian Rupee string, e.g. "₹450" or "₹1,200"
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
}

/**
 * Generates unique customer booking reference code like "TRM-84920"
 */
export function generateBookingReference(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `TRM-${randomNum}`;
}

/**
 * Formats a YYYY-MM-DD date string into a friendly human-readable format
 * (e.g. "Tuesday, Oct 21, 2026")
 */
export function formatFriendlyDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

