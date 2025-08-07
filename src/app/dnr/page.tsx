import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { DnrPage } from '@/types/database'

async function getDnrData() {
  try {
    const dnrPage = await prisma.dnrPage.findFirst()
    
    if (!dnrPage) {
      // Create default DNR page if none exists
      const defaultDnrPage = await prisma.dnrPage.create({
        data: {
          dnrHeading: 'Minnesota Department of Natural Resources',
          dnrText: 'The Minnesota DNR provides important information about fishing regulations, boating safety, and lake management. Stay informed about the latest rules and regulations to ensure a safe and enjoyable experience on Potato Lake.',
          mapUrl: null,
          dnrStewardshipHeading: 'Wisconsin DNR & Lake Stewardship',
          dnrStewardshipText: 'The Wisconsin Department of Natural Resources works in partnership with local organizations like the Potato Lake Association to protect lake health and encourage responsible use. These efforts include water quality monitoring, shoreline protection, aquatic habitat restoration, and invasive species prevention.',
          dnrStewardshipCtaText: 'Visit Wisconsin Lakes Partnership',
          dnrStewardshipCtaUrl: 'https://www.uwsp.edu/cnr-ap/UWEXLakes/Pages/partnership.aspx'
        }
      })
      return defaultDnrPage
    }
    
    return dnrPage
  } catch (error) {
    console.error('Error fetching DNR data:', error)
    throw new Error('Failed to load DNR data')
  }
}

function DnrPageContent({ dnrPage }: { dnrPage: DnrPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="relative min-h-[33vh] md:min-h-[40vh] w-full">
        {dnrPage.heroImageUrl ? (
          <div className="absolute inset-0">
            <Image 
              src={dnrPage.heroImageUrl} 
              alt="DNR Information"
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
              {dnrPage.dnrHeading}
            </h1>
            {dnrPage.dnrText && (
              <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg opacity-90">
                {dnrPage.dnrText}
              </p>
            )}
            {dnrPage.ctaText && dnrPage.ctaLink && (
              <a 
                href={dnrPage.ctaLink}
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-colors shadow-lg"
              >
                {dnrPage.ctaText}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stewardship Section */}
      {dnrPage.dnrStewardshipHeading && dnrPage.dnrStewardshipText && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {dnrPage.dnrStewardshipHeading}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {dnrPage.dnrStewardshipText}
              </p>
              {dnrPage.dnrStewardshipCtaText && dnrPage.dnrStewardshipCtaUrl && (
                <a 
                  href={dnrPage.dnrStewardshipCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-primary hover:text-accent font-semibold transition-colors underline decoration-2 underline-offset-2 hover:decoration-accent"
                >
                  {dnrPage.dnrStewardshipCtaText}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing Regulations</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Fishing license requirements</li>
                <li>• Size and possession limits</li>
                <li>• Seasonal restrictions</li>
                <li>• Special regulations</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Boating Safety</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Boat registration requirements</li>
                <li>• Safety equipment requirements</li>
                <li>• Speed limits and restrictions</li>
                <li>• Invasive species prevention</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Lake Map</h3>
            {dnrPage.mapUrl ? (
              <div className="mb-4">
                <div className="w-full h-64 relative rounded-lg">
                  <Image 
                    src={dnrPage.mapUrl} 
                    alt="Potato Lake Map"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="h-64 bg-accent flex items-center justify-center rounded-lg">
                <span className="text-primary font-semibold">Interactive Lake Map</span>
              </div>
            )}
            <p className="text-neutral-dark mt-4">
              View detailed information about Potato Lake including depth contours, 
              access points, and important landmarks.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Important Links</h3>
            <div className="space-y-4">
              <a href="https://www.dnr.state.mn.us/" target="_blank" rel="noopener noreferrer" className="block text-accent hover:text-primary font-semibold">
                Minnesota DNR Website →
              </a>
              <a href="https://www.dnr.state.mn.us/fishing/index.html" target="_blank" rel="noopener noreferrer" className="block text-accent hover:text-primary font-semibold">
                Fishing Regulations →
              </a>
              <a href="https://www.dnr.state.mn.us/boating/index.html" target="_blank" rel="noopener noreferrer" className="block text-accent hover:text-primary font-semibold">
                Boating Safety Information →
              </a>
              <a href="https://www.dnr.state.mn.us/invasives/index.html" target="_blank" rel="noopener noreferrer" className="block text-accent hover:text-primary font-semibold">
                Invasive Species Information →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingDnrPage() {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[1, 2].map((i) => (
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

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="h-64 bg-accent rounded-lg mb-4"></div>
              <div className="h-6 bg-neutral-dark rounded"></div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-neutral-dark rounded"></div>
                <div className="h-4 bg-neutral-dark rounded"></div>
                <div className="h-4 bg-neutral-dark rounded"></div>
                <div className="h-4 bg-neutral-dark rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function DnrPage() {
  try {
    const dnrPage = await getDnrData()
    
    return (
      <Suspense fallback={<LoadingDnrPage />}>
        <DnrPageContent dnrPage={dnrPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in DnrPage:', error)
    notFound()
  }
} 