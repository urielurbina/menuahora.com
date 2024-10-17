/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import { useState, useRef, useEffect } from "react";

// Componente ButtonSignin: Maneja la autenticación y muestra un botón o menú desplegable según el estado de la sesión
const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  // Hooks para manejar la navegación y el estado de la sesión
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Estado local para controlar la apertura/cierre del menú desplegable
  const [isOpen, setIsOpen] = useState(false);
  
  // Referencia para detectar clics fuera del menú desplegable
  const dropdownRef = useRef(null);

  // Función para manejar el clic en el botón principal
  const handleClick = () => {
    if (status === "authenticated") {
      // Si el usuario está autenticado, redirige a la página de callback
      router.push(config.auth.callbackUrl);
    } else {
      // Si no está autenticado, inicia el proceso de inicio de sesión
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  // Función para cerrar sesión
  const handleSignOut = () => {
    // Cierra la sesión y redirige a la página de inicio
    signOut({ callbackUrl: "/" });
  };

  // Efecto para cerrar el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic fue fuera del menú desplegable, lo cierra
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Agrega el event listener al montar el componente
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Renderizado condicional basado en el estado de autenticación
  if (status === "authenticated") {
    return (
      <div className="relative" ref={dropdownRef}>
        {/* Botón principal que muestra la información del usuario */}
        <button
          className={`btn ${extraStyle ? extraStyle : ""}`}
          onClick={() => setIsOpen(!isOpen)}
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
        {/* Menú desplegable */}
        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
            {/* Enlace a la página de menú del usuario */}
            <Link
              href={config.auth.callbackUrl}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mi menú
            </Link>
            {/* Botón para cerrar sesión */}
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
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
