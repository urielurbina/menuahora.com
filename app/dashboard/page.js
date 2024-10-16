'use client'

import { motion } from 'framer-motion';

const steps = [
  { name: 'Subir información', description: 'Completa la información básica de tu negocio.' },
  { name: 'Subir links', description: 'Agrega tus redes sociales y enlaces importantes.' },
  { name: 'Subir información sobre la identidad visual', description: 'Define los colores y la tipografía de tu marca.' },
  { name: 'Estamos trabajando en tu menú', description: 'Nuestro equipo está diseñando tu menú personalizado.' },
  { name: 'Menú entregado', description: '¡Tu menú digital está listo para usar!' },
];

export default function Status() {
  const currentStep = 2; // Este valor debería venir de tu backend

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Estatus de tu menú digital</h1>
      <nav aria-label="Progress">
        <ol className="overflow-hidden">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pb-10' : ''}`}>
              {stepIdx < currentStep ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-indigo-600" aria-hidden="true" />
                  ) : null}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative flex items-start group"
                  >
                    <span className="h-9 flex items-center">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-indigo-600 rounded-full group-hover:bg-indigo-800">
                        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </motion.div>
                </>
              ) : stepIdx === currentStep ? (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                  ) : null}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative flex items-start group"
                    aria-current="step"
                  >
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 rounded-full">
                        <span className="h-2.5 w-2.5 bg-indigo-600 rounded-full" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-indigo-600">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </motion.div>
                </>
              ) : (
                <>
                  {stepIdx !== steps.length - 1 ? (
                    <div className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex items-start group">
                    <span className="h-9 flex items-center" aria-hidden="true">
                      <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                        <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                      </span>
                    </span>
                    <span className="ml-4 min-w-0 flex flex-col">
                      <span className="text-xs font-semibold tracking-wide uppercase text-gray-500">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}