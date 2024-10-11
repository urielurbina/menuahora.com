'use client'

import { ClipboardDocumentListIcon, UserGroupIcon, CreditCardIcon } from '@heroicons/react/24/outline'

const steps = [
  {
    name: 'Create your menu',
    description:
      'Easily input your dishes, prices, and categories. Our user-friendly interface makes menu creation a breeze.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Share with customers',
    description: 'Generate a unique QR code for your menu. Place it on tables or share it online for easy access.',
    icon: UserGroupIcon,
  },
  {
    name: 'Receive orders',
    description: 'Customers can browse and order directly from their devices. You receive orders in real-time.',
    icon: CreditCardIcon,
  },
]

export default function HowItWorks() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Streamlined Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get your digital menu up and running in just three simple steps. Our platform makes it easy for restaurants to modernize their ordering process.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative">
                <div className="group">
                  <div className="aspect-w-16 aspect-h-9 mb-6 overflow-hidden rounded-lg bg-gray-100 min-h-[200px]">
                    {/* Placeholder for image */}
                    <div className="flex items-center justify-center text-gray-500 h-full">
                      Image {stepIdx + 1}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-indigo-600">Step {stepIdx + 1}</span>
                    <p className="mt-2 text-xl font-semibold text-gray-900">{step.name}</p>
                    <p className="mt-2 text-base leading-7 text-gray-600">{step.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
