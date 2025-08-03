import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { ResortsPage } from '@/types/database'

async function getResortsData() {
  try {
    const resortsPage = await prisma.resortsPage.findFirst({
      include: {
        resorts: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    })
    
    if (!resortsPage) {
      // Create default resorts page if none exists
      const defaultResortsPage = await prisma.resortsPage.create({
        data: {
          sectionHeading: 'Resorts on Potato Lake',
          sectionText: 'Potato Lake offers a variety of resorts and accommodations to suit every visitor\'s needs. From cozy cabins to full-service resorts, you\'ll find the perfect place to stay while enjoying all that our beautiful lake has to offer.',
          resorts: {
            create: [
              {
                name: 'Sample Resort',
                address: '123 Lake Road, Potato Lake, MN',
                phone: '(555) 123-4567',
                description: 'A beautiful lakeside resort with modern amenities.',
                websiteUrl: null,
                imageUrl: null
              }
            ]
          }
        },
        include: {
          resorts: {
            orderBy: {
              name: 'asc'
            }
          }
        }
      })
      return defaultResortsPage
    }
    
    return resortsPage
  } catch (error) {
    console.error('Error fetching resorts data:', error)
    throw new Error('Failed to load resorts data')
  }
}

function ResortsPageContent({ resortsPage }: { resortsPage: ResortsPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            {resortsPage.sectionHeading}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Find Your Perfect Getaway
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              {resortsPage.sectionText}
            </p>
          </div>

          {resortsPage.resorts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-dark text-lg">
                No resorts are currently listed. Please check back soon!
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {resortsPage.resorts.map((resort) => (
                <div key={resort.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-accent flex items-center justify-center">
                    {resort.imageUrl ? (
                      <div className="w-full h-full relative">
                        <Image 
                          src={resort.imageUrl} 
                          alt={resort.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-primary font-semibold">Resort Image</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-neutral-dark">{resort.name}</h3>
                    <p className="text-neutral-dark mb-4">{resort.address}</p>
                    <p className="text-neutral-dark mb-4">Phone: {resort.phone}</p>
                    {resort.description && (
                      <p className="text-neutral-dark mb-4 text-sm">{resort.description}</p>
                    )}
                    {resort.websiteUrl && (
                      <a 
                        href={resort.websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary font-semibold"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingResortsPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-dark rounded mb-8"></div>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-accent"></div>
                  <div className="p-6">
                    <div className="h-6 bg-neutral-dark rounded mb-2"></div>
                    <div className="h-4 bg-neutral-dark rounded mb-4"></div>
                    <div className="h-4 bg-neutral-dark rounded mb-4"></div>
                    <div className="h-4 bg-neutral-dark rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ResortsPage() {
  try {
    const resortsPage = await getResortsData()
    
    return (
      <Suspense fallback={<LoadingResortsPage />}>
        <ResortsPageContent resortsPage={resortsPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in ResortsPage:', error)
    notFound()
  }
} 