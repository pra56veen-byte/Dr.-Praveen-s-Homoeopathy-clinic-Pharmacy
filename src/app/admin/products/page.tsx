'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { getCategories, getProducts, saveProduct, deleteProduct } from '@/lib/store';
import { Category, Product } from '@/types';

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'samples' | 'out_of_stock'>('all');
  const [loading, setLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const loadData = async () => {
    try {
      const [prodsData, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodsData.products);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('drp_store_updated', loadData);
    return () => window.removeEventListener('drp_store_updated', loadData);
  }, []);

  // Handle URL query actions (e.g. ?action=new or ?edit=prod-1)
  useEffect(() => {
    const action = searchParams.get('action');
    const editId = searchParams.get('edit');

    if (action === 'new') {
      openCreateModal();
    } else if (editId && products.length > 0) {
      const p = products.find(prod => prod.id === editId);
      if (p) openEditModal(p);
    }
  }, [searchParams, products]);

  const openCreateModal = () => {
    setEditingProduct({
      name: '',
      brand: 'SBL',
      category_id: categories[0]?.id || 'cat-1',
      potency: '30 CH',
      pack_size: '30 ml',
      mrp: 100,
      selling_price: 90,
      image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
      is_in_stock: true,
      is_featured: false,
      is_published: true,
      is_sample: false,
      description: '',
      manufacturer: '',
      ingredients: '',
      directions_for_use: '',
      warnings_and_storage: 'Store in a cool, dry place away from sunlight, camphor, and strong odors.',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct({ ...product });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name || editingProduct.name.trim().length === 0) {
      setFormError('Product name is required.');
      return;
    }
    if (!editingProduct.selling_price || Number(editingProduct.selling_price) <= 0) {
      setFormError('Valid selling price is required.');
      return;
    }

    const mrp = Number(editingProduct.mrp) || Number(editingProduct.selling_price);
    const sellingPrice = Number(editingProduct.selling_price);

    const categoryObj = categories.find(c => c.id === editingProduct.category_id);

    try {
      await saveProduct({
        ...editingProduct,
        name: editingProduct.name.trim(),
        mrp,
        selling_price: sellingPrice,
        category_name: categoryObj ? categoryObj.name : 'Homoeopathic Remedies',
      });

      setIsModalOpen(false);
      setEditingProduct(null);
      setSuccessToast('Product successfully saved and published to catalogue.');
      setTimeout(() => setSuccessToast(''), 3000);
      loadData();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
    setSuccessToast('Product deleted from inventory.');
    setTimeout(() => setSuccessToast(''), 3000);
    loadData();
  };

  const handleApproveSample = async (product: Product) => {
    await saveProduct({
      ...product,
      is_sample: false,
      is_published: true,
    });
    setSuccessToast(`"${product.name}" approved as verified live catalogue stock.`);
    setTimeout(() => setSuccessToast(''), 3000);
    loadData();
  };

  // Filtered catalogue list
  const filteredProducts = products.filter(p => {
    const matchesQuery =
      searchQuery.trim().length === 0 ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.potency && p.potency.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || p.category_id === selectedCategory;

    let matchesStatus = true;
    if (filterStatus === 'published') matchesStatus = p.is_published;
    else if (filterStatus === 'samples') matchesStatus = p.is_sample;
    else if (filterStatus === 'out_of_stock') matchesStatus = !p.is_in_stock;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Products & Medicines Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add genuine medicines, set verified MRPs and selling prices, manage stock, and approve sample drafts.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Success Notification Toast */}
      {successToast && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-green-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by product name, potency, brand..."
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none font-medium text-gray-700"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none font-medium text-gray-700"
            >
              <option value="all">All Records</option>
              <option value="published">Published Only</option>
              <option value="samples">Sample Records Only</option>
              <option value="out_of_stock">Out of Stock Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Medicine Details</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Potency & Pack</th>
                <th className="py-3 px-3">MRP & Selling Price</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredProducts.map((p) => {
                const discount =
                  p.mrp && p.mrp > p.selling_price
                    ? Math.round(((p.mrp - p.selling_price) / p.mrp) * 100)
                    : 0;

                return (
                  <tr key={p.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate max-w-xs sm:max-w-md">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {p.is_sample && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                                Sample Record
                              </span>
                            )}
                            {p.is_featured && (
                              <span className="bg-blue-100 text-brand-blue text-[10px] px-1.5 py-0.2 rounded font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-gray-800">{p.brand}</td>

                    <td className="py-3 px-3 text-gray-500 truncate max-w-[150px]">
                      {p.category_name || categories.find(c => c.id === p.category_id)?.name}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                      <div>{p.potency || '—'}</div>
                      <div className="text-gray-400 text-[10px]">{p.pack_size}</div>
                    </td>

                    <td className="py-3 px-3 font-bold text-gray-900">
                      <div>₹{p.selling_price}</div>
                      {p.mrp && p.mrp > p.selling_price && (
                        <div className="text-[10px] text-gray-400 font-normal">
                          MRP ₹{p.mrp} ({discount}% off)
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.is_in_stock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {p.is_in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.is_sample && (
                          <button
                            type="button"
                            onClick={() => handleApproveSample(p)}
                            title="Verify and publish sample to live store"
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg text-xs font-semibold px-2 border border-green-200"
                          >
                            Approve
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-lg"
                          title="Edit Medicine"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-gray-900">Confirm Deletion</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to permanently delete this medicine from the catalogue? This will also remove it from customer search results.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">
                {editingProduct.id ? 'Edit Medicine' : 'Add New Medicine to Pharmacy'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Arnica Montana 30 CH Dilution"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Brand and Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="e.g. SBL, Dr. Reckeweg, Schwabe"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category <strong className="text-red-500">*</strong>
                  </label>
                  <select
                    value={editingProduct.category_id || categories[0]?.id}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Potency & Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Potency / Strength (if applicable)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.potency || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, potency: e.target.value })}
                    placeholder="e.g. 30 CH, 200 CH, 1M, 6X, Q"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Pack Size / Quantity
                  </label>
                  <input
                    type="text"
                    value={editingProduct.pack_size || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, pack_size: e.target.value })}
                    placeholder="e.g. 30 ml, 100 ml, 25 g, 100 tablets"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Verified MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.mrp ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selling Price (₹) <strong className="text-red-500">*</strong>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingProduct.selling_price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, selling_price: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Calculated Discount
                  </label>
                  <div className="py-2 text-xs font-bold text-brand-green">
                    {editingProduct.mrp && editingProduct.selling_price && editingProduct.mrp > editingProduct.selling_price
                      ? `${Math.round(((editingProduct.mrp - editingProduct.selling_price) / editingProduct.mrp) * 100)}% Discount`
                      : '0% (Standard MRP)'}
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Product Image URL</span>
                  <span className="text-gray-400 font-normal text-[11px]">Direct image or Supabase Storage link</span>
                </label>
                <input
                  type="url"
                  value={editingProduct.image_url || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              {/* Description & Clinical Information */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Brief description of preparation and origin..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ingredients / Composition
                  </label>
                  <input
                    type="text"
                    value={editingProduct.ingredients || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })}
                    placeholder="e.g. Arnica Montana 30 CH in alcohol"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Approved Directions For Use
                  </label>
                  <input
                    type="text"
                    value={editingProduct.directions_for_use || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, directions_for_use: e.target.value })}
                    placeholder="e.g. As directed by homoeopathic physician"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Warnings and Storage */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Warnings & Storage Instructions
                </label>
                <input
                  type="text"
                  value={editingProduct.warnings_and_storage || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, warnings_and_storage: e.target.value })}
                  placeholder="Store in a cool dry place away from sunlight and camphor."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                />
              </div>

              {/* Status Toggles */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_in_stock ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_in_stock: e.target.checked })}
                    className="w-4 h-4 text-brand-green rounded"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="w-4 h-4 text-brand-blue rounded"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_published ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_published: e.target.checked })}
                    className="w-4 h-4 text-brand-blue rounded"
                  />
                  <span>Published to Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-amber-700">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_sample ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_sample: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Sample Record (Draft)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold shadow-xs"
                >
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading product management...</p>
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
