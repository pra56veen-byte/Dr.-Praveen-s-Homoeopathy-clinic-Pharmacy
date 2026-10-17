-- =========================================================================
-- Dr. Praveen’s Homoeopathy Clinic & Pharmacy
-- Complete Supabase PostgreSQL Database Schema & Row-Level Security Policies
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. Categories Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_name TEXT DEFAULT 'Sparkles',
    display_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category listing
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories (display_order ASC);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories (is_active);

-- -------------------------------------------------------------------------
-- 2. Products Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    potency TEXT,
    pack_size TEXT NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL DEFAULT 0,
    selling_price NUMERIC(10, 2) NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    image_url TEXT,
    is_in_stock BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    is_sample BOOLEAN DEFAULT FALSE,
    description TEXT,
    manufacturer TEXT,
    ingredients TEXT,
    directions_for_use TEXT,
    warnings_and_storage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for search and filters
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products (brand);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products (is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products (is_in_stock);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products (selling_price ASC);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON public.products USING gin (name gin_trgm_ops);

-- -------------------------------------------------------------------------
-- 3. Store Settings Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    clinic_name TEXT NOT NULL DEFAULT 'Dr. Praveen’s Homoeopathy clinic & Pharmacy',
    tagline TEXT NOT NULL DEFAULT 'Treating the root Cause - Not just the symptoms',
    primary_whatsapp TEXT NOT NULL DEFAULT '919052523835',
    alternate_whatsapp TEXT NOT NULL DEFAULT '917732062291',
    primary_phone TEXT NOT NULL DEFAULT '+91 9052523835',
    email TEXT DEFAULT 'drpraveen.homoeopathy@gmail.com',
    address_line1 TEXT DEFAULT '120, 5th Cross, Kada Agrahara Main Rd',
    address_line2 TEXT DEFAULT 'Vinayaka Layout, Byappanahalli',
    city TEXT DEFAULT 'Bengaluru',
    state TEXT DEFAULT 'Karnataka',
    pincode TEXT DEFAULT '560049',
    clinic_hours TEXT DEFAULT 'Mon – Sat: 10:00 AM – 1:30 PM & 5:30 PM – 8:30 PM | Sunday: 10:00 AM – 1:00 PM',
    pharmacy_hours TEXT DEFAULT 'Mon – Sat: 9:30 AM – 9:00 PM | Sunday: 10:00 AM – 2:00 PM',
    announcement_banner TEXT,
    is_announcement_active BOOLEAN DEFAULT TRUE,
    hero_video_url TEXT,
    logo_url TEXT,
    doctor_photo_url TEXT,
    pharmacy_photo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. Appointment Enquiries Table
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointment_enquiries (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    consultation_type TEXT NOT NULL DEFAULT 'in_clinic',
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_created ON public.appointment_enquiries (created_at DESC);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_enquiries ENABLE ROW LEVEL SECURITY;

-- 1. Categories RLS
-- Anyone can view active categories
CREATE POLICY "Public read active categories"
    ON public.categories FOR SELECT
    USING (is_active = TRUE OR auth.role() = 'authenticated');

-- Authenticated admins can manage categories
CREATE POLICY "Admins full manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 2. Products RLS
-- Public visitors can read only published medicines
CREATE POLICY "Public read published products"
    ON public.products FOR SELECT
    USING (is_published = TRUE OR auth.role() = 'authenticated');

-- Authenticated admins can manage all products
CREATE POLICY "Admins full manage products"
    ON public.products FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 3. Store Settings RLS
-- Anyone can read public store settings
CREATE POLICY "Public read store settings"
    ON public.store_settings FOR SELECT
    USING (TRUE);

-- Authenticated admins can update store settings
CREATE POLICY "Admins update store settings"
    ON public.store_settings FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- 4. Appointment Enquiries RLS
-- Anyone can submit an appointment enquiry
CREATE POLICY "Public create appointment enquiries"
    ON public.appointment_enquiries FOR INSERT
    WITH CHECK (TRUE);

-- Only authenticated staff can view and update enquiries
CREATE POLICY "Admins view appointment enquiries"
    ON public.appointment_enquiries FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- =========================================================================
-- INITIAL SEED: 18 HOMOEOPATHIC CATEGORIES
-- =========================================================================

INSERT INTO public.categories (id, name, slug, description, icon_name, display_order, is_active)
VALUES
('cat-1', 'Homoeopathic Single Remedies', 'homoeopathic-single-remedies', 'Classical single remedies in decimal and centesimal potencies.', 'Sparkles', 1, TRUE),
('cat-2', 'Dilutions and Potencies', 'dilutions-and-potencies', 'Liquid homoeopathic dilutions from reputable manufacturers (6C, 30C, 200C, 1M).', 'FlaskConical', 2, TRUE),
('cat-3', 'Globules and Pills', 'globules-and-pills', 'Sugar of milk globules and pills medicated under sanitary standards.', 'CircleDot', 3, TRUE),
('cat-4', 'Homoeopathic Tablets', 'homoeopathic-tablets', 'Trituration tablets and compressed homoeopathic preparations.', 'Pill', 4, TRUE),
('cat-5', 'Mother Tinctures', 'mother-tinctures', 'Authentic botanical and mineral mother tinctures (Q).', 'Droplets', 5, TRUE),
('cat-6', 'Combination Preparations', 'combination-preparations', 'Clinically formulated homoeopathic combinations for specific symptomatic relief.', 'Layers', 6, TRUE),
('cat-7', 'Biochemic Tissue Salts', 'biochemic-tissue-salts', 'The 12 vital Schuessler biochemic tissue salts in 3X, 6X, 12X.', 'Hexagon', 7, TRUE),
('cat-8', 'Ointments, Gels and External Applications', 'ointments-gels-external', 'Topical homoeopathic creams, soothing ointments, and herbal gels.', 'ShieldCheck', 8, TRUE),
('cat-9', 'Drops, Syrups and Oral Preparations', 'drops-syrups-oral', 'Gentle homoeopathic syrups, oral drops, and pediatric tonics.', 'Wine', 9, TRUE),
('cat-10', 'Homoeopathic Healthcare Kits', 'homoeopathic-healthcare-kits', 'Travel kits, household first-aid remedy boxes, and family remedy collections.', 'BriefcaseMedical', 10, TRUE),
('cat-11', 'Skin Care and Personal Care', 'skin-care-personal-care', 'Herbal face washes, soaps, and nourishing creams.', 'Smile', 11, TRUE),
('cat-12', 'Hair Care and Scalp Care', 'hair-care-scalp-care', 'Arnica & Jaborandi hair oils, anti-dandruff shampoos, and scalp tonics.', 'Scissors', 12, TRUE),
('cat-13', 'Oral Care', 'oral-care', 'Plantago herbal toothpastes, tooth powders, and mouth rinses.', 'HeartPulse', 13, TRUE),
('cat-14', 'Personal Hygiene', 'personal-hygiene', 'Gentle antiseptic washes and personal hygiene essentials.', 'CheckCircle', 14, TRUE),
('cat-15', 'General Healthcare and First-Aid Supplies', 'first-aid-supplies', 'Sterile cotton, bandages, surgical tapes, and thermometers.', 'Cross', 15, TRUE),
('cat-16', 'Health Devices and Monitoring Equipment', 'health-devices-monitoring', 'Digital BP monitors, pulse oximeters, and nebulizers.', 'Activity', 16, TRUE),
('cat-17', 'Vitamins, Minerals and Nutritional Products', 'nutritional-products', 'Nutritional supplements and permitted dietary additions.', 'Apple', 17, TRUE),
('cat-18', 'Baby Care and Family Healthcare Essentials', 'baby-care-family-essentials', 'Gentle baby soaps, gripe waters, and family healthcare items.', 'Baby', 18, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Initial Store Settings
INSERT INTO public.store_settings (id, clinic_name, tagline, primary_whatsapp, alternate_whatsapp, primary_phone, address_line1, address_line2, city, state, pincode)
VALUES ('main', 'Dr. Praveen’s Homoeopathy clinic & Pharmacy', 'Treating the root Cause - Not just the symptoms', '919052523835', '917732062291', '+91 9052523835', '120, 5th Cross, Kada Agrahara Main Rd', 'Vinayaka Layout, Byappanahalli', 'Bengaluru', 'Karnataka', '560049')
ON CONFLICT (id) DO NOTHING;
