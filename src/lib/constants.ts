export const TURKISH_ISG_REGULATIONS = [
  {
    code: '6331-M10',
    title: '6331 Sayılı İSG Kanunu - Madde 10 (Risk Değerlendirmesi, Kontrol ve Ölçüm)',
    category: 'Genel Saha Emniyeti',
  },
  {
    code: 'YAPI-EK4-M2',
    title: 'Yapı İşlerinde İSG Yönetmeliği Ek-4 - Yüksekte Çalışma & Düşmeyi Önleyici Sistemler',
    category: 'Yüksekte Çalışma & İskele',
  },
  {
    code: 'KKD-YON-M6',
    title: 'Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik - Madde 6',
    category: 'Kişisel Koruyucu Donanım (KKD)',
  },
  {
    code: 'ELEK-KUV-AKIM',
    title: 'Elektrik Kuvvetli Akım Tesisleri & Topraklamalar Yönetmeliği - Şantiye Panoları & Kaçak Akım Rölesi',
    category: 'Elektrik & Tesisat Güvenliği',
  },
  {
    code: 'YAPI-EK4-M12',
    title: 'Yapı İşlerinde İSG Yönetmeliği Ek-4 - Kazı İşleri, Şev Açısı ve İksa Tedbirleri',
    category: 'Kazı, İksa & Çökme Tehlikesi',
  },
  {
    code: 'BINALAR-YANGIN',
    title: 'Binaların Yangından Korunması Hakkında Yönetmelik - Şantiye Yangın Söndürme Ekipmanları & Sıcak İş İzni',
    category: 'Yangın & Acil Durum',
  },
  {
    code: 'IS-EKIP-YON',
    title: 'İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği - Periyodik Kontrol & Operatör Belgesi',
    category: 'İş Ekipmanları & İş Makineleri',
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'Vadi Panorama Konutları Şantiyesi',
    clientName: 'Yılmaz İnşaat Taahhüt A.Ş.',
    address: 'Büyükdere Cad. No:142 Maslak',
    city: 'İstanbul',
    subcontractors: ['Kalıp & Demir Ekibi (Öz-Taş)', 'Elektrik Taşeronu (Akar Güç)', 'Dış Cephe & İskele (Gökdelen İskele)', 'Mekanik Tesisat (Termo-Tek)'],
    inspectorName: 'Ahmet Yılmaz (A Sınıfı İSG Uzmanı)',
    inspectorCertificateNo: 'İSG-A-84921',
    createdAt: new Date().toISOString()
  },
  {
    id: 'proj-2',
    name: 'Ege Lojistik Depo & Antrepo Projesi',
    clientName: 'Akdeniz Lojistik A.Ş.',
    address: 'Torbalı OSB 4. Cadde',
    city: 'İzmir',
    subcontractors: ['Çelik Konstrüksiyon (Mega Çelik)', 'Zemin & Hafriyat (Ege Kazı)', 'Genel İnce İşler'],
    inspectorName: 'Selin Demir (B Sınıfı İSG Uzmanı)',
    inspectorCertificateNo: 'İSG-B-43119',
    createdAt: new Date().toISOString()
  }
];

export const PLAN_CONFIGS = {
  DEMO_1_GUN: {
    name: '1 Günlük Deneme Paketi',
    durationDays: 1,
    maxReports: 3,
    badge: '1 Günlük Demo',
    badgeVariant: 'warning' as const,
    price: 'Ücretsiz',
  },
  AYLIK_PRO: {
    name: 'Aylık Profesyonel İSG',
    durationDays: 30,
    maxReports: -1,
    badge: 'Aylık Pro',
    badgeVariant: 'success' as const,
    price: '990 ₺ / Ay',
  },
  YILLIK_PRO: {
    name: 'Yıllık Kurumsal & OSGB',
    durationDays: 365,
    maxReports: -1,
    badge: 'Yıllık Pro',
    badgeVariant: 'info' as const,
    price: '8.900 ₺ / Yıl',
  },
};

export const INITIAL_USERS = [
  {
    id: 'usr-admin',
    email: 'admin@isgpro.com',
    name: 'Sistem Yöneticisi (Admin)',
    companyName: 'ISG-Pro Merkez Yönetim',
    certificateNo: 'İSG-BAKANLIK-ADM01',
    role: 'ADMIN' as const,
    plan: 'YILLIK_PRO' as const,
    planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    reportsCount: 42,
    maxReportsAllowed: -1,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-demo',
    email: 'demo@isguzmani.com',
    name: 'Ahmet Yılmaz (A Sınıfı)',
    companyName: 'Kuzey İSG Mühendislik',
    certificateNo: 'İSG-A-84921',
    role: 'USER' as const,
    plan: 'DEMO_1_GUN' as const,
    planExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    reportsCount: 1,
    maxReportsAllowed: 3,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-monthly',
    email: 'selin.demir@osgb.com',
    name: 'Selin Demir (B Sınıfı)',
    companyName: 'Akdeniz Ortak Sağlık Güvenlik Birimi (OSGB)',
    certificateNo: 'İSG-B-43119',
    role: 'USER' as const,
    plan: 'AYLIK_PRO' as const,
    planExpiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    reportsCount: 8,
    maxReportsAllowed: -1,
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  }
];


