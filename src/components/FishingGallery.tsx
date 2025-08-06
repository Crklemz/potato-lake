'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface FishingGalleryImage {
  id: number
  imageUrl: string
  altText: string
  caption: string | null
  order: number
}

interface FishingGalleryProps {
  images: FishingGalleryImage[]
}

export default function FishingGallery({ images }: FishingGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  if (!images || images.length === 0) {
    return null
  }

  // Create cloned array for infinite loop
  const extendedImages = [...images, ...images, ...images]
  const baseIndex = images.length

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= baseIndex + images.length - 1) {
        return baseIndex
      }
      return prev + 1
    })
  }, [baseIndex, images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= baseIndex) {
        return baseIndex + images.length - 1
      }
      return prev - 1
    })
  }, [baseIndex, images.length])

  // Auto-cycling effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      goToNext()
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  // Reset to center when component mounts or images change
  useEffect(() => {
    setCurrentIndex(baseIndex)
  }, [baseIndex])

  const getVisibleImages = () => {
    const visibleIndices = []
    for (let i = -1; i <= 1; i++) {
      const index = currentIndex + i
      // Ensure index is within bounds of extendedImages
      const safeIndex = ((index % extendedImages.length) + extendedImages.length) % extendedImages.length
      visibleIndices.push({ displayIndex: i + 1, dataIndex: safeIndex })
    }
    return visibleIndices
  }

  const getCardStyles = (displayIndex: number) => {
    // Center card is at index 1 (0,1,2)
    const distance = Math.abs(displayIndex - 1)
    
    // Scale based on distance from center
    const scale = distance === 0 ? 1 : 0.8
    
    // Opacity based on distance
    const opacity = distance === 0 ? 1 : 0.7
    
    // Z-index for layering
    const zIndex = distance === 0 ? 10 : 5
    
    // Horizontal position
    const translateX = (displayIndex - 1) * 320
    
    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex
    }
  }

  const handleArrowClick = (direction: 'left' | 'right') => {
    setIsAutoPlaying(false) // Pause auto-play when user interacts
    if (direction === 'left') {
      goToPrevious()
    } else {
      goToNext()
    }
  }

  const visibleImages = getVisibleImages()

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
          Fishing Photo Gallery
        </h2>
        
        <div className="relative h-96 overflow-hidden">
          {/* Left arrow */}
          <button
            onClick={() => handleArrowClick('left')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-primary hover:text-accent rounded-full p-2 shadow-lg transition-all duration-200"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            onClick={() => handleArrowClick('right')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-primary hover:text-accent rounded-full p-2 shadow-lg transition-all duration-200"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Cards container */}
          <div className="relative h-full flex items-center justify-center">
            {visibleImages.map(({ displayIndex, dataIndex }) => {
              const image = extendedImages[dataIndex]
              if (!image) return null // Skip if image is undefined
              const styles = getCardStyles(displayIndex)
              
              return (
                <div
                  key={`${image.id}-${displayIndex}`}
                  className="absolute transition-all duration-500 ease-in-out"
                  style={styles}
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80 h-80">
                    <div className="relative h-56">
                      <Image
                        src={image.imageUrl}
                        alt={image.altText}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    {image.caption && (
                      <div className="p-4 h-24 flex items-center justify-center">
                        <p className="text-sm text-neutral-dark font-medium text-center leading-relaxed">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
} 