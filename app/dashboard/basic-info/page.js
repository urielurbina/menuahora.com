'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Select from 'react-select';

export default function BasicInfo() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    slogan: '',
    logoUrl: '',
    coverPhotoUrl: '',
    phoneNumber: '',
    schedule: {
      monday: { open: '09:00', close: '18:00', isClosed: false },
      tuesday: { open: '09:00', close: '18:00', isClosed: false },
      wednesday: { open: '09:00', close: '18:00', isClosed: false },
      thursday: { open: '09:00', close: '18:00', isClosed: false },
      friday: { open: '09:00', close: '18:00', isClosed: false },
      saturday: { open: '10:00', close: '14:00', isClosed: false },
      sunday: { open: '10:00', close: '14:00', isClosed: true },
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const response = await fetch('/api/get-basic-info');
          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          }
        } catch (error) {
          console.error('Error fetching basic info:', error);
        }
      }
    };
    fetchData();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('schedule')) {
      const [day, type] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        schedule: {
          ...prevData.schedule,
          [day]: {
            ...prevData.schedule[day],
            [type]: value
          }
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!session) {
      setMessage('No estás autenticado');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/save-basic-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Información guardada exitosamente');
      } else {
        setMessage(data.error || 'Ocurrió un error al guardar la información');
      }
    } catch (error) {
      setMessage('Ocurrió un error al guardar la información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      schedule: {
        ...prevData.schedule,
        [day]: {
          ...prevData.schedule[day],
          [field]: value
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
      minWidth: '120px',
      margin: '0 5px'
    }),
    menu: (provided) => ({
      ...provided,
      minWidth: '120px'
    })
  };

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Información básica</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Nombre del negocio
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tu negocio"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción general (máximo 200 caracteres)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Breve descripción de tu negocio"
          />
        </div>

        <div>
          <label htmlFor="slogan" className="block text-sm font-medium text-gray-700">
            Slogan
          </label>
          <input
            type="text"
            id="slogan"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tu slogan aquí"
          />
        </div>

        <div>
          <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
            URL del Logotipo
          </label>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://ejemplo.com/tu-logo.png"
          />
        </div>

        <div>
          <label htmlFor="coverPhotoUrl" className="block text-sm font-medium text-gray-700">
            Foto de portada
          </label>
          <input
            type="url"
            id="coverPhotoUrl"
            name="coverPhotoUrl"
            value={formData.coverPhotoUrl}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="https://ejemplo.com/tu-foto-portada.jpg"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Número de Celular
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="+1 (123) 456-7890"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">Horario de atención</h2>
          {Object.entries(formData.schedule).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 mb-6">
              <label className="w-32 text-sm font-medium text-gray-700">
                {day.charAt(0).toUpperCase() + day.slice(1)}:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={!hours.isClosed}
                  onChange={(e) => handleScheduleChange(day, 'isClosed', !e.target.checked)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Abierto</span>
              </div>
              {!hours.isClosed ? (
                <div className="flex items-center space-x-2">
                  <Select
                    options={timeOptions}
                    value={{ value: hours.open, label: hours.open }}
                    onChange={(option) => handleScheduleChange(day, 'open', option.value)}
                    styles={customStyles}
                    isDisabled={hours.isClosed}
                  />
                  <span className="text-sm font-medium text-gray-700">a</span>
                  <Select
                    options={timeOptions}
                    value={{ value: hours.close, label: hours.close }}
                    onChange={(option) => handleScheduleChange(day, 'close', option.value)}
                    styles={customStyles}
                    isDisabled={hours.isClosed}
                  />
                </div>
              ) : (
                <span className="text-sm text-gray-500 ml-4">Cerrado</span>
              )}
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar información'}
        </motion.button>

        {message && (
          <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
