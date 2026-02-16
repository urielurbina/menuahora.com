'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Esta página redirige según el estado del usuario:
// - Sin onboarding → /onboarding
// - Trial expirado → /trial-expirado
// - Sin acceso → Muestra opciones de planes
export default function PantallaPlanes() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    fetch('/api/check-stripe-access')
      .then(res => res.json())
      .then(data => {
        if (data.needsOnboarding) {
          router.push('/onboarding');
        } else if (data.hasAccess) {
          router.push('/dashboard');
        } else if (data.type === 'trial_expired') {
          router.push('/trial-expirado');
        } else {
          // Usuario sin trial activo ni pago
          setIsChecking(false);
        }
      })
      .catch(error => {
        console.error('Error checking access:', error);
        setIsChecking(false);
      });
  }, [session, status, router]);

  if (status === 'loading' || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0D654A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <main>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">No tienes un plan activo</h1>
              <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                <p>
                  Actualmente no cuentas con un plan activo. Explora nuestros planes disponibles para encontrar el que mejor se adapte a tus necesidades.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/#pricing">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0D654A] hover:bg-[#0A5038] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A]">
                    Ver planes
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
