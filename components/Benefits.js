import {
  QrCodeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

const benefits = [
  {
    name: 'Menú Digital QR',
    description: 'Crea fácilmente un menú digital accesible mediante un código QR, eliminando menús físicos.',
    icon: QrCodeIcon,
  },
  {
    name: 'Link Personalizado',
    description: 'Crea un enlace único y memorable para tu menú, facilitando que tus clientes lo encuentren rápidamente.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'SEO Optimizado',
    description: 'Mejora la visibilidad de tu menú en buscadores con palabras clave relevantes.',
    icon: ChartBarIcon,
  },
  {
    name: 'Diseño Profesional',
    description: 'Un diseñador experto se encarga de crear tu menú, adaptándolo a la identidad de tu marca.',
    icon: UserGroupIcon,
  },
]

export default function Benefits() {
  return (
    <div className="bg-gradient-to-b from-indigo-100 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Beneficios Clave</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Sistema Intuitivo de<br className="hidden sm:inline" />
            <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md mt-2">
              Administración de Menús
            </span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Con nuestro sistema, gestionar tu menú es fácil y rápido. Actualiza productos, precios y detalles en tiempo real.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <img
            alt="App screenshot"
            src="https://tailwindui.com/plus/img/component-images/project-app-screenshot.png"
            width={2432}
            height={1442}
            className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          />
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.name} className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 mb-6">
                <benefit.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <dt className="text-base font-semibold leading-7 text-gray-900">
                {benefit.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">{benefit.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
