'use client'

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import type { HomePage, Event, CommunityStory } from '@/types/database'

function HomePageContent() {
  const [homePage, setHomePage] = useState<HomePage | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [recentStories, setRecentStories] = useState<CommunityStory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResponse, eventsResponse, storiesResponse] = await Promise.all([
          fetch('/api/home-page'),
          fetch('/api/upcoming-events'),
          fetch('/api/community-stories?limit=3')
        ])
        
        if (!homeResponse.ok) {
          throw new Error('Failed to fetch home page data')
        }
        
        const homeData = await homeResponse.json()
        setHomePage(homeData)
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json()
          setUpcomingEvents(eventsData)
        }
        
        if (storiesResponse.ok) {
          const storiesData = await storiesResponse.json()
          setRecentStories(storiesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="bg-gradient-to-br from-primary via-accent to-sand-accent text-white py-32 md:py-40 lg:py-48 relative overflow-hidden">
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
        <section className="bg-gradient-to-br from-primary via-accent to-sand-accent text-white py-20">
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
      <section className="bg-gradient-to-br from-primary via-accent to-sand-accent text-white py-32 md:py-40 lg:py-48 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        {homePage.heroImageUrl && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={homePage.heroImageUrl} 
              alt="Potato Lake"
              fill
              className="object-cover opacity-15"
              priority
            />
          </div>
        )}
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
              {homePage.heroTitle}
            </h1>
            {homePage.heroSubtitle && (
              <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-neutral-light font-light leading-relaxed max-w-3xl mx-auto">
                {homePage.heroSubtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a href="/resorts" className="bg-accent text-primary px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore Resorts
              </a>
              <a href="/fishing" className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105">
                Fishing Info
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Alert Banner */}
      {homePage.alertBannerActive && homePage.alertBanner && (
        <section className="bg-yellow-500 text-yellow-900 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center text-center">
              <span className="font-semibold">⚠️ {homePage.alertBanner}</span>
            </div>
          </div>
        </section>
      )}



      {/* Latest News & Upcoming Events */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Latest News */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                {homePage.latestNewsHeading || 'Latest News & Updates'}
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-neutral-dark">Lake Association Meeting</h3>
                  <p className="text-sm text-neutral-dark">Monthly meeting discussing water quality improvements and upcoming events.</p>
                  <span className="text-xs text-accent">2 days ago</span>
                </div>
                <div className="border-l-4 border-accent pl-4">
                  <h3 className="font-semibold text-neutral-dark">Fishing Tournament Results</h3>
                  <p className="text-sm text-neutral-dark">Congratulations to all participants in our annual fishing tournament!</p>
                  <span className="text-xs text-accent">1 week ago</span>
                </div>
              </div>
              <a href="/news" className="inline-block mt-6 text-accent hover:text-primary font-semibold">
                View All News →
              </a>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-primary">
                {homePage.upcomingEventsHeading || 'Upcoming Events'}
              </h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-neutral-dark">No upcoming events scheduled.</p>
                  <p className="text-sm text-accent mt-2">Check back soon for new events!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold text-neutral-dark">{event.title}</h3>
                      <p className="text-sm text-neutral-dark">{event.description.substring(0, 100)}...</p>
                      <span className="text-xs text-accent">{formatDate(event.date)}</span>
                    </div>
                  ))}
                </div>
              )}
              <a href="/news" className="inline-block mt-6 text-accent hover:text-primary font-semibold">
                View All Events →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section with Image Grid */}
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
                    <div key={image.id} className="group overflow-hidden rounded-lg shadow-lg bg-white">
                      <div className="aspect-[4/3] relative">
                        <Image 
                          src={image.url} 
                          alt={image.altText || 'Potato Lake'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      {image.caption && (
                        <div className="p-4 bg-white">
                          <p className="text-sm text-neutral-dark font-medium leading-relaxed">{image.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Membership Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {homePage.membershipHeading || 'Join Our Association'}
            </h2>
            <p className="text-lg mb-8 leading-relaxed">
              {homePage.membershipText || 'Become a member to support lake preservation and get access to exclusive events and resources.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-neutral-light transition-colors">
                {homePage.membershipButtonText || 'Join Now'}
              </a>
              <a href="/association" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Community Highlights */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-neutral-dark">
              {homePage.communityHeading || 'Community Highlights'}
            </h2>
            <p className="text-lg text-neutral-dark mb-8 leading-relaxed">
              {homePage.communityText || 'See what makes our lake community special through photos and stories from our members.'}
            </p>
            
            {/* Recent Stories */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentStories.map((story) => (
                  <div key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {story.imageUrl && (
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-sm text-neutral-dark line-clamp-3">
                        {story.content}
                      </p>
                      <div className="text-xs text-accent mt-2">
                        By {story.authorName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/submit-story" className="bg-accent text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors">
                Submit Your Story
              </a>
              <a href="/stories" className="bg-transparent border-2 border-accent text-accent px-6 py-3 rounded-full font-semibold hover:bg-accent hover:text-primary transition-colors">
                View All Stories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-dark">
            Explore Our Website
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resorts</h3>
              <p className="text-neutral-dark mb-4">
                Find the perfect place to stay during your visit to Potato Lake.
              </p>
              <a href="/resorts" className="text-accent hover:text-primary font-semibold">
                View Resorts →
              </a>
            </div>
            
            <div className="bg-neutral-light p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing</h3>
              <p className="text-neutral-dark mb-4">
                Get the latest fishing reports and information about the lake.
              </p>
              <a href="/fishing" className="text-accent hover:text-primary font-semibold">
                Fishing Info →
              </a>
            </div>
            
            <div className="bg-neutral-light p-6 rounded-lg shadow-md">
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
        <section className="bg-gradient-to-br from-primary via-accent to-sand-accent text-white py-20">
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
