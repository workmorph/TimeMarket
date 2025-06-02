// Package model for Supabase
export type TimeSlot = {
  duration: number; // minutes
  deliverable: string;
  price: number;
}

export type Package = {
  id?: string;
  seller_id: string;
  name: string;
  description?: string;
  package_type: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'CUSTOM';
  time_slots: TimeSlot[];
  total_price: number;
  discount_percentage: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Helper functions for package calculations
export const calculatePackagePrice = (timeSlots: TimeSlot[], discountPercentage: number = 0): number => {
  const individualTotal = timeSlots.reduce((sum, slot) => sum + slot.price, 0);
  return individualTotal * (1 - discountPercentage / 100);
};

export const createPackage = (packageData: Omit<Package, 'total_price' | 'id' | 'created_at' | 'updated_at'>): Package => {
  const totalPrice = calculatePackagePrice(packageData.time_slots, packageData.discount_percentage);
  
  return {
    ...packageData,
    total_price: totalPrice,
  };
};
