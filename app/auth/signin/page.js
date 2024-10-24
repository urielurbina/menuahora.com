"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Image
            src={`https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg`}
            alt="Logo"
            width={200}
            height={50}
            className="mx-auto h-8 w-auto"
          />
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-800">
            Inicia sesión en tu cuenta
          </h2>
          <div className="mt-8">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={20}
                height={20}
                className="mr-2"
              />
              Continuar con Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
