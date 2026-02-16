import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const navigation = {
  main: [
    { name: 'Beneficios', href: '/#beneficios' },
    { name: 'Cómo funciona', href: '/#como-funciona' },
    { name: 'Precios', href: '/#precios' },
    { name: 'FAQ', href: '/#faq' },
  ],
  legal: [
    { name: 'Términos de Servicio', href: '/tos' },
    { name: 'Política de Privacidad', href: '/privacy-policy' },
  ],
  social: [
    {
      name: 'WhatsApp',
      href: 'https://api.whatsapp.com/send?phone=526143348253&text=Hola,%20tengo%20una%20pregunta%20sobre%20Repisa',
      icon: FaWhatsapp
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/repisa.co',
      icon: FaInstagram
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/repisa.co',
      icon: FaFacebook
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white via-gray-50 to-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo y descripción */}
          <div className="space-y-8">
            <Link href="/#" className="flex items-center">
              <Image
                alt="Logo Repisa"
                src="/images/logotipo_repisa_co_negro.png"
                className="h-6 w-auto"
                width={200}
                height={50}
              />
            </Link>
            <p className="text-sm leading-6 text-gray-600 max-w-md">
              {config.appDescription}
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-[#0D654A] transition-colors duration-200"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces de navegación */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900">Navegación</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-[#0D654A] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 text-gray-900">Legal</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm leading-6 text-gray-600 hover:text-[#0D654A] transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} {config.appName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
