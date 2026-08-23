'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { HardHat, ShieldCheck, Mail, ArrowRight, UserPlus, LogIn, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, registerWithVerification, verifyEmail } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [simulatedCodeNotification, setSimulatedCodeNotification] = useState<string | null>(null);

  // Register state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [certificateNo, setCertificateNo] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email);
    if (res.success) {
      router.push('/dashboard');
    } else {
      if (res.requiresVerification) {
        setRegEmail(email);
        setMode('verify');
      }
      setErrorMsg(res.message || 'Giriş yapılamadı.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regEmail) return;
    setErrorMsg('');

    const res = registerWithVerification({
      name,
      email: regEmail,
      companyName: companyName || 'Bağımsız İSG Uzmanı',
      certificateNo: certificateNo || 'İSG-DEMO',
    });

    setSimulatedCodeNotification(res.verificationCode);
    setMode('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = verifyEmail(regEmail, verificationCode);
    if (success) {
      router.push('/dashboard/inspections/new');
    } else {
      setErrorMsg('Girdiğiniz 6 haneli aktivasyon kodu hatalı veya süresi dolmuş.');
    }
  };

  const handleQuickLogin = (quickEmail: string) => {
    const res = login(quickEmail);
    if (res.success) {
      router.push('/dashboard');
    }
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
            {mode === 'login' && 'İSG Uzmanı Güvenli Giriş'}
            {mode === 'register' && 'Demo Üyelik Başvurusu'}
            {mode === 'verify' && 'E-Posta Güvenlik Onayı'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && 'Saha denetim paneline ve resmi raporlarınıza erişin'}
            {mode === 'register' && 'Doğrulanmış e-posta adresiyle 1 günlük demo aktivasyonu'}
            {mode === 'verify' && `${regEmail} adresine gönderilen 6 haneli aktivasyon kodunu girin`}
          </p>
        </div>

        {/* Tab Toggle */}
        {mode !== 'verify' && (
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
              <span>Yeni Kayıt & Onay</span>
            </button>
          </div>
        )}

        {/* Form Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          {/* Simulated Email Notification Banner */}
          {simulatedCodeNotification && mode === 'verify' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Gelen E-Posta Simülasyonu</span>
              </div>
              <p className="text-[11px] text-emerald-400/90">
                <strong>{regEmail}</strong> adresinize doğrulama kodu gönderildi:
              </p>
              <div className="bg-slate-950/80 p-2 rounded-xl text-center font-mono text-base font-black text-amber-400 tracking-widest">
                {simulatedCodeNotification}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {mode === 'login' && (
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
                    👑 Tam Yetkili Admin
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
          )}

          {mode === 'register' && (
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
                <label className="block font-semibold text-slate-300 mb-1">Gerçek E-Posta Adresi (Doğrulama Gönderilir) *</label>
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
                <Button type="submit" variant="primary" size="lg" className="w-full" leftIcon={<Mail className="w-4 h-4" />}>
                  Doğrulama Kodu Gönder & Devam Et
                </Button>
              </div>
            </form>
          )}

          {mode === 'verify' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">6 Haneli Aktivasyon Kodu</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-amber-400 font-mono text-center text-xl font-bold tracking-widest focus:border-amber-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" leftIcon={<KeyRound className="w-4 h-4" />}>
                Hesabı Doğrula & Demo Başlat
              </Button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  &larr; E-posta adresini değiştir
                </button>
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