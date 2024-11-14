import {
  QrCodeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UserGroupIcon,
  PencilSquareIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const benefits = [
  {
    name: 'Actualización en Tiempo Real',
    description: 'Modifica tu menú digital instantáneamente. Mantén tus productos y precios siempre actualizados sin complicaciones.',
    icon: ClockIcon,
  },
  {
    name: 'Link y Código QR',
    description: 'Comparte tu menú digital fácilmente con un link personalizado y código QR. Tus clientes podrán hacer pedidos desde cualquier dispositivo.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Experiencia Móvil Optimizada',
    description: 'Tu catálogo se adapta perfectamente a todos los dispositivos. Diseño profesional que facilita la navegación y los pedidos.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Recibe Pedidos por WhatsApp',
    description: 'Tus clientes pueden hacer pedidos directamente por WhatsApp. Sistema simple y eficiente para gestionar tu negocio.',
    icon: PencilSquareIcon,
  },
]

export default function Benefits() {
  return (
    <section 
      className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32"
      aria-labelledby="beneficios"
      itemScope
      itemType="https://schema.org/ItemList"
      lang="es"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0D654A]/5 rounded-full blur-3xl" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0D654A]/10 rounded-full blur-xl" />
          
          <h2 
            id="beneficios"
            className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full"
            itemProp="name"
          >
            Beneficios Clave
          </h2>
          <p 
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            itemProp="description"
          >
            Tienda Digital Profesional{' '}
            <span className="text-[#0D654A]">Con Sistema de Pedidos</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
            Crea tu menú digital profesional y recibe pedidos por WhatsApp. Sistema intuitivo y fácil de gestionar.
          </p>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D654A]/5 via-transparent to-[#0D654A]/5 blur-3xl" />
            
            <img
              alt="Captura de pantalla de la aplicación MenúAhora mostrando el catálogo digital"
              src="https://res.cloudinary.com/dkuss2bup/image/upload/v1729741048/assets%20marca/f1lx2vgbczhnwzfwjufm.png"
              width={2432}
              height={1442}
              className="mb-[-4%] rounded-xl shadow-2xl ring-1 ring-gray-900/10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(13,101,74,0.2)] relative"
              itemProp="image"
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl 
            className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.name} 
                className="flex flex-col items-center text-center sm:items-start sm:text-left group relative"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={index + 1} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D654A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl -z-10" />
                
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0D654A] mb-6 shadow-lg shadow-[#0D654A]/20 transition-transform duration-300 group-hover:-translate-y-1">
                  <benefit.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                </div>
                <dt 
                  className="text-lg font-semibold leading-7 text-gray-900 group-hover:text-[#0D654A] transition-colors duration-300"
                  itemProp="name"
                >
                  {benefit.name}
                </dt>
                <dd 
                  className="mt-2 text-base leading-7 text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                  itemProp="description"
                >
                  {benefit.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
