'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import config from '@/config';

export default function SuscripcionPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const res = await fetch('/api/subscription');
      const subscriptionData = await res.json();
      setData(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsPortalLoading(true);
    try {
      const res = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        // Si no tiene customerId, usar link directo
        window.location.href = 'https://billing.stripe.com/p/login/3cI14oaUv4HwatIfa41wY00';
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      // Fallback al link directo
      window.location.href = 'https://billing.stripe.com/p/login/3cI14oaUv4HwatIfa41wY00';
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleSubscribe = async (billingPeriod = 'yearly') => {
    setIsCheckoutLoading(true);
    try {
      const essentialPlan = config.stripe.plans.find(p => p.name === 'Plan Esencial');
      const priceId = billingPeriod === 'yearly'
        ? essentialPlan?.priceId?.yearly
        : essentialPlan?.priceId?.monthly;

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          mode: 'subscription',
          successUrl: `${window.location.origin}/dashboard?upgraded=true`,
          cancelUrl: window.location.href,
        }),
      });

      const checkoutData = await response.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Activa',
          color: 'text-green-700',
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
        };
      case 'trial':
        return {
          label: 'Prueba gratuita',
          color: 'text-blue-700',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: Clock,
          iconColor: 'text-blue-600',
        };
      case 'expired':
        return {
          label: 'Expirada',
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: AlertTriangle,
          iconColor: 'text-red-600',
        };
      default:
        return {
          label: 'Sin suscripción',
          color: 'text-gray-700',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: CreditCard,
          iconColor: 'text-gray-600',
        };
    }
  };

  // Obtener precios del plan
  const essentialPlan = config.stripe.plans.find(p => p.name === 'Plan Esencial');
  const monthlyPrice = essentialPlan?.price?.monthly || 199;
  const yearlyPrice = essentialPlan?.price?.yearly || 1499;
  const yearlyMonthly = Math.round(yearlyPrice / 12);
  const savingsPercent = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(data?.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Mi suscripción</h1>
        <p className="page-description">
          Gestiona tu plan y método de pago
        </p>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={`card ${statusConfig.border}`}
      >
        <div className="card-body">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {data?.plan || 'Plan Esencial'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>

              {/* Status-specific info */}
              {data?.status === 'active' && data?.stripeSubscription && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    Próxima facturación: <span className="font-medium">{formatDate(data.subscriptionEndDate)}</span>
                  </p>
                  {data.stripeSubscription.plan && (
                    <p>
                      {formatCurrency(data.stripeSubscription.plan.amount)}/{data.stripeSubscription.plan.interval === 'year' ? 'año' : 'mes'}
                    </p>
                  )}
                  {data.stripeSubscription.cancelAtPeriodEnd && (
                    <p className="text-amber-600 font-medium">
                      Se cancelará al final del periodo actual
                    </p>
                  )}
                </div>
              )}

              {data?.status === 'trial' && (
                <div className="text-sm text-gray-600">
                  <p>
                    Tu prueba termina el <span className="font-medium">{formatDate(data.trialEndDate)}</span>
                  </p>
                  <p className={`font-medium ${data.daysLeft <= 2 ? 'text-red-600' : 'text-blue-600'}`}>
                    {data.daysLeft} {data.daysLeft === 1 ? 'día' : 'días'} restantes
                  </p>
                </div>
              )}

              {data?.status === 'expired' && (
                <div className="text-sm text-red-600">
                  <p>Tu prueba gratuita terminó el {formatDate(data.trialEndDate)}</p>
                  <p className="font-medium">Suscríbete para seguir usando MenúAhora</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions based on status */}
      {data?.status === 'active' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Gestionar suscripción</h2>
            <p className="card-description">Actualiza tu método de pago o cancela tu suscripción</p>
          </div>
          <div className="card-body">
            <button
              onClick={handleManageBilling}
              disabled={isPortalLoading}
              className="btn-primary"
            >
              {isPortalLoading ? (
                <>
                  <span className="spinner w-4 h-4 border-white border-t-transparent"></span>
                  Abriendo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Gestionar facturación
                  <ExternalLink className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-3">
              Serás redirigido al portal seguro de Stripe para gestionar tu suscripción.
            </p>
          </div>
        </motion.div>
      )}

      {(data?.status === 'trial' || data?.status === 'expired' || data?.status === 'none') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">
              {data?.status === 'expired' ? 'Reactiva tu suscripción' : 'Suscríbete ahora'}
            </h2>
            <p className="card-description">
              {data?.status === 'expired'
                ? 'Recupera el acceso a todas las funciones de MenúAhora'
                : 'Elige el plan que mejor se adapte a ti'
              }
            </p>
          </div>
          <div className="card-body">
            {/* Pricing Options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {/* Monthly */}
              <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-gray-900">${monthlyPrice}</span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Facturación mensual</p>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  disabled={isCheckoutLoading}
                  className="w-full btn-secondary"
                >
                  {isCheckoutLoading ? 'Procesando...' : 'Elegir mensual'}
                </button>
              </div>

              {/* Yearly */}
              <div className="border-2 border-[#0D654A] rounded-xl p-4 relative">
                <div className="absolute -top-3 left-4 bg-[#0D654A] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  Ahorra {savingsPercent}%
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-gray-900">${yearlyMonthly}</span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">${yearlyPrice} facturados anualmente</p>
                <p className="text-xs text-green-600 font-medium mb-3">
                  Ahorras ${(monthlyPrice * 12) - yearlyPrice}/año
                </p>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  disabled={isCheckoutLoading}
                  className="w-full btn-primary"
                >
                  {isCheckoutLoading ? 'Procesando...' : 'Elegir anual'}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Incluye:</p>
              <ul className="grid sm:grid-cols-2 gap-2">
                {[
                  'Menú digital personalizable',
                  'Pedidos por WhatsApp',
                  'Productos ilimitados',
                  'Categorías ilimitadas',
                  'Link único para compartir',
                  'Código QR para imprimir',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Información de la cuenta</h2>
        </div>
        <div className="card-body">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Correo electrónico</p>
              <p className="text-sm font-medium text-gray-900">{data?.user?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Nombre</p>
              <p className="text-sm font-medium text-gray-900">{data?.user?.name || 'N/A'}</p>
            </div>
            {data?.user?.createdAt && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Miembro desde</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(data.user.createdAt)}</p>
              </div>
            )}
            {data?.trialStartDate && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Inicio de prueba</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(data.trialStartDate)}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="alert alert-info"
      >
        <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="alert-content">
          <strong>¿Necesitas ayuda?</strong> Escríbenos a{' '}
          <a href="mailto:uriel@repisa.co" className="underline hover:no-underline">
            uriel@repisa.co
          </a>{' '}
          o por WhatsApp.
        </div>
      </motion.div>
    </div>
  );
}
