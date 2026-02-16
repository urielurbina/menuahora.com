'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Esta página ahora redirige al nuevo flujo de onboarding
export default function Bienvenida() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0D654A] border-t-transparent"></div>
    </div>
  );
}
