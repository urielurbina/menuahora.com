'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PAYMENT_LINK = 'https://repisa.co/trial-expirado';

const getRenewalMessage = (businessName, status, daysLeft) => {
  const name = businessName || 'tu negocio';

  if (status === 'trial_expired') {
    return `¡Hola! 👋

Tu prueba gratuita de Repisa para *${name}* ha terminado.

Para seguir recibiendo pedidos por WhatsApp y mantener tu menú digital activo, puedes renovar tu suscripción aquí:

${PAYMENT_LINK}

¿Tienes alguna duda? Estoy aquí para ayudarte.`;
  }

  if (status === 'trial' && daysLeft <= 3) {
    return `¡Hola! 👋

Tu prueba gratuita de Repisa para *${name}* termina en ${daysLeft} ${daysLeft === 1 ? 'día' : 'días'}.

Para no perder tus pedidos y mantener tu menú activo, puedes suscribirte aquí:

${PAYMENT_LINK}

¿Tienes alguna duda? Estoy aquí para ayudarte.`;
  }

  return `¡Hola! 👋

Te escribo de Repisa sobre *${name}*.

Si deseas continuar con tu suscripción, puedes hacerlo aquí:

${PAYMENT_LINK}

¿Tienes alguna duda? Estoy aquí para ayudarte.`;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, businessesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/businesses?limit=5')
      ]);

      const statsData = await statsRes.json();
      const businessesData = await businessesRes.json();

      setStats(statsData);
      setRecentBusinesses(businessesData.businesses || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status, daysLeft) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Pagado</span>;
      case 'trial':
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            daysLeft <= 2 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Trial ({daysLeft}d)
          </span>
        );
      case 'trial_expired':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Expirado</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Pendiente</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Usuarios', value: stats?.totalUsers || 0, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'bg-blue-500' },
    { name: 'En Trial', value: stats?.usersOnTrial || 0, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-yellow-500' },
    { name: 'Trial Expirado', value: stats?.usersTrialExpired || 0, icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: 'bg-red-500' },
    { name: 'Pagados', value: stats?.usersPaid || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-green-500' },
  ];

  const secondaryStats = [
    { name: 'Total Comercios', value: stats?.totalBusinesses || 0 },
    { name: 'Con Productos', value: stats?.businessesWithProducts || 0 },
    { name: 'Total Productos', value: stats?.totalProducts || 0 },
    { name: 'Nuevos (7 días)', value: stats?.newUsersLast7Days || 0 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-400">Vista general del sistema</p>
      </div>

      {/* Alerta de trials por expirar */}
      {stats?.trialsExpiringIn3Days > 0 && (
        <div className="mb-6 bg-yellow-900/50 border border-yellow-700 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-yellow-200">
              <strong>{stats.trialsExpiringIn3Days}</strong> {stats.trialsExpiringIn3Days === 1 ? 'trial expira' : 'trials expiran'} en los próximos 3 días
            </p>
            <Link href="/admin/comercios?filter=trial" className="ml-auto text-yellow-400 hover:text-yellow-300 text-sm underline">
              Ver todos
            </Link>
          </div>
        </div>
      )}

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-gray-800 rounded-lg shadow px-5 py-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-400 truncate">{stat.name}</dt>
                  <dd className="text-3xl font-semibold text-white">{stat.value}</dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estadísticas secundarias */}
      <div className="bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-5 py-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Resumen</h3>
        </div>
        <div className="grid grid-cols-2 gap-px bg-gray-700 sm:grid-cols-4">
          {secondaryStats.map((stat) => (
            <div key={stat.name} className="bg-gray-800 px-4 py-6 text-center">
              <dt className="text-sm font-medium text-gray-400">{stat.name}</dt>
              <dd className="mt-1 text-2xl font-semibold text-white">{stat.value}</dd>
            </div>
          ))}
        </div>
      </div>

      {/* Comercios recientes */}
      <div className="bg-gray-800 rounded-lg shadow">
        <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Comercios Recientes</h3>
          <Link href="/admin/comercios" className="text-sm text-indigo-400 hover:text-indigo-300">
            Ver todos
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Comercio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Productos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentBusinesses.map((business) => (
                <tr key={business._id} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {business.logoUrl ? (
                        <img className="h-10 w-10 rounded-full object-cover" src={business.logoUrl} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-300 text-sm font-medium">
                            {business.businessName?.[0] || business.username?.[0] || '?'}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{business.businessName || 'Sin nombre'}</div>
                        <div className="text-sm text-gray-400">/{business.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{business.user?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-400">{business.user?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(business.status, business.daysLeft)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {business.productsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/comercio/${business._id}`}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Ver
                      </Link>
                      {/* WhatsApp con link de pago - solo para trial o expirado */}
                      {business.user?.personalWhatsapp && (business.status === 'trial' || business.status === 'trial_expired') && (
                        <a
                          href={`https://wa.me/${business.user.personalWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(getRenewalMessage(business.businessName, business.status, business.daysLeft))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 hover:text-amber-300 transition-colors"
                          title="Enviar link de pago"
                        >
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <span className="text-xs">Renovar</span>
                        </a>
                      )}
                      {/* WhatsApp personal - solo si no se mostró el de renovar */}
                      {business.user?.personalWhatsapp && business.status !== 'trial' && business.status !== 'trial_expired' && (
                        <a
                          href={`https://wa.me/${business.user.personalWhatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300"
                          title="WhatsApp Personal"
                        >
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
