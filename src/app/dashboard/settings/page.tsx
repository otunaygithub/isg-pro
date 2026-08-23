'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIGS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, Key, User, Check, Sparkles, Zap, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SettingsPage() {
  const { currentUser, updateCurrentUserProfile, upgradePlan } = useAuth();

  const [inspectorName, setInspectorName] = useState('');
  const [certificateNo, setCertificateNo] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setInspectorName(currentUser.name || '');
      setCertificateNo(currentUser.certificateNo || '');
      setCompanyName(currentUser.companyName || '');
    }
    const savedKey = localStorage.getItem('user_gemini_key');
    if (savedKey) setApiKey(savedKey);
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('user_gemini_key', apiKey);
    }
    updateCurrentUserProfile({
      name: inspectorName,
      certificateNo: certificateNo,
      companyName: companyName,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleUpgrade = (planKey: 'DEMO_1_GUN' | 'AYLIK_PRO' | 'YILLIK_PRO') => {
    upgradePlan(planKey);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
    alert(`${PLAN_CONFIGS[planKey].name} başarıyla tanımlandı!`);
  };

  const planInfo = PLAN_CONFIGS[currentUser?.plan || 'DEMO_1_GUN'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Hesap & Üyelik Ayarları</h1>
        <p className="text-sm text-slate-500">
          İSG Katip yetki bilgilerinizi düzenleyin ve aktif üyelik paketinizi yönetin
        </p>
      </div>

      {/* Subscription Status & Plans Selection */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mevcut Üyelik Paketiniz:</span>
              <Badge variant={planInfo?.badgeVariant || 'default'}>
                {planInfo?.name}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Bitiş Tarihi: <strong className="text-white">{formatDate(currentUser?.planExpiresAt)}</strong> • Rapor Kotası: <strong className="text-white">{currentUser?.maxReportsAllowed === -1 ? 'Sınırsız' : `${currentUser?.reportsCount || 0}/${currentUser?.maxReportsAllowed} Rapor`}</strong>
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <div>
          <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Paket Seçenekleri (Kullanıcı / OSGB Paketleri)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1 Gun Demo */}
            <div className={`bg-slate-950 p-4 rounded-2xl border ${currentUser?.plan === 'DEMO_1_GUN' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-800'} space-y-3 flex flex-col justify-between`}>
              <div className="space-y-1.5">
                <span className="font-bold text-sm text-white block">1 Günlük Deneme</span>
                <span className="text-lg font-black text-amber-400 block">Ücretsiz</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Sistemi ve AI görsel analizini test etmek için 24 saat geçerli 3 rapor hakkı.
                </p>
              </div>
              <Button
                size="sm"
                variant={currentUser?.plan === 'DEMO_1_GUN' ? 'outline' : 'primary'}
                onClick={() => handleUpgrade('DEMO_1_GUN')}
                disabled={currentUser?.plan === 'DEMO_1_GUN'}
              >
                {currentUser?.plan === 'DEMO_1_GUN' ? 'Aktif Paket' : 'Demo Başlat (1 Gün)'}
              </Button>
            </div>

            {/* Aylik Pro */}
            <div className={`bg-slate-950 p-4 rounded-2xl border ${currentUser?.plan === 'AYLIK_PRO' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-800'} space-y-3 flex flex-col justify-between`}>
              <div className="space-y-1.5">
                <span className="font-bold text-sm text-white block">Aylık Profesyonel</span>
                <span className="text-lg font-black text-emerald-400 block">990 ₺ <span className="text-xs font-normal text-slate-400">/ ay</span></span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bireysel İSG uzmanları için sınırsız şantiye, sınırsız AI denetimi ve resmi A4 tutanaklar.
                </p>
              </div>
              <Button
                size="sm"
                variant={currentUser?.plan === 'AYLIK_PRO' ? 'outline' : 'primary'}
                onClick={() => handleUpgrade('AYLIK_PRO')}
                disabled={currentUser?.plan === 'AYLIK_PRO'}
              >
                {currentUser?.plan === 'AYLIK_PRO' ? 'Aktif Paket' : 'Aylık Pakete Geç'}
              </Button>
            </div>

            {/* Yillik Kurumsal */}
            <div className={`bg-slate-950 p-4 rounded-2xl border ${currentUser?.plan === 'YILLIK_PRO' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-800'} space-y-3 flex flex-col justify-between relative overflow-hidden`}>
              <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[9px]">
                %25 Avantajlı
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-sm text-white block">Yıllık Kurumsal & OSGB</span>
                <span className="text-lg font-black text-amber-400 block">8.900 ₺ <span className="text-xs font-normal text-slate-400">/ yıl</span></span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  OSGB firmaları ve şantiyeler için 365 gün sınırsız raporlama ve öncelikli AI desteği.
                </p>
              </div>
              <Button
                size="sm"
                variant={currentUser?.plan === 'YILLIK_PRO' ? 'outline' : 'primary'}
                onClick={() => handleUpgrade('YILLIK_PRO')}
                disabled={currentUser?.plan === 'YILLIK_PRO'}
              >
                {currentUser?.plan === 'YILLIK_PRO' ? 'Aktif Paket' : 'Yıllık Pakete Geç'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" />
            <span>İSG Uzmanı & Yetki Bilgileriniz</span>
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
              <Check className="w-4 h-4" /> Profil Bilgileriniz Kaydedildi!
            </span>
          ) : <span />}

          <Button type="submit" variant="primary" size="lg">
            Profil Bilgilerini Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}