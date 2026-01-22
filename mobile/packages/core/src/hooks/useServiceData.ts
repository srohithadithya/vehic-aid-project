import { useState, useEffect } from 'react';
import { serviceDataEndpoints } from '@vehic-aid/api';

/**
 * Hook to fetch service types, vehicle types, and pricing from backend
 * Replaces hardcoded data with backend-driven configuration
 */

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  icon?: string;
  basePrice: number;
  distanceCharge: number;
  maxDistance: number;
}

export interface VehicleType {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface PricingRule {
  serviceType: string;
  vehicleType: string;
  basePrice: number;
  distanceCharge: number;
  minPrice: number;
  maxPrice: number;
}

export const useServiceData = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [servicesRes, vehiclesRes, pricingRes] = await Promise.all([
        serviceDataEndpoints.getServiceTypes().catch(() => []),
        serviceDataEndpoints.getVehicleTypes().catch(() => []),
        serviceDataEndpoints.getPricingRules().catch(() => []),
      ]);

      setServiceTypes(servicesRes || []);
      setVehicleTypes(vehiclesRes || []);
      setPricingRules(pricingRes || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch service data';
      setError(errorMessage);
      console.error('Error fetching service data:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get pricing for a specific service and vehicle combination
   */
  const getPrice = (serviceType: string, vehicleType: string, distance: number = 0): number => {
    const rule = pricingRules.find(
      r => r.serviceType === serviceType && r.vehicleType === vehicleType
    );

    if (!rule) {
      return 0;
    }

    const basePrice = rule.basePrice;
    const distancePrice = Math.max(0, distance - 5) * (rule.distanceCharge / 1000); // First 5km free
    const totalPrice = basePrice + distancePrice;

    return Math.max(rule.minPrice, Math.min(rule.maxPrice, totalPrice));
  };

  /**
   * Get a specific service type details
   */
  const getServiceType = (serviceId: string): ServiceType | undefined => {
    return serviceTypes.find(s => s.id === serviceId);
  };

  /**
   * Get a specific vehicle type details
   */
  const getVehicleType = (vehicleId: string): VehicleType | undefined => {
    return vehicleTypes.find(v => v.id === vehicleId);
  };

  return {
    serviceTypes,
    vehicleTypes,
    pricingRules,
    loading,
    error,
    getPrice,
    getServiceType,
    getVehicleType,
    refetch: fetchAllData,
  };
};

export default useServiceData;
