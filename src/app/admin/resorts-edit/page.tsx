'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import FileUpload from '@/components/FileUpload'
import AdminHeader from '@/components/AdminHeader'

interface Resort {
  id: number
  name: string
  address: string
  phone: string
  imageUrl: string | null
  description: string | null
  websiteUrl: string | null
  order: number
}

interface ResortsPageData {
  id: number
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  sectionHeading: string
  sectionText: string
}

export default function ResortsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resorts, setResorts] = useState<Resort[]>([])
  const [pageData, setPageData] = useState<ResortsPageData | null>(null)
  const [editingResort, setEditingResort] = useState<Resort | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [draggedResort, setDraggedResort] = useState<number | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchResorts()
      fetchPageData()
    }
  }, [status, router])

  const fetchResorts = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/resorts')
      if (!response.ok) throw new Error('Failed to fetch resorts')
      const data = await response.json()
      setResorts(data)
    } catch (err) {
      setError('Failed to load resorts: ' + err)
      console.error('Error fetching resorts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPageData = async () => {
    try {
      const response = await fetch('/api/admin/resorts-page')
      if (!response.ok) throw new Error('Failed to fetch page data')
      const data = await response.json()
      setPageData(data)
      setHeroImageUrl(data.heroImageUrl)
    } catch (err) {
      console.error('Error fetching page data:', err)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const resortData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      imageUrl: currentImageUrl || formData.get('imageUrl') as string,
      description: formData.get('description') as string,
      websiteUrl: formData.get('websiteUrl') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const url = '/api/admin/resorts'
      const method = editingResort ? 'PUT' : 'POST'
      const body = editingResort ? { ...resortData, id: editingResort.id } : resortData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save resort')

      setSuccess(editingResort ? 'Resort updated successfully!' : 'Resort added successfully!')
      await fetchResorts()
      setEditingResort(null)
      setIsAdding(false)
      setCurrentImageUrl(null)
    } catch (err) {
      setError('Failed to save resort: ' + err)
      console.error('Error saving resort:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resort?')) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/resorts?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete resort')

      setSuccess('Resort deleted successfully!')
      await fetchResorts()
    } catch (err) {
      setError('Failed to delete resort: ' + err)
      console.error('Error deleting resort:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageDataSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const pageDataToSave = {
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      heroImageUrl: heroImageUrl,
      ctaText: formData.get('ctaText') as string,
      ctaLink: formData.get('ctaLink') as string,
      sectionHeading: formData.get('sectionHeading') as string,
      sectionText: formData.get('sectionText') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/resorts-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageDataToSave)
      })

      if (!response.ok) throw new Error('Failed to save page data')

      setSuccess('Page settings updated successfully!')
      await fetchPageData()
    } catch (err) {
      setError('Failed to save page data: ' + err)
      console.error('Error saving page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, resortId: number) => {
    setDraggedResort(resortId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetResortId: number) => {
    e.preventDefault()
    
    if (!draggedResort || draggedResort === targetResortId) {
      setDraggedResort(null)
      return
    }

    try {
      const currentResorts = [...resorts]
      const draggedIndex = currentResorts.findIndex(resort => resort.id === draggedResort)
      const targetIndex = currentResorts.findIndex(resort => resort.id === targetResortId)
      
      if (draggedIndex === -1 || targetIndex === -1) return
      
      // Create new order array
      const newOrder = [...currentResorts]
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      // Update all resorts with new order values
      const updatePromises = newOrder.map((resort, index) => 
        fetch('/api/admin/resorts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: resort.id,
            name: resort.name,
            address: resort.address,
            phone: resort.phone,
            imageUrl: resort.imageUrl,
            description: resort.description,
            websiteUrl: resort.websiteUrl,
            order: index
          })
        })
      )
      
      const responses = await Promise.all(updatePromises)
      const allSuccessful = responses.every(response => response.ok)
      
      if (allSuccessful) {
        await fetchResorts()
        setSuccess('Resorts reordered successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to reorder resorts')
      }
    } catch (err) {
      setError('Error reordering resorts: ' + err)
      console.error('Error reordering resorts:', err)
    } finally {
      setDraggedResort(null)
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
      <AdminHeader title="Manage Resorts" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Settings Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-neutral-dark mb-6">
              Page Settings
            </h2>
            
            {pageData && (
              <form onSubmit={handlePageDataSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      name="heroTitle"
                      defaultValue={pageData.heroTitle}
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
                      defaultValue={pageData.heroSubtitle || ''}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter hero subtitle"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Background Image
                  </label>
                  <FileUpload
                    type="image"
                    currentUrl={heroImageUrl}
                    onUpload={(url) => {
                      setHeroImageUrl(url)
                      setUploadError(null)
                    }}
                    onError={(error) => {
                      setUploadError(error)
                    }}
                    label="Upload Hero Image"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      name="ctaText"
                      defaultValue={pageData.ctaText || ''}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter CTA button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      name="ctaLink"
                      defaultValue={pageData.ctaLink || ''}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter CTA button link"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    name="sectionHeading"
                    defaultValue={pageData.sectionHeading}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter section heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Section Text
                  </label>
                  <textarea
                    name="sectionText"
                    rows={4}
                    defaultValue={pageData.sectionText}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter section text"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Page Settings'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark">
                Resorts Directory
              </h2>
              <button
                onClick={() => {
                  setIsAdding(true)
                  setCurrentImageUrl(null)
                }}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Resort
              </button>
            </div>

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

            {isLoading && !resorts.length ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading resorts...</div>
              </div>
            ) : resorts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">No resorts found. Add your first resort!</div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-neutral-dark mb-4">
                  Drag and drop resorts to change their display order. The order will match the public view (2 columns).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {resorts.map((resort) => (
                  <div 
                    key={resort.id} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden cursor-move transition-all duration-200 ${
                      draggedResort === resort.id ? 'opacity-50 scale-95' : ''
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, resort.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, resort.id)}
                  >
                    <div className="h-48 bg-accent flex items-center justify-center">
                      {resort.imageUrl ? (
                        <div className="w-full h-full relative">
                          <Image 
                            src={resort.imageUrl} 
                            alt={resort.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <span className="text-primary font-semibold">Resort Image</span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-neutral-dark">{resort.name}</h3>
                      <p className="text-neutral-dark mb-4">{resort.address}</p>
                      <p className="text-neutral-dark mb-4">Phone: {resort.phone}</p>
                      {resort.description && (
                        <p className="text-neutral-dark mb-4 text-sm">{resort.description}</p>
                      )}
                      {resort.websiteUrl && (
                        <a 
                          href={resort.websiteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-primary font-semibold"
                        >
                          Visit Website →
                        </a>
                      )}
                      <div className="mt-4 pt-4 border-t border-neutral-light">
                        <p className="text-neutral-dark text-sm mb-3">
                          <strong>Admin Position:</strong> {resort.order + 1} of {resorts.length}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingResort(resort)
                              setCurrentImageUrl(null)
                            }}
                            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                            disabled={isLoading}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(resort.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingResort) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingResort ? 'Edit Resort' : 'Add New Resort'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Resort Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingResort?.name || ''}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter resort name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingResort?.phone || ''}
                      className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={editingResort?.address || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    defaultValue={editingResort?.websiteUrl || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter website URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Resort Image
                  </label>
                  <FileUpload
                    type="image"
                    currentUrl={currentImageUrl || editingResort?.imageUrl}
                    onUpload={(url) => {
                      setCurrentImageUrl(url)
                      setUploadError(null)
                    }}
                    onError={(error) => {
                      setUploadError(error)
                    }}
                    label="Upload Resort Image"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                  )}
                  
                  <input
                    type="hidden"
                    name="imageUrl"
                    defaultValue={editingResort?.imageUrl || ''}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editingResort?.description || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter resort description"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResort(null)
                      setIsAdding(false)
                      setCurrentImageUrl(null)
                    }}
                    className="bg-neutral-light text-neutral-dark px-6 py-2 rounded-md font-semibold hover:bg-accent transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (editingResort ? 'Update Resort' : 'Add Resort')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 