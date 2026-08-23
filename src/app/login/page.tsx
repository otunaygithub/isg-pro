'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { HardHat, ShieldCheck, Key, ArrowRight, UserPlus, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, allUsers } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [certificateNo, setCertificateNo] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(email);
    if (success) {
      router.push('/dashboard');
    } else {
      setErrorMsg('Bu e-posta adresiyle kayıtlı aktif bir üyelik bulunamadı.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regEmail) return;

    register({
      name,
      email: regEmail,
      companyName: companyName || 'Bağımsız İSG Uzmanı',
      certificateNo: certificateNo || 'İSG-DEMO',
    });

    router.push('/dashboard/inspections/new');
  };

  const handleQuickLogin = (quickEmail: string) => {
    login(quickEmail);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <HardHat className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 font-black text-xl text-white leading-none">
                <span>İSG</span>
                <span className="text-amber-400">PRO</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">AI</span>
              </div>
              <p className="text-[11px] text-slate-400">Yetkili Saha Denetim Sistemi</p>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">
            {mode === 'login' ? 'İSG Uzmanı Güvenli Giriş' : '1 Günlük Ücretsiz Demo Hesabı Aç'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Saha denetim paneline ve resmi raporlarınıza erişin'
              : '24 saat geçerli 3 adet AI saha denetim hakkı anında tanımlanır'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Mevcut Üye Girişi</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Yeni Demo Üyelik</span>
          </button>
        </div>

        {/* Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Kayıtlı E-Posta Adresiniz</label>
                <input
                  required
                  type="email"
                  placeholder="uzman@firma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                Panele Giriş Yap
              </Button>

              {/* Quick Demo Accounts */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block text-center">
                  Tek Tıkla Hızlı Test Girişi Yap:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@isgpro.com')}
                    className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-bold transition-all text-left"
                  >
                    👑 Admin Hesabı
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('demo@isguzmani.com')}
                    className="p-2 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-800 text-slate-300 text-[11px] font-medium transition-all text-left"
                  >
                    👷 1 Günlük Demo
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Ad Soyad & Unvan *</label>
                <input
                  required
                  type="text"
                  placeholder="Ahmet Yılmaz (A Sınıfı)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">E-Posta Adresi *</label>
                <input
                  required
                  type="email"
                  placeholder="ahmet@isguzmani.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">İSG Belge No</label>
                  <input
                    type="text"
                    placeholder="İSG-A-12345"
                    value={certificateNo}
                    onChange={(e) => setCertificateNo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Firma / OSGB</label>
                  <input
                    type="text"
                    placeholder="Örn: Kuzey İSG"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" className="w-full" leftIcon={<Sparkles className="w-4 h-4" />}>
                  1 Günlük Ücretsiz Demo Başlat
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            &larr; Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}