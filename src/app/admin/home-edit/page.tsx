'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import FileUpload from '@/components/FileUpload'
import type { HomePage as HomePageData } from '@/types/database'

export default function HomeEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState<string>('')

  const handleHeroImageUpload = (url: string) => {
    setHeroImageUrl(url)
  }

  const fetchHomePageData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/home-page')
      if (!response.ok) throw new Error('Failed to fetch home page data')
      const data = await response.json()
      setHomePageData(data)
      setHeroImageUrl(data.heroImageUrl || '')
    } catch (err) {
      setError('Failed to load home page data')
      console.error('Error fetching home page data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleAddCarouselImage = async (imageUrl: string, altText: string, caption: string) => {
    try {
      const response = await fetch('/api/admin/home-page/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: imageUrl,
          altText,
          caption,
          order: homePageData?.carouselImages?.length || 0
        })
      })

      if (!response.ok) throw new Error('Failed to add carousel image')
      
      setSuccess('Carousel image added successfully!')
      await fetchHomePageData()
    } catch (err) {
      setError('Failed to add carousel image')
      console.error('Error adding carousel image:', err)
    }
  }

  const handleRemoveCarouselImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to remove this image?')) return

    try {
      const response = await fetch(`/api/admin/home-page/carousel/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove carousel image')
      
      setSuccess('Carousel image removed successfully!')
      await fetchHomePageData()
    } catch (err) {
      setError('Failed to remove carousel image')
      console.error('Error removing carousel image:', err)
    }
  }

  function CarouselImageUploader({ onAdd }: { onAdd: (url: string, altText: string, caption: string) => void }) {
    const [imageUrl, setImageUrl] = useState('')
    const [altText, setAltText] = useState('')
    const [caption, setCaption] = useState('')

    const handleImageUpload = (url: string) => {
      setImageUrl(url)
    }

    const handleAdd = () => {
      if (imageUrl.trim()) {
        onAdd(imageUrl, altText, caption)
        setImageUrl('')
        setAltText('')
        setCaption('')
      }
    }

    return (
      <div className="space-y-4 p-4 border rounded-lg bg-neutral-light">
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">Upload Image</label>
          <FileUpload
            onUpload={handleImageUpload}
            onError={(error) => console.error('Upload error:', error)}
            type="image"
            currentUrl={imageUrl}
            label="Upload Carousel Image"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">Alt Text</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter alt text (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-dark mb-2">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Enter caption (optional)"
          />
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!imageUrl.trim()}
          className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Carousel
        </button>
      </div>
    )
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchHomePageData()
    }
  }, [status, router, fetchHomePageData])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImageUrl: heroImageUrl,
      introHeading: formData.get('introHeading') as string,
      introText: formData.get('introText') as string,
      subHeading: formData.get('subHeading') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/home-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update home page')

      setSuccess('Home page updated successfully!')
      await fetchHomePageData()
    } catch (err) {
      setError('Failed to update home page')
      console.error('Error updating home page:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-neutral-dark">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Home Page</h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">
              Home Page Content Management
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            {isLoading && !homePageData ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading home page data...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    name="heroTitle"
                    defaultValue={homePageData?.heroTitle || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter hero title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    name="heroSubtitle"
                    defaultValue={homePageData?.heroSubtitle || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter hero subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Image
                  </label>
                  <FileUpload
                    onUpload={handleHeroImageUpload}
                    onError={(error) => setError(error)}
                    type="image"
                    currentUrl={heroImageUrl}
                    label="Upload Hero Image"
                  />
                  <input type="hidden" name="heroImageUrl" defaultValue={heroImageUrl} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Intro Heading
                  </label>
                  <input
                    type="text"
                    name="introHeading"
                    defaultValue={homePageData?.introHeading || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter intro heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Intro Text
                  </label>
                  <textarea
                    name="introText"
                    rows={4}
                    defaultValue={homePageData?.introText || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter intro text"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Sub Heading
                  </label>
                  <input
                    type="text"
                    name="subHeading"
                    defaultValue={homePageData?.subHeading || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter sub heading (optional)"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">Image Carousel Management</h3>
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-neutral-dark mb-2">Add New Carousel Image</h4>
                    <CarouselImageUploader onAdd={handleAddCarouselImage} />
                  </div>
                  {homePageData?.carouselImages && homePageData.carouselImages.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-neutral-dark mb-2">
                        Current Carousel Images ({homePageData.carouselImages.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {homePageData.carouselImages.map((image) => (
                          <div key={image.id} className="border rounded-lg p-4">
                            <img 
                              src={image.url} 
                              alt={image.altText || 'Carousel image'} 
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <p className="text-sm text-neutral-dark mb-1">
                              <strong>Alt Text:</strong> {image.altText || 'None'}
                            </p>
                            <p className="text-sm text-neutral-dark mb-2">
                              <strong>Caption:</strong> {image.caption || 'None'}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleRemoveCarouselImage(image.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button 
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => router.push('/')}
                    className="bg-neutral-light text-neutral-dark px-6 py-2 rounded-md font-semibold hover:bg-accent transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 