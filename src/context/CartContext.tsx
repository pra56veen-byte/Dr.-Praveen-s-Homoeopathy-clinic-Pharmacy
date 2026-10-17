'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product } from '@/types';
import { getProducts } from '@/lib/store';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  estimatedTotal: number;
  revalidateCart: () => Promise<{ hasChanges: boolean; message?: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'drp_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.product_id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity, selling_price: product.selling_price, mrp: product.mrp, is_in_stock: product.is_in_stock }
            : item
        );
      }
      return [
        ...prevItems,
        {
          product_id: product.id,
          name: product.name,
          brand: product.brand,
          pack_size: product.pack_size,
          potency: product.potency,
          selling_price: product.selling_price,
          mrp: product.mrp,
          image_url: product.image_url,
          quantity,
          is_in_stock: product.is_in_stock,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product_id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Revalidate prices and availability against latest catalog
  const revalidateCart = async (): Promise<{ hasChanges: boolean; message?: string }> => {
    try {
      const { products } = await getProducts();
      let changed = false;
      const updated = items.map(cartItem => {
        const live = products.find(p => p.id === cartItem.product_id);
        if (!live) return cartItem;
        if (
          live.selling_price !== cartItem.selling_price ||
          live.is_in_stock !== cartItem.is_in_stock
        ) {
          changed = true;
          return {
            ...cartItem,
            selling_price: live.selling_price,
            mrp: live.mrp,
            is_in_stock: live.is_in_stock,
          };
        }
        return cartItem;
      });

      if (changed) {
        setItems(updated);
        return {
          hasChanges: true,
          message: 'Cart prices or availability have been refreshed based on current stock.',
        };
      }
      return { hasChanges: false };
    } catch (e) {
      console.error('Revalidation error:', e);
      return { hasChanges: false };
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal calculated at verified MRP
  const subtotal = items.reduce((sum, item) => {
    const basePrice = item.mrp && item.mrp > item.selling_price ? item.mrp : item.selling_price;
    return sum + basePrice * item.quantity;
  }, 0);

  // Estimated final total based on selling price
  const estimatedTotal = items.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );

  const totalDiscount = Math.max(0, subtotal - estimatedTotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        totalDiscount,
        estimatedTotal,
        revalidateCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
