'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import config from '@/config';
import { getReferralCode, clearReferralCode } from '@/components/ReferralCapture';

// Lista de rubros/categorías
const CATEGORIES = [
  'Restaurante',
  'Cafetería',
  'Panadería',
  'Comida rápida',
  'Tacos y antojitos',
  'Pizzería',
  'Sushi',
  'Postres y repostería',
  'Bebidas',
  'Tienda de abarrotes',
  'Bar',
  'Mariscos',
  'Comida saludable',
  'Food truck',
  'Otro',
];

// Lista de países
const COUNTRIES = [
  { code: 'MX', name: 'México', prefix: '+52' },
  { code: 'US', name: 'Estados Unidos', prefix: '+1' },
  { code: 'CO', name: 'Colombia', prefix: '+57' },
  { code: 'AR', name: 'Argentina', prefix: '+54' },
  { code: 'ES', name: 'España', prefix: '+34' },
  { code: 'CL', name: 'Chile', prefix: '+56' },
  { code: 'PE', name: 'Perú', prefix: '+51' },
  { code: 'EC', name: 'Ecuador', prefix: '+593' },
  { code: 'VE', name: 'Venezuela', prefix: '+58' },
  { code: 'GT', name: 'Guatemala', prefix: '+502' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506' },
  { code: 'PA', name: 'Panamá', prefix: '+507' },
  { code: 'DO', name: 'República Dominicana', prefix: '+1' },
  { code: 'PR', name: 'Puerto Rico', prefix: '+1' },
  { code: 'OTHER', name: 'Otro', prefix: '' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [errors, setErrors] = useState({});

  // Datos del paso 1
  const [step1Data, setStep1Data] = useState({
    businessName: '',
    username: '',
    category: '',
    orderWhatsapp: '',
    personalWhatsapp: '',
    country: 'MX',
  });

  // Datos del paso 2 (opcional)
  const [step2Data, setStep2Data] = useState({
    logoUrl: '',
    coverPhotoUrl: '',
    description: '',
  });

  // Validación de username
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Código de referido
  const [referralCode, setReferralCode] = useState('');
  const [referralInfo, setReferralInfo] = useState(null);
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [referralError, setReferralError] = useState('');

  // Verificar estado de onboarding al cargar
  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/signin');
      return;
    }

    checkOnboardingStatus();
  }, [session, status]);

  const checkOnboardingStatus = async () => {
    try {
      const res = await fetch('/api/onboarding');
      const data = await res.json();

      if (data.onboardingCompleted) {
        router.push('/dashboard');
        return;
      }

      // Pre-llenar datos existentes
      if (data.currentData) {
        if (data.currentData.business.businessName) {
          setStep1Data(prev => ({
            ...prev,
            businessName: data.currentData.business.businessName || '',
            username: data.currentData.business.username || '',
            category: data.currentData.business.category || '',
            orderWhatsapp: data.currentData.business.orderWhatsapp || '',
            personalWhatsapp: data.currentData.user.personalWhatsapp || '',
            country: data.currentData.user.country || 'MX',
          }));

          if (data.currentData.business.username) {
            setUsernameAvailable(true);
          }
        }

        if (data.currentData.business.description) {
          setStep2Data(prev => ({
            ...prev,
            logoUrl: data.currentData.business.logoUrl || '',
            coverPhotoUrl: data.currentData.business.coverPhotoUrl || '',
            description: data.currentData.business.description || '',
          }));
        }
      }

      setIsCheckingStatus(false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsCheckingStatus(false);
    }
  };

  // Debounce para verificación de username
  const validateUsername = useCallback(async (username) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);

    try {
      const res = await fetch(`/api/check-username?username=${username}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    }

    setCheckingUsername(false);
  }, []);

  // Debounce effect para username
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step1Data.username.length >= 3) {
        validateUsername(step1Data.username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [step1Data.username, validateUsername]);

  // Cargar y validar código de referido cuando llega al paso 3
  useEffect(() => {
    if (currentStep === 3) {
      const savedCode = getReferralCode();
      if (savedCode) {
        setReferralCode(savedCode);
        validateReferralCode(savedCode);
      }
    }
  }, [currentStep]);

  // Validar código de referido
  const validateReferralCode = async (code) => {
    if (!code || code.length < 3) {
      setReferralInfo(null);
      setReferralError('');
      return;
    }

    setCheckingReferral(true);
    setReferralError('');

    try {
      const res = await fetch(`/api/validate-referral?code=${code.toLowerCase()}`);
      const data = await res.json();

      if (data.valid) {
        setReferralInfo(data.referrer);
      } else {
        setReferralInfo(null);
        if (data.reason === 'self_referral') {
          setReferralError('No puedes usar tu propio código');
        } else if (data.reason === 'referrer_no_subscription') {
          setReferralError('Este código no está activo');
        }
      }
    } catch (error) {
      console.error('Error validating referral:', error);
      setReferralInfo(null);
    }

    setCheckingReferral(false);
  };

  // Debounce para validación de código de referido manual
  useEffect(() => {
    if (!showReferralInput) return;

    const timer = setTimeout(() => {
      if (referralCode.length >= 3) {
        validateReferralCode(referralCode);
      } else {
        setReferralInfo(null);
        setReferralError('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode, showReferralInput]);

  const handleStep1Submit = async () => {
    setIsLoading(true);
    setErrors({});

    // Validaciones
    const newErrors = {};

    if (!step1Data.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido';
    }

    if (!step1Data.username || step1Data.username.length < 3) {
      newErrors.username = 'El username debe tener al menos 3 caracteres';
    } else if (usernameAvailable === false) {
      newErrors.username = 'Este username no está disponible';
    }

    if (!step1Data.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (!step1Data.orderWhatsapp.trim()) {
      newErrors.orderWhatsapp = 'El WhatsApp para pedidos es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1, ...step1Data }),
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentStep(2);
      } else {
        setErrors({ general: data.error || 'Error al guardar los datos' });
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión' });
    }

    setIsLoading(false);
  };

  const handleStep2Submit = async (skip = false) => {
    if (!skip && (step2Data.description || step2Data.logoUrl || step2Data.coverPhotoUrl)) {
      setIsLoading(true);

      try {
        await fetch('/api/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step: 2, ...step2Data }),
        });
      } catch (error) {
        console.error('Error saving step 2:', error);
      }

      setIsLoading(false);
    }

    setCurrentStep(3);
  };

  const handleStartTrial = async () => {
    setIsLoading(true);

    try {
      // Solo enviar código de referido si fue validado exitosamente
      const validReferralCode = referralInfo ? referralCode : undefined;

      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 3,
          referredBy: validReferralCode
        }),
      });

      if (res.ok) {
        // Limpiar el código de referido después de usarlo
        clearReferralCode();
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setErrors({ general: data.error || 'Error al iniciar el trial' });
        setIsLoading(false);
      }
    } catch (error) {
      setErrors({ general: 'Error de conexión' });
      setIsLoading(false);
    }
  };

  // Obtener precios del plan Esencial
  const essentialPlan = config.stripe.plans.find(p => p.name === 'Plan Esencial');
  const monthlyPrice = essentialPlan?.price?.monthly || 199;
  const yearlyPrice = essentialPlan?.price?.yearly || 1499;
  const savingsPercent = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);

  if (status === 'loading' || isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0D654A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-[#0D654A]"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Logo */}
      <div className="pt-6 pb-2 px-4 flex justify-center">
        <img
          src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729739519/ohglabavyxhuflbn7jun.svg"
          alt="MenúAhora"
          className="h-7"
        />
      </div>

      {/* Steps indicator */}
      <div className="py-4 px-4">
        <div className="max-w-md mx-auto flex justify-center gap-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${currentStep >= step
                    ? 'bg-[#0D654A] text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {currentStep > step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div
                  className={`w-12 h-0.5 ml-3 transition-all duration-300 ${
                    currentStep > step ? 'bg-[#0D654A]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* PASO 1: Datos del negocio */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto px-4 py-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Cuéntanos sobre tu negocio
              </h1>
              <p className="text-gray-600 mb-6">
                Esta información nos ayuda a personalizar tu experiencia
              </p>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              <div className="space-y-4">
                {/* Nombre del negocio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de tu negocio *
                  </label>
                  <input
                    type="text"
                    value={step1Data.businessName}
                    onChange={(e) => setStep1Data({ ...step1Data, businessName: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all ${
                      errors.businessName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ej: Tacos El Güero"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link de tu tienda *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 text-sm">
                      menuahora.com/
                    </span>
                    <input
                      type="text"
                      value={step1Data.username}
                      onChange={(e) => {
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        setStep1Data({ ...step1Data, username: val });
                      }}
                      className={`flex-1 px-4 py-2.5 border rounded-r-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="tacoselguero"
                    />
                  </div>
                  <div className="mt-1 min-h-[20px]">
                    {checkingUsername && (
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                        Verificando...
                      </p>
                    )}
                    {!checkingUsername && usernameAvailable === true && step1Data.username.length >= 3 && (
                      <p className="text-green-600 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Disponible
                      </p>
                    )}
                    {!checkingUsername && usernameAvailable === false && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        No disponible
                      </p>
                    )}
                    {errors.username && !checkingUsername && (
                      <p className="text-red-500 text-sm">{errors.username}</p>
                    )}
                  </div>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rubro o categoría *
                  </label>
                  <select
                    value={step1Data.category}
                    onChange={(e) => setStep1Data({ ...step1Data, category: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                {/* País */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    value={step1Data.country}
                    onChange={(e) => setStep1Data({ ...step1Data, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* WhatsApp para pedidos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp para recibir pedidos *
                  </label>
                  <input
                    type="tel"
                    value={step1Data.orderWhatsapp}
                    onChange={(e) => setStep1Data({ ...step1Data, orderWhatsapp: e.target.value })}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all ${
                      errors.orderWhatsapp ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+52 55 1234 5678"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Aquí recibirás los pedidos de tus clientes
                  </p>
                  {errors.orderWhatsapp && (
                    <p className="text-red-500 text-sm mt-1">{errors.orderWhatsapp}</p>
                  )}
                </div>

                {/* WhatsApp personal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu WhatsApp personal
                  </label>
                  <input
                    type="tel"
                    value={step1Data.personalWhatsapp}
                    onChange={(e) => setStep1Data({ ...step1Data, personalWhatsapp: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent"
                    placeholder="+52 55 8765 4321"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Para que nuestro equipo te contacte si necesitas ayuda
                  </p>
                </div>
              </div>

              <button
                onClick={handleStep1Submit}
                disabled={isLoading}
                className="w-full mt-6 py-3 px-4 bg-[#0D654A] text-white font-medium rounded-lg hover:bg-[#0A5038] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Guardando...
                  </>
                ) : (
                  'Continuar'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* PASO 2: Personalización (Opcional) */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto px-4 py-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Personaliza tu tienda
                </h1>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Opcional
                </span>
              </div>
              <p className="text-gray-600 mb-6">
                Puedes completar esto ahora o hacerlo después desde el dashboard
              </p>

              <div className="space-y-4">
                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción de tu negocio
                  </label>
                  <textarea
                    value={step2Data.description}
                    onChange={(e) => setStep2Data({ ...step2Data, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D654A] focus:border-transparent resize-none"
                    placeholder="Los mejores tacos de la ciudad desde 1995..."
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {step2Data.description.length}/200 caracteres
                  </p>
                </div>

                {/* Nota sobre personalización */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Podrás agregar más después
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Logo, foto de portada, horarios y más desde tu dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleStep2Submit(true)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Omitir
                </button>
                <button
                  onClick={() => handleStep2Submit(false)}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-[#0D654A] text-white font-medium rounded-lg hover:bg-[#0A5038] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Guardando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 3: Iniciar Trial */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-md mx-auto px-4 py-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              {/* Icono de celebración */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Todo listo!
              </h1>
              <p className="text-gray-600 mb-8">
                Comienza tu prueba gratuita de <span className="font-semibold text-[#0D654A]">7 días</span> y explora todas las funciones de MenúAhora
              </p>

              {/* Código de referido */}
              {(referralInfo || showReferralInput) && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-left">
                  {referralInfo ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">
                          Referido por {referralInfo.businessName}
                        </p>
                        <p className="text-xs text-green-600">
                          Código: {referralCode.toUpperCase()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setReferralCode('');
                          setReferralInfo(null);
                          setShowReferralInput(true);
                        }}
                        className="text-xs text-green-700 hover:text-green-800 underline"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : showReferralInput && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de referido
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0D654A] focus:border-transparent"
                          placeholder="Ingresa el código"
                        />
                        {checkingReferral && (
                          <div className="flex items-center px-3">
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                          </div>
                        )}
                      </div>
                      {referralCode.length >= 3 && !checkingReferral && !referralInfo && (
                        <p className="text-red-500 text-xs mt-1">
                          {referralError || 'Código no válido'}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setShowReferralInput(false);
                          setReferralCode('');
                          setReferralInfo(null);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Botón para agregar código de referido */}
              {!referralInfo && !showReferralInput && (
                <button
                  onClick={() => setShowReferralInput(true)}
                  className="w-full mb-6 py-3 px-4 border border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-[#0D654A] hover:text-[#0D654A] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tengo un código de referido
                </button>
              )}

              {/* Características incluidas */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-700 mb-3">Incluye todo:</p>
                <ul className="space-y-2">
                  {['Menú digital personalizable', 'Pedidos por WhatsApp', 'Productos ilimitados', 'Link único para compartir'].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Precios después del trial */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-3">Después de tu prueba gratuita:</p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">${monthlyPrice}</p>
                    <p className="text-sm text-gray-500">por mes</p>
                  </div>
                  <div className="text-center border-l border-gray-300 pl-6">
                    <p className="text-2xl font-bold text-gray-900">${yearlyPrice}</p>
                    <p className="text-sm text-gray-500">por año</p>
                    <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full mt-1">
                      Ahorra {savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              <button
                onClick={handleStartTrial}
                disabled={isLoading}
                className="w-full py-4 px-4 bg-[#0D654A] text-white font-semibold rounded-lg hover:bg-[#0A5038] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                    Iniciando...
                  </>
                ) : (
                  'Comenzar mi prueba gratuita'
                )}
              </button>

              <p className="text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Sin tarjeta de crédito requerida
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
