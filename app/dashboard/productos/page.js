"use client"

import { useState, useEffect } from "react"
import { Plus, X, Edit2 } from "lucide-react"
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
    precioPromocion: 0,
    categorias: [],
    availability: true,
    extras: [],
    variants: [],
    wholesalePricing: [],
    priceType: "per_package" // "per_piece" o "per_package"
  })
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [newExtra, setNewExtra] = useState({ name: "", price: 0, priceType: "per_package" })
  const [newVariantCategory, setNewVariantCategory] = useState("")
  const [newVariantOption, setNewVariantOption] = useState({ name: "", price: 0, quantityMultiplier: 1 })
  const [editingVariantCategory, setEditingVariantCategory] = useState(null)
  const [editingVariantOption, setEditingVariantOption] = useState(null)
  const [selectedVariantCategoryId, setSelectedVariantCategoryId] = useState(null)
  const [cardInfoSettings, setCardInfoSettings] = useState({
    nombre: true,
    descripcion: true,
    precio: true,
    categoria: true,
    imagen: true,
    detailedView: true,
  })
  const [error, setError] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [editingExtra, setEditingExtra] = useState(null)
  const [newWholesalePrice, setNewWholesalePrice] = useState({ minQuantity: 0, discount: 0 })
  const [editingWholesalePrice, setEditingWholesalePrice] = useState(null)

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
      precioPromocion: 0,
      categorias: [],
      availability: true,
      extras: [],
      variants: [],
      wholesalePricing: [],
      priceType: "per_package"
    })
    setNewExtra({ name: "", price: 0, priceType: "per_package" })
    setNewVariantCategory("")
    setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
    setEditingExtra(null)
    setEditingVariantCategory(null)
    setEditingVariantOption(null)
    setSelectedVariantCategoryId(null)
    setNewWholesalePrice({ minQuantity: 0, discount: 0 })
    setEditingWholesalePrice(null)
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

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
  };

  const handleUpdateCategory = async () => {
    if (newCategory.trim() && editingCategory) {
      try {
        const response = await fetch(`/api/categories/${editingCategory._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al actualizar la categoría');
        }
        await fetchCategories();
        setNewCategory("");
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        setError(error.message);
      }
    }
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setNewCategory("");
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
        extras: [...newProduct.extras, { 
          ...newExtra, 
          id: Date.now(), 
          price: parseFloat(newExtra.price),
          priceType: newExtra.priceType || "per_package"
        }],
      })
      setNewExtra({ name: "", price: 0, priceType: "per_package" })
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
    
    // Migrar de tipos a variants si es necesario
    let productWithVariants = { ...product }
    
    if (product.tipos && !product.variants) {
      // Migrar de la estructura antigua
      if (product.tipos.titulo && product.tipos.opciones && product.tipos.opciones.length > 0) {
        productWithVariants.variants = [{
          id: Date.now().toString() + Math.random().toString(36),
          name: product.tipos.titulo,
          enableStock: false,
          options: product.tipos.opciones.map(opcion => ({
            id: opcion.id || Date.now().toString() + Math.random().toString(36),
            name: opcion.nombre,
            stock: 0
          }))
        }]
      } else {
        productWithVariants.variants = []
      }
    } else if (!product.variants) {
      productWithVariants.variants = []
    }
    
    // Asegurar que wholesalePricing sea un array
    if (!productWithVariants.wholesalePricing) {
      productWithVariants.wholesalePricing = []
    }
    
    // Asegurar que priceType esté definido
    if (!productWithVariants.priceType) {
      productWithVariants.priceType = "per_package"
    }
    
    setNewProduct(productWithVariants)
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  // Funciones para manejar categorías de variantes
  const handleAddVariantCategory = () => {
    if (newVariantCategory.trim()) {
      const newCategory = {
        id: Date.now().toString() + Math.random().toString(36),
        name: newVariantCategory.trim(),
        enableStock: false,
        options: []
      }
      setNewProduct({
        ...newProduct,
        variants: [...newProduct.variants, newCategory]
      })
      setNewVariantCategory("")
    }
  }

  const handleDeleteVariantCategory = (categoryId) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.filter(variant => variant.id !== categoryId)
    })
    if (selectedVariantCategoryId === categoryId) {
      setSelectedVariantCategoryId(null)
    }
  }

  const handleEditVariantCategory = (category) => {
    setEditingVariantCategory(category)
    setNewVariantCategory(category.name)
  }

  const handleUpdateVariantCategory = () => {
    if (newVariantCategory.trim()) {
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingVariantCategory.id
            ? { ...variant, name: newVariantCategory.trim() }
            : variant
        )
      })
      setNewVariantCategory("")
      setEditingVariantCategory(null)
    }
  }

  const handleToggleVariantStock = (categoryId) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.map(variant =>
        variant.id === categoryId
          ? { ...variant, enableStock: !variant.enableStock }
          : variant
      )
    })
  }

  // Funciones para manejar opciones de variantes
  const handleAddVariantOption = () => {
    if (newVariantOption.name.trim() && selectedVariantCategoryId) {
      const newOption = {
        id: Date.now().toString() + Math.random().toString(36),
        name: newVariantOption.name.trim(),
        price: parseFloat(newVariantOption.price) || 0,
        quantityMultiplier: parseInt(newVariantOption.quantityMultiplier) || 1
      }
      
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === selectedVariantCategoryId
            ? { ...variant, options: [...variant.options, newOption] }
            : variant
        )
      })
      setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
    }
  }

  const handleDeleteVariantOption = (categoryId, optionId) => {
    setNewProduct({
      ...newProduct,
      variants: newProduct.variants.map(variant =>
        variant.id === categoryId
          ? { ...variant, options: variant.options.filter(option => option.id !== optionId) }
          : variant
      )
    })
  }

  const handleEditVariantOption = (categoryId, option) => {
    setEditingVariantOption({ categoryId, ...option })
    setNewVariantOption({ 
      name: option.name, 
      price: option.price || 0,
      quantityMultiplier: option.quantityMultiplier || 1
    })
    setSelectedVariantCategoryId(categoryId)
  }

  const handleUpdateVariantOption = () => {
    if (newVariantOption.name.trim()) {
    setNewProduct({
      ...newProduct,
        variants: newProduct.variants.map(variant =>
          variant.id === editingVariantOption.categoryId
            ? {
                ...variant,
                options: variant.options.map(option =>
                  option.id === editingVariantOption.id
                    ? { 
                        ...option, 
                        name: newVariantOption.name.trim(), 
                        price: parseFloat(newVariantOption.price) || 0,
                        quantityMultiplier: parseInt(newVariantOption.quantityMultiplier) || 1
                      }
                    : option
                )
              }
            : variant
        )
      })
      setNewVariantOption({ name: "", price: 0, quantityMultiplier: 1 })
      setEditingVariantOption(null)
    }
  }

  const handleEditExtra = (extra) => {
    setEditingExtra(extra)
    setNewExtra({ 
      name: extra.name, 
      price: extra.price,
      priceType: extra.priceType || "per_package"
    })
  }

  const handleUpdateExtra = () => {
    if (newExtra.name && newExtra.price) {
      setNewProduct({
        ...newProduct,
        extras: newProduct.extras.map(extra => 
          extra.id === editingExtra.id 
            ? { 
                ...newExtra, 
                id: extra.id, 
                price: parseFloat(newExtra.price),
                priceType: newExtra.priceType || "per_package"
              }
            : extra
        ),
      })
      setNewExtra({ name: "", price: 0, priceType: "per_package" })
      setEditingExtra(null)
    }
  }

  // Funciones para manejar precios mayoreo
  const handleAddWholesalePrice = () => {
    if (newWholesalePrice.minQuantity > 0 && newWholesalePrice.discount > 0) {
      const newWholesale = {
        id: Date.now().toString() + Math.random().toString(36),
        minQuantity: parseInt(newWholesalePrice.minQuantity),
        discount: parseFloat(newWholesalePrice.discount)
      }
      
      setNewProduct({
        ...newProduct,
        wholesalePricing: [...(newProduct.wholesalePricing || []), newWholesale].sort((a, b) => a.minQuantity - b.minQuantity)
      })
      setNewWholesalePrice({ minQuantity: 0, discount: 0 })
    }
  }

  const handleDeleteWholesalePrice = (id) => {
    setNewProduct({
      ...newProduct,
      wholesalePricing: (newProduct.wholesalePricing || []).filter(wholesale => wholesale.id !== id)
    })
  }

  const handleEditWholesalePrice = (wholesale) => {
    setEditingWholesalePrice(wholesale)
    setNewWholesalePrice({ minQuantity: wholesale.minQuantity, discount: wholesale.discount })
  }

  const handleUpdateWholesalePrice = () => {
    if (newWholesalePrice.minQuantity > 0 && newWholesalePrice.discount > 0) {
      setNewProduct({
        ...newProduct,
        wholesalePricing: (newProduct.wholesalePricing || []).map(wholesale =>
          wholesale.id === editingWholesalePrice.id
            ? { ...wholesale, minQuantity: parseInt(newWholesalePrice.minQuantity), discount: parseFloat(newWholesalePrice.discount) }
            : wholesale
        ).sort((a, b) => a.minQuantity - b.minQuantity)
      })
      setNewWholesalePrice({ minQuantity: 0, discount: 0 })
      setEditingWholesalePrice(null)
    }
  }


  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Administrador de Productos</h1>

      {/* Categorías e Información en Tarjeta */}
        {/* Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
              placeholder={editingCategory ? "Editar categoría" : "Nueva categoría"}
              className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0D654A] sm:text-sm sm:leading-6"
            />
            {editingCategory ? (
              <>
                <button
                  onClick={handleUpdateCategory}
                  className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
                >
                  Actualizar
                </button>
                <button
                  onClick={handleCancelEditCategory}
                  className="rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                onClick={handleAddCategory}
                className="rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
              >
                Agregar
              </button>
            )}
          </div>
          <div>
            {categories.length === 0 && dataLoaded ? (
              <p className="text-sm text-gray-500">No hay categorías. Añade una nueva categoría para empezar.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div key={category._id} className={`inline-flex items-center rounded-full px-3 py-1 ${
                    editingCategory?._id === category._id 
                      ? 'bg-blue-100 border-2 border-blue-300' 
                      : 'bg-gray-200'
                  }`}>
                    <span className="text-sm font-medium text-gray-700 mr-2">{category.name}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-gray-500 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                        title="Editar categoría"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-gray-500 hover:text-red-500 focus:outline-none transition-colors duration-200"
                        title="Eliminar categoría"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
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
      <div className="bg-white shadow rounded-lg p-4 mt-4 sm:mt-6 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Productos</h2>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="w-full sm:w-auto rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow duration-300 hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
          >
            <Plus className="inline-block mr-2 h-5 w-5" /> Agregar Producto
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
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
                      <div className="flex items-center gap-2">
                        {product.precioPromocion > 0 ? (
                          <>
                            <p className="text-gray-800 font-bold text-lg">${product.precioPromocion}</p>
                            <p className="text-gray-500 line-through text-sm">${product.precio}</p>
                          </>
                        ) : (
                          <p className="text-gray-800 font-bold text-lg">${product.precio}</p>
                        )}
                      </div>
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
                  {(product.variants && product.variants.length > 0) && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm mb-1 text-gray-700">Variantes:</h4>
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="mb-2">
                          <span className="text-xs font-medium text-gray-600">{variant.name}:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {variant.options.map((option) => (
                              <span key={option.id} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
                                {option.name}
                                {option.price > 0 && (
                                  <span className="ml-1 text-xs text-green-600">+${option.price.toFixed(2)}</span>
                                )}
                                {variant.enableStock && (
                                  <span className="ml-1 text-xs text-gray-500">(cantidad)</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(product.wholesalePricing && product.wholesalePricing.length > 0) && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm mb-1 text-gray-700">Precios Mayoreo:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.wholesalePricing.map((wholesale) => (
                          <span key={wholesale.id} className="inline-block bg-green-100 rounded-full px-2 py-1 text-xs font-semibold text-green-700">
                            {wholesale.minQuantity}+ = {wholesale.discount}% desc.
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Compatibilidad con estructura antigua */}
                  {product.tipos?.opciones?.length > 0 && !product.variants && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm mb-1 text-gray-700">{product.tipos.titulo}:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.tipos.opciones.map((tipo) => (
                          <span key={tipo.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
                            {tipo.nombre}
                          </span>
                        ))}
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl border border-gray-200">
            {/* Header mejorado */}
            <div className="bg-gradient-to-r from-[#0D654A] to-[#0a5a42] px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {editingProduct ? "Modifica la información de tu producto" : "Crea un nuevo producto para tu negocio"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAddingProduct(false)
                    resetNewProduct()
                    setEditingProduct(null)
                  }}
                  className="text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto px-6 py-6">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Información Básica */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
                    </div>
                  <div className="space-y-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del producto
                        </label>
                      <input
                        type="text"
                        id="nombre"
                        value={newProduct.nombre}
                        onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                          placeholder="Ej: Playera Personalizada, Stickers Pack 25"
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción
                        </label>
                      <textarea
                        id="descripcion"
                        value={newProduct.descripcion}
                        onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                          rows={4}
                          placeholder="Describe tu producto, materiales, características especiales..."
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>

                  {/* Imagen del Producto */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Imagen del Producto</h3>
                    </div>
                    <div {...getRootProps()} className="relative group cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0D654A] hover:bg-gray-100 transition-all duration-300 group-hover:shadow-md">
                      {newProduct.imagen ? (
                          <div className="relative">
                            <Image 
                              src={newProduct.imagen} 
                              alt="Preview" 
                              width={200} 
                              height={200} 
                              className="mx-auto object-cover rounded-lg shadow-md" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300 flex items-center justify-center">
                              <span className="text-white opacity-0 group-hover:opacity-100 font-medium">
                                Cambiar imagen
                              </span>
                            </div>
                        </div>
                      ) : (
                          <div className="py-8">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0D654A] transition-colors duration-300">
                              <svg className="w-8 h-8 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                            </div>
                            <p className="text-gray-600 font-medium mb-2">Agregar imagen del producto</p>
                            <p className="text-sm text-gray-500">Arrastra una imagen o haz click para seleccionar</p>
                          </div>
                        )}
                        <input {...getInputProps()} className="sr-only" />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 text-center">PNG, JPG hasta 10MB • Recomendado: 800x800px</p>
                    </div>
                  </div>

                {/* Precio y Disponibilidad */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Precio y Disponibilidad</h3>
                  </div>
                    <div className="space-y-6">
                      
                      {/* Tipo de precio */}
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center mb-3">
                          <label className="text-sm font-semibold text-gray-800">Tipo de precio</label>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <label className="flex items-start p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#0D654A] transition-colors duration-200">
                            <input
                              type="radio"
                              name="priceType"
                              value="per_package"
                              checked={newProduct.priceType === "per_package"}
                              onChange={(e) => setNewProduct({ ...newProduct, priceType: e.target.value })}
                              className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Precio por paquete/item</div>
                              <div className="text-xs text-gray-600 mt-1">El precio es fijo por cada unidad completa</div>
                              <div className="text-xs text-blue-600 mt-1">
                                <strong>Ejemplo:</strong> Paquete de 25 stickers = $100 (sin importar las 25 piezas)
                              </div>
                            </div>
                        </label>
                          <label className="flex items-start p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-[#0D654A] transition-colors duration-200">
                            <input
                              type="radio"
                              name="priceType"
                              value="per_piece"
                              checked={newProduct.priceType === "per_piece"}
                              onChange={(e) => setNewProduct({ ...newProduct, priceType: e.target.value })}
                              className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Precio por pieza individual</div>
                              <div className="text-xs text-gray-600 mt-1">El precio se multiplica por la cantidad de piezas</div>
                              <div className="text-xs text-blue-600 mt-1">
                                <strong>Ejemplo:</strong> $4 por sticker × 25 stickers = $100 total
                              </div>
                            </div>
                          </label>
                  </div>
                </div>

                      {/* Campos de precio */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                            Precio Regular
                            {newProduct.priceType === "per_piece" && (
                              <span className="text-xs text-blue-600 ml-2">(por pieza individual)</span>
                            )}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm font-medium">$</span>
                          </div>
                          <input
                            type="number"
                            id="precio"
                              value={newProduct.precio || ''}
                              onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })}
                              className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm font-medium"
                            placeholder="0.00"
                              step="0.01"
                              min="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                          <label htmlFor="precioPromocion" className="block text-sm font-medium text-gray-700 mb-2">
                            Precio Promoción
                            <span className="ml-1 text-xs text-gray-500">(Opcional)</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <span className="text-gray-500 text-sm font-medium">$</span>
                          </div>
                          <input
                            type="number"
                            id="precioPromocion"
                            value={newProduct.precioPromocion || ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              setNewProduct({ ...newProduct, precioPromocion: value });
                            }}
                              className="block w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm font-medium"
                            placeholder="0.00"
                              step="0.01"
                              min="0"
                          />
                        </div>
                        {newProduct.precioPromocion > newProduct.precio && (
                            <div className="mt-2 flex items-center text-red-600 text-xs">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              El precio de promoción no puede ser mayor al precio regular
                            </div>
                        )}
                      </div>
                    </div>
                      {/* Disponibilidad */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: newProduct.availability ? '#10B981' : '#EF4444'}}>
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {newProduct.availability ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                )}
                              </svg>
                            </div>
                            <div>
                              <label htmlFor="availability" className="text-sm font-medium text-gray-900">
                                Estado del producto
                              </label>
                              <p className="text-xs text-gray-600">
                                {newProduct.availability ? "Visible para los clientes" : "Oculto en el menú"}
                              </p>
                            </div>
                          </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="availability"
                          className="sr-only peer"
                          checked={newProduct.availability}
                          onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
                        />
                            <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                      </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Precios por Mayoreo */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Precios por Mayoreo</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configura descuentos automáticos basados en la cantidad comprada.
                  </p>
                  
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    {newProduct.wholesalePricing && newProduct.wholesalePricing.length > 0 ? (
                      <div className="space-y-2">
                        {newProduct.wholesalePricing.map((wholesale) => (
                          <div key={wholesale.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-medium text-gray-700">
                                {wholesale.minQuantity}+ unidades
                              </span>
                              <span className="text-sm text-green-600 font-medium">
                                {wholesale.discount}% descuento
                              </span>
                              <span className="text-xs text-gray-500">
                                (${((newProduct.precio * (100 - wholesale.discount)) / 100).toFixed(2)} c/u)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditWholesalePrice(wholesale)}
                                className="text-[#0D654A] hover:text-[#0D654A] focus:outline-none transition-colors duration-200"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteWholesalePrice(wholesale.id)}
                                className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">No hay precios mayoreo configurados</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad mínima</label>
                      <input
                        type="number"
                        value={newWholesalePrice.minQuantity || ''}
                        onChange={(e) => setNewWholesalePrice({ ...newWholesalePrice, minQuantity: parseInt(e.target.value) || 0 })}
                        placeholder="Ej: 10"
                        min="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                      <input
                        type="number"
                        value={newWholesalePrice.discount || ''}
                        onChange={(e) => setNewWholesalePrice({ ...newWholesalePrice, discount: parseFloat(e.target.value) || 0 })}
                        placeholder="Ej: 15"
                        min="1"
                        max="50"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-sm"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={editingWholesalePrice ? handleUpdateWholesalePrice : handleAddWholesalePrice}
                        className="w-full sm:w-auto px-4 py-2 bg-[#0D654A] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] text-sm transition-colors duration-200"
                      >
                        {editingWholesalePrice ? "Actualizar" : "Agregar"}
                      </button>
                    </div>
                  </div>
                  
                  {newWholesalePrice.minQuantity > 0 && newWholesalePrice.discount > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>Vista previa:</strong> {newWholesalePrice.minQuantity}+ unidades = 
                        ${((newProduct.precio * (100 - newWholesalePrice.discount)) / 100).toFixed(2)} c/u 
                        ({newWholesalePrice.discount}% descuento)
                      </p>
                    </div>
                  )}
                </div>

                {/* Variantes del Producto */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Variantes del Producto</h3>
                  </div>
                  <div className="space-y-6">
                    
                    {/* Agregar nueva categoría de variantes */}
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Categoría de Variantes</label>
                      <div className="flex gap-2">
                      <input
                        type="text"
                          value={newVariantCategory}
                          onChange={(e) => setNewVariantCategory(e.target.value)}
                        placeholder="Ej: Tallas, Sabores, Tortillas, Temperaturas, etc."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-sm"
                        />
                        <button
                          onClick={editingVariantCategory ? handleUpdateVariantCategory : handleAddVariantCategory}
                          className="px-4 py-2 bg-[#0D654A] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] text-sm transition-colors duration-200"
                        >
                          {editingVariantCategory ? "Actualizar" : "Agregar"}
                        </button>
                    </div>
                    </div>

                    {/* Lista de categorías de variantes */}
                    {newProduct.variants.length > 0 && (
                      <div className="space-y-4">
                        {newProduct.variants.map((variant) => (
                          <div key={variant.id} className="bg-gray-50 rounded-lg p-4 border">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium text-gray-900">{variant.name}</h4>
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={variant.enableStock}
                                    onChange={() => handleToggleVariantStock(variant.id)}
                                    className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300 rounded"
                                  />
                                  Permitir seleccionar cantidad
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditVariantCategory(variant)}
                                  className="text-[#0D654A] hover:text-[#0D654A] focus:outline-none transition-colors duration-200"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteVariantCategory(variant.id)}
                                  className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Opciones de la categoría */}
                        <div className="space-y-2">
                              {variant.options.map((option) => (
                                <div key={option.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <span className="text-sm font-medium text-gray-700">{option.name}</span>
                                      {option.price > 0 && (
                                        <span className="text-xs text-green-600 ml-2">+${option.price.toFixed(2)}</span>
                                      )}
                                      {option.quantityMultiplier && option.quantityMultiplier > 1 && (
                                        <span className="text-xs text-blue-600 ml-2">({option.quantityMultiplier} piezas)</span>
                                      )}
                                    </div>
                                    {variant.enableStock && (
                                      <span className="text-xs text-gray-500">Cantidad seleccionable</span>
                                    )}
                                  </div>
                              <div className="flex items-center space-x-2">
                                <button
                                      onClick={() => handleEditVariantOption(variant.id, option)}
                                  className="text-[#0D654A] hover:text-[#0D654A] focus:outline-none transition-colors duration-200"
                                >
                                      <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                      onClick={() => handleDeleteVariantOption(variant.id, option.id)}
                                  className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
                                >
                                      <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                            {/* Agregar nueva opción */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                                  value={selectedVariantCategoryId === variant.id ? newVariantOption.name : ""}
                                  onChange={(e) => setNewVariantOption({ ...newVariantOption, name: e.target.value })}
                                  placeholder={`Nueva ${variant.name.toLowerCase()}`}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-sm"
                                  onClick={() => setSelectedVariantCategoryId(variant.id)}
                                />
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 text-sm">+$</span>
                                  </div>
                                  <input
                                    type="number"
                                    value={selectedVariantCategoryId === variant.id && newVariantOption.price > 0 ? newVariantOption.price : ""}
                                    onChange={(e) => setNewVariantOption({ ...newVariantOption, price: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className="w-32 pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-sm"
                                    onClick={() => setSelectedVariantCategoryId(variant.id)}
                                  />
                                </div>
                      <button
                                  onClick={() => {
                                    setSelectedVariantCategoryId(variant.id)
                                    editingVariantOption ? handleUpdateVariantOption() : handleAddVariantOption()
                                  }}
                                  className="px-3 py-2 bg-[#0D654A] text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] text-sm transition-colors duration-200"
                                >
                                  {editingVariantOption ? "Actualizar" : "Agregar"}
                      </button>
                    </div>
                              
                              {/* Campo para multiplicador de cantidad */}
                              <div className="bg-blue-50 p-3 rounded-md">
                                <div className="flex gap-2 items-center mb-2">
                                  <label className="text-xs font-medium text-gray-700">Cantidad real por unidad:</label>
                                  <input
                                    type="number"
                                    value={selectedVariantCategoryId === variant.id ? (newVariantOption.quantityMultiplier || "") : ""}
                                    onChange={(e) => {
                                      setSelectedVariantCategoryId(variant.id);
                                      setNewVariantOption({ ...newVariantOption, quantityMultiplier: parseInt(e.target.value) || 1 });
                                    }}
                                    placeholder="1"
                                    min="1"
                                    className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0D654A] text-xs"
                                    onFocus={() => setSelectedVariantCategoryId(variant.id)}
                                  />
                  </div>
                                <div className="text-xs text-gray-600">
                                  <p className="mb-1"><strong>¿Qué es esto?</strong></p>
                                  <p className="mb-1">• <strong>Para productos individuales</strong> (playeras, tacos): Dejar en 1</p>
                                  <p className="mb-1">• <strong>Para paquetes</strong> (stickers, volantes): Poner la cantidad del paquete</p>
                                  <p className="text-blue-600">
                                    <strong>Ejemplo:</strong> Si vendes &quot;Paquete 25 stickers&quot;, pon 25. 
                                    Así 2 paquetes = 50 stickers para descuentos por mayoreo.
                                  </p>
                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {newProduct.variants.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No hay categorías de variantes agregadas</p>
                        <p className="text-xs mt-1">Agrega una categoría para empezar (ej: Tallas, Sabores, etc.)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Extras */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">6</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Extras del Producto</h3>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    {newProduct.extras.length > 0 ? (
                      <div className="space-y-2">
                        {newProduct.extras.map((extra) => (
                          <div key={extra.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">{extra.name}</span>
                              <span className="text-sm text-green-600 font-medium">${extra.price.toFixed(2)}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                {extra.priceType === "per_piece" ? "por pieza" : "por paquete"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditExtra(extra)}
                                className="text-[#0D654A] hover:text-[#0D654A] focus:outline-none transition-colors duration-200"
                              >
                                <Edit2 className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExtra(extra.id)}
                                className="text-red-600 hover:text-red-800 focus:outline-none transition-colors duration-200"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">No hay extras agregados</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    {/* Campos de entrada para extras */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del extra</label>
                    <input
                      type="text"
                      value={newExtra.name}
                      onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                          placeholder="Ej: Impresión personalizada, Queso extra"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm font-medium">$</span>
                          </div>
                    <input
                      type="number"
                            value={newExtra.price || ''}
                            onChange={(e) => setNewExtra({ ...newExtra, price: parseFloat(e.target.value) || 0 })}
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D654A] focus:border-transparent transition-all duration-200 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Tipo de precio para extras */}
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de precio del extra
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="flex items-center p-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:border-[#0D654A] transition-colors duration-200">
                          <input
                            type="radio"
                            name="extraPriceType"
                            value="per_package"
                            checked={newExtra.priceType === "per_package"}
                            onChange={(e) => setNewExtra({ ...newExtra, priceType: e.target.value })}
                            className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300"
                          />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">Por paquete/total</div>
                            <div className="text-xs text-gray-600">Precio fijo por pedido</div>
                          </div>
                        </label>
                        <label className="flex items-center p-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:border-[#0D654A] transition-colors duration-200">
                          <input
                            type="radio"
                            name="extraPriceType"
                            value="per_piece"
                            checked={newExtra.priceType === "per_piece"}
                            onChange={(e) => setNewExtra({ ...newExtra, priceType: e.target.value })}
                            className="h-4 w-4 text-[#0D654A] focus:ring-[#0D654A] border-gray-300"
                          />
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">Por pieza</div>
                            <div className="text-xs text-gray-600">Se multiplica por cantidad</div>
                          </div>
                        </label>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        {newExtra.priceType === "per_package" ? (
                          <p><strong>Ejemplo:</strong> Impresión $10 por todo el pedido</p>
                        ) : (
                          <p><strong>Ejemplo:</strong> Impresión $2 por cada sticker</p>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={editingExtra ? handleUpdateExtra : handleAddExtra}
                      className="w-full px-4 py-3 bg-[#0D654A] text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] text-sm font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      {editingExtra ? "Actualizar Extra" : "Agregar Extra"}
                    </button>
                  </div>
                </div>

                {/* Categorías */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-[#0D654A] rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">7</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Categorías del Producto</h3>
                  </div>
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
                    <div className="mt-3 flex items-center text-[#0D654A] text-sm">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Máximo de categorías seleccionadas (2/2)
                    </div>
                  )}
                </div>
              </div>
            {/* Footer mejorado */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Tip:</span> Asegúrate de configurar las variantes y precios antes de guardar
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  resetNewProduct()
                  setEditingProduct(null)
                }}
                    className="flex-1 sm:flex-none px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                    Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                    className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-[#0D654A] to-[#0a5a42] text-white rounded-lg hover:from-[#0a5a42] hover:to-[#084c3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D654A] text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                    {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

