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

export default function ActionButtons({ buttons, appearance = {} }) {
  const buttonFont = appearance.buttonFont || 'sans-serif';

  return (
    <div className="px-6 py-4 space-y-2">
      {buttons.map((button, index) => (
        <Link 
          key={button.id} 
          href={button.url}
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
