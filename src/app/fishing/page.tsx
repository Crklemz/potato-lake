import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { FishingPage } from '@/types/database'

async function getFishingData() {
  try {
    const fishingPage = await prisma.fishingPage.findFirst()
    
    if (!fishingPage) {
      // Create default fishing page if none exists
      const defaultFishingPage = await prisma.fishingPage.create({
        data: {
          fishHeading: 'Excellent Fishing Opportunities',
          fishText: 'Potato Lake is renowned for its excellent fishing opportunities. The lake is home to a variety of fish species including walleye, northern pike, bass, and panfish. Whether you\'re an experienced angler or just starting out, you\'ll find plenty of great spots to cast your line.',
          imageUrl: null
        }
      })
      return defaultFishingPage
    }
    
    return fishingPage
  } catch (error) {
    console.error('Error fetching fishing data:', error)
    throw new Error('Failed to load fishing data')
  }
}

function FishingPageContent({ fishingPage }: { fishingPage: FishingPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            Fishing on Potato Lake
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              {fishingPage.fishHeading}
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              {fishingPage.fishText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fish Species</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Walleye</li>
                <li>• Northern Pike</li>
                <li>• Largemouth Bass</li>
                <li>• Smallmouth Bass</li>
                <li>• Bluegill</li>
                <li>• Crappie</li>
                <li>• Perch</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing Regulations</h3>
              <p className="text-neutral-dark mb-4">
                Please be sure to check current Minnesota DNR fishing regulations before your trip.
              </p>
              <a href="/dnr" className="text-accent hover:text-primary font-semibold">
                View DNR Information →
              </a>
            </div>
          </div>

          {fishingPage.imageUrl && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Fishing on Potato Lake</h3>
              <div className="mb-4">
                <div className="w-full h-64 relative rounded-lg">
                  <Image 
                    src={fishingPage.imageUrl} 
                    alt="Fishing on Potato Lake"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Latest Fishing Report</h3>
            <p className="text-neutral-dark leading-relaxed">
              Fishing has been excellent this season! Anglers are reporting good catches of walleye 
              in the early morning and evening hours. Northern pike are active throughout the day, 
              and panfish are biting well in the shallower areas of the lake.
            </p>
          </div>
        </div>
      </div>
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