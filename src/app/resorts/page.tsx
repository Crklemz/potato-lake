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
            order: 'asc'
          }
        }
      }
    })
    
    if (!resortsPage) {
      // Create default resorts page if none exists
      const defaultResortsPage = await prisma.resortsPage.create({
        data: {
          heroTitle: 'Resorts & Lodging',
          heroSubtitle: 'Find your perfect getaway on Potato Lake',
          heroImageUrl: null,
          ctaText: 'Book Your Stay',
          ctaLink: '/contact',
          introHeading: 'Welcome to Our Resorts',
          introText: 'Discover the perfect accommodations for your Potato Lake getaway. Our resorts offer comfortable lodging, beautiful lake views, and easy access to all the activities that make Potato Lake special.',
          resorts: {
            create: [
              {
                name: 'Sample Resort',
                address: '123 Lake Road, Potato Lake, MN',
                phone: '(555) 123-4567',
                description: 'A beautiful lakeside resort with modern amenities.',
                websiteUrl: null,
                imageUrl: null,
                order: 0
              }
            ]
          }
        },
        include: {
          resorts: {
            orderBy: {
              order: 'asc'
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
      {/* Hero Section */}
      <section className="relative min-h-[33vh] md:min-h-[40vh] w-full">
        {resortsPage.heroImageUrl ? (
          <div className="absolute inset-0">
            <Image 
              src={resortsPage.heroImageUrl} 
              alt="Resorts on Potato Lake"
              fill
              className="object-cover"
              priority
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent"></div>
        )}
        
        {/* Hero content */}
        <div className="relative z-10 flex items-center justify-center min-h-[33vh] md:min-h-[40vh] px-4">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              {resortsPage.heroTitle}
            </h1>
            {resortsPage.heroSubtitle && (
              <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg opacity-90">
                {resortsPage.heroSubtitle}
              </p>
            )}
            {resortsPage.ctaText && resortsPage.ctaLink && (
              <a 
                href={resortsPage.ctaLink}
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-colors shadow-lg"
              >
                {resortsPage.ctaText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              {resortsPage.introHeading}
            </h2>
            <p className="text-neutral-dark leading-relaxed max-w-3xl mx-auto">
              {resortsPage.introText}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

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
      {/* Intro Section Loading */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-primary rounded mb-4 mx-auto w-64"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2 max-w-2xl mx-auto"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2 max-w-2xl mx-auto"></div>
              <div className="h-6 bg-neutral-dark rounded max-w-xl mx-auto"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">

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