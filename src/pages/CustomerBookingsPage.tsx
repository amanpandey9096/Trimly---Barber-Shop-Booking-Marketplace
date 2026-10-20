import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Scissors,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Phone,
  ChevronRight,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Info,
  CalendarDays,
  X,
  ExternalLink,
} from 'lucide-react';
import { Appointment, BarberShop, BookedSlot, UserProfile } from '../types';
import { CustomerLayout } from '../components/CustomerLayout';
import {
  formatINR,
  formatFriendlyDate,
  generateTimeSlots,
  calculateEndTime,
} from '../utils/bookingEngine';

interface CustomerBookingsPageProps {
  appointments: Appointment[];
  user: UserProfile;
  shops: BarberShop[];
  bookedSlots: BookedSlot[];
  onNavigate: (view: string, shopId?: string) => void;
  onLogout: () => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    displayTime: string
  ) => void;
  onOpenBookingForShop: (shopId: string, serviceName?: string) => void;
}

export const CustomerBookingsPage: React.FC<CustomerBookingsPageProps> = ({
  appointments,
  user,
  shops,
  bookedSlots,
  onNavigate,
  onLogout,
  onCancelAppointment,
  onRescheduleAppointment,
  onOpenBookingForShop,
}) => {
  // Tabs: 'all' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled'
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Filter appointments for active customer
  const userAppointments = appointments.filter(
    (a) =>
      a.customerId === user.id ||
      (user.email && a.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user.name && a.customerName?.toLowerCase() === user.name.toLowerCase())
  );

  const filteredAppointments = userAppointments.filter((apt) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming' || activeTab === 'confirmed') return apt.status === 'confirmed';
    if (activeTab === 'completed') return apt.status === 'completed';
    if (activeTab === 'cancelled') return apt.status === 'cancelled';
    return true;
  });

  const upcomingCount = userAppointments.filter((a) => a.status === 'confirmed').length;

  // Selected appointment for details modal
  const [detailModalAppointment, setDetailModalAppointment] = useState<Appointment | null>(null);

  // Cancellation dialog state
  const [cancellingApt, setCancellingApt] = useState<Appointment | null>(null);

  // Reschedule modal state
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [newSlotTime, setNewSlotTime] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string>('');
  const [rescheduleSuccess, setRescheduleSuccess] = useState<string>('');

  const handleOpenReschedule = (apt: Appointment) => {
    setReschedulingApt(apt);
    // Default to tomorrow or next day
    const tomorrow = new Date(Date.now() + 86400000);
    setNewDate(tomorrow.toISOString().split('T')[0]);
    setNewSlotTime('');
    setRescheduleError('');
    setRescheduleSuccess('');
  };

  const handleConfirmCancel = () => {
    if (cancellingApt) {
      onCancelAppointment(cancellingApt.id);
      if (detailModalAppointment?.id === cancellingApt.id) {
        setDetailModalAppointment({ ...detailModalAppointment, status: 'cancelled' });
      }
      setCancellingApt(null);
    }
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingApt || !newDate || !newSlotTime) {
      setRescheduleError('Please choose both a new date and an available time slot.');
      return;
    }

    // Calculate end time
    const newEndTime = calculateEndTime(newSlotTime, reschedulingApt.serviceDuration);
    const [h, m] = newSlotTime.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const startFormatted = `${h12}:${m.toString().padStart(2, '0')} ${period}`;

    const [eh, em] = newEndTime.split(':').map(Number);
    const eperiod = eh >= 12 ? 'PM' : 'AM';
    const eh12 = eh % 12 === 0 ? 12 : eh % 12;
    const endFormatted = `${eh12}:${em.toString().padStart(2, '0')} ${eperiod}`;

    const displayTime = `${startFormatted} – ${endFormatted}`;

    onRescheduleAppointment(
      reschedulingApt.id,
      newDate,
      newSlotTime,
      newEndTime,
      displayTime
    );

    setRescheduleSuccess('Your appointment has been successfully rescheduled!');
    setTimeout(() => {
      setReschedulingApt(null);
      setRescheduleSuccess('');
    }, 1200);
  };

  // Generate slots for rescheduling
  const reschedulingShop = reschedulingApt
    ? shops.find((s) => s.id === reschedulingApt.shopId) || shops[0]
    : shops[0];

  const availableRescheduleSlots = React.useMemo(() => {
    if (!reschedulingApt || !newDate) return [];
    return generateTimeSlots({
      openingTime: '09:00',
      closingTime: '19:30',
      intervalMinutes: 30,
      serviceDuration: reschedulingApt.serviceDuration,
      selectedBarberId: reschedulingApt.barberId,
      selectedDate: newDate,
      existingBookings: bookedSlots,
    });
  }, [reschedulingApt, newDate, bookedSlots]);

  return (
    <CustomerLayout
      currentView="customer/bookings"
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      upcomingCount={upcomingCount}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-display text-stone-900 tracking-tight">
              My Appointments History
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Track past and upcoming reservations, reschedule slots, or re-book your favorite barber.
            </p>
          </div>

          <button
            onClick={() => onNavigate('explore')}
            className="self-start sm:self-auto py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Scissors className="w-3.5 h-3.5 -rotate-45" />
            <span>Book New Appointment</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border-b border-stone-200 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Bookings', count: userAppointments.length },
            {
              id: 'upcoming',
              label: 'Upcoming',
              count: userAppointments.filter((a) => a.status === 'confirmed').length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: userAppointments.filter((a) => a.status === 'completed').length,
            },
            {
              id: 'cancelled',
              label: 'Cancelled',
              count: userAppointments.filter((a) => a.status === 'cancelled').length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-stone-950' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List or Empty State */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => {
              const isEligibleForActions = apt.status === 'confirmed';

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  {/* Left: Thumbnail & Shop details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={apt.shopImage}
                        alt={apt.shopName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          {apt.bookingRef}
                        </span>

                        {apt.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Confirmed</span>
                          </span>
                        )}

                        {apt.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            <span>Completed</span>
                          </span>
                        )}

                        {apt.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3 text-stone-500" />
                            <span>Cancelled</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold font-serif-display text-stone-900 truncate">
                        {apt.shopName}
                      </h3>

                      <p className="text-xs text-stone-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{apt.shopAddress}</span>
                      </p>

                      <div className="text-xs text-stone-700 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                        <span className="font-semibold">{apt.serviceName}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500">Barber: {apt.barberName}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500">{apt.serviceDuration} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Date, Price & Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center md:items-end lg:items-center justify-between md:justify-end gap-4 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 md:border-t lg:border-t-0 border-stone-100">
                    <div className="text-left md:text-right space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 flex items-center md:justify-end gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{apt.formattedDate || apt.date}</span>
                      </div>
                      <div className="text-xs font-bold text-amber-700">
                        {apt.displayTime}
                      </div>
                      <div className="text-base font-extrabold font-serif-display text-stone-950 tabular-nums">
                        {formatINR(apt.totalPrice)}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setDetailModalAppointment(apt)}
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>

                      {isEligibleForActions ? (
                        <>
                          <button
                            onClick={() => handleOpenReschedule(apt)}
                            className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => setCancellingApt(apt)}
                            className="py-2 px-3 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => onOpenBookingForShop(apt.shopId, apt.serviceName)}
                          className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Book Again</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif-display text-stone-900">
                No Bookings Found in This View
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {activeTab === 'all'
                  ? "You haven't made any appointments with Trimly yet. Explore certified local barber shops and book your first guaranteed slot."
                  : `You do not have any ${activeTab} appointments at this time.`}
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <Scissors className="w-4 h-4 -rotate-45" />
              <span>Find a Barber</span>
            </button>
          </div>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {detailModalAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                  Appointment Overview
                </span>
                <h3 className="text-lg font-bold font-serif-display text-stone-900">
                  {detailModalAppointment.shopName}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalAppointment(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Booking Reference</span>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    {detailModalAppointment.bookingRef}
                  </span>
                </div>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                    detailModalAppointment.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : detailModalAppointment.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {detailModalAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Service</span>
                  <span className="font-bold text-stone-900">{detailModalAppointment.serviceName}</span>
                  <span className="text-stone-500 block text-[11px]">
                    {detailModalAppointment.serviceDuration} mins
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Barber</span>
                  <span className="font-bold text-stone-900">{detailModalAppointment.barberName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Date</span>
                  <span className="font-bold text-stone-900">
                    {detailModalAppointment.formattedDate || detailModalAppointment.date}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Slot Time</span>
                  <span className="font-bold text-amber-700">{detailModalAppointment.displayTime}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">Salon Address</span>
                <p className="font-medium text-stone-800">{detailModalAppointment.shopAddress}</p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">Total Due at Salon</span>
                  <span className="text-[10px] text-stone-500">Pay after haircut</span>
                </div>
                <span className="text-lg font-bold font-serif-display text-amber-950 tabular-nums">
                  {formatINR(detailModalAppointment.totalPrice)}
                </span>
              </div>

              {/* Cancellation Policy */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-[11px] text-stone-600">
                <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cancellation & Rescheduling Policy</span>
                </div>
                <p className="leading-relaxed">
                  You can reschedule or cancel up to 1 hour before your appointment time at no penalty. Completed appointments cannot be altered.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  setDetailModalAppointment(null);
                  onNavigate('shop-detail', detailModalAppointment.shopId);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <span>Visit Shop Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {detailModalAppointment.status === 'confirmed' && (
                <button
                  onClick={() => {
                    const apt = detailModalAppointment;
                    setDetailModalAppointment(null);
                    handleOpenReschedule(apt);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                >
                  Reschedule Slot
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancellingApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-serif-display text-stone-900">
                Cancel This Appointment?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to release your reserved chair at{' '}
                <strong className="text-stone-800">{cancellingApt.shopName}</strong> on{' '}
                <strong className="text-stone-800">{cancellingApt.formattedDate || cancellingApt.date}</strong> at{' '}
                <strong className="text-stone-800">{cancellingApt.displayTime}</strong>?
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
              <span className="font-semibold text-stone-700 block">Cancellation Policy:</span>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Your slot will be immediately opened for other clients. You can book another session anytime.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCancellingApt(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Yes, Cancel Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                  Reschedule Appointment
                </span>
                <h3 className="text-lg font-bold font-serif-display text-stone-900">
                  {reschedulingApt.shopName}
                </h3>
              </div>
              <button
                onClick={() => setReschedulingApt(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleSuccess ? (
              <div className="p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">{rescheduleSuccess}</h4>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="text-stone-500">Current Slot:</div>
                  <div className="font-bold text-stone-800">
                    {reschedulingApt.formattedDate || reschedulingApt.date} · {reschedulingApt.displayTime}
                  </div>
                  <div className="text-stone-500 text-[11px] mt-1">
                    Service: {reschedulingApt.serviceName} ({reschedulingApt.serviceDuration} mins)
                  </div>
                </div>

                {/* Choose New Date */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Select New Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => {
                      setNewDate(e.target.value);
                      setNewSlotTime('');
                    }}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Select New Time Slot */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">
                    Select Available Time Slot *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                    {availableRescheduleSlots.map((slot) => {
                      const isSelected = newSlotTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setNewSlotTime(slot.time)}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                              : slot.available
                              ? 'bg-stone-50 hover:bg-stone-200 text-stone-800 border border-stone-200'
                              : 'bg-stone-100 text-stone-300 border border-stone-100 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.displayTime}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {rescheduleError && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {rescheduleError}
                  </p>
                )}

                <div className="flex gap-3 pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setReschedulingApt(null)}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReschedule}
                    disabled={!newDate || !newSlotTime}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold shadow-md transition-all"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};
