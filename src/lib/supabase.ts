import { createClient } from '@supabase/supabase-js';
import type { Appointment, BookedSlot, UserProfile } from '../types';

export const SUPABASE_PROJECT_ID = 'yxdkexatwqwudlgsvflv';
const DEFAULT_SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_KEY = 'sb_publishable_qqwOBh5cxEyGioi9RXO6jQ_lGXK82p8';

function resolveSupabaseUrl(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (
    !trimmed ||
    trimmed === 'MY_SUPABASE_URL' ||
    trimmed === 'VITE_SUPABASE_URL' ||
    trimmed.includes('gsomjkbcfxuqugzoiyrq')
  ) {
    return DEFAULT_SUPABASE_URL;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      new URL(trimmed);
      return trimmed;
    } catch {
      return DEFAULT_SUPABASE_URL;
    }
  }
  if (/^[a-z0-9-]+$/i.test(trimmed)) {
    return `https://${trimmed}.supabase.co`;
  }
  return DEFAULT_SUPABASE_URL;
}

function resolveSupabaseKey(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (
    !trimmed ||
    trimmed === 'MY_SUPABASE_ANON_KEY' ||
    trimmed === 'VITE_SUPABASE_ANON_KEY' ||
    trimmed === 'sb_publishable_9MzPPwaqC2s4WFxmfHV2_A_Fy4FbiwF'
  ) {
    return DEFAULT_SUPABASE_KEY;
  }
  return trimmed;
}

export const supabaseUrl = resolveSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const supabaseAnonKey = resolveSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  tableMissing?: boolean;
  errorMessage?: string | null;
}

/**
 * Syncs or upserts a customer profile to Supabase `customers` table.
 */
export async function saveCustomerToSupabase(user: UserProfile): Promise<{
  success: boolean;
  tableMissing?: boolean;
  error?: string;
}> {
  if (!user.id || !user.isLoggedIn) return { success: false };

  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferred_style: user.preferredStyle || null,
      preferred_beard: user.preferredBeard || null,
      preferred_shop_id: user.preferredShopId || null,
      notes: user.notes || null,
      member_since: user.memberSince || 'October 2026',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('customers')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      const isTableMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache');
      return {
        success: false,
        tableMissing: isTableMissing,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to sync customer with Supabase',
    };
  }
}

/**
 * Fetches all customer profiles from Supabase `customers` table.
 */
export async function fetchCustomersFromSupabase(): Promise<{
  customers: UserProfile[];
  tableMissing?: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      const isTableMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache');
      return {
        customers: [],
        tableMissing: isTableMissing,
        error: error.message,
      };
    }

    const customers: UserProfile[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name || '',
      email: row.email || '',
      phone: row.phone || '',
      isLoggedIn: false,
      preferredStyle: row.preferred_style || undefined,
      preferredBeard: row.preferred_beard || undefined,
      preferredShopId: row.preferred_shop_id || undefined,
      notes: row.notes || undefined,
      memberSince: row.member_since || 'October 2026',
    }));

    return { customers };
  } catch (err: any) {
    return {
      customers: [],
      error: err?.message || 'Failed to fetch customers from Supabase',
    };
  }
}

/**
 * Saves a new or updated appointment to Supabase `appointments` table.
 */
