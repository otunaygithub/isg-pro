'use client';

import React, { useRef, useState } from 'react';
import { Camera, Upload, Image as ImageIcon, X, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PhotoUploaderProps {
  onAnalyze: (files: { base64: string; mimeType: string; note?: string }[]) => Promise<void>;
  isAnalyzing: boolean;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onAnalyze,
  isAnalyzing,
}) => {
  const [selectedPhotos, setSelectedPhotos] = useState<
    { id: string; base64: string; mimeType: string; note?: string; previewUrl: string }[]
  >([]);
  const [globalNote, setGlobalNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedPhotos((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            base64,
            mimeType: file.type || 'image/jpeg',
            previewUrl: URL.createObjectURL(file),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    setSelectedPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePhotoNote = (id: string, note: string) => {
    setSelectedPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, note } : p))
    );
  };

  const handleSubmit = async () => {
    if (selectedPhotos.length === 0) return;

    const payload = selectedPhotos.map((p) => ({
      base64: p.base64,
      mimeType: p.mimeType,
      note: p.note || globalNote || undefined,
    }));

    await onAnalyze(payload);
    setSelectedPhotos([]);
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-3xl p-6 sm:p-8 text-center bg-white dark:bg-slate-900/50 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <Camera className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          Saha Fotoğraflarını Yükleyin veya Kamerayı Açın
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Tek seferde birden fazla uygunsuzluk fotoğrafı seçebilirsiniz. Yapay zeka Türk İSG mevzuatına göre otomatik analiz edecektir.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <Button
            type="button"
            variant="primary"
            onClick={() => cameraInputRef.current?.click()}
            leftIcon={<Camera className="w-4 h-4" />}
          >
            Kameradan Çek (Mobil)
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Galeriden / Dosyadan Seç
          </Button>
        </div>
      </div>

      {/* Selected Photos List */}
      {selectedPhotos.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>Analiz Edilecek Fotoğraflar ({selectedPhotos.length})</span>
            </h4>
            <span className="text-xs text-slate-500">
              Opsiyonel: Fotoğraflara sesli/yazılı kısa not ekleyebilirsiniz
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 relative space-y-2"
              >
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors shadow"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="h-36 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={photo.previewUrl}
                    alt={`Seçilen ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="İpucu notu (Örn: 3. kat döşeme kenarı)"
                    value={photo.note || ''}
                    onChange={(e) => updatePhotoNote(photo.id, e.target.value)}
                    className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={isAnalyzing}
              leftIcon={<Sparkles className="w-5 h-5" />}
            >
              {isAnalyzing
                ? 'Gemini AI Mevzuat Analizi Yapıyor...'
                : `${selectedPhotos.length} Fotoğrafı AI ile Analiz Et`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};