'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, PlanType, UserRole, InspectionReport } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/constants';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  allUsers: UserAccount[];
  allReports: InspectionReport[];
  login: (email: string) => { success: boolean; requiresVerification?: boolean; message?: string };
  logout: () => void;
  registerWithVerification: (data: { name: string; email: string; companyName: string; certificateNo: string }) => { verificationCode: string };
  verifyEmail: (email: string, code: string) => boolean;
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (profile: Partial<UserAccount>) => void;
  adminUpdateUser: (userId: string, updates: Partial<UserAccount>) => void;
  adminCreateUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  adminDeleteUser: (userId: string) => void;
  adminDeleteReport: (reportId: string) => void;
  upgradePlan: (newPlan: PlanType) => void;
  incrementReportCount: () => void;
  refreshReports: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [allReports, setAllReports] = useState<InspectionReport[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshReports = () => {
    try {
      const stored = localStorage.getItem('isg_reports');
      if (stored) {
        setAllReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('isg_users');
      if (storedUsers) {
        setAllUsers(JSON.parse(storedUsers));
      }
      const storedActiveId = localStorage.getItem('isg_active_user_id');
      if (storedActiveId) {
        setCurrentUserId(storedActiveId);
      }
      refreshReports();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveUsers = (updated: UserAccount[]) => {
    setAllUsers(updated);
    try {
      localStorage.setItem('isg_users', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const currentUser = currentUserId
    ? allUsers.find((u) => u.id === currentUserId && u.isActive) || null
    : null;

  const isAuthenticated = !!currentUser;

  const login = (email: string): { success: boolean; requiresVerification?: boolean; message?: string } => {
    const found = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!found) {
      return { success: false, message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı.' };
    }

    if (!found.isActive) {
      return { success: false, message: 'Hesabınız yönetici tarafından dondurulmuştur.' };
    }

    if (!found.isEmailVerified) {
      return { 
        success: false, 
        requiresVerification: true, 
        message: 'E-posta adresiniz henüz onaylanmamış. Lütfen 6 haneli aktivasyon kodunuzu girin.' 
      };
    }

    setCurrentUserId(found.id);
    try {
      localStorage.setItem('isg_active_user_id', found.id);
    } catch (e) {
      console.error(e);
    }
    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
    try {
      localStorage.removeItem('isg_active_user_id');
    } catch (e) {
      console.error(e);
    }
  };

  const registerWithVerification = (data: { 
    name: string; 
    email: string; 
    companyName: string; 
    certificateNo: string 
  }) => {
    // Generate a 6-digit confirmation code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      companyName: data.companyName,
      certificateNo: data.certificateNo,
      role: 'USER',
      plan: 'DEMO_1_GUN',
      planExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      reportsCount: 0,
      maxReportsAllowed: 3,
      isActive: true,
      isEmailVerified: false, // Must be verified
      emailVerificationCode: verificationCode,
      createdAt: new Date().toISOString(),
    };

    const updated = [...allUsers.filter((u) => u.email.toLowerCase() !== data.email.toLowerCase()), newUser];
    saveUsers(updated);

    return { verificationCode };
  };

  const verifyEmail = (email: string, code: string): boolean => {
    const target = allUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (target && target.emailVerificationCode === code.trim()) {
      const updated = allUsers.map((u) =>
        u.id === target.id
          ? { ...u, isEmailVerified: true, emailVerificationCode: undefined }
          : u
      );
      saveUsers(updated);
      setCurrentUserId(target.id);
      try {
        localStorage.setItem('isg_active_user_id', target.id);
      } catch (e) {
        console.error(e);
      }
      return true;
    }

    return false;
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      try {
        localStorage.setItem('isg_active_user_id', target.id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateCurrentUserProfile = (profile: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = allUsers.map((u) =>
      u.id === currentUser.id ? { ...u, ...profile } : u
    );
    saveUsers(updated);
  };

  const adminUpdateUser = (userId: string, updates: Partial<UserAccount>) => {
    const updated = allUsers.map((u) =>
      u.id === userId ? { ...u, ...updates } : u
    );
    saveUsers(updated);
  };

  const adminCreateUser = (newUser: Omit<UserAccount, 'id' | 'createdAt'>) => {
    const created: UserAccount = {
      ...newUser,
      id: `usr-${Date.now()}`,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...allUsers, created]);
  };

  const adminDeleteUser = (userId: string) => {
    if (allUsers.length <= 1) {
      alert('Son kullanıcı silinemez.');
      return;
    }
    const updated = allUsers.filter((u) => u.id !== userId);
    saveUsers(updated);
    if (currentUserId === userId) {
      setCurrentUserId(updated[0]?.id || null);
    }
  };

  const adminDeleteReport = (reportId: string) => {
    try {
      const stored = JSON.parse(localStorage.getItem('isg_reports') || '[]');
      const filtered = stored.filter((r: InspectionReport) => r.id !== reportId);
      localStorage.setItem('isg_reports', JSON.stringify(filtered));
      setAllReports(filtered);
    } catch (e) {
      console.error(e);
    }
  };

  const upgradePlan = (newPlan: PlanType) => {
    let days = 30;
    let maxReports = -1;

    if (newPlan === 'DEMO_1_GUN') {
      days = 1;
      maxReports = 3;
    } else if (newPlan === 'YILLIK_PRO') {
      days = 365;
      maxReports = -1;
    }

    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    updateCurrentUserProfile({
      plan: newPlan,
      planExpiresAt: expiresAt,
      maxReportsAllowed: maxReports,
    });
  };

  const incrementReportCount = () => {
    if (!currentUser) return;
    updateCurrentUserProfile({
      reportsCount: (currentUser.reportsCount || 0) + 1,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        allUsers,
        allReports,
        login,
        logout,
        registerWithVerification,
        verifyEmail,
        switchUser,
        updateCurrentUserProfile,
        adminUpdateUser,
        adminCreateUser,
        adminDeleteUser,
        adminDeleteReport,
        upgradePlan,
        incrementReportCount,
        refreshReports,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};