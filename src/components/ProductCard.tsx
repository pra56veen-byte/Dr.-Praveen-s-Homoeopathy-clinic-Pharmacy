'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Eye, AlertCircle, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const discount =
    product.mrp && product.mrp > product.selling_price
      ? Math.round(((product.mrp - product.selling_price) / product.mrp) * 100)
      : 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-200 flex flex-col h-full overflow-hidden">
      {/* Top badges */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
        {discount > 0 && (
          <span className="bg-brand-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
        {product.is_featured && (
          <span className="bg-brand-blue text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5" />
            Featured
          </span>
        )}
        {product.is_sample && (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-medium px-2 py-0.5 rounded shadow-sm">
            Sample Record
          </span>
        )}
      </div>

      {/* Stock status indicator */}
      <div className="absolute top-2.5 right-2.5 z-10">
        {product.is_in_stock ? (
          <span className="bg-white/90 backdrop-blur-sm text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200 shadow-xs">
            In Stock
          </span>
        ) : (
          <span className="bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-red-200 shadow-xs">
            Ask Pharmacy
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="block relative aspect-square w-full bg-gray-50 overflow-hidden"
      >
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium text-brand-blue truncate max-w-[65%]">
            {product.brand}
          </span>
          {product.pack_size && (
            <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {product.pack_size}
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-sm text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2 mb-1.5 leading-snug"
        >
          {product.name}
        </Link>

        {/* Potency */}
        {product.potency && (
          <p className="text-xs text-gray-500 mb-3 font-mono">
            Potency: <span className="font-semibold text-gray-700">{product.potency}</span>
          </p>
        )}

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.selling_price}
            </span>
            {product.mrp && product.mrp > product.selling_price && (
              <span className="text-xs text-gray-400 line-through">
                MRP ₹{product.mrp}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.is_in_stock}
              className={`inline-flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all ${
                !product.is_in_stock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : added
                  ? 'bg-brand-green text-white font-bold'
                  : 'bg-brand-blue hover:bg-brand-blue-hover text-white'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Toast-style instant confirmation */}
          {added && (
            <div className="mt-2 text-center">
              <Link
                href="/cart"
                className="text-[11px] font-bold text-brand-green hover:underline inline-flex items-center gap-1"
              >
                <span>View Cart & Place Order →</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
