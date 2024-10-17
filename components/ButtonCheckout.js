"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import apiClient from "@/libs/api";
import config from "@/config";

// Este componente se utiliza para crear sesiones de pago de Stripe
// Llama a la ruta /api/stripe/create-checkout con el priceId, successUrl y cancelUrl
// Por defecto, no obliga a los usuarios a estar autenticados. Pero si lo están, prellenará los datos de Checkout con su correo electrónico y/o tarjeta de crédito.
// También se puede cambiar el modo a "subscription" si se quiere crear una suscripción en lugar de un pago único
const ButtonCheckout = ({ priceId, mode = "subscription" }) => {
  // Estado para manejar el estado de carga del botón
  const [isLoading, setIsLoading] = useState(false);
  // Hook de next-auth para obtener la sesión del usuario
  const { data: session, status } = useSession();

  const handlePayment = async () => {
    setIsLoading(true);

    // Si el usuario no está autenticado, inicia el proceso de inicio de sesión
    if (status === "unauthenticated") {
      signIn();
      setIsLoading(false);
      return;
    }

    try {
      // Llama a la API para crear una sesión de pago de Stripe
      const res = await apiClient.post("/stripe/create-checkout", {
        priceId,
        mode,
        successUrl: `${window.location.origin}/bienvenida`, // Cambiado aquí
        cancelUrl: window.location.href,
      });

      // Redirige al usuario a la página de pago de Stripe
      window.location.href = res.url;
    } catch (e) {
      console.error(e);
    }

    setIsLoading(false);
  };

  return (
    <button
      className="btn btn-primary btn-block group"
      onClick={() => handlePayment()}
    >
      {isLoading ? (
        // Muestra un spinner de carga cuando isLoading es true
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        // Muestra un icono SVG cuando no está cargando
        <svg
          className="w-5 h-5 fill-primary-content group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200"
          viewBox="0 0 375 509"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M249.685 14.125C249.685 11.5046 248.913 8.94218 247.465 6.75675C246.017 4.57133 243.957 2.85951 241.542 1.83453C239.126 0.809546 236.463 0.516683 233.882 0.992419C231.301 1.46815 228.917 2.69147 227.028 4.50999L179.466 50.1812C108.664 118.158 48.8369 196.677 2.11373 282.944C0.964078 284.975 0.367442 287.272 0.38324 289.605C0.399039 291.938 1.02672 294.226 2.20377 296.241C3.38082 298.257 5.06616 299.929 7.09195 301.092C9.11775 302.255 11.4133 302.867 13.75 302.869H129.042V494.875C129.039 497.466 129.791 500.001 131.205 502.173C132.62 504.345 134.637 506.059 137.01 507.106C139.383 508.153 142.01 508.489 144.571 508.072C147.131 507.655 149.516 506.503 151.432 504.757L172.698 485.394C247.19 417.643 310.406 338.487 359.975 250.894L373.136 227.658C374.292 225.626 374.894 223.327 374.882 220.99C374.87 218.653 374.243 216.361 373.065 214.341C371.887 212.322 370.199 210.646 368.17 209.482C366.141 208.318 363.841 207.706 361.5 207.707H249.685V14.125Z" />
        </svg>
      )}
      Get {config?.appName}
    </button>
  );
};

export default ButtonCheckout;
