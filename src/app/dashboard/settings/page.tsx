'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Key, User, Check, Sparkles, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [inspectorName, setInspectorName] = useState('Ahmet Yılmaz');
  const [certificateNo, setCertificateNo] = useState('İSG-A-84921');
  const [companyName, setCompanyName] = useState('Kuzey İSG Mühendislik & Danışmanlık');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('user_gemini_key');
      if (savedKey) setApiKey(savedKey);

      const savedProfile = localStorage.getItem('user_isg_profile');
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        setInspectorName(p.inspectorName || '');
        setCertificateNo(p.certificateNo || '');
        setCompanyName(p.companyName || '');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (apiKey) {
        localStorage.setItem('user_gemini_key', apiKey);
      }
      localStorage.setItem(
        'user_isg_profile',
        JSON.stringify({ inspectorName, certificateNo, companyName })
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">İSG Uzmanı & Sistem Ayarları</h1>
        <p className="text-sm text-slate-500">
          Raporlarda ve yasal tutanaklarda görünecek belge ve yetki bilgilerinizi özelleştirin
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <span>Denetçi & İSG Uzmanı Bilgileri</span>
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                İSG Uzmanı Adı Soyadı & Unvanı
              </label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                İSG Katip / Bakanlık Belge No (A/B/C Sınıfı)
              </label>
              <input
                type="text"
                value={certificateNo}
                onChange={(e) => setCertificateNo(e.target.value)}
                placeholder="Örn: İSG-A-84921"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                OSGB veya Firma Unvanı
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* API Settings Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              <span>Google Gemini AI API Yapılandırması</span>
            </h3>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2 py-0.5 rounded">
              %100 Ücretsiz Free Tier
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Google AI Studio üzerinden alacağınız API anahtarı ile günde 1.500 görsel analizi tamamen ücretsiz olarak yapabilirsiniz. İstemezseniz sistem akıllı simülasyon modunda da çalışır.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Özel Gemini API Key (Opsiyonel)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved ? (
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Ayarlar Başarıyla Kaydedildi!
            </span>
          ) : <span />}

          <Button type="submit" variant="primary" size="lg">
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}