"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import apiClient from "@/libs/api";
import config from "@/config";
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

const ButtonCheckout = ({ priceId, mode = "subscription", children, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const savedPriceId = localStorage.getItem('selectedPriceId');
      const savedMode = localStorage.getItem('selectedMode');
      if (savedPriceId && savedMode) {
        handlePayment(savedPriceId, savedMode);
        localStorage.removeItem('selectedPriceId');
        localStorage.removeItem('selectedMode');
      }
    }
  }, [status]);

  const handlePayment = async (selectedPriceId = priceId, selectedMode = mode) => {
    setIsLoading(true);

    if (status === "unauthenticated") {
      localStorage.setItem('selectedPriceId', selectedPriceId);
      localStorage.setItem('selectedMode', selectedMode);
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    try {
      const res = await apiClient.post("/stripe/create-checkout", {
        priceId: selectedPriceId,
        mode: selectedMode,
        successUrl: `${window.location.origin}/bienvenida`,
        cancelUrl: window.location.href,
      });

      window.location.href = res.url;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => handlePayment()}
      disabled={isLoading}
      className={`relative inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 ${className}`}
    >
      <div className="relative flex items-center gap-2">
        {isLoading ? (
          <svg 
            className="animate-spin h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <>
            {children || "¡Quiero mi menú digital!"}
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </div>
      
      {/* Efecto hover */}
      <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-[#0D654A] to-[#9BD9C7] opacity-0 blur transition duration-300 group-hover:opacity-30" />
    </button>
  );
};

export default ButtonCheckout;
