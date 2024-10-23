import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/mongodb'
import dynamic from 'next/dynamic'
import BusinessInfo from '@/components/BusinessInfo'
import ActionButtons from '@/components/ActionButtons'
import { cache } from 'react'

const getUserData = cache(async (username) => {
  const { db } = await connectToDatabase()
  const businessData = await db.collection('businesses').findOne({ username })
  if (!businessData) {
    notFound()
  }
  return businessData
})

const DynamicProductList = dynamic(() => import('@/components/ProductList'), { ssr: false })
const DynamicCategoryList = dynamic(() => import('@/components/CategoryList'), { ssr: false })

export default async function UserPage({ params }) {
  const { username } = params
  const businessData = await getUserData(username)

  const {
    'basic-info': basicInfo,
    cardInfoSettings,
    categories,
    products,
    buttons,
    appearance = {} // Proporcionar un objeto vacío por defecto si appearance no está definido
  } = businessData

  const primaryColor = appearance.primaryColor || '#FF1C20'; // Color por defecto si no está definido

  return (
    <div className="w-full mx-auto">
      <div className="lg:flex">
        {/* Column 1: Logo and Info */}
        <div style={{backgroundColor: primaryColor}} className="lg:w-1/4 lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:overflow-y-auto">
          {/* Header with background image and logo */}
          <div className="relative">
            <Image
              src={basicInfo.coverPhotoUrl || '/default-cover.jpg'} // Proporcionar una imagen por defecto
              alt="Fondo de negocio"
              width={500}
              height={300}
              layout="responsive"
              objectFit="cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                <Image
                  src={basicInfo.logoUrl || '/default-logo.png'} // Proporcionar un logo por defecto
                  alt="Logotipo"
                  width={128}
                  height={128}
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          <BusinessInfo basicInfo={basicInfo} appearance={appearance} />
          <ActionButtons buttons={buttons} appearance={appearance} />
        </div>

        {/* Columns 2-4: Categories and Products */}
        <div className="lg:w-3/4 lg:ml-[25%]">
          <div className="bg-gray-100">
            {/* Categories */}
            <DynamicCategoryList categories={categories} appearance={appearance} />

            {/* Products */}
            <DynamicProductList 
              products={products} 
              cardInfoSettings={cardInfoSettings}
              appearance={appearance}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const revalidate = 0
