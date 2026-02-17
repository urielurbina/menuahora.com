'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Cloudinary } from "@cloudinary/url-gen";

// Inicializa Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  }
});

export default function InformacionBasica() {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    slogan: '',
    logoUrl: '',
    coverPhotoUrl: '',
    seoKeywords: '',
    contact: {
      phoneNumber: '',
      whatsappNumber: '',
      facebookLink: '',
      address: '',
    },
    schedule: {
      enabled: false,
      days: {
        lunes: { open: '09:00', close: '18:00', isClosed: false },
        martes: { open: '09:00', close: '18:00', isClosed: false },
        miércoles: { open: '09:00', close: '18:00', isClosed: false },
        jueves: { open: '09:00', close: '18:00', isClosed: false },
        viernes: { open: '09:00', close: '18:00', isClosed: false },
        sábado: { open: '10:00', close: '14:00', isClosed: false },
        domingo: { open: '10:00', close: '14:00', isClosed: true },
      },
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [dragActive, setDragActive] = useState({ logo: false, cover: false });
  const [previewImage, setPreviewImage] = useState({ logo: null, cover: null });

  useEffect(() => {
    if (status === "authenticated") {
      fetchBasicInfo();
    }
  }, [status]);

  const fetchBasicInfo = async () => {
    try {
      console.log('Iniciando fetch de información básica...');
      const response = await fetch('/api/get-basic-info');
      console.log('Respuesta recibida:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Datos recibidos:', data);

        // Verificar que los datos existan antes de usarlos
        const basicInfo = data['basic-info'] || {};

        // Convert seoKeywords array to comma-separated string for input
        const seoKeywordsString = Array.isArray(data.seoKeywords)
          ? data.seoKeywords.join(', ')
          : '';

        setFormData(prevData => ({
          ...prevData,
          ...basicInfo,
          seoKeywords: seoKeywordsString,
          contact: { ...prevData.contact, ...(basicInfo.contact || {}) },
          schedule: { ...prevData.schedule, ...(basicInfo.schedule || {}) }
        }));

        // Actualizar previewImage si es necesario
        if (basicInfo.logoUrl) {
          setPreviewImage(prev => ({ ...prev, logo: basicInfo.logoUrl }));
        }
        if (basicInfo.coverPhotoUrl) {
          setPreviewImage(prev => ({ ...prev, cover: basicInfo.coverPhotoUrl }));
        }
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        setMessage(`Error al cargar la información: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error fetching basic info:', error);
      setMessage(`No se pudo cargar la información: ${error.message}`);
    }
  };

  const handleDrag = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  }, []);

  const handleDrop = useCallback((e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files, type);
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      handleFiles(files, name === 'logoFile' ? 'logo' : 'cover');
    } else {
      // Validación especial para el número de WhatsApp
      if (name === 'contact.whatsappNumber') {
        // Eliminar cualquier caracter que no sea número o '+'
        let cleanNumber = value.replace(/[^\d+]/g, '');
        // Asegurar que comience con '+'
        if (!cleanNumber.startsWith('+')) {
          cleanNumber = '+' + cleanNumber;
        }
        // Actualizar el estado con el número limpio
        setFormData(prevData => ({
          ...prevData,
          contact: {
            ...prevData.contact,
            whatsappNumber: cleanNumber
          }
        }));
        return;
      }

      setFormData(prevData => {
        const newData = { ...prevData };
        if (name.includes('.')) {
          const [section, field] = name.split('.');
          newData[section] = { ...newData[section], [field]: value };
        } else {
          newData[name] = value;
        }
        return newData;
      });
    }
  }, []);

  const handleFiles = useCallback(async (files, type) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png'];
      if (validTypes.includes(file.type)) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('type', type); // Añadimos el tipo de imagen (logo o cover)

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(`Error al subir la imagen: ${data.error}`);
          }

          const imageUrl = data.url;

          setPreviewImage(prev => ({ ...prev, [type]: imageUrl }));
          setFormData(prevData => ({
            ...prevData,
            [`${type}Url`]: imageUrl
          }));
        } catch (error) {
          console.error('Error detallado:', error);
          alert(error.message);
        }
      } else {
        alert('Por favor, sube solo archivos JPG o PNG.');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validar el formato del número de WhatsApp
    const whatsappRegex = /^\+\d{10,15}$/;
    if (!whatsappRegex.test(formData.contact.whatsappNumber)) {
      setMessage('El número de WhatsApp debe incluir el código de país (ejemplo: +521234567890)');
      setIsLoading(false);
      return;
    }

    if (!session || !session.user) {
      setMessage('No estás autenticado');
      setIsLoading(false);
      return;
    }

    // Obtener el userId de la sesión
    const userId = session.user.id;

    // Parse SEO keywords from comma-separated string to array
    const seoKeywordsArray = formData.seoKeywords
      ? formData.seoKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      : [];

    // Preparar los datos para enviar
    const dataToSend = {
      userId, // Incluir el userId del usuario autenticado
      seoKeywords: seoKeywordsArray,
      'basic-info': {
        businessName: formData.businessName,
        description: formData.description,
        slogan: formData.slogan,
        logoUrl: previewImage.logo || formData.logoUrl,
        coverPhotoUrl: previewImage.cover || formData.coverPhotoUrl,
        contact: {
          phoneNumber: formData.contact.phoneNumber,
          whatsappNumber: formData.contact.whatsappNumber,
          facebookLink: formData.contact.facebookLink,
          address: formData.contact.address,
        },
        schedule: formData.schedule.enabled ? {
          enabled: true,
          days: formData.schedule.days
        } : { enabled: false },
      }
    };

    try {
      const response = await fetch('/api/save-basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      if (data.success) {
        setMessage('Información guardada exitosamente');
        // Actualizamos el formData con las nuevas URLs de las imágenes
        setFormData(prevData => ({
          ...prevData,
          logoUrl: dataToSend['basic-info'].logoUrl,
          coverPhotoUrl: dataToSend['basic-info'].coverPhotoUrl,
        }));
      } else {
        throw new Error(data.error || 'Ocurrió un error al guardar la información');
      }
    } catch (error) {
      console.error('Error al guardar la información:', error);
      setMessage(error.message || 'Ocurrió un error al guardar la información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleToggle = (e) => {
    setFormData(prevData => ({
      ...prevData,
      schedule: {
        ...prevData.schedule,
        enabled: e.target.checked
      }
    }));
  };

  const handleScheduleChange = (day, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      schedule: {
        ...prevData.schedule,
        days: {
          ...prevData.schedule.days,
          [day]: {
            ...prevData.schedule.days[day],
            [field]: value
          }
        }
      }
    }));
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        const time = `${hour}:${minute}`;
        options.push({ value: time, label: time });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minWidth: '100px',
      fontSize: '0.875rem',
      borderColor: state.isFocused ? 'var(--brand-primary)' : 'var(--gray-300)',
      boxShadow: state.isFocused ? '0 0 0 2px var(--brand-primary-light)' : 'none',
      '&:hover': {
        borderColor: 'var(--brand-primary)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '100px',
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'var(--brand-primary)' : state.isFocused ? 'var(--brand-primary-light)' : 'white',
      color: state.isSelected ? 'white' : 'var(--gray-900)',
      fontSize: '0.875rem',
    }),
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
        <h1 className="page-title">Información básica</h1>
        <p className="page-description">
          Esta información será mostrada públicamente, así que ten cuidado con lo que compartes.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Datos del negocio</h2>
            <p className="card-description">Información principal que verán tus clientes</p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <div className="form-field">
                <label htmlFor="businessName" className="form-label">
                  Nombre del negocio
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tu negocio"
                />
              </div>

              <div className="form-field">
                <label htmlFor="slogan" className="form-label">
                  Slogan
                </label>
                <input
                  type="text"
                  id="slogan"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Tu slogan aquí"
                />
              </div>

              <div className="form-field">
                <label htmlFor="description" className="form-label">
                  Descripción general
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={200}
                  rows={3}
                  className="form-input"
                  placeholder="Breve descripción de tu negocio"
                />
                <p className="form-hint">Máximo 200 caracteres.</p>
              </div>

              <div className="form-field">
                <label htmlFor="seoKeywords" className="form-label">
                  Palabras clave para buscadores <span className="form-label-optional">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="seoKeywords"
                  name="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="tacos, comida mexicana, delivery, centro histórico"
                />
                <p className="form-hint">
                  Separa las palabras clave con comas. Estas ayudan a que te encuentren en Google.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Images Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Imágenes</h2>
            <p className="card-description">Logotipo y foto de portada de tu negocio</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="form-field">
                <label className="form-label">Logotipo</label>
                <div
                  className={`file-upload-zone ${dragActive.logo ? 'dragging' : ''}`}
                  onDragEnter={(e) => handleDrag(e, 'logo')}
                  onDragLeave={(e) => handleDrag(e, 'logo')}
                  onDragOver={(e) => handleDrag(e, 'logo')}
                  onDrop={(e) => handleDrop(e, 'logo')}
                >
                  {previewImage.logo ? (
                    <div className="file-preview">
                      <img src={previewImage.logo} alt="Logo Preview" />
                    </div>
                  ) : (
                    <UserCircleIcon className="file-upload-icon" aria-hidden="true" />
                  )}
                  <div className="file-upload-text mt-3">
                    <label htmlFor="logoFile" className="cursor-pointer">
                      <strong>Sube un archivo</strong>
                      <span className="text-gray-500"> o arrastra y suelta</span>
                      <input
                        id="logoFile"
                        name="logoFile"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFiles(e.target.files, 'logo')}
                        accept=".jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="file-upload-hint">PNG, JPG hasta 10MB</p>
                </div>
              </div>

              {/* Cover Photo Upload */}
              <div className="form-field">
                <label className="form-label">Foto de portada</label>
                <div
                  className={`file-upload-zone ${dragActive.cover ? 'dragging' : ''}`}
                  onDragEnter={(e) => handleDrag(e, 'cover')}
                  onDragLeave={(e) => handleDrag(e, 'cover')}
                  onDragOver={(e) => handleDrag(e, 'cover')}
                  onDrop={(e) => handleDrop(e, 'cover')}
                >
                  {previewImage.cover ? (
                    <img src={previewImage.cover} alt="Cover Preview" className="h-24 w-full object-cover rounded-lg" />
                  ) : (
                    <PhotoIcon className="file-upload-icon" aria-hidden="true" />
                  )}
                  <div className="file-upload-text mt-3">
                    <label htmlFor="coverFile" className="cursor-pointer">
                      <strong>Sube un archivo</strong>
                      <span className="text-gray-500"> o arrastra y suelta</span>
                      <input
                        id="coverFile"
                        name="coverFile"
                        type="file"
                        className="sr-only"
                        onChange={(e) => handleFiles(e.target.files, 'cover')}
                        accept=".jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                  <p className="file-upload-hint">PNG, JPG hasta 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Información de contacto</h2>
            <p className="card-description">Usa información de contacto donde puedas ser localizado</p>
          </div>
          <div className="card-body">
            <div className="form-group">
              <div className="form-field">
                <label htmlFor="contact.address" className="form-label">
                  Dirección <span className="form-label-optional">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="contact.address"
                  name="contact.address"
                  value={formData.contact.address}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ingresa la dirección de tu negocio"
                />
              </div>

              <div className="form-field">
                <label htmlFor="contact.whatsappNumber" className="form-label">
                  Número de WhatsApp para pedidos
                </label>
                <input
                  type="tel"
                  id="contact.whatsappNumber"
                  name="contact.whatsappNumber"
                  value={formData.contact.whatsappNumber}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Ejemplo: +525512345678"
                />
                <p className="form-hint">
                  Ingresa el número con código de país (ejemplo: +52 para México)
                </p>
              </div>

              <div className="form-field">
                <label htmlFor="contact.facebookLink" className="form-label">
                  Enlace de Facebook <span className="form-label-optional">(opcional)</span>
                </label>
                <input
                  type="url"
                  id="contact.facebookLink"
                  name="contact.facebookLink"
                  value={formData.contact.facebookLink}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://www.facebook.com/tu-pagina"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Schedule Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="card"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">Horario de atención</h2>
                <p className="card-description">Configura los días y horas de apertura</p>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Activar</span>
                <button
                  type="button"
                  onClick={() => handleScheduleToggle({ target: { checked: !formData.schedule.enabled } })}
                  className={`toggle ${formData.schedule.enabled ? 'active' : ''}`}
                >
                  <span className="toggle-knob" />
                </button>
              </label>
            </div>
          </div>

          {formData.schedule.enabled && (
            <div className="card-body">
              <div className="schedule-grid">
                {Object.entries(formData.schedule.days).map(([day, hours]) => (
                  <div key={day} className="schedule-row">
                    <div className="schedule-day">
                      <input
                        type="checkbox"
                        checked={!hours.isClosed}
                        onChange={(e) => handleScheduleChange(day, 'isClosed', !e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="schedule-day-name">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </span>
                    </div>
                    {!hours.isClosed && (
                      <div className="schedule-times">
                        <Select
                          options={timeOptions}
                          value={{ value: hours.open, label: hours.open }}
                          onChange={(option) => handleScheduleChange(day, 'open', option.value)}
                          styles={selectStyles}
                          isDisabled={hours.isClosed}
                          className="flex-1"
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        />
                        <span className="schedule-separator">a</span>
                        <Select
                          options={timeOptions}
                          value={{ value: hours.close, label: hours.close }}
                          onChange={(option) => handleScheduleChange(day, 'close', option.value)}
                          styles={selectStyles}
                          isDisabled={hours.isClosed}
                          className="flex-1"
                          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                        />
                      </div>
                    )}
                    {hours.isClosed && (
                      <span className="text-sm text-gray-400 italic">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
          transition={{ duration: 0.3, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4"
        >
          <button type="button" className="btn-ghost w-full sm:w-auto">
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
              'Guardar información'
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
