'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import config from '@/config';

export default function TrialExpiradoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('yearly');

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    // Verificar si realmente el trial expiró
    fetch('/api/check-stripe-access')
      .then(res => res.json())
      .then(data => {
        if (data.hasAccess) {
          // Si tiene acceso, redirigir al dashboard
          router.push('/dashboard');
        }
      })
      .catch(console.error);
  }, [session, status, router]);

  const handleCheckout = async () => {
    setIsLoading(true);

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
          cancelUrl: `${window.location.origin}/trial-expirado`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      setIsLoading(false);
    }
  };

  const essentialPlan = config.stripe.plans.find(p => p.name === 'Plan Esencial');
  const monthlyPrice = essentialPlan?.price?.monthly || 199;
  const yearlyPrice = essentialPlan?.price?.yearly || 1499;
  const yearlyMonthly = Math.round(yearlyPrice / 12);
  const savingsPercent = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0D654A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="py-6 px-4 flex justify-center">
        <img
          src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
          alt="MenúAhora"
          className="h-7"
        />
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header con icono */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              Tu prueba gratuita ha terminado
            </h1>
            <p className="text-white/90">
              Continúa recibiendo pedidos por WhatsApp
            </p>
          </div>

          {/* Contenido */}
          <div className="p-6">
            {/* Toggle de periodo */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Anual
                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                    -{savingsPercent}%
                  </span>
                </button>
              </div>
            </div>

            {/* Precio */}
            <div className="text-center mb-6">
              {billingPeriod === 'yearly' ? (
                <>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-gray-900">${yearlyMonthly}</span>
                    <span className="text-gray-500">/mes</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ${yearlyPrice} facturados anualmente
                  </p>
                </>
              ) : (
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">${monthlyPrice}</span>
                  <span className="text-gray-500">/mes</span>
                </div>
              )}
            </div>

            {/* Características */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">Todo lo que necesitas:</p>
              <ul className="space-y-2">
                {[
                  'Menú digital personalizable',
                  'Pedidos directos por WhatsApp',
                  'Productos y categorías ilimitados',
                  'Link único para compartir',
                  'Código QR para imprimir',
                  'Activación inmediata'
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botón de pago */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 px-4 bg-[#0D654A] text-white font-semibold rounded-lg hover:bg-[#0A5038] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                  Procesando...
                </>
              ) : (
                <>
                  Continuar con mi menú
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {/* Garantía */}
            <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Pago seguro con Stripe
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar sesión
              </button>
              <a
                href="mailto:uriel@menuahora.com"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ¿Necesitas ayuda?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
