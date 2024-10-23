'use client'

export default function CategoryList({ categories, activeCategory, setActiveCategory, appearance }) {
  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>
      <div className="flex space-x-2 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('Todo')}
          className={`px-4 py-2 rounded-full text-sm ${
            activeCategory === 'Todo'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-black'
          }`}
        >
          Todo
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setActiveCategory(category.name)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === category.name
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}
