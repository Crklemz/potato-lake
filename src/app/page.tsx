'use client'

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import type { HomePage } from '@/types/database'

function HomePageContent() {
  const [homePage, setHomePage] = useState<HomePage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/home-page')
        if (!response.ok) {
          throw new Error('Failed to fetch home page data')
        }
        const data = await response.json()
        setHomePage(data)
      } catch (error) {
        console.error('Error fetching home page data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-16 bg-white/20 rounded mb-6"></div>
              <div className="h-8 bg-white/20 rounded mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-white/20 rounded w-32"></div>
                <div className="h-12 bg-white/20 rounded w-32"></div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-neutral-light rounded mb-6"></div>
                <div className="h-6 bg-neutral-light rounded mb-4"></div>
                <div className="h-6 bg-neutral-light rounded mb-4"></div>
                <div className="h-6 bg-neutral-light rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!homePage) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Potato Lake
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-light">
              Content loading...
            </p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20 relative">
        {homePage.heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={homePage.heroImageUrl} 
              alt="Potato Lake"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {homePage.heroTitle}
          </h1>
          {homePage.heroSubtitle && (
            <p className="text-xl md:text-2xl mb-8 text-neutral-light">
              {homePage.heroSubtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/resorts" className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-neutral-light transition-colors">
              Explore Resorts
            </a>
            <a href="/fishing" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Fishing Info
            </a>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-neutral-dark">
              {homePage.introHeading}
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed mb-8">
              {homePage.introText}
            </p>
            {homePage.subHeading && (
              <h3 className="text-2xl font-semibold mb-8 text-primary">
                {homePage.subHeading}
              </h3>
            )}
            
            {/* Image Grid */}
            {homePage.carouselImages && homePage.carouselImages.length > 0 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {homePage.carouselImages.map((image) => (
                    <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg bg-white">
                      <div className="aspect-square relative">
                        <Image 
                          src={image.url} 
                          alt={image.altText || 'Potato Lake'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {image.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Debug: {homePage.carouselImages.length} images loaded in grid
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">
            Explore Our Website
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resorts</h3>
              <p className="text-neutral-dark mb-4">
                Find the perfect place to stay during your visit to Potato Lake.
              </p>
              <a href="/resorts" className="text-accent hover:text-primary font-semibold">
                View Resorts →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing</h3>
              <p className="text-neutral-dark mb-4">
                Get the latest fishing reports and information about the lake.
              </p>
              <a href="/fishing" className="text-accent hover:text-primary font-semibold">
                Fishing Info →
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">News & Events</h3>
              <p className="text-neutral-dark mb-4">
                Stay updated with the latest news and upcoming events.
              </p>
              <a href="/news" className="text-accent hover:text-primary font-semibold">
                View Events →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-16 bg-white/20 rounded mb-6"></div>
              <div className="h-8 bg-white/20 rounded mb-8"></div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="h-12 bg-white/20 rounded w-32"></div>
                <div className="h-12 bg-white/20 rounded w-32"></div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-8 bg-neutral-light rounded mb-6"></div>
                <div className="h-6 bg-neutral-light rounded mb-4"></div>
                <div className="h-6 bg-neutral-light rounded mb-4"></div>
                <div className="h-6 bg-neutral-light rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}
