'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function InitialSetup({ userId }) {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const router = useRouter();

  const checkAvailability = async () => {
    // Aquí iría la lógica para verificar la disponibilidad del username
    // Por ahora, usamos una simulación
    setIsAvailable(Math.random() > 0.5);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAvailable) {
      try {
        const response = await fetch('/api/update-username', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, username }),
        });

        if (response.ok) {
          router.push('/dashboard/status');
        } else {
          console.error('Failed to update username');
        }
      } catch (error) {
        console.error('Error updating username:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Configura tu menú digital
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Elige tu username
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  menuahora.com/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="focus:ring-[#0D654A] focus:border-[#0D654A] flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                  placeholder="tu-negocio"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={checkAvailability}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D654A] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A]"
              >
                Verificar disponibilidad
              </motion.button>
            </div>

            {isAvailable !== null && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm ${isAvailable ? 'text-green-600' : 'text-red-600'}`}
              >
                {isAvailable ? '¡Username disponible!' : 'Username no disponible. Intenta otro.'}
              </motion.p>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!isAvailable}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isAvailable
                    ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continuar al dashboard
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
