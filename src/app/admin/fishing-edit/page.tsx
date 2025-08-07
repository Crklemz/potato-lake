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
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  regulationsHeading: string | null
  regulationsText: string | null
  regulationsCtaText: string | null
  regulationsCtaLink: string | null
  fishingReportHeading: string | null
  fishingReportText: string | null
  fishingReportDate: Date | null
  fishingCtaHeading: string | null
  fishingCtaText: string | null
  fishingCtaButtonText: string | null
  fishingCtaButtonLink: string | null
  infoSectionHeading: string | null
  infoSectionSubheading: string | null
  regulationsLabel: string | null
  regulationsTextNew: string | null
  regulationsLinkText: string | null
  regulationsLinkUrl: string | null
  reportLabel: string | null
  reportTextNew: string | null
  reportLastUpdated: Date | null
}

interface FishSpecies {
  id: number
  name: string
  order: number
  fishingPageId: number | null
  description: string | null
  bait: string | null
  timeOfDay: string | null
  weather: string | null
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

interface FishingGalleryImage {
  id: number
  fishingPageId: number
  imageUrl: string
  altText: string
  caption: string | null
  order: number
  createdAt: Date
}

interface FishingTip {
  id: number
  text: string
  submittedBy: string | null
  order: number
}

export default function FishingEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [fishingData, setFishingData] = useState<FishingPageData | null>(null)
  const [fishSpecies, setFishSpecies] = useState<FishSpecies[]>([])
  const [galleryImages, setGalleryImages] = useState<FishingGalleryImage[]>([])
  const [fishingTips, setFishingTips] = useState<FishingTip[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingSpecies, setEditingSpecies] = useState<FishSpecies | null>(null)
  const [editingGalleryImage, setEditingGalleryImage] = useState<FishingGalleryImage | null>(null)
  const [editingTip, setEditingTip] = useState<FishingTip | null>(null)
  const [newSpecies, setNewSpecies] = useState({ 
    name: '', 
    order: 0, 
    description: '', 
    bait: '', 
    timeOfDay: '', 
    weather: '', 
    imageUrl: '' 
  })
  const [newGalleryImage, setNewGalleryImage] = useState({
    imageUrl: '',
    altText: '',
    caption: '',
    order: 0
  })
  const [newTip, setNewTip] = useState({ text: '', submittedBy: '' })
  const [draggedSpecies, setDraggedSpecies] = useState<number | null>(null)
  const [draggedGalleryImage, setDraggedGalleryImage] = useState<number | null>(null)
  const [draggedTip, setDraggedTip] = useState<number | null>(null)
  const [isSpeciesSectionCollapsed, setIsSpeciesSectionCollapsed] = useState(true)
  const [isGallerySectionCollapsed, setIsGallerySectionCollapsed] = useState(true)
  const [isTipsSectionCollapsed, setIsTipsSectionCollapsed] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchFishingData()
      fetchFishSpecies()
      fetchGalleryImages()
      fetchFishingTips()
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

  const fetchFishSpecies = async () => {
    try {
      console.log('Fetching fish species...')
      const response = await fetch('/api/admin/fish-species')
      if (!response.ok) throw new Error('Failed to fetch fish species')
      const data = await response.json()
      console.log('Fish species fetched:', data)
      setFishSpecies(data)
    } catch (err) {
      setError('Failed to load fish species: ' + err)
      console.error('Error fetching fish species:', err)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      console.log('Fetching gallery images...')
      const response = await fetch('/api/admin/fishing-gallery')
      if (!response.ok) throw new Error('Failed to fetch gallery images')
      const data = await response.json()
      console.log('Gallery images fetched:', data)
      setGalleryImages(data)
    } catch (err) {
      setError('Failed to load gallery images: ' + err)
      console.error('Error fetching gallery images:', err)
    }
  }

  const fetchFishingTips = async () => {
    try {
      console.log('Fetching fishing tips...')
      const response = await fetch('/api/admin/fishing-tips')
      if (!response.ok) throw new Error('Failed to fetch fishing tips')
      const data = await response.json()
      console.log('Fishing tips fetched:', data)
      setFishingTips(data)
    } catch (err) {
      setError('Failed to load fishing tips: ' + err)
      console.error('Error fetching fishing tips:', err)
    }
  }

