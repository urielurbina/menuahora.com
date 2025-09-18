'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
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
        
        setFormData(prevData => ({
          ...prevData,
          ...basicInfo,
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

    // Preparar los datos para enviar
    const dataToSend = {
      userId, // Incluir el userId del usuario autenticado
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: '100px',
      margin: '0',
      fontSize: '0.875rem',
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '100px',
    }),
    container: (provided) => ({
      ...provided,
      width: '100%',
      '@media (min-width: 640px)': {
        width: 'auto',
      },
    }),
  };

  const handleOptionalFieldToggle = (field) => {
    setFormData(prevData => ({
      ...prevData,
      [`has${field.charAt(0).toUpperCase() + field.slice(1)}`]: !prevData[`has${field.charAt(0).toUpperCase() + field.slice(1)}`]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="border-b border-gray-900/10 pb-8">
        <h2 className="text-2xl font-bold text-gray-900">Información básica</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Esta información será mostrada públicamente, así que ten cuidado con lo que compartes.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
          <div className="col-span-full sm:col-span-4">
            <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
              Nombre del negocio
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="Tu negocio"
              />
            </div>
          </div>

          <div className="col-span-full sm:col-span-4">
            <label htmlFor="slogan" className="block text-sm font-medium leading-6 text-gray-900">
              Slogan
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="slogan"
                name="slogan"
                value={formData.slogan}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="Tu slogan aquí"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
              Descripción general
            </label>
            <div className="mt-2">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={200}
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="Breve descripción de tu negocio"
              />
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">Máximo 200 caracteres.</p>
          </div>

          <div className="col-span-full">
            <label htmlFor="logoFile" className="block text-sm font-medium leading-6 text-gray-900">
              Logotipo
            </label>
            <div 
              className={`mt-2 flex justify-center rounded-lg border border-dashed ${dragActive.logo ? 'border-[#0D654A]' : 'border-gray-900/25'} px-6 py-10`}
              onDragEnter={(e) => handleDrag(e, 'logo')}
              onDragLeave={(e) => handleDrag(e, 'logo')}
              onDragOver={(e) => handleDrag(e, 'logo')}
              onDrop={(e) => handleDrop(e, 'logo')}
            >
              <div className="text-center">
                {previewImage.logo ? (
                  <img src={previewImage.logo} alt="Logo Preview" className="mx-auto h-32 w-32 object-cover" />
                ) : (
                  <UserCircleIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="logoFile"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#0D654A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0D654A] focus-within:ring-offset-2 hover:text-[#0D654A]"
                  >
                    <span>Sube un archivo</span>
                    <input 
                      id="logoFile" 
                      name="logoFile" 
                      type="file" 
                      className="sr-only" 
                      onChange={(e) => handleFiles(e.target.files, 'logo')}
                      accept=".jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG hasta 10MB</p>
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <label htmlFor="coverFile" className="block text-sm font-medium leading-6 text-gray-900">
              Foto de portada
            </label>
            <div 
              className={`mt-2 flex justify-center rounded-lg border border-dashed ${dragActive.cover ? 'border-[#0D654A]' : 'border-gray-900/25'} px-6 py-10`}
              onDragEnter={(e) => handleDrag(e, 'cover')}
              onDragLeave={(e) => handleDrag(e, 'cover')}
              onDragOver={(e) => handleDrag(e, 'cover')}
              onDrop={(e) => handleDrop(e, 'cover')}
            >
              <div className="text-center">
                {previewImage.cover ? (
                  <img src={previewImage.cover} alt="Cover Preview" className="mx-auto h-32 w-full object-cover" />
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="coverFile"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#0D654A] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#0D654A] focus-within:ring-offset-2 hover:text-[#0D654A]"
                  >
                    <span>Sube un archivo</span>
                    <input 
                      id="coverFile" 
                      name="coverFile" 
                      type="file" 
                      className="sr-only" 
                      onChange={(e) => handleFiles(e.target.files, 'cover')}
                      accept=".jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG hasta 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-900/10 pb-8">
        <h2 className="text-xl font-semibold leading-7 text-gray-900">Información de contacto</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Usa información de contacto donde puedas ser localizado.</p>

        <div className="mt-6 space-y-6 sm:space-y-8">
          <div className="sm:col-span-3">
            <label htmlFor="contact.address" className="block text-sm font-medium leading-6 text-gray-900">
              Dirección <span className="text-gray-500">(opcional)</span>
            </label>
            <div className="mt-2">
              <input
                type="text"
                id="contact.address"
                name="contact.address"
                value={formData.contact.address}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="Ingresa la dirección de tu negocio"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="contact.whatsappNumber" className="block text-sm font-medium leading-6 text-gray-900">
              Número de WhatsApp para pedidos
            </label>
            <div className="mt-2">
              <input
                type="tel"
                id="contact.whatsappNumber"
                name="contact.whatsappNumber"
                value={formData.contact.whatsappNumber}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="Ejemplo: +525512345678"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Ingresa el número con código de país (ejemplo: +52 para México)
            </p>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="contact.facebookLink" className="block text-sm font-medium leading-6 text-gray-900">
              Enlace de Facebook <span className="text-gray-500">(opcional)</span>
            </label>
            <div className="mt-2">
              <input
                type="url"
                id="contact.facebookLink"
                name="contact.facebookLink"
                value={formData.contact.facebookLink}
                onChange={handleChange}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
                placeholder="https://www.facebook.com/tu-pagina"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de horario (opcional) */}
      <div className="border-b border-gray-900/10 pb-8">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="schedule.enabled"
            checked={formData.schedule.enabled}
            onChange={handleScheduleToggle}
            className="h-4 w-4 rounded border-gray-300 text-[#0D654A] focus:ring-[#0D654A]"
          />
          <label htmlFor="schedule.enabled" className="ml-2 block text-sm font-medium leading-6 text-gray-900">
            ¿Deseas agregar un horario de atención?
          </label>
        </div>
        
        {formData.schedule.enabled && (
          <div className="mt-10 space-y-10">
            <fieldset>
              <legend className="text-sm font-semibold leading-6 text-gray-900">Horario de atención</legend>
              <div className="mt-6 space-y-6">
                {Object.entries(formData.schedule.days).map(([day, hours]) => (
                  <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-y-2 sm:gap-x-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!hours.isClosed}
                        onChange={(e) => handleScheduleChange(day, 'isClosed', !e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-[#0D654A] focus:ring-[#0D654A]"
                      />
                      <label className="ml-2 block text-sm font-medium leading-6 text-gray-900 w-24">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>
                    {!hours.isClosed && (
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <Select
                          options={timeOptions}
                          value={{ value: hours.open, label: hours.open }}
                          onChange={(option) => handleScheduleChange(day, 'open', option.value)}
                          styles={customStyles}
                          isDisabled={hours.isClosed}
                          className="w-full sm:w-auto"
                        />
                        <span className="text-sm font-medium text-gray-700">a</span>
                        <Select
                          options={timeOptions}
                          value={{ value: hours.close, label: hours.close }}
                          onChange={(option) => handleScheduleChange(day, 'close', option.value)}
                          styles={customStyles}
                          isDisabled={hours.isClosed}
                          className="w-full sm:w-auto"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
        <button type="button" className="w-full sm:w-auto text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar información'}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
