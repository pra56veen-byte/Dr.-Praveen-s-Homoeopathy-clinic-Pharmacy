# Dr. Praveen’s Homoeopathy Clinic & Pharmacy — Complete Web Application

> **Website Name:** Dr. Praveen’s Homoeopathy clinic & Pharmacy  
> **Tagline:** Treating the root Cause - Not just the symptoms  
> **Location:** 120, 5th Cross, Kada Agrahara Main Rd, Vinayaka Layout, Byappanahalli, Bengaluru, Karnataka 560049  
> **Primary WhatsApp:** +91 9052523835 (919052523835)  
> **Alternate WhatsApp:** +91 7732062291 (917732062291)  

---

## 1. Project Overview

This is a production-ready, full-stack Next.js web application built specifically for **Dr. Praveen’s Homoeopathy Clinic & Pharmacy** in Bengaluru, Karnataka. It delivers an end-to-end pharmacy browsing, search, and dynamic WhatsApp order enquiry workflow, coupled with doctor appointment requests and a password-protected administrative dashboard for catalogue, category, and store settings management.

### Key Features

1. **Light-Theme Healthcare & Pharmacy Aesthetic**:
   - Primary Blue: `#1760CB`
   - Light Green: `#8BCB42`
   - Pure White: `#FFFFFF`
   - Light neutral slate backgrounds and charcoal text for optimal readability.
   - Distinctive placeholders for official clinic logo, doctor photograph, pharmacy images, and hero video.

2. **Catalogue & Medicines Page (`/products`)**:
   - Real-time search by remedy name, potency, brand (SBL, Dr. Reckeweg, Schwabe, Baksons), or description.
   - Comprehensive categorization across the **18 standard homoeopathic and healthcare categories**.
   - Multi-parameter filtering: Category, Brand, In-Stock Only, Featured Only.
   - Sorting: Featured First, Price Low-to-High, Price High-to-Low, Name A-to-Z, Name Z-to-A.
   - Pagination with responsive "Load More" controls.

3. **Product Details Page (`/products/[id]`)**:
   - Verified MRP, selling price, and accurately calculated discount percentage.
   - Potency / strength / pack size specifications.
   - Manufacturer information and composition/ingredients where verified.
   - Approved directions for use and storage instructions (away from sunlight, camphor, and strong odors).
   - "Add to Cart" and instant "Enquire Now on WhatsApp" single-item enquiry.
   - Related remedies carousel.

4. **Persistent Shopping Cart & Dynamic WhatsApp Ordering (`/cart`)**:
   - Customer cart persists across browser refreshes via `localStorage`.
   - Prices and availability automatically revalidated against the latest store catalogue.
   - Two-column desktop layout with left-hand items list and right-hand order summary.
   - Mandatory customer name validation with optional delivery locality.
   - Click-to-chat WhatsApp link (`https://wa.me/<number>?text=<encoded_message>`) generating the **exact format specified in Section 8**:
     ```
     Hello, Dr. Praveen’s Homoeopathy clinic & Pharmacy,

     My name is [Customer Name].

     My locality/delivery area is: [Customer Locality, if provided].

     I would like to enquire about the availability of the following products:

     1. [Product Name] (Potency/Pack Size)
        Quantity: [Quantity]
        Unit Price: ₹[Unit Price]
        Amount: ₹[Line Total]

     2. ...

     Subtotal: ₹[Subtotal]
     Discount: ₹[Applicable Discount]
     Estimated Total: ₹[Final Total]

     Are these products available? Please let me know as soon as possible.

     Thank you.
     ```
   - WhatsApp number switcher (Primary: `+91 9052523835` vs Alternate: `+91 7732062291`).
   - Working "Call Pharmacy" direct telephone hotline (`tel:+919052523835`).

5. **Doctor Appointment Enquiry (`/appointment`)**:
   - Consultation type selector: In-Clinic (Bengaluru) or Online Video Consultation.
   - Patient name, contact number, preferred date, and preferred time slot.
   - Generates encoded WhatsApp consultation booking message.
   - Stores enquiry in the database.

6. **Secure Administrator Dashboard (`/admin`)**:
   - Protected routes with authentication checks.
   - Overview metrics: Total products, In-stock, Out-of-stock, Featured, and Unverified Sample records.
   - **Product Management (`/admin/products`)**: Add, edit, delete, upload/set image, set verified MRP & selling price, calculate discounts, toggle stock, toggle featured, and approve draft sample records.
   - **Category Management (`/admin/categories`)**: Manage display order and active status of categories.
   - **Store Settings (`/admin/settings`)**: Configure primary and alternate WhatsApp numbers, phone number, clinic hours, Bengaluru address, hero video URL, and announcement banner.
   - **Database Setup Wizard (`/admin/setup`)**: Live connection indicator and 1-click copy of the complete Supabase SQL schema.

