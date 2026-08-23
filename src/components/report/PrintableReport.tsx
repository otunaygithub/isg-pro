'use client';

import React from 'react';
import { InspectionReport } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { HardHat } from 'lucide-react';

interface PrintableReportProps {
  report: InspectionReport;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({ report }) => {
  return (
    <div className="bg-white text-slate-900 mx-auto font-sans print:w-full print:m-0 print:p-0 print:border-none print:shadow-none shadow-lg max-w-[210mm] p-[10mm] border border-slate-200">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, aside, nav, button, .print\\:hidden {
            display: none !important;
          }
          .page-container {
            width: 100% !important;
            max-width: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <div className="page-container flex flex-col justify-between min-h-[265mm] text-[11px] leading-tight">
        {/* TOP SECTION */}
        <div>
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-2 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-amber-500 rounded-md flex items-center justify-center text-slate-950 font-black flex-shrink-0">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight uppercase text-slate-950">
                  ŞANTİYE İSG UYGUNSUZLUK VE İHTAR TUTANAĞI
                </h1>
                <p className="text-[9px] text-slate-600 font-medium">
                  6331 Sayılı İSG Kanunu & Yapı İşlerinde İSG Yönetmeliği Uyarınca Tanzim Edilmiştir
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-mono px-2 py-0.5 rounded text-[10px] font-bold">
                {report.reportNo}
              </span>
              <p className="text-[9px] text-slate-600 mt-0.5">Tarih: {formatDate(report.inspectionDate)}</p>
            </div>
          </div>

          {/* Info Summary Strip */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100/80 p-2 rounded-lg border border-slate-300 mb-2.5 text-[10px]">
            <div>
              <span className="text-slate-500 font-semibold block text-[8px] uppercase">Şantiye / Proje:</span>
              <strong className="text-slate-950 text-[11px] block truncate">{report.siteName}</strong>
              <span className="text-slate-700 block truncate">İşveren: {report.clientName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[8px] uppercase">Denetleyen İSG Uzmanı:</span>
              <strong className="text-slate-950 text-[11px] block truncate">{report.inspectorName}</strong>
              <span className="text-slate-700 block truncate">Belge No: {report.inspectorCertificateNo || 'İSG-A/B/C'}</span>
            </div>
          </div>

          {/* Notice Alert */}
          <div className="bg-amber-50 border border-amber-300 p-1.5 rounded-md text-[9.5px] text-amber-950 mb-2.5 font-medium">
            <strong>Yasal Uyarı:</strong> Bu denetimde toplam <strong>{report.hazards.length} adet</strong> mevzuata aykırı durum tespit edilmiş olup aşağıda belirtilen termin süreleri içinde giderilmesi yasal zorunluluktur.
          </div>

          {/* Hazards List - Ultra Compact Grid/Flex for Single Page */}
          <div className="space-y-2">
            {report.hazards.map((item, index) => (
              <div
                key={item.id}
                className="border border-slate-300 rounded-lg p-2 bg-white flex flex-row gap-3 items-start"
              >
                {/* Photo */}
                <div className="w-28 h-24 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-300 relative">
                  <img
                    src={item.photoUrl}
                    alt={`Uygunsuzluk #${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] text-center font-bold py-0.5">
                    {item.severity}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-0.5">
                    <span className="font-bold text-slate-950 text-[11px] truncate">
                      #{index + 1}. {item.title}
                    </span>
                    <span className="text-rose-700 font-bold text-[9px] bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded flex-shrink-0">
                      Risk: {item.riskScore}/25
                    </span>
                  </div>

                  <p className="text-slate-800 text-[9.5px] leading-tight line-clamp-2">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1.5 pt-0.5 text-[9px]">
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <strong className="text-slate-600 block text-[7.5px] uppercase">Yasal Mevzuat:</strong>
                      <span className="text-slate-800 truncate block">{item.regulationReference}</span>
                    </div>
                    <div className="bg-amber-50/70 p-1 rounded border border-amber-200">
                      <strong className="text-amber-800 block text-[7.5px] uppercase">DÖF (Gereken Faaliyet):</strong>
                      <span className="text-amber-950 truncate block font-medium">{item.correctiveAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8.5px] text-slate-600 pt-0.5">
                    <span>Sorumlu Taşeron: <strong className="text-slate-900">{item.subcontractor || 'Ana Yüklenici'}</strong></span>
                    <span>Termin: <strong className="text-rose-700 font-bold">{item.deadlineHours} Saat</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Signatures & Disclaimer */}
        <div className="pt-2 border-t-2 border-slate-900 mt-2">
          <p className="text-[7.5px] text-slate-500 leading-tight mb-4 text-justify">
            * İşbu tutanak 6331 sayılı İSG Kanunu Madde 13-16 ve Yapı İşlerinde İSG Yönetmeliği hükümleri uyarınca tebliğ edilmiştir. Belirtilen termin süresinde uygunsuzluğun giderilmemesi durumunda doğacak cezai, hukuki ve mali sorumluluk ilgili taşeron ve ana yükleniciye aittir.
          </p>

          <div className="grid grid-cols-3 gap-4 text-center text-[9px]">
            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-950">{report.inspectorName}</p>
              <p className="text-slate-500 text-[8px]">İSG Uzmanı (İmza)</p>
            </div>

            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-950">Şantiye Şefi</p>
              <p className="text-slate-500 text-[8px]">Ana Yüklenici (İmza)</p>
            </div>

            <div className="border-t border-slate-400 pt-1">
              <p className="font-bold text-slate-950">Sorumlu Taşeron Yetkilisi</p>
              <p className="text-slate-500 text-[8px]">Tebellüğ Eden (İmza)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};