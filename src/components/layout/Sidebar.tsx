'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  ClipboardList, 
  PlusCircle, 
  Settings, 
  FileText,
  ShieldAlert,
  HardHat
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Genel Bakış', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Şantiyeler / Projeler', href: '/dashboard/projects', icon: Building2 },
  { label: 'Denetim Raporları', href: '/dashboard/inspections', icon: ClipboardList },
  { label: 'Yeni AI Denetim', href: '/dashboard/inspections/new', icon: PlusCircle, highlight: true },
  { label: 'Ayarlar & İSG Belge', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100',
                item.highlight && !isActive && 'text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/30'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Free Tier Info Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span>Sıfır Maliyetli AI Altyapısı</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Google Gemini 1.5/2.5 Flash Free Tier devrede (Günlük 1.500 ücretsiz analiz hakkı).
          </p>
        </div>
      </div>
    </aside>
  );
};