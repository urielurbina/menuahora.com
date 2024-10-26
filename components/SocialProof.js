'use client'

import React, { useEffect, useState, useRef } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    content: "MenúAhora transformó la manera en que gestionamos nuestro menú digital. Es intuitivo, eficiente y nos ha ahorrado horas de trabajo.",
    author: "Alejandro Gómez",
    role: "Taquería Los Amigos",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80",
    website: "https://www.menuahora.com"
  },
  {
    content: "La facilidad para actualizar el menú es un cambio total. Nuestros clientes valoran la conveniencia y nosotros disfrutamos del tiempo que ahorramos.",
    author: "Carla Fernández",
    role: "Restaurante La Fiesta",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80",
    website: "https://www.menuahora.com"
  },
  {
    content: "El diseño personalizado ha sido clave para mantener nuestra imagen de marca. Ha mejorado la manera en que presentamos nuestros productos.",
    author: "Martín López",
    role: "Delicias Gourmet",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80",
    website: "https://www.menuahora.com"
  }
]

const SocialProof = () => {
  const [isMobile, setIsMobile] = useState(false)
  const swiperRef = useRef(null)

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 640
      setIsMobile(mobile)
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.update()
      }
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const TestimonialCard = ({ testimonial }) => (
    <div className="flex flex-col justify-between bg-white p-6 shadow-xl ring-1 ring-gray-900/5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
      <div className="flex flex-col h-full items-center text-center">
        <div className="flex gap-x-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 flex-none" aria-hidden="true" />
          ))}
        </div>
        <blockquote className="mt-4 text-base leading-7 text-gray-700 flex-grow">
          <p>&quot;{testimonial.content}&quot;</p>
        </blockquote>
        <div className="mt-4 flex flex-col items-center">
          <div className="flex flex-col items-center gap-y-2">
            <img src={testimonial.image} alt="" className="h-16 w-16 rounded-full bg-gray-50 ring-2 ring-[#0D654A]" />
            <div>
              <div className="font-semibold text-gray-900">{testimonial.author}</div>
              <div className="text-sm leading-6 text-gray-600">{testimonial.role}</div>
            </div>
          </div>
          {/* <a
            href={testimonial.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#0D654A] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0D654A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D654A]"
          >
            Ver sitio
            <ArrowTopRightOnSquareIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
          </a> */}
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-b from-white to-[#F3FAF0] py-24 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="flex items-center justify-center text-lg font-semibold leading-8 tracking-tight text-[#0D654A]">Testimonios</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros usuarios están{' '}
            <span className="inline-block bg-[#0D654A] text-white px-4 py-2 rounded-md mt-2">
              encantados
            </span>
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          {isMobile ? (
            <div className="relative pb-4">
              <Swiper
                ref={swiperRef}
                slidesPerView={1.2}
                spaceBetween={20}
                centeredSlides={true}
                pagination={{ 
                  clickable: true,
                  el: '.swiper-pagination',
                  bulletClass: 'swiper-pagination-bullet custom-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active custom-bullet-active',
                }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {testimonials.map((testimonial, testimonialIdx) => (
                  <SwiperSlide key={testimonialIdx}>
                    <div className="h-[450px] mb-8">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-pagination absolute bottom-0 left-0 right-0"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, testimonialIdx) => (
                <TestimonialCard key={testimonialIdx} testimonial={testimonial} />
              ))}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .swiper-pagination {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          padding-bottom: 1rem;
        }
        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          background-color: #D1D5DB !important;
          opacity: 1 !important;
          margin: 0 8px !important;
        }
        .custom-bullet-active {
          background-color: #0D654A !important;
        }
        .mySwiper {
          padding-bottom: 3rem;
        }
      `}</style>
    </div>
  )
}

export default SocialProof