  const handleAddSpecies = async () => {
    console.log('handleAddSpecies called!')
    console.log('newSpecies state:', newSpecies)
    console.log('fishingData state:', fishingData)
    
    if (!newSpecies.name.trim()) {
      setError('Species name is required')
      return
    }

    if (!fishingData) {
      setError('Fishing page data not loaded')
      return
    }

    console.log('Adding fish species:', { ...newSpecies, fishingPageId: fishingData.id })

    try {
      const response = await fetch('/api/admin/fish-species', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSpecies,
          fishingPageId: fishingData.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to add fish species: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('Fish species added successfully:', result)

      setNewSpecies({ 
        name: '', 
        order: 0, 
        description: '', 
        bait: '', 
        timeOfDay: '', 
        weather: '', 
        imageUrl: '' 
      })
      await fetchFishSpecies()
      setSuccess('Fish species added successfully!')
    } catch (err) {
      setError('Failed to add fish species: ' + err)
      console.error('Error adding fish species:', err)
    }
  }

  const handleUpdateSpecies = async () => {
    if (!editingSpecies || !fishingData) return

    try {
      const response = await fetch('/api/admin/fish-species', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingSpecies.id,
          name: editingSpecies.name,
          order: editingSpecies.order,
          fishingPageId: fishingData.id,
          description: editingSpecies.description,
          bait: editingSpecies.bait,
          timeOfDay: editingSpecies.timeOfDay,
          weather: editingSpecies.weather,
          imageUrl: editingSpecies.imageUrl
        })
      })

