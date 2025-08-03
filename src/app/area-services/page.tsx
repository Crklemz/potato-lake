import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { AreaServicesPage } from '@/types/database'

async function getAreaServicesData() {
  try {
    const areaServicesPage = await prisma.areaServicesPage.findFirst({
      include: {
        sponsors: {
          orderBy: {
            name: 'asc'
          }
        }
      }
    })
    
    if (!areaServicesPage) {
      // Create default area services page if none exists
      const defaultAreaServicesPage = await prisma.areaServicesPage.create({
        data: {
          heading: 'Area Services & Sponsors',
          description: 'Discover the local businesses and services that support our community. These sponsors help make Potato Lake a wonderful place to live and visit.',
          sponsors: {
            create: [
              {
                name: 'Sample Local Business',
                logoUrl: null,
                link: null
              }
            ]
          }
        },
        include: {
          sponsors: {
            orderBy: {
              name: 'asc'
            }
          }
        }
      })
      return defaultAreaServicesPage
    }
    
    return areaServicesPage
  } catch (error) {
    console.error('Error fetching area services data:', error)
    throw new Error('Failed to load area services data')
  }
}

function AreaServicesPageContent({ areaServicesPage }: { areaServicesPage: AreaServicesPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            {areaServicesPage.heading}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Local Services & Businesses
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              {areaServicesPage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Marine Services</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Boat repair and maintenance</li>
                <li>• Marine supplies and equipment</li>
                <li>• Dock installation and repair</li>
                <li>• Lift sales and service</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Local Amenities</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Grocery stores and convenience shops</li>
                <li>• Restaurants and dining options</li>
                <li>• Gas stations and fuel services</li>
                <li>• Hardware and building supplies</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Professional Services</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Real estate and property management</li>
                <li>• Construction and remodeling</li>
                <li>• Landscaping and lawn care</li>
                <li>• Legal and financial services</li>
              </ul>
            </div>
          </div>

          {areaServicesPage.sponsors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-dark text-lg">
                No sponsors are currently listed. Please check back soon!
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Our Sponsors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {areaServicesPage.sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="text-center">
                    <div className="h-32 bg-accent flex items-center justify-center mb-4 rounded-lg">
                      {sponsor.logoUrl ? (
                        <div className="w-full h-full relative">
                          <Image 
                            src={sponsor.logoUrl} 
                            alt={sponsor.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-primary font-semibold">Logo</span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-neutral-dark mb-2">{sponsor.name}</h4>
                    {sponsor.link && (
                      <a 
                        href={sponsor.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary font-semibold text-sm"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Become a Sponsor</h3>
            <p className="text-neutral-dark leading-relaxed mb-4">
              Interested in supporting the Potato Lake Association and reaching our community? 
              We offer sponsorship opportunities for local businesses and service providers.
            </p>
            <a href="/association" className="text-accent hover:text-primary font-semibold">
              Contact Us About Sponsorship →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingAreaServicesPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-primary rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="h-8 bg-primary rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div className="h-32 bg-accent rounded-lg mb-4"></div>
                    <div className="h-6 bg-neutral-dark rounded mb-2"></div>
                    <div className="h-4 bg-accent rounded w-24 mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded mb-4"></div>
              <div className="h-4 bg-accent rounded w-48"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function AreaServicesPage() {
  try {
    const areaServicesPage = await getAreaServicesData()
    
    return (
      <Suspense fallback={<LoadingAreaServicesPage />}>
        <AreaServicesPageContent areaServicesPage={areaServicesPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in AreaServicesPage:', error)
    notFound()
  }
} 