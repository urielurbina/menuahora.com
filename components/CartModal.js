'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

export default function CartModal({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  appearance,
  total,
  onCreateOrder
}) {
  const [step, setStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    nombre: '',
    metodoPago: '',
    tipoEntrega: '',
    direccion: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createWhatsAppMessage = () => {
    const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let message = `*${appearance?.['basic-info']?.businessName || 'Nuevo pedido'}*\n\n`;
    
    cartItems.forEach(item => {
      message += `— (${item.quantity}x) ${item.nombre}`;
      if (item.tipo) message += ` _Tipo: ${item.tipo}_`;
      if (item.extras?.length > 0) {
        message += ` _Extras: ${item.extras.join(', ')}_`;
      }
      message += ` > *$ ${(item.price * item.quantity).toFixed(2)}*\n`;
    });

    message += `\n*Total: $ ${total.toFixed(2)}*\n\n`;
    message += `Nombre: *${orderDetails.nombre}*\n`;
    message += `Método de pago: *${orderDetails.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia bancaria'}*\n`;
    message += `Entrega: *${orderDetails.tipoEntrega === 'recoleccion' ? 'Recolección en tienda' : 'Entrega a domicilio'}*\n`;
    
    if (orderDetails.tipoEntrega === 'domicilio' && orderDetails.direccion) {
      message += `Domicilio de entrega: *${orderDetails.direccion}*`;
    }

    const whatsappNumber = appearance?.['basic-info']?.contact?.whatsappNumber || '526142406894';
    console.log('WhatsApp Number:', whatsappNumber);
    console.log('Full appearance:', appearance);
    
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
    
    return whatsappUrl;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl flex flex-col md:max-w-md">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {step === 1 ? 'Tu Pedido' : 'Completa tu pedido'}
            </h2>
            <button onClick={onClose} className="p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {step === 1 ? (
            // Paso 1: Lista de productos
            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tu carrito está vacío
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 border-b pb-4">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                        <Image
                          src={item.imagen}
                          alt={item.nombre}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.nombre}</h3>
                        {item.tipo && <p className="text-sm text-gray-500">Tipo: {item.tipo}</p>}
                        {item.extras?.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Extras: {item.extras.join(', ')}
                          </p>
                        )}
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-500"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Paso 2: Formulario de datos
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={orderDetails.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Método de pago
                </label>
                <select
                  name="metodoPago"
                  value={orderDetails.metodoPago}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona un método</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia bancaria</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de entrega
                </label>
                <select
                  name="tipoEntrega"
                  value={orderDetails.tipoEntrega}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona tipo de entrega</option>
                  <option value="recoleccion">Recolección</option>
                  <option value="domicilio">Entrega a domicilio</option>
                </select>
              </div>

              {orderDetails.tipoEntrega === 'domicilio' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección de entrega
                  </label>
                  <textarea
                    name="direccion"
                    value={orderDetails.direccion}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Tu dirección completa"
                    required
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-4">
          <div className="flex items-center justify-between font-semibold text-lg">
            <span>Total estimado</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={cartItems.length === 0}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                cartItems.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800'
              }`}
            >
              Continuar
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => setStep(1)}
                className="w-full py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50"
              >
                Volver a mi carrito
              </button>
              <button
                onClick={() => {
                  const whatsappUrl = createWhatsAppMessage();
                  window.open(whatsappUrl, '_blank');
                }}
                disabled={!orderDetails.nombre || !orderDetails.metodoPago || !orderDetails.tipoEntrega}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  !orderDetails.nombre || !orderDetails.metodoPago || !orderDetails.tipoEntrega
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Completar pedido en WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 