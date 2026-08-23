'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIGS } from '@/lib/constants';
import { PlanType, UserAccount, UserRole, InspectionReport } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { 
  ShieldCheck, 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Key, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Building,
  UserCheck,
  FileText,
  Eye,
  ExternalLink,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const { 
    currentUser, 
    allUsers, 
    allReports,
    switchUser, 
    adminUpdateUser, 
    adminCreateUser, 
    adminDeleteUser,
    adminDeleteReport,
    refreshReports
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
    refreshReports();
  }, [currentUser, router]);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    companyName: string;
    certificateNo: string;
    role: UserRole;
    plan: PlanType;
    durationDays: number;
    isActive: boolean;
    isEmailVerified: boolean;
  }>({
    name: '',
    email: '',
    companyName: '',
    certificateNo: '',
    role: 'USER',
    plan: 'DEMO_1_GUN',
    durationDays: 1,
    isActive: true,
    isEmailVerified: true,
  });

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-xs text-rose-500 font-semibold">
        Bu sayfaya erişim yetkiniz bulunmamaktadır. Yalnızca Admin kullanıcılar görüntüleyebilir.
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      companyName: '',
      certificateNo: '',
      role: 'USER',
      plan: 'DEMO_1_GUN',
      durationDays: 1,
      isActive: true,
      isEmailVerified: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      certificateNo: user.certificateNo,
      role: user.role,
      plan: user.plan,
      durationDays: user.plan === 'DEMO_1_GUN' ? 1 : user.plan === 'AYLIK_PRO' ? 30 : 365,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expiresAt = new Date(Date.now() + formData.durationDays * 24 * 60 * 60 * 1000).toISOString();
    const maxReports = formData.plan === 'DEMO_1_GUN' ? 3 : -1;

    if (editingUser) {
      adminUpdateUser(editingUser.id, {
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        certificateNo: formData.certificateNo,
        role: formData.role,
        plan: formData.plan,
        planExpiresAt: expiresAt,
        maxReportsAllowed: maxReports,
        isActive: formData.isActive,
        isEmailVerified: formData.isEmailVerified,
      });
    } else {
      adminCreateUser({
        name: formData.name,
        email: formData.email,
        companyName: formData.companyName,
        certificateNo: formData.certificateNo,
        role: formData.role,
        plan: formData.plan,
        planExpiresAt: expiresAt,
        reportsCount: 0,
        maxReportsAllowed: maxReports,
        isActive: formData.isActive,
        isEmailVerified: formData.isEmailVerified,
      });
    }

    setIsModalOpen(false);
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = allReports.filter(r =>
    r.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Sistem Yönetim & Admin Merkezi</span>
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500">
            Tüm üyelikleri yönetin, şüpheli hesapları dondurun, süreleri uzatın veya oluşturulan tüm denetim raporlarını inceleyin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'users' && (
            <Button onClick={handleOpenCreate} leftIcon={<UserPlus className="w-4 h-4" />}>
              Yeni Üyelik / Kullanıcı Ekle
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kullanıcı & Üyelik Yönetimi ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'reports'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Tüm Sistem Raporları & Tutanaklar ({allReports.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={activeTab === 'users' ? 'İsim, e-posta veya firma ara...' : 'Şantiye adı, rapor no veya denetçi ara...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Kullanıcı & Şirket</th>
                  <th className="p-4">Durum & E-Posta Onayı</th>
                  <th className="p-4">Rol & Yetki</th>
                  <th className="p-4">Paket</th>
                  <th className="p-4">Bitiş Tarihi</th>
                  <th className="p-4">AI Kullanım / Hak</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.map((u) => {
                  const planInfo = PLAN_CONFIGS[u.plan];
                  const isExpired = new Date(u.planExpiresAt).getTime() < Date.now();

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <strong className="text-slate-900 dark:text-white block text-sm">{u.name}</strong>
                        <span className="text-[11px] text-slate-500">{u.email} • {u.companyName}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {u.isActive ? (
                            <span className="inline-block bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-[9.5px]">
                              Aktif Hesap
                            </span>
                          ) : (
                            <span className="inline-block bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-bold px-2 py-0.5 rounded text-[9.5px]">
                              Donduruldu (Ban)
                            </span>
                          )}
                          <span className="block text-[9.5px] text-slate-500">
                            {u.isEmailVerified ? '✓ E-Posta Onaylı' : '⏳ Onay Bekliyor'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={u.role === 'ADMIN' ? 'critical' : 'default'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={planInfo?.badgeVariant || 'default'}>
                          {planInfo?.name || u.plan}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className={isExpired ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                          {formatDate(u.planExpiresAt)}
                        </span>
                        {isExpired && <span className="block text-[9px] text-rose-500 font-semibold">Süresi Doldu</span>}
                      </td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                        {u.maxReportsAllowed === -1
                          ? `${u.reportsCount || 0} / Sınırsız`
                          : `${u.reportsCount || 0} / ${u.maxReportsAllowed} Hak`}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(u)}
                            leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                          >
                            Düzenle & Uzat
                          </Button>
                          <button
                            onClick={() => adminDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Kullanıcıyı Tamamen Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GLOBAL INSPECTION REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Henüz sistemde kayıtlı denetim raporu bulunmamaktadır.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Rapor No & Şantiye</th>
                    <th className="p-4">İşveren / Müşteri</th>
                    <th className="p-4">Denetçi İSG Uzmanı</th>
                    <th className="p-4">Tarih</th>
                    <th className="p-4">Uygunsuzluk Sayısı</th>
                    <th className="p-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredReports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <strong className="text-slate-900 dark:text-white block font-mono">{rep.reportNo}</strong>
                        <span className="text-[11px] text-slate-500">{rep.siteName}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                        {rep.clientName}
                      </td>
                      <td className="p-4">
                        <span className="text-slate-900 dark:text-white font-medium block">{rep.inspectorName}</span>
                        <span className="text-[10px] text-slate-500">{rep.inspectorCertificateNo || 'Belge No Yok'}</span>
                      </td>
                      <td className="p-4 text-slate-700 dark:text-slate-300">
                        {formatDate(rep.inspectionDate)}
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          {rep.hazards?.length || 0} Tehlike
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/inspections/${rep.id}/report`}>
                            <Button size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                              Görüntüle (PDF)
                            </Button>
                          </Link>
                          <button
                            onClick={() => adminDeleteReport(rep.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Raporu Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit / Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                {editingUser ? 'Kullanıcı & Yetki Düzenle' : 'Yeni Kullanıcı & Üyelik Tanımla'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Ad Soyad *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">E-Posta *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">İSG Belge No</label>
                  <input
                    type="text"
                    placeholder="İSG-A-84921"
                    value={formData.certificateNo}
                    onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Firma / OSGB Adı</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Rol / Yetki Seviyesi</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="USER">USER (Standart Kullanıcı)</option>
                    <option value="ADMIN">ADMIN (Tam Yetkili Yönetici)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Üyelik Paketi</label>
                  <select
                    value={formData.plan}
                    onChange={(e) => {
                      const newPlan = e.target.value as PlanType;
                      const days = newPlan === 'DEMO_1_GUN' ? 1 : newPlan === 'AYLIK_PRO' ? 30 : 365;
                      setFormData({ ...formData, plan: newPlan, durationDays: days });
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="DEMO_1_GUN">1 Günlük Demo (3 Rapor)</option>
                    <option value="AYLIK_PRO">Aylık Pro (Sınırsız)</option>
                    <option value="YILLIK_PRO">Yıllık Pro (Sınırsız)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Geçerlilik Süresi (Gün)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Hesap Durumu (Ban / Aktif)
                  </label>
                  <select
                    value={formData.isActive ? '1' : '0'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === '1' })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="1">Aktif Hesap</option>
                    <option value="0">Donduruldu (Giriş Engelli)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  İptal
                </Button>
                <Button type="submit" variant="primary">
                  {editingUser ? 'Değişiklikleri Kaydet' : 'Kullanıcıyı Oluştur'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}