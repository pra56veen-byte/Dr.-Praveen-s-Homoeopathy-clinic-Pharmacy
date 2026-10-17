'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Check,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Info,
  Building,
  HeartHandshake,
  Phone,
  Sparkles,
} from 'lucide-react';
import { getProductById, getProducts, getStoreSettings } from '@/lib/store';
import { Product, StoreSettings } from '@/types';
import { useCart } from '@/context/CartContext';
import { ProductCard } from '@/components/ProductCard';
import { DEFAULT_STORE_SETTINGS } from '@/lib/initialData';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const [foundProduct, allProds, storeSet] = await Promise.all([
          getProductById(productId),
          getProducts(),
          getStoreSettings(),
        ]);

        if (foundProduct) {
          setProduct(foundProduct);
          // Related items in same category
          const related = allProds.products.filter(
            p => p.category_id === foundProduct.category_id && p.id !== foundProduct.id && p.is_published
          );
          setRelatedProducts(related.slice(0, 4));
        }
        setSettings(storeSet);
      } catch (e) {
        console.error('Error fetching product detail:', e);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 text-sm">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-sm text-gray-500">
          The requested medicine or product could not be located in our catalogue.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const discount =
    product.mrp && product.mrp > product.selling_price
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  // Direct WhatsApp enquiry link for this specific single product
  const directWaMessage = `Hello Dr. Praveen’s Homoeopathy clinic & Pharmacy,

I would like to enquire about the availability of:
Product: ${product.name}
Brand: ${product.brand}
Pack Size / Potency: ${product.pack_size || product.potency || 'Standard'}
Quantity: ${quantity}
Estimated Price: ₹${product.selling_price * quantity}

Is this product currently in stock?
Thank you.`;

  const directWaUrl = `https://wa.me/${settings.primary_whatsapp}?text=${encodeURIComponent(directWaMessage)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-blue">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-blue">
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-xs">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-brand-green text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                {discount}% OFF
              </span>
            )}
            {product.is_sample && (
              <span className="absolute bottom-4 left-4 bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded shadow-sm">
                Sample Catalogue Record
              </span>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center text-xs text-gray-500">
            Dispensed through Dr. Praveen’s Pharmacy • Bengaluru, Karnataka
          </div>
        </div>

        {/* Right Column: Details & Ordering */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-brand-blue uppercase tracking-wider">
                {product.brand}
              </span>
              {product.is_in_stock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  In Stock at Pharmacy
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Contact for Availability
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Potency & Pack Size Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {product.potency && (
                <span className="px-3 py-1 bg-blue-50 text-brand-blue font-semibold rounded-lg border border-blue-100">
                  Potency: {product.potency}
                </span>
              )}
              {product.pack_size && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 font-medium rounded-lg">
                  Pack Size: {product.pack_size}
                </span>
              )}
              {product.manufacturer && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {product.manufacturer}
                </span>
              )}
            </div>

            {/* Price Box */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-gray-900">
                  ₹{product.selling_price}
                </span>
                {product.mrp && product.mrp > product.selling_price && (
                  <span className="text-sm text-gray-400 line-through">
                    Verified MRP ₹{product.mrp}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-bold text-brand-green bg-green-100 px-2 py-0.5 rounded">
                    Save ₹{product.mrp - product.selling_price} ({discount}%)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Inclusive of all taxes. Final availability confirmed directly by pharmacy.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Row: Quantity + Add To Cart + WhatsApp Direct */}
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between sm:justify-start border border-gray-200 rounded-xl p-1 bg-gray-50">
                <span className="text-xs font-semibold text-gray-600 px-2 sm:hidden">Qty:</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-xs font-bold text-gray-700 hover:bg-gray-100 text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow-xs font-bold text-gray-700 hover:bg-gray-100 text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.is_in_stock}
                className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  !product.is_in_stock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : added
                    ? 'bg-brand-green text-white'
                    : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart (₹{product.selling_price * quantity})</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp Quick Enquiry */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire Now on WhatsApp</span>
              </a>

              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 hover:border-brand-blue text-gray-800 text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>View Cart & Checkout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Product Information Tabs / Details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-brand-blue" />
          <span>Verified Product Information & Guidelines</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-700">
          {/* Ingredients / Composition */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-green" />
              <span>Composition / Ingredients</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {product.ingredients || 'Prepared in accordance with the official Homoeopathic Pharmacopoeia. Please contact the pharmacy for batch certificate details.'}
            </p>
          </div>

          {/* Approved Directions For Use */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
            <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-brand-blue" />
              <span>Directions For Use</span>
            </h4>
            <p className="text-gray-600 leading-relaxed">
              {product.directions_for_use || 'Take strictly as recommended by a qualified homoeopathic physician or as indicated on the manufacturer container.'}
            </p>
          </div>

          {/* Warnings & Storage */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 md:col-span-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Storage Instructions & Safety Warnings</span>
            </h4>
            <p className="text-amber-800 leading-relaxed">
              {product.warnings_and_storage || 'Store in a cool, dry place protected from sunlight and moisture. Avoid strong aromas (such as camphor, menthol, coffee, and raw garlic) 30 minutes before and after taking homoeopathic remedies. Keep out of reach of children.'}
            </p>
          </div>
        </div>

        {/* Legal Healthcare Disclaimer Box */}
        <div className="p-4 rounded-xl bg-gray-100 text-xs text-gray-500 leading-relaxed">
          <strong>Healthcare Safety Notice:</strong> This website does not substitute professional medical consultation or emergency clinical treatment. Dosage and potency requirements vary by individual constitution. Please contact the pharmacy for verified product information.
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Related Preparations in this Category
            </h3>
            <Link
              href={`/products?category=${product.category_id}`}
              className="text-xs sm:text-sm font-bold text-brand-blue hover:underline"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
