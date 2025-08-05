'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { CommunityStory } from '@/types/database'

interface StoryCarouselProps {
  stories: CommunityStory[]
}

export default function StoryCarousel({ stories }: StoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (stories.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [stories.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }



  if (!stories || stories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-dark">No stories available yet.</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {stories.map((story) => (
            <div 
              key={story.id} 
              className="w-full flex-shrink-0 bg-white"
              style={{ width: '100%' }}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                {story.imageUrl && (
                  <div className="md:w-1/2 aspect-[3/2] md:aspect-[4/3] relative">
                    <Image
                      src={story.imageUrl}
                      alt={story.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className={`${story.imageUrl ? 'md:w-1/2' : 'w-full'} p-6 md:p-8 flex flex-col justify-center ${!story.imageUrl ? 'text-center' : ''}`}>
                  <h3 className="text-xl md:text-2xl font-semibold text-primary mb-3">
                    {story.title}
                  </h3>
                  <p className="text-neutral-dark mb-4 leading-relaxed line-clamp-4">
                    {story.content}
                  </p>
                  <div className="text-sm text-accent">
                    By {story.authorName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Dots Indicator */}
      {stories.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {stories.map((story, index) => (
            <button
              key={story.id}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-accent scale-125' 
                  : 'bg-neutral-light hover:bg-neutral-dark'
              }`}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
} 