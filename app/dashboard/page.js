'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Welcome() {
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Obtener el username al cargar el componente
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/username');
        const data = await response.json();
        if (data.hasUsername) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error al obtener el username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleCopyLink = async () => {
    const menuLink = `https://menuahora.com/${username}`;
    try {
      await navigator.clipboard.writeText(menuLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset después de 2 segundos
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="py-4 sm:py-6 md:py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Bienvenido a tu Panel de Configuración
        </h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
              Aquí podrás personalizar y gestionar tu menú digital de manera fácil y eficiente.
            </p>

            {/* Nuevo campo para copiar el link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de tu menú
              </label>
              <div className="flex rounded-md shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <input
                    type="text"
                    value={`https://menuahora.com/${username}`}
                    readOnly
                    className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6 cursor-default select-none pointer-events-none bg-gray-50"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white bg-[#0D654A] hover:bg-[#0C5A42]"
                >
                  {copied ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 sm:mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong className="font-medium">Recomendación:</strong> Para una mejor experiencia de edición, te sugerimos modificar tu menú desde una computadora de escritorio o laptop.
                  </p>
                </div>
              </div>
            </div>
            <Link href="/dashboard/productos" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0D654A] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A]"
              >
                Ir a Productos
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
