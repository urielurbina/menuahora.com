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
    <div className="flex flex-col justify-between bg-white/70 backdrop-blur-sm p-8 shadow-xl ring-1 ring-gray-900/5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-x-4 mb-6">
          <img 
            src={testimonial.image} 
            alt="" 
            className="h-14 w-14 rounded-full bg-gray-50 ring-2 ring-[#0D654A] p-0.5" 
          />
          <div>
            <div className="font-semibold text-gray-900">{testimonial.author}</div>
            <div className="text-sm leading-6 text-[#0D654A]">{testimonial.role}</div>
          </div>
        </div>
        <div className="flex gap-x-1 text-[#0D654A]">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className="h-5 w-5 flex-none" aria-hidden="true" />
          ))}
        </div>
        <blockquote className="mt-4 text-base leading-7 text-gray-600 flex-grow">
          <p className="relative">
            <span className="text-3xl text-[#0D654A]/20 absolute -top-2 -left-2">&ldquo;</span>
            {testimonial.content}
            <span className="text-3xl text-[#0D654A]/20 absolute -bottom-4 -right-2">&rdquo;</span>
          </p>
        </blockquote>
      </div>
    </div>
  )

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0D654A]/5 rounded-full blur-3xl" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0D654A]/10 rounded-full blur-xl" />
          
          <h2 className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full">
            Testimonios
          </h2>
          <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Nuestros usuarios están{' '}
            <span className="text-[#0D654A]">encantados</span>
          </p>
        </div>

        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          {isMobile ? (
            <div className="relative pb-4">
              <Swiper
                ref={swiperRef}
                slidesPerView={1.1}
                spaceBetween={16}
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
                    <div className="h-[400px] mb-8">
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
          width: 8px !important;
          height: 8px !important;
          background-color: #D1D5DB !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease;
        }
        .custom-bullet-active {
          background-color: #0D654A !important;
          width: 24px !important;
          border-radius: 4px !important;
        }
        .mySwiper {
          padding-bottom: 3rem;
        }
      `}</style>
    </div>
  )
}

export default SocialProof
