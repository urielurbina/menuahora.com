'use client'

export default function CategoryList({ categories = [], activeCategory, setActiveCategory, appearance }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const buttonClasses = (isActive) => `
    px-4 py-2 rounded-full mr-2 text-sm transition-all duration-200 ease-in-out
    ${isActive ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-black hover:bg-gray-200'}
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
  `;

  return (
    <div className="flex items-center justify-start overflow-x-auto whitespace-nowrap px-6 py-4 space-x-1">
      <button
        className={buttonClasses(activeCategory === 'Todo')}
        onClick={() => setActiveCategory('Todo')}
        style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
      >
        Todo
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          className={buttonClasses(activeCategory === category.name)}
          onClick={() => setActiveCategory(category.name)}
          style={{ fontFamily: appearance.bodyFont || 'sans-serif' }}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
