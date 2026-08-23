import { NextRequest, NextResponse } from 'next/server';
import { analyzeHazardImageWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, mimeType, userNote, apiKey } = body;

    if (!base64Image) {
      return NextResponse.json(
        { error: 'base64Image alanı zorunludur.' },
        { status: 400 }
      );
    }

    const analysis = await analyzeHazardImageWithGemini(
      base64Image,
      mimeType || 'image/jpeg',
      userNote,
      apiKey
    );

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: unknown) {
    console.error('API /api/analyze error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Analiz sırasında bir hata oluştu.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}