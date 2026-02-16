'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'

export default function Buttons() {
  const { data: session, status } = useSession()
  const [links, setLinks] = useState([])
  const [isIconModalOpen, setIsIconModalOpen] = useState(false)
  const [currentEditingLink, setCurrentEditingLink] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (status === "authenticated") {
      fetchButtonsData()
    }
  }, [status])

  const fetchButtonsData = async () => {
    try {
      const response = await fetch('/api/get-buttons')
      if (response.ok) {
        const data = await response.json()
        setLinks(data.buttons || [])
      } else {
        console.error('Error fetching buttons data')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: '', url: '', icon: '', isActive: true }])
  }

  const updateLink = (id, field, value) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const removeLink = (id) => {
    setLinks(links.filter(link => link.id !== id))
  }

  const toggleLinkActive = (id) => {
    setLinks(links.map(link =>
      link.id === id ? { ...link, isActive: !link.isActive } : link
    ))
  }

  const openIconModal = (linkId) => {
    setCurrentEditingLink(linkId)
    setIsIconModalOpen(true)
  }

  const closeIconModal = () => {
    setIsIconModalOpen(false)
    setCurrentEditingLink(null)
  }

  const IconModal = () => {
    const icons = [
      { value: 'link', icon: FaIcons.FaLink },
      { value: 'phone', icon: FaIcons.FaPhone },
      { value: 'envelope', icon: FaIcons.FaEnvelope },
      { value: 'map-marker-alt', icon: FaIcons.FaMapMarkerAlt },
      { value: 'calendar', icon: FaIcons.FaCalendar },
      { value: 'shopping-cart', icon: FaIcons.FaShoppingCart },
      { value: 'user', icon: FaIcons.FaUser },
      { value: 'home', icon: FaIcons.FaHome },
      { value: 'instagram', icon: FaIcons.FaInstagram },
      { value: 'facebook', icon: FaIcons.FaFacebook },
      { value: 'tiktok', icon: FaIcons.FaTiktok },
      { value: 'whatsapp', icon: FaIcons.FaWhatsapp },
      { value: 'car', icon: FaIcons.FaCar },
      { value: 'utensils', icon: FaIcons.FaUtensils },
      { value: 'globe', icon: FaIcons.FaGlobe },
    ]

    return (
      <AnimatePresence>
        {isIconModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop"
              onClick={closeIconModal}
            />
            <div className="modal-container">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="modal-panel"
              >
                <div className="modal-header">
                  <h3 className="modal-title">Selecciona un icono</h3>
                  <button onClick={closeIconModal} className="modal-close">
                    <FaIcons.FaTimes className="w-5 h-5" />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="grid grid-cols-5 gap-3">
                    {icons.map((icon) => (
                      <button
                        key={icon.value}
                        type="button"
                        className="p-3 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors border border-transparent hover:border-gray-200"
                        onClick={() => {
                          updateLink(currentEditingLink, 'icon', icon.value)
                          closeIconModal()
                        }}
                      >
                        <icon.icon className="w-6 h-6 text-gray-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    )
  }

  const Toggle = ({ isOn, onToggle }) => {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={`toggle ${isOn ? 'active' : ''}`}
      >
        <span className="sr-only">Activar enlace</span>
        <span className="toggle-knob" />
      </button>
    )
  }

  const getIconComponent = (iconName) => {
    if (!iconName) return FaIcons.FaLink
    const pascalCase = iconName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
    return FaIcons[`Fa${pascalCase}`] || FaIcons.FaLink
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    if (!session || !session.user) {
      setMessage('No estás autenticado')
      setIsLoading(false)
      return
    }

    const buttonsData = {
      buttons: links
    }

    try {
      const response = await fetch('/api/update-buttons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buttonsData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Botones guardados exitosamente')
      } else {
        throw new Error(data.error || 'Error al guardar los botones')
      }
    } catch (error) {
      console.error('Error al guardar los botones:', error)
      setMessage(error.message || 'Ocurrió un error al guardar los botones')
    } finally {
      setIsLoading(false)
    }
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
        <h1 className="page-title">Gestiona tus Enlaces</h1>
        <p className="page-description">
          Añade y personaliza los enlaces que aparecerán en tu perfil.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Links Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Tus enlaces</h2>
            <p className="card-description">El primer enlace será tu link destacado</p>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {links.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                    className={`link-item ${index === 0 ? 'link-item-featured' : ''}`}
                  >
                    {index === 0 && (
                      <div className="link-item-badge">
                        <FaIcons.FaStar />
                        Este es tu link destacado
                      </div>
                    )}

                    <div className="link-item-row">
                      <div className="link-item-inputs">
                        <input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                          placeholder="Título del enlace"
                          className="form-input"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                            placeholder="URL del enlace"
                            className="form-input flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => openIconModal(link.id)}
                            className="btn-secondary flex-shrink-0"
                          >
                            {React.createElement(getIconComponent(link.icon), { className: "w-4 h-4" })}
                            <span className="hidden sm:inline">
                              {link.icon ? 'Cambiar' : 'Icono'}
                            </span>
                          </button>
                        </div>
                      </div>
                      <Toggle
                        isOn={link.isActive}
                        onToggle={() => toggleLinkActive(link.id)}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => removeLink(link.id)}
                        className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                      >
                        <FaIcons.FaTrash className="w-3 h-3" />
                        Eliminar
                      </button>
                      <span className={`text-xs ${link.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                        {link.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {links.length === 0 && (
                <div className="text-center py-8">
                  <FaIcons.FaLink className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No tienes enlaces aún</p>
                  <p className="text-gray-400 text-xs">Añade tu primer enlace para comenzar</p>
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={addLink}
                className="btn-secondary w-full sm:w-auto"
              >
                <FaIcons.FaPlus className="w-4 h-4" />
                Añadir enlace
              </button>
            </div>
          </div>
        </motion.div>

        {/* Icon Modal */}
        <IconModal />

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
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4"
        >
          <button
            type="button"
            className="btn-ghost w-full sm:w-auto"
            onClick={() => fetchButtonsData()}
          >
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
              'Guardar'
            )}
          </button>
        </motion.div>
      </form>
    </div>
  )
}
