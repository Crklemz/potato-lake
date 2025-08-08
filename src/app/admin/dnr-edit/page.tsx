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
  dnrFishingCardHeading: string | null
  dnrFishingCardItems: string[] | null
  dnrFishingCardCtaText: string | null
  dnrFishingCardCtaUrl: string | null
  dnrBoatingCardHeading: string | null
  dnrBoatingCardItems: string[] | null
  dnrBoatingCardCtaText: string | null
  dnrBoatingCardCtaUrl: string | null
  regulationsHeading: string | null
  regulationsSubheading: string | null
  mapHeading: string | null
  mapCaption: string | null
  mapEmbedUrl: string | null
  mapExternalLinkText: string | null
  mapExternalLinkUrl: string | null
  invasiveHeading: string | null
  invasiveBody: string | null
  invasiveTips: string[] | null
  reportSightingUrl: string | null
  invasiveInfoUrl: string | null
  monitoringHeading: string | null
  monitoringText: string | null
  monitoringPrograms: string[] | null
  monitoringCtaText: string | null
  monitoringCtaUrl: string | null
  monitoringImageUrl: string | null
}

export default function DnrEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dnrData, setDnrData] = useState<DnrPageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fishingItems, setFishingItems] = useState<string[]>([])
  const [boatingItems, setBoatingItems] = useState<string[]>([])
  const [invasiveItems, setInvasiveItems] = useState<string[]>([])
  const [monitoringItems, setMonitoringItems] = useState<string[]>([])
  const [newFishingItem, setNewFishingItem] = useState('')
  const [newBoatingItem, setNewBoatingItem] = useState('')
  const [newInvasiveItem, setNewInvasiveItem] = useState('')
  const [newMonitoringItem, setNewMonitoringItem] = useState('')

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
      setFishingItems(data.dnrFishingCardItems || [])
      setBoatingItems(data.dnrBoatingCardItems || [])
      setInvasiveItems(data.invasiveTips || [])
      setMonitoringItems(data.monitoringPrograms || [])
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

  const handleMonitoringImageUpload = (url: string) => {
    if (dnrData) {
      setDnrData({ ...dnrData, monitoringImageUrl: url })
    }
  }

  const handleMonitoringImageError = (error: string) => {
    setError('Monitoring image upload failed: ' + error)
  }

  const addFishingItem = () => {
    if (newFishingItem.trim()) {
      setFishingItems([...fishingItems, newFishingItem.trim()])
      setNewFishingItem('')
    }
  }

  const removeFishingItem = (index: number) => {
    setFishingItems(fishingItems.filter((_, i) => i !== index))
  }

  const addBoatingItem = () => {
    if (newBoatingItem.trim()) {
      setBoatingItems([...boatingItems, newBoatingItem.trim()])
      setNewBoatingItem('')
    }
  }

  const removeBoatingItem = (index: number) => {
    setBoatingItems(boatingItems.filter((_, i) => i !== index))
  }

  const addInvasiveItem = () => {
    if (newInvasiveItem.trim()) {
      setInvasiveItems([...invasiveItems, newInvasiveItem.trim()])
      setNewInvasiveItem('')
    }
  }

  const removeInvasiveItem = (index: number) => {
    setInvasiveItems(invasiveItems.filter((_, i) => i !== index))
  }

  const addMonitoringItem = () => {
    if (newMonitoringItem.trim()) {
      setMonitoringItems([...monitoringItems, newMonitoringItem.trim()])
      setNewMonitoringItem('')
    }
  }

  const removeMonitoringItem = (index: number) => {
    setMonitoringItems(monitoringItems.filter((_, i) => i !== index))
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
      dnrStewardshipCtaUrl: formData.get('dnrStewardshipCtaUrl') as string,
      dnrFishingCardHeading: formData.get('dnrFishingCardHeading') as string,
      dnrFishingCardItems: fishingItems,
      dnrFishingCardCtaText: formData.get('dnrFishingCardCtaText') as string,
      dnrFishingCardCtaUrl: formData.get('dnrFishingCardCtaUrl') as string,
      dnrBoatingCardHeading: formData.get('dnrBoatingCardHeading') as string,
      dnrBoatingCardItems: boatingItems,
      dnrBoatingCardCtaText: formData.get('dnrBoatingCardCtaText') as string,
      dnrBoatingCardCtaUrl: formData.get('dnrBoatingCardCtaUrl') as string,
      regulationsHeading: formData.get('regulationsHeading') as string,
      regulationsSubheading: formData.get('regulationsSubheading') as string,
      mapHeading: formData.get('mapHeading') as string,
      mapCaption: formData.get('mapCaption') as string,
      mapEmbedUrl: formData.get('mapEmbedUrl') as string,
      mapExternalLinkText: formData.get('mapExternalLinkText') as string,
      mapExternalLinkUrl: formData.get('mapExternalLinkUrl') as string,
      invasiveHeading: formData.get('invasiveHeading') as string,
      invasiveBody: formData.get('invasiveBody') as string,
      invasiveTips: invasiveItems,
      reportSightingUrl: formData.get('reportSightingUrl') as string,
      invasiveInfoUrl: formData.get('invasiveInfoUrl') as string,
      monitoringHeading: formData.get('monitoringHeading') as string,
      monitoringText: formData.get('monitoringText') as string,
      monitoringPrograms: monitoringItems,
      monitoringCtaText: formData.get('monitoringCtaText') as string,
      monitoringCtaUrl: formData.get('monitoringCtaUrl') as string,
      monitoringImageUrl: dnrData?.monitoringImageUrl || ''
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
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Lake Map Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Map Section Heading
                      </label>
                      <input
                        type="text"
                        name="mapHeading"
                        defaultValue={dnrData?.mapHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter map section heading (e.g., 'Potato Lake Map')"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Map Caption
                      </label>
                      <textarea
                        name="mapCaption"
                        rows={3}
                        defaultValue={dnrData?.mapCaption || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter map caption (e.g., 'View access points, water depth, and aquatic vegetation zones.')"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Map Embed URL
                      </label>
                      <input
                        type="url"
                        name="mapEmbedUrl"
                        defaultValue={dnrData?.mapEmbedUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter iframe embed URL for interactive map"
                      />
                      <p className="text-xs text-neutral-dark mt-1">
                        This should be an iframe src URL for embedding interactive maps
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        External Link Text
                      </label>
                      <input
                        type="text"
                        name="mapExternalLinkText"
                        defaultValue={dnrData?.mapExternalLinkText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter external link button text (e.g., 'View Full Bathymetric Map')"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        External Link URL
                      </label>
                      <input
                        type="url"
                        name="mapExternalLinkUrl"
                        defaultValue={dnrData?.mapExternalLinkUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter external link URL"
                      />
                    </div>
                  </div>
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

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Regulations Section</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        name="regulationsHeading"
                        defaultValue={dnrData?.regulationsHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter regulations section heading"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Subheading
                      </label>
                      <textarea
                        name="regulationsSubheading"
                        rows={3}
                        defaultValue={dnrData?.regulationsSubheading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter regulations section subheading"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Cards Section</h3>
                  
                  <div className="space-y-6">
                    {/* Fishing Regulations Card */}
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="text-md font-semibold mb-3 text-neutral-dark">Fishing Regulations Card</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Card Heading
                          </label>
                          <input
                            type="text"
                            name="dnrFishingCardHeading"
                            defaultValue={dnrData?.dnrFishingCardHeading || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter fishing card heading"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Card Items
                          </label>
                          <div className="space-y-2">
                            {fishingItems.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="flex-1 px-3 py-2 bg-neutral-light rounded-md text-sm">
                                  {item}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeFishingItem(index)}
                                  className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newFishingItem}
                                onChange={(e) => setNewFishingItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addFishingItem()}
                                placeholder="Enter new item"
                                className="flex-1 px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
                              />
                              <button
                                type="button"
                                onClick={addFishingItem}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-dark mt-1">
                            Add 3-5 items for the fishing regulations card
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            name="dnrFishingCardCtaText"
                            defaultValue={dnrData?.dnrFishingCardCtaText || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter CTA button text"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            CTA Button URL
                          </label>
                          <input
                            type="url"
                            name="dnrFishingCardCtaUrl"
                            defaultValue={dnrData?.dnrFishingCardCtaUrl || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter CTA button URL"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Boating Safety Card */}
                    <div className="border-l-4 border-accent pl-4">
                      <h4 className="text-md font-semibold mb-3 text-neutral-dark">Boating Safety Card</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Card Heading
                          </label>
                          <input
                            type="text"
                            name="dnrBoatingCardHeading"
                            defaultValue={dnrData?.dnrBoatingCardHeading || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter boating card heading"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Card Items
                          </label>
                          <div className="space-y-2">
                            {boatingItems.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="flex-1 px-3 py-2 bg-neutral-light rounded-md text-sm">
                                  {item}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeBoatingItem(index)}
                                  className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={newBoatingItem}
                                onChange={(e) => setNewBoatingItem(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addBoatingItem()}
                                placeholder="Enter new item"
                                className="flex-1 px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
                              />
                              <button
                                type="button"
                                onClick={addBoatingItem}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-neutral-dark mt-1">
                            Add 3-5 items for the boating safety card
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            CTA Button Text
                          </label>
                          <input
                            type="text"
                            name="dnrBoatingCardCtaText"
                            defaultValue={dnrData?.dnrBoatingCardCtaText || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter CTA button text"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            CTA Button URL
                          </label>
                          <input
                            type="url"
                            name="dnrBoatingCardCtaUrl"
                            defaultValue={dnrData?.dnrBoatingCardCtaUrl || ''}
                            className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter CTA button URL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Invasive Species Section</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        name="invasiveHeading"
                        defaultValue={dnrData?.invasiveHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter invasive species section heading"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Body Text
                      </label>
                      <textarea
                        name="invasiveBody"
                        rows={4}
                        defaultValue={dnrData?.invasiveBody || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter invasive species section body text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Prevention Tips
                      </label>
                      <div className="space-y-2">
                        {invasiveItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="flex-1 px-3 py-2 bg-neutral-light rounded-md text-sm">
                              {item}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeInvasiveItem(index)}
                              className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newInvasiveItem}
                            onChange={(e) => setNewInvasiveItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addInvasiveItem()}
                            placeholder="Enter new prevention tip"
                            className="flex-1 px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                          <button
                            type="button"
                            onClick={addInvasiveItem}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-dark mt-1">
                        Add 3-6 prevention tips for invasive species
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Report Sighting Button URL
                      </label>
                      <input
                        type="url"
                        name="reportSightingUrl"
                        defaultValue={dnrData?.reportSightingUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter URL for reporting invasive species sightings"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        More Information Button URL
                      </label>
                      <input
                        type="url"
                        name="invasiveInfoUrl"
                        defaultValue={dnrData?.invasiveInfoUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter URL for more invasive species information"
                      />
                    </div>
                  </div>
                </div>

                {/* Monitoring Section */}
                <div className="bg-neutral-light rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold text-neutral-dark mb-4">
                    Lake Monitoring Section
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        name="monitoringHeading"
                        defaultValue={dnrData?.monitoringHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter monitoring section heading"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Section Body Text
                      </label>
                      <textarea
                        name="monitoringText"
                        rows={4}
                        defaultValue={dnrData?.monitoringText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter monitoring section body text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Monitoring Programs
                      </label>
                      <div className="space-y-2">
                        {monitoringItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="flex-1 px-3 py-2 bg-neutral-light rounded-md text-sm">
                              {item}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeMonitoringItem(index)}
                              className="px-2 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMonitoringItem}
                            onChange={(e) => setNewMonitoringItem(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMonitoringItem()}
                            placeholder="Enter new monitoring program"
                            className="flex-1 px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          />
                          <button
                            type="button"
                            onClick={addMonitoringItem}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-dark mt-1">
                        Add 3-5 monitoring program examples
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        name="monitoringCtaText"
                        defaultValue={dnrData?.monitoringCtaText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter CTA button text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        CTA Button URL
                      </label>
                      <input
                        type="url"
                        name="monitoringCtaUrl"
                        defaultValue={dnrData?.monitoringCtaUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter URL for monitoring signup"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Monitoring Image (Optional)
                      </label>
                      <FileUpload
                        type="image"
                        currentUrl={dnrData?.monitoringImageUrl}
                        onUpload={handleMonitoringImageUpload}
                        onError={handleMonitoringImageError}
                        label="Upload Monitoring Image"
                      />
                      <input
                        type="hidden"
                        name="monitoringImageUrl"
                        value={dnrData?.monitoringImageUrl || ''}
                      />
                      <p className="text-xs text-neutral-dark mt-1">
                        If no image is provided, a default icon will be displayed
                      </p>
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