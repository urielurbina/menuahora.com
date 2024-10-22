'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Confetti from 'react-confetti';

export default function Bienvenida() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [username, setUsername] = useState('');

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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSaveUsername = () => {
    // Aquí puedes agregar la lógica para guardar el username
    console.log('Username guardado:', username);
    // TODO: Implementar la lógica para guardar el username en el backend
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
      />
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Bienvenido a tu nuevo menú digital!</h1>
          <p className="text-md text-gray-600 mb-2">
            Estamos emocionados de ayudarte a mostrar tus productos.
          </p>
          <p className="text-md text-gray-600 mb-8">
            Comencemos con un breve tutorial.
          </p>
        </div>
        
        <div className="bg-gray-200 w-full aspect-video flex items-center justify-center rounded-lg">
          <p className="text-2xl text-gray-600">Aquí irá el video tutorial sobre cómo gestionar tu menú</p>
        </div>
        
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="username" className="block text-xl font-semibold leading-6 text-gray-800 text-center mb-4">
            Elige tu nombre de usuario
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              menuahora.com/
            </span>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="tacosuriel"
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center font-medium">
            Importante: El username no se podrá cambiar una vez guardado.
          </p>
          <button
            onClick={handleSaveUsername}
            className="w-full mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Guardar username
          </button>
        </div>

        <div className="flex flex-col items-center">
          <Link 
            href="/dashboard" 
            className="w-full max-w-md text-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Configurar mi Menú
          </Link>
        </div>
      </div>
    </div>
  );
}
