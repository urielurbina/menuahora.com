'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Select from 'react-select';

const fonts = [
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Alegreya', value: '"Alegreya", serif' },
  { name: 'Alegreya Sans', value: '"Alegreya Sans", sans-serif' },
  { name: 'Archivo Narrow', value: '"Archivo Narrow", sans-serif' },
  { name: 'Chivo', value: '"Chivo", sans-serif' },
  { name: 'Cormorant', value: '"Cormorant", serif' },
  { name: 'DM Sans', value: '"DM Sans", sans-serif' },
  { name: 'Eczar', value: '"Eczar", serif' },
  { name: 'Fira Sans', value: '"Fira Sans", sans-serif' },
  { name: 'Fraunces', value: '"Fraunces", serif' },
  { name: 'Inconsolata', value: '"Inconsolata", monospace' },
  { name: 'Libre Baskerville', value: '"Libre Baskerville", serif' },
  { name: 'Libre Franklin', value: '"Libre Franklin", sans-serif' },
  { name: 'Lora', value: '"Lora", serif' },
  { name: 'Manrope', value: '"Manrope", sans-serif' },
  { name: 'Montserrat', value: '"Montserrat", sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'PT Sans', value: '"PT Sans", sans-serif' },
  { name: 'PT Serif', value: '"PT Serif", serif' },
  { name: 'Raleway', value: '"Raleway", sans-serif' },
  { name: 'Roboto', value: '"Roboto", sans-serif' },
  { name: 'Rubik', value: '"Rubik", sans-serif' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
  { name: 'Space Mono', value: '"Space Mono", monospace' },
  { name: 'Syne', value: '"Syne", sans-serif' },
  { name: 'Work Sans', value: '"Work Sans", sans-serif' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    minWidth: '200px',
    margin: '0 5px'
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: '200px'
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: state.data.value,
    fontSize: '16px',
  })
};

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
        className="ml-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
        placeholder="#000000"
      />
    </div>
  </div>
);

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
        options={fonts.map(font => ({ 
          value: font.value, 
          label: font.name,
          style: { fontFamily: font.value }
        }))}
        styles={customStyles}
        formatOptionLabel={({ label, style }) => (
          <span style={style}>{label}</span>
        )}
      />
    </div>
    <p className="mt-2 text-sm text-gray-500" style={{ fontFamily: value }}>
      The quick brown fox jumps over the lazy dog
    </p>
  </div>
);

export default function Apariencia() {
  const { data: session, status } = useSession();
  const [titleFont, setTitleFont] = useState(fonts[0].value);
  const [bodyFont, setBodyFont] = useState(fonts[0].value);
  const [buttonFont, setButtonFont] = useState(fonts[0].value);
  const [primaryColor, setPrimaryColor] = useState('#ff0000');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === "authenticated") {
      fetchAppearanceData();
    }
  }, [status]);

  const fetchAppearanceData = async () => {
    try {
      const response = await fetch('/api/get-appearance');
      if (response.ok) {
        const data = await response.json();
        if (data.appearance) {
          setTitleFont(data.appearance.titleFont || fonts[0].value);
          setBodyFont(data.appearance.bodyFont || fonts[0].value);
          setButtonFont(data.appearance.buttonFont || fonts[0].value);
          setPrimaryColor(data.appearance.primaryColor || '#ff0000');
          setSecondaryColor(data.appearance.secondaryColor || '#000000');
        }
      }
    } catch (error) {
      console.error('Error fetching appearance data:', error);
    }
  };

  const handleFontChange = (e, setFont) => {
    setFont(e.target.value);
  };

  const handleColorChange = (e, setColor) => {
    setColor(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!session || !session.user) {
      setMessage('No estás autenticado');
      setIsLoading(false);
      return;
    }

    const appearanceData = {
      appearance: {
        titleFont,
        bodyFont,
        buttonFont,
        primaryColor,
        secondaryColor
      }
    };

    try {
      const response = await fetch('/api/update-appearance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appearanceData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Apariencia guardada exitosamente');
      } else {
        throw new Error(data.error || 'Error al guardar la apariencia');
      }
    } catch (error) {
      console.error('Error al guardar la apariencia:', error);
      setMessage(error.message || 'Ocurrió un error al guardar la apariencia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="border-b border-gray-900/10 pb-12">
        <h2 className="text-3xl font-bold text-gray-900">Apariencia</h2>
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
          className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
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
  );
}
