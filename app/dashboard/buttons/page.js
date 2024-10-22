'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Selecciona un icono</h3>
            <button onClick={closeIconModal} className="text-gray-500 hover:text-gray-700">
              <FaIcons.FaTimes />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {icons.map((icon) => (
              <button
                key={icon.value}
                className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                onClick={() => {
                  updateLink(currentEditingLink, 'icon', icon.value)
                  closeIconModal()
                }}
              >
                <icon.icon className="w-6 h-6" />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const Switch = ({ isOn, onToggle }) => {
    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:ring-offset-2 ${
            isOn ? 'bg-[#0D654A]' : 'bg-gray-200'
        }`}
      >
        <span className="sr-only">Activar enlace</span>
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isOn ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    );
  };

  const getIconComponent = (iconName) => {
    const pascalCase = iconName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
    return FaIcons[`Fa${pascalCase}`] || FaIcons.FaPlus
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
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-3xl font-bold text-gray-900">Gestiona tus Enlaces</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Añade y personaliza los enlaces que aparecerán en tu perfil.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {links.map((link, index) => (
            <div key={link.id} className="col-span-full">
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg p-4 mb-4">
                {index === 0 && (
                  <div className="text-sm text-[#0D654A] font-semibold mb-2">
                    <FaIcons.FaStar className="inline mr-1" /> Este es tu link destacado
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-grow mr-4">
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                      placeholder="Título del enlace"
                      className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                    />
                  </div>
                  <Switch
                    isOn={link.isActive}
                    onToggle={() => toggleLinkActive(link.id)}
                  />
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                    placeholder="URL del enlace"
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6 mr-2"
                  />
                  <button
                    onClick={() => openIconModal(link.id)}
                    className="flex-shrink-0 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 whitespace-nowrap"
                  >
                    {React.createElement(getIconComponent(link.icon), { className: "inline mr-2" })}
                    {link.icon ? 'Cambiar icono' : 'Seleccionar icono'}
                  </button>
                </div>
                <button
                  onClick={() => removeLink(link.id)}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  <FaIcons.FaTrash className="inline mr-1" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <motion.button
            onClick={addLink}
            className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaIcons.FaPlus className="inline mr-2" />
            Añadir enlace
          </motion.button>
        </div>
      </div>

      {isIconModalOpen && <IconModal />}

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => fetchButtonsData()}
        >
          Cancelar
        </button>
        <motion.button
          type="submit"
          className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </motion.button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  )
}
