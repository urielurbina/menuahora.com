'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

const LEVELS = [
  { level: 1, name: 'Novato', minReferrals: 0 },
  { level: 2, name: 'Activo', minReferrals: 3 },
  { level: 3, name: 'Pro', minReferrals: 6 },
  { level: 4, name: 'Experto', minReferrals: 10 },
  { level: 5, name: 'Leyenda', minReferrals: 20 },
];

export default function ReferidosPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchData();

    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      triggerConfetti();
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      const [referralsRes, connectRes] = await Promise.all([
        fetch('/api/referrals'),
        fetch('/api/referrals/connect')
      ]);

      const referralsData = await referralsRes.json();
      const connectData = await connectRes.json();

      setData({
        ...referralsData,
        stripeConnect: connectData
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const copyToClipboard = async () => {
    if (!data?.referralLink) return;

    try {
      await navigator.clipboard.writeText(data.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const handleConnectStripe = async () => {
    setConnectLoading(true);
    try {
      const res = await fetch('/api/referrals/connect', { method: 'POST' });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error connecting Stripe:', error);
    } finally {
      setConnectLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCurrentLevel = () => {
    if (!data?.stats) return LEVELS[0];
    const activeReferrals = data.stats.activeReferrals;
    return [...LEVELS].reverse().find(l => activeReferrals >= l.minReferrals) || LEVELS[0];
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    return LEVELS.find(l => l.level === current.level + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8"></div>
      </div>
    );
  }

  if (!data?.referralCode) {
    return (
      <div className="empty-state">
        <Users className="empty-state-icon" />
        <p className="empty-state-title">Programa de referidos</p>
        <p className="empty-state-description">Completa la configuración de tu negocio para acceder.</p>
      </div>
    );
  }

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel
    ? ((data.stats.activeReferrals - currentLevel.minReferrals) / (nextLevel.minReferrals - currentLevel.minReferrals)) * 100
    : 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Programa de referidos</h1>
        <p className="page-description">
          Invita negocios y gana <span className="font-semibold text-[#0D654A]">$35/mes</span> por cada suscripción activa.
        </p>
      </motion.div>

      {/* Success Banner */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-success"
        >
          <Check className="alert-icon" />
          <div className="alert-content">
            <strong>Cuenta conectada exitosamente.</strong> Ahora recibirás tus ganancias automáticamente.
          </div>
        </motion.div>
      )}

      {/* Warning: Subscription required */}
      {data.subscription && !data.subscription.hasAccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-warning"
        >
          <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="alert-content">
            <strong>Tu código de referido no está activo.</strong> Suscríbete para que tus invitaciones sean válidas y puedas ganar recompensas.
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="card">
          <div className="card-body flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8f5f0] flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-[#0D654A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.stats.activeReferrals}</p>
              <p className="text-xs text-gray-500">Activos</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e8f5f0] flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-[#0D654A]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0D654A]">{formatCurrency(data.stats.monthlyEarnings)}</p>
              <p className="text-xs text-gray-500">Este mes</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.stats.trialReferrals}</p>
              <p className="text-xs text-gray-500">En prueba</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.stats.totalEarnings)}</p>
              <p className="text-xs text-gray-500">Total ganado</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">Tu progreso</h2>
              <p className="card-description">Nivel {currentLevel.level}: {currentLevel.name}</p>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#e8f5f0] text-[#0D654A] text-sm font-medium">
              {data.stats.activeReferrals} referidos
            </div>
          </div>
        </div>
        <div className="card-body">
          {nextLevel ? (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progreso al nivel {nextLevel.level}</span>
                <span className="font-medium text-gray-900">{data.stats.activeReferrals}/{nextLevel.minReferrals}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0D654A] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {nextLevel.minReferrals - data.stats.activeReferrals} referidos más para alcanzar {nextLevel.name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Has alcanzado el nivel máximo. Sigue invitando para ganar más.</p>
          )}
        </div>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="card-title">Tu código de referido</h2>
              <p className="card-description">Compártelo con otros negocios para que se registren</p>
            </div>
            {data.subscription?.hasAccess ? (
              <span className="badge badge-success">Activo</span>
            ) : (
              <span className="badge badge-warning">Inactivo</span>
            )}
          </div>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-4">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl px-8 py-6 text-center">
              <p className="text-3xl font-bold tracking-wider text-gray-900 font-mono">
                {data.referralCode}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Los vendedores pueden usar este código al registrarse
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Comparte tu enlace</h2>
          <p className="card-description">Invita nuevos negocios con tu enlace personalizado</p>
        </div>
        <div className="card-body space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-700 truncate border border-gray-200">
              {data.referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className={`btn-base px-4 ${
                copied
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'btn-primary'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Crea tu menú digital gratis: ${data.referralLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-base bg-[#25D366] text-white hover:bg-[#20bd5a]"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Crea tu menú digital gratis: ${data.referralLink}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>

          <div className="alert alert-info">
            <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="alert-content">
              <strong>Consejo:</strong> Con 6 referidos activos ganas $210/mes, cubriendo tu suscripción.
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stripe Connect Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Recibe tus ganancias</h2>
          <p className="card-description">Conecta tu cuenta bancaria para pagos automáticos</p>
        </div>
        <div className="card-body">
          {data.stripeConnect?.onboarded ? (
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-green-800">Cuenta conectada</p>
                <p className="text-sm text-green-600">Tus ganancias se depositan automáticamente</p>
              </div>
              <button
                onClick={handleConnectStripe}
                className="text-sm text-green-700 hover:text-green-800 underline"
              >
                Actualizar
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Conecta tu cuenta bancaria para recibir tus ganancias automáticamente cada vez que un referido pague.
              </p>
              <button
                onClick={handleConnectStripe}
                disabled={connectLoading}
                className="btn-base bg-[#635BFF] text-white hover:bg-[#5851DB] disabled:opacity-50"
              >
                {connectLoading ? (
                  <>
                    <div className="spinner w-4 h-4 border-white border-t-transparent"></div>
                    Conectando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                    Conectar con Stripe
                  </>
                )}
              </button>
              {data.stats.totalEarnings > 0 && !data.stripeConnect?.onboarded && (
                <p className="mt-3 text-sm text-amber-600">
                  Tienes ganancias pendientes. Conecta tu cuenta para recibirlas.
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Referrals List */}
      {data.referrals?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Tus referidos</h2>
            <p className="card-description">{data.referrals.length} {data.referrals.length === 1 ? 'negocio invitado' : 'negocios invitados'}</p>
          </div>
          <div className="card-body p-0">
            <div className="divide-y divide-gray-100">
              {data.referrals.map((referral, index) => (
                <div
                  key={referral._id || index}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div className="flex items-center gap-3">
                    {referral.image ? (
                      <img src={referral.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                        {referral.name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{referral.businessName || referral.name || 'Sin nombre'}</p>
                      {referral.username && (
                        <p className="text-xs text-gray-500">repisa.co/{referral.username}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {referral.hasAccess ? (
                      <span className="badge badge-success">Activo</span>
                    ) : referral.isOnTrial ? (
                      <span className="badge" style={{ background: 'var(--info-light)', color: '#1e40af' }}>En prueba</span>
                    ) : (
                      <span className="badge badge-neutral">Inactivo</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Cómo funciona</h2>
          <p className="card-description">Tres pasos simples para empezar a ganar</p>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#e8f5f0] text-[#0D654A] flex items-center justify-center text-sm font-semibold mb-3">
                1
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Comparte tu enlace</h3>
              <p className="text-xs text-gray-500">
                Envía tu enlace o código a otros negocios
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#e8f5f0] text-[#0D654A] flex items-center justify-center text-sm font-semibold mb-3">
                2
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Ellos se suscriben</h3>
              <p className="text-xs text-gray-500">
                Cuando paguen su suscripción después del trial
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-[#e8f5f0] text-[#0D654A] flex items-center justify-center text-sm font-semibold mb-3">
                3
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Ganas $35/mes</h3>
              <p className="text-xs text-gray-500">
                Recibe $35 cada mes mientras sigan activos
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Meta: Suscripción gratis</p>
                <p className="text-xs text-gray-500 mt-0.5">Con 6 referidos activos ganas $210/mes</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-[#0D654A]">
                  {Math.min(data.stats.activeReferrals, 6)}/6
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0D654A] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((data.stats.activeReferrals / 6) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
