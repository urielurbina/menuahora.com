import { getSEOTags } from "@/libs/seo";

// Agregamos estas configuraciones para forzar la generación dinámica
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchBusinessData(username) {
  // Aseguramos que usemos una URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://menuahora.com';
  const url = new URL(`/api/business/${username}`, baseUrl).toString();
  
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    // Agregamos next: { revalidate: 0 } para forzar revalidación
    next: { revalidate: 0 }
  });
  
  if (!response.ok) {
    console.error(`Error fetching business data: ${response.status} - ${response.statusText}`);
    throw new Error(`Failed to fetch business data: ${response.status}`);
  }
  
  return await response.json();
}

export async function generateMetadata({ params }) {
  try {
    const businessData = await fetchBusinessData(params.username);
    const basicInfo = businessData['basic-info'] || {};
    

    // Forzamos que no se use la imagen por defecto
    const metadata = getSEOTags({
      title: basicInfo.businessName || 'Menú digital',
      description: basicInfo.description || 'Menú digital',
      openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.username}`,
        siteName: basicInfo.businessName || 'MenuAhora',
        title: basicInfo.businessName || 'Menú digital',
        description: basicInfo.description || 'Menú digital',
        images: [
          {
            url: basicInfo.coverPhotoUrl,
            width: 1200,
            height: 630,
            alt: basicInfo.businessName || 'Menú digital',
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: basicInfo.businessName || 'Menú digital',
        description: basicInfo.description || 'Menú digital',
        images: [basicInfo.coverPhotoUrl],
      },
      canonicalUrlRelative: `/${params.username}`,
    });

    // Aseguramos que no se use la imagen por defecto
    metadata.openGraph.images = [{
      url: basicInfo.coverPhotoUrl,
      width: 1200,
      height: 630,
      alt: basicInfo.businessName || 'Menú digital',
      type: 'image/png',
    }];

    return metadata;
    
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    
    // En caso de error, usar una imagen por defecto
    const defaultOgImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/default-og.png`;
    
    return getSEOTags({
      title: 'Menú digital',
      description: 'Menú digital',
      openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${params.username}`,
        siteName: 'MenuAhora',
        title: 'Menú digital',
        description: 'Menú digital',
        images: [
          {
            url: defaultOgImageUrl,
            width: 1200,
            height: 630,
            alt: 'Menú digital',
            type: 'image/png',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Menú digital',
        description: 'Menú digital',
        images: [defaultOgImageUrl],
      },
      canonicalUrlRelative: `/${params.username}`,
    });
  }
}

export default function Layout({ children }) {
  return <>{children}</>;
}
