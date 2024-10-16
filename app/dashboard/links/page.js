'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faLink, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faCalendar, 
  faShoppingCart, 
  faUser, 
  faHome,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'
import {
  faInstagram,
  faFacebook,
  faTiktok,
  faWhatsapp
} from '@fortawesome/free-brands-svg-icons'

// Añade los iconos a la biblioteca
library.add(
  faLink, 
  faPhone, 
  faEnvelope, 
  faMapMarkerAlt, 
  faCalendar, 
  faShoppingCart, 
  faUser, 
  faHome,
  faInstagram,
  faFacebook,
  faTiktok,
  faWhatsapp,
  faChevronDown
)

export default function Links() {
  const [extraLinks, setExtraLinks] = useState([])
  const [primaryIcon, setPrimaryIcon] = useState('')
  const [secondaryIcon, setSecondaryIcon] = useState('')

  const addExtraLink = () => {
    setExtraLinks([...extraLinks, { title: '', url: '' }])
  }

  const renderIconPreview = (icon) => {
    if (!icon) return null
    return <FontAwesomeIcon icon={icon} className="w-5 h-5 text-gray-500" />
  }

  const IconSelector = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    const icons = [
      { value: '', label: 'Selecciona un icono (opcional)', icon: null },
      { value: 'link', label: 'Enlace', icon: ['fas', 'link'] },
      { value: 'phone', label: 'Teléfono', icon: ['fas', 'phone'] },
      { value: 'envelope', label: 'Correo', icon: ['fas', 'envelope'] },
      { value: 'map-marker-alt', label: 'Ubicación', icon: ['fas', 'map-marker-alt'] },
      { value: 'calendar', label: 'Calendario', icon: ['fas', 'calendar'] },
      { value: 'shopping-cart', label: 'Carrito de Compras', icon: ['fas', 'shopping-cart'] },
      { value: 'user', label: 'Usuario', icon: ['fas', 'user'] },
      { value: 'home', label: 'Inicio', icon: ['fas', 'home'] },
      { value: 'instagram', label: 'Instagram', icon: ['fab', 'instagram'] },
      { value: 'facebook', label: 'Facebook', icon: ['fab', 'facebook'] },
      { value: 'tiktok', label: 'TikTok', icon: ['fab', 'tiktok'] },
      { value: 'whatsapp', label: 'WhatsApp', icon: ['fab', 'whatsapp'] },
    ]

    const selectedIcon = icons.find(icon => icon.value === value) || icons[0]

    return (
      <div className="relative w-full">
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center">
            {selectedIcon.icon && <FontAwesomeIcon icon={selectedIcon.icon} className="mr-2 w-5" />}
            {selectedIcon.label}
          </span>
          <FontAwesomeIcon icon={['fas', 'chevron-down']} />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
            <ul className="max-h-60 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5">
              {icons.map((icon) => (
                <li
                  key={icon.value}
                  className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                  onClick={() => {
                    onChange(icon.value)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    {icon.icon ? (
                      <FontAwesomeIcon icon={icon.icon} className="mr-2 w-5 h-5" />
                    ) : (
                      <span className="mr-2 w-5 h-5"></span>
                    )}
                    <span>{icon.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-base font-semibold leading-7 text-gray-900">Gestiona tus Enlaces</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Personaliza tu perfil añadiendo tus redes sociales e información de contacto.
        </p>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
          {[
            { name: 'Instagram', placeholder: 'Ingresa tu nombre de usuario de Instagram', icon: 'instagram' },
            { name: 'Facebook', placeholder: 'Ingresa la URL de tu perfil de Facebook', icon: 'facebook' },
            { name: 'TikTok', placeholder: 'Ingresa tu nombre de usuario de TikTok', icon: 'tiktok' },
          ].map((field) => (
            <div key={field.name} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor={field.name.toLowerCase()} className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                {field.name}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    <FontAwesomeIcon icon={field.icon} className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    name={field.name.toLowerCase()}
                    id={field.name.toLowerCase()}
                    placeholder={field.placeholder}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-base font-semibold leading-7 text-gray-900">Botones de Acción</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Configura tus botones de acción principal y secundario.
        </p>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
          {[
            { type: 'Principal', state: primaryIcon, setState: setPrimaryIcon },
            { type: 'Secundario', state: secondaryIcon, setState: setSecondaryIcon }
          ].map((button) => (
            <div key={button.type} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Botón {button.type}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Texto del Botón"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="w-full">
                      <IconSelector
                        value={button.state}
                        onChange={(value) => button.setState(value)}
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="URL del Botón"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-base font-semibold leading-7 text-gray-900">Enlaces Adicionales</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Añade enlaces adicionales a tu perfil.
        </p>

        <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
          {extraLinks.map((link, index) => (
            <div key={index} className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Enlace Adicional {index + 1}
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Título del Enlace"
                    className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={link.title}
                    onChange={(e) => {
                      const newLinks = [...extraLinks]
                      newLinks[index].title = e.target.value
                      setExtraLinks(newLinks)
                    }}
                  />
                  <input
                    type="text"
                    placeholder="URL del Enlace"
                    className="block w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...extraLinks]
                      newLinks[index].url = e.target.value
                      setExtraLinks(newLinks)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <motion.button
            type="button"
            onClick={addExtraLink}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Añadir Enlace Adicional
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          href="/dashboard"
          className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Volver al Panel
        </Link>
        <motion.button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Guardar
        </motion.button>
      </div>
    </div>
  )
}
