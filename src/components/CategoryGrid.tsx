'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FlaskConical,
  CircleDot,
  Pill,
  Droplets,
  Layers,
  Hexagon,
  ShieldCheck,
  Wine,
  BriefcaseMedical,
  Smile,
  Scissors,
  HeartPulse,
  CheckCircle,
  Cross,
  Activity,
  Apple,
  Baby,
  LucideIcon,
} from 'lucide-react';
import { Category } from '@/types';

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  FlaskConical,
  CircleDot,
  Pill,
  Droplets,
  Layers,
  Hexagon,
  ShieldCheck,
  Wine,
  BriefcaseMedical,
  Smile,
  Scissors,
  HeartPulse,
  CheckCircle,
  Cross,
  Activity,
  Apple,
  Baby,
};

interface CategoryGridProps {
  categories: Category[];
  limit?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, limit }) => {
  const activeCategories = categories
    .filter((c) => c.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  const displayed = limit ? activeCategories.slice(0, limit) : activeCategories;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {displayed.map((cat) => {
        const IconComponent = ICON_MAP[cat.icon_name] || Sparkles;

        return (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-brand-blue/40 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center text-gray-800 hover:text-brand-blue"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-brand-blue-light text-brand-blue flex items-center justify-center transition-colors mb-2.5">
              <IconComponent className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs sm:text-sm font-semibold line-clamp-2 leading-tight">
              {cat.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
