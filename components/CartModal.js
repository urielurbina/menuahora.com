'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onEditItem,
  appearance,
  total,
  onCreateOrder,
  deliverySettings
}) {
  const [step, setStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState({
    nombre: '',
    metodoPago: '',
    tipoEntrega: '',
    direccion: '',
    // Nuevos campos para entregas modulares
    deliveryMethod: '',
    selectedBranch: '',
    selectedMeetingPoint: '',
    selectedZone: '',
    shippingAddress: ''
  });

  // Determinar si hay configuracion de entregas modular
  const hasDeliverySettings = deliverySettings?.methods;

  // Obtener metodos habilitados
  const enabledMethods = useMemo(() => {
    if (!hasDeliverySettings) return [];
    const methods = [];
    if (deliverySettings.methods.pickup?.enabled) methods.push('pickup');
    if (deliverySettings.methods.meetingPoint?.enabled) methods.push('meetingPoint');
    if (deliverySettings.methods.delivery?.enabled) methods.push('delivery');
    if (deliverySettings.methods.shipping?.enabled) methods.push('shipping');
    return methods;
  }, [deliverySettings, hasDeliverySettings]);

  // Calcular costo de envio
  const calculateDeliveryCost = () => {
    if (!hasDeliverySettings || !orderDetails.deliveryMethod) return 0;

    const method = orderDetails.deliveryMethod;
    const methods = deliverySettings.methods;

    switch (method) {
      case 'pickup':
        return 0;

      case 'meetingPoint':
        if (orderDetails.selectedMeetingPoint && methods.meetingPoint?.points) {
          const point = methods.meetingPoint.points.find(p => p.id === orderDetails.selectedMeetingPoint);
          return point?.cost || 0;
        }
        return 0;

      case 'delivery':
        // Verificar envio gratis
        if (methods.delivery?.freeAbove && total >= methods.delivery.freeAbove) {
          return 0;
        }

        if (methods.delivery?.costType === 'fixed') {
          return methods.delivery.fixedCost || 0;
        }

        if (methods.delivery?.costType === 'byZone' && orderDetails.selectedZone) {
          const zone = methods.delivery.zones?.find(z => z.id === orderDetails.selectedZone);
          return zone?.cost || 0;
        }

        return null; // Por calcular

      case 'shipping':
        if (methods.shipping?.costType === 'fixed') {
          return methods.shipping.fixedCost || 0;
        }
        return null; // Por calcular

      default:
        return 0;
    }
  };

  const deliveryCost = calculateDeliveryCost();
  const finalTotal = deliveryCost !== null ? total + deliveryCost : total;

  // Verificar pedido minimo
  const meetsMinimumOrder = () => {
    if (!hasDeliverySettings || orderDetails.deliveryMethod !== 'delivery') return true;
    const minimumOrder = deliverySettings.methods.delivery?.minimumOrder;
    if (!minimumOrder) return true;
    return total >= minimumOrder;
  };

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDeliveryMethodLabel = () => {
    if (!hasDeliverySettings) {
      return orderDetails.tipoEntrega === 'recoleccion' ? 'Recoleccion en tienda' : 'Entrega a domicilio';
    }

    switch (orderDetails.deliveryMethod) {
      case 'pickup':
        if (deliverySettings.locationType === 'branches' && orderDetails.selectedBranch) {
          const branch = deliverySettings.branches?.find(b => b.id === orderDetails.selectedBranch);
          return `Recoleccion en ${branch?.name || 'sucursal'}`;
        }
        return 'Recoleccion en tienda';

      case 'meetingPoint':
        if (orderDetails.selectedMeetingPoint) {
          const point = deliverySettings.methods.meetingPoint.points?.find(p => p.id === orderDetails.selectedMeetingPoint);
          return `Punto medio: ${point?.name || ''}`;
        }
        return 'Punto medio';

      case 'delivery':
        if (deliverySettings.methods.delivery?.costType === 'byZone' && orderDetails.selectedZone) {
          const zone = deliverySettings.methods.delivery.zones?.find(z => z.id === orderDetails.selectedZone);
          return `Domicilio - Zona: ${zone?.name || ''}`;
        }
        return 'Entrega a domicilio';

      case 'shipping':
        return 'Envio por paqueteria';

      default:
        return '';
    }
  };

  const getDeliveryAddress = () => {
    if (!hasDeliverySettings) {
      return orderDetails.tipoEntrega === 'domicilio' ? orderDetails.direccion : '';
    }

    switch (orderDetails.deliveryMethod) {
      case 'pickup':
        if (deliverySettings.locationType === 'branches' && orderDetails.selectedBranch) {
          const branch = deliverySettings.branches?.find(b => b.id === orderDetails.selectedBranch);
          return branch?.address || '';
        }
        return deliverySettings.mainLocation?.address || '';

      case 'meetingPoint':
        if (orderDetails.selectedMeetingPoint) {
          const point = deliverySettings.methods.meetingPoint.points?.find(p => p.id === orderDetails.selectedMeetingPoint);
          return point?.address || '';
        }
        return '';

      case 'delivery':
      case 'shipping':
        return orderDetails.shippingAddress || orderDetails.direccion;

      default:
        return '';
    }
  };

  const createWhatsAppMessage = () => {
    let message = `*${appearance?.['basic-info']?.businessName || 'Nuevo pedido'}*\n\n`;

    cartItems.forEach(item => {
      message += `- (${item.quantity}x) ${item.nombre}`;
      if (item.variantsSummary && item.variantsSummary.length > 0) {
        message += ` _Variantes: ${item.variantsSummary.join(', ')}_`;
      } else if (item.tipo) {
        message += ` _Tipo: ${item.tipo}_`;
      }
      if (item.extras?.length > 0) {
        message += ` _Extras: ${item.extras.join(', ')}_`;
      }
      message += ` > *$ ${(item.price * item.quantity).toFixed(2)}*\n`;
    });

    message += `\n*Subtotal: $ ${total.toFixed(2)}*\n`;

    if (deliveryCost !== null) {
      if (deliveryCost === 0 && hasDeliverySettings && orderDetails.deliveryMethod === 'delivery' &&
          deliverySettings.methods.delivery?.freeAbove && total >= deliverySettings.methods.delivery.freeAbove) {
        message += `*Envio: Gratis*\n`;
      } else if (deliveryCost > 0) {
        message += `*Envio: $ ${deliveryCost.toFixed(2)}*\n`;
      } else {
        message += `*Envio: Gratis*\n`;
      }
      message += `*Total: $ ${finalTotal.toFixed(2)}*\n\n`;
    } else {
      message += `*Envio: Por calcular*\n`;
      message += `*Total: $ ${total.toFixed(2)} + envio*\n\n`;
    }

    message += `Nombre: *${orderDetails.nombre}*\n`;
    message += `Metodo de pago: *${orderDetails.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia bancaria'}*\n`;
    message += `Entrega: *${getDeliveryMethodLabel()}*\n`;

    const address = getDeliveryAddress();
    if (address && (orderDetails.deliveryMethod === 'delivery' || orderDetails.deliveryMethod === 'shipping' || orderDetails.tipoEntrega === 'domicilio')) {
      message += `Direccion: *${address}*`;
    }

    const whatsappNumber = appearance?.['basic-info']?.contact?.whatsappNumber || '';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

    return whatsappUrl;
  };

  const isFormValid = () => {
    if (!orderDetails.nombre || !orderDetails.metodoPago) return false;

    if (hasDeliverySettings) {
      if (!orderDetails.deliveryMethod) return false;

      // Validaciones especificas por metodo
      switch (orderDetails.deliveryMethod) {
        case 'pickup':
          if (deliverySettings.locationType === 'branches' && deliverySettings.branches?.length > 0) {
            if (!orderDetails.selectedBranch) return false;
          }
          break;
        case 'meetingPoint':
          if (!orderDetails.selectedMeetingPoint) return false;
          break;
        case 'delivery':
          if (!meetsMinimumOrder()) return false;
          if (deliverySettings.methods.delivery?.costType === 'byZone' && !orderDetails.selectedZone) return false;
          if (!orderDetails.shippingAddress && !orderDetails.direccion) return false;
          break;
        case 'shipping':
          if (!orderDetails.shippingAddress && !orderDetails.direccion) return false;
          break;
      }
    } else {
      if (!orderDetails.tipoEntrega) return false;
      if (orderDetails.tipoEntrega === 'domicilio' && !orderDetails.direccion) return false;
    }

    return true;
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
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-black text-black hover:bg-black hover:text-white rounded-lg transition-colors"
            >
              Seguir comprando
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
                  Tu carrito esta vacio
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 border-b border-gray-200 last:border-b-0">
                      {/* Informacion del producto */}
                      <div className="flex items-start space-x-3 mb-3">
                        {item.imagen && (
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden">
                            <Image
                              src={item.imagen}
                              alt={item.nombre}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{item.nombre}</h3>
                          <div className="mt-1 text-xs text-gray-500 space-y-1">
                          {item.variantsSummary && item.variantsSummary.length > 0 && (
                            <div className="space-y-1">
                              {item.variantsSummary.map((variant, index) => (
                                <p key={index} className="text-xs text-gray-600">
                                  {variant}
                                </p>
                              ))}
                            </div>
                          )}
                            {/* Compatibilidad con estructura antigua */}
                            {item.tipo && !item.variantsSummary && <p>Tipo: {item.tipo}</p>}
                            {item.extras && item.extras.length > 0 && (
                              <p>Extras: {item.extras.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                          {item.basePrice && item.variantPrice > 0 && (
                            <p className="text-xs text-gray-400">
                              Base: ${item.basePrice.toFixed(2)} + ${item.variantPrice.toFixed(2)}
                            </p>
                          )}
                          {item.wholesaleDiscount && (
                            <p className="text-xs text-green-600">
                              Descuento aplicado: -{item.wholesaleDiscount.discountPercentage}%
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Controles del item */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-2 text-base hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 border-x text-base font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2 text-base hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditItem && onEditItem(item)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
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
                  Metodo de pago
                </label>
                <select
                  name="metodoPago"
                  value={orderDetails.metodoPago}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona un metodo</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia bancaria</option>
                </select>
              </div>

              {/* Selector de entrega modular o legacy */}
              {hasDeliverySettings ? (
                // UI Modular
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Como quieres recibir tu pedido?
                    </label>
                    <div className="space-y-2">
                      {/* Recoleccion */}
                      {enabledMethods.includes('pickup') && (
                        <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${orderDetails.deliveryMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="pickup"
                              checked={orderDetails.deliveryMethod === 'pickup'}
                              onChange={handleInputChange}
                              className="form-radio"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Recoleccion</p>
                              <p className="text-xs text-gray-500">
                                {deliverySettings.locationType === 'branches'
                                  ? 'Recoge en una de nuestras sucursales'
                                  : deliverySettings.mainLocation?.address || 'Recoge en nuestra ubicacion'}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-green-600">Gratis</span>
                        </label>
                      )}

                      {/* Selector de sucursal si hay multiples */}
                      {orderDetails.deliveryMethod === 'pickup' &&
                       deliverySettings.locationType === 'branches' &&
                       deliverySettings.branches?.filter(b => b.isActive).length > 0 && (
                        <div className="ml-6 mt-2">
                          <select
                            name="selectedBranch"
                            value={orderDetails.selectedBranch}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg text-sm"
                          >
                            <option value="">Selecciona sucursal</option>
                            {deliverySettings.branches.filter(b => b.isActive).map(branch => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name} - {branch.address}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Punto medio */}
                      {enabledMethods.includes('meetingPoint') && (
                        <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${orderDetails.deliveryMethod === 'meetingPoint' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="meetingPoint"
                              checked={orderDetails.deliveryMethod === 'meetingPoint'}
                              onChange={handleInputChange}
                              className="form-radio"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Punto medio</p>
                              <p className="text-xs text-gray-500">Nos encontramos en un punto acordado</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">Varia</span>
                        </label>
                      )}

                      {/* Selector de punto medio */}
                      {orderDetails.deliveryMethod === 'meetingPoint' &&
                       deliverySettings.methods.meetingPoint?.points?.length > 0 && (
                        <div className="ml-6 mt-2">
                          <select
                            name="selectedMeetingPoint"
                            value={orderDetails.selectedMeetingPoint}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg text-sm"
                          >
                            <option value="">Selecciona punto de encuentro</option>
                            {deliverySettings.methods.meetingPoint.points.map(point => (
                              <option key={point.id} value={point.id}>
                                {point.name} - {point.address} {point.cost > 0 ? `(+$${point.cost})` : '(Gratis)'}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Domicilio */}
                      {enabledMethods.includes('delivery') && (
                        <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${orderDetails.deliveryMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="delivery"
                              checked={orderDetails.deliveryMethod === 'delivery'}
                              onChange={handleInputChange}
                              className="form-radio"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Envio a domicilio</p>
                              <p className="text-xs text-gray-500">
                                {deliverySettings.methods.delivery?.minimumOrder
                                  ? `Pedido minimo: $${deliverySettings.methods.delivery.minimumOrder}`
                                  : 'Entrega directa a tu direccion'}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {deliverySettings.methods.delivery?.costType === 'fixed'
                              ? `+$${deliverySettings.methods.delivery.fixedCost}`
                              : deliverySettings.methods.delivery?.costType === 'byZone'
                                ? 'Por zona'
                                : 'Por calcular'}
                          </span>
                        </label>
                      )}

                      {/* Opciones de domicilio expandidas */}
                      {orderDetails.deliveryMethod === 'delivery' && (
                        <div className="ml-6 mt-2 space-y-3">
                          {/* Advertencia de pedido minimo */}
                          {!meetsMinimumOrder() && (
                            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                El pedido minimo para envio a domicilio es de ${deliverySettings.methods.delivery.minimumOrder}.
                                Te faltan ${(deliverySettings.methods.delivery.minimumOrder - total).toFixed(2)} para alcanzarlo.
                              </p>
                            </div>
                          )}

                          {/* Envio gratis */}
                          {deliverySettings.methods.delivery?.freeAbove && (
                            <div className={`p-2 rounded-lg text-sm ${total >= deliverySettings.methods.delivery.freeAbove ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                              {total >= deliverySettings.methods.delivery.freeAbove
                                ? 'Envio gratis aplicado!'
                                : `Agrega $${(deliverySettings.methods.delivery.freeAbove - total).toFixed(2)} mas para envio gratis`}
                            </div>
                          )}

                          {/* Selector de zona */}
                          {deliverySettings.methods.delivery?.costType === 'byZone' &&
                           deliverySettings.methods.delivery?.zones?.length > 0 && (
                            <select
                              name="selectedZone"
                              value={orderDetails.selectedZone}
                              onChange={handleInputChange}
                              className="w-full p-2 border rounded-lg text-sm"
                            >
                              <option value="">Selecciona tu zona</option>
                              {deliverySettings.methods.delivery.zones.map(zone => (
                                <option key={zone.id} value={zone.id}>
                                  {zone.name} (+${zone.cost})
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Direccion */}
                          <textarea
                            name="shippingAddress"
                            value={orderDetails.shippingAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg text-sm"
                            rows="2"
                            placeholder="Tu direccion completa"
                          />
                        </div>
                      )}

                      {/* Paqueteria */}
                      {enabledMethods.includes('shipping') && (
                        <label className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${orderDetails.deliveryMethod === 'shipping' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="deliveryMethod"
                              value="shipping"
                              checked={orderDetails.deliveryMethod === 'shipping'}
                              onChange={handleInputChange}
                              className="form-radio"
                            />
                            <div>
                              <p className="font-medium text-gray-900">Envio por paqueteria</p>
                              <p className="text-xs text-gray-500">Envio a cualquier parte del pais</p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">
                            {deliverySettings.methods.shipping?.costType === 'fixed'
                              ? `+$${deliverySettings.methods.shipping.fixedCost}`
                              : 'Por calcular'}
                          </span>
                        </label>
                      )}

                      {/* Direccion de paqueteria */}
                      {orderDetails.deliveryMethod === 'shipping' && (
                        <div className="ml-6 mt-2">
                          <textarea
                            name="shippingAddress"
                            value={orderDetails.shippingAddress}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-lg text-sm"
                            rows="3"
                            placeholder="Direccion completa con codigo postal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // UI Legacy
                <>
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
                      <option value="recoleccion">Recoleccion</option>
                      <option value="domicilio">Entrega a domicilio</option>
                    </select>
                  </div>

                  {orderDetails.tipoEntrega === 'domicilio' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Direccion de entrega
                      </label>
                      <textarea
                        name="direccion"
                        value={orderDetails.direccion}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-lg"
                        rows="3"
                        placeholder="Tu direccion completa"
                        required
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-4">
          {step === 2 && hasDeliverySettings && orderDetails.deliveryMethod && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envio</span>
                <span>
                  {deliveryCost === null
                    ? 'Por calcular'
                    : deliveryCost === 0
                      ? 'Gratis'
                      : `$${deliveryCost.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-1"></div>
            </div>
          )}

          <div className="flex items-center justify-between font-semibold text-lg">
            <span>Total {step === 2 && deliveryCost === null ? 'estimado' : ''}</span>
            <span>
              ${finalTotal.toFixed(2)}
              {step === 2 && deliveryCost === null && ' + envio'}
            </span>
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
                disabled={!isFormValid()}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                  !isFormValid()
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
