'use client';

import React from 'react';
import { HazardItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, AlertTriangle, Clock, Scale, Wrench, Share2 } from 'lucide-react';

interface HazardCardProps {
  hazard: HazardItem;
  onDelete?: (id: string) => void;
  onUpdate?: (updated: HazardItem) => void;
  onShareWhatsApp?: (hazard: HazardItem) => void;
}

export const HazardCard: React.FC<HazardCardProps> = ({
  hazard,
  onDelete,
  onUpdate,
  onShareWhatsApp,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5">
      {/* Photo */}
      <div className="w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative border border-slate-200 dark:border-slate-800">
        <img
          src={hazard.photoUrl}
          alt={hazard.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge severity={hazard.severity}>{hazard.severity}</Badge>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {hazard.category}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {hazard.title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {onShareWhatsApp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShareWhatsApp(hazard)}
                  title="Taşerona WhatsApp ile İlet"
                  leftIcon={<Share2 className="w-3.5 h-3.5 text-emerald-600" />}
                >
                  WhatsApp
                </Button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(hazard.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Kaydı Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {hazard.description}
          </p>

          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5">
            {/* Mevzuat */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/50 flex items-start gap-2">
              <Scale className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                  Yasal Mevzuat & Standart
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {hazard.regulationReference}
                </span>
              </div>
            </div>

            {/* DÖF / Önlem */}
            <div className="bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2">
              <Wrench className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block">
                  DÖF (Düzeltici & Önleyici Faaliyet)
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {hazard.correctiveAction}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info: Subcontractor & Deadline */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Sorumlu Taşeron:</span>
            <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              {hazard.subcontractor || 'Belirtilmedi'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Termin: <strong className="text-slate-900 dark:text-white">{hazard.deadlineHours} Saat</strong></span>
            </div>
            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Risk Skoru: <strong className="text-rose-600 dark:text-rose-400 font-bold">{hazard.riskScore}/25</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};