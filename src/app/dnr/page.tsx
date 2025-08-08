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
          dnrStewardshipCtaUrl: 'https://www.uwsp.edu/cnr-ap/UWEXLakes/Pages/partnership.aspx',
          mapHeading: 'Potato Lake Map',
          mapCaption: 'View access points, water depth, and aquatic vegetation zones.',
          mapEmbedUrl: null,
          mapExternalLinkText: 'View Full Bathymetric Map',
          mapExternalLinkUrl: null,
          monitoringHeading: 'Get Involved in Lake Monitoring',
          monitoringText: 'Support the health of Potato Lake by participating in citizen science programs coordinated through the Wisconsin DNR. Volunteers help monitor water clarity, track invasive species, and gather valuable seasonal data like ice-out dates. No experience needed — just a love for the lake!',
          monitoringPrograms: ['Water clarity readings', 'Aquatic plant surveys', 'Ice-out tracking'],
          monitoringCtaText: 'Sign Up to Volunteer',
          monitoringCtaUrl: null,
          monitoringImageUrl: null
        }
      })
      // Helper function to safely convert JSON to string array
      const safeJsonToStringArray = (value: unknown): string[] => {
        if (!value) return []
        if (Array.isArray(value)) {
          return value.filter(item => typeof item === 'string').map(item => item as string)
        }
        return []
      }

      const processedDefaultDnrPage = {
        ...defaultDnrPage,
        dnrFishingCardItems: safeJsonToStringArray(defaultDnrPage.dnrFishingCardItems),
        dnrBoatingCardItems: safeJsonToStringArray(defaultDnrPage.dnrBoatingCardItems),
        invasiveTips: safeJsonToStringArray(defaultDnrPage.invasiveTips),
        monitoringPrograms: safeJsonToStringArray(defaultDnrPage.monitoringPrograms)
      }

      return processedDefaultDnrPage as DnrPage
    }
    
    // Helper function to safely convert JSON to string array
    const safeJsonToStringArray = (value: unknown): string[] => {
      if (!value) return []
      if (Array.isArray(value)) {
        return value.filter(item => typeof item === 'string').map(item => item as string)
      }
      return []
    }

    const processedDnrPage = {
      ...dnrPage,
      dnrFishingCardItems: safeJsonToStringArray(dnrPage.dnrFishingCardItems),
      dnrBoatingCardItems: safeJsonToStringArray(dnrPage.dnrBoatingCardItems),
      invasiveTips: safeJsonToStringArray(dnrPage.invasiveTips),
      monitoringPrograms: safeJsonToStringArray(dnrPage.monitoringPrograms)
    }

    return processedDnrPage as DnrPage
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

      {/* Cards Section */}
      <section className="py-12 bg-neutral-light">
        <div className="max-w-5xl mx-auto px-4">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {dnrPage.regulationsHeading || 'Fishing & Boating Regulations'}
            </h2>
            <p className="text-muted-foreground text-base mt-2">
              {dnrPage.regulationsSubheading || 'Stay safe and informed with key rules for enjoying Potato Lake. These summaries highlight important DNR guidelines for fishing and boating.'}
            </p>
          </div>
          
                      <div className="flex flex-col md:flex-row gap-4">
              {/* Fishing Regulations Card */}
              <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {dnrPage.dnrFishingCardHeading || 'Fishing Regulations'}
                </h3>
                {dnrPage.dnrFishingCardItems && Array.isArray(dnrPage.dnrFishingCardItems) && (
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 mb-4">
                    {dnrPage.dnrFishingCardItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {dnrPage.dnrFishingCardCtaText && dnrPage.dnrFishingCardCtaUrl && (
                  <a 
                    href={dnrPage.dnrFishingCardCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {dnrPage.dnrFishingCardCtaText}
                  </a>
                )}
              </div>

              {/* Boating Safety Card */}
              <div className="flex-1 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {dnrPage.dnrBoatingCardHeading || 'Boating Safety'}
                </h3>
                {dnrPage.dnrBoatingCardItems && Array.isArray(dnrPage.dnrBoatingCardItems) && (
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 mb-4">
                    {dnrPage.dnrBoatingCardItems.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
                {dnrPage.dnrBoatingCardCtaText && dnrPage.dnrBoatingCardCtaUrl && (
                  <a 
                    href={dnrPage.dnrBoatingCardCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    {dnrPage.dnrBoatingCardCtaText}
                  </a>
                )}
              </div>
            </div>
        </div>
      </section>

      {/* Lake Map Section */}
      {dnrPage.mapHeading && (
        <section className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {dnrPage.mapHeading}
              </h2>
              {dnrPage.mapCaption && (
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {dnrPage.mapCaption}
                </p>
              )}
              
              {dnrPage.mapEmbedUrl ? (
                <div className="w-full aspect-video rounded-md overflow-hidden shadow-lg">
                  <iframe
                    src={dnrPage.mapEmbedUrl}
                    className="w-full h-full border-0"
                    title="Potato Lake Interactive Map"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-neutral-light rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground text-lg font-semibold">
                      Interactive Lake Map
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Map embed URL will be displayed here
                    </p>
                  </div>
                </div>
              )}
              
              {dnrPage.mapExternalLinkText && dnrPage.mapExternalLinkUrl && (
                <div className="pt-4">
                  <a
                    href={dnrPage.mapExternalLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors shadow-md"
                  >
                    {dnrPage.mapExternalLinkText}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Invasive Species Section */}
      {dnrPage.invasiveHeading && (
        <section className="bg-neutral-light py-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                  <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.17L19.83 19H4.17L12 5.17zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                  </svg>
                  {dnrPage.invasiveHeading}
                </h2>
                {dnrPage.invasiveBody && (
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    {dnrPage.invasiveBody}
                  </p>
                )}
              </div>

              {dnrPage.invasiveTips && Array.isArray(dnrPage.invasiveTips) && dnrPage.invasiveTips.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Prevention Tips</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dnrPage.invasiveTips.map((tip, index) => (
                      <li key={index} className="text-base">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {dnrPage.reportSightingUrl && (
                  <a
                    href={dnrPage.reportSightingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors shadow-md"
                  >
                    Report a Sighting
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                {dnrPage.invasiveInfoUrl && (
                  <a
                    href={dnrPage.invasiveInfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary border-2 border-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors shadow-md"
                  >
                    More on Invasive Species
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Monitoring Section */}
      {dnrPage.monitoringHeading && (
        <section className="bg-white py-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {dnrPage.monitoringHeading}
                </h2>
                {dnrPage.monitoringText && (
                  <p className="text-lg text-muted-foreground">
                    {dnrPage.monitoringText}
                  </p>
                )}
                
                {dnrPage.monitoringPrograms && Array.isArray(dnrPage.monitoringPrograms) && dnrPage.monitoringPrograms.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {dnrPage.monitoringPrograms.map((program, index) => (
                      <li key={index} className="text-base">{program}</li>
                    ))}
                  </ul>
                )}
                
                {dnrPage.monitoringCtaText && dnrPage.monitoringCtaUrl && (
                  <a
                    href={dnrPage.monitoringCtaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-accent hover:text-primary transition-colors shadow-md"
                  >
                    {dnrPage.monitoringCtaText}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Right Column - Image or Icon */}
              <div className="flex justify-center">
                {dnrPage.monitoringImageUrl ? (
                  <Image
                    src={dnrPage.monitoringImageUrl}
                    alt="Lake Monitoring"
                    width={400}
                    height={300}
                    className="rounded-md w-full h-auto max-w-md"
                  />
                ) : (
                  <div className="w-full max-w-md h-64 bg-white rounded-md flex items-center justify-center shadow-md">
                    <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">

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