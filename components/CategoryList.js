'use client'

export default function CategoryList({ categories = [], activeCategory, setActiveCategory, appearance }) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const buttonClasses = (isActive) => `
    flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
    transition-all duration-200 ease-out
    ${isActive
      ? 'bg-gray-900 text-white shadow-sm'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
    }
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900
  `;

  return (
    <div className="relative w-full">
      <div
        className="
          flex items-center gap-2
          overflow-x-auto overscroll-x-contain
          px-4 sm:px-6 py-4
          scrollbar-hide
          scroll-smooth
        "
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
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
    </div>
  );
}
