'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [excelLink, setExcelLink] = useState('');

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="url"
          value={excelLink}
          onChange={handleExcelLinkChange}
          placeholder="https://ejemplo.com/productos.xlsx"
          className="flex-grow border rounded px-2 py-1"
        />
        <button
          onClick={handleImportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Importar Excel
        </button>
      </div>
      <button
        onClick={() => openPopup()}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Agregar Producto
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <motion.div
            key={product.id}
            className="border p-4 rounded cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => openPopup(product)}
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.subtitle}</p>
            <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
            <p className={product.available ? "text-green-500" : "text-red-500"}>
              {product.available ? "Disponible" : "Agotado"}
            </p>
          </motion.div>
        ))}
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
    subtitle: '',
    description: '',
    price: '',
    extras: [],
    image: null,
    category: '',
    available: true,
    excelLink: '' // Nuevo campo para el enlace de Excel
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    // Aquí deberías implementar la lógica para subir la imagen
    const file = e.target.files[0];
    // Por ahora, solo guardamos el nombre del archivo
    setFormData(prev => ({ ...prev, image: file.name }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {product ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Subtítulo</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows="3"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Precio</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Imagen</label>
            <input
              type="file"
              onChange={handleImageUpload}
              className="w-full border rounded px-2 py-1"
              accept="image/*"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Categoría</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="mr-2"
              />
              Disponible
            </label>
          </div>
          {/* Nuevo campo para el enlace de Excel */}
          <div className="mb-4">
            <label className="block mb-2">Enlace de Excel (para importación masiva)</label>
            <input
              type="url"
              name="excelLink"
              value={formData.excelLink}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              placeholder="https://ejemplo.com/mi-archivo-excel.xlsx"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Guardar
            </button>
            {product && (
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsPage;
