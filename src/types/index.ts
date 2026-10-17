export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  category_name?: string;
  potency?: string;
  pack_size: string;
  mrp: number;
  selling_price: number;
  discount_percentage: number;
  image_url: string;
  is_in_stock: boolean;
  is_featured: boolean;
  is_published: boolean;
  is_sample: boolean;
  description: string;
  manufacturer?: string;
  ingredients?: string;
  directions_for_use?: string;
  warnings_and_storage?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  brand: string;
  pack_size: string;
  potency?: string;
  selling_price: number;
  mrp: number;
  image_url: string;
  quantity: number;
  is_in_stock: boolean;
}

export interface StoreSettings {
  id?: string;
  clinic_name: string;
  tagline: string;
  primary_whatsapp: string;
  alternate_whatsapp: string;
  primary_phone: string;
  email: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  clinic_hours: string;
  pharmacy_hours: string;
  announcement_banner?: string;
  is_announcement_active: boolean;
  hero_video_url?: string;
  logo_url?: string;
  doctor_photo_url?: string;
  pharmacy_photo_url?: string;
  updated_at?: string;
}

export interface AppointmentEnquiry {
  id?: string;
  patient_name: string;
  phone: string;
  preferred_date: string;
  preferred_time_slot: string;
  consultation_type: 'in_clinic' | 'online';
  reason?: string;
  status?: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export type SortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'name_asc'
  | 'name_desc'
  | 'newest';

export interface ProductFilters {
  searchQuery?: string;
  categoryId?: string;
  brand?: string;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}