7. **Legal & Compliance Pages**:
   - Privacy Policy (`/privacy-policy`)
   - Terms & Conditions (`/terms-and-conditions`)
   - Returns & Cancellation Policy (`/returns-policy`)
   - Healthcare & Medicine Safety Disclaimer (`/disclaimer`)

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom healthcare palette
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Supabase Auth, Supabase Storage)
- **Deployment Target**: Vercel

---

## 3. Getting Started (Local Development)

### Prerequisites
- Node.js 18.x or 20.x
- npm 9.x or later

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd C:\Users\prave\.gemini\antigravity\scratch\dr-praveen-homoeopathy
   ```

2. Dependencies are already installed. To start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser at:
   ```
   http://localhost:3000
   ```

4. Access the Admin Portal:
   ```
   http://localhost:3000/admin
   ```
   **Initial Admin Credentials:**
   - **Email:** `admin@drpraveenclinic.com`
   - **Password:** `PraveenClinic@2026`

---

## 4. Supabase Cloud Database Setup

The application features a hybrid architecture:
- Out of the box, it runs smoothly in persistent local mode.
- Connecting your live Supabase database takes only 3 minutes:

### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, name it `dr-praveen-homoeopathy`, and choose a secure database password. Select the **South Asia (Mumbai)** region for lowest latency to Bengaluru.

### Step 2: Run the SQL Migration
1. In your Supabase dashboard, open the **SQL Editor**.
2. Click **New query**.
3. Open [`supabase/schema.sql`](file:///C:/Users/prave/.gemini/antigravity/scratch/dr-praveen-homoeopathy/supabase/schema.sql) (or copy it from `/admin/setup` in the web application).
4. Paste the SQL into Supabase and click **Run**.
   - This creates all tables (`categories`, `products`, `store_settings`, `appointment_enquiries`).
   - Seeds the 18 homoeopathic categories.
   - Enables Row-Level Security (RLS) so public visitors can only read published medicines.

### Step 3: Configure Storage for Product Images
1. In Supabase, go to **Storage** → **New bucket**.
2. Name the bucket `products`.
3. Toggle **Public bucket** to `ON` so image URLs can be rendered publicly on the website.
4. Save.

### Step 4: Configure Environment Variables
In your project directory, edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

Restart your Next.js server (`npm run dev`). Your web application is now connected to your live Supabase cloud database.

---

## 5. Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com) and click **Add New** → **Project**.
3. Import your repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Keep server-side only)
5. Click **Deploy**. Vercel will build and deploy the Next.js application with a global CDN and SSL certificate.

---

## 6. How to Configure WhatsApp Numbers & Media Assets

### Changing WhatsApp Numbers
1. Log in to the Admin Dashboard at `/admin`.
2. Go to **Store Settings** (`/admin/settings`).
3. Update the **Primary WhatsApp Number** and **Alternate WhatsApp Number**.
4. Click **Save Settings**. The changes instantly update on all product detail pages, the floating WhatsApp widget, the cart order generator, and the footer.

### Uploading Official Clinic Logo & Doctor Photo
1. Upload your official clinic logo and doctor photograph to your Supabase `products` storage bucket (or host them on your CDN).
2. Copy the public URLs.
3. In `/admin/settings`, paste the URLs into **Clinic Logo URL** and **Doctor Photograph URL**.
4. Click **Save Settings**. The placeholders on the header, hero, and appointment page will update to your authentic brand assets.

### Adding Hero Video Background
1. In `/admin/settings`, enter your video URL (MP4 format) into the **Hero Video Background URL** field.
2. The homepage hero will automatically render a subtle, muted, looping background visual with a graceful image fallback.

---

## 7. Verifying and Publishing the Real Catalogue

1. Initial products are flagged with `is_sample = true` and clearly labeled as **Sample Records**.
2. In the Admin Dashboard (`/admin/products`):
   - You can review each remedy, adjust verified MRP and selling prices, and click **Approve** to publish it to your genuine live inventory.
   - Or click **Delete** on sample records and click **Add New Medicine** to start building your real pharmacy inventory from scratch.
3. Every price change or stock update is immediately reflected in the public store, search results, and WhatsApp order message generator.
