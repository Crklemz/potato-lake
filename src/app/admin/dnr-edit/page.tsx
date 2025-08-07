'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminHeader from '@/components/AdminHeader'
import FileUpload from '@/components/FileUpload'

interface DnrPageData {
  id: number
  dnrHeading: string
  dnrText: string
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  mapUrl: string | null
  dnrStewardshipHeading: string | null
  dnrStewardshipText: string | null
  dnrStewardshipCtaText: string | null
  dnrStewardshipCtaUrl: string | null
}

export default function DnrEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dnrData, setDnrData] = useState<DnrPageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchDnrData()
    }
  }, [status, router])

  const fetchDnrData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/dnr-page')
      if (!response.ok) throw new Error('Failed to fetch DNR page data')
      const data = await response.json()
      setDnrData(data)
    } catch (err) {
      setError('Failed to load DNR page data: ' + err)
      console.error('Error fetching DNR page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHeroImageUpload = (url: string) => {
    if (dnrData) {
      setDnrData({ ...dnrData, heroImageUrl: url })
    }
  }

  const handleHeroImageError = (error: string) => {
    setError('Hero image upload failed: ' + error)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      dnrHeading: formData.get('dnrHeading') as string,
      dnrText: formData.get('dnrText') as string,
      heroImageUrl: dnrData?.heroImageUrl || '',
      ctaText: formData.get('ctaText') as string,
      ctaLink: formData.get('ctaLink') as string,
      mapUrl: formData.get('mapUrl') as string,
      dnrStewardshipHeading: formData.get('dnrStewardshipHeading') as string,
      dnrStewardshipText: formData.get('dnrStewardshipText') as string,
      dnrStewardshipCtaText: formData.get('dnrStewardshipCtaText') as string,
      dnrStewardshipCtaUrl: formData.get('dnrStewardshipCtaUrl') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/dnr-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update DNR page')

      setSuccess('DNR page updated successfully!')
      await fetchDnrData()
    } catch (err) {
      setError('Failed to update DNR page: ' + err)
      console.error('Error updating DNR page:', err)
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
      <AdminHeader title="Edit DNR Page" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">
              DNR Page Content Management
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

            {isLoading && !dnrData ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading DNR page data...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    DNR Heading
                  </label>
                  <input
                    type="text"
                    name="dnrHeading"
                    defaultValue={dnrData?.dnrHeading || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter DNR heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    DNR Information
                  </label>
                  <textarea
                    name="dnrText"
                    rows={8}
                    defaultValue={dnrData?.dnrText || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter DNR information, regulations, and important details"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Image
                  </label>
                  <FileUpload
                    type="image"
                    currentUrl={dnrData?.heroImageUrl}
                    onUpload={handleHeroImageUpload}
                    onError={handleHeroImageError}
                    label="Upload Hero Image"
                  />
                  <input
                    type="hidden"
                    name="heroImageUrl"
                    value={dnrData?.heroImageUrl || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    defaultValue={dnrData?.ctaText || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter CTA button text (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    CTA Button Link
                  </label>
                  <input
                    type="url"
                    name="ctaLink"
                    defaultValue={dnrData?.ctaLink || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter CTA button link URL (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Lake Map URL
                  </label>
                  <input
                    type="url"
                    name="mapUrl"
                    defaultValue={dnrData?.mapUrl || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter lake map URL"
                  />
                  {dnrData?.mapUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-neutral-dark mb-2">Current map:</p>
                      <a 
                        href={dnrData.mapUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-primary font-semibold"
                      >
                        View Map →
                      </a>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Stewardship Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Stewardship Heading
                      </label>
                      <input
                        type="text"
                        name="dnrStewardshipHeading"
                        defaultValue={dnrData?.dnrStewardshipHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter stewardship section heading"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Stewardship Text
                      </label>
                      <textarea
                        name="dnrStewardshipText"
                        rows={6}
                        defaultValue={dnrData?.dnrStewardshipText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter stewardship section text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Stewardship CTA Text (Optional)
                      </label>
                      <input
                        type="text"
                        name="dnrStewardshipCtaText"
                        defaultValue={dnrData?.dnrStewardshipCtaText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter stewardship CTA button text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Stewardship CTA URL (Optional)
                      </label>
                      <input
                        type="url"
                        name="dnrStewardshipCtaUrl"
                        defaultValue={dnrData?.dnrStewardshipCtaUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter stewardship CTA button URL"
                      />
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
                    onClick={() => router.push('/dnr')}
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