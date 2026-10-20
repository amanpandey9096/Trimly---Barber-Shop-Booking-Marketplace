import type { UserProfile } from '../types/index.ts';

/**
 * Validates if an input string is a valid email address format
 */
export function isEmail(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(val.trim());
}

/**
 * Extracts digits from a phone number string
 */
export function extractDigits(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/\D/g, '');
}

/**
 * Validates if an input string is a valid phone number (min 7 digits, max 15 digits)
 */
export function isPhoneNumber(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const digits = extractDigits(val);
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Formats digits into standard (XXX) XXX-XXXX if 10 digits
 */
export function formatPhoneNumber(val: string): string {
  const digits = extractDigits(val);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return val.trim();
}

export type IdentifierType = 'email' | 'phone' | 'invalid';

export interface ValidationResult {
  isValid: boolean;
  type: IdentifierType;
  error?: string;
}

/**
 * Validates whether the login credential is a valid email or phone number
 */
export function validateLoginIdentifier(identifier: string): ValidationResult {
  const trimmed = identifier ? identifier.trim() : '';
  if (!trimmed) {
    return {
      isValid: false,
      type: 'invalid',
      error: 'Please enter your email address or phone number',
    };
  }

  if (isEmail(trimmed)) {
    return { isValid: true, type: 'email' };
  }

  if (isPhoneNumber(trimmed)) {
    return { isValid: true, type: 'phone' };
  }

  return {
    isValid: false,
    type: 'invalid',
    error: 'Must be a valid email (e.g. user@example.com) or phone number (e.g. 555-392-8172)',
  };
}

/**
 * Validates password strength (minimum 6 characters)
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: 'Password must be at least 6 characters long',
    };
  }
  return { isValid: true };
}

/**
 * Validates Profile Settings form input fields (Name, Email, Phone Number)
 */
export function validateProfileSettings(data: {
  name: string;
  email: string;
  phone: string;
}): {
  isValid: boolean;
  errors: { name?: string; email?: string; phone?: string };
} {
  const errors: { name?: string; email?: string; phone?: string } = {};

  if (!data.name || !data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Full name is required (minimum 2 characters)';
  }

  const emailRes = validateLoginIdentifier(data.email);
  if (!emailRes.isValid || emailRes.type !== 'email') {
    errors.email = 'Please provide a valid email address';
  }

  const phoneRes = validateLoginIdentifier(data.phone);
  if (!phoneRes.isValid || phoneRes.type !== 'phone') {
    errors.phone = 'Please provide a valid phone number (minimum 7-10 digits)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Registration form input fields
 */
export function validateRegistrationForm(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.name || !data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Full name is required (minimum 2 characters)';
  }

  const emailRes = validateLoginIdentifier(data.email);
  if (!emailRes.isValid || emailRes.type !== 'email') {
    errors.email = 'Please provide a valid email address';
  }

  const phoneRes = validateLoginIdentifier(data.phone);
  if (!phoneRes.isValid || phoneRes.type !== 'phone') {
    errors.phone = 'Please provide a valid phone number (minimum 7-10 digits)';
  }

  const passRes = validatePassword(data.password);
  if (!passRes.isValid) {
    errors.password = passRes.error || 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions to proceed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Finds user in collection matching either email (case-insensitive) or normalized phone number
 */
export function findUserByIdentifier(users: UserProfile[], identifier: string): UserProfile | undefined {
  const trimmed = identifier.trim().toLowerCase();
  const inputDigits = extractDigits(identifier);

  return users.find((user) => {
    // Check email match
    if (user.email.toLowerCase() === trimmed) {
      return true;
    }
    // Check phone match
    if (inputDigits && inputDigits.length >= 7) {
      const userPhoneDigits = extractDigits(user.phone);
      if (
        userPhoneDigits === inputDigits ||
        userPhoneDigits.endsWith(inputDigits) ||
        inputDigits.endsWith(userPhoneDigits)
      ) {
        return true;
      }
    }
    return false;
  });
}

/**
 * Pre-seeded demonstration user accounts
 */
export const DEFAULT_DEMO_USERS: UserProfile[] = [
  {
    id: 'user-alex-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+91 98765 43210',
    password: 'password123',
    isLoggedIn: true,
    preferredStyle: 'Low Skin Taper Fade & Textured Top',
    preferredBeard: 'Sculpted Short Beard with Razor Cheek Line',
    preferredShopId: 'noble-blade',
    notes: 'Sensitive skin around neckline, prefers cooling tea tree toner.',
    memberSince: 'September 2026',
  },
  {
    id: 'user-marcus-2',
    name: 'Marcus Sterling',
    email: 'marcus.s@example.com',
    phone: '+91 91234 56789',
    password: 'password123',
    isLoggedIn: false,
    preferredStyle: 'Classic Pompadour with Razor Hard Part',
    preferredBeard: 'Clean Shaven with Hot Towel Finish',
    preferredShopId: 'crown-razor',
    notes: 'Prefers quiet sessions with matte finish clay.',
    memberSince: 'August 2026',
  },
];

