'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const DEFAULT_DELIVERY_SETTINGS = {
  locationType: "single",
  mainLocation: {
    address: "",
    reference: "",
    coordinates: null,
    schedule: null
  },
  branches: [],
  methods: {
    pickup: { enabled: true },
    meetingPoint: { enabled: false, points: [] },
    delivery: {
      enabled: false,
      costType: "pending",
      fixedCost: 0,
      zones: [],
      freeAbove: null,
      minimumOrder: null
    },
    shipping: {
      enabled: false,
      costType: "pending",
      fixedCost: 0
    }
  }
};

export default function EntregasPage() {
  const { status } = useSession();
  const [settings, setSettings] = useState(DEFAULT_DELIVERY_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === "authenticated") {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      setIsFetching(true);
      const response = await fetch('/api/delivery-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.deliverySettings) {
          setSettings(() => ({
            ...DEFAULT_DELIVERY_SETTINGS,
            ...data.deliverySettings,
            mainLocation: {
              ...DEFAULT_DELIVERY_SETTINGS.mainLocation,
              ...(data.deliverySettings.mainLocation || {})
            },
            methods: {
              ...DEFAULT_DELIVERY_SETTINGS.methods,
              ...(data.deliverySettings.methods || {}),
              pickup: {
                ...DEFAULT_DELIVERY_SETTINGS.methods.pickup,
                ...(data.deliverySettings.methods?.pickup || {})
              },
              meetingPoint: {
                ...DEFAULT_DELIVERY_SETTINGS.methods.meetingPoint,
                ...(data.deliverySettings.methods?.meetingPoint || {})
              },
              delivery: {
                ...DEFAULT_DELIVERY_SETTINGS.methods.delivery,
                ...(data.deliverySettings.methods?.delivery || {})
              },
              shipping: {
                ...DEFAULT_DELIVERY_SETTINGS.methods.shipping,
                ...(data.deliverySettings.methods?.shipping || {})
              }
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching delivery settings:', error);
      setMessage('Error al cargar la configuracion');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/delivery-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setMessage('Configuracion guardada exitosamente');
      } else {
        throw new Error('Error al guardar');
      }
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      setMessage('Error al guardar la configuracion');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMethod = (method, field, value) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        [method]: {
          ...prev.methods[method],
          [field]: value
        }
      }
    }));
  };

  const addMeetingPoint = () => {
    const newPoint = {
      id: Date.now().toString(),
      name: '',
      address: '',
      cost: 0
    };
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        meetingPoint: {
          ...prev.methods.meetingPoint,
          points: [...prev.methods.meetingPoint.points, newPoint]
        }
      }
    }));
  };

  const updateMeetingPoint = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        meetingPoint: {
          ...prev.methods.meetingPoint,
          points: prev.methods.meetingPoint.points.map(p =>
            p.id === id ? { ...p, [field]: value } : p
          )
        }
      }
    }));
  };

  const removeMeetingPoint = (id) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        meetingPoint: {
          ...prev.methods.meetingPoint,
          points: prev.methods.meetingPoint.points.filter(p => p.id !== id)
        }
      }
    }));
  };

  const addZone = () => {
    const newZone = {
      id: Date.now().toString(),
      name: '',
      cost: 0
    };
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        delivery: {
          ...prev.methods.delivery,
          zones: [...prev.methods.delivery.zones, newZone]
        }
      }
    }));
  };

  const updateZone = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        delivery: {
          ...prev.methods.delivery,
          zones: prev.methods.delivery.zones.map(z =>
            z.id === id ? { ...z, [field]: value } : z
          )
        }
      }
    }));
  };

  const removeZone = (id) => {
    setSettings(prev => ({
      ...prev,
      methods: {
        ...prev.methods,
        delivery: {
          ...prev.methods.delivery,
          zones: prev.methods.delivery.zones.filter(z => z.id !== id)
        }
      }
    }));
  };

  const addBranch = () => {
    const newBranch = {
      id: Date.now().toString(),
      name: '',
      address: '',
      reference: '',
      coordinates: null,
      schedule: null,
      isActive: true
    };
    setSettings(prev => ({
      ...prev,
      branches: [...prev.branches, newBranch]
    }));
  };

  const updateBranch = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      branches: prev.branches.map(b =>
        b.id === id ? { ...b, [field]: value } : b
      )
    }));
  };

  const removeBranch = (id) => {
    setSettings(prev => ({
      ...prev,
      branches: prev.branches.filter(b => b.id !== id)
    }));
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Entregas</h1>
        <p className="page-description">
          Configura los metodos de entrega disponibles para tus clientes.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Ubicacion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Tipo de ubicacion</h2>
            <p className="card-description">Define si tienes una o varias sucursales</p>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="locationType"
                  value="single"
                  checked={settings.locationType === "single"}
                  onChange={(e) => setSettings(prev => ({ ...prev, locationType: e.target.value }))}
                  className="form-radio"
                />
                <div>
                  <p className="font-medium text-gray-900">Ubicacion unica</p>
                  <p className="text-sm text-gray-500">Tengo un solo punto de venta o entrega</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="locationType"
                  value="branches"
                  checked={settings.locationType === "branches"}
                  onChange={(e) => setSettings(prev => ({ ...prev, locationType: e.target.value }))}
                  className="form-radio"
                />
                <div>
                  <p className="font-medium text-gray-900">Multiples sucursales</p>
                  <p className="text-sm text-gray-500">Tengo varias ubicaciones donde los clientes pueden recoger</p>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Mi Ubicacion (si es single) */}
        {settings.locationType === "single" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="card"
          >
            <div className="card-header">
              <h2 className="card-title">Mi ubicacion</h2>
              <p className="card-description">Direccion donde los clientes pueden recoger sus pedidos</p>
            </div>
            <div className="card-body">
              <div className="form-group">
                <div className="form-field">
                  <label className="form-label">Direccion</label>
                  <input
                    type="text"
                    value={settings.mainLocation.address}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mainLocation: { ...prev.mainLocation, address: e.target.value }
                    }))}
                    className="form-input"
                    placeholder="Calle, numero, colonia, ciudad"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">
                    Referencia <span className="form-label-optional">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={settings.mainLocation.reference}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      mainLocation: { ...prev.mainLocation, reference: e.target.value }
                    }))}
                    className="form-input"
                    placeholder="Frente a..., entre calles..., etc."
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Sucursales (si es branches) */}
        {settings.locationType === "branches" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="card-title">Sucursales</h2>
                  <p className="card-description">Administra tus puntos de venta</p>
                </div>
                <button
                  type="button"
                  onClick={addBranch}
                  className="btn-secondary text-sm"
                >
                  + Agregar sucursal
                </button>
              </div>
            </div>
            <div className="card-body">
              {settings.branches.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No hay sucursales configuradas. Agrega una para comenzar.
                </p>
              ) : (
                <div className="space-y-4">
                  {settings.branches.map((branch, index) => (
                    <div key={branch.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Sucursal {index + 1}</span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={branch.isActive}
                              onChange={(e) => updateBranch(branch.id, 'isActive', e.target.checked)}
                              className="form-checkbox"
                            />
                            <span className="text-sm text-gray-600">Activa</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeBranch(branch.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-field">
                          <label className="form-label">Nombre</label>
                          <input
                            type="text"
                            value={branch.name}
                            onChange={(e) => updateBranch(branch.id, 'name', e.target.value)}
                            className="form-input"
                            placeholder="Sucursal Centro"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Direccion</label>
                          <input
                            type="text"
                            value={branch.address}
                            onChange={(e) => updateBranch(branch.id, 'address', e.target.value)}
                            className="form-input"
                            placeholder="Calle, numero, colonia"
                          />
                        </div>
                        <div className="form-field md:col-span-2">
                          <label className="form-label">Referencia</label>
                          <input
                            type="text"
                            value={branch.reference}
                            onChange={(e) => updateBranch(branch.id, 'reference', e.target.value)}
                            className="form-input"
                            placeholder="Frente a..., entre calles..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Metodos de Entrega */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Metodos de entrega</h2>
            <p className="card-description">Configura las opciones de entrega para tus clientes</p>
          </div>
          <div className="card-body space-y-6">
            {/* Recoleccion */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Recoleccion en tienda</h3>
                    <p className="text-sm text-gray-500">El cliente recoge su pedido en tu ubicacion</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateMethod('pickup', 'enabled', !settings.methods.pickup.enabled)}
                  className={`toggle ${settings.methods.pickup.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>
            </div>

            {/* Punto Medio */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Punto medio</h3>
                    <p className="text-sm text-gray-500">Entrega en ubicaciones predefinidas</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateMethod('meetingPoint', 'enabled', !settings.methods.meetingPoint.enabled)}
                  className={`toggle ${settings.methods.meetingPoint.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              {settings.methods.meetingPoint.enabled && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Puntos de encuentro</span>
                    <button
                      type="button"
                      onClick={addMeetingPoint}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Agregar punto
                    </button>
                  </div>
                  {settings.methods.meetingPoint.points.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      No hay puntos configurados
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {settings.methods.meetingPoint.points.map((point) => (
                        <div key={point.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={point.name}
                              onChange={(e) => updateMeetingPoint(point.id, 'name', e.target.value)}
                              className="form-input text-sm"
                              placeholder="Nombre del punto"
                            />
                            <input
                              type="text"
                              value={point.address}
                              onChange={(e) => updateMeetingPoint(point.id, 'address', e.target.value)}
                              className="form-input text-sm"
                              placeholder="Direccion"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">$</span>
                              <input
                                type="number"
                                value={point.cost}
                                onChange={(e) => updateMeetingPoint(point.id, 'cost', parseFloat(e.target.value) || 0)}
                                className="form-input text-sm"
                                placeholder="Costo"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMeetingPoint(point.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Domicilio */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Entrega a domicilio</h3>
                    <p className="text-sm text-gray-500">Envio directo al domicilio del cliente</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateMethod('delivery', 'enabled', !settings.methods.delivery.enabled)}
                  className={`toggle ${settings.methods.delivery.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              {settings.methods.delivery.enabled && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Tipo de costo */}
                  <div>
                    <label className="form-label">Tipo de costo</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${settings.methods.delivery.costType === 'fixed' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="deliveryCostType"
                          value="fixed"
                          checked={settings.methods.delivery.costType === "fixed"}
                          onChange={(e) => updateMethod('delivery', 'costType', e.target.value)}
                          className="form-radio"
                        />
                        <span className="text-sm">Costo fijo</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${settings.methods.delivery.costType === 'byZone' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="deliveryCostType"
                          value="byZone"
                          checked={settings.methods.delivery.costType === "byZone"}
                          onChange={(e) => updateMethod('delivery', 'costType', e.target.value)}
                          className="form-radio"
                        />
                        <span className="text-sm">Por zona</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${settings.methods.delivery.costType === 'pending' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="deliveryCostType"
                          value="pending"
                          checked={settings.methods.delivery.costType === "pending"}
                          onChange={(e) => updateMethod('delivery', 'costType', e.target.value)}
                          className="form-radio"
                        />
                        <span className="text-sm">Por calcular</span>
                      </label>
                    </div>
                  </div>

                  {/* Costo fijo */}
                  {settings.methods.delivery.costType === 'fixed' && (
                    <div className="form-field">
                      <label className="form-label">Costo de envio</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={settings.methods.delivery.fixedCost}
                          onChange={(e) => updateMethod('delivery', 'fixedCost', parseFloat(e.target.value) || 0)}
                          className="form-input pl-7"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}

                  {/* Zonas */}
                  {settings.methods.delivery.costType === 'byZone' && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Zonas de entrega</span>
                        <button
                          type="button"
                          onClick={addZone}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Agregar zona
                        </button>
                      </div>
                      {settings.methods.delivery.zones.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-2">
                          No hay zonas configuradas
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {settings.methods.delivery.zones.map((zone) => (
                            <div key={zone.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <input
                                type="text"
                                value={zone.name}
                                onChange={(e) => updateZone(zone.id, 'name', e.target.value)}
                                className="form-input text-sm flex-1"
                                placeholder="Nombre de la zona"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">$</span>
                                <input
                                  type="number"
                                  value={zone.cost}
                                  onChange={(e) => updateZone(zone.id, 'cost', parseFloat(e.target.value) || 0)}
                                  className="form-input text-sm w-24"
                                  placeholder="Costo"
                                  min="0"
                                  step="0.01"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeZone(zone.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Opciones adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="form-field">
                      <label className="form-label">
                        Envio gratis arriba de <span className="form-label-optional">(opcional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={settings.methods.delivery.freeAbove || ''}
                          onChange={(e) => updateMethod('delivery', 'freeAbove', e.target.value ? parseFloat(e.target.value) : null)}
                          className="form-input pl-7"
                          placeholder="Sin limite"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="form-field">
                      <label className="form-label">
                        Pedido minimo <span className="form-label-optional">(opcional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={settings.methods.delivery.minimumOrder || ''}
                          onChange={(e) => updateMethod('delivery', 'minimumOrder', e.target.value ? parseFloat(e.target.value) : null)}
                          className="form-input pl-7"
                          placeholder="Sin minimo"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Envio por paqueteria */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Envio por paqueteria</h3>
                    <p className="text-sm text-gray-500">Envio a nivel nacional o internacional</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateMethod('shipping', 'enabled', !settings.methods.shipping.enabled)}
                  className={`toggle ${settings.methods.shipping.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </div>

              {settings.methods.shipping.enabled && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <label className="form-label">Tipo de costo</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${settings.methods.shipping.costType === 'fixed' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="shippingCostType"
                          value="fixed"
                          checked={settings.methods.shipping.costType === "fixed"}
                          onChange={(e) => updateMethod('shipping', 'costType', e.target.value)}
                          className="form-radio"
                        />
                        <span className="text-sm">Costo fijo</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${settings.methods.shipping.costType === 'pending' ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="shippingCostType"
                          value="pending"
                          checked={settings.methods.shipping.costType === "pending"}
                          onChange={(e) => updateMethod('shipping', 'costType', e.target.value)}
                          className="form-radio"
                        />
                        <span className="text-sm">Por calcular</span>
                      </label>
                    </div>
                  </div>

                  {settings.methods.shipping.costType === 'fixed' && (
                    <div className="form-field">
                      <label className="form-label">Costo de envio</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={settings.methods.shipping.fixedCost}
                          onChange={(e) => updateMethod('shipping', 'fixedCost', parseFloat(e.target.value) || 0)}
                          className="form-input pl-7"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Message Alert */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`alert ${message.includes('error') || message.includes('Error') ? 'alert-error' : 'alert-success'}`}
          >
            <svg className="alert-icon" viewBox="0 0 20 20" fill="currentColor">
              {message.includes('error') || message.includes('Error') ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              )}
            </svg>
            <div className="alert-content">{message}</div>
          </motion.div>
        )}

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4"
        >
          <button type="button" onClick={fetchSettings} className="btn-ghost w-full sm:w-auto">
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary w-full sm:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </>
            ) : (
              'Guardar configuracion'
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
