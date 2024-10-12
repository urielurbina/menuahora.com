// A useful component when your product is challenging the status quo.
// Highlight the current pain points (left) and how your product is solving them (right)
// Try to match the lines from left to right, so the user can easily compare the two columns
const WithWithout = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Comparativa</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Deja atrás los problemas<br className="hidden sm:inline" /> de un menú tradicional 👋
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Descubre cómo MenúAhora simplifica tu proceso de gestión de menús y ahorra tiempo y dinero.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-gradient-to-br from-red-100 to-red-50 p-8 shadow-lg border border-red-200 transition-all hover:shadow-xl">
              <dt className="text-xl font-bold leading-7 text-red-800 mb-4">
                Menú tradicional
              </dt>
              <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-700">
                <ul className="flex-auto space-y-4">
                  {[
                    "Actualizar el menú puede tardar días",
                    "Cada modificación requiere reimpresión",
                    "No se distribuye fácilmente en redes",
                    "No refleja cambios en tiempo real",
                    "Necesitas contactar al diseñador",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                      <span className="ml-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="flex flex-col rounded-2xl bg-gradient-to-br from-green-100 to-green-50 p-8 shadow-lg border border-green-200 transition-all hover:shadow-xl">
              <dt className="text-xl font-bold leading-7 text-green-800 mb-4">
                MenúAhora
              </dt>
              <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-700">
                <ul className="flex-auto space-y-4">
                  {[
                    "Edita productos en segundos",
                    "Olvídate de las impresiones",
                    "Fácil acceso desde cualquier dispositivo",
                    "Refleja cambios en tiempo real",
                    "Gestiona tu menú sin intermediarios",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default WithWithout;
