"use client";

import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

const Pricing = () => {
  const plan = config.stripe.plans.find(plan => plan.name === "Plan Esencial");

  return (
    <section 
      className="bg-gradient-to-br from-white via-gray-50 to-white py-24 sm:py-32" 
      id="precios"
      aria-labelledby="pricing-title"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center relative">
          {/* Elementos decorativos */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#0D654A]/5 rounded-full blur-3xl" />
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0D654A]/10 rounded-full blur-xl" />
          
          <h2 
            id="pricing-title"
            className="inline-block px-4 py-1 text-sm font-semibold uppercase tracking-wider text-[#0D654A] bg-[#0D654A]/10 rounded-full"
          >
            Precios
          </h2>
          <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Crea tu catálogo digital{' '}
            <span className="text-[#0D654A]">profesional</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
            Comienza a recibir pedidos por WhatsApp hoy mismo con nuestros planes
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-md gap-8 lg:max-w-4xl lg:grid-cols-2">
          <PlanCard plan={plan} billingPeriod="monthly" />
          <PlanCard plan={plan} billingPeriod="yearly" />
        </div>

        <div className="mx-auto mt-16 max-w-md lg:max-w-4xl">
          <CustomPlanCard />
        </div>
      </div>
    </section>
  );
};

const PlanCard = ({ plan, billingPeriod }) => {
  const isYearly = billingPeriod === "yearly";
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const yearlySavings = isYearly ? (plan.price.monthly * 12) - plan.price.yearly : 0;
  const yearlySavingsPercentage = isYearly ? Math.round((yearlySavings / (plan.price.monthly * 12)) * 100) : 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-xl ring-1 ring-gray-900/5 sm:p-10 transition-all duration-300 hover:shadow-2xl relative group">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D654A]/5 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
      
      <div className="relative">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          {plan.name} - {isYearly ? "Anual" : "Mensual"}
          {isYearly && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-[#0D654A] bg-[#0D654A]/10 rounded-full">
              Mejor valor
            </span>
          )}
        </h3>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {plan.description}
        </p>
        <div className="mt-8 flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-[#0D654A]">${price}</span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
            MXN / {isYearly ? "año" : "mes"}
          </span>
        </div>
        {isYearly && yearlySavings > 0 && (
          <p className="mt-2 text-sm font-semibold text-[#0D654A] bg-[#0D654A]/10 px-3 py-1 rounded-full inline-block">
            Ahorras ${yearlySavings} MXN ({yearlySavingsPercentage}% descuento)
          </p>
        )}
        <ul className="mt-8 space-y-4 text-sm leading-6 text-gray-600">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex gap-x-3 items-center group/item">
              <svg className="h-6 w-5 flex-none text-[#0D654A] transition-transform duration-300 group-hover/item:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="group-hover/item:text-gray-900 transition-colors">{feature.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <ButtonCheckout 
          priceId={plan.priceId[billingPeriod]} 
          className="w-full bg-[#0D654A] hover:bg-[#0D654A]/90 shadow-lg shadow-[#0D654A]/20 hover:shadow-xl hover:shadow-[#0D654A]/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          Comenzar {isYearly ? "Anual" : "Mensual"}
        </ButtonCheckout>
      </div>
    </div>
  );
};

const CustomPlanCard = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-xl ring-1 ring-gray-900/5 sm:p-10 transition-all duration-300 hover:shadow-2xl relative group">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D654A]/5 to-transparent rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
      
      <div className="lg:flex lg:items-center lg:gap-x-16 relative">
        <div className="lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Solución Personalizada
          </h3>
          <p className="mt-4 text-base leading-7 text-gray-600">
            ¿Necesitas algo más específico para tu negocio? Podemos crear una solución a medida que se adapte perfectamente a tus necesidades únicas.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2">
            {[
              "Diseño de menú exclusivo",
              "Sistema de pedidos avanzado",
              "Soporte prioritario 24/7",
              "Configuración personalizada"
            ].map((feature, i) => (
              <li key={i} className="flex gap-x-3 items-center group/item">
                <svg className="h-6 w-5 flex-none text-[#0D654A] transition-transform duration-300 group-hover/item:scale-110" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="group-hover/item:text-gray-900 transition-colors">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-col items-center lg:mt-0 lg:w-80 lg:flex-none">
          <p className="text-base font-semibold text-[#0D654A]">Solución completa para tu negocio</p>
          <a 
            href="mailto:soyurielurbina@gmail.com"
            className="mt-6 block w-full rounded-md bg-[#0D654A] px-3 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-[#0D654A]/20 hover:shadow-xl hover:shadow-[#0D654A]/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            Contáctanos para más información
          </a>
          <p className="mt-6 text-xs text-gray-500 text-center">
            Nuestro equipo te contactará para discutir tus necesidades específicas y crear una propuesta personalizada.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
