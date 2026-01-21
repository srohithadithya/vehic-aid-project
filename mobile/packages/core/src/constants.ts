/**
 * VehicAid Complete Service & Vehicle Type Constants
 * All 7 service types and 6 vehicle types from backend specification
 * Used across Booker and Provider mobile apps
 */

// 6 Vehicle Types
export const VEHICLE_TYPES = {
  TWO_WHEELER: 'TWO_WHEELER',
  THREE_WHEELER: 'THREE_WHEELER',
  FOUR_WHEELER: 'FOUR_WHEELER',
  SUV: 'SUV',
  VAN: 'VAN',
  TRUCK: 'TRUCK',
};

// 7 Service Types - Complete List (Updated to match backend spec)
export const SERVICE_TYPES = {
  TOWING: 'TOWING',
  FLATBED_TOWING: 'FLATBED_TOWING',     // New: For damaged vehicles
  MECHANIC: 'MECHANIC',
  FUEL_DELIVERY: 'FUEL_DELIVERY',
  BATTERY_JUMP: 'BATTERY_JUMP',
  LOCKOUT: 'LOCKOUT',
  FLAT_TIRE: 'FLAT_TIRE',
};

// Service Type Details - Human readable labels
export const SERVICE_TYPE_LABELS: Record<string, { 
  emoji: string; 
  name: string; 
  description: string;
  category: string;
}> = {
  TOWING: { emoji: '🚗', name: 'Towing', description: 'Basic towing service', category: 'Recovery' },
  FLATBED_TOWING: { emoji: '🚚', name: 'Flatbed Towing', description: 'For damaged vehicles', category: 'Recovery' },
  MECHANIC: { emoji: '🔧', name: 'Mechanic', description: 'On-site mechanical repair', category: 'Repair' },
  FUEL_DELIVERY: { emoji: '⛽', name: 'Fuel Delivery', description: 'Emergency fuel delivery', category: 'Fuel' },
  BATTERY_JUMP: { emoji: '🔋', name: 'Battery Jump', description: 'Jumpstart service', category: 'Electrical' },
  LOCKOUT: { emoji: '🔐', name: 'Lockout', description: 'Vehicle lockout assistance', category: 'Access' },
  FLAT_TIRE: { emoji: '🛞', name: 'Flat Tire', description: 'Tire repair/replacement', category: 'Tire' },
};

// Vehicle Type Details - Human readable labels
export const VEHICLE_TYPE_LABELS: Record<string, { 
  emoji: string; 
  name: string; 
  description: string;
  marketShare: string;
}> = {
  TWO_WHEELER: { emoji: '🏍️', name: 'Two Wheeler', description: 'Bike/Scooter', marketShare: 'High volume, urban' },
  THREE_WHEELER: { emoji: '🛺', name: 'Three Wheeler', description: 'Auto Rickshaw', marketShare: 'Commercial urban' },
  FOUR_WHEELER: { emoji: '🚗', name: 'Four Wheeler', description: 'Car/Sedan', marketShare: 'Standard sedan' },
  SUV: { emoji: '🚙', name: 'SUV', description: 'Sport Utility Vehicle', marketShare: 'Premium segment' },
  VAN: { emoji: '🚐', name: 'Van', description: 'Minivan/Cargo', marketShare: 'Commercial use' },
  TRUCK: { emoji: '🚛', name: 'Truck', description: 'Light/Medium Commercial', marketShare: 'Heavy commercial' },
};

