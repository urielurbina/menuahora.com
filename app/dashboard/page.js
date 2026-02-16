'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useQRCode } from 'next-qrcode';

export default function Welcome() {
  const [username, setUsername] = useState('');
  const [copied, setCopied] = useState(false);
  const { Canvas } = useQRCode();

  useEffect(() => {
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleDownloadPNG = () => {
    const canvas = document.querySelector('#qr-canvas canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `menuahora-${username}-qr.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Bienvenido a tu Panel de Configuración</h1>
        <p className="page-description">
          Aquí podrás personalizar y gestionar tu menú digital de manera fácil y eficiente.
        </p>
      </motion.div>

      {/* Link Copy Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Link de tu menú</h2>
          <p className="card-description">Comparte este link con tus clientes para que vean tu catálogo</p>
        </div>
        <div className="card-body">
          <div className="link-copy-field">
            <input
              type="text"
              value={`https://menuahora.com/${username}`}
              readOnly
              className="link-copy-input"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="link-copy-button"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* QR Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card"
      >
        <div className="card-header">
          <h2 className="card-title">Código QR de tu menú</h2>
          <p className="card-description">Imprime este código QR para que tus clientes escaneen fácilmente</p>
        </div>
        <div className="card-body">
          <div className="qr-section">
            <div id="qr-canvas" className="qr-code-container mb-4">
              <Canvas
                text={`https://menuahora.com/${username}`}
                options={{
                  level: 'M',
                  margin: 2,
                  scale: 4,
                  width: 180,
                  color: {
                    dark: '#18181b',
                    light: '#ffffff',
                  },
                }}
              />
            </div>
            <button
              onClick={handleDownloadPNG}
              className="btn-primary"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Descargar QR
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tip Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="alert alert-warning"
      >
        <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="alert-content">
          <strong>Recomendación:</strong> Para una mejor experiencia de edición, te sugerimos modificar tu menú desde una computadora de escritorio o laptop.
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Link href="/dashboard/productos">
          <button className="btn-primary w-full sm:w-auto">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ir a Productos
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
