export type RiskSeverity = 'DÜŞÜK' | 'ORTA' | 'YÜKSEK' | 'ACİL_DURDURMA';

export type UserRole = 'ADMIN' | 'USER';

export type PlanType = 'DEMO_1_GUN' | 'AYLIK_PRO' | 'YILLIK_PRO';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  companyName: string;
  certificateNo: string; // İSG Katip Belge No
  role: UserRole;
  plan: PlanType;
  planExpiresAt: string; // ISO Date string
  reportsCount: number;
  maxReportsAllowed: number; // 1 günlük demo için 3 rapor, aylık/yıllık için sınırsız (-1)
  isActive: boolean;
  createdAt: string;
}

export type HazardCategory = 
  | 'Yüksekte Çalışma & İskele'
  | 'Kişisel Koruyucu Donanım (KKD)'
  | 'Elektrik & Tesisat Güvenliği'
  | 'Kazı, İksa & Çökme Tehlikesi'
  | 'Yangın & Acil Durum'
  | 'İş Ekipmanları & İş Makineleri'
  | 'İstifleme, Düzen & Temizlik'
  | 'Kimyasal & Tehlikeli Maddeler'
  | 'Genel Saha Emniyeti';

export interface HazardItem {
  id: string;
  photoUrl: string;
  title: string;
  description: string;
  location?: string;
  category: HazardCategory;
  severity: RiskSeverity;
  riskScore: number;
  regulationReference: string;
  correctiveAction: string;
  deadlineHours: number;
  subcontractor: string;
  status: 'AÇIK' | 'DÜZELTİLDİ' | 'BEKLEMEDE';
}

export interface ProjectSite {
  id: string;
  name: string;
  clientName: string;
  address: string;
  city: string;
  subcontractors: string[];
  inspectorName: string;
  inspectorCertificateNo?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface InspectionReport {
  id: string;
  projectId: string;
  siteName: string;
  clientName: string;
  inspectorName: string;
  inspectorCertificateNo?: string;
  inspectionDate: string;
  reportNo: string;
  summaryNotes?: string;
  hazards: HazardItem[];
  createdAt: string;
}

export interface AIAnalysisResult {
  title: string;
  description: string;
  category: HazardCategory;
  severity: RiskSeverity;
  riskScore: number;
  regulationReference: string;
  correctiveAction: string;
  deadlineHours: number;
  suggestedSubcontractor: string;
}

