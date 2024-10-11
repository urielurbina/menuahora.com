// A useful component when your product is challenging the status quo.
// Highlight the current pain points (left) and how your product is solving them (right)
// Try to match the lines from left to right, so the user can easily compare the two columns
const WithWithout = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Comparison</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Tired of managing Stripe invoices?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            See how ZenVoice simplifies your invoice management process and saves you time and money.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            <div className="flex flex-col rounded-2xl bg-red-50 p-8">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                Stripe invoices without ZenVoice
              </dt>
              <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <ul className="flex-auto space-y-4">
                  {[
                    "Manually create invoices",
                    "Or pay up to $2 per invoice",
                    "Waste hours in customer support",
                    "Can't update details once sent (VAT, Tax ID)",
                    "Can't make invoices for previous purchases",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-5 flex-none text-red-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                      <span className="ml-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="flex flex-col rounded-2xl bg-green-50 p-8">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                Stripe invoices + ZenVoice
              </dt>
              <dd className="mt-6 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <ul className="flex-auto space-y-4">
                  {[
                    "Self-serve invoices",
                    "One-time payment for unlimited invoices",
                    "No more customer support",
                    "Editable invoices to stay compliant",
                    "Invoices for any payment, even past ones",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-6 w-5 flex-none text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default WithWithout;
