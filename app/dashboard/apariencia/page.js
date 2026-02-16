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

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minWidth: '200px',
    fontSize: '0.875rem',
    borderColor: state.isFocused ? 'var(--brand-primary)' : 'var(--gray-300)',
    boxShadow: state.isFocused ? '0 0 0 2px var(--brand-primary-light)' : 'none',
    borderRadius: '0.5rem',
    '&:hover': {
      borderColor: 'var(--brand-primary)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: '200px',
    zIndex: 50,
    borderRadius: '0.5rem',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: state.data.value,
    fontSize: '14px',
    backgroundColor: state.isSelected ? 'var(--brand-primary)' : state.isFocused ? 'var(--brand-primary-light)' : 'white',
    color: state.isSelected ? 'white' : 'var(--gray-900)',
    padding: '10px 12px',
  })
};

const ColorPicker = ({ id, label, value, onChange }) => (
  <div className="form-field">
    <label htmlFor={id} className="form-label">{label}</label>
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="color"
          id={id}
          value={value}
          onChange={onChange}
          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer overflow-hidden"
          style={{ padding: 0 }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
        className="form-input flex-1"
        placeholder="#000000"
      />
    </div>
  </div>
);

const FontSelector = ({ id, label, value, onChange }) => (
  <div className="form-field">
    <label htmlFor={id} className="form-label">{label}</label>
    <Select
      id={id}
      value={{ value: value, label: value.split(',')[0].replace(/"/g, '') }}
      onChange={(option) => onChange({ target: { value: option.value } })}
      options={fonts.map(font => ({
        value: font.value,
        label: font.name,
      }))}
      styles={selectStyles}
      formatOptionLabel={({ label, value }) => (
        <span style={{ fontFamily: value }}>{label}</span>
      )}
    />
    <p className="form-hint mt-2" style={{ fontFamily: value }}>
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
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1 className="page-title">Apariencia</h1>
        <p className="page-description">
          Personaliza la apariencia visual de tu sitio.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Typography Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Tipografía</h2>
            <p className="card-description">Elige las fuentes para tu menú</p>
          </div>
          <div className="card-body">
            <div className="form-group">
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
            </div>
          </div>
        </motion.div>

        {/* Colors Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Colores</h2>
            <p className="card-description">Define los colores principales de tu menú</p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </motion.div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h2 className="card-title">Vista previa</h2>
            <p className="card-description">Así se verá tu menú con los estilos seleccionados</p>
          </div>
          <div className="card-body">
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: primaryColor }}
            >
              <h3
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: titleFont, color: secondaryColor }}
              >
                Nombre del Negocio
              </h3>
              <p
                className="mb-4"
                style={{ fontFamily: bodyFont, color: secondaryColor }}
              >
                Esta es una descripción de ejemplo para ver cómo se verá el texto en tu menú.
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-lg"
                style={{
                  fontFamily: buttonFont,
                  backgroundColor: secondaryColor,
                  color: primaryColor
                }}
              >
                Botón de ejemplo
              </button>
            </div>
          </div>
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
          transition={{ duration: 0.3, delay: 0.4 }}
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
              'Guardar'
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
