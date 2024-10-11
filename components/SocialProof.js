import { StarIcon } from '@heroicons/react/20/solid'

const testimonials = [
  {
    content: "ZenVoice has revolutionized our invoice management. It's intuitive, efficient, and has saved us countless hours.",
    author: "Judith Black",
    role: "CEO of Workcation",
    image: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  },
  {
    content: "The self-serve invoices feature is a game-changer. Our customers love the convenience, and we love the time saved.",
    author: "Michael Foster",
    role: "Co-Founder of Acme Inc",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  },
  {
    content: "ZenVoice's editable invoices have been crucial for staying compliant. It's made our financial processes so much smoother.",
    author: "Emily Wilson",
    role: "CFO of TechNova",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
  }
]

export default function SocialProof() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by businesses everywhere
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <div key={testimonialIdx} className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-900/5 sm:p-10 rounded-2xl">
                <div>
                  <div className="flex gap-x-1 text-indigo-600">
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
