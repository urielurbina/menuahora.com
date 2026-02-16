'use client'

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ButtonAccount from "@/components/ButtonAccount";
import PrivateRoute, { useTrialInfo } from '@/components/PrivateRoute';
import { useSession } from 'next-auth/react';
import LoadingScreen from '../../components/LoadingScreen';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Mis productos', href: '/dashboard/productos', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Información básica', href: '/dashboard/informacionbasica', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Entregas', href: '/dashboard/entregas', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0-6.677h-2.25' },
  { name: 'Botones', href: '/dashboard/buttons', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
  { name: 'Apariencia', href: '/dashboard/apariencia', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Mi suscripción', href: '/dashboard/suscripcion', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { name: 'Gana Dinero', href: '/dashboard/referidos', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', highlight: true },
];

// Componente para el banner de trial
function TrialBanner() {
  const trialInfo = useTrialInfo();

  if (!trialInfo) return null;

  const isUrgent = trialInfo.daysLeft <= 2;

  return (
    <div className={`px-4 py-2 ${isUrgent ? 'bg-red-50 border-b border-red-200' : 'bg-amber-50 border-b border-amber-200'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className={`text-sm ${isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
          <span className="font-medium">Prueba gratuita:</span> Te {trialInfo.daysLeft === 1 ? 'queda' : 'quedan'}{' '}
          <strong>{trialInfo.daysLeft} {trialInfo.daysLeft === 1 ? 'día' : 'días'}</strong>
        </p>
        <Link
          href="/dashboard/suscripcion"
          className={`text-sm font-medium underline hover:no-underline ${isUrgent ? 'text-red-900 hover:text-red-700' : 'text-amber-900 hover:text-amber-700'}`}
        >
          Suscribirme
        </Link>
      </div>
    </div>
  );
}

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
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
        <div className="dashboard-container">
          {/* Desktop Sidebar */}
          <div className="hidden md:flex md:flex-shrink-0">
            <div className="dashboard-sidebar">
              <div className="dashboard-sidebar-header">
                <img
                  className="h-6 w-auto"
                  src="/images/logotipo_repisa_co_negro.png"
                  alt="Logo Repisa"
                />
              </div>

              <nav className="dashboard-sidebar-nav">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`dashboard-nav-item ${pathname === item.href ? 'active' : ''}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="dashboard-sidebar-footer">
                <ButtonAccount />
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <div className="md:hidden">
            <div className={`fixed inset-0 z-40 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              {/* Backdrop */}
              <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Sidebar Panel */}
              <div
                className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
                  isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
                    <img
                      className="h-6 w-auto"
                      src="/images/logotipo_repisa_co_negro.png"
                      alt="Logo Repisa"
                    />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-icon"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`dashboard-nav-item ${pathname === item.href ? 'active' : ''}`}
                      >
                        <svg
                          className="w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-gray-100">
                    <ButtonAccount />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-main">
            {/* Trial Banner */}
            <TrialBanner />

            {/* Mobile Header */}
            <div className="dashboard-header-mobile">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="btn-icon"
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <img
                className="h-5 w-auto ml-3"
                src="/images/logotipo_repisa_co_negro.png"
                alt="Logo Repisa"
              />
            </div>

            {/* Page Content */}
            <div className="dashboard-content">
              <div className="flex flex-col xl:flex-row h-full">
                {/* Main Content Area */}
                <div className="flex-1 xl:overflow-y-auto">
                  <div className="dashboard-content-inner">
                    {children}
                  </div>
                </div>

                {/* Preview Panel (Desktop only) */}
                <div className="dashboard-preview">
                  <div className="dashboard-preview-header">
                    <div>
                      <h2 className="dashboard-preview-title">Vista Previa</h2>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Recarga para ver los cambios
                      </p>
                    </div>
                    <button
                      onClick={handleReload}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Recargar
                    </button>
                  </div>

                  <div className="dashboard-preview-content">
                    {error ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center px-4">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      </div>
                    ) : username ? (
                      <iframe
                        key={iframeKey}
                        src={`/${username}`}
                        className="w-full h-full border-0"
                        title="Previsualización del menú"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="spinner" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PrivateRoute>
  );
}
