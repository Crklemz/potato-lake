import { Suspense } from 'react'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

async function StoriesContent() {
  const stories = await prisma.communityStory.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Community Stories
          </h1>
          <p className="text-xl text-neutral-light max-w-2xl mx-auto">
            Discover the amazing stories, memories, and experiences shared by our Potato Lake community members.
          </p>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {stories.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📝</div>
              <h2 className="text-2xl font-bold text-neutral-dark mb-4">
                No Stories Yet
              </h2>
              <p className="text-neutral-dark mb-8 max-w-md mx-auto">
                Be the first to share your story! Submit your favorite memories and experiences at Potato Lake.
              </p>
              <a 
                href="/submit-story" 
                className="bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Share Your Story
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {stories.map((story) => (
                <article key={story.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {story.imageUrl && (
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={story.imageUrl}
                        alt={story.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      {story.title}
                    </h3>
                    
                    <div className="text-sm text-neutral-dark mb-4">
                      By {story.authorName} • {formatDate(story.createdAt)}
                    </div>
                    
                    <p className="text-neutral-dark leading-relaxed line-clamp-4">
                      {story.content}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-neutral-light">
                      <a 
                        href={`/stories/${story.id}`}
                        className="text-accent hover:text-primary font-semibold text-sm"
                      >
                        Read Full Story →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-primary mb-4">
                Share Your Story
              </h2>
              <p className="text-neutral-dark mb-6">
                Have a favorite memory or experience at Potato Lake? We&apos;d love to hear about it! 
                Share your story and it might be featured on our website.
              </p>
              <a 
                href="/submit-story" 
                className="bg-accent text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                Submit Your Story
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function StoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-light">
        <section className="bg-gradient-to-br from-primary to-accent text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-12 bg-white/20 rounded mb-6"></div>
              <div className="h-6 bg-white/20 rounded"></div>
            </div>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-6 bg-neutral-light rounded mb-4"></div>
                    <div className="h-4 bg-neutral-light rounded mb-2"></div>
                    <div className="h-4 bg-neutral-light rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    }>
      <StoriesContent />
    </Suspense>
  )
} 