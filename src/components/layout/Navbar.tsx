'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, HardHat, Sparkles, LogOut, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { PLAN_CONFIGS } from '@/lib/constants';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const planInfo = currentUser ? PLAN_CONFIGS[currentUser.plan] : null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-black">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-lg text-slate-900 dark:text-white leading-none">
              <span>İSG</span>
              <span className="text-amber-500">PRO</span>
              <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 px-1.5 py-0.5 rounded font-mono">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-1">Saha Denetim & İhtar Sistemi</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard/inspections/new">
                <Button size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Hızlı Denetim Başlat
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                {planInfo && (
                  <Badge variant={planInfo.badgeVariant}>
                    {planInfo.badge}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                title="Güvenli Çıkış Yap"
                leftIcon={<LogOut className="w-4 h-4 text-rose-500" />}
              >
                Çıkış
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                Giriş Yap / Üye Ol
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};