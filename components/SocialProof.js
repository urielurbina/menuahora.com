import React from 'react'
import { StarIcon } from '@heroicons/react/20/solid'

const testimonials = [
  {
    content: "MenúAhora transformó la manera en que gestionamos nuestro menú digital. Es intuitivo, eficiente y nos ha ahorrado horas de trabajo.",
    author: "Alejandro Gómez",
    role: "Taquería Los Amigos",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  },
  {
    content: "La facilidad para actualizar el menú es un cambio total. Nuestros clientes valoran la conveniencia y nosotros disfrutamos del tiempo que ahorramos.",
    author: "Carla Fernández",
    role: "Restaurante La Fiesta",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  },
  {
    content: "El diseño personalizado ha sido clave para mantener nuestra imagen de marca. Ha mejorado la manera en que presentamos nuestros productos.",
    author: "Martín López",
    role: "Delicias Gourmet",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  }
]

const SocialProof = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="flex items-center justify-center text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonios</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros usuarios están{' '}
            <span className="relative inline-block">
              encantados
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
            </span>
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-900/5 sm:p-10 rounded-2xl">
                <div>
                  <div className="flex gap-x-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 flex-none" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-6 text-lg leading-8 text-gray-700">
                    <p>&quot;{testimonial.content}&quot;</p>
                  </blockquote>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <img src={testimonial.image} alt="" className="h-12 w-12 rounded-full bg-gray-50" />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm leading-6 text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SocialProof
