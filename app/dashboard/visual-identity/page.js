'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

const fonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

export default function VisualIdentity() {
  const [selectedFont, setSelectedFont] = useState(fonts[0].value);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [tertiaryColor, setTertiaryColor] = useState('#cccccc');

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

  const handleColorChange = (e, setColor) => {
    setColor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la identidad visual
    console.log({ selectedFont, primaryColor, secondaryColor, tertiaryColor });
  };

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Personalización</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="font" className="block text-sm font-medium text-gray-700">
            Tipografía
          </label>
          <select
            id="font"
            value={selectedFont}
            onChange={handleFontChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: selectedFont }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>

        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
            Color principal
          </label>
          <input
            type="color"
            id="primaryColor"
            value={primaryColor}
            onChange={(e) => handleColorChange(e, setPrimaryColor)}
            className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
            Color del texto
          </label>
          <input
            type="color"
            id="secondaryColor"
            value={secondaryColor}
            onChange={(e) => handleColorChange(e, setSecondaryColor)}
            className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>


        

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar
        </motion.button>
      </form>
    </div>
  );
}
