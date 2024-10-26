import Image from 'next/image'

export default function BigCTA() {
  return (
    <div className="bg-white">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex justify-center lg:justify-end">
              <Image
                src="https://res.cloudinary.com/dkuss2bup/image/upload/f_auto,q_auto/v1/assets%20marca/dgs1cnynvijmbodl8bj4"
                alt="Ejemplo de menú digital"
                width={500}
                height={500}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Lleva tu menú al siguiente nivel
                <br />
                <span className="text-[#0D654A]">Comienza hoy mismo</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600 mx-auto lg:mx-0">
                Potencia tu restaurante con menús digitales: más ventas, menos costos, clientes más satisfechos.
              </p>
              <div className="mt-10 flex justify-center lg:justify-start">
                <a
                  href="#"
                  className="rounded-md bg-[#0D654A] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
                >
                  ¡Quiero mi menú digital!
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
