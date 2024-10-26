"use client";

import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

const Pricing = () => {
  const plan = config.stripe.plans.find(plan => plan.name === "Plan Esencial");

  return (
    <div className="bg-gray-50 py-16" id="precios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Plan adaptado a tus necesidades</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Comienza con nuestra solución para tu negocio
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
    </div>
  );
};

const PlanCard = ({ plan, billingPeriod }) => {
  const isYearly = billingPeriod === "yearly";
  const price = isYearly ? plan.price.yearly : plan.price.monthly;

  // Calcular el ahorro anual
  const yearlySavings = isYearly ? (plan.price.monthly * 12) - plan.price.yearly : 0;
  const yearlySavingsPercentage = isYearly ? Math.round((yearlySavings / (plan.price.monthly * 12)) * 100) : 0;

  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">
          {plan.name} - {isYearly ? "Anual" : "Mensual"}
        </h3>
        <p className="mt-6 text-base leading-7 text-gray-600">
          {plan.description}
        </p>
        <p className="mt-6 flex items-baseline gap-x-2">
          <span className="text-4xl font-bold tracking-tight text-gray-900">${price}</span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
            MXN / {isYearly ? "año" : "mes"}
          </span>
        </p>
        {isYearly && yearlySavings > 0 && (
          <p className="mt-2 text-sm font-semibold text-emerald-600">
            Ahorras ${yearlySavings} MXN al año ({yearlySavingsPercentage}% de descuento)
          </p>
        )}
        <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-emerald-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              {feature.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <ButtonCheckout 
          priceId={plan.priceId[billingPeriod]} 
          className="w-full bg-emerald-700 hover:bg-emerald-800"
        >
          Comenzar {isYearly ? "Anual" : "Mensual"}
        </ButtonCheckout>
      </div>
    </div>
  );
};

const CustomPlanCard = () => {
  return (
    <div className="flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10">
      <div className="lg:flex lg:items-center lg:gap-x-16">
        <div className="lg:flex-auto">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Solución Personalizada
          </h3>
          <p className="mt-4 text-base leading-7 text-gray-600">
            ¿Necesitas algo más específico para tu negocio? Podemos crear una solución a medida que se adapte perfectamente a tus necesidades únicas.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2">
            <li className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-emerald-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Diseño totalmente personalizado
            </li>
            <li className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-emerald-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Funcionalidades a medida
            </li>
            <li className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-emerald-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Soporte prioritario
            </li>
            <li className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-emerald-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Asesoría personalizada
            </li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col items-center lg:mt-0 lg:w-80 lg:flex-none">
          <p className="text-base font-semibold text-gray-600">Precio a medida según tus necesidades</p>
          <a 
            href="mailto:soyurielurbina@gmail.com"
            className="mt-6 block w-full rounded-md bg-emerald-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
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
