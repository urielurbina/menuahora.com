// A useful component when your product is challenging the status quo.
// Highlight the current pain points (left) and how your product is solving them (right)
// Try to match the lines from left to right, so the user can easily compare the two columns
const WithWithout = () => {
  return (
    <section 
      className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32"
      aria-labelledby="comparativa"
      itemScope
      itemType="https://schema.org/ComparisonTable"
      lang="es"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center relative">
          {/* Elementos decorativos */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0D654A]/5 rounded-full blur-3xl" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0D654A]/10 rounded-full blur-xl" />
          
          <h2 
            id="comparativa"
            className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full"
            itemProp="name"
          >
            Comparativa
          </h2>
          <p 
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            itemProp="description"
          >
            Deja atrás los problemas<br className="hidden sm:inline" /> de un menú tradicional{' '}
            <span className="inline-block animate-wave">👋</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
            Descubre cómo MenúAhora simplifica tu proceso de gestión de menús y ahorra tiempo y dinero.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl 
            className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2"
            itemProp="comparisonItem"
          >
            {/* Columna Menú Tradicional */}
            <div 
              className="flex flex-col rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-xl ring-1 ring-red-200/60 transition-all duration-300 hover:shadow-2xl relative group"
              itemScope
              itemType="https://schema.org/Product"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-100/80 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <dt 
                className="relative flex items-center gap-x-3 text-xl font-bold leading-7 text-red-800 mb-6"
                itemProp="name"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
                Menú tradicional
              </dt>
              
              <dd className="relative mt-6 flex flex-auto flex-col text-base leading-7 text-gray-700">
                <ul 
                  className="flex-auto space-y-4"
                  itemProp="description"
                >
                  {[
                    "Actualizaciones lentas que requieren reimpresión",
                    "Costos constantes de diseño e impresión",
                    "Sin opciones para pedidos por WhatsApp",
                    "Difícil de compartir en redes sociales",
                    "Depende de terceros para modificaciones",
                  ].map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-start group/item"
                      itemProp="disadvantage"
                    >
                      <svg className="h-6 w-5 flex-none text-red-500 transition-transform duration-300 group-hover/item:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                      <span className="ml-3 group-hover/item:text-gray-900 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            {/* Columna MenúAhora */}
            <div 
              className="flex flex-col rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-xl ring-1 ring-[#0D654A]/20 transition-all duration-300 hover:shadow-2xl relative group"
              itemScope
              itemType="https://schema.org/Product"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/80 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              <dt 
                className="relative flex items-center gap-x-3 text-xl font-bold leading-7 text-[#0D654A] mb-6"
                itemProp="name"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0D654A]/10">
                  <svg className="h-6 w-6 text-[#0D654A]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                MenúAhora
              </dt>
              
              <dd className="relative mt-6 flex flex-auto flex-col text-base leading-7 text-gray-700">
                <ul 
                  className="flex-auto space-y-4"
                  itemProp="description"
                >
                  {[
                    "Crea y actualiza tu menú digital al instante",
                    "Recibe pedidos directamente por WhatsApp Business",
                    "Comparte fácilmente en redes con link y QR",
                    "Sistema automático de pedidos integrado",
                    "Control total sobre tu catálogo de productos",
                  ].map((item, index) => (
                    <li 
                      key={index} 
                      className="flex items-start group/item"
                      itemProp="benefit"
                    >
                      <svg className="h-6 w-5 flex-none text-[#0D654A] transition-transform duration-300 group-hover/item:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 group-hover/item:text-gray-900 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default WithWithout;
