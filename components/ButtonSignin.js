/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";

// Componente ButtonSignin: Maneja la autenticación y muestra un botón según el estado de la sesión
const ButtonSignin = ({ text = "Iniciar sesión", extraStyle }) => {
  // Hooks para manejar la navegación y el estado de la sesión
  const router = useRouter();
  const { data: session, status } = useSession();

  // Función para manejar el clic en el botón
  const handleClick = () => {
    if (status === "authenticated") {
      // Si el usuario está autenticado, redirige a la página de callback
      router.push(config.auth.callbackUrl);
    } else {
      // Si no está autenticado, inicia el proceso de inicio de sesión
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  // Renderizado condicional basado en el estado de autenticación
  if (status === "authenticated") {
    return (
      <button
        className={`btn ${extraStyle ? extraStyle : ""}`}
        onClick={handleClick}
      >
        {/* Muestra la imagen del usuario o sus iniciales */}
        {session.user?.image ? (
          <img
            src={session.user?.image}
            alt={session.user?.name || "Account"}
            className="w-6 h-6 rounded-full shrink-0"
            referrerPolicy="no-referrer"
            width={24}
            height={24}
          />
        ) : (
          <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
            {session.user?.name?.charAt(0) || session.user?.email?.charAt(0)}
          </span>
        )}
        {/* Muestra el nombre o email del usuario */}
        {session.user?.name || session.user?.email || "Account"}
      </button>
    );
  }

  // Renderizado para usuarios no autenticados
  return (
    <button
      className={`btn ${extraStyle ? extraStyle : ""}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default ButtonSignin;
