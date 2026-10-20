/**
 * Type definitions for Trimly Barber Shop Booking Platform
 */

export interface Barber {
  id: string;
  name: string;
  role: string;
  avatar: string;
  experienceYears: number;
  rating: number;
  specialty: string;
}

export interface Service {
  id: string;
  name: string;
  category: 'Hair' | 'Beard & Shave' | 'Combos' | 'Treatments';
  durationMinutes: number;
  price: number;
  description: string;
  popular?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  serviceTaken: string;
  barberName: string;
}

export interface BarberShop {
  id: string;
  name: string;
  tagline: string;
  locality: string;
  city: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  priceLevel: '₹' | '₹₹' | '₹₹₹' | '$' | '$$' | '$$$';
  startingPrice: number;
  coverImage: string;
  gallery: string[];
  description: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  amenities: string[];
  barbers: Barber[];
  services: Service[];
  reviews: Review[];
  nextAvailableSlot: string;
  featured?: boolean;
}

export interface BookedSlot {
  shopId: string;
  barberId: string; // or 'any'
  date: string; // YYYY-MM-DD
  startTime: string; // "14:30"
  durationMinutes: number;
}

export interface Appointment {
  id: string;
  bookingRef: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopImage: string;
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  bookingFee: number;
  totalPrice: number;
  barberId: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  startTime: string; // "14:30"
  endTime: string; // "15:15"
  displayTime: string; // "2:30 PM – 3:15 PM"
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialNotes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
  preferredStyle?: string;
  preferredBeard?: string;
  preferredShopId?: string;
  notes?: string;
  memberSince?: string;
}