export async function saveAppointmentToSupabase(apt: Appointment): Promise<{
  success: boolean;
  tableMissing?: boolean;
  error?: string;
}> {
  try {
    const payload = {
      id: apt.id,
      booking_ref: apt.bookingRef,
      customer_id: apt.customerId || null,
      customer_name: apt.customerName,
      customer_email: apt.customerEmail,
      customer_phone: apt.customerPhone,
      shop_id: apt.shopId,
      shop_name: apt.shopName,
      shop_address: apt.shopAddress,
      shop_image: apt.shopImage,
      service_id: apt.serviceId,
      service_name: apt.serviceName,
      service_duration: apt.serviceDuration,
      service_price: apt.servicePrice,
      booking_fee: apt.bookingFee,
      total_price: apt.totalPrice,
      barber_id: apt.barberId,
      barber_name: apt.barberName,
      appointment_date: apt.date,
      formatted_date: apt.formattedDate,
      start_time: apt.startTime,
      end_time: apt.endTime,
      display_time: apt.displayTime,
      special_notes: apt.specialNotes || null,
      status: apt.status,
      created_at: apt.createdAt || new Date().toISOString(),
    };

    const { error } = await supabase
      .from('appointments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      const isTableMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache');
      return {
        success: false,
        tableMissing: isTableMissing,
        error: error.message,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to save appointment to Supabase',
    };
  }
}

/**
 * Fetches appointments from Supabase `appointments` table.
 */
export async function fetchAppointmentsFromSupabase(): Promise<{
  appointments: Appointment[];
  bookedSlots: BookedSlot[];
  tableMissing?: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      const isTableMissing =
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('relation') ||
        error.message?.includes('does not exist') ||
        error.message?.includes('schema cache');
      return {
        appointments: [],
        bookedSlots: [],
        tableMissing: isTableMissing,
        error: error.message,
      };
    }

    const appointments: Appointment[] = (data || []).map((row: any) => ({
      id: row.id,
      bookingRef: row.booking_ref,
      customerId: row.customer_id || undefined,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,
      shopId: row.shop_id,
      shopName: row.shop_name,
      shopAddress: row.shop_address,
      shopImage: row.shop_image,
      serviceId: row.service_id,
      serviceName: row.service_name,
      serviceDuration: Number(row.service_duration) || 30,
      servicePrice: Number(row.service_price) || 0,
      bookingFee: Number(row.booking_fee) || 0,
      totalPrice: Number(row.total_price) || 0,
      barberId: row.barber_id,
      barberName: row.barber_name,
      date: row.appointment_date,
      formattedDate: row.formatted_date || row.appointment_date,
      startTime: row.start_time,
      endTime: row.end_time,
      displayTime: row.display_time,
      specialNotes: row.special_notes || undefined,
      status: row.status || 'confirmed',
      createdAt: row.created_at,
    }));

    const bookedSlots: BookedSlot[] = appointments
      .filter((a) => a.status === 'confirmed')
      .map((a) => ({
        shopId: a.shopId,
        barberId: a.barberId,
        date: a.date,
        startTime: a.startTime,
        durationMinutes: a.serviceDuration,
      }));

    return { appointments, bookedSlots };
  } catch (err: any) {
    return {
      appointments: [],
      bookedSlots: [],
      error: err?.message || 'Failed to fetch appointments from Supabase',
    };
  }
}

export const SUPABASE_SQL_SCHEMA = `-- Run this SQL in your Supabase SQL Editor (Project: yxdkexatwqwudlgsvflv)
create table if not exists public.customers (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  preferred_style text,
  preferred_beard text,
  preferred_shop_id text,
  notes text,
  member_since text,
  updated_at timestamptz default now()
);

create table if not exists public.appointments (
  id text primary key,
  booking_ref text not null,
  customer_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shop_id text not null,
  shop_name text not null,
  shop_address text,
  shop_image text,
  service_id text not null,
  service_name text not null,
  service_duration integer default 30,
  service_price numeric default 0,
  booking_fee numeric default 0,
  total_price numeric default 0,
  barber_id text,
  barber_name text,
  appointment_date text not null,
  formatted_date text,
  start_time text not null,
  end_time text not null,
  display_time text,
  special_notes text,
  status text default 'confirmed',
  created_at timestamptz default now()
);

alter table public.customers enable row level security;
alter table public.appointments enable row level security;

create policy "Allow public read/write on customers" on public.customers
  for all using (true) with check (true);

create policy "Allow public read/write on appointments" on public.appointments
  for all using (true) with check (true);`;
