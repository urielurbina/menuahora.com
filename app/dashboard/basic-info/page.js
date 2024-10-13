'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BasicInfo() {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [slogan, setSlogan] = useState('');
  const [logo, setLogo] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/png') {
      setLogo(file);
    } else {
      alert('Por favor, selecciona un archivo PNG.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la información
    console.log({ businessName, description, slogan, logo });
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
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tu negocio"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción general (máximo 50 caracteres)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={50}
            rows={2}
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
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Tu slogan aquí"
          />
        </div>

        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logotipo (solo PNG)
          </label>
          <input
            type="file"
            id="logo"
            accept=".png"
            onChange={handleLogoChange}
            className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar información
        </motion.button>
      </form>
    </div>
  );
}
