export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateUsername(username: string): boolean {
  // Username: 3-20 characters, alphanumeric + underscore
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

export function validateVehicleRegistration(registration: string): boolean {
  // Indian vehicle registration format
  const registrationRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/;
  return registrationRegex.test(registration.toUpperCase());
}

export function validatePinCode(pinCode: string): boolean {
  // Indian PIN code: 6 digits
  return /^[0-9]{6}$/.test(pinCode);
}

export function validateAddress(address: string): boolean {
  return address.trim().length >= 5 && address.trim().length <= 200;
}
