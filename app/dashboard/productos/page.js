"use client"

import { useState, useEffect } from "react"
import { Plus, X, Edit2, ChevronDown, ChevronUp } from "lucide-react"
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'

export default function ProductDashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [newProduct, setNewProduct] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    precio: 0,
    categorias: [], // Cambiado de categoria a categorias como array
    availability: true,
    extras: [],
  })
  const [newCategory, setNewCategory] = useState("")
  const [newExtra, setNewExtra] = useState({ name: "", price: 0 })
  const [cardInfoSettings, setCardInfoSettings] = useState({
    nombre: true,
    descripcion: true,
    precio: true,
    categoria: true,
    imagen: true,
    detailedView: true,
  })
  const [expandedProduct, setExpandedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchCardInfoSettings()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar los productos');
      }
      const data = await response.json()
      setProducts(data)
      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(`No se pudieron cargar los productos: ${error.message}`);
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar las categorías');
      }
      const data = await response.json()
      setCategories(data)
      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setError(`No se pudieron cargar las categorías: ${error.message}`);
    }
  }

  const fetchCardInfoSettings = async () => {
    try {
      const response = await fetch('/api/card-info-settings')
      if (!response.ok) {
        throw new Error('Error al cargar la configuración de la tarjeta')
      }
      const data = await response.json()
      setCardInfoSettings(data.cardInfoSettings)
    } catch (error) {
      console.error('Error fetching card info settings:', error)
      setError(`No se pudo cargar la configuración de la tarjeta: ${error.message}`)
    }
  }

  const handleCardInfoSettingChange = async (key, value) => {
    const newSettings = { ...cardInfoSettings, [key]: value }
    setCardInfoSettings(newSettings)
    try {
      const response = await fetch('/api/card-info-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      })
      if (!response.ok) {
        throw new Error('Error al guardar la configuración de la tarjeta')
      }
    } catch (error) {
      console.error('Error saving card info settings:', error)
      setError(`No se pudo guardar la configuración de la tarjeta: ${error.message}`)
    }
  }

  const handleAddProduct = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = '/api/products';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el producto');
      }
      await fetchProducts();
      resetNewProduct();
      setIsAddingProduct(false);
      setEditingProduct(null);
    } catch (error) {
      setError(error.message);
      console.error('Error al guardar el producto:', error);
    }
  };

  const resetNewProduct = () => {
    setNewProduct({
      nombre: "",
      descripcion: "",
      imagen: "",
      precio: 0,
      categorias: [], // Cambiado de categoria a categorias como array
      availability: true,
      extras: [],
    })
  }

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al añadir la categoría');
        }
        const data = await response.json();
        console.log('Categoría añadida:', data);
        await fetchCategories();
        setNewCategory("");
      } catch (error) {
        console.error('Error adding category:', error);
        setError(error.message);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar la categoría');
      }
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.message);
    }
  };

  const handleAddExtra = () => {
    if (newExtra.name && newExtra.price) {
      setNewProduct({
        ...newProduct,
        extras: [...newProduct.extras, { ...newExtra, id: Date.now() }],
      })
      setNewExtra({ name: "", price: 0 })
    }
  }

  const handleDeleteExtra = (id) => {
    setNewProduct({
      ...newProduct,
      extras: newProduct.extras.filter(extra => extra.id !== id),
    })
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setNewProduct(product)
    setIsAddingProduct(true)
  }

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el producto');
      }
      await fetchProducts();
    } catch (error) {
      setError(error.message);
    }
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'product')
    formData.append('transformation', 'c_fit,h_800/ar_4:5,c_crop,g_auto,h_800/q_auto:best/f_webp')

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Error al subir la imagen')
      const data = await response.json()
      setNewProduct({ ...newProduct, imagen: data.url })
    } catch (error) {
      setError(error.message)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  if (isLoading) return <div className="text-center py-10">Cargando...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4 space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">Administrador de Productos</h1>

      {/* Categorías e Información en Tarjeta en la misma fila */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categorías */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categorías</h2>
          <p className="text-sm text-gray-600 mb-6">
            Gestiona las categorías de tus productos.
          </p>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nueva categoría"
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
            />
            <button
              onClick={handleAddCategory}
              className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
            >
              Agregar
            </button>
          </div>
          <div>
            {categories.length === 0 && dataLoaded ? (
              <p className="text-sm text-gray-500">No hay categorías. Añade una nueva categoría para empezar.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category._id} className="inline-flex items-center bg-gray-200 rounded-full px-3 py-1">
                    <span className="text-sm font-medium text-gray-700 mr-1">{category.name}</span>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información en Tarjeta */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información en Tarjeta</h2>
          <p className="text-sm text-gray-600 mb-6">
            Configura la información que se mostrará en las tarjetas de productos.
          </p>
          <div className="space-y-4">
            {Object.entries(cardInfoSettings)
              .filter(([key]) => key !== 'detailedView')
              .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={value}
                      onChange={(e) => handleCardInfoSettingChange(key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D654A]"></div>
                  </label>
                </div>
              ))}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Vista detallada</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={cardInfoSettings.detailedView}
                    onChange={(e) => handleCardInfoSettingChange('detailedView', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D654A]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agregar Producto y Lista de Productos */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Productos</h2>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow duration-300 hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
          >
            <Plus className="inline-block mr-2 h-5 w-5" /> Agregar Producto
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 && dataLoaded ? (
            <p className="col-span-full text-center text-gray-500">No hay productos. Añade un nuevo producto para empezar.</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-gray-50 shadow rounded-lg overflow-hidden">
                <div className="p-4">
                  <div className="flex mb-4">
                    {product.imagen && (
                      <div className="w-24 h-24 mr-4 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={product.imagen}
                          alt={product.nombre}
                          width={96}
                          height={96}
                          objectFit="cover"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{product.nombre}</h3>
                      <p className="text-gray-800 font-bold text-lg">${product.precio}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{product.descripcion}</p>
                  {product.categorias && product.categorias.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.categorias.map((categoria, index) => (
                        <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                          {categoria}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className={`text-sm ${product.availability ? 'text-green-600' : 'text-red-600'} mb-2`}>
                    {product.availability ? 'Disponible' : 'No disponible'}
                  </p>
                  {product.extras && product.extras.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm mb-1 text-gray-700">Extras:</h4>
                      <ul className="text-sm text-gray-600">
                        {product.extras.map((extra) => (
                          <li key={extra.id}>{extra.name}: ${extra.price}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 bg-[#0D654A] text-white rounded-md hover:bg-[#0D654A] focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:ring-offset-2 flex items-center shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <Edit2 className="mr-1 h-4 w-4" /> Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <X className="mr-1 h-4 w-4" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para agregar/editar producto */}
      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg flex flex-col"> {/* Añadido flex flex-col */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900 sticky top-0 bg-white py-4 px-6 z-10 border-b">
              {editingProduct ? "Editar" : "Agregar"} Producto
            </h2>
            <div className="space-y-6 p-6 flex-grow overflow-y-auto"> {/* Añadido flex-grow y overflow-y-auto */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del producto</label>
                <input
                  type="text"
                  id="nombre"
                  value={newProduct.nombre}
                  onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  id="descripcion"
                  value={newProduct.descripcion}
                  onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
                <div 
                  {...getRootProps()} 
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-[#0D654A] transition-colors duration-300"
                >
                  <div className="space-y-1 text-center">
                    {newProduct.imagen ? (
                      <div>
                        <Image src={newProduct.imagen} alt="Preview" width={200} height={200} className="mx-auto object-cover rounded-md" />
                        <p className="text-sm text-gray-500 mt-2">Haz clic o arrastra una nueva imagen para cambiarla</p>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#0D654A] hover:text-[#0D654A] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#0D654A]">
                            <span>Sube un archivo</span>
                            <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="precio"
                    value={newProduct.precio}
                    onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) })}
                    className="block w-full pl-7 pr-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categorías (máximo 2)</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        value={category.name}
                        checked={newProduct.categorias?.includes(category.name) || false}
                        onChange={(e) => {
                          const categoryName = e.target.value;
                          setNewProduct(prev => {
                            const currentCategories = prev.categorias || [];
                            if (e.target.checked) {
                              if (currentCategories.length < 2) {
                                return { ...prev, categorias: [...currentCategories, categoryName] };
                              }
                            } else {
                              return { ...prev, categorias: currentCategories.filter(cat => cat !== categoryName) };
                            }
                            return prev;
                          });
                        }}
                        className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300 rounded"
                      />
                      <label htmlFor={`category-${category._id}`} className="ml-2 block text-sm text-gray-900">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
                {newProduct.categorias && newProduct.categorias.length === 2 && (
                  <p className="mt-2 text-sm text-[#0D654A]">Máximo de categorías seleccionadas</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Disponible</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="availability"
                      className="sr-only peer"
                      checked={newProduct.availability}
                      onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0D654A]"></div>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                <div className="bg-gray-50 rounded-md p-4 mb-4">
                  {newProduct.extras.length > 0 ? (
                    <div className="space-y-2">
                      {newProduct.extras.map((extra) => (
                        <div key={extra.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-700">{extra.name}</span>
                            <span className="text-sm text-gray-500">${extra.price.toFixed(2)}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteExtra(extra.id)}
                            className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No hay extras agregados</p>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newExtra.name}
                    onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                    placeholder="Nombre del extra"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] sm:text-sm"
                  />
                  <input
                    type="number"
                    value={newExtra.price}
                    onChange={(e) => setNewExtra({ ...newExtra, price: parseFloat(e.target.value) })}
                    placeholder="Precio"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] sm:text-sm"
                  />
                  <button
                    onClick={handleAddExtra}
                    className="px-4 py-2 bg-[#0D654A] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:ring-offset-2 sm:text-sm transition-colors duration-200"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white py-4 px-6 border-t flex justify-end gap-3"> {/* Ajustado el padding y añadido border-t */}
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  resetNewProduct()
                  setEditingProduct(null)
                }}
                className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] sm:text-sm shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-[#0D654A] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] sm:text-sm shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {editingProduct ? "Guardar cambios" : "Agregar producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
