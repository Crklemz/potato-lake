import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { NewsPage } from '@/types/database'

async function getNewsData() {
  try {
    const newsPage = await prisma.newsPage.findFirst({
      include: {
        events: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })
    
    if (!newsPage) {
      // Create default news page if none exists
      const defaultNewsPage = await prisma.newsPage.create({
        data: {
          mainHeading: 'News & Events',
          events: {
            create: [
              {
                title: 'Annual Fishing Tournament',
                date: new Date('2024-07-15'),
                description: 'Join us for our annual fishing tournament! This year\'s event promises to be bigger and better than ever with great prizes and fun for the whole family.',
                imageUrl: null
              },
              {
                title: 'Lake Association Meeting',
                date: new Date('2024-08-05'),
                description: 'Monthly meeting of the Potato Lake Association. All members are welcome to attend and participate in discussions about lake management and upcoming events.',
                imageUrl: null
              }
            ]
          }
        },
        include: {
          events: {
            orderBy: {
              date: 'desc'
            }
          }
        }
      })
      return defaultNewsPage
    }
    
    return newsPage
  } catch (error) {
    console.error('Error fetching news data:', error)
    throw new Error('Failed to load news data')
  }
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function NewsPageContent({ newsPage }: { newsPage: NewsPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            {newsPage.mainHeading}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Stay Updated
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              Keep up with the latest news, events, and happenings around Potato Lake. 
                             From fishing tournaments to association meetings, there&apos;s always something 
               exciting happening in our community.
            </p>
          </div>

          {newsPage.events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-dark text-lg">
                No events are currently scheduled. Please check back soon!
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {newsPage.events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-48 md:h-full bg-accent flex items-center justify-center">
                        {event.imageUrl ? (
                          <img 
                            src={event.imageUrl} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-semibold">Event Image</span>
                        )}
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-neutral-dark">{event.title}</h3>
                        <span className="text-accent font-semibold text-sm">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      <p className="text-neutral-dark leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8 mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Get Involved</h3>
            <p className="text-neutral-dark leading-relaxed mb-4">
              Want to stay connected with the Potato Lake community? Join our association 
              and receive regular updates about events, lake management, and conservation efforts.
            </p>
            <a href="/association" className="text-accent hover:text-primary font-semibold">
              Learn More About Our Association →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingNewsPage() {
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

            <div className="space-y-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="h-48 md:h-full bg-accent"></div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-neutral-dark rounded w-48"></div>
                        <div className="h-4 bg-accent rounded w-24"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral-dark rounded"></div>
                        <div className="h-4 bg-neutral-dark rounded"></div>
                        <div className="h-4 bg-neutral-dark rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default async function NewsPage() {
  try {
    const newsPage = await getNewsData()
    
    return (
      <Suspense fallback={<LoadingNewsPage />}>
        <NewsPageContent newsPage={newsPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in NewsPage:', error)
    notFound()
  }
} 