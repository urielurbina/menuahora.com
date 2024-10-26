'use client'

import React from 'react';
import Link from 'next/link';

const PantallaPlanes = () => {
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
};

export default PantallaPlanes;
