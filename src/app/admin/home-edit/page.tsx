'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FileUpload from '@/components/FileUpload'
import AdminHeader from '@/components/AdminHeader'

interface HomePageData {
  id: number
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  introHeading: string
  introText: string
  subHeading: string | null
  carouselImages: Array<{
    id: number
    url: string
    altText: string | null
    caption: string | null
    order: number
  }>
  alertBanner: string | null
  alertBannerActive: boolean
  latestNewsHeading: string | null
  upcomingEventsHeading: string | null
  membershipHeading: string | null
  membershipText: string | null
  membershipButtonText: string | null
  communityHeading: string | null
  communityText: string | null
}

export default function HomeEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [homePageData, setHomePageData] = useState<HomePageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Carousel image upload state
  const [newCarouselImage, setNewCarouselImage] = useState({
    url: '',
    altText: '',
    caption: ''
  })

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchHomePageData()
  }, [session, status, router])

  const fetchHomePageData = async () => {
    try {
      const response = await fetch('/api/admin/home-page')
      if (response.ok) {
        const data = await response.json()
        setHomePageData(data)
      } else {
        setError('Failed to load home page data')
      }
    } catch (err) {
      setError('Error loading home page data: ' + err)
      console.error('Error loading home page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/home-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homePageData),
      })

      if (response.ok) {
        setSuccess('Home page updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update home page')
      }
    } catch (err) {
      setError('Error updating home page: ' + err)
      console.error('Error updating home page:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof HomePageData, value: string | boolean) => {
    if (homePageData) {
      setHomePageData({
        ...homePageData,
        [field]: value,
      })
    }
  }

  const handleAddCarouselImage = async () => {
    if (!newCarouselImage.url.trim()) return

    try {
      const response = await fetch('/api/admin/home-page/carousel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: newCarouselImage.url,
          altText: newCarouselImage.altText,
          caption: newCarouselImage.caption,
          order: homePageData?.carouselImages.length || 0,
        }),
      })

      if (response.ok) {
        await fetchHomePageData()
        setNewCarouselImage({ url: '', altText: '', caption: '' })
        setSuccess('Carousel image added successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to add carousel image')
      }
    } catch (err) {
      setError('Error adding carousel image: ' + err)
      console.error('Error adding carousel image:', err)
    }
  }

  const handleRemoveCarouselImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/admin/home-page/carousel/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchHomePageData()
        setSuccess('Carousel image removed successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to remove carousel image')
      }
      } catch (err) {
      setError('Error removing carousel image: ' + err)
      console.error('Error removing carousel image:', err)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!homePageData) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-neutral-dark mb-4">
            Home Page Editor
          </h1>
          <p className="text-neutral-dark">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Admin Navigation Header */}
      <AdminHeader title="Home Page Editor" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Hero Section</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={homePageData.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={homePageData.heroSubtitle || ''}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Hero Image
                </label>
                <FileUpload
                  currentUrl={homePageData.heroImageUrl}
                  onUpload={(url: string) => handleInputChange('heroImageUrl', url)}
                  onError={(error: string) => setError(error)}
                  type="image"
                  accept="image/jpeg,image/png,image/webp"
                  maxSize={5 * 1024 * 1024}
                  label="Upload Hero Image"
                />
              </div>
            </div>

            {/* Alert Banner */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Alert Banner</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="alertBannerActive"
                    checked={homePageData.alertBannerActive}
                    onChange={(e) => handleInputChange('alertBannerActive', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="alertBannerActive" className="text-sm font-medium text-neutral-dark">
                    Show Alert Banner
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Alert Message
                  </label>
                  <textarea
                    value={homePageData.alertBanner || ''}
                    onChange={(e) => handleInputChange('alertBanner', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter alert message..."
                  />
                </div>
              </div>
            </div>

            {/* Latest News Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Latest News Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={homePageData.latestNewsHeading || ''}
                  onChange={(e) => handleInputChange('latestNewsHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Latest News & Updates"
                />
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Upcoming Events Section</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={homePageData.upcomingEventsHeading || ''}
                  onChange={(e) => handleInputChange('upcomingEventsHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Upcoming Events"
                />
              </div>
            </div>

            {/* Intro Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Intro Section</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Intro Heading
                  </label>
                  <input
                    type="text"
                    value={homePageData.introHeading}
                    onChange={(e) => handleInputChange('introHeading', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Intro Text
                  </label>
                  <textarea
                    value={homePageData.introText}
                    onChange={(e) => handleInputChange('introText', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Sub Heading
                  </label>
                  <input
                    type="text"
                    value={homePageData.subHeading || ''}
                    onChange={(e) => handleInputChange('subHeading', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Image Carousel Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Image Carousel Management</h2>
              
              {/* Add New Carousel Image */}
              <div className="mb-6 p-4 border rounded-lg bg-neutral-light">
                <h3 className="text-lg font-medium text-neutral-dark mb-4">Add New Carousel Image</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">Upload Image</label>
                    <FileUpload
                      currentUrl={newCarouselImage.url}
                      onUpload={(url: string) => setNewCarouselImage(prev => ({ ...prev, url }))}
                      onError={(error: string) => setError(error)}
                      type="image"
                      accept="image/jpeg,image/png,image/webp"
                      maxSize={5 * 1024 * 1024}
                      label="Upload Carousel Image"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">Alt Text</label>
                    <input
                      type="text"
                      value={newCarouselImage.altText}
                      onChange={(e) => setNewCarouselImage(prev => ({ ...prev, altText: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter alt text (optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">Caption</label>
                    <input
                      type="text"
                      value={newCarouselImage.caption}
                      onChange={(e) => setNewCarouselImage(prev => ({ ...prev, caption: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter caption (optional)"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddCarouselImage}
                    disabled={!newCarouselImage.url.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Carousel
                  </button>
                </div>
              </div>

              {/* Current Carousel Images */}
              {homePageData.carouselImages && homePageData.carouselImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-neutral-dark mb-4">
                    Current Carousel Images ({homePageData.carouselImages.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homePageData.carouselImages.map((image) => (
                      <div key={image.id} className="border rounded-lg p-4">
                        <div className="w-full h-32 relative rounded mb-2">
                          <Image 
                            src={image.url} 
                            alt={image.altText || 'Carousel image'} 
                            fill
                            className="object-cover rounded"
                          />
                        </div>
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

            {/* Membership Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Membership Call to Action</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={homePageData.membershipHeading || ''}
                    onChange={(e) => handleInputChange('membershipHeading', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Join Our Association"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Text
                  </label>
                  <textarea
                    value={homePageData.membershipText || ''}
                    onChange={(e) => handleInputChange('membershipText', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Become a member to support lake preservation..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={homePageData.membershipButtonText || ''}
                    onChange={(e) => handleInputChange('membershipButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Join Now"
                  />
                </div>
              </div>
            </div>

            {/* Community Highlights Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Community Highlights</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={homePageData.communityHeading || ''}
                    onChange={(e) => handleInputChange('communityHeading', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Community Highlights"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Text
                  </label>
                  <textarea
                    value={homePageData.communityText || ''}
                    onChange={(e) => handleInputChange('communityText', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="See what makes our lake community special..."
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 