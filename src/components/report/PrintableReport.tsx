'use client';

import React from 'react';
import { InspectionReport } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { HardHat, ShieldCheck, AlertTriangle } from 'lucide-react';

interface PrintableReportProps {
  report: InspectionReport;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report }) => {
  return (
    <div className="bg-white text-slate-900 p-8 max-w-4xl mx-auto shadow-lg print:shadow-none print:p-0 print:max-w-none text-xs font-sans">
      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black">
            <HardHat className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase text-slate-950">
              ŞANTİYE İSG UYGUNSUZLUK VE İHTAR RAPORU
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              6331 Sayılı İSG Kanunu ve Yapı İşlerinde İSG Yönetmeliği Uyarınca Düzenlenmiştir
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block bg-slate-900 text-white font-mono px-2.5 py-1 rounded text-xs font-bold">
            {report.reportNo}
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Tarih: {formatDate(report.inspectionDate)}</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase">Proje / Şantiye:</span>
          <strong className="text-sm text-slate-900 block">{report.siteName}</strong>
          <span className="text-slate-600 mt-1 block">İşveren / Yüklenici: {report.clientName}</span>
        </div>
        <div>
          <span className="text-slate-500 font-semibold block text-[10px] uppercase">Denetleyen İSG Uzmanı:</span>
          <strong className="text-sm text-slate-900 block">{report.inspectorName}</strong>
          <span className="text-slate-600 mt-1 block">Belge No: {report.inspectorCertificateNo || 'İSG-A/B/C'}</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 mb-6 p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <div className="text-xs">
          <strong>Özet Tespit:</strong> Bu denetimde toplam <strong>{report.hazards.length} adet</strong> mevzuata aykırı uygunsuzluk ve güvenlik riski tespit edilmiştir. İlgili taşeronların belirtilen termin süreleri içinde DÖF (Düzeltici Önleyici Faaliyet) işlemlerini tamamlaması yasal zorunluluktur.
        </div>
      </div>

      {/* Hazards Table & Cards */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wider border-b pb-1">
          Tespit Edilen Uygunsuzluklar & Yasal Dayanaklar
        </h2>

        {report.hazards.map((item, index) => (
          <div
            key={item.id}
            className="border border-slate-300 rounded-xl p-4 page-break-inside-avoid flex flex-col md:flex-row gap-4 bg-white"
          >
            {/* Photo */}
            <div className="w-full md:w-48 h-36 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
              <img
                src={item.photoUrl}
                alt={`Uygunsuzluk #${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="font-black text-slate-900 text-sm">
                  #{index + 1}. {item.title}
                </span>
                <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px]">
                  {item.severity} (Risk: {item.riskScore}/25)
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">{item.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <strong className="text-slate-800 block text-[10px]">Yasal Mevzuat Maddesi:</strong>
                  <span className="text-slate-700">{item.regulationReference}</span>
                </div>

                <div className="bg-amber-50 p-2 rounded border border-amber-200">
                  <strong className="text-amber-900 block text-[10px]">DÖF (Yapılacak Faaliyet):</strong>
                  <span className="text-amber-950 font-medium">{item.correctiveAction}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-600 border-t border-dashed">
                <span>Sorumlu Taşeron: <strong>{item.subcontractor || 'Ana Yüklenici'}</strong></span>
                <span>Termin Süresi: <strong className="text-rose-600">{item.deadlineHours} Saat</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signature & Legal Warning Section */}
      <div className="mt-12 pt-6 border-t-2 border-slate-900 page-break-inside-avoid">
        <p className="text-[10px] text-slate-500 leading-tight mb-8">
          * İşbu tutanak 6331 sayılı İş Sağlığı ve Güvenliği Kanunu’nun 13. ve 16. maddeleri ile Yapı İşlerinde İSG Yönetmeliği gereğince tanzim edilerek tebliğ edilmiştir. Belirtilen süre içerisinde uygunsuzluğun giderilmemesi halinde doğacak her türlü hukuki, cezai ve mali sorumluluk ilgili taşeron ve ana yükleniciye aittir.
        </p>

        <div className="grid grid-cols-3 gap-8 text-center text-xs">
          <div className="border-t border-slate-400 pt-2">
            <p className="font-bold text-slate-900">{report.inspectorName}</p>
            <p className="text-slate-500 text-[11px]">İSG Uzmanı (İmza)</p>
          </div>

          <div className="border-t border-slate-400 pt-2">
            <p className="font-bold text-slate-900">Şantiye Şefi</p>
            <p className="text-slate-500 text-[11px]">Ana Yüklenici (İmza)</p>
          </div>

          <div className="border-t border-slate-400 pt-2">
            <p className="font-bold text-slate-900">Sorumlu Taşeron Yetkilisi</p>
            <p className="text-slate-500 text-[11px]">Tebellüğ Eden (İmza)</p>
          </div>
        </div>
      </div>
    </div>
  );
};