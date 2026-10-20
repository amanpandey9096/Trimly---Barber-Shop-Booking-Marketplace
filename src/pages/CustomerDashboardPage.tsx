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
} from 'lucide-react';
import { Appointment, BarberShop, UserProfile } from '../types';
import { CustomerLayout } from '../components/CustomerLayout';
import { formatINR } from '../utils/bookingEngine';

interface CustomerDashboardPageProps {
  appointments: Appointment[];
  user: UserProfile;
  shops: BarberShop[];
  onNavigate: (view: string, shopId?: string) => void;
  onLogout: () => void;
  onOpenBookingForShop?: (shopId: string, serviceName?: string) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment?: (id: string, newDate: string, newStartTime: string, newEndTime: string) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  appointments,
  user,
  shops,
  onNavigate,
  onLogout,
  onOpenBookingForShop,
  onCancelAppointment,
}) => {
  // Filter appointments belonging to this customer
  const userAppointments = appointments.filter(
    (a) =>
      a.customerId === user.id ||
      (user.email && a.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user.name && a.customerName?.toLowerCase() === user.name.toLowerCase())
  );

  const upcomingAppointments = userAppointments.filter((a) => a.status === 'confirmed');
  const completedAppointments = userAppointments.filter((a) => a.status === 'completed');
  const cancelledAppointments = userAppointments.filter((a) => a.status === 'cancelled');

  // Next upcoming appointment (first confirmed appointment)
  const nextAppointment = upcomingAppointments[0];

  // Selected appointment for detail modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Cancellation modal state
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

  const handleConfirmCancel = () => {
    if (cancellingAppointmentId) {
      onCancelAppointment(cancellingAppointmentId);
      setCancellingAppointmentId(null);
      if (selectedAppointment && selectedAppointment.id === cancellingAppointmentId) {
        setSelectedAppointment({ ...selectedAppointment, status: 'cancelled' });
      }
    }
  };

  return (
    <CustomerLayout
      currentView="customer/dashboard"
      onNavigate={onNavigate}
      user={user}
      onLogout={onLogout}
      upcomingCount={upcomingAppointments.length}
    >
      <div className="space-y-8">
        {/* Personalized Welcome Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Verified Client Portal</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif-display tracking-tight">
                Welcome back, {user.name ? user.name.split(' ')[0] : 'Client'}!
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                Manage your grooming reservations, view salon confirmation passes, and skip every queue in your city.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('explore')}
                className="py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4 -rotate-45" />
                <span>Book a Barber</span>
              </button>
            </div>
          </div>

          {/* Decorative barber shears watermarks */}
          <div className="absolute right-4 -bottom-10 opacity-5 pointer-events-none text-white">
            <Scissors className="w-64 h-64 -rotate-12" />
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Upcoming */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Upcoming
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-serif-display text-stone-900 tabular-nums">
                {upcomingAppointments.length}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Active chairs reserved</span>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-serif-display text-stone-900 tabular-nums">
                {completedAppointments.length}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Services attended</span>
            </div>
          </div>

          {/* Card 3: Cancelled */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Cancelled
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-serif-display text-stone-900 tabular-nums">
                {cancelledAppointments.length}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Slots released</span>
            </div>
          </div>

          {/* Card 4: Total Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Total Bookings
              </span>
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold font-serif-display text-stone-900 tabular-nums">
                {userAppointments.length}
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">Lifetime appointments</span>
            </div>
          </div>
        </div>

        {/* Next Upcoming Appointment Hero Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif-display text-stone-900">
              Next Upcoming Appointment
            </h2>
            <button
              onClick={() => onNavigate('customer/bookings')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>View All History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextAppointment ? (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Shop Photo */}
                <div className="relative aspect-[16/10] md:aspect-auto h-48 md:h-full bg-stone-100">
                  <img
                    src={nextAppointment.shopImage}
                    alt={nextAppointment.shopName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 md:from-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-stone-900/90 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm shadow">
                    REF: {nextAppointment.bookingRef}
                  </div>
                  <div className="absolute bottom-3 left-3 md:hidden text-white font-bold font-serif-display text-lg">
                    {nextAppointment.shopName}
                  </div>
                </div>

                {/* Details Column */}
                <div className="p-6 md:col-span-2 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="hidden md:flex items-center gap-2 mb-1">
                          <span className="text-xs text-stone-400 font-medium">Barber Shop</span>
                        </div>
                        <h3 className="text-2xl font-bold font-serif-display text-stone-900">
                          {nextAppointment.shopName}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{nextAppointment.shopAddress}</span>
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{nextAppointment.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Service</span>
                        <span className="font-bold text-stone-900 block mt-0.5 truncate">
                          {nextAppointment.serviceName}
                        </span>
                        <span className="text-stone-500 text-[10px]">
                          {nextAppointment.serviceDuration} mins
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Assigned Barber</span>
                        <span className="font-bold text-stone-900 block mt-0.5 truncate">
                          {nextAppointment.barberName}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Date & Time</span>
                        <span className="font-bold text-stone-900 block mt-0.5">
                          {nextAppointment.formattedDate || nextAppointment.date}
                        </span>
                        <span className="text-amber-700 font-bold text-[11px] block">
                          {nextAppointment.displayTime}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Total Price (INR)</span>
                        <span className="text-base font-extrabold font-serif-display text-stone-950 block mt-0.5 tabular-nums">
                          {formatINR(nextAppointment.totalPrice)}
                        </span>
                        <span className="text-[10px] text-stone-400">Pay at shop</span>
                      </div>
                    </div>

                    {nextAppointment.specialNotes && (
                      <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                        <strong className="text-stone-700">Special Notes:</strong> {nextAppointment.specialNotes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Guaranteed chair time. Walk in without waiting.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedAppointment(nextAppointment)}
                        className="py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => onNavigate('customer/bookings')}
                        className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white text-xs font-semibold transition-colors"
                      >
                        Reschedule / Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold font-serif-display text-stone-900">
                  No Upcoming Appointments Scheduled
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  You don't have any pending barber sessions right now. Browse top-rated salons nearby and reserve your preferred chair.
                </p>
              </div>
              <button
                onClick={() => onNavigate('explore')}
                className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <Scissors className="w-4 h-4 -rotate-45" />
                <span>Find a Barber Near Me</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Links & Service Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Explore Recommended Shops */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center">
                <Scissors className="w-5 h-5 -rotate-45 text-amber-600" />
              </div>
              <h3 className="text-base font-bold font-serif-display text-stone-900">
                Explore Premier Barber Shops
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Discover artisan barbershops in your neighborhood, view portfolio cuts, and compare transparent pricing in Indian Rupees.
              </p>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Browse All Salons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Update Profile & Styling Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-serif-display text-stone-900">
                Your Grooming Profile
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Update your contact information, phone number, and styling preferences so every booking is effortless and pre-filled.
              </p>
            </div>
            <button
              onClick={() => onNavigate('customer/profile')}
              className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span>Manage Profile Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">
                  Appointment Details
                </span>
                <h3 className="text-lg font-bold font-serif-display text-stone-900">
                  {selectedAppointment.shopName}
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-200">
                {selectedAppointment.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <span className="text-stone-400 block text-[11px]">Booking Reference</span>
                <span className="text-base font-bold font-mono text-stone-900">
                  {selectedAppointment.bookingRef}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Service</span>
                  <span className="font-bold text-stone-900">{selectedAppointment.serviceName}</span>
                  <span className="text-stone-500 block text-[11px]">
                    {selectedAppointment.serviceDuration} mins
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Barber</span>
                  <span className="font-bold text-stone-900">{selectedAppointment.barberName}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Date</span>
                  <span className="font-bold text-stone-900">
                    {selectedAppointment.formattedDate || selectedAppointment.date}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 block">Time Slot</span>
                  <span className="font-bold text-amber-700">{selectedAppointment.displayTime}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <span className="text-stone-400 block">Location</span>
                <p className="font-medium text-stone-800">{selectedAppointment.shopAddress}</p>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex justify-between items-center text-xs">
                <span className="font-semibold text-amber-900">Total Price Due at Shop</span>
                <span className="text-lg font-bold font-serif-display text-amber-950 tabular-nums">
                  {formatINR(selectedAppointment.totalPrice)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};
