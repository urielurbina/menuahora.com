import React from 'react';
import Link from 'next/link';

const PantallaPlanes = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          No tienes un plan activo
        </h1>
        <p className="text-gray-600 mb-8">
          Actualmente no cuentas con un plan activo. Explora nuestros planes disponibles para encontrar el que mejor se adapte a tus necesidades.
        </p>
        <Link href="/#pricing">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Ver planes
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PantallaPlanes;
