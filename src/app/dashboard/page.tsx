'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ClipboardList, 
  AlertTriangle, 
  PlusCircle, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { INITIAL_PROJECTS } from '@/lib/constants';

export default function DashboardPage() {
  const stats = [
    { label: 'Aktif Şantiyeler', value: '2', icon: Building2, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40' },
    { label: 'Toplam Denetim Raporu', value: '14', icon: ClipboardList, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
    { label: 'Açık Uygunsuzluk / Risk', value: '8', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
    { label: 'Kapatılan DÖF Faaliyeti', value: '38', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Destekli Saha Denetçisi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Şantiyede Fotoğrafı Çekin, <br className="hidden sm:inline" />
            Raporu <span className="text-amber-400">Yapay Zeka</span> Hazırlasın.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            6331 sayılı İSG Kanunu ve Yapı İSG Yönetmeliği mevzuatına tam uyumlu resmi ihtar tutanağı ve taşeron WhatsApp özetlerini saniyeler içinde oluşturun.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/dashboard/inspections/new">
              <Button size="lg" leftIcon={<PlusCircle className="w-5 h-5" />}>
                Yeni Fotoğraflı Denetim Başlat
              </Button>
            </Link>
            <Link href="/dashboard/projects">
              <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800">
                Şantiyeleri Görüntüle
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Sites List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aktif Şantiyeler & Projeler</h2>
            <p className="text-xs text-slate-500">Denetlenen sahalar ve kayıtlı taşeronlar</p>
          </div>
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              Tümünü Yönet
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/60 transition-all bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{proj.name}</h3>
                  <p className="text-xs text-slate-500">{proj.clientName} • {proj.city}</p>
                </div>
                <Badge variant="info">{proj.subcontractors.length} Taşeron</Badge>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between text-slate-500">
                <span>İSG Uzmanı: <strong className="text-slate-800 dark:text-slate-200">{proj.inspectorName}</strong></span>
                <Link href={`/dashboard/inspections/new?projectId=${proj.id}`}>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1">
                    Denetim Aç &rarr;
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}