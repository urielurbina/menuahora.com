'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/solid'

const Productos = () => {
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [excelLink, setExcelLink] = useState('');
  const [menuTitle, setMenuTitle] = useState('');

  // Función para cargar los productos (simulada)
  useEffect(() => {
    // Aquí deberías hacer una llamada a tu API para obtener los productos
    const fetchProducts = async () => {
      // Simulación de productos
      const mockProducts = [
        { id: 1, name: 'Producto 1', subtitle: 'Subtítulo 1', price: 10.99, available: true },
        { id: 2, name: 'Producto 2', subtitle: 'Subtítulo 2', price: 15.99, available: false },
      ];
      setProducts(mockProducts);
    };
    fetchProducts();
  }, []);

  const openPopup = (product = null) => {
    setCurrentProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setCurrentProduct(null);
    setIsPopupOpen(false);
  };

  const saveProduct = (productData) => {
    // Aquí deberías implementar la lógica para guardar el producto en tu backend
    if (productData.id) {
      // Actualizar producto existente
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      // Agregar nuevo producto
      setProducts([...products, { ...productData, id: Date.now() }]);
    }
    closePopup();
  };

  const deleteProduct = (productId) => {
    // Aquí deberías implementar la lógica para eliminar el producto en tu backend
    setProducts(products.filter(p => p.id !== productId));
    closePopup();
  };

  const handleExcelLinkChange = (e) => {
    setExcelLink(e.target.value);
  };

  const handleImportExcel = async () => {
    // Aquí deberías implementar la lógica para importar productos desde el Excel
    console.log('Importando productos desde:', excelLink);
    // Ejemplo de implementación:
    // const response = await fetch('/api/import-products', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ excelLink })
    // });
    // if (response.ok) {
    //   const importedProducts = await response.json();
    //   setProducts([...products, ...importedProducts]);
    //   setExcelLink('');
    // }
  };

  const handleMenuTitleChange = (e) => {
    setMenuTitle(e.target.value);
  };

  const handleSaveMenuTitle = async () => {
    // Aquí deberías implementar la lógica para guardar el título del menú en tu backend
    try {
      // Ejemplo de llamada a API (deberás ajustar esto según tu implementación real)
      // const response = await fetch('/api/save-menu-title', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ title: menuTitle })
      // });
      // if (response.ok) {
      //   // Título guardado exitosamente
      //   console.log('Título del menú guardado:', menuTitle);
      // } else {
      //   throw new Error('Error al guardar el título del menú');
      // }
      
      // Por ahora, solo mostraremos un mensaje en la consola
      console.log('Título del menú guardado:', menuTitle);
    } catch (error) {
      console.error('Error al guardar el título del menú:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      
      {/* Sección de importación de Excel */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Importar productos desde Excel</h2>
        <div className="flex items-center space-x-2">
          <input
            type="url"
            value={excelLink}
            onChange={handleExcelLinkChange}
            placeholder="https://ejemplo.com/productos.xlsx"
            className="flex-grow rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <button
            onClick={handleImportExcel}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Importar Excel
          </button>
        </div>
      </div>

      {/* Divisor */}
      <hr className="my-8 border-gray-200" />

      {/* Sección de gestión de productos */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Gestión de productos</h2>
        
        {/* Campo de título del menú con botón de guardado */}
        <div className="mb-4">
          <label htmlFor="menuTitle" className="block text-sm font-medium leading-6 text-gray-900 mb-1">
            Título del menú
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              id="menuTitle"
              name="menuTitle"
              value={menuTitle}
              onChange={handleMenuTitleChange}
              placeholder="Menú"
              className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button
              onClick={handleSaveMenuTitle}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Guardar
            </button>
          </div>
        </div>

        <button
          onClick={() => openPopup()}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-4"
        >
          Agregar Producto
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <motion.div
              key={product.id}
              className="border p-4 rounded cursor-pointer bg-white shadow-sm" // Añadido bg-white y shadow-sm
              whileHover={{ scale: 1.05 }}
              onClick={() => openPopup(product)}
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
              <p className={product.available ? "text-green-500" : "text-red-500"}>
                {product.available ? "Disponible" : "Agotado"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {isPopupOpen && (
        <ProductPopup
          product={currentProduct}
          onSave={saveProduct}
          onDelete={deleteProduct}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

const ProductPopup = ({ product, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    price: '$0.00',
    extras: [],
    image: null,
    category: '',
    available: true,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [newExtra, setNewExtra] = useState({ name: '', price: '$0.00' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png'];
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
          setFormData(prevData => ({
            ...prevData,
            image: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor, sube solo archivos JPG o PNG.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setNewExtra(prev => ({ ...prev, [name]: value }));
  };

  const addExtra = () => {
    if (newExtra.name && newExtra.price) {
      setFormData(prev => ({
        ...prev,
        extras: [...prev.extras, { ...newExtra, id: Date.now() }]
      }));
      setNewExtra({ name: '', price: '$0.00' });
    }
  };

  const removeExtra = (id) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.filter(extra => extra.id !== id)
    }));
  };

  const formatPrice = (value) => {
    // Elimina cualquier carácter que no sea número o punto
    const numericValue = value.replace(/[^\d.]/g, '');
    // Asegura que solo haya un punto decimal
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      parts[1] = parts.slice(1).join('');
    }
    // Limita a dos decimales
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }
    // Agrega el símbolo $ al principio y asegura que siempre haya dos decimales
    return `$${parseFloat(parts.join('.')).toFixed(2)}`;
  };

  const handlePriceChange = (e) => {
    const formattedPrice = formatPrice(e.target.value);
    setFormData(prev => ({ ...prev, price: formattedPrice }));
  };

  const handleExtraPriceChange = (e) => {
    const formattedPrice = formatPrice(e.target.value);
    setNewExtra(prev => ({ ...prev, price: formattedPrice }));
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              {product ? 'Editar Producto' : 'Agregar Producto'}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Esta información será mostrada públicamente, así que ten cuidado con lo que compartes.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Nombre del producto
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                    placeholder="Ej: Pizza Margherita, Corte de cabello"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Descripción
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Ej: Deliciosa pizza con tomate, mozzarella y albahaca fresca / Servicio de corte y peinado profesional"
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Escribe una breve descripción del producto o servicio.</p>
              </div>

              <div className="col-span-full">
                <label htmlFor="image" className="block text-sm font-medium leading-6 text-gray-900">
                  Imagen del producto
                </label>
                <div 
                  className={`mt-2 flex justify-center rounded-lg border border-dashed ${dragActive ? 'border-indigo-600' : 'border-gray-900/25'} px-6 py-10`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    {previewImage ? (
                      <img src={previewImage} alt="Product Preview" className="mx-auto h-32 w-32 object-cover" />
                    ) : (
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    )}
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Sube un archivo</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only" 
                          onChange={(e) => handleFiles(e.target.files)}
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

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Detalles del producto</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Proporciona información adicional sobre el producto.</p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                  Precio
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handlePriceChange}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                  Categoría
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Ej: Pizzas, Servicios de belleza"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="flex items-center h-6">
                  <input
                    id="available"
                    name="available"
                    type="checkbox"
                    checked={formData.available}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="available" className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                    Disponible
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">Extras del producto</h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">Agrega opciones o características adicionales para este producto.</p>

            <div className="mt-10 space-y-4">
              {formData.extras && formData.extras.length > 0 ? (
                formData.extras.map((extra) => (
                  <div key={extra.id} className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{extra.name}: ${extra.price}</span>
                    <button
                      type="button"
                      onClick={() => removeExtra(extra.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay extras agregados aún.</p>
              )}
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="extraName" className="block text-sm font-medium leading-6 text-gray-900">Nombre del extra</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="extraName"
                      name="name"
                      value={newExtra.name}
                      onChange={handleExtraChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Ej: Queso extra, Tratamiento capilar"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="extraPrice" className="block text-sm font-medium leading-6 text-gray-900">Precio</label>
                  <div className="mt-2">
                    <input
                      type="text"
                      id="extraPrice"
                      name="price"
                      value={newExtra.price}
                      onChange={handleExtraPriceChange}
                      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={addExtra}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {product && (
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Productos;
