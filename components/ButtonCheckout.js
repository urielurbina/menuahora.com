"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import apiClient from "@/libs/api";
import config from "@/config";
import { useRouter } from 'next/navigation';

const ButtonCheckout = ({ priceId, mode = "subscription" }) => {
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
      className="btn btn-primary btn-block group"
      onClick={() => handlePayment()}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        <svg
          className="w-5 h-5 fill-primary-content group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        </svg>
        
      )}
      ¡Quiero mi menú digital!
    </button>
  );
};

export default ButtonCheckout;
