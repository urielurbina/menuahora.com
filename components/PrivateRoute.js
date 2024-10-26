'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/LoadingScreen'

export default function PrivateRoute({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Espera hasta que se cargue la sesión

    if (!session) {
      router.push('/auth/signin')
    } else {
      // Verificar el acceso de Stripe
      fetch('/api/check-stripe-access')
        .then(res => res.json())
        .then(data => {
          if (!data.hasAccess) {
            router.push('/pantallaplanes') // Redirigir a la página de precios si no tiene acceso
          } else {
            setIsLoading(false)
          }
        })
        .catch(error => {
          console.error('Error checking Stripe access:', error)
          router.push('/auth/signin')
        })
    }
  }, [session, status, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  return children
}