// Dynamic Pricing Matrix: Vehicle Type × Service Type
// Formula: Base Price + (Distance - Included KM) × Per KM Rate + 18% Tax
export const PRICING_CONFIG: Record<string, Record<string, { 
  base: number; 
  perKm: number; 
  includedKm: number;
}>> = {
  TWO_WHEELER: {
    TOWING: { base: 199, perKm: 20, includedKm: 5 },
    FLATBED_TOWING: { base: 349, perKm: 25, includedKm: 5 },
    MECHANIC: { base: 99, perKm: 15, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 15, includedKm: 5 },
    BATTERY_JUMP: { base: 149, perKm: 15, includedKm: 5 },
    LOCKOUT: { base: 149, perKm: 15, includedKm: 5 },
    FLAT_TIRE: { base: 99, perKm: 15, includedKm: 5 },
  },
  THREE_WHEELER: {
    TOWING: { base: 249, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 449, perKm: 30, includedKm: 5 },
    MECHANIC: { base: 149, perKm: 20, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 199, perKm: 20, includedKm: 5 },
    LOCKOUT: { base: 199, perKm: 20, includedKm: 5 },
    FLAT_TIRE: { base: 199, perKm: 20, includedKm: 5 },
  },
  FOUR_WHEELER: {
    TOWING: { base: 249, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 449, perKm: 35, includedKm: 5 },
    MECHANIC: { base: 349, perKm: 25, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 249, perKm: 25, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 25, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 25, includedKm: 5 },
  },
  SUV: {
    TOWING: { base: 299, perKm: 25, includedKm: 5 },
    FLATBED_TOWING: { base: 499, perKm: 40, includedKm: 5 },
    MECHANIC: { base: 349, perKm: 30, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 249, perKm: 30, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 30, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 30, includedKm: 5 },
  },
  VAN: {
    TOWING: { base: 349, perKm: 30, includedKm: 5 },
    FLATBED_TOWING: { base: 499, perKm: 45, includedKm: 5 },
    MECHANIC: { base: 399, perKm: 40, includedKm: 5 },
    FUEL_DELIVERY: { base: 49, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 299, perKm: 35, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 35, includedKm: 5 },
    FLAT_TIRE: { base: 249, perKm: 35, includedKm: 5 },
  },
  TRUCK: {
    TOWING: { base: 499, perKm: 40, includedKm: 5 },
    FLATBED_TOWING: { base: 699, perKm: 50, includedKm: 5 },
    MECHANIC: { base: 399, perKm: 40, includedKm: 5 },
    FUEL_DELIVERY: { base: 69, perKm: 20, includedKm: 5 },
    BATTERY_JUMP: { base: 349, perKm: 40, includedKm: 5 },
    LOCKOUT: { base: 299, perKm: 40, includedKm: 5 },
    FLAT_TIRE: { base: 299, perKm: 40, includedKm: 5 },
  },
};

export const SERVICE_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
};

export const SUBSCRIPTION_PLANS = {
  FREE: 'FREE',
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  ELITE: 'ELITE',
};

export const SUBSCRIPTION_DISCOUNTS: Record<string, number> = {
  FREE: 0,        // 0% discount
  BASIC: 10,      // 10% discount
  PREMIUM: 25,    // 25% discount
  ELITE: 50,      // 50% discount
};

export const LANGUAGES = {
  EN: 'en',
  HI: 'hi',
  TE: 'te',
};

// ============== HELPER FUNCTIONS ==============

/**
 * Calculate final service price with all factors
 * Formula: Base + (Distance - Included KM) × Per KM + 18% Tax - Subscription Discount
 */
export function calculateServicePrice(
  vehicleType: string,
  serviceType: string,
  distanceKm: number = 5,
  subscription: string = 'FREE'
): number {
  const config = PRICING_CONFIG[vehicleType]?.[serviceType];
  if (!config) return 0;

  const basePrice = config.base;
  const chargeableDistance = Math.max(0, distanceKm - config.includedKm);
  const distanceCharge = chargeableDistance * config.perKm;
  const subtotal = basePrice + distanceCharge;
  
  // Apply subscription discount
  const discountPercent = SUBSCRIPTION_DISCOUNTS[subscription] || 0;
  const afterDiscount = subtotal * (1 - discountPercent / 100);
  
  // Apply 18% tax
  const tax = (afterDiscount * 18) / 100;
  return Math.round(afterDiscount + tax);
}

/**
 * Get service type label and details
 */
export function getServiceTypeLabel(serviceTypeId: string): typeof SERVICE_TYPE_LABELS[keyof typeof SERVICE_TYPE_LABELS] | null {
  return SERVICE_TYPE_LABELS[serviceTypeId as keyof typeof SERVICE_TYPE_LABELS] || null;
}

/**
 * Get vehicle type label and details
 */
export function getVehicleTypeLabel(vehicleTypeId: string): typeof VEHICLE_TYPE_LABELS[keyof typeof VEHICLE_TYPE_LABELS] | null {
  return VEHICLE_TYPE_LABELS[vehicleTypeId as keyof typeof VEHICLE_TYPE_LABELS] || null;
}

/**
 * Get all vehicle type IDs
 */
export function getVehicleTypeIds(): string[] {
  return Object.values(VEHICLE_TYPES);
}

/**
 * Get all service type IDs
 */
export function getServiceTypeIds(): string[] {
  return Object.values(SERVICE_TYPES);
}
