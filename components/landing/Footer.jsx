import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/">
              <Image
                src="/images/logotipo_repisa_co_negro.png"
                alt="Repisa"
                width={80}
                height={20}
                className="h-5 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-neutral-500 max-w-xs">
              Tu catalogo digital con pedidos por WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Producto</p>
            <ul className="space-y-3">
              <li><a href="#producto" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Caracteristicas</a></li>
              <li><a href="#precios" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Precios</a></li>
              <li><a href="#faq" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Legal</p>
            <ul className="space-y-3">
              <li><Link href="/privacy-policy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Privacidad</Link></li>
              <li><Link href="/tos" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Terminos</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs text-neutral-400 uppercase tracking-wide mb-4">Contacto</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://api.whatsapp.com/send?phone=526143348253"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:uriel@repisa.co" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} Repisa
          </p>
        </div>
      </div>
    </footer>
  )
}
