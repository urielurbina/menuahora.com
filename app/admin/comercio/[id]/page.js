'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ComercioDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/business/${id}`);
      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar datos' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (action) => {
    if (!data?.user?._id) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/user/${data.user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: result.message });
        fetchData(); // Recargar datos
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al ejecutar acción' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/business/${id}?productId=${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Producto eliminado' });
        fetchData();
      } else {
        const result = await res.json();
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al eliminar producto' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status, daysLeft) => {
    switch (status) {
      case 'paid':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Pagado</span>;
      case 'trial':
        return (
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            daysLeft <= 2 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}>
            Trial - {daysLeft} días restantes
          </span>
        );
      case 'trial_expired':
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Trial Expirado</span>;
      default:
        return <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800">Pendiente Onboarding</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price || 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Comercio no encontrado</p>
        <Link href="/admin/comercios" className="text-indigo-400 hover:text-indigo-300 mt-4 inline-block">
          Volver a comercios
        </Link>
      </div>
    );
  }

  const { business, user, status, daysLeft } = data;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            {business.logoUrl ? (
              <img className="h-16 w-16 rounded-full object-cover" src={business.logoUrl} alt="" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-gray-300 text-2xl font-medium">
                  {business.businessName?.[0] || business.username?.[0] || '?'}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{business.businessName || 'Sin nombre'}</h1>
              <a
                href={`/${business.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                repisa.co/{business.username}
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(status, daysLeft)}
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-200' : 'bg-red-900/50 border border-red-700 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Acciones rápidas */}
      <div className="mb-6 bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-3">
          {user?.personalWhatsapp && (
            <a
              href={`https://wa.me/${user.personalWhatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Personal
            </a>
          )}
          {business.whatsappNumber && (
            <a
              href={`https://wa.me/${business.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              WhatsApp Negocio
            </a>
          )}
          <button
            onClick={() => handleUserAction({ extendTrial: 7 })}
            disabled={actionLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            +7 días trial
          </button>
          <button
            onClick={() => handleUserAction({ extendTrial: 30 })}
            disabled={actionLoading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            +30 días trial
          </button>
          {!user?.hasAccess && (
            <button
              onClick={() => handleUserAction({ hasAccess: true })}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Dar acceso
            </button>
          )}
          {user?.hasAccess && (
            <button
              onClick={() => handleUserAction({ hasAccess: false })}
              disabled={actionLoading}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Quitar acceso
            </button>
          )}
          <button
            onClick={() => handleUserAction({ resetTrial: true })}
            disabled={actionLoading}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50"
          >
            Reiniciar trial
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {['info', 'productos', 'usuario'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab === 'info' && 'Información'}
              {tab === 'productos' && `Productos (${business.products?.length || 0})`}
              {tab === 'usuario' && 'Usuario'}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido del tab */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Información del Negocio</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-400">Nombre</dt>
                <dd className="text-white">{business.businessName || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Username</dt>
                <dd className="text-white">/{business.username}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Categoría</dt>
                <dd className="text-white">{business.businessCategory || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Descripción</dt>
                <dd className="text-white">{business.description || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">WhatsApp Pedidos</dt>
                <dd className="text-white">{business.whatsappNumber || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Categorías de Menú</dt>
                <dd className="text-white">{business.categories?.length || 0}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Fechas</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-400">Registrado</dt>
                <dd className="text-white">{formatDate(user?.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Inicio Trial</dt>
                <dd className="text-white">{formatDate(user?.trialStartDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Fin Trial</dt>
                <dd className="text-white">{formatDate(user?.trialEndDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Última actualización</dt>
                <dd className="text-white">{formatDate(business.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {business.coverPhotoUrl && (
            <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4">Portada</h3>
              <img
                src={business.coverPhotoUrl}
                alt="Portada"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'productos' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {business.products?.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Este comercio no tiene productos
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Producto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Categorías</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Variantes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {business.products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {product.imagen ? (
                            <img className="h-10 w-10 rounded-lg object-cover" src={product.imagen} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-600 flex items-center justify-center">
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{product.nombre}</div>
                            {product.descripcion && (
                              <div className="text-xs text-gray-400 truncate max-w-xs">{product.descripcion}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {formatPrice(product.precio)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.categorias?.map((cat) => (
                            <span key={cat} className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {product.variants?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={actionLoading}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'usuario' && user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Información del Usuario</h3>
            <div className="flex items-center mb-6">
              {user.image ? (
                <img className="h-16 w-16 rounded-full" src={user.image} alt="" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center">
                  <span className="text-gray-300 text-2xl">{user.name?.[0] || '?'}</span>
                </div>
              )}
              <div className="ml-4">
                <div className="text-xl font-medium text-white">{user.name}</div>
                <div className="text-gray-400">{user.email}</div>
              </div>
            </div>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-400">WhatsApp Personal</dt>
                <dd className="text-white">{user.personalWhatsapp || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">País</dt>
                <dd className="text-white">{user.country || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Onboarding Completado</dt>
                <dd className="text-white">{user.onboardingCompleted ? 'Sí' : 'No'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-4">Suscripción</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-400">Estado</dt>
                <dd>{getStatusBadge(status, daysLeft)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">Tiene Acceso</dt>
                <dd className="text-white">{user.hasAccess ? 'Sí' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-400">En Trial</dt>
                <dd className="text-white">{user.isOnTrial ? 'Sí' : 'No'}</dd>
              </div>
              {user.customerId && (
                <div>
                  <dt className="text-sm text-gray-400">Stripe Customer ID</dt>
                  <dd className="text-white font-mono text-sm">{user.customerId}</dd>
                </div>
              )}
              {user.priceId && (
                <div>
                  <dt className="text-sm text-gray-400">Stripe Price ID</dt>
                  <dd className="text-white font-mono text-sm">{user.priceId}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
