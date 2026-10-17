'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Sparkles,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { getCategories, getProducts } from '@/lib/store';
import { Category, Product, SortOption } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyFeatured, setOnlyFeatured] = useState(searchParams.get('featured') === 'true');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [visibleCount, setVisibleCount] = useState(12);

  // Mobile filters drawer open/close
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load categories and products
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setAllProducts(prods.products);
      } catch (e) {
        console.error('Error fetching products catalogue:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('drp_store_updated', handleUpdate);
    return () => window.removeEventListener('drp_store_updated', handleUpdate);
  }, []);

  // Update query params if search or category changes
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    const urlFeatured = searchParams.get('featured');
    if (urlFeatured === 'true') {
      setOnlyFeatured(true);
    }
  }, [searchParams]);

  // Extract unique brands from catalogue
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    allProducts.forEach(p => {
      if (p.brand && p.brand.trim().length > 0) {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet).sort();
  }, [allProducts]);

  // Combined client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => p.is_published);

    // Search query filter
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.category_name && p.category_name.toLowerCase().includes(q)) ||
          (p.potency && p.potency.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category_id === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // In stock filter
    if (onlyInStock) {
      result = result.filter(p => p.is_in_stock);
    }

    // Featured filter
    if (onlyFeatured) {
      result = result.filter(p => p.is_featured);
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.selling_price - b.selling_price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.selling_price - a.selling_price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Featured first, then newest
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, selectedBrand, onlyInStock, onlyFeatured, sortBy]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    onlyInStock ||
    onlyFeatured ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setOnlyInStock(false);
    setOnlyFeatured(false);
    setSortBy('featured');
    setVisibleCount(12);
    router.replace('/products');
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Title */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Medicines & Products Catalogue
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Explore genuine homoeopathic remedies, potencies, mother tinctures, and wellness essentials.
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search by remedy name, potency, brand or description..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-grow md:w-52">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 font-medium text-gray-700"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold bg-gray-100 rounded-xl text-gray-700 border border-gray-200"
            >
              <Filter className="w-4 h-4 text-brand-blue" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-medium">Quick Filters:</span>

          <button
            type="button"
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
              onlyInStock
                ? 'bg-green-50 text-green-700 border-green-300 font-semibold'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            In Stock Only
          </button>

          <button
            type="button"
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
              onlyFeatured
                ? 'bg-blue-50 text-brand-blue border-blue-300 font-semibold'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            Featured Only
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden md:block md:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
              <span>Filter Catalogue</span>
            </h3>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-brand-blue hover:underline font-semibold"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setVisibleCount(12);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-blue text-white font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-80">{allProducts.length}</span>
              </button>

              {categories
                .filter(c => c.is_active)
                .sort((a, b) => a.display_order - b.display_order)
                .map((cat) => {
                  const count = allProducts.filter(p => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setVisibleCount(12);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-brand-blue text-white font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className="text-[10px] opacity-80 flex-shrink-0">{count}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Brand Filter */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5">
                Brand / Manufacturer
              </h4>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    selectedBrand === 'all'
                      ? 'bg-brand-blue text-white font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Brands
                </button>
                {availableBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => setSelectedBrand(brand)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedBrand === brand
                        ? 'bg-brand-blue text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pharmacy Verification Note */}
          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-snug">
            Need a specific dilution or single remedy not listed here? Message our pharmacy directly via WhatsApp.
          </div>
        </aside>

        {/* Product Listing Grid */}
        <main className="md:col-span-3">
          {/* Results count & status */}
          <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
            <span>
              Showing <strong className="text-gray-900">{displayedProducts.length}</strong> of{' '}
              <strong className="text-gray-900">{filteredProducts.length}</strong> verified products
            </span>
            {selectedCategory !== 'all' && (
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>

          {/* Grid of Product Cards */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-80"></div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More Button */}
              {displayedProducts.length < filteredProducts.length && (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 hover:border-brand-blue text-gray-800 hover:text-brand-blue text-xs sm:text-sm font-semibold shadow-xs transition-all"
                  >
                    <span>Load More Products</span>
                    <span className="text-gray-400">
                      ({filteredProducts.length - displayedProducts.length} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  No matching medicines found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-1">
                  We could not find products matching your current filters. Try searching for another remedy name, clearing filters, or contacting the pharmacy directly on WhatsApp.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-semibold hover:bg-brand-blue-hover"
                >
                  Clear All Filters
                </button>
                <a
                  href={`https://wa.me/919052523835?text=${encodeURIComponent(`Hello Dr. Praveen's Pharmacy, I am searching for "${searchQuery}". Is this available?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-brand-green text-white rounded-xl text-xs font-semibold hover:bg-brand-green-hover"
                >
                  Enquire Remedy on WhatsApp
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
          <div className="w-80 bg-white h-full p-5 flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">Filter Catalogue</h3>
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === 'all'
                        ? 'bg-brand-blue text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCategory === cat.id
                          ? 'bg-brand-blue text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="py-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Brand
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand('all');
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedBrand === 'all'
                          ? 'bg-brand-blue text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Brands
                    </button>
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => {
                          setSelectedBrand(brand);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                          selectedBrand === brand
                            ? 'bg-brand-blue text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-brand-blue text-white font-semibold text-sm rounded-xl"
              >
                Show Results ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading product catalogue...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
