'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import { getCategories, saveCategory, deleteCategory } from '@/lib/store';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [successToast, setSuccessToast] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    const cats = await getCategories();
    setCategories(cats);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('drp_store_updated', loadData);
    return () => window.removeEventListener('drp_store_updated', loadData);
  }, []);

  const openCreateModal = () => {
    setEditingCategory({
      name: '',
      description: '',
      icon_name: 'Sparkles',
      display_order: categories.length + 1,
      is_active: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory({ ...cat });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name || editingCategory.name.trim().length === 0) {
      setFormError('Category name is required.');
      return;
    }

    try {
      await saveCategory({
        ...editingCategory,
        name: editingCategory.name.trim(),
        display_order: Number(editingCategory.display_order) || 1,
      });

      setIsModalOpen(false);
      setEditingCategory(null);
      setSuccessToast('Category saved successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
      loadData();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save category.');
    }
  };

  const handleToggleActive = async (cat: Category) => {
    await saveCategory({
      ...cat,
      is_active: !cat.is_active,
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteCategory(id);
      setSuccessToast('Category deleted.');
      setTimeout(() => setSuccessToast(''), 3000);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Homoeopathy & Healthcare Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage the standard 18 homoeopathic categories, edit display order, and activate or deactivate categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Category</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-xs text-green-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {categories
                .sort((a, b) => a.display_order - b.display_order)
                .map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-gray-500">
                      #{cat.display_order}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {cat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-sm truncate">
                      {cat.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-bold text-base text-gray-900">
                {editingCategory.id ? 'Edit Category' : 'Add New Category'}
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
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category Name <strong className="text-red-500">*</strong>
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Homoeopathic Single Remedies"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Brief description of products in this category..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingCategory.display_order ?? 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, display_order: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat_active"
                  checked={editingCategory.is_active ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-blue rounded"
                />
                <label htmlFor="cat_active" className="text-xs font-semibold text-gray-700">
                  Active in store navigation and filters
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
