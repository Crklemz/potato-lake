'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import FileUpload from '@/components/FileUpload'
import AdminHeader from '@/components/AdminHeader'

interface NewsPageData {
  id: number
  mainHeading: string
  heroTitle: string
  heroSubtitle: string | null
  heroImageUrl: string | null
  events: Array<{
    id: number
    title: string
    date: string
    description: string
    imageUrl: string | null
  }>
  news: Array<{
    id: number
    title: string
    content: string
    date: string
    imageUrl: string | null
  }>
}

export default function NewsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newsPageData, setNewsPageData] = useState<NewsPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchNewsPageData()
  }, [session, status, router])

  const fetchNewsPageData = async () => {
    try {
      const response = await fetch('/api/admin/news-page')
      if (response.ok) {
        const data = await response.json()
        setNewsPageData(data)
      } else {
        setError('Failed to load news page data')
      }
    } catch (err) {
      setError('Error loading news page data: ' + err)
      console.error('Error loading news page data:', err)
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
      const response = await fetch('/api/admin/news-page', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsPageData),
      })

      if (response.ok) {
        setSuccess('News page updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update news page')
      }
    } catch (err) {
      setError('Error updating news page: ' + err)
      console.error('Error updating news page:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof NewsPageData, value: string | null) => {
    if (!newsPageData) return
    setNewsPageData({
      ...newsPageData,
      [field]: value,
    })
  }

  const handleImageUpload = (imageUrl: string) => {
    handleInputChange('heroImageUrl', imageUrl)
  }

  const handleImageError = (error: string) => {
    setError(error)
  }

  const handleRemoveImage = () => {
    handleInputChange('heroImageUrl', null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <AdminHeader title="Edit News Page" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-dark rounded mb-4"></div>
            <div className="h-6 bg-neutral-dark rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-neutral-dark rounded"></div>
              <div className="h-12 bg-neutral-dark rounded"></div>
              <div className="h-12 bg-neutral-dark rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!newsPageData) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <AdminHeader title="Edit News Page" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-dark mb-4">Error</h1>
            <p className="text-neutral-dark">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <AdminHeader title="Edit News Page" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-dark mb-8">Edit News Page</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-neutral-dark mb-6">Hero Section</h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="heroTitle" className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    id="heroTitle"
                    value={newsPageData.heroTitle}
                    onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="heroSubtitle" className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Subtitle
                  </label>
                  <textarea
                    id="heroSubtitle"
                    value={newsPageData.heroSubtitle || ''}
                    onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Optional subtitle for the hero section"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Hero Image
                  </label>
                  {newsPageData.heroImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                          src={newsPageData.heroImageUrl}
                          alt="Hero"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                                     ) : (
                     <FileUpload
                       onUpload={handleImageUpload}
                       onError={handleImageError}
                       type="image"
                       accept="image/*"
                       className="w-full"
                     />
                   )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-neutral-dark mb-6">Main Content</h2>
              
              <div>
                <label htmlFor="mainHeading" className="block text-sm font-medium text-neutral-dark mb-2">
                  Main Heading
                </label>
                <input
                  type="text"
                  id="mainHeading"
                  value={newsPageData.mainHeading}
                  onChange={(e) => handleInputChange('mainHeading', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Events Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-neutral-dark mb-6">Events Summary</h2>
              <p className="text-neutral-dark mb-4">
                Currently {newsPageData.events.length} events are configured.
              </p>
              <a
                href="/admin/events-edit"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Manage Events
              </a>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="px-6 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral-dark hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-accent transition-colors disabled:opacity-50"
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