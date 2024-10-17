'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';

const fonts = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
];

const ColorPicker = ({ id, label, value, onChange }) => (
  <div className="sm:col-span-3">
    <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-2 flex items-center">
      <input
        type="color"
        id={id}
        value={value}
        onChange={onChange}
        className="h-10 w-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
        className="ml-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="#000000"
      />
    </div>
  </div>
);

export default function Apariencia() {
  const [titleFont, setTitleFont] = useState(fonts[0].value);
  const [bodyFont, setBodyFont] = useState(fonts[0].value);
  const [buttonFont, setButtonFont] = useState(fonts[0].value);
  const [primaryColor, setPrimaryColor] = useState('#ff0000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');

  const handleFontChange = (e, setFont) => {
    setFont(e.target.value);
  };

  const handleColorChange = (e, setColor) => {
    setColor(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar la identidad visual
    console.log({ titleFont, bodyFont, buttonFont, primaryColor, secondaryColor });
  };

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

  const FontSelector = ({ id, label, value, onChange }) => (
    <div className="sm:col-span-4">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <Select
          id={id}
          value={{ value: value, label: value.split(',')[0] }}
          onChange={(option) => onChange({ target: { value: option.value } })}
          options={fonts.map(font => ({ value: font.value, label: font.name }))}
          styles={customStyles}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: value }}>
        The quick brown fox jumps over the lazy dog
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Apariencia</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Personaliza la apariencia visual de tu sitio.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FontSelector
            id="titleFont"
            label="Tipografía del título"
            value={titleFont}
            onChange={(e) => handleFontChange(e, setTitleFont)}
          />

          <FontSelector
            id="bodyFont"
            label="Tipografía cuerpos de texto"
            value={bodyFont}
            onChange={(e) => handleFontChange(e, setBodyFont)}
          />

          <FontSelector
            id="buttonFont"
            label="Tipografía botones"
            value={buttonFont}
            onChange={(e) => handleFontChange(e, setButtonFont)}
          />

          <div className="sm:col-span-6">
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              <ColorPicker
                id="primaryColor"
                label="Color del fondo"
                value={primaryColor}
                onChange={(e) => handleColorChange(e, setPrimaryColor)}
              />

              <ColorPicker
                id="secondaryColor"
                label="Color del texto"
                value={secondaryColor}
                onChange={(e) => handleColorChange(e, setSecondaryColor)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancelar
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Guardar
        </motion.button>
      </div>
    </form>
  );
}
