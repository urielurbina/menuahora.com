'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const REFERRAL_STORAGE_KEY = 'repisa_referral';

export default function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get('ref');

    if (refCode) {
      // Guardar en localStorage
      localStorage.setItem(REFERRAL_STORAGE_KEY, refCode.toLowerCase());
      console.log('Referral code saved:', refCode);
    }
  }, [searchParams]);

  return null; // No renderiza nada
}

export function getReferralCode() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFERRAL_STORAGE_KEY);
}

export function clearReferralCode() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REFERRAL_STORAGE_KEY);
}
