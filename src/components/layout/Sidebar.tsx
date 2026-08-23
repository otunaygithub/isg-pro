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
  ShieldCheck,
  Zap,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIGS } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { currentUser, allUsers, switchUser } = useAuth();
  const planInfo = PLAN_CONFIGS[currentUser?.plan || 'DEMO_1_GUN'];

  const navItems = [
    { label: 'Genel Bakış', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Şantiyeler / Projeler', href: '/dashboard/projects', icon: Building2 },
    { label: 'Denetim Raporları', href: '/dashboard/inspections', icon: ClipboardList },
    { label: 'Yeni AI Denetim', href: '/dashboard/inspections/new', icon: PlusCircle, highlight: true },
    { label: 'Profil & Ayarlar', href: '/dashboard/settings', icon: Settings },
  ];

  if (currentUser?.role === 'ADMIN') {
    navItems.push({
      label: 'Admin & Yetkilendirme',
      href: '/dashboard/admin',
      icon: ShieldCheck,
      highlight: false,
    });
  }

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      {/* User Switcher Dropdown in Sidebar */}
      <div className="p-3 border-b border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Aktif Oturum</span>
            <Badge variant={planInfo?.badgeVariant || 'default'}>
              {planInfo?.badge || 'Demo'}
            </Badge>
          </div>
          <select
            value={currentUser?.id}
            onChange={(e) => switchUser(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent text-slate-900 dark:text-white border-none focus:outline-none cursor-pointer"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                {u.name} ({u.role === 'ADMIN' ? 'Admin' : PLAN_CONFIGS[u.plan]?.badge})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav links */}
      <div className="p-3 flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
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

      {/* Plan Quota Card */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Paket Durumu</span>
            </span>
            <span className="text-[10px] text-slate-500">
              {currentUser?.maxReportsAllowed === -1 ? 'Sınırsız' : `${currentUser?.reportsCount || 0}/${currentUser?.maxReportsAllowed}`}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{
                width: currentUser?.maxReportsAllowed === -1 ? '100%' : `${Math.min(100, ((currentUser?.reportsCount || 0) / (currentUser?.maxReportsAllowed || 3)) * 100)}%`
              }}
            />
          </div>

          <p className="text-[9.5px] text-slate-500 dark:text-slate-400">
            {currentUser?.plan === 'DEMO_1_GUN' ? 'Demo süresi 24 saattir.' : 'Pro paket aktif.'}
          </p>
        </div>
      </div>
    </aside>
  );
};