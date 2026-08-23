'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { InspectionReport } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ClipboardList, PlusCircle, FileText, ArrowRight, Building2, Calendar } from 'lucide-react';

export default function InspectionsListPage() {
  const [reports, setReports] = useState<InspectionReport[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('isg_reports');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Denetim & İhtar Raporları</h1>
          <p className="text-sm text-slate-500">Tamamlanan saha denetimleri ve resmi tutanak geçmişi</p>
        </div>
        <Link href="/dashboard/inspections/new">
          <Button leftIcon={<PlusCircle className="w-4 h-4" />}>
            Yeni Denetim Yap
          </Button>
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Henüz Kayıtlı Denetim Yok</h3>
            <p className="text-xs text-slate-500 mt-1">
              Şantiyeden ilk fotoğraflarınızı yükleyerek yapay zekanın ilk resmi İSG raporunu çıkarmasını sağlayın.
            </p>
          </div>
          <Link href="/dashboard/inspections/new">
            <Button variant="primary">İlk Denetimi Başlat</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                    {report.reportNo}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(report.inspectionDate)}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {report.siteName}
                </h3>
                <p className="text-xs text-slate-500">{report.clientName}</p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <Badge variant="danger">
                    {report.hazards.length} Uygunsuzluk / Risk
                  </Badge>
                  <span className="text-slate-500">Uzman: {report.inspectorName?.split(' ')[0]}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Link href={`/dashboard/inspections/${report.id}/report`}>
                  <Button size="sm" variant="outline" rightIcon={<FileText className="w-4 h-4" />}>
                    Resmi Tutanağı Aç (PDF)
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}