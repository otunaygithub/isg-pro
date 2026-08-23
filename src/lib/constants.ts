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
