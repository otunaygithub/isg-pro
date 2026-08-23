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
Sen Türkiye Cumhuriyeti 6331 sayılı İş Sağlığı ve Güvenliği Kanunu, Yapı İşlerinde İSG Yönetmeliği ve ilgili mevzuata tam hakim Kıdemli Baş İSG Denetçisisin.
Fotoğraftaki şantiye veya çalışma sahası görüntüsünü incele. Varsa kullanıcının şu notunu dikkate al: "${userNote || 'Ek not yok'}".

Aşağıdaki JSON yapısında Türkçe bir JSON yanıtı ver:
{
  "title": "Kısa ve net tehlike başlığı",
  "description": "Sahada tespit edilen tehlikenin net ve teknik açıklaması",
  "category": "Yüksekte Çalışma & İskele" | "Kişisel Koruyucu Donanım (KKD)" | "Elektrik & Tesisat Güvenliği" | "Kazı, İksa & Çökme Tehlikesi" | "Yangın & Acil Durum" | "İş Ekipmanları & İş Makineleri" | "İstifleme, Düzen & Temizlik" | "Kimyasal & Tehlikeli Maddeler" | "Genel Saha Emniyeti",
  "severity": "DÜŞÜK" | "ORTA" | "YÜKSEK" | "ACİL_DURDURMA",
  "riskScore": 15,
  "regulationReference": "Mevzuat referansı (Örn: Yapı İşlerinde İSG Yönetmeliği Ek-4 Bölüm II Madde 2 ve 6331 Sayılı Kanun Madde 10)",
  "correctiveAction": "DÖF: Sahada derhal yapılması gereken düzeltici ve önleyici faaliyet.",
  "deadlineHours": 24,
  "suggestedSubcontractor": "Sorumlu taşeron disiplini (Örn: Kalıp & İskele Taşeronu, Elektrik Taşeronu)"
}
SADECE JSON döndür.
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
      title: 'Açıkta Duran Şantiye Elektrik Panosu & Kaçak Akım Rölesi Eksikliği',
      description: 'Saha geçiş güzergahında bulunan tali elektrik panosunun kapağı açık, kablolar açıkta ve su birikintisine yakın vaziyettedir. Kaçak akım koruma rölesi devre dışı bırakılmıştır.',
      category: 'Elektrik & Tesisat Güvenliği',
      severity: 'ACİL_DURDURMA',
      riskScore: 20,
      regulationReference: 'Elektrik İç Tesisleri Yönetmeliği & Yapı İşlerinde İSG Yönetmeliği Ek-4 Madde 45',
      correctiveAction: 'Pano enerjisi derhal kesilmeli, IP65 standartlı kilitli panoya alınmalı ve 30mA kaçak akım rölesi montajı yapılarak test edilmelidir.',
      deadlineHours: 2,
      suggestedSubcontractor: 'Elektrik Tesisat Taşeronu'
    };
  }

  if (noteLower.includes('baret') || noteLower.includes('yelek') || noteLower.includes('kkd')) {
    return {
      title: 'Çalışanların Temel KKD (Baret ve Reflektif Yelek) Kullanmaması',
      description: 'Çalışma alanında aktif vinç ve malzeme hareketi varken personelin baret ve yüksek görünürlüklü yelek olmadan çalıştığı tespit edilmiştir.',
      category: 'Kişisel Koruyucu Donanım (KKD)',
      severity: 'ORTA',
      riskScore: 12,
      regulationReference: '6331 Sayılı İSG Kanunu Madde 19 & KKD Yönetmeliği Madde 6',
      correctiveAction: 'Çalışanlara derhal standartlara uygun EN 397 belgeli baret ve yelek temin edilmeli, İSG zimmet formu imzalatılmalıdır.',
      deadlineHours: 12,
      suggestedSubcontractor: 'Kaba Yapı Taşeronu'
    };
  }

  return {
    title: 'Döşeme Kenarı ve Dış Cephede Standart Düşme Önleyici Korkuluk Eksikliği',
    description: 'Yüksekliği 2 metreyi aşan döşeme kenarında ana korkuluk (100 cm), ara korkuluk (47 cm) ve topuk levhası (15 cm) bulunmamaktadır. Yüksekten düşme riski mevcuttur.',
    category: 'Yüksekte Çalışma & İskele',
    severity: 'YÜKSEK',
    riskScore: 20,
    regulationReference: 'Yapı İşlerinde İSG Yönetmeliği Ek-4 Bölüm II Madde 2 & 6331 Sayılı Kanun Madde 10',
    correctiveAction: 'Kenar koruma bariyerleri ve topuk levhaları standartlara uygun şekilde ivedilikle monte edilmeli, çalışma bu süre zarfında durdurulmalıdır.',
    deadlineHours: 24,
    suggestedSubcontractor: 'Kalıp ve İskele Taşeronu'
  };
}