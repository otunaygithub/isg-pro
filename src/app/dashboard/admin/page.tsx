'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PLAN_CONFIGS } from '@/lib/constants';

import { PlanType, UserAccount, UserRole } from '@/lib/types';
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
  UserCheck
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const { 
    currentUser, 
    allUsers, 
    switchUser, 
    adminUpdateUser, 
    adminCreateUser, 
    adminDeleteUser 
  } = useAuth();

  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.replace('/dashboard');
    }
  }, [currentUser, router]);

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-xs text-rose-500 font-semibold">
        Bu sayfaya erişim yetkiniz bulunmamaktadır. Yalnızca Admin kullanıcılar görüntüleyebilir.
      </div>
    );
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    companyName: string;
    certificateNo: string;
    role: UserRole;
    plan: PlanType;
    durationDays: number;
    isActive: boolean;
  }>({
    name: '',
    email: '',
    companyName: '',
    certificateNo: '',
    role: 'USER',
    plan: 'DEMO_1_GUN',
    durationDays: 1,
    isActive: true,
  });

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
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Admin Üyelik & Yetki Yönetimi</span>
            <ShieldCheck className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-sm text-slate-500">
            1 Günlük Demo, Aylık ve Yıllık üyelikleri oluşturun, sürelerini uzatın veya hesapları düzenleyin.
          </p>
        </div>

        <Button onClick={handleOpenCreate} leftIcon={<UserPlus className="w-4 h-4" />}>
          Yeni Kullanıcı / Üyelik Ekle
        </Button>
      </div>

      {/* Active User Switcher Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">Şu An Aktif Olan Hesap:</span>
            <strong className="text-sm text-slate-900 dark:text-white">
              {currentUser.name} ({currentUser.role === 'ADMIN' ? 'Admin' : PLAN_CONFIGS[currentUser.plan]?.name})
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Hesap Değiştir:</span>
          <select
            value={currentUser.id}
            onChange={(e) => switchUser(e.target.value)}
            className="text-xs font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} - [{PLAN_CONFIGS[u.plan]?.name}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <span>Kayıtlı Kullanıcılar & Paketler ({allUsers.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-white font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-4">Kullanıcı & Şirket</th>
                <th className="p-4">İSG Belge No</th>
                <th className="p-4">Rol & Yetki</th>
                <th className="p-4">Aktif Paket</th>
                <th className="p-4">Bitiş Tarihi</th>
                <th className="p-4">Kullanım / Hak</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allUsers.map((u) => {
                const planInfo = PLAN_CONFIGS[u.plan];
                const isExpired = new Date(u.planExpiresAt).getTime() < Date.now();

                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <strong className="text-slate-900 dark:text-white block text-sm">{u.name}</strong>
                      <span className="text-[11px] text-slate-500">{u.email} • {u.companyName}</span>
                    </td>
                    <td className="p-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {u.certificateNo || 'Yok'}
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
                        : `${u.reportsCount || 0} / ${u.maxReportsAllowed} Rapor`}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(u)}
                          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                        >
                          Düzenle & Süre Uzat
                        </Button>
                        <button
                          onClick={() => adminDeleteUser(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Kullanıcıyı Sil"
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

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tanımlanacak Gün Süresi (Bugünden İtibaren)
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