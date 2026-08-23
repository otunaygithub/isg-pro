'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  HardHat, 
  Sparkles, 
  Camera, 
  FileText, 
  Share2, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-lg text-white leading-none">
                <span>İSG</span>
                <span className="text-amber-400">PRO</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">AI</span>
              </div>
              <p className="text-[10px] text-slate-400">Saha Denetim & İhtar Sistemi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-300">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                1 Günlük Ücretsiz Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>6331 Sayılı Kanun & Yapı İSG Yönetmeliği Uyumlu</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Şantiyede Fotoğrafı Çekin, <br />
          Resmi İhtar Tutanağını <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
            Yapay Zeka Hazırlasın.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Günde 2 saatinizi Word ve Excel'de uygunsuzluk raporu yazmaya harcamayın. Sahada çektiğiniz fotoğrafları yükleyin; yapay zeka tehlikeyi, yasal mevzuat maddesini ve DÖF talimatını anında çıkarsın.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full text-base px-8 py-4" leftIcon={<Camera className="w-5 h-5" />}>
              1 Günlük Demo Başlat & Fotoğraf Yükle
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full border-slate-700 text-slate-200">
              Mevcut Üye Girişi
            </Button>
          </Link>
        </div>


        {/* Feature badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sıfır Sunucu & API Maliyeti</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tek Tıkla A4 PDF Tutanağı</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Taşerona Anlık WhatsApp Uyarısı</span>
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Nasıl Çalışır?</h2>
            <p className="text-sm text-slate-400">3 adımda şantiye denetimini tamamlayıp resmi ihtar tutanağı üretin</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="font-bold text-lg text-white">Sahada Fotoğraf Çekin</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                İster şantiyede cep telefonunuzun kamerasından anında çekin, ister galeriden topluca yükleyin.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="font-bold text-lg text-white">Mevzuatı AI Eşleştirsin</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini Vision fotoğrafı tarar; 6331 sayılı kanun maddesi, risk puanı (1-25) ve yapılması gereken DÖF eylemini çıkarır.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="font-bold text-lg text-white">PDF ve WhatsApp Çıktısı Alın</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tek tıkla ıslak imzaya hazır resmi A4 İhtar Tutanağı indirin ve ilgili taşerona WhatsApp'tan termin süreli uyarı gönderin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 ISG-Pro. İş Sağlığı ve Güvenliği Saha Otomasyon Sistemi. Vercel & Gemini AI altyapısıyla desteklenmektedir.</p>
      </footer>
    </div>
  );
}

