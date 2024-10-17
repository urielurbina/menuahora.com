/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import config from "@/config";
import { useState, useRef, useEffect } from "react";

// Modificamos el componente para incluir un menú desplegable
const ButtonSignin = ({ text = "Get started", extraStyle }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClick = () => {
    if (status === "authenticated") {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "authenticated") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className={`btn ${extraStyle ? extraStyle : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
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
          {session.user?.name || session.user?.email || "Account"}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10">
            <Link
              href={config.auth.callbackUrl}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Mi menú
            </Link>
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

  // El resto del componente permanece igual para usuarios no autenticados
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
