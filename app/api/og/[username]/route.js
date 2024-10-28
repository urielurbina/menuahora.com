import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request, { params }) {
  const { username } = params;

  try {
    if (!username) {
      throw new Error('Username is required');
    }

    // Obtener los datos del negocio a través de la API existente
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/business/${username}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const businessData = await response.json();

    if (!businessData || !businessData['basic-info']) {
      throw new Error('Invalid business data format');
    }

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
            backgroundColor: businessData.appearance?.primaryColor || '#FF1C20',
            fontFamily: 'sans-serif',
          }}
        >
          <img
            src={businessData['basic-info']?.logoUrl || 'https://menuahora.com/default-logo.png'}
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
            {businessData['basic-info']?.businessName || username}
          </div>
          {businessData['basic-info']?.description && (
            <div style={{ 
              color: 'white', 
              fontSize: '24px', 
              marginTop: '10px', 
              textAlign: 'center',
              padding: '0 40px',
              maxWidth: '80%'
            }}>
              {businessData['basic-info'].description}
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
