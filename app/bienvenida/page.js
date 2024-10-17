'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function Bienvenida() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-blue-50">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a tu nuevo menú digital!</h1>
      <p className="text-xl text-gray-600 mb-8">Estamos emocionados de ayudarte a mostrar tus productos. Comencemos con un breve tutorial.</p>
      
      <div className="w-full max-w-3xl mb-8">
        <div className="bg-gray-200 aspect-video flex items-center justify-center rounded-lg">
          <p className="text-2xl text-gray-600">Aquí irá el video tutorial sobre cómo gestionar tu menú</p>
        </div>
      </div>
      
      <Link href="/dashboard" className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300">
        Ir al Dashboard de tu Menú
      </Link>
    </div>
  );
}
