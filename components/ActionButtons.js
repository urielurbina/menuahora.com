import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWhatsapp, 
  faFacebook, 
  faInstagram, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons'
import { 
  faMapMarkerAlt, 
  faEnvelope, 
  faPhone,
  faGlobe
} from '@fortawesome/free-solid-svg-icons'

const iconMap = {
  whatsapp: faWhatsapp,
  facebook: faFacebook,
  instagram: faInstagram,
  twitter: faTwitter,
  'map-marker-alt': faMapMarkerAlt,
  envelope: faEnvelope,
  phone: faPhone,
  globe: faGlobe
}

const processUrl = (url) => {
  // Verificar si es un número de teléfono
  if (/^\d+$/.test(url)) {
    return `tel:${url}`;
  }
  
  // Verificar si la URL ya tiene un protocolo
  if (!/^https?:\/\//i.test(url)) {
    // Agregar "https://www." si no está presente
    if (!/^www\./i.test(url)) {
      return `https://www.${url}`;
    } else {
      return `https://${url}`;
    }
  }
  
  return url;
}

export default function ActionButtons({ buttons, appearance = {} }) {
  const buttonFont = appearance.buttonFont || 'sans-serif';

  // Filtrar solo los botones activos
  const activeButtons = buttons.filter(button => button.isActive !== false);

  return (
    <div className="px-6 pt-4 pb-8 space-y-2">
      {activeButtons.map((button, index) => (
        <Link 
          key={button.id} 
          href={processUrl(button.url)}
          className={`w-full h-12 text-lg rounded-md flex items-center justify-center ${
            index === 0
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-white text-black border border-black hover:bg-gray-100'
          }`}
          style={{ fontFamily: buttonFont }}
        >
          {button.icon && iconMap[button.icon] && (
            <FontAwesomeIcon icon={iconMap[button.icon]} className="mr-2" />
          )}
          {button.title}
        </Link>
      ))}
    </div>
  )
}
