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
    name: 'Aumento de Ventas',
    description: 'Incrementa tus ventas con sugerencias personalizadas y promociones en tiempo real.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Análisis de Datos',
    description: 'Obtén insights valiosos sobre las preferencias de tus clientes y el rendimiento de tu menú.',
    icon: ChartBarIcon,
  },
  {
    name: 'Mejora la Experiencia',
    description: 'Ofrece a tus clientes una experiencia de pedido moderna, rápida y sin complicaciones.',
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
            Transforma tu Restaurante con Nuestro Menú Digital
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Descubre cómo nuestra solución de menú digital puede revolucionar la experiencia en tu restaurante y aumentar tus ingresos.
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
          {/* <div aria-hidden="true" className="relative">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
          </div> */}
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.name} className="relative">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <benefit.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 text-lg font-semibold leading-8 text-gray-900">{benefit.name}</p>
              </dt>
              <dd className="mt-2 ml-16 text-base leading-7 text-gray-600">{benefit.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
