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
    <div className="bg-white text-slate-900 mx-auto font-sans print:w-full print:m-0 print:p-0 print:border-none print:shadow-none shadow-lg max-w-[210mm] p-[6mm] border border-slate-200">
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm;
          }
          html, body {
            height: auto !important;
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
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          .hazard-item {
            page-break-inside: avoid !important;
          }
          .signature-section {
            page-break-inside: avoid !important;
            page-break-before: avoid !important;
          }
        }
      `}</style>

      <div className="page-container flex flex-col justify-between text-[10px] leading-tight">
        {/* TOP SECTION */}
        <div>
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-1.5 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center text-slate-950 font-black flex-shrink-0">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xs font-black tracking-tight uppercase text-slate-950 leading-none">
                  ŞANTİYE İSG UYGUNSUZLUK VE İHTAR TUTANAĞI
                </h1>
                <p className="text-[8px] text-slate-600 font-medium mt-0.5">
                  6331 Sayılı İSG Kanunu & Yapı İşlerinde İSG Yönetmeliği Uyarınca Tanzim Edilmiştir
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-slate-900 text-white font-mono px-2 py-0.5 rounded text-[9px] font-bold">
                {report.reportNo}
              </span>
              <p className="text-[8px] text-slate-600 mt-0.5">Tarih: {formatDate(report.inspectionDate)}</p>
            </div>
          </div>

          {/* Info Summary Strip */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100/90 p-1.5 rounded-md border border-slate-300 mb-1.5 text-[9px]">
            <div>
              <span className="text-slate-500 font-semibold block text-[7.5px] uppercase">Şantiye / Proje:</span>
              <strong className="text-slate-950 text-[10px] block">{report.siteName}</strong>
              <span className="text-slate-700 block">İşveren: {report.clientName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[7.5px] uppercase">Denetleyen İSG Uzmanı:</span>
              <strong className="text-slate-950 text-[10px] block">{report.inspectorName}</strong>
              <span className="text-slate-700 block">Belge No: {report.inspectorCertificateNo || 'İSG-A/B/C'}</span>
            </div>
          </div>

          {/* Notice Alert */}
          <div className="bg-amber-50 border border-amber-300 px-2 py-1 rounded text-[8.5px] text-amber-950 mb-1.5 font-medium">
            <strong>Yasal Uyarı:</strong> Bu denetimde tespit edilen uygunsuzlukların aşağıda belirtilen termin süreleri içinde giderilmesi yasal zorunluluktur.
          </div>

          {/* Hazards List */}
          <div className="space-y-1.5">
            {report.hazards.map((item, index) => (
              <div
                key={item.id}
                className="hazard-item border border-slate-300 rounded-md p-1.5 bg-white flex flex-row gap-2.5 items-start"
              >
                {/* Photo */}
                <div className="w-24 h-20 rounded overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-300 relative flex items-center justify-center">
                  <img
                    src={item.photoUrl}
                    alt={`Uygunsuzluk #${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/85 text-white text-[7.5px] text-center font-bold py-0.5">
                    {item.severity}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1 border-b border-slate-200 pb-0.5">
                    <span className="font-bold text-slate-950 text-[10px]">
                      #{index + 1}. {item.title}
                    </span>
                    <span className="text-rose-700 font-bold text-[8px] bg-rose-50 border border-rose-200 px-1 rounded flex-shrink-0">
                      Risk: {item.riskScore}/25
                    </span>
                  </div>

                  <p className="text-slate-800 text-[8.5px] leading-tight">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-1 pt-0.5 text-[8px]">
                    <div className="bg-slate-50 p-1 rounded border border-slate-200">
                      <strong className="text-slate-600 block text-[7px] uppercase">Yasal Mevzuat:</strong>
                      <span className="text-slate-800 block leading-tight">{item.regulationReference}</span>
                    </div>
                    <div className="bg-amber-50/70 p-1 rounded border border-amber-200">
                      <strong className="text-amber-800 block text-[7px] uppercase">DÖF (Gereken Faaliyet):</strong>
                      <span className="text-amber-950 block font-medium leading-tight">{item.correctiveAction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px] text-slate-600 pt-0.5 border-t border-dashed border-slate-200">
                    <span>Sorumlu Taşeron: <strong className="text-slate-900">{item.subcontractor || 'Ana Yüklenici'}</strong></span>
                    <span>Termin: <strong className="text-rose-700 font-bold">{item.deadlineHours} Saat</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Signatures & Disclaimer */}
        <div className="signature-section pt-1.5 border-t-2 border-slate-900 mt-2">
          <p className="text-[7px] text-slate-500 leading-tight mb-2 text-justify">
            * İşbu tutanak 6331 sayılı İSG Kanunu Madde 13-16 ve Yapı İşlerinde İSG Yönetmeliği hükümleri uyarınca tebliğ edilmiştir. Belirtilen termin süresinde uygunsuzluğun giderilmemesi durumunda doğacak cezai, hukuki ve mali sorumluluk ilgili taşeron ve ana yükleniciye aittir.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-[8px]">
            <div className="border-t border-slate-400 pt-0.5">
              <p className="font-bold text-slate-950">{report.inspectorName}</p>
              <p className="text-slate-500 text-[7.5px]">İSG Uzmanı (İmza)</p>
            </div>

            <div className="border-t border-slate-400 pt-0.5">
              <p className="font-bold text-slate-950">Şantiye Şefi</p>
              <p className="text-slate-500 text-[7.5px]">Ana Yüklenici (İmza)</p>
            </div>

            <div className="border-t border-slate-400 pt-0.5">
              <p className="font-bold text-slate-950">Sorumlu Taşeron Yetkilisi</p>
              <p className="text-slate-500 text-[7.5px]">Tebellüğ Eden (İmza)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};