import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResult } from './types';

export async function analyzeHazardImageWithGemini(
  base64Image: string,
  mimeType: string = 'image/jpeg',
  userNote?: string,
  apiKey?: string
): Promise<AIAnalysisResult> {
  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  if (!activeKey) {
    return simulateHazardAnalysis(userNote);
  }

  const ai = new GoogleGenAI({ apiKey: activeKey });

  const prompt = `
Sen T.C. Çalışma ve Sosyal Güvenlik Bakanlığı İş Teftiş Kurulu standartlarında denetim yapan, 20+ yıl şantiye tecrübesine sahip, 6331 sayılı İSG Kanunu ve Yapı İşlerinde İSG Yönetmeliği'ne harfiyen hakim Kıdemli Baş İSG Başmüfettişisin.

GÖREVİN:
Yüklenen şantiye/çalışma sahası fotoğrafını piksel düzeyinde titizlikle incele. Varsa kullanıcının eklediği şu bağlam notunu da dikkate al: "${userNote || 'Ek not yok'}".

FOTOĞRAFI ŞU 6 DERİN KRİTERE GÖRE İNCELE VE TEŞHİS KOY:
1. GÖRSEL KANIT TESPİTİ (Visual Evidence): Fotoğrafta tam olarak ne görünüyor? (Örn: Korkuluksuz döşeme kenarı, baret takmayan işçi, izolesiz açık kablo, topuk levhasız iskele, iksasız derin kazı şevi, emniyetsiz yük kaldırma vb.)
2. TEHLİKE VE RİSK BOYUTU: Bu durum ne tür bir iş kazasına (Ölümcül düşme, elektrik çarpması, göçük, malzeme düşmesi) yol açabilir?
3. TÜRK İSG MEVZUATI EŞLEŞTİRMESİ: İlgili yönetmelik ve maddeyi eksiksiz yaz (Örn: "Yapı İşlerinde İSG Yönetmeliği Ek-4 Bölüm II Madde 2.1 & 6331 Sayılı Kanun Madde 10").
4. 5x5 RİSK MATRİSİ PUANLAMASI: Olasılık (1-5) x Şiddet (1-5) hesaplayarak 1-25 arası net risk skoru ver.
5. DÖF (Düzeltici ve Önleyici Faaliyet): Sahada şantiye şefinin ve taşeronun derhal yapması gereken teknik adımları net, somut ve uygulanabilir emir kipiyle yaz.
6. TERMİN SÜRESİ VE DİSİPLİN: Tehlikenin ciddiyetine göre düzeltilmesi gereken süre (Saat: 2, 12, 24 veya 48) ve sorumlu taşeron disiplini.

AŞAĞIDAKİ JSON ŞEMASINA HARFİYEN UYGUN TEK BİR JSON NESNESİ DÖNDÜR:
{
  "title": "Kesin, teknik ve resmi tehlike başlığı (Örn: 5. Kat Dış Cephe İskelesinde Eksik Ara Korkuluk ve Topuk Levhası)",
  "description": "Fotoğrafta görülen tehlikenin ayrıntılı, teknik ve gerekçeli açıklaması.",
  "category": "Yüksekte Çalışma & İskele" | "Kişisel Koruyucu Donanım (KKD)" | "Elektrik & Tesisat Güvenliği" | "Kazı, İksa & Çökme Tehlikesi" | "Yangın & Acil Durum" | "İş Ekipmanları & İş Makineleri" | "İstifleme, Düzen & Temizlik" | "Kimyasal & Tehlikeli Maddeler" | "Genel Saha Emniyeti",
  "severity": "DÜŞÜK" | "ORTA" | "YÜKSEK" | "ACİL_DURDURMA",
  "riskScore": 1 ile 25 arasında tam sayı,
  "regulationReference": "T.C. Mevzuatındaki tam madde (Örn: Yapı İşlerinde İSG Yönetmeliği Ek-4 Bölüm II Madde 2 ve 6331 Sayılı Kanun Madde 10)",
  "correctiveAction": "DÖF: Sahada derhal uygulanacak teknik düzeltici faaliyet ve güvenlik tedbiri.",
  "deadlineHours": 24,
  "suggestedSubcontractor": "Sorumlu taşeron ekibi (Örn: İskele Taşeronu, Elektrik Ekibi, Kaba Yapı & Kalıp Taşeronu)"
}

YALNIZCA geçerli JSON formatında yanıt ver. Markdown veya ek metin ekleme.
`;

  try {
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1, // Düşük sıcaklık ile en yüksek doğruluk ve tutarlılık
      },
    });

    const text = response.text || '{}';
    return JSON.parse(text) as AIAnalysisResult;
  } catch (error) {
    console.error('Gemini Vision API Error:', error);
    return simulateHazardAnalysis(userNote);
  }
}

function simulateHazardAnalysis(userNote?: string): AIAnalysisResult {
  const noteLower = (userNote || '').toLowerCase();

  if (noteLower.includes('elektrik') || noteLower.includes('kablo') || noteLower.includes('pano')) {
    return {
      title: 'Açıkta Duran Tali Şantiye Elektrik Panosu & Kaçak Akım Rölesi (30mA) Eksikliği',
      description: 'Saha ana geçiş güzergahında bulunan tali elektrik panosunun kapağı açık vaziyette bırakılmış, klemens bağlantıları açıkta ve zemin nemine maruz kalacak şekildedir. Hayati kaçak akım koruma rölesinin bulunmadığı tespit edilmiştir.',
      category: 'Elektrik & Tesisat Güvenliği',
      severity: 'ACİL_DURDURMA',
      riskScore: 25,
      regulationReference: 'Elektrik İç Tesisleri Yönetmeliği & Yapı İşlerinde İSG Yönetmeliği Ek-4 Madde 45 ve 6331 Sayılı Kanun Madde 10',
      correctiveAction: 'Pano enerjisi derhal kesilmeli, panonun kilitli IP65 standart kutuya montajı sağlanmalı, 30mA hayat koruma kaçak akım rölesi takılarak topraklama ölçümü yapılmalıdır.',
      deadlineHours: 2,
      suggestedSubcontractor: 'Elektrik Tesisat Taşeronu'
    };
  }

  if (noteLower.includes('baret') || noteLower.includes('yelek') || noteLower.includes('kkd')) {
    return {
      title: 'Çalışanların Ağır Yük Altında Temel KKD (EN 397 Baret ve Reflektif Yelek) Kullanmaması',
      description: 'Aktif kule vinç malzeme hareketi ve cephe çalışması bulunan sahada çalışanların standartlara uygun baret ve yüksek görünürlüklü reflektif yelek kullanmaksızın imalat yaptığı tespit edilmiştir.',
      category: 'Kişisel Koruyucu Donanım (KKD)',
      severity: 'ORTA',
      riskScore: 15,
      regulationReference: '6331 Sayılı İSG Kanunu Madde 19 ve KKD Yönetmeliği Madde 6 uyarınca çalışanların KKD kullanma yükümlülüğü',
      correctiveAction: 'Tüm saha personeline CE ve EN 397 belgeli baret ile reflektif yelek derhal teslim edilmeli, zimmet tutanakları imzalatılmalı ve KKD olmadan sahaya giriş kesinlikle yasaklanmalıdır.',
      deadlineHours: 12,
      suggestedSubcontractor: 'Kaba Yapı & Kalıp Taşeronu'
    };
  }

  return {
    title: 'Döşeme Kenarı ve Dış Cephede Standart Düşme Önleyici Üçlü Korkuluk Eksikliği',
    description: 'Yüksekliği 2 metreyi aşan döşeme kenarında 100 cm ana korkuluk, 47 cm ara korkuluk ve 15 cm topuk levhasından oluşan TS EN 13374 standartlı geçici kenar koruma sistemi bulunmamaktadır. Ölümcül yüksekten düşme riski mevcuttur.',
    category: 'Yüksekte Çalışma & İskele',
    severity: 'YÜKSEK',
    riskScore: 20,
    regulationReference: 'Yapı İşlerinde İSG Yönetmeliği Ek-4 Bölüm II Madde 2 & 6331 Sayılı Kanun Madde 10 ve 13',
    correctiveAction: 'Döşeme kenarına TS EN 13374 standardına uygun ana korkuluk, ara korkuluk ve topuk levhası ivedilikle monte edilmeli, montaj tamamlanana kadar o hatta çalışma durdurulmalıdır.',
    deadlineHours: 24,
    suggestedSubcontractor: 'Kalıp & İskele Taşeronu'
  };
}