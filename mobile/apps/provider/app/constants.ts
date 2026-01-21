/**
 * Provider App Constants - Re-exports and extensions from core package
 * This file makes imports easier with '../constants' path
 */

export {
  VEHICLE_TYPES,
  SERVICE_TYPES,
  PRICING_CONFIG,
  SERVICE_STATUS,
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_DISCOUNTS,
  LANGUAGES,
  calculateServicePrice,
  getServiceTypeLabel,
  getVehicleTypeLabel,
} from '@vehic-aid/core';

import {
  SERVICE_TYPE_LABELS as CoreServiceLabels,
  VEHICLE_TYPE_LABELS as CoreVehicleLabels,
} from '@vehic-aid/core';

// Create simplified string-based exports for easier use in screens
export const SERVICE_TYPE_LABELS: Record<string, string> = Object.entries(CoreServiceLabels).reduce(
  (acc, [key, val]: [string, any]) => ({
    ...acc,
    [key]: (val as any).emoji + ' ' + (val as any).name,
  }),
  {}
);

export const VEHICLE_TYPE_LABELS: Record<string, string> = Object.entries(CoreVehicleLabels).reduce(
  (acc, [key, val]: [string, any]) => ({
    ...acc,
    [key]: (val as any).emoji + ' ' + (val as any).name,
  }),
  {}
);
