import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// Agregamos estas configuraciones para forzar la generación dinámica
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchBusinessData(username) {
  // Aseguramos que usemos una URL absoluta
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://repisa.co';
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

// Map business category to schema.org type
function getSchemaType(businessCategory) {
  const categoryMap = {
    'Restaurante': 'Restaurant',
    'Cafetería': 'CafeOrCoffeeShop',
    'Panadería': 'Bakery',
    'Comida rápida': 'FastFoodRestaurant',
    'Tacos y antojitos': 'Restaurant',
    'Pizzería': 'Restaurant',
    'Sushi': 'Restaurant',
    'Postres y repostería': 'Bakery',
    'Bebidas': 'BarOrPub',
    'Tienda de abarrotes': 'GroceryStore',
    'Bar': 'BarOrPub',
    'Mariscos': 'Restaurant',
    'Comida saludable': 'Restaurant',
    'Food truck': 'Restaurant',
  };
  return categoryMap[businessCategory] || 'LocalBusiness';
}

// Generate structured data for the business
function generateStructuredData(businessData, username) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://repisa.co';
  const basicInfo = businessData['basic-info'] || {};
  const products = businessData.products || [];
  const categories = businessData.categories || [];
  const businessCategory = businessData.businessCategory || '';
  const schemaType = getSchemaType(businessCategory);

  // Build menu items from products
  const menuItems = products.slice(0, 50).map(product => ({
    "@type": "MenuItem",
    "name": product.nombre,
    "description": product.descripcion || undefined,
    "offers": {
      "@type": "Offer",
      "price": product.precioPromocion > 0 ? product.precioPromocion : product.precio,
      "priceCurrency": "MXN"
    },
    "image": product.imagen || undefined
  })).filter(item => item.name);

  // Build menu sections from categories
  const menuSections = categories.map(category => ({
    "@type": "MenuSection",
    "name": category,
    "hasMenuItem": products
      .filter(p => p.categorias?.includes(category))
      .slice(0, 20)
      .map(product => ({
        "@type": "MenuItem",
        "name": product.nombre,
        "description": product.descripcion || undefined,
        "offers": {
          "@type": "Offer",
          "price": product.precioPromocion > 0 ? product.precioPromocion : product.precio,
          "priceCurrency": "MXN"
        }
      }))
  })).filter(section => section.hasMenuItem.length > 0);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": basicInfo.businessName || username,
    "description": basicInfo.description || `Catálogo digital de ${basicInfo.businessName || username}`,
    "url": `${baseUrl}/${username}`,
    "image": basicInfo.coverPhotoUrl || basicInfo.logoUrl,
    "logo": basicInfo.logoUrl,
    "priceRange": "$$",
  };

  // Add cuisine type for restaurants
  if (schemaType === 'Restaurant' || schemaType === 'FastFoodRestaurant') {
    structuredData.servesCuisine = businessCategory || "Comida mexicana";
    structuredData.acceptsReservations = false;
  }

  // Add menu/catalog
  structuredData.hasMenu = {
    "@type": "Menu",
    "name": `Catálogo de ${basicInfo.businessName || username}`,
    "description": basicInfo.description,
    "hasMenuSection": menuSections.length > 0 ? menuSections : undefined,
    "hasMenuItem": menuSections.length === 0 ? menuItems : undefined
  };

  // Add contact info if available
  if (basicInfo.contact?.whatsappNumber) {
    structuredData.telephone = basicInfo.contact.whatsappNumber;
    structuredData.contactPoint = {
      "@type": "ContactPoint",
      "telephone": basicInfo.contact.whatsappNumber,
      "contactType": "sales"
    };
  }

  // Add opening hours if available
  if (basicInfo.schedule && Object.keys(basicInfo.schedule).length > 0) {
    const daysMap = {
      monday: "Mo", tuesday: "Tu", wednesday: "We",
      thursday: "Th", friday: "Fr", saturday: "Sa", sunday: "Su"
    };

    const openingHours = [];
    Object.entries(basicInfo.schedule).forEach(([day, hours]) => {
      if (hours?.isOpen && hours.openTime && hours.closeTime) {
        openingHours.push(`${daysMap[day]} ${hours.openTime}-${hours.closeTime}`);
      }
    });

    if (openingHours.length > 0) {
      structuredData.openingHours = openingHours;
    }
  }

  return structuredData;
}

export async function generateMetadata({ params }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://repisa.co';

  try {
    const businessData = await fetchBusinessData(params.username);
    const basicInfo = businessData['basic-info'] || {};
    const categories = businessData.categories || [];
    const productCount = businessData.products?.length || 0;

    const businessName = basicInfo.businessName || params.username;
    const businessCategory = businessData.businessCategory || '';
    const customKeywords = businessData.seoKeywords || [];

    // Build a rich description for SEO
    const baseDescription = basicInfo.description || `Catálogo digital de ${businessName}`;
    const richDescription = productCount > 0
      ? `${baseDescription}. ${productCount} productos disponibles${categories.length > 0 ? ` en ${categories.slice(0, 3).join(', ')}` : ''}. Pide por WhatsApp.`
      : baseDescription;

    // Build keywords from business data + custom keywords
    const keywords = [
      businessName,
      businessCategory,
      'catálogo digital',
      'pedir por whatsapp',
      'pedidos online',
      ...categories.slice(0, 5),
      ...customKeywords,
    ].filter(Boolean);

    // Determine OG type based on business category
    const isRestaurantType = ['Restaurante', 'Cafetería', 'Panadería', 'Comida rápida', 'Tacos y antojitos', 'Pizzería', 'Sushi', 'Postres y repostería', 'Bar', 'Mariscos', 'Comida saludable', 'Food truck'].includes(businessCategory);
    const ogType = isRestaurantType ? 'restaurant' : 'website';

    const metadata = getSEOTags({
      title: `${businessName} | ${businessCategory || 'Catálogo Digital'}`,
      description: richDescription.slice(0, 160),
      keywords,
      openGraph: {
        type: ogType,
        locale: 'es_MX',
        url: `${baseUrl}/${params.username}`,
        siteName: businessName,
        title: `${businessName} - ${businessCategory || 'Catálogo y Pedidos'}`,
        description: richDescription.slice(0, 160),
        images: [
          {
            url: basicInfo.coverPhotoUrl || basicInfo.logoUrl || `${baseUrl}/opengraph-image.jpg`,
            width: 1200,
            height: 630,
            alt: `${businessName} - ${businessCategory || 'Catálogo'}`,
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${businessName} | ${businessCategory || 'Catálogo Digital'}`,
        description: richDescription.slice(0, 160),
        images: [basicInfo.coverPhotoUrl || basicInfo.logoUrl || `${baseUrl}/twitter-image.jpg`],
      },
      canonicalUrlRelative: `/${params.username}`,
    });

    // Override OG images to ensure business image is used
    if (basicInfo.coverPhotoUrl || basicInfo.logoUrl) {
      metadata.openGraph.images = [{
        url: basicInfo.coverPhotoUrl || basicInfo.logoUrl,
        width: 1200,
        height: 630,
        alt: `${businessName} - ${businessCategory || 'Catálogo'}`,
      }];
    }

    return metadata;

  } catch (error) {
    console.error('Error in generateMetadata:', error);

    return getSEOTags({
      title: 'Catálogo Digital | Repisa',
      description: 'Descubre el catálogo digital y realiza tu pedido por WhatsApp.',
      openGraph: {
        type: 'website',
        locale: 'es_MX',
        url: `${baseUrl}/${params.username}`,
        siteName: 'Repisa',
        title: 'Catálogo Digital',
        description: 'Descubre el catálogo digital y realiza tu pedido por WhatsApp.',
        images: [
          {
            url: `${baseUrl}/opengraph-image.jpg`,
            width: 1200,
            height: 630,
            alt: 'Catálogo digital',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Catálogo Digital | Repisa',
        description: 'Descubre el catálogo digital y realiza tu pedido por WhatsApp.',
        images: [`${baseUrl}/twitter-image.jpg`],
      },
      canonicalUrlRelative: `/${params.username}`,
    });
  }
}

export default async function Layout({ children, params }) {
  let structuredData = null;

  try {
    const businessData = await fetchBusinessData(params.username);
    structuredData = generateStructuredData(businessData, params.username);
  } catch (error) {
    console.error('Error generating structured data:', error);
  }

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {children}
    </>
  );
}
