"use client"

import { useState } from "react"
import { Plus, X, Edit2, ChevronDown, ChevronUp } from "lucide-react"

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
    categoria: "",
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
    detailedView: true,  // Cambiado de 'enabled' a 'detailedView'
  })
  const [expandedProduct, setExpandedProduct] = useState(null)

  const handleAddProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...editingProduct, ...newProduct } : p))
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }])
    }
    resetNewProduct()
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const resetNewProduct = () => {
    setNewProduct({
      nombre: "",
      descripcion: "",
      imagen: "",
      precio: 0,
      categoria: "",
      availability: true,
      extras: [],
    })
  }

  const handleAddCategory = () => {
    if (newCategory) {
      setCategories([...categories, { id: Date.now(), name: newCategory }])
      setNewCategory("")
    }
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id))
  }

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

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Administrador de Productos</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Categorías</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nueva categoría"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category.id} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full flex items-center">
              {category.name}
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Información en Tarjeta</h2>
        <div className="space-y-2">
          {Object.entries(cardInfoSettings)
            .filter(([key]) => key !== 'detailedView')
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{key}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={value}
                    onChange={(e) => setCardInfoSettings({ ...cardInfoSettings, [key]: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          <div className="my-4 border-t border-gray-200"></div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Vista detallada</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={cardInfoSettings.detailedView}
                onChange={(e) => setCardInfoSettings({ ...cardInfoSettings, detailedView: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsAddingProduct(true)}
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
      >
        <Plus className="mr-2" /> Agregar Producto
      </button>

      {isAddingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingProduct ? "Editar" : "Agregar"} Producto</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={newProduct.nombre}
                onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                placeholder="Nombre del producto"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newProduct.descripcion}
                onChange={(e) => setNewProduct({ ...newProduct, descripcion: e.target.value })}
                placeholder="Descripción"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newProduct.imagen}
                onChange={(e) => setNewProduct({ ...newProduct, imagen: e.target.value })}
                placeholder="URL de la imagen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={newProduct.precio}
                onChange={(e) => setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) })}
                placeholder="Precio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newProduct.categoria}
                onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Disponible</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={newProduct.availability}
                    onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-gray-700">Extras</h3>
                {newProduct.extras.map((extra) => (
                  <div key={extra.id} className="flex items-center justify-between mb-2">
                    <span>{extra.name}: ${extra.price}</span>
                    <button
                      onClick={() => handleDeleteExtra(extra.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newExtra.name}
                    onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
                    placeholder="Nombre del extra"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newExtra.price}
                    onChange={(e) => setNewExtra({ ...newExtra, price: parseFloat(e.target.value) })}
                    placeholder="Precio"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddExtra}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingProduct(false)
                  resetNewProduct()
                  setEditingProduct(null)
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {editingProduct ? "Guardar" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {cardInfoSettings.enabled && cardInfoSettings.imagen && (
              <img src={product.imagen} alt={product.nombre} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                {cardInfoSettings.enabled && cardInfoSettings.nombre && (
                  <h3 className="font-bold text-xl text-gray-800">{product.nombre}</h3>
                )}
                <button
                  onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {expandedProduct === product.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
              {(expandedProduct === product.id || cardInfoSettings.enabled) && (
                <>
                  {cardInfoSettings.descripcion && (
                    <p className="text-gray-600 text-sm mb-2">{product.descripcion}</p>
                  )}
                  {cardInfoSettings.precio && (
                    <p className="text-gray-800 font-bold text-lg mb-2">${product.precio}</p>
                  )}
                  {cardInfoSettings.categoria && (
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                      {product.categoria}
                    </span>
                  )}
                  <p className={`text-sm ${product.availability ? 'text-green-600' : 'text-red-600'} mb-2`}>
                    {product.availability ? 'Disponible' : 'No disponible'}
                  </p>
                  {product.extras.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm mb-1 text-gray-700">Extras:</h4>
                      <ul className="text-sm text-gray-600">
                        {product.extras.map((extra) => (
                          <li key={extra.id}>{extra.name}: ${extra.price}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <Edit2 className="mr-1 h-4 w-4" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
                >
                  <X className="mr-1 h-4 w-4" /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
