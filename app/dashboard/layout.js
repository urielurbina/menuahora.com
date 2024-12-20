'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ButtonAccount from "@/components/ButtonAccount";
import PrivateRoute from '@/components/PrivateRoute';
import { useSession } from 'next-auth/react';
import LoadingScreen from '../../components/LoadingScreen';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Mis productos', href: '/dashboard/productos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Información básica', href: '/dashboard/informacionbasica', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Botones', href: '/dashboard/buttons', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { name: 'Apariencia', href: '/dashboard/apariencia', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
];

export default function ResponsiveLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [iframeKey, setIframeKey] = useState(0);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsername = useCallback(async () => {
    if (status === 'authenticated' && session?.user?.id) {
      console.log("User ID:", session.user.id);
      try {
        const response = await fetch(`/api/user/${session.user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.username) {
          setUsername(data.username);
        } else {
          setError('No se pudo obtener el nombre de usuario');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        setError('Error al cargar el nombre de usuario');
      }
    }
  }, [session, status]);

  useEffect(() => {
    fetchUsername();
  }, [fetchUsername]);

  useEffect(() => {
    // Simulate loading time (remove this in production)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleReload = () => {
    setIframeKey(prevKey => prevKey + 1);
  };

  return (
    <PrivateRoute>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="h-screen flex overflow-hidden bg-gray-100">
          {/* Sidebar para desktop */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
              <SidebarContent pathname={pathname} />
            </div>
          </div>

          {/* Sidebar móvil */}
          <div className="md:hidden">
            <div className={`fixed inset-0 flex z-10 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <div
                className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
                  isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>

              <div
                className={`relative flex-1 flex flex-col w-full max-w-xs bg-white transition ease-in-out duration-300 transform ${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                {isMobileMenuOpen && (
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Cerrar menú</span>
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                  <div className="flex-shrink-0 flex items-center px-4">
                    <img
                      className="h-8 w-auto"
                      src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
                      alt="Logo MenúAhora"
                    />
                  </div>
                  <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <svg
                          className={`mr-4 h-6 w-6 ${
                            pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                  <ButtonAccount />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-0 flex-1 overflow-hidden">
            {/* Botón de menú para móvil */}
            <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
              <button
                className="h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0D654A]"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <div className="py-6 md:py-6">
                <div className="max-w-full mx-auto px-2 sm:px-4 md:px-8 flex flex-col xl:flex-row">
                  {/* Contenido del dashboard */}
                  <div className="w-full xl:w-2/3 mb-8 xl:mb-0 xl:pr-8 md:h-[calc(100vh-3rem)] md:overflow-y-auto">
                    <div className="md:h-auto md:overflow-visible pb-16 md:pb-0">
                      {children}
                    </div>
                  </div>

                  {/* Previsualización del menú (visible en pantallas xl y superiores) */}
                  <div className="hidden xl:flex xl:flex-col xl:w-1/3 border-l border-gray-200 h-[calc(100vh-3rem)]">
                    <div className="p-2 bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                      <div className="flex items-center mb-2">
                        <button
                          onClick={handleReload}
                          className="flex items-center px-2 py-1 bg-gray-200 text-black rounded-md hover:bg-gray-300 transition-colors mr-2 text-xs font-medium"
                          title="Recargar previsualización"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Recargar
                        </button>
                        <h2 className="text-lg font-semibold">Vista Previa</h2>
                      </div>
                      <p className="text-xs text-gray-600">Recarga la vista previa para ver los cambios más recientes.</p>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                      {error ? (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-red-500">{error}</p>
                        </div>
                      ) : username ? (
                        <iframe
                          key={iframeKey}
                          src={`/${username}`}
                          className="w-full h-full"
                          title="Previsualización del menú"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p>Cargando previsualización...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
}

function SidebarContent({ pathname }) {
  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <img
            className="h-6 w-auto"
            src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
            alt="Logo MenúAhora"
          />
        </div>
        <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <svg
                className={`mr-3 h-6 w-6 ${
                  pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              {item.name}
            </Link>
          ))}
        </nav>
        <ButtonAccount />
      </div>
    </div>
  );
}
