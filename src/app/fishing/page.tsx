import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { FishingPage } from '@/types/database'
import FishSpeciesList from '@/components/FishSpeciesList'
import FishingGallery from '@/components/FishingGallery'
import FishingTips from '@/components/FishingTips'

async function getFishingData() {
  try {
    const fishingPage = await prisma.fishingPage.findFirst()
    
    if (!fishingPage) {
      // Create default fishing page if none exists
      const defaultFishingPage = await prisma.fishingPage.create({
        data: {
          fishHeading: 'Excellent Fishing Opportunities',
          fishText: 'Potato Lake is renowned for its excellent fishing opportunities. The lake is home to a variety of fish species including walleye, northern pike, bass, and panfish. Whether you\'re an experienced angler or just starting out, you\'ll find plenty of great spots to cast your line.',
          fishingCtaHeading: 'Stay Connected with the Lake Association',
          fishingCtaText: 'Want the latest fishing updates, lake news, and event info? Join our email list or contact us today.',
          fishingCtaButtonText: 'Join the Mailing List',
          fishingCtaButtonLink: '/contact'
        }
      })
      
      // Return with empty fish species, gallery images, and fishing tips arrays
      return {
        ...defaultFishingPage,
        fishSpecies: [],
        galleryImages: [],
        fishingTips: []
      }
    }
    
    // Fetch fish species separately
    const fishSpecies = await prisma.fishSpecies.findMany({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Fetch gallery images separately
    const galleryImages = await prisma.fishingGalleryImage.findMany({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Fetch fishing tips separately
    const fishingTips = await prisma.fishingTip.findMany({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'asc'
      }
    })
        
    return {
      ...fishingPage,
      fishSpecies,
      galleryImages,
      fishingTips
    }
  } catch (error) {
    console.error('Error fetching fishing data:', error)
    throw new Error('Failed to load fishing data')
  }
}

function FishingPageContent({ fishingPage }: { fishingPage: FishingPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="relative min-h-[33vh] md:min-h-[40vh] w-full">
        {fishingPage.heroImageUrl ? (
          <div className="absolute inset-0">
            <Image 
              src={fishingPage.heroImageUrl} 
              alt="Fishing on Potato Lake"
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
              {fishingPage.heroTitle}
            </h1>
            {fishingPage.heroSubtitle && (
              <p className="text-lg md:text-xl lg:text-2xl mb-6 drop-shadow-lg opacity-90">
                {fishingPage.heroSubtitle}
              </p>
            )}
            {fishingPage.ctaText && fishingPage.ctaLink && (
              <a 
                href={fishingPage.ctaLink}
                className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-colors shadow-lg"
              >
                {fishingPage.ctaText}
              </a>
            )}
            <div className="mt-4">
              <a 
                href="/dnr"
                className="text-white underline hover:text-accent transition-colors"
              >
                Check DNR Info →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Fishing Overview Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 text-center">
            {fishingPage.fishHeading}
          </h2>
          <p className="text-neutral-dark text-center max-w-3xl mx-auto mb-8 leading-relaxed">
            {fishingPage.fishText}
          </p>
        </div>
      </section>

      {/* Fish Species Section */}
      {fishingPage.fishSpecies && fishingPage.fishSpecies.length > 0 ? (
        <section className="py-12 bg-neutral-light">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
              What You Can Catch
            </h2>
            <FishSpeciesList fishSpecies={fishingPage.fishSpecies} />
          </div>
        </section>
      ) : (
        <section className="py-12 bg-neutral-light">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
              What You Can Catch
            </h2>
            <p className="text-center text-neutral-dark">
              No fish species have been added yet. Check back soon!
            </p>
          </div>
        </section>
      )}

      {/* Fishing Info & Updates Section */}
      {(fishingPage.infoSectionHeading || fishingPage.regulationsTextNew || fishingPage.reportTextNew) && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              {fishingPage.infoSectionHeading && (
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                    {fishingPage.infoSectionHeading}
                  </h2>
                  {fishingPage.infoSectionSubheading && (
                    <p className="text-neutral-dark text-lg">
                      {fishingPage.infoSectionSubheading}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-8">
                {/* Fishing Regulations */}
                {(fishingPage.regulationsTextNew || fishingPage.regulationsLinkText) && (
                  <div className="border-b border-neutral-light pb-8">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      {fishingPage.regulationsLabel || 'Fishing Regulations'}
                    </h3>
                    {fishingPage.regulationsTextNew && (
                      <p className="text-neutral-dark mb-4 leading-relaxed">
                        {fishingPage.regulationsTextNew}
                      </p>
                    )}
                    {fishingPage.regulationsLinkText && fishingPage.regulationsLinkUrl && (
                      <a 
                        href={fishingPage.regulationsLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-accent hover:text-primary font-semibold transition-colors underline decoration-2 underline-offset-2 hover:decoration-primary"
                      >
                        {fishingPage.regulationsLinkText}
                      </a>
                    )}
                  </div>
                )}

                {/* Latest Fishing Report */}
                {(fishingPage.reportTextNew || fishingPage.reportLastUpdated) && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      {fishingPage.reportLabel || 'Latest Fishing Report'}
                    </h3>
                    {fishingPage.reportTextNew && (
                      <p className="text-neutral-dark leading-relaxed mb-4">
                        {fishingPage.reportTextNew}
                      </p>
                    )}
                    {fishingPage.reportLastUpdated && (
                      <p className="text-sm text-neutral-dark italic">
                        Last updated on {new Date(fishingPage.reportLastUpdated).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Fishing Photo Gallery */}
      <FishingGallery images={fishingPage.galleryImages || []} />

      {/* Fishing Tips Section */}
      <FishingTips tips={fishingPage.fishingTips || []} />

      {/* Stay Connected CTA Section */}
      {fishingPage.fishingCtaHeading && fishingPage.fishingCtaText && fishingPage.fishingCtaButtonText && fishingPage.fishingCtaButtonLink && (
        <section className="py-16 bg-gradient-to-br from-primary to-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {fishingPage.fishingCtaHeading}
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                {fishingPage.fishingCtaText}
              </p>
              <a 
                href={fishingPage.fishingCtaButtonLink}
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-light transition-colors"
              >
                {fishingPage.fishingCtaButtonText}
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function LoadingFishingPage() {
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

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function FishingPage() {
  try {
    const fishingPage = await getFishingData()
    
    return (
      <Suspense fallback={<LoadingFishingPage />}>
        <FishingPageContent fishingPage={fishingPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in FishingPage:', error)
    notFound()
  }
} 