'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { InspectionReport } from '@/lib/types';
import { PrintableReport } from '@/components/report/PrintableReport';
import { Button } from '@/components/ui/Button';
import { Printer, ArrowLeft, Download, Share2 } from 'lucide-react';

export default function InspectionReportViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [report, setReport] = useState<InspectionReport | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('isg_reports');
      if (stored) {
        const list: InspectionReport[] = JSON.parse(stored);
        const found = list.find((r) => r.id === resolvedParams.id);
        if (found) {
          setReport(found);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [resolvedParams.id]);

  if (!report) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-slate-500">Rapor bulunamadı veya yükleniyor...</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/inspections')}>
          Rapor Listesine Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action Bar (Hidden during print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              {report.reportNo} - Resmi İSG Tutanağı
            </h2>
            <p className="text-xs text-slate-500">{report.siteName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Yazdır / PDF Olarak Kaydet
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Resmi Tutanağı İndir (A4)
          </Button>
        </div>
      </div>

      {/* Printable A4 Report View */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md bg-white">
        <PrintableReport report={report} />
      </div>
    </div>
  );
}