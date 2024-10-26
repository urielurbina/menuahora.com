import { getSEOTags } from "@/libs/seo";

async function fetchBusinessData(username) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/${username}`)
  if (!response.ok) {
    throw new Error('Failed to fetch business data')
  }
  return response.json()
}

export async function generateMetadata({ params }) {
  console.log("inside generate metadata for layout of usernames")
  try {
    const businessData = await fetchBusinessData(params.username)
    const basicInfo = businessData['basic-info'] || {}

    return getSEOTags({
      title: basicInfo.businessName || params.username,
      description: basicInfo.description || 'Menú digital',
      openGraph: {
        title: basicInfo.businessName || params.username,
        description: basicInfo.description || 'Menú digital',
        images: [
          {
            url: basicInfo.logoUrl || '/default-logo.png',
            width: 800,
            height: 600,
            alt: basicInfo.businessName || params.username,
          },
        ],
      },
      canonicalUrlRelative: `/${params.username}`,
    })
  } catch (error) {
    console.error('Error fetching business data for SEO:', error)
    return getSEOTags({
      title: params.username,
      description: 'Menú digital',
      canonicalUrlRelative: `/${params.username}`,
    })
  }
}

export default function Layout({ children }) {
  return <>{children}</>
}