      if (response.ok) {
        await fetchFishSpecies()
        setEditingSpecies(null)
        setSuccess('Fish species updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to update fish species')
      }
    } catch (err) {
      setError('Error updating fish species: ' + err)
      console.error('Error updating fish species:', err)
    }
  }

  const handleDeleteSpecies = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fish species?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/fish-species?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete fish species')

      await fetchFishSpecies()
      setSuccess('Fish species deleted successfully!')
    } catch (err) {
      setError('Failed to delete fish species: ' + err)
      console.error('Error deleting fish species:', err)
    }
  }

  const handleDragStart = (e: React.DragEvent, speciesId: number) => {
    setDraggedSpecies(speciesId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetSpeciesId: number) => {
    e.preventDefault()
    
    if (!draggedSpecies || draggedSpecies === targetSpeciesId) {
      setDraggedSpecies(null)
      return
    }

    try {
      const currentSpecies = [...fishSpecies]
      const draggedIndex = currentSpecies.findIndex(species => species.id === draggedSpecies)
      const targetIndex = currentSpecies.findIndex(species => species.id === targetSpeciesId)
      
      if (draggedIndex === -1 || targetIndex === -1) return
      
      // Create new order array
      const newOrder = [...currentSpecies]
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      // Update all species with new order values
      const updatePromises = newOrder.map((species, index) => 
        fetch('/api/admin/fish-species', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: species.id,
            name: species.name,
            order: index,
            fishingPageId: fishingData?.id,
            description: species.description,
            bait: species.bait,
            timeOfDay: species.timeOfDay,
            weather: species.weather,
            imageUrl: species.imageUrl
          })
        })
      )
      
      const responses = await Promise.all(updatePromises)
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        await fetchFishSpecies()
        setSuccess('Fish species reordered successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to reorder fish species')
      }
    } catch (err) {
      setError('Error reordering fish species: ' + err)
      console.error('Error reordering fish species:', err)
    } finally {
      setDraggedSpecies(null)
    }
  }

  // Gallery Image Management Functions
  const handleAddGalleryImage = async () => {
    if (!newGalleryImage.imageUrl.trim() || !newGalleryImage.altText.trim()) {
      setError('Image URL and alt text are required')
      return
    }

    try {
      const response = await fetch('/api/admin/fishing-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGalleryImage)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to add gallery image: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('Gallery image added successfully:', result)

      setNewGalleryImage({
        imageUrl: '',
        altText: '',
        caption: '',
        order: 0
      })
      await fetchGalleryImages()
      setSuccess('Gallery image added successfully!')
    } catch (err) {
      setError('Failed to add gallery image: ' + err)
      console.error('Error adding gallery image:', err)
    }
  }

  const handleUpdateGalleryImage = async () => {
    if (!editingGalleryImage) return

    try {
      const response = await fetch('/api/admin/fishing-gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingGalleryImage.id,
          imageUrl: editingGalleryImage.imageUrl,
          altText: editingGalleryImage.altText,
          caption: editingGalleryImage.caption,
          order: editingGalleryImage.order
        })
      })

      if (response.ok) {
        await fetchGalleryImages()
        setEditingGalleryImage(null)
        setSuccess('Gallery image updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to update gallery image')
      }
    } catch (err) {
      setError('Error updating gallery image: ' + err)
      console.error('Error updating gallery image:', err)
    }
  }

  const handleDeleteGalleryImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/fishing-gallery?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete gallery image')

      await fetchGalleryImages()
      setSuccess('Gallery image deleted successfully!')
    } catch (err) {
      setError('Failed to delete gallery image: ' + err)
      console.error('Error deleting gallery image:', err)
    }
  }

  const handleGalleryDragStart = (e: React.DragEvent, imageId: number) => {
    setDraggedGalleryImage(imageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleGalleryDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleGalleryDrop = async (e: React.DragEvent, targetImageId: number) => {
    e.preventDefault()
    
    if (!draggedGalleryImage || draggedGalleryImage === targetImageId) {
      setDraggedGalleryImage(null)
      return
    }

    try {
      const currentImages = [...galleryImages]
      const draggedIndex = currentImages.findIndex(image => image.id === draggedGalleryImage)
      const targetIndex = currentImages.findIndex(image => image.id === targetImageId)
      
      if (draggedIndex === -1 || targetIndex === -1) return
      
      // Create new order array
      const newOrder = [...currentImages]
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      // Update all images with new order values
      const updatePromises = newOrder.map((image, index) => 
        fetch('/api/admin/fishing-gallery', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: image.id,
            imageUrl: image.imageUrl,
            altText: image.altText,
            caption: image.caption,
            order: index
          })
        })
      )
      
      const responses = await Promise.all(updatePromises)
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        await fetchGalleryImages()
        setSuccess('Gallery images reordered successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to reorder gallery images')
      }
    } catch (err) {
      setError('Error reordering gallery images: ' + err)
      console.error('Error reordering gallery images:', err)
    } finally {
      setDraggedGalleryImage(null)
    }
  }

  // Fishing Tips Management Functions
  const handleAddTip = async () => {
    if (!newTip.text.trim()) {
      setError('Tip text is required')
      return
    }

    try {
      const response = await fetch('/api/admin/fishing-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newTip.text,
          submittedBy: newTip.submittedBy || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to add fishing tip: ${errorData.error || response.statusText}`)
      }

      const result = await response.json()
      console.log('Fishing tip added successfully:', result)

      setNewTip({ text: '', submittedBy: '' })
      await fetchFishingTips()
      setSuccess('Fishing tip added successfully!')
    } catch (err) {
      setError('Failed to add fishing tip: ' + err)
      console.error('Error adding fishing tip:', err)
    }
  }

  const handleUpdateTip = async () => {
    if (!editingTip) return

    try {
      const response = await fetch(`/api/admin/fishing-tips/${editingTip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: editingTip.text,
          submittedBy: editingTip.submittedBy || null,
        }),
      })

      if (response.ok) {
        await fetchFishingTips()
        setEditingTip(null)
        setSuccess('Fishing tip updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to update fishing tip')
      }
    } catch (err) {
      setError('Error updating fishing tip: ' + err)
      console.error('Error updating fishing tip:', err)
    }
  }

  const handleDeleteTip = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fishing tip?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/fishing-tips/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete fishing tip')

      await fetchFishingTips()
      setSuccess('Fishing tip deleted successfully!')
    } catch (err) {
      setError('Failed to delete fishing tip: ' + err)
      console.error('Error deleting fishing tip:', err)
    }
  }

  const handleTipDragStart = (e: React.DragEvent, tipId: number) => {
    setDraggedTip(tipId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleTipDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleTipDrop = async (e: React.DragEvent, targetTipId: number) => {
    e.preventDefault()
    
    if (!draggedTip || draggedTip === targetTipId) {
      setDraggedTip(null)
      return
    }

    try {
      const currentTips = [...fishingTips]
      const draggedIndex = currentTips.findIndex(tip => tip.id === draggedTip)
      const targetIndex = currentTips.findIndex(tip => tip.id === targetTipId)
      
      if (draggedIndex === -1 || targetIndex === -1) return
      
      // Create new order array
      const newOrder = [...currentTips]
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      // Update all tips with new order values
      const updatePromises = newOrder.map(() => 
        fetch('/api/admin/fishing-tips/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipIds: newOrder.map(t => t.id)
          })
        })
      )
      
      const responses = await Promise.all(updatePromises)
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        await fetchFishingTips()
        setSuccess('Fishing tips reordered successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to reorder fishing tips')
      }
    } catch (err) {
      setError('Error reordering fishing tips: ' + err)
      console.error('Error reordering fishing tips:', err)
    } finally {
      setDraggedTip(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      fishHeading: formData.get('fishHeading') as string,
      fishText: formData.get('fishText') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImageUrl: formData.get('heroImageUrl') as string,
      ctaText: formData.get('ctaText') as string,
      ctaLink: formData.get('ctaLink') as string,
      regulationsHeading: formData.get('regulationsHeading') as string,
      regulationsText: formData.get('regulationsText') as string,
      regulationsCtaText: formData.get('regulationsCtaText') as string,
      regulationsCtaLink: formData.get('regulationsCtaLink') as string,
      fishingReportHeading: formData.get('fishingReportHeading') as string,
      fishingReportText: formData.get('fishingReportText') as string,
      fishingReportDate: formData.get('fishingReportDate') as string,
      fishingCtaHeading: formData.get('fishingCtaHeading') as string,
      fishingCtaText: formData.get('fishingCtaText') as string,
      fishingCtaButtonText: formData.get('fishingCtaButtonText') as string,
      fishingCtaButtonLink: formData.get('fishingCtaButtonLink') as string,
      infoSectionHeading: formData.get('infoSectionHeading') as string,
      infoSectionSubheading: formData.get('infoSectionSubheading') as string,
      regulationsLabel: formData.get('regulationsLabel') as string,
      regulationsTextNew: formData.get('regulationsTextNew') as string,
      regulationsLinkText: formData.get('regulationsLinkText') as string,
      regulationsLinkUrl: formData.get('regulationsLinkUrl') as string,
      reportLabel: formData.get('reportLabel') as string,
      reportTextNew: formData.get('reportTextNew') as string,
      reportLastUpdated: formData.get('reportLastUpdated') as string
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter overview text paragraph"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Fish Species Management */}
                <div id="fish-species-section" className="border-b border-neutral-light pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold text-neutral-dark">Fish Species Management</h3>
                      <span className="text-sm text-neutral-dark">
                        {isSpeciesSectionCollapsed && 'Click expand to add, edit, or remove fish species'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSpeciesSectionCollapsed(!isSpeciesSectionCollapsed)}
                      className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
                    >
                      <span>{isSpeciesSectionCollapsed ? 'Expand' : 'Collapse'}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${isSpeciesSectionCollapsed ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {!isSpeciesSectionCollapsed && (
                    <>
                      {/* Add New Species */}
                      <div className="bg-neutral-light p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Add New Fish Species</h4>
                        <p className="text-sm text-neutral-dark mb-4">
                          Fill in the details below and click &quot;Add Species&quot; to create a new fish species that will appear on the fishing page.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Species Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newSpecies.name}
                              onChange={(e) => setNewSpecies({ ...newSpecies, name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="e.g., Walleye"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Order
                            </label>
                            <input
                              type="number"
                              value={newSpecies.order}
                              onChange={(e) => setNewSpecies({ ...newSpecies, order: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Fish Image
                            </label>
                            <div className="border border-gray-200 rounded-md p-3">
                              <FileUpload
                                type="image"
                                currentUrl={newSpecies.imageUrl || undefined}
                                onUpload={(url) => setNewSpecies({ ...newSpecies, imageUrl: url })}
                                onError={(error) => setError('Image upload failed: ' + error)}
                                label="Upload Fish Image"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Description
                            </label>
                            <textarea
                              value={newSpecies.description}
                              onChange={(e) => setNewSpecies({ ...newSpecies, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Brief description of the fish..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Recommended Bait
                            </label>
                            <textarea
                              value={newSpecies.bait}
                              onChange={(e) => setNewSpecies({ ...newSpecies, bait: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="e.g., Jigs with minnows, crankbaits..."
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Best Time of Day
                            </label>
                            <input
                              type="text"
                              value={newSpecies.timeOfDay}
                              onChange={(e) => setNewSpecies({ ...newSpecies, timeOfDay: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="e.g., Early morning or late evening"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Ideal Weather Conditions
                            </label>
                            <input
                              type="text"
                              value={newSpecies.weather}
                              onChange={(e) => setNewSpecies({ ...newSpecies, weather: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="e.g., Overcast days or after a cold front"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            console.log('Button clicked!')
                            handleAddSpecies()
                          }}
                          disabled={!newSpecies.name.trim()}
                          className="mt-4 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {newSpecies.name.trim() ? 'Add Species' : 'Enter species name first'}
                        </button>
                      </div>

                      {/* Existing Species */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Existing Fish Species</h4>
                        {fishSpecies.length === 0 ? (
                          <p className="text-neutral-dark italic">No fish species added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-neutral-dark mb-4">
                              Drag and drop fish species to change their display order. The order will match the public view.
                            </p>
                            {fishSpecies.map((species) => (
                              <div
                                key={species.id}
                                className={`bg-neutral-light p-4 rounded-lg cursor-move transition-all duration-200 ${
                                  draggedSpecies === species.id ? 'opacity-50 scale-95' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(e, species.id)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, species.id)}
                              >
                                {editingSpecies?.id === species.id ? (
                                  <>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-neutral-dark">Edit {species.name}</h4>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateSpecies()
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingSpecies(null)
                                          }}
                                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Name *
                                        </label>
                                        <input
                                          type="text"
                                          value={editingSpecies.name}
                                          onChange={(e) => setEditingSpecies({...editingSpecies, name: e.target.value})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Order
                                        </label>
                                        <input
                                          type="number"
                                          value={editingSpecies.order}
                                          onChange={(e) => setEditingSpecies({...editingSpecies, order: parseInt(e.target.value) || 0})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-neutral-dark mb-1">
                                        Description
                                      </label>
                                      <textarea
                                        value={editingSpecies.description || ''}
                                        onChange={(e) => setEditingSpecies({...editingSpecies, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        rows={3}
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Recommended Bait
                                        </label>
                                        <input
                                          type="text"
                                          value={editingSpecies.bait || ''}
                                          onChange={(e) => setEditingSpecies({...editingSpecies, bait: e.target.value})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Best Time of Day
                                        </label>
                                        <input
                                          type="text"
                                          value={editingSpecies.timeOfDay || ''}
                                          onChange={(e) => setEditingSpecies({...editingSpecies, timeOfDay: e.target.value})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-neutral-dark mb-1">
                                        Ideal Weather Conditions
                                      </label>
                                      <input
                                        type="text"
                                        value={editingSpecies.weather || ''}
                                        onChange={(e) => setEditingSpecies({...editingSpecies, weather: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                      />
                                    </div>
                                    <div className="mt-4">
                                      <label className="block text-sm font-medium text-neutral-dark mb-1">
                                        Fish Image
                                      </label>
                                      <div className="border border-gray-200 rounded-md p-3">
                                        <FileUpload
                                          onUpload={(url: string) => setEditingSpecies({...editingSpecies, imageUrl: url})}
                                          onError={(error: string) => setError('Image upload failed: ' + error)}
                                          type="image"
                                          currentUrl={editingSpecies.imageUrl}
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="text-gray-400 cursor-move">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-neutral-dark">{species.name}</h4>
                                          <p className="text-sm text-neutral-dark">Order: {species.order}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingSpecies(species)
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteSpecies(species.id)}
                                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                    {species.imageUrl && (
                                      <div className="mt-3">
                                        <div className="w-20 h-15 bg-gray-100 rounded overflow-hidden">
                                          <Image 
                                            src={species.imageUrl} 
                                            alt={species.name}
                                            width={80}
                                            height={60}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Fishing Info & Updates Section */}
                <div className="border-b border-neutral-light pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-neutral-dark">Fishing Info & Updates Section</h3>
                  <p className="text-sm text-neutral-dark mb-4">
                    This section combines fishing regulations and latest fishing report into a single unified section. The content will be displayed in a clean, mobile-friendly layout with clear subheadings.
                  </p>
                  
                  <div className="space-y-6">
                    {/* Section Header */}
                    <div className="bg-neutral-light p-4 rounded-lg">
                      <h4 className="text-lg font-medium mb-4 text-neutral-dark">Section Header</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            name="infoSectionHeading"
                            defaultValue={fishingData?.infoSectionHeading || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g., Fishing Info & Updates"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Section Subheading
                          </label>
                          <input
                            type="text"
                            name="infoSectionSubheading"
                            defaultValue={fishingData?.infoSectionSubheading || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g., Stay informed about regulations and current conditions"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fishing Regulations */}
                    <div className="bg-neutral-light p-4 rounded-lg">
                      <h4 className="text-lg font-medium mb-4 text-neutral-dark">Fishing Regulations</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Regulations Label
                          </label>
                          <input
                            type="text"
                            name="regulationsLabel"
                            defaultValue={fishingData?.regulationsLabel || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g., Fishing Regulations"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Regulations Text
                          </label>
                          <textarea
                            name="regulationsTextNew"
                            rows={4}
                            defaultValue={fishingData?.regulationsTextNew || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter regulations information..."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Link Text
                            </label>
                            <input
                              type="text"
                              name="regulationsLinkText"
                              defaultValue={fishingData?.regulationsLinkText || ''}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="e.g., View Full Regulations"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Link URL
                            </label>
                            <input
                              type="url"
                              name="regulationsLinkUrl"
                              defaultValue={fishingData?.regulationsLinkUrl || ''}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Latest Fishing Report */}
                    <div className="bg-neutral-light p-4 rounded-lg">
                      <h4 className="text-lg font-medium mb-4 text-neutral-dark">Latest Fishing Report</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Report Label
                          </label>
                          <input
                            type="text"
                            name="reportLabel"
                            defaultValue={fishingData?.reportLabel || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="e.g., Latest Fishing Report"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Report Text
                          </label>
                          <textarea
                            name="reportTextNew"
                            rows={6}
                            defaultValue={fishingData?.reportTextNew || ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Enter current fishing conditions and updates..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-neutral-dark mb-2">
                            Last Updated Date
                          </label>
                          <input
                            type="date"
                            name="reportLastUpdated"
                            defaultValue={fishingData?.reportLastUpdated ? new Date(fishingData.reportLastUpdated).toISOString().split('T')[0] : ''}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Select last updated date"
                          />
                          <p className="text-sm text-neutral-dark mt-1">
                            Optional: Leave empty to hide the &quot;Last updated on&quot; label
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stay Connected CTA Section */}
                <div className="border-b border-neutral-light pb-6">
                  <h3 className="text-xl font-semibold mb-4 text-neutral-dark">Stay Connected CTA Section</h3>
                  <p className="text-sm text-neutral-dark mb-4">
                    This section appears at the bottom of the fishing page, above the footer. Leave fields empty to hide the section.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        CTA Heading
                      </label>
                      <input
                        type="text"
                        name="fishingCtaHeading"
                        defaultValue={fishingData?.fishingCtaHeading || ''}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., Stay Connected with the Lake Association"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        CTA Text
                      </label>
                      <textarea
                        name="fishingCtaText"
                        rows={4}
                        defaultValue={fishingData?.fishingCtaText || ''}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., Want the latest fishing updates, lake news, and event info? Join our email list or contact us today."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          name="fishingCtaButtonText"
                          defaultValue={fishingData?.fishingCtaButtonText || ''}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., Join the Mailing List"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-dark mb-2">
                          Button Link
                        </label>
                        <input
                          type="text"
                          name="fishingCtaButtonLink"
                          defaultValue={fishingData?.fishingCtaButtonLink || ''}
                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          placeholder="e.g., /contact"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fishing Gallery Management */}
                <div className="border-b border-neutral-light pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold text-neutral-dark">Fishing Photo Gallery Management</h3>
                      <span className="text-sm text-neutral-dark">
                        {isGallerySectionCollapsed && 'Click expand to add, edit, or remove gallery images'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsGallerySectionCollapsed(!isGallerySectionCollapsed)}
                      className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
                    >
                      <span>{isGallerySectionCollapsed ? 'Expand' : 'Collapse'}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${isGallerySectionCollapsed ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {!isGallerySectionCollapsed && (
                    <>
                      {/* Add New Gallery Image */}
                      <div className="bg-neutral-light p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Add New Gallery Image</h4>
                        <p className="text-sm text-neutral-dark mb-4">
                          Upload an image and provide details to add it to the fishing photo gallery.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Image <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-200 rounded-md p-3">
                              <FileUpload
                                type="image"
                                currentUrl={newGalleryImage.imageUrl || undefined}
                                onUpload={(url) => setNewGalleryImage({ ...newGalleryImage, imageUrl: url })}
                                onError={(error) => setError('Image upload failed: ' + error)}
                                label="Upload Gallery Image"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Alt Text <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newGalleryImage.altText}
                              onChange={(e) => setNewGalleryImage({ ...newGalleryImage, altText: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Describe the image for accessibility"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Caption (Optional)
                            </label>
                            <input
                              type="text"
                              value={newGalleryImage.caption}
                              onChange={(e) => setNewGalleryImage({ ...newGalleryImage, caption: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Optional caption for the image"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Order
                            </label>
                            <input
                              type="number"
                              value={newGalleryImage.order}
                              onChange={(e) => setNewGalleryImage({ ...newGalleryImage, order: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          disabled={!newGalleryImage.imageUrl.trim() || !newGalleryImage.altText.trim()}
                          className="mt-4 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {newGalleryImage.imageUrl.trim() && newGalleryImage.altText.trim() ? 'Add Image' : 'Upload image and enter alt text first'}
                        </button>
                      </div>

                      {/* Existing Gallery Images */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Existing Gallery Images</h4>
                        {galleryImages.length === 0 ? (
                          <p className="text-neutral-dark italic">No gallery images added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-neutral-dark mb-4">
                              Drag and drop images to change their display order. The order will match the public view.
                            </p>
                            {galleryImages.map((image) => (
                              <div
                                key={image.id}
                                className={`bg-neutral-light p-4 rounded-lg cursor-move transition-all duration-200 ${
                                  draggedGalleryImage === image.id ? 'opacity-50 scale-95' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleGalleryDragStart(e, image.id)}
                                onDragOver={handleGalleryDragOver}
                                onDrop={(e) => handleGalleryDrop(e, image.id)}
                              >
                                {editingGalleryImage?.id === image.id ? (
                                  <>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-neutral-dark">Edit Gallery Image</h4>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateGalleryImage()
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingGalleryImage(null)
                                          }}
                                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Image
                                        </label>
                                        <div className="border border-gray-200 rounded-md p-3">
                                          <FileUpload
                                            type="image"
                                            currentUrl={editingGalleryImage.imageUrl}
                                            onUpload={(url) => setEditingGalleryImage({...editingGalleryImage, imageUrl: url})}
                                            onError={(error) => setError('Image upload failed: ' + error)}
                                            label="Update Image"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Alt Text *
                                        </label>
                                        <input
                                          type="text"
                                          value={editingGalleryImage.altText}
                                          onChange={(e) => setEditingGalleryImage({...editingGalleryImage, altText: e.target.value})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Caption
                                        </label>
                                        <input
                                          type="text"
                                          value={editingGalleryImage.caption || ''}
                                          onChange={(e) => setEditingGalleryImage({...editingGalleryImage, caption: e.target.value})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Order
                                        </label>
                                        <input
                                          type="number"
                                          value={editingGalleryImage.order}
                                          onChange={(e) => setEditingGalleryImage({...editingGalleryImage, order: parseInt(e.target.value) || 0})}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="text-gray-400 cursor-move">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                          </svg>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-neutral-dark">{image.altText}</h4>
                                          <p className="text-sm text-neutral-dark">Order: {image.order}</p>
                                          {image.caption && (
                                            <p className="text-sm text-neutral-dark italic">{image.caption}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingGalleryImage(image)
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteGalleryImage(image.id)}
                                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                    <div className="mt-3">
                                      <div className="w-20 h-15 bg-gray-100 rounded overflow-hidden">
                                        <Image 
                                          src={image.imageUrl} 
                                          alt={image.altText}
                                          width={80}
                                          height={60}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Fishing Tips Management */}
                <div className="border-b border-neutral-light pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold text-neutral-dark">Fishing Tips Management</h3>
                      <span className="text-sm text-neutral-dark">
                        {isTipsSectionCollapsed && 'Click expand to add, edit, or remove fishing tips'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsTipsSectionCollapsed(!isTipsSectionCollapsed)}
                      className="flex items-center gap-2 text-primary hover:text-accent transition-colors"
                    >
                      <span>{isTipsSectionCollapsed ? 'Expand' : 'Collapse'}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${isTipsSectionCollapsed ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {!isTipsSectionCollapsed && (
                    <>
                      {/* Add New Tip */}
                      <div className="bg-neutral-light p-4 rounded-lg mb-6">
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Add New Fishing Tip</h4>
                        <p className="text-sm text-neutral-dark mb-4">
                          Add a new fishing tip that will appear on the fishing page. Tips are displayed in a responsive grid layout.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Tip Text <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={newTip.text}
                              onChange={(e) => setNewTip({ ...newTip, text: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              rows={3}
                              placeholder="Enter the fishing tip..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark mb-2">
                              Submitted By (optional)
                            </label>
                            <input
                              type="text"
                              value={newTip.submittedBy}
                              onChange={(e) => setNewTip({ ...newTip, submittedBy: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                              placeholder="Enter the submitter's name..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleAddTip}
                            disabled={!newTip.text.trim()}
                            className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {newTip.text.trim() ? 'Add Tip' : 'Enter tip text first'}
                          </button>
                        </div>
                      </div>

                      {/* Existing Tips */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 text-neutral-dark">Existing Fishing Tips</h4>
                        {fishingTips.length === 0 ? (
                          <p className="text-neutral-dark italic">No fishing tips added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-sm text-neutral-dark mb-4">
                              Drag and drop tips to change their display order. The order will match the public view.
                            </p>
                            {fishingTips.map((tip) => (
                              <div
                                key={tip.id}
                                className={`bg-neutral-light p-4 rounded-lg cursor-move transition-all duration-200 ${
                                  draggedTip === tip.id ? 'opacity-50 scale-95' : ''
                                }`}
                                draggable
                                onDragStart={(e) => handleTipDragStart(e, tip.id)}
                                onDragOver={handleTipDragOver}
                                onDrop={(e) => handleTipDrop(e, tip.id)}
                              >
                                {editingTip?.id === tip.id ? (
                                  <>
                                    <div className="flex items-center justify-between mb-4">
                                      <h4 className="font-semibold text-neutral-dark">Edit Fishing Tip</h4>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            handleUpdateTip()
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Save
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingTip(null)
                                          }}
                                          className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Tip Text *
                                        </label>
                                        <textarea
                                          value={editingTip.text}
                                          onChange={(e) => setEditingTip({ ...editingTip, text: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                          rows={3}
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-dark mb-1">
                                          Submitted By (optional)
                                        </label>
                                        <input
                                          type="text"
                                          value={editingTip.submittedBy || ''}
                                          onChange={(e) => setEditingTip({ ...editingTip, submittedBy: e.target.value })}
                                          className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="text-gray-400 cursor-move">
                                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-neutral-dark leading-relaxed mb-2">{tip.text}</p>
                                          {tip.submittedBy && (
                                            <p className="text-sm text-neutral-dark italic">
                                              — {tip.submittedBy}
                                            </p>
                                          )}
                                          <p className="text-xs text-neutral-dark">Order: {tip.order + 1}</p>
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault()
                                            setEditingTip(tip)
                                          }}
                                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTip(tip.id)}
                                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
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