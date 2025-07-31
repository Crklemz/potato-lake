import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { HomePage } from '@/types/database'

async function getHomePageData() {
  try {
    const homePage = await prisma.homePage.findFirst()
    
    if (!homePage) {
      // Create default home page if none exists
      const defaultHomePage = await prisma.homePage.create({
        data: {
          heroTitle: 'Welcome to Potato Lake',
          heroSubtitle: 'A beautiful destination for fishing and recreation',
          heroImageUrl: null,
          introHeading: 'About Potato Lake',
          introText: 'Potato Lake is a premier fishing and recreational destination located in northern Minnesota. Our association is dedicated to preserving the lake\'s natural beauty and promoting responsible use of this precious resource.'
        }
      })
      return defaultHomePage
    }
    
    return homePage
  } catch (error) {
    console.error('Error fetching home page data:', error)
    throw new Error('Failed to load home page data')
  }
}

function HomePageContent({ homePage }: { homePage: HomePage }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        {homePage.heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={homePage.heroImageUrl} 
              alt="Potato Lake"
              className="w-full h-full object-cover opacity-20"
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
            <p className="text-lg text-neutral-dark leading-relaxed">
              {homePage.introText}
            </p>
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

function LoadingHomePage() {
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

export default async function HomePage() {
  try {
    const homePage = await getHomePageData()
    
    return (
      <Suspense fallback={<LoadingHomePage />}>
        <HomePageContent homePage={homePage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in HomePage:', error)
    notFound()
  }
}
