import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  Scissors,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { BarberShop, Barber, Service, Appointment, BookedSlot, UserProfile } from '../types';
import {
  generateTimeSlots,
  calculatePriceBreakdown,
  generateBookingReference,
  formatFriendlyDate,
  formatINR,
} from '../utils/bookingEngine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: BarberShop[];
  initialShopId?: string | null;
  initialServiceName?: string | null;
  bookedSlots: BookedSlot[];
  onAddBooking: (appointment: Appointment, newSlot: BookedSlot) => void;
  user: UserProfile;
  onViewAppointments: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  shops,
  initialShopId,
  initialServiceName,
  bookedSlots,
  onAddBooking,
  user,
  onViewAppointments,
}) => {
  // Step state (1 to 8, plus confirmation view)
  // We can group steps intuitively:
  // Step 1: Shop & Service Selection
  // Step 2: Barber Selection
  // Step 3: Date & Slot Selection
  // Step 4: Customer Details & Special Requests
  // Step 5: Review Summary & Confirmation
  // Step 6: Confirmed Ticket View
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any'); // 'any' or barber id
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>(''); // e.g. "14:30"
  
  // Customer details
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Confirmed booking state
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Sync initial props on open
  useEffect(() => {
    if (isOpen) {
      const defaultShop = initialShopId
        ? shops.find((s) => s.id === initialShopId) || shops[0]
        : shops[0];
      setSelectedShopId(defaultShop.id);

      if (initialServiceName) {
        const foundService = defaultShop.services.find(
          (s) => s.name.toLowerCase().includes(initialServiceName.toLowerCase())
        );
        setSelectedServiceId(foundService ? foundService.id : defaultShop.services[0].id);
      } else {
        setSelectedServiceId(defaultShop.services[0].id);
      }

      // Default date to tomorrow or today
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      setSelectedDate(todayStr);

      // Pre-fill user details if logged in
      if (user.isLoggedIn) {
        setCustomerName(user.name);
        setCustomerEmail(user.email);
        setCustomerPhone(user.phone);
      } else {
        setCustomerName('Alex Morgan');
        setCustomerEmail('alex.morgan@example.com');
        setCustomerPhone('(555) 392-8172');
      }

      setCurrentStep(1);
      setConfirmedAppointment(null);
      setSelectedSlotTime('');
      setFormErrors({});
    }
  }, [isOpen, initialShopId, initialServiceName, shops, user]);

  const activeShop = useMemo(
    () => shops.find((s) => s.id === selectedShopId) || shops[0],
    [shops, selectedShopId]
  );

  const activeService = useMemo(
    () => activeShop?.services.find((s) => s.id === selectedServiceId) || activeShop?.services[0],
    [activeShop, selectedServiceId]
  );

  const activeBarber = useMemo(() => {
    if (selectedBarberId === 'any') {
      return {
        id: 'any',
        name: 'Any Available Barber',
        role: 'First Available Specialist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: 4.9,
      };
    }
    return activeShop?.barbers.find((b) => b.id === selectedBarberId) || activeShop?.barbers[0];
  }, [activeShop, selectedBarberId]);

  // Generate 7 upcoming dates
  const upcomingDates = useMemo(() => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({ iso, dayName, monthDay });
    }
    return dates;
  }, []);

  // Compute available slots
  const availableSlots = useMemo(() => {
    if (!activeShop || !activeService || !selectedDate) return [];

    // Parse shop hours
    const openTime = '09:00';
    const closeTime = '19:30';

    return generateTimeSlots({
      openingTime: openTime,
      closingTime: closeTime,
      intervalMinutes: 30,
      serviceDuration: activeService.durationMinutes,
      selectedBarberId,
      selectedDate,
      existingBookings: bookedSlots.filter((b) => b.shopId === activeShop.id),
      currentDateStr: new Date().toISOString().split('T')[0],
      currentMinutes: new Date().getHours() * 60 + new Date().getMinutes(),
    });
  }, [activeShop, activeService, selectedBarberId, selectedDate, bookedSlots]);

  // Price calculations
  const priceBreakdown = useMemo(() => {
    const price = activeService ? activeService.price : 45;
    return calculatePriceBreakdown(price, { promoApplied: true });
  }, [activeService]);

  const selectedSlot = useMemo(() => {
    return availableSlots.find((s) => s.time === selectedSlotTime);
  }, [availableSlots, selectedSlotTime]);

  // Validation
  const validateStep4 = () => {
    const errors: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errors.name = 'Full name is required';
    }
    if (!customerPhone.trim() || customerPhone.length < 7) {
      errors.phone = 'Valid phone number is required';
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errors.email = 'Valid email address is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!selectedServiceId) return;
      setCurrentStep(2); // Barber selection
    } else if (currentStep === 2) {
      setCurrentStep(3); // Date & Slot
    } else if (currentStep === 3) {
      if (!selectedSlotTime) {
        setFormErrors({ slot: 'Please select a time slot to continue' });
        return;
      }
      setFormErrors({});
      setCurrentStep(4); // Details
    } else if (currentStep === 4) {
      if (validateStep4()) {
        setCurrentStep(5); // Review
      }
    }
  };

  const handleConfirmBooking = () => {
    if (!activeShop || !activeService || !selectedSlot) return;

    const ref = generateBookingReference();
    const finalBarberName =
      selectedBarberId === 'any'
        ? activeShop.barbers[0].name + ' (Assigned)'
        : activeBarber?.name || 'Master Barber';

    const newAppointment: Appointment = {
      id: 'apt-' + Date.now(),
      bookingRef: ref,
      shopId: activeShop.id,
      shopName: activeShop.name,
      shopAddress: activeShop.address,
      shopImage: activeShop.coverImage,
      serviceId: activeService.id,
      serviceName: activeService.name,
      serviceDuration: activeService.durationMinutes,
      servicePrice: activeService.price,
      bookingFee: priceBreakdown.bookingFee,
      totalPrice: priceBreakdown.total,
      barberId: selectedBarberId === 'any' ? activeShop.barbers[0].id : selectedBarberId,
      barberName: finalBarberName,
      date: selectedDate,
      formattedDate: formatFriendlyDate(selectedDate),
      startTime: selectedSlot.time,
      endTime: selectedSlot.endTime,
      displayTime: `${selectedSlot.displayTime} – ${selectedSlot.displayEndTime}`,
      customerName,
      customerPhone,
      customerEmail,
      specialNotes: specialNotes.trim() ? specialNotes.trim() : undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    const newSlot: BookedSlot = {
      shopId: activeShop.id,
      barberId: selectedBarberId,
      date: selectedDate,
      startTime: selectedSlot.time,
      durationMinutes: activeService.durationMinutes,
    };

    onAddBooking(newAppointment, newSlot);
    setConfirmedAppointment(newAppointment);
    setCurrentStep(6); // Confirmation screen
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Scissors className="w-4 h-4 -rotate-45" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif-display text-white">
                {currentStep === 6 ? 'Booking Confirmed!' : 'Book Appointment'}
              </h2>
              <p className="text-xs text-stone-400">
                {currentStep === 6
                  ? 'Your appointment has been reserved'
                  : `Step ${currentStep} of 5 · ${activeShop?.name}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (hidden on step 6) */}
        {currentStep < 6 && (
          <div className="h-1 bg-stone-100 w-full shrink-0">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: SHOP & SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Select Barber Shop
                </label>
                <select
                  value={selectedShopId}
                  onChange={(e) => {
                    setSelectedShopId(e.target.value);
                    const newShop = shops.find((s) => s.id === e.target.value);
                    if (newShop && newShop.services.length > 0) {
                      setSelectedServiceId(newShop.services[0].id);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.locality} ({s.rating} ★)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Choose Grooming Service
                </label>
                <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                  {activeShop.services.map((svc) => {
                    const isSelected = svc.id === selectedServiceId;
                    return (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedServiceId(svc.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-900">
                              {svc.name}
                            </span>
                            {svc.popular && (
                              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-500 line-clamp-1">{svc.description}</p>
                          <div className="text-[11px] text-stone-500 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" />
                              {svc.durationMinutes} mins
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{svc.category}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-base font-bold font-serif-display text-stone-900 tabular-nums">
                            {formatINR(svc.price)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border mt-1 mx-auto flex items-center justify-center ${
                              isSelected
                                ? 'bg-amber-500 border-amber-500 text-stone-950'
                                : 'border-stone-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BARBER SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Select Your Barber</h3>
                <p className="text-xs text-stone-500">
                  Pick a specific master stylist or choose 'Any Available Barber' for the quickest slot.
                </p>
              </div>

              <div className="space-y-3">
                {/* Any Available option */}
                <div
                  onClick={() => setSelectedBarberId('any')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedBarberId === 'any'
                      ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900">Any Available Barber</h4>
                      <p className="text-xs text-stone-500">
                        First available verified barber · Recommended for maximum slot availability
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedBarberId === 'any'
                        ? 'bg-amber-500 border-amber-500 text-stone-950'
                        : 'border-stone-300'
                    }`}
                  >
                    {selectedBarberId === 'any' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Specific Barbers */}
                {activeShop.barbers.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-stone-900">{barber.name}</h4>
                            <span className="text-xs font-semibold text-amber-600">
                              ★ {barber.rating}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500">{barber.role}</p>
                          <span className="text-[11px] text-stone-400">
                            Specialty: {barber.specialty} · {barber.experienceYears}y exp
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 border-amber-500 text-stone-950'
                            : 'border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME SLOT SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Date selection bar */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {upcomingDates.map((d) => {
                    const isSelected = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.iso);
                          setSelectedSlotTime(''); // Reset slot on date change
                        }}
                        className={`p-2.5 rounded-xl text-center border transition-all focus:outline-none ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-500/50'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                        }`}
                      >
                        <span className="block text-[11px] font-medium opacity-80">{d.dayName}</span>
                        <span className="block text-xs font-bold mt-0.5">{d.monthDay}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Available Time Slots
                  </label>
                  <span className="text-xs text-stone-400">
                    Duration: {activeService?.durationMinutes} mins
                  </span>
                </div>

                {formErrors.slot && (
                  <div className="mb-2 p-2 rounded-lg bg-amber-50 text-amber-800 text-xs flex items-center gap-1.5 border border-amber-200">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.slot}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[260px] overflow-y-auto p-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlotTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          setSelectedSlotTime(slot.time);
                          setFormErrors({});
                        }}
                        title={slot.unavailableReason || 'Available'}
                        className={`py-2 px-2 rounded-xl text-center border text-xs font-medium transition-all relative ${
                          !slot.available
                            ? 'bg-stone-100/60 text-stone-400 border-stone-200/60 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-md ring-2 ring-amber-400'
                            : 'bg-white hover:border-amber-400 text-stone-800 border-stone-200 hover:bg-amber-50/30'
                        }`}
                      >
                        <span>{slot.displayTime}</span>
                        {slot.available && (
                          <span className="block text-[10px] text-stone-500 font-normal mt-0.5">
                            Until {slot.displayEndTime}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-white border border-stone-300" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-stone-200 border border-stone-300" />
                    <span>Booked / Past</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER DETAILS */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Your Contact Details</h3>
                  <p className="text-xs text-stone-500">
                    Appointment confirmation and SMS reminders will be sent to these details.
                  </p>
                </div>
                {user.isLoggedIn && (
                  <span className="self-start sm:self-auto inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Pre-filled from Profile Settings</span>
                  </span>
                )}
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Julian Reed"
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                  {formErrors.name && (
                    <span className="text-[11px] text-red-600 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                    {formErrors.phone && (
                      <span className="text-[11px] text-red-600 mt-1 block">{formErrors.phone}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                    {formErrors.email && (
                      <span className="text-[11px] text-red-600 mt-1 block">{formErrors.email}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Special Requests or Styling Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g., Low skin taper fade, beard line cleanup, sensitive skin"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUMMARY */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="text-base font-bold font-serif-display text-stone-900">
                      {activeShop?.name}
                    </h4>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {activeShop?.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                      Barber
                    </span>
                    <span className="text-xs font-bold text-amber-700">
                      {selectedBarberId === 'any' ? 'Any Available' : activeBarber?.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block">Service</span>
                    <span className="font-semibold text-stone-900">{activeService?.name}</span>
                    <span className="text-stone-500 block">({activeService?.durationMinutes} mins)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Date & Time</span>
                    <span className="font-semibold text-stone-900">
                      {formatFriendlyDate(selectedDate)}
                    </span>
                    <span className="text-amber-700 font-bold block">
                      {selectedSlot?.displayTime} – {selectedSlot?.displayEndTime}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-xs">
                  <span className="text-stone-400 block">Customer</span>
                  <span className="font-medium text-stone-800">
                    {customerName} · {customerPhone} · {customerEmail}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Service Fee ({activeService?.name})</span>
                  <span className="font-semibold tabular-nums">{formatINR(priceBreakdown.subtotal)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Trimly Launch Promo Booking Fee</span>
                  <span className="font-medium">FREE ({formatINR(0)})</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold tabular-nums">{formatINR(priceBreakdown.tax)}</span>
                </div>
                <div className="pt-2 border-t border-stone-300 flex justify-between font-bold text-sm text-stone-950">
                  <span>Total Due At Shop</span>
                  <span className="text-base font-serif-display font-extrabold text-amber-800 tabular-nums">
                    {formatINR(priceBreakdown.total)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Zero upfront payment required:</strong>
                  Pay directly at the shop after your service. Free cancellation up to 1 hour before appointment.
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRMATION TICKET */}
          {currentStep === 6 && confirmedAppointment && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <CalendarCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold tracking-wider mb-2">
                  BOOKING REFERENCE: {confirmedAppointment.bookingRef}
                </span>
                <h3 className="text-2xl font-bold font-serif-display text-stone-900">
                  You’re All Set, {customerName.split(' ')[0]}!
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Walk in at your scheduled time. Your chair will be ready with zero line wait.
                </p>
              </div>

              {/* Receipt Ticket */}
              <div className="bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-5 text-left text-xs space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <div>
                    <span className="font-bold text-sm text-stone-900 font-serif-display block">
                      {confirmedAppointment.shopName}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      {confirmedAppointment.shopAddress}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block">Status</span>
                    <span className="font-bold text-emerald-600 uppercase text-xs">Confirmed</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-stone-400 block">Service</span>
                    <span className="font-bold text-stone-800">{confirmedAppointment.serviceName}</span>
                    <span className="text-stone-500 text-[11px] block">
                      {confirmedAppointment.serviceDuration} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Barber</span>
                    <span className="font-bold text-stone-800">{confirmedAppointment.barberName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Date</span>
                    <span className="font-bold text-stone-800">{confirmedAppointment.formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Time Slot</span>
                    <span className="font-bold text-amber-700">{confirmedAppointment.displayTime}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-xs">
                  <span className="text-stone-500">Total Price Due at Shop</span>
                  <span className="text-base font-bold text-stone-900 font-serif-display tabular-nums">
                    {formatINR(confirmedAppointment.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Demonstration Notice */}
              <p className="text-[11px] text-stone-400 italic">
                * Simulated frontend booking confirmation saved to your browser session (localStorage).
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewAppointments();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>View in My Appointments</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (steps 1 to 5) */}
        {currentStep < 6 && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-stone-500 hover:text-stone-700 text-xs font-medium"
              >
                Cancel
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold transition-all shadow-md flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirm Appointment</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
