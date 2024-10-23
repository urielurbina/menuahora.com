'use client'

export default function CategoryList({ categories = [], activeCategory, setActiveCategory, appearance }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null; // O podrías devolver un mensaje como "No hay categorías disponibles"
  }

  return (
    <div className="flex overflow-x-auto whitespace-nowrap p-4">
      <button
        className={`px-4 py-2 rounded-full mr-2 text-sm ${
          activeCategory === 'Todo'
            ? 'bg-black text-white'
            : 'bg-gray-100 text-black'
        }`}
        onClick={() => setActiveCategory('Todo')}
        style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
      >
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          className={`px-4 py-2 rounded-full mr-2 text-sm ${
            activeCategory === category.name
              ? 'bg-black text-white'
              : 'bg-gray-100 text-black'
          }`}
          onClick={() => setActiveCategory(category.name)}
          style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
