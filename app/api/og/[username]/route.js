import { ImageResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'

export const runtime = 'edge'

export async function GET(request, { params }) {
  const username = params.username

  try {
    // Conectar a la base de datos
    const { db } = await connectToDatabase()

    // Buscar los datos del negocio en MongoDB
    const businessData = await db.collection('businesses').findOne({ username })

    if (!businessData) {
      throw new Error('Business data not found')
    }

    const {
      'basic-info': basicInfo = {},
      appearance = {}
    } = businessData

    // Crear la imagen personalizada
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appearance.primaryColor || '#FF1C20',
            fontFamily: 'sans-serif',
          }}
        >
          <img
            src={basicInfo.logoUrl || 'https://menuahora.com/default-logo.png'}
            alt="Business Logo"
            width={200}
            height={200}
            style={{ borderRadius: '50%', marginBottom: '20px' }}
          />
          <div style={{ 
            color: 'white', 
            fontSize: '48px', 
            fontWeight: 'bold',
            textAlign: 'center', 
            padding: '0 20px',
            marginBottom: '10px'
          }}>
            {basicInfo.businessName || username}
          </div>
          {basicInfo.description && (
            <div style={{ 
              color: 'white', 
              fontSize: '24px', 
              marginTop: '10px', 
              textAlign: 'center',
              padding: '0 40px',
              maxWidth: '80%'
            }}>
              {basicInfo.description}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e) {
    console.error(`Error generating OpenGraph image: ${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
