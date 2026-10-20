/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ShopDetailPage } from './pages/ShopDetailPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { CustomerBookingsPage } from './pages/CustomerBookingsPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ListYourShopPage } from './pages/ListYourShopPage';
import {
  DEMO_BARBERSHOPS,
  INITIAL_BOOKED_SLOTS,
  INITIAL_USER_APPOINTMENTS,
} from './data/barberShops';
import { BarberShop, Appointment, BookedSlot, UserProfile } from './types';
import { DEFAULT_DEMO_USERS } from './utils/authUtils';
import { formatFriendlyDate } from './utils/bookingEngine';

export default function App() {
  // Navigation view state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedShopId, setSelectedShopId] = useState<string | null>(null);

  // Search parameters passed between Home and Explore
  const [exploreLocality, setExploreLocality] = useState<string>('all');
  const [exploreQuery, setExploreQuery] = useState<string>('');

  // Target route to redirect to after successful authentication
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  // Barber shops dataset
  const [shops] = useState<BarberShop[]>(DEMO_BARBERSHOPS);

  // Registered users storage
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('trimly_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USERS;
    } catch {
      return DEFAULT_DEMO_USERS;
    }
  });

  // Persistent booked slots (localStorage)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>(() => {
    try {
      const saved = localStorage.getItem('trimly_booked_slots');
      return saved ? JSON.parse(saved) : INITIAL_BOOKED_SLOTS;
    } catch {
      return INITIAL_BOOKED_SLOTS;
    }
  });

  // Persistent customer appointments (localStorage)
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('trimly_user_appointments');
      return saved ? JSON.parse(saved) : INITIAL_USER_APPOINTMENTS;
    } catch {
      return INITIAL_USER_APPOINTMENTS;
    }
  });

  // Active customer profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('trimly_active_user');
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USERS[0];
    } catch {
      return DEFAULT_DEMO_USERS[0];
    }
  });

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingShopId, setBookingShopId] = useState<string | null>(null);
  const [bookingServiceName, setBookingServiceName] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('trimly_registered_users', JSON.stringify(registeredUsers));
    } catch (e) {
      console.warn('Could not save users to localStorage', e);
    }
  }, [registeredUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('trimly_booked_slots', JSON.stringify(bookedSlots));
    } catch (e) {
      console.warn('Could not save booked slots to localStorage', e);
    }
  }, [bookedSlots]);

  useEffect(() => {
    try {
      localStorage.setItem('trimly_user_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('Could not save appointments to localStorage', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('trimly_active_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save active user to localStorage', e);
    }
  }, [user]);

  // Route protection: redirect unauthenticated visitors attempting to view customer portal
  const handleNavigate = (view: string, shopId?: string) => {
    if (view === 'shop-detail' && shopId) {
      setSelectedShopId(shopId);
    }

    // Check protected customer routes
    const isCustomerRoute =
      view.startsWith('customer/') ||
      view === 'dashboard' ||
      view === 'bookings' ||
      view === 'profile';

    if (isCustomerRoute && !user.isLoggedIn) {
      // Normalize target
      const target = view === 'dashboard' ? 'customer/dashboard' : view;
      setRedirectAfterLogin(target);
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Normalize legacy view aliases
    if (view === 'dashboard') {
      setCurrentView('customer/dashboard');
    } else if (view === 'bookings') {
      setCurrentView('customer/bookings');
    } else if (view === 'profile') {
      setCurrentView('customer/profile');
    } else {
      setCurrentView(view);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (shopId?: string, serviceName?: string) => {
    setBookingShopId(shopId || null);
    setBookingServiceName(serviceName || null);
    setBookingModalOpen(true);
  };

  const handleAddBooking = (newAppointment: Appointment, newSlot: BookedSlot) => {
    // Associate with authenticated customer if logged in
    const aptWithCustomer = {
      ...newAppointment,
      customerId: user.isLoggedIn ? user.id : 'user-alex-1',
    };
    setAppointments((prev) => [aptWithCustomer, ...prev]);
    setBookedSlots((prev) => [...prev, newSlot]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
    );
  };

  const handleRescheduleAppointment = (
    id: string,
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    displayTime: string
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              date: newDate,
              formattedDate: formatFriendlyDate(newDate),
              startTime: newStartTime,
              endTime: newEndTime,
              displayTime,
              status: 'confirmed' as const,
            }
          : apt
      )
    );

    const targetApt = appointments.find((a) => a.id === id);
    if (targetApt) {
      setBookedSlots((prev) => [
        ...prev,
        {
          shopId: targetApt.shopId,
          barberId: targetApt.barberId,
          date: newDate,
          startTime: newStartTime,
          durationMinutes: targetApt.serviceDuration,
        },
      ]);
    }
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    setRegisteredUsers((prev) => [...prev, newUser]);
    setUser(newUser);
  };

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
  };

  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    setRegisteredUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    );
  };

  const handleLogout = () => {
    setUser({
      id: '',
      name: 'Guest',
      email: '',
      phone: '',
      isLoggedIn: false,
    });
    setRedirectAfterLogin(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const upcomingCount = appointments.filter(
    (a) =>
      a.status === 'confirmed' &&
      user.isLoggedIn &&
      (a.customerId === user.id ||
        (user.email && a.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
        (user.name && a.customerName?.toLowerCase() === user.name.toLowerCase()))
  ).length;

  const currentShopDetail = shops.find((s) => s.id === selectedShopId) || shops[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-200 selection:text-amber-950 font-sans">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setCurrentView('login')}
        onLogout={handleLogout}
        user={user}
        upcomingCount={upcomingCount}
      />

      {/* Main Dynamic View */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            shops={shops}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onSelectSearchLocality={(loc) => setExploreLocality(loc)}
            onSelectSearchQuery={(q) => setExploreQuery(q)}
          />
        )}

        {currentView === 'explore' && (
          <ExplorePage
            shops={shops}
            initialLocality={exploreLocality}
            initialQuery={exploreQuery}
            onViewShop={(shopId) => handleNavigate('shop-detail', shopId)}
            onBookNow={(shopId) => handleOpenBooking(shopId)}
          />
        )}

        {currentView === 'shop-detail' && (
          <ShopDetailPage
            shop={currentShopDetail}
            onBack={() => handleNavigate('explore')}
            onOpenBooking={(shopId, serviceName) => handleOpenBooking(shopId, serviceName)}
          />
        )}

        {/* Customer Portal Protected Routes */}
        {(currentView === 'customer/dashboard' || currentView === 'dashboard') && (
          <CustomerDashboardPage
            appointments={appointments}
            user={user}
            shops={shops}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onOpenBookingForShop={(shopId, serviceName) => handleOpenBooking(shopId, serviceName)}
            onCancelAppointment={handleCancelAppointment}
          />
        )}

        {currentView === 'customer/bookings' && (
          <CustomerBookingsPage
            appointments={appointments}
            user={user}
            shops={shops}
            bookedSlots={bookedSlots}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            onOpenBookingForShop={(shopId, serviceName) => handleOpenBooking(shopId, serviceName)}
          />
        )}

        {currentView === 'customer/profile' && (
          <CustomerProfilePage
            user={user}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            upcomingCount={upcomingCount}
          />
        )}

        {/* Authentication Pages */}
        {currentView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            registeredUsers={registeredUsers}
            redirectAfterLogin={redirectAfterLogin}
          />
        )}

        {currentView === 'signup' && (
          <SignupPage
            onNavigate={handleNavigate}
            onRegisterSuccess={handleRegisterUser}
            registeredUsers={registeredUsers}
            redirectAfterLogin={redirectAfterLogin}
          />
        )}

        {currentView === 'forgot-password' && (
          <ForgotPasswordPage onNavigate={handleNavigate} />
        )}

        {currentView === 'list-shop' && (
          <ListYourShopPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Booking Wizard Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        shops={shops}
        initialShopId={bookingShopId}
        initialServiceName={bookingServiceName}
        bookedSlots={bookedSlots}
        onAddBooking={handleAddBooking}
        user={user}
        onViewAppointments={() => handleNavigate('customer/bookings')}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        registeredUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
