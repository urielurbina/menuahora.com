"use client";

import { useState } from 'react';
import config from "@/config";
import ButtonCheckout from "./ButtonCheckout";

const Pricing = () => {
  const plans = config.stripe.plans;
  const [billingPeriod, setBillingPeriod] = useState('yearly');

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Planes adaptados a tus necesidades</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Elige el plan que mejor se adapte a tu negocio
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="relative flex rounded-full bg-white p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`${billingPeriod === 'monthly' ? 'bg-indigo-600 text-white' : 'text-gray-500'} rounded-full py-2 px-4 text-sm font-semibold focus:outline-none`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`${billingPeriod === 'yearly' ? 'bg-indigo-600 text-white' : 'text-gray-500'} ml-2 rounded-full py-2 px-4 text-sm font-semibold focus:outline-none`}
            >
              Anual
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-x-8 gap-y-12 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} billingPeriod={billingPeriod} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PlanCard = ({ plan, billingPeriod, index }) => {
  const isEnterprise = plan.name === "Plan a medida";
  const currentBillingPeriod = isEnterprise ? 'yearly' : billingPeriod;

  const displayPrice = currentBillingPeriod === 'yearly' 
    ? (plan.name === "Plan Esencial" ? 165 : plan.name === "Plan Custom" ? 330 : plan.price.yearly)
    : plan.price.monthly;

  const yearlyPrice = currentBillingPeriod === 'yearly'
    ? (plan.name === "Plan Esencial" ? 1980 : plan.name === "Plan Custom" ? 3960 : plan.price.yearly)
    : plan.price.yearly;

  const savings = plan.price.monthly && yearlyPrice ? plan.price.monthly * 12 - yearlyPrice : 0;

  return (
    <div className={`flex flex-col justify-between rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-900/10 sm:p-10 ${plan.isFeatured ? 'lg:z-10 ring-2 ring-indigo-600' : ''} ${plan.isFeatured ? '-mt-2 -mb-2' : ''}`}>
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900">{plan.name}</h3>
        {plan.isFeatured && (
          <p className="mt-4 text-sm font-semibold text-indigo-600">Recomendado</p>
        )}
        <p className="mt-6 text-base leading-7 text-gray-600">
          {plan.description}
        </p>
        <p className="mt-6 flex items-baseline gap-x-2">
          <span className="text-5xl font-bold tracking-tight text-gray-900">
            ${displayPrice}
          </span>
          <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
            MXN / mes
          </span>
        </p>
        {currentBillingPeriod === 'yearly' && !isEnterprise && (
          <p className="mt-1 text-sm text-gray-500">
            Equivalente a un pago de ${yearlyPrice} MXN por año
          </p>
        )}
        {currentBillingPeriod === 'yearly' && !isEnterprise && savings > 0 && (
          <p className="mt-2 text-sm font-semibold text-green-600">
            Ahorras ${savings} MXN al año
          </p>
        )}
        {isEnterprise && (
          <p className="mt-1 text-sm text-gray-500">Precio base, puede variar según requerimientos</p>
        )}
        <ul className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex gap-x-3">
              <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              {feature.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <ButtonCheckout 
          priceId={isEnterprise ? plan.priceId.yearly : plan.priceId[currentBillingPeriod]} 
          className="w-full"
        >
          {isEnterprise ? 'Contactar' : 'Comenzar'}
        </ButtonCheckout>
      </div>
    </div>
  );
};

export default Pricing;
