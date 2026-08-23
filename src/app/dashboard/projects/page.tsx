'use client';

import React, { useState } from 'react';
import { ProjectSite } from '@/lib/types';
import { INITIAL_PROJECTS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Building2, Plus, Users, MapPin, UserCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSite[]>(INITIAL_PROJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    address: '',
    city: 'İstanbul',
    inspectorName: 'Ahmet Yılmaz (A Sınıfı İSG Uzmanı)',
    inspectorCertificateNo: 'İSG-A-84921',
    subcontractors: '',
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newProject: ProjectSite = {
      id: `proj-${Date.now()}`,
      name: formData.name,
      clientName: formData.clientName || 'Belirtilmedi',
      address: formData.address,
      city: formData.city,
      inspectorName: formData.inspectorName,
      inspectorCertificateNo: formData.inspectorCertificateNo,
      subcontractors: formData.subcontractors
        ? formData.subcontractors.split(',').map((s) => s.trim())
        : ['Genel Müteahhitlik Ekipleri'],
      createdAt: new Date().toISOString(),
    };

    setProjects([newProject, ...projects]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      clientName: '',
      address: '',
      city: 'İstanbul',
      inspectorName: 'Ahmet Yılmaz (A Sınıfı İSG Uzmanı)',
      inspectorCertificateNo: 'İSG-A-84921',
      subcontractors: '',
    });
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Şantiyeler & Projeler</h1>
          <p className="text-sm text-slate-500">Denetim yapılacak inşaat sahalarını ve taşeron firmalarını yönetin</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Yeni Şantiye Ekle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{proj.name}</h3>
                    <p className="text-xs text-slate-500">{proj.clientName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(proj.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{proj.address || 'Adres belirtilmedi'}, {proj.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{proj.inspectorName} ({proj.inspectorCertificateNo})</span>
                </div>
              </div>

              {/* Subcontractor chips */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>Kayıtlı Taşeron Ekipleri ({proj.subcontractors.length})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.subcontractors.map((sub, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Kayıt: {new Date(proj.createdAt).toLocaleDateString('tr-TR')}</span>
              <Link href={`/dashboard/inspections/new?projectId=${proj.id}`}>
                <Button size="sm" variant="primary">
                  Saha Denetimi Başlat
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Yeni Şantiye / Proje Ekle</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3.5 text-sm">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">Şantiye / Proje Adı *</label>
                <input
                  required
                  type="text"
                  placeholder="Örn: Torun Tower Maslak Şantiyesi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">İşveren / Müteahhit Firma</label>
                <input
                  type="text"
                  placeholder="Örn: Torunlar GYO A.Ş."
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">Şehir</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">Adres / Konum</label>
                  <input
                    type="text"
                    placeholder="Maslak Mah."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 text-xs">
                  Taşeron Ekipler (Virgülle ayırarak yazın)
                </label>
                <input
                  type="text"
                  placeholder="Kalıp & İskele, Demir Ekibi, Elektrik Taşeronu, Hafriyat"
                  value={formData.subcontractors}
                  onChange={(e) => setFormData({ ...formData, subcontractors: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" variant="primary">
                  Kaydet & Başla
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}