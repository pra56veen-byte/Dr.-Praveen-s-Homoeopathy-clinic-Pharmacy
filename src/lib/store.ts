'use client';

import { Category, Product, ProductFilters, StoreSettings, AppointmentEnquiry } from '@/types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'drp_products_v1',
  CATEGORIES: 'drp_categories_v1',
  SETTINGS: 'drp_settings_v1',
  APPOINTMENTS: 'drp_appointments_v1',
};

// --- In-Memory / Local Storage Helpers ---

function getLocalData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Dispatch custom event for real-time tab updates
    window.dispatchEvent(new Event('drp_store_updated'));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// --- Categories ---

export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase categories fetch failed, falling back to local store', e);
    }
  }

  const local = getLocalData<Category[]>(STORAGE_KEYS.CATEGORIES, []);
  if (local.length > 0) return local;

  if (typeof window !== 'undefined') {
    setLocalData(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }
  return INITIAL_CATEGORIES;
}

export async function saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
  const categories = await getCategories();
  const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const now = new Date().toISOString();

  let savedCategory: Category;

  if (category.id) {
    savedCategory = {
      ...categories.find(c => c.id === category.id)!,
      ...category,
      slug,
      updated_at: now,
    };
  } else {
    savedCategory = {
      id: `cat-${Date.now()}`,
      name: category.name,
      slug,
      description: category.description || '',
      icon_name: category.icon_name || 'Sparkles',
      display_order: category.display_order ?? categories.length + 1,
      is_active: category.is_active ?? true,
      created_at: now,
      updated_at: now,
    };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('categories').upsert(savedCategory);
    } catch (e) {
      console.error('Supabase saveCategory error:', e);
    }
  }

  const updatedList = category.id
    ? categories.map(c => (c.id === category.id ? savedCategory : c))
    : [...categories, savedCategory];

  setLocalData(STORAGE_KEYS.CATEGORIES, updatedList);
  return savedCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteCategory error:', e);
    }
  }

  const categories = await getCategories();
  const filtered = categories.filter(c => c.id !== id);
  setLocalData(STORAGE_KEYS.CATEGORIES, filtered);
  return true;
}

// --- Products ---

