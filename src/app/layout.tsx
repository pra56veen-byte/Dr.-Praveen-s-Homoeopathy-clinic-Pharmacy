import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1760CB',
};

export const metadata: Metadata = {
  title: 'Dr. Praveen’s Homoeopathy Clinic & Pharmacy | Treating the root Cause - Not just the symptoms',
  description: 'Verified homoeopathy clinic and pharmacy in Bengaluru, Karnataka. Enquire and order authentic homoeopathic dilutions, mother tinctures, biochemic salts and personal care via WhatsApp.',
  keywords: [
    'Homoeopathy Clinic Bengaluru',
    'Dr Praveen Homoeopathy',
    'Homoeopathic Pharmacy Bengaluru',
    'Buy Homoeopathic Medicines WhatsApp',
    'Mother Tinctures Bengaluru',
    'Dilutions 30C 200C',
    'Biochemic Tissue Salts',
    'Treating the root Cause - Not just the symptoms',
    'Nature’s Way of Cure',
  ],
  authors: [{ name: 'Dr. Praveen’s Homoeopathy Clinic & Pharmacy' }],
  openGraph: {
    title: 'Dr. Praveen’s Homoeopathy Clinic & Pharmacy | Treating the root Cause - Not just the symptoms',
    description: 'Explore homoeopathic preparations, healthcare essentials and personal care products with convenient WhatsApp ordering and doctor consultation enquiries.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="flex flex-col min-h-screen text-gray-900 bg-white">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
