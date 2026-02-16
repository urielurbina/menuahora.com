'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, createContext, useContext } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Context para compartir info del trial
export const TrialContext = createContext(null);
export const useTrialInfo = () => useContext(TrialContext);

export default function PrivateRoute({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [trialInfo, setTrialInfo] = useState(null);

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
          // Usuario no ha completado onboarding
          router.push('/onboarding');
        } else if (data.hasAccess) {
          // Usuario tiene acceso (trial o pagado)
          if (data.type === 'trial') {
            setTrialInfo({
              daysLeft: data.daysLeft,
              trialEndDate: data.trialEndDate
            });
          } else {
            setTrialInfo(null);
          }
          setIsLoading(false);
        } else if (data.type === 'trial_expired') {
          // Trial expirado
          router.push('/trial-expirado');
        } else {
          // Sin acceso ni trial (redirigir a onboarding por si acaso)
          router.push('/onboarding');
        }
      })
      .catch(error => {
        console.error('Error checking Stripe access:', error);
        router.push('/auth/signin');
      });
  }, [session, status, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <TrialContext.Provider value={trialInfo}>
      {children}
    </TrialContext.Provider>
  );
}