export async function getProducts(filters?: ProductFilters): Promise<{
  products: Product[];
  total: number;
}> {
  let list: Product[] = [];

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters?.brand) {
        query = query.ilike('brand', `%${filters.brand}%`);
      }
      if (filters?.inStockOnly) {
        query = query.eq('is_in_stock', true);
      }
      if (filters?.featuredOnly) {
        query = query.eq('is_featured', true);
      }
      if (filters?.searchQuery) {
        query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,brand.ilike.%${filters.searchQuery}%`);
      }

      if (filters?.sortBy === 'price_asc') query = query.order('selling_price', { ascending: true });
      else if (filters?.sortBy === 'price_desc') query = query.order('selling_price', { ascending: false });
      else if (filters?.sortBy === 'name_asc') query = query.order('name', { ascending: true });
      else if (filters?.sortBy === 'name_desc') query = query.order('name', { ascending: false });
      else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        return { products: data, total: count ?? data.length };
      }
    } catch (e) {
      console.warn('Supabase getProducts failed, using local store', e);
    }
  }

  // Fallback to local
  const local = getLocalData<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (local.length > 0) {
    list = local;
  } else {
    list = INITIAL_PRODUCTS;
    if (typeof window !== 'undefined') {
      setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    }
  }

  // Apply filters in memory
  let filtered = [...list];

  if (filters?.searchQuery && filters.searchQuery.trim().length > 0) {
    const q = filters.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.potency && p.potency.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q)
    );
  }

  if (filters?.categoryId && filters.categoryId !== 'all') {
    filtered = filtered.filter(p => p.category_id === filters.categoryId);
  }

  if (filters?.brand && filters.brand !== 'all') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === filters.brand?.toLowerCase());
  }

  if (filters?.inStockOnly) {
    filtered = filtered.filter(p => p.is_in_stock);
  }

  if (filters?.featuredOnly) {
    filtered = filtered.filter(p => p.is_featured);
  }

  // Sorting
  if (filters?.sortBy === 'price_asc') {
    filtered.sort((a, b) => a.selling_price - b.selling_price);
  } else if (filters?.sortBy === 'price_desc') {
    filtered.sort((a, b) => b.selling_price - a.selling_price);
  } else if (filters?.sortBy === 'name_asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters?.sortBy === 'name_desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // default featured first
    filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  const total = filtered.length;

  if (filters?.page && filters.limit) {
    const start = (filters.page - 1) * filters.limit;
    filtered = filtered.slice(start, start + filters.limit);
  }

  return { products: filtered, total };
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getProductById failed, using local fallback', e);
    }
  }

  const { products } = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; selling_price: number; mrp: number }): Promise<Product> {
  const { products } = await getProducts();
  const now = new Date().toISOString();

  const mrp = Number(product.mrp);
  const selling_price = Number(product.selling_price);
  const discount_percentage = mrp > selling_price ? Math.round(((mrp - selling_price) / mrp) * 100) : 0;

  let savedProduct: Product;

  if (product.id) {
    const existing = products.find(p => p.id === product.id);
    savedProduct = {
      ...(existing || INITIAL_PRODUCTS[0]),
      ...product,
      mrp,
      selling_price,
      discount_percentage,
      updated_at: now,
    };
  } else {
    savedProduct = {
      id: `prod-${Date.now()}`,
      name: product.name,
      brand: product.brand || 'Dr. Praveen’s Homoeopathy',
      category_id: product.category_id || 'cat-1',
      category_name: product.category_name || 'Homoeopathic Remedies',
      potency: product.potency || '',
      pack_size: product.pack_size || 'Standard Pack',
      mrp,
      selling_price,
      discount_percentage,
      image_url: product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      is_in_stock: product.is_in_stock ?? true,
      is_featured: product.is_featured ?? false,
      is_published: product.is_published ?? true,
      is_sample: product.is_sample ?? false,
      description: product.description || 'Verified homoeopathic preparation available at Dr. Praveen’s Pharmacy.',
      manufacturer: product.manufacturer || '',
      ingredients: product.ingredients || '',
      directions_for_use: product.directions_for_use || '',
      warnings_and_storage: product.warnings_and_storage || 'Store in a cool, dry place away from sunlight and strong odors.',
      created_at: now,
      updated_at: now,
    };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('products').upsert(savedProduct);
    } catch (e) {
      console.error('Supabase saveProduct error:', e);
    }
  }

  const updatedList = product.id
    ? products.map(p => (p.id === product.id ? savedProduct : p))
    : [savedProduct, ...products];

  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);
  return savedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase deleteProduct error:', e);
    }
  }

  const { products } = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  setLocalData(STORAGE_KEYS.PRODUCTS, filtered);
  return true;
}

// --- Store Settings ---

export async function getStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').limit(1).single();
      if (!error && data) return data;
    } catch (e) {
      console.warn('Supabase getStoreSettings failed, using local fallback', e);
    }
  }

  const local = getLocalData<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_STORE_SETTINGS);
  return local;
}

export async function saveStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getStoreSettings();
  const updated: StoreSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('store_settings').upsert({ id: 'main', ...updated });
    } catch (e) {
      console.error('Supabase saveStoreSettings error:', e);
    }
  }

  setLocalData(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

// --- Appointment Enquiries ---

export async function saveAppointmentEnquiry(enquiry: Omit<AppointmentEnquiry, 'id' | 'created_at' | 'status'>): Promise<AppointmentEnquiry> {
  const now = new Date().toISOString();
  const newRecord: AppointmentEnquiry = {
    ...enquiry,
    id: `apt-${Date.now()}`,
    status: 'pending',
    created_at: now,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('appointment_enquiries').insert(newRecord);
    } catch (e) {
      console.error('Supabase saveAppointmentEnquiry error:', e);
    }
  }

  const list = getLocalData<AppointmentEnquiry[]>(STORAGE_KEYS.APPOINTMENTS, []);
  setLocalData(STORAGE_KEYS.APPOINTMENTS, [newRecord, ...list]);
  return newRecord;
}
