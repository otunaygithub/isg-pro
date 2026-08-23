'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_PROJECTS } from '@/lib/constants';
import { HazardItem, ProjectSite, AIAnalysisResult, RiskSeverity } from '@/lib/types';
import { PhotoUploader } from '@/components/inspection/PhotoUploader';
import { HazardCard } from '@/components/inspection/HazardCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Save, FileText, ArrowLeft, Building2, CheckCircle2, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

function NewInspectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || INITIAL_PROJECTS[0].id;

  const { currentUser, incrementReportCount } = useAuth();
  const [projects] = useState<ProjectSite[]>(INITIAL_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hazards, setHazards] = useState<HazardItem[]>([]);
  const [reportNotes, setReportNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const isQuotaExceeded =
    currentUser?.maxReportsAllowed !== -1 &&
    (currentUser?.reportsCount || 0) >= (currentUser?.maxReportsAllowed || 3);



  const handleAnalyzePhotos = async (
    files: { base64: string; mimeType: string; note?: string }[]
  ) => {
    if (isQuotaExceeded) {
      alert('1 Günlük Demo paketinizdeki 3 adet AI analiz hakkınız dolmuştur. Lütfen devam etmek için paketinizi yükseltin.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const userApiKey = typeof window !== 'undefined' ? localStorage.getItem('user_gemini_key') || undefined : undefined;
      const newHazardItems: HazardItem[] = [];

      for (const file of files) {
        // Call /api/analyze route
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: file.base64,
            mimeType: file.mimeType,
            userNote: file.note,
            apiKey: userApiKey,
          }),
        });

        const json = await res.json();
        const data: AIAnalysisResult = json.data;

        newHazardItems.push({
          id: `haz-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          photoUrl: file.base64,
          title: data.title || 'Mevzuata Aykırı Saha Durumu',
          description: data.description,
          category: data.category,
          severity: data.severity,
          riskScore: data.riskScore || 15,
          regulationReference: data.regulationReference,
          correctiveAction: data.correctiveAction,
          deadlineHours: data.deadlineHours || 24,
          subcontractor: currentProject.subcontractors[0] || data.suggestedSubcontractor || 'Ana Yüklenici',
          status: 'AÇIK',
        });
      }

      setHazards((prev) => [...prev, ...newHazardItems]);
      // AI analiz butonuna basıldığında kullanım hakkını düşür
      incrementReportCount();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
    } catch (error) {
      console.error('Analiz hatası:', error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteHazard = (id: string) => {
    setHazards(hazards.filter((h) => h.id !== id));
  };

  const handleShareWhatsApp = (hazard: HazardItem) => {
    const message = `🚨 *İSG UYGUNSUZLUK & DÖF BİLDİRİMİ* 🚨\n\n*Şantiye:* ${currentProject.name}\n*Taşeron:* ${hazard.subcontractor}\n*Tehlike:* ${hazard.title}\n*Seviye:* ${hazard.severity} (Risk: ${hazard.riskScore}/25)\n\n*Yasal Dayanak:* ${hazard.regulationReference}\n\n*Yapılması Gereken (DÖF):* ${hazard.correctiveAction}\n\n*Termin Süresi:* ${hazard.deadlineHours} SAAT İÇİNDE GİDERİLMELİDİR.\n\n_Bu mesaj 6331 sayılı İSG Kanunu uyarınca İSG-Pro sistemi tarafından oluşturulmuştur._`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSaveReport = () => {
    if (hazards.length === 0) {
      alert('Lütfen en az bir uygunsuzluk fotoğrafı analiz ettirin.');
      return;
    }

    setIsSaving(true);
    const reportId = `rep-${Date.now()}`;
    const reportData = {
      id: reportId,
      projectId: currentProject.id,
      siteName: currentProject.name,
      clientName: currentProject.clientName,
      inspectorName: currentProject.inspectorName,
      inspectorCertificateNo: currentProject.inspectorCertificateNo,
      inspectionDate: new Date().toISOString().split('T')[0],
      reportNo: `İSG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      summaryNotes: reportNotes,
      hazards,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage for demo / prototype persistence
    try {
      const existing = JSON.parse(localStorage.getItem('isg_reports') || '[]');
      localStorage.setItem('isg_reports', JSON.stringify([reportData, ...existing]));
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsSaving(false);
      router.push(`/dashboard/inspections/${reportId}/report`);
    }, 600);
  };


  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Quota Exceeded Alert */}
      {isQuotaExceeded && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>
              <strong>Rapor Kotanız Doldu:</strong> 1 Günlük Demo paketinizdeki 3 rapor limitine ulaştınız. Sınırsız denetim yapmak için paketinizi yükseltin.
            </span>
          </div>
          <Link href="/dashboard/settings">
            <Button size="sm" variant="danger">Paketi Yükselt (Pro)</Button>
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Yeni AI Saha Denetimi</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h1>
            <p className="text-xs text-slate-500">
              Fotoğrafları yükleyin, Gemini Flash Türk İSG mevzuatına göre analizi çıkarsın
            </p>
          </div>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Building2 className="w-4 h-4 text-amber-500 ml-2" />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-xs font-semibold bg-transparent border-none focus:outline-none text-slate-900 dark:text-white pr-3 cursor-pointer"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 1: Upload & AI Analysis */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Saha Fotoğrafları & Yapay Zeka Taraması
          </h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gemini Vision Free Tier Aktif
          </span>
        </div>
        <PhotoUploader onAnalyze={handleAnalyzePhotos} isAnalyzing={isAnalyzing} />
      </div>

      {/* Step 2: Analyzed Hazards List */}
      {hazards.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                2. Tespit Edilen Uygunsuzluklar & Mevzuat Maddeleri ({hazards.length})
              </h2>
              <p className="text-xs text-slate-500">
                Gerektiğinde detayları düzenleyebilir veya sorumlu taşerona tek tıkla WhatsApp uyarısı atabilirsiniz.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {hazards.map((item) => (
              <HazardCard
                key={item.id}
                hazard={item}
                onDelete={handleDeleteHazard}
                onShareWhatsApp={handleShareWhatsApp}
              />
            ))}
          </div>

          {/* Action Bar */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 shadow-xl">
            <div>
              <h3 className="font-bold text-base">Denetim Raporu Tanzim Edilmeye Hazır</h3>
              <p className="text-xs text-slate-400">
                Toplam {hazards.length} uygunsuzluk resmi A4 İSG İhtar Tutanağı formatına dönüştürülecek.
              </p>
            </div>

            <Button
              size="lg"
              variant="primary"
              onClick={handleSaveReport}
              isLoading={isSaving}
              leftIcon={<FileText className="w-5 h-5" />}
            >
              Resmi PDF Raporu & Tutanağı Oluştur
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewInspectionPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Yükleniyor...</div>}>
      <NewInspectionContent />
    </Suspense>
  );
}