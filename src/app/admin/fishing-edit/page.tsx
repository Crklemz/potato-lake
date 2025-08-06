'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminHeader from '@/components/AdminHeader'
import FileUpload from '@/components/FileUpload'

interface FishingPageData {
  id: number
  fishHeading: string
  fishText: string
  imageUrl: string | null
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
}

export default function FishingEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [fishingData, setFishingData] = useState<FishingPageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchFishingData()
    }
  }, [status, router])

  const fetchFishingData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/fishing-page')
      if (!response.ok) throw new Error('Failed to fetch fishing page data')
      const data = await response.json()
      setFishingData(data)
    } catch (err) {
      setError('Failed to load fishing page data: ' + err)
      console.error('Error fetching fishing page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      fishHeading: formData.get('fishHeading') as string,
      fishText: formData.get('fishText') as string,
      imageUrl: formData.get('imageUrl') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImageUrl: formData.get('heroImageUrl') as string,
      ctaText: formData.get('ctaText') as string,
      ctaLink: formData.get('ctaLink') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/fishing-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update fishing page')

      setSuccess('Fishing page updated successfully!')
      await fetchFishingData()
    } catch (err) {
      setError('Failed to update fishing page: ' + err)
      console.error('Error updating fishing page:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHeroImageUpload = (url: string) => {
    if (fishingData) {
      setFishingData({ ...fishingData, heroImageUrl: url })
    }
  }

  const handleHeroImageError = (error: string) => {
    setError('Hero image upload failed: ' + error)
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
      <AdminHeader title="Edit Fishing Page" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">
              Fishing Page Content Management
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

            {isLoading && !fishingData ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading fishing page data...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section */}
                <div className="border-b border-neutral-light pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-neutral-dark">Hero Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Hero Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="heroTitle"
                        defaultValue={fishingData?.heroTitle || ''}
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
                        defaultValue={fishingData?.heroSubtitle || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter hero subtitle (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Hero Image
                      </label>
                      <FileUpload
                        type="image"
                        currentUrl={fishingData?.heroImageUrl}
                        onUpload={handleHeroImageUpload}
                        onError={handleHeroImageError}
                        label="Upload Hero Image"
                      />
                      <input
                        type="hidden"
                        name="heroImageUrl"
                        value={fishingData?.heroImageUrl || ''}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          name="ctaText"
                          defaultValue={fishingData?.ctaText || ''}
                          className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter CTA button text"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          CTA Button Link
                        </label>
                        <input
                          type="url"
                          name="ctaLink"
                          defaultValue={fishingData?.ctaLink || ''}
                          className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter CTA button link"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fishing Overview Section */}
                <div className="border-b border-neutral-light pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-neutral-dark">Fishing Overview Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Overview Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fishHeading"
                        defaultValue={fishingData?.fishHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter overview heading"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Overview Text <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="fishText"
                        rows={6}
                        defaultValue={fishingData?.fishText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter overview text paragraph"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-neutral-dark">Additional Content</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Fishing Image URL
                      </label>
                      <input
                        type="url"
                        name="imageUrl"
                        defaultValue={fishingData?.imageUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter fishing image URL"
                      />
                      {fishingData?.imageUrl && (
                        <div className="mt-2">
                          <div className="w-32 h-24 relative rounded-lg border">
                            <Image 
                              src={fishingData.imageUrl} 
                              alt="Fishing preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
                    onClick={() => router.push('/fishing')}
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