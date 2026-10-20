import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isEmail,
  isPhoneNumber,
  extractDigits,
  formatPhoneNumber,
  validateLoginIdentifier,
  validatePassword,
  validateProfileSettings,
  findUserByIdentifier,
  DEFAULT_DEMO_USERS,
} from './authUtils.ts';

test('isEmail validates correctly', () => {
  assert.equal(isEmail('alex.morgan@example.com'), true);
  assert.equal(isEmail('user@trimly.co'), true);
  assert.equal(isEmail('invalid-email'), false);
  assert.equal(isEmail('user@'), false);
  assert.equal(isEmail(''), false);
});

test('isPhoneNumber validates various phone number formats', () => {
  assert.equal(isPhoneNumber('(555) 392-8172'), true);
  assert.equal(isPhoneNumber('5553928172'), true);
  assert.equal(isPhoneNumber('+1-555-392-8172'), true);
  assert.equal(isPhoneNumber('555.392.8172'), true);
  assert.equal(isPhoneNumber('123'), false); // too short
  assert.equal(isPhoneNumber('abc-def-ghij'), false);
});

test('extractDigits strips non-numeric characters', () => {
  assert.equal(extractDigits('(555) 392-8172'), '5553928172');
  assert.equal(extractDigits('+1 (800) 555-0199'), '18005550199');
});

test('formatPhoneNumber formats 10-digit number to standard display', () => {
  assert.equal(formatPhoneNumber('5553928172'), '(555) 392-8172');
});

test('validateLoginIdentifier identifies email vs phone or invalid', () => {
  const emailRes = validateLoginIdentifier('alex@example.com');
  assert.equal(emailRes.isValid, true);
  assert.equal(emailRes.type, 'email');

  const phoneRes = validateLoginIdentifier('(555) 392-8172');
  assert.equal(phoneRes.isValid, true);
  assert.equal(phoneRes.type, 'phone');

  const invalidRes = validateLoginIdentifier('just-a-name');
  assert.equal(invalidRes.isValid, false);
  assert.equal(invalidRes.type, 'invalid');
  assert.ok(invalidRes.error);
});

test('validatePassword requires minimum 6 characters', () => {
  assert.equal(validatePassword('12345').isValid, false);
  assert.equal(validatePassword('123456').isValid, true);
  assert.equal(validatePassword('trimlyDemo123').isValid, true);
});

test('validateProfileSettings validates name, email, and phone correctly', () => {
  const valid = validateProfileSettings({
    name: 'Julian Vance',
    email: 'julian@example.com',
    phone: '(555) 392-8172',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  const invalid = validateProfileSettings({
    name: ' ',
    email: 'bad-email',
    phone: '123',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.phone);
});

test('findUserByIdentifier locates user by email OR by phone number', () => {
  // Find by email
  const userByEmail = findUserByIdentifier(DEFAULT_DEMO_USERS, 'alex.morgan@example.com');
  assert.equal(userByEmail?.name, 'Alex Morgan');

  // Find by formatted phone
  const userByPhone = findUserByIdentifier(DEFAULT_DEMO_USERS, '+91 98765 43210');
  assert.equal(userByPhone?.name, 'Alex Morgan');

  // Find by raw unformatted digits
  const userByRawDigits = findUserByIdentifier(DEFAULT_DEMO_USERS, '9876543210');
  assert.equal(userByRawDigits?.name, 'Alex Morgan');

  // Find Marcus by email
  const marcusByEmail = findUserByIdentifier(DEFAULT_DEMO_USERS, 'marcus.s@example.com');
  assert.equal(marcusByEmail?.name, 'Marcus Sterling');

  // Find Marcus by phone
  const marcusByPhone = findUserByIdentifier(DEFAULT_DEMO_USERS, '9123456789');
  assert.equal(marcusByPhone?.name, 'Marcus Sterling');

  // Not found
  const notFound = findUserByIdentifier(DEFAULT_DEMO_USERS, 'nobody@example.com');
  assert.equal(notFound, undefined);
});

