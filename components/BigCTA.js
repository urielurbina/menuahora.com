import Image from 'next/image'

export default function BigCTA() {
  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex justify-center lg:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0D654A]/20 to-[#0D654A]/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <Image
                  src="https://res.cloudinary.com/dkuss2bup/image/upload/f_auto,q_auto/v1/assets%20marca/dgs1cnynvijmbodl8bj4"
                  alt="Ejemplo de menú digital"
                  width={500}
                  height={500}
                  className="relative rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group-hover:-translate-y-1"
                />
              </div>
            </div>

            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Lleva tu negocio al siguiente nivel
                </h2>
                <p className="text-2xl font-semibold text-[#0D654A]">
                  Comienza hoy mismo
                </p>
              </div>
              
              <p className="text-lg leading-8 text-gray-600 max-w-xl mx-auto lg:mx-0">
                Potencia tu negocio con tu catálogo web: más ventas, menos costos, clientes más satisfechos.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/#pricing"
                  className="rounded-md bg-[#0D654A] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0D654A]/20 hover:shadow-xl hover:shadow-[#0D654A]/20 hover:-translate-y-0.5 transition-all duration-200"
                >
                  ¡Quiero mi catálogo digital!
                </a>
                <a
                  href="https://repisa.co/tacosuriel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-white/80 backdrop-blur-sm px-5 py-3 text-sm font-semibold text-[#0D654A] shadow-md ring-1 ring-[#0D654A]/20 hover:bg-white hover:shadow-lg transition-all duration-200"
                >
                  Ver demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
