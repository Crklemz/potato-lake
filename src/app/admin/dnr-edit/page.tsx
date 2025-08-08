'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminHeader from '@/components/AdminHeader'
import FileUpload from '@/components/FileUpload'
import type { DnrResource, DnrLink } from '@/types/database'

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
  footerCtaHeading: string | null
  footerCtaSubheading: string | null
  footerCtaText: string | null
  footerCtaUrl: string | null
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
  const [resources, setResources] = useState<DnrResource[]>([])
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null)
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    description: '',
    fileUrl: '',
    order: 0
  })
  const [links, setLinks] = useState<DnrLink[]>([])
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null)
  const [linkFormData, setLinkFormData] = useState({
    title: '',
    url: '',
    description: '',
    order: 0
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchDnrData()
      fetchResources()
      fetchLinks()
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

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/admin/dnr-resources')
      if (response.ok) {
        const data = await response.json()
        setResources(data)
      } else {
        console.error('Failed to fetch resources')
      }
    } catch (error) {
      console.error('Error fetching resources:', error)
    }
  }

  const fetchLinks = async () => {
    try {
      const response = await fetch('/api/admin/dnr-links')
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      } else {
        console.error('Failed to fetch links')
      }
    } catch (error) {
      console.error('Error fetching links:', error)
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

  const handleResourceSubmit = async () => {
    // Validate required fields
    if (!resourceFormData.title.trim()) {
      setError('Resource title is required')
      return
    }
    if (!resourceFormData.description.trim()) {
      setError('Resource description is required')
      return
    }
    if (!resourceFormData.fileUrl.trim()) {
      setError('Resource file URL is required')
      return
    }

    try {
      const url = editingResourceId 
        ? `/api/admin/dnr-resources/${editingResourceId}`
        : '/api/admin/dnr-resources'
      
      const method = editingResourceId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resourceFormData)
      })

      if (response.ok) {
        setResourceFormData({ title: '', description: '', fileUrl: '', order: 0 })
        setEditingResourceId(null)
        await fetchResources()
        setSuccess('Resource saved successfully!')
      } else {
        setError('Failed to save resource')
      }
    } catch (error) {
      setError('Error saving resource: ' + error)
      console.error('Error saving resource:', error)
    }
  }

  const handleEditResource = (resource: DnrResource) => {
    setEditingResourceId(resource.id)
    setResourceFormData({
      title: resource.title,
      description: resource.description,
      fileUrl: resource.fileUrl,
      order: resource.order
    })
  }

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      const response = await fetch(`/api/admin/dnr-resources/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchResources()
        setSuccess('Resource deleted successfully!')
      } else {
        setError('Failed to delete resource')
      }
    } catch (error) {
      setError('Error deleting resource: ' + error)
      console.error('Error deleting resource:', error)
    }
  }

  const handleCancelResource = () => {
    setEditingResourceId(null)
    setResourceFormData({ title: '', description: '', fileUrl: '', order: 0 })
  }

  const handleLinkSubmit = async () => {
    // Validate required fields
    if (!linkFormData.title.trim()) {
      setError('Link title is required')
      return
    }
    if (!linkFormData.url.trim()) {
      setError('Link URL is required')
      return
    }

    try {
      const url = editingLinkId ? `/api/admin/dnr-links/${editingLinkId}` : '/api/admin/dnr-links'
      const method = editingLinkId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkFormData)
      })

      if (response.ok) {
        await fetchLinks()
        setEditingLinkId(null)
        setLinkFormData({ title: '', url: '', description: '', order: 0 })
        setSuccess('Link saved successfully!')
      } else {
        setError('Failed to save link')
      }
    } catch (error) {
      setError('Error saving link: ' + error)
      console.error('Error saving link:', error)
    }
  }

  const handleEditLink = (link: DnrLink) => {
    setEditingLinkId(link.id)
    setLinkFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      order: link.order
    })
  }

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const response = await fetch(`/api/admin/dnr-links/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchLinks()
      } else {
        console.error('Failed to delete link')
      }
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleCancelLink = () => {
    setEditingLinkId(null)
    setLinkFormData({ title: '', url: '', description: '', order: 0 })
  }

  const handleReorderLinks = async (links: DnrLink[]) => {
    try {
      const response = await fetch('/api/admin/dnr-links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links })
      })

      if (response.ok) {
        await fetchLinks()
      } else {
        console.error('Failed to reorder links')
      }
    } catch (error) {
      console.error('Error reordering links:', error)
    }
  }

  const moveLinkUp = (index: number) => {
    if (index === 0) return
    const newLinks = [...links]
    const temp = newLinks[index]
    newLinks[index] = newLinks[index - 1]
    newLinks[index - 1] = temp
    setLinks(newLinks)
    handleReorderLinks(newLinks)
  }

  const moveLinkDown = (index: number) => {
    if (index === links.length - 1) return
    const newLinks = [...links]
    const temp = newLinks[index]
    newLinks[index] = newLinks[index + 1]
    newLinks[index + 1] = temp
    setLinks(newLinks)
    handleReorderLinks(newLinks)
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
      monitoringImageUrl: dnrData?.monitoringImageUrl || '',
      footerCtaHeading: formData.get('footerCtaHeading') as string,
      footerCtaSubheading: formData.get('footerCtaSubheading') as string,
      footerCtaText: formData.get('footerCtaText') as string,
      footerCtaUrl: formData.get('footerCtaUrl') as string
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

                {/* Educational Materials & Downloads Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Educational Materials & Downloads</h3>
                  
                  <div className="bg-neutral-light rounded-lg p-6 mb-6">
                    <h4 className="text-md font-semibold mb-4 text-neutral-dark">
                      {editingResourceId ? 'Edit Resource' : 'Add New Resource'}
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Resource Title *
                          </label>
                                                  <input
                          type="text"
                          value={resourceFormData.title}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={resourceFormData.order}
                            onChange={(e) => setResourceFormData({ ...resourceFormData, order: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            min="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          Description *
                        </label>
                        <textarea
                          value={resourceFormData.description}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          File URL *
                        </label>
                        <input
                          type="url"
                          value={resourceFormData.fileUrl}
                          onChange={(e) => setResourceFormData({ ...resourceFormData, fileUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="https://example.com/document.pdf"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleResourceSubmit}
                          className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-accent hover:text-primary transition-colors"
                        >
                          {editingResourceId ? 'Update Resource' : 'Add Resource'}
                        </button>
                        {editingResourceId && (
                          <button
                            type="button"
                            onClick={handleCancelResource}
                            className="px-4 py-2 bg-neutral-dark text-white font-semibold rounded-md hover:bg-neutral-light transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Resources List */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-md font-semibold mb-4 text-neutral-dark">Current Resources</h4>
                    {resources.length === 0 ? (
                      <p className="text-neutral-dark">No resources available. Add your first resource above.</p>
                    ) : (
                      <div className="space-y-4">
                        {resources.map((resource) => (
                          <div key={resource.id} className="border border-neutral-light rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-neutral-dark">{resource.title}</h5>
                                <p className="text-sm text-neutral-dark mt-1">{resource.description}</p>
                                <p className="text-xs text-neutral-dark mt-1">
                                  Order: {resource.order} | File: {resource.fileUrl}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => handleEditResource(resource)}
                                  className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-accent hover:text-primary transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteResource(resource.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DNR Links Management */}
                <div className="bg-neutral-light rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">DNR Links Management</h3>
                  
                  {/* Add New Link Form */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h4 className="text-md font-semibold mb-4 text-neutral-dark">
                      {editingLinkId ? 'Edit Link' : 'Add New Link'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          value={linkFormData.title}
                          onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Link title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          URL *
                        </label>
                        <input
                          type="url"
                          value={linkFormData.url}
                          onChange={(e) => setLinkFormData({ ...linkFormData, url: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          Description
                        </label>
                        <textarea
                          value={linkFormData.description}
                          onChange={(e) => setLinkFormData({ ...linkFormData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          rows={3}
                          placeholder="Optional description"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleLinkSubmit}
                          className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-accent hover:text-primary transition-colors"
                        >
                          {editingLinkId ? 'Update Link' : 'Add Link'}
                        </button>
                        {editingLinkId && (
                          <button
                            type="button"
                            onClick={handleCancelLink}
                            className="px-4 py-2 bg-neutral-dark text-white font-semibold rounded-md hover:bg-neutral-light transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Current Links List */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-md font-semibold mb-4 text-neutral-dark">Current Links</h4>
                    {links.length === 0 ? (
                      <p className="text-neutral-dark">No links available. Add your first link above.</p>
                    ) : (
                      <div className="space-y-4">
                        {links.map((link, index) => (
                          <div key={link.id} className="border border-neutral-light rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-neutral-dark">{link.title}</h5>
                                <p className="text-sm text-neutral-dark mt-1">{link.description}</p>
                                <p className="text-xs text-neutral-dark mt-1">
                                  Order: {link.order} | URL: {link.url}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => moveLinkUp(index)}
                                  disabled={index === 0}
                                  className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                  title="Move Up"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => moveLinkDown(index)}
                                  disabled={index === links.length - 1}
                                  className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                                  title="Move Down"
                                >
                                  ↓
                                </button>
                                <button
                                  onClick={() => handleEditLink(link)}
                                  className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-accent hover:text-primary transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Page Footer CTA Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-neutral-dark">Page Footer CTA</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Footer CTA Heading
                      </label>
                      <input
                        type="text"
                        name="footerCtaHeading"
                        defaultValue={dnrData?.footerCtaHeading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter footer CTA heading (e.g., 'Get Involved with Lake Conservation')"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Footer CTA Subheading
                      </label>
                      <textarea
                        name="footerCtaSubheading"
                        rows={3}
                        defaultValue={dnrData?.footerCtaSubheading || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter footer CTA subheading text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Footer CTA Button Text
                      </label>
                      <input
                        type="text"
                        name="footerCtaText"
                        defaultValue={dnrData?.footerCtaText || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter footer CTA button text (e.g., 'Join the Association')"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Footer CTA Button URL
                      </label>
                      <input
                        type="text"
                        name="footerCtaUrl"
                        defaultValue={dnrData?.footerCtaUrl || ''}
                        className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter footer CTA button URL (e.g., /association#get-involved or https://example.com)"
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