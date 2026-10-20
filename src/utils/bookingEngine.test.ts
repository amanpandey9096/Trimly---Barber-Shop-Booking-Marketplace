import test from 'node:test';
import assert from 'node:assert/strict';
import {
  timeToMinutes,
  minutesToTime,
  formatTime12Hour,
  calculateEndTime,
  isIntervalOverlapping,
  generateTimeSlots,
  calculatePriceBreakdown,
  generateBookingReference,
  formatINR,
} from './bookingEngine.ts';

test('timeToMinutes correctly converts 24-hr time strings to minutes', () => {
  assert.equal(timeToMinutes('00:00'), 0);
  assert.equal(timeToMinutes('09:30'), 570);
  assert.equal(timeToMinutes('14:45'), 885);
  assert.equal(timeToMinutes('23:59'), 1439);
});

test('minutesToTime formats minutes to padded 24-hr string', () => {
  assert.equal(minutesToTime(0), '00:00');
  assert.equal(minutesToTime(570), '09:30');
  assert.equal(minutesToTime(885), '14:45');
});

test('formatTime12Hour transforms 24-hr to user-friendly 12-hr am/pm format', () => {
  assert.equal(formatTime12Hour('09:00'), '9:00 AM');
  assert.equal(formatTime12Hour('12:00'), '12:00 PM');
  assert.equal(formatTime12Hour('14:30'), '2:30 PM');
  assert.equal(formatTime12Hour('18:45'), '6:45 PM');
});

test('calculateEndTime adds service duration correctly', () => {
  assert.equal(calculateEndTime('10:00', 30), '10:30');
  assert.equal(calculateEndTime('14:30', 45), '15:15');
  assert.equal(calculateEndTime('16:45', 60), '17:45');
});

test('isIntervalOverlapping detects colliding slots', () => {
  // Appointment from 10:00 (600) to 10:45 (645)
  // Candidate 1: 10:30 to 11:00 (overlaps)
  assert.equal(isIntervalOverlapping(600, 45, 630, 30), true);
  // Candidate 2: 10:45 to 11:15 (exact adjacent, should NOT overlap)
  assert.equal(isIntervalOverlapping(600, 45, 645, 30), false);
  // Candidate 3: 09:30 to 10:00 (exact adjacent before, should NOT overlap)
  assert.equal(isIntervalOverlapping(600, 45, 570, 30), false);
  // Candidate 4: 09:45 to 10:15 (overlaps start)
  assert.equal(isIntervalOverlapping(600, 45, 585, 30), true);
});

test('generateTimeSlots marks overlapping slots as unavailable', () => {
  const existing = [
    {
      shopId: 'shop-1',
      barberId: 'barber-marcus',
      date: '2026-10-21',
      startTime: '11:00',
      durationMinutes: 45, // 11:00 - 11:45
    },
  ];

  const slots = generateTimeSlots({
    openingTime: '10:00',
    closingTime: '13:00',
    intervalMinutes: 30,
    serviceDuration: 30,
    selectedBarberId: 'barber-marcus',
    selectedDate: '2026-10-21',
    existingBookings: existing,
  });

  // Expected slots: 10:00, 10:30, 11:00, 11:30, 12:00, 12:30
  // 10:00 (10:00-10:30): available
  // 10:30 (10:30-11:00): available (adjacent)
  // 11:00 (11:00-11:30): UNAVAILABLE (overlaps 11:00-11:45)
  // 11:30 (11:30-12:00): UNAVAILABLE (overlaps 11:00-11:45)
  // 12:00 (12:00-12:30): available
  // 12:30 (12:30-13:00): available

  const slot1000 = slots.find((s) => s.time === '10:00');
  const slot1030 = slots.find((s) => s.time === '10:30');
  const slot1100 = slots.find((s) => s.time === '11:00');
  const slot1130 = slots.find((s) => s.time === '11:30');
  const slot1200 = slots.find((s) => s.time === '12:00');

  assert.equal(slot1000?.available, true);
  assert.equal(slot1030?.available, true);
  assert.equal(slot1100?.available, false);
  assert.equal(slot1130?.available, false);
  assert.equal(slot1200?.available, true);
});

test('generateTimeSlots disables slots that exceed closing time', () => {
  const slots = generateTimeSlots({
    openingTime: '17:00',
    closingTime: '18:00',
    intervalMinutes: 30,
    serviceDuration: 60, // 60 min service
    selectedBarberId: 'any',
    selectedDate: '2026-10-21',
    existingBookings: [],
  });

  // 17:00 (17:00-18:00): fits inside closing time (18:00) -> available
  // 17:30 (17:30-18:30): finishes after 18:00 -> unavailable
  const slot1700 = slots.find((s) => s.time === '17:00');
  const slot1730 = slots.find((s) => s.time === '17:30');

  assert.equal(slot1700?.available, true);
  assert.equal(slot1730?.available, false);
  assert.equal(slot1730?.unavailableReason, 'Exceeds shop closing time');
});

test('calculatePriceBreakdown calculates subtotal, taxes, and applies promo booking fee waiver', () => {
  const breakdownPromo = calculatePriceBreakdown(50, { promoApplied: true });
  assert.equal(breakdownPromo.subtotal, 50);
  assert.equal(breakdownPromo.bookingFee, 0);
  assert.equal(breakdownPromo.promoDiscount, 2.0);
  assert.equal(breakdownPromo.tax, 4.0); // 8% of 50
  assert.equal(breakdownPromo.total, 54.0);

  const breakdownNoPromo = calculatePriceBreakdown(50, { promoApplied: false });
  assert.equal(breakdownNoPromo.bookingFee, 2.0);
  assert.equal(breakdownNoPromo.total, 56.0);
});

test('generateBookingReference matches TRM-XXXXX pattern', () => {
  const ref = generateBookingReference();
  assert.match(ref, /^TRM-\d{5}$/);
});

test('formatINR formats numbers with Indian Rupee symbol', () => {
  assert.ok(formatINR(450).includes('450'));
  assert.ok(formatINR(450).includes('₹'));
});

