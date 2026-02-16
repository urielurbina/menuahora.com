import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';
export const contentType = 'image/png';
export const size = {
  width: 1200,
  height: 630,
};

async function fetchBusinessData(username) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://repisa.co';
  const url = new URL(`/api/business/${username}`, baseUrl).toString();
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch business data: ${response.status}`);
  }
  
  return await response.json();
}

export default async function Image({ params }) {
  try {
    const businessData = await fetchBusinessData(params.username);
    const basicInfo = businessData['basic-info'] || {};
    
    if (basicInfo.coverPhotoUrl) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': basicInfo.coverPhotoUrl
        }
      });
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#000',
                marginBottom: '20px',
              }}
            >
              {basicInfo.businessName || 'Repisa'}
            </h1>
            <p
              style={{
                fontSize: '30px',
                color: '#666',
              }}
            >
              {basicInfo.description || 'Menú Digital'}
            </p>
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating OpenGraph image:', error);
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
          }}
        >
          <h1
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            Repisa
          </h1>
        </div>
      ),
      {
        ...size,
      }
    );
  }
} 