'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search by remedy name, potency, brand (SBL, Reckeweg, Schwabe) or category...',
  className = '',
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full max-w-3xl mx-auto ${className}`}>
      <div className="relative flex items-center shadow-md hover:shadow-lg transition-shadow rounded-2xl bg-white border border-gray-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20">
        <div className="pl-4 text-gray-400">
          <Search className="w-5 h-5 text-brand-blue" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3.5 pl-3 pr-20 text-sm sm:text-base text-gray-900 bg-transparent rounded-2xl focus:outline-none placeholder-gray-400"
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="mr-2 px-4 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </div>
    </form>
  );
};
