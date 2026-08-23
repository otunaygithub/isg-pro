'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

export default function InspectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/inspections/${resolvedParams.id}/report`);
  }, [resolvedParams.id, router]);

  return (
    <div className="p-8 text-center text-sm text-slate-500">
      Rapor yükleniyor...
    </div>
  );
}