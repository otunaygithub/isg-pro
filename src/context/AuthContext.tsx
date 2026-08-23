'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, PlanType, UserRole } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/constants';

interface AuthContextType {
  currentUser: UserAccount;
  allUsers: UserAccount[];
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (profile: Partial<UserAccount>) => void;
  adminUpdateUser: (userId: string, updates: Partial<UserAccount>) => void;
  adminCreateUser: (user: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  adminDeleteUser: (userId: string) => void;
  upgradePlan: (newPlan: PlanType) => void;
  incrementReportCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>('usr-admin');

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
    } catch (e) {
      console.error(e);
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

  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    try {
      localStorage.setItem('isg_active_user_id', userId);
    } catch (e) {
      console.error(e);
    }
  };

  const updateCurrentUserProfile = (profile: Partial<UserAccount>) => {
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
      switchUser(updated[0].id);
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
    updateCurrentUserProfile({
      reportsCount: (currentUser.reportsCount || 0) + 1,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        updateCurrentUserProfile,
        adminUpdateUser,
        adminCreateUser,
        adminDeleteUser,
        upgradePlan,
        incrementReportCount,
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