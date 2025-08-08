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

interface Event {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string | null
}

interface News {
  id: number
  title: string
  date: string
  content: string
  imageUrl: string | null
}

export default function NewsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [newsPageData, setNewsPageData] = useState<NewsPageData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [news, setNews] = useState<News[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [isAddingNews, setIsAddingNews] = useState(false)
  const [activeTab, setActiveTab] = useState<'page' | 'events' | 'news'>('page')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/admin/login')
      return
    }

    fetchNewsPageData()
    fetchEvents()
    fetchNews()
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

  const fetchEvents = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError('Failed to load events: ' + err)
      console.error('Error fetching events:', err)
    }
  }

  const fetchNews = async () => {
    try {
      setError(null)
      const response = await fetch('/api/admin/news')
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data)
    } catch (err) {
      setError('Failed to load news: ' + err)
      console.error('Error fetching news:', err)
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

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const eventData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const url = '/api/admin/events'
      const method = editingEvent ? 'PUT' : 'POST'
      const body = editingEvent ? { ...eventData, id: editingEvent.id } : eventData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save event')

      setSuccess(editingEvent ? 'Event updated successfully!' : 'Event added successfully!')
      await fetchEvents()
      setEditingEvent(null)
      setIsAddingEvent(false)
      setUploadedImageUrl(null)
    } catch (err) {
      setError('Failed to save event: ' + err)
      console.error('Error saving event:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newsData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      content: formData.get('content') as string,
      imageUrl: formData.get('imageUrl') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const url = '/api/admin/news'
      const method = editingNews ? 'PUT' : 'POST'
      const body = editingNews ? { ...newsData, id: editingNews.id } : newsData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save news')

      setSuccess(editingNews ? 'News updated successfully!' : 'News added successfully!')
      await fetchNews()
      setEditingNews(null)
      setIsAddingNews(false)
      setUploadedImageUrl(null)
    } catch (err) {
      setError('Failed to save news: ' + err)
      console.error('Error saving news:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete event')

      setSuccess('Event deleted successfully!')
      await fetchEvents()
    } catch (err) {
      setError('Failed to delete event: ' + err)
      console.error('Error deleting event:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNews = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news item?')) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/news?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete news')

      setSuccess('News deleted successfully!')
      await fetchNews()
    } catch (err) {
      setError('Failed to delete news: ' + err)
      console.error('Error deleting news:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-dark mb-8">News & Events Management</h1>

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

          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-light mb-6">
            <button
              onClick={() => setActiveTab('page')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'page'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              Page Content
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'events'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'news'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-dark hover:text-primary'
              }`}
            >
              News
            </button>
          </div>

          {/* Page Content Tab */}
          {activeTab === 'page' && (
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
          )}

          {/* Events Tab Content */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-neutral-dark">
                  Events Management
                </h2>
                <button
                  onClick={() => setIsAddingEvent(true)}
                  className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
                >
                  Add New Event
                </button>
              </div>

              {isLoading && !events.length ? (
                <div className="text-center py-8">
                  <div className="text-neutral-dark">Loading events...</div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-neutral-dark">No events found. Add your first event!</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event.id} className="border border-neutral-light rounded-lg p-4">
                      <div className="mb-4">
                        {event.imageUrl ? (
                          <div className="w-full h-32 relative rounded-lg">
                            <Image 
                              src={event.imageUrl} 
                              alt={event.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-accent flex items-center justify-center rounded-lg">
                            <span className="text-primary font-semibold">No Image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-neutral-dark mb-2">{event.title}</h3>
                      <p className="text-accent text-sm mb-2 font-semibold">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-neutral-dark text-sm mb-3 line-clamp-3">{event.description}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingEvent(event)}
                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* News Tab Content */}
          {activeTab === 'news' && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-neutral-dark">
                  News Management
                </h2>
                <button
                  onClick={() => setIsAddingNews(true)}
                  className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
                >
                  Add New News
                </button>
              </div>

              {isLoading && !news.length ? (
                <div className="text-center py-8">
                  <div className="text-neutral-dark">Loading news...</div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-neutral-dark">No news found. Add your first news item!</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.map((newsItem) => (
                    <div key={newsItem.id} className="border border-neutral-light rounded-lg p-4">
                      <div className="mb-4">
                        {newsItem.imageUrl ? (
                          <div className="w-full h-32 relative rounded-lg">
                            <Image 
                              src={newsItem.imageUrl} 
                              alt={newsItem.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-32 bg-accent flex items-center justify-center rounded-lg">
                            <span className="text-primary font-semibold">No Image</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-neutral-dark mb-2">{newsItem.title}</h3>
                      <p className="text-accent text-sm mb-2 font-semibold">
                        {formatDate(newsItem.date)}
                      </p>
                      <p className="text-neutral-dark text-sm mb-3 line-clamp-3">{newsItem.content}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingNews(newsItem)}
                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteNews(newsItem.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Event Form */}
          {(isAddingEvent || editingEvent) && (
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              
              <form onSubmit={handleSaveEvent} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingEvent?.title || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingEvent?.date ? editingEvent.date.split('T')[0] : ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Event Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={editingEvent?.description || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter event description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Event Image
                  </label>
                  <FileUpload
                    type="image"
                    currentUrl={editingEvent?.imageUrl}
                    onUpload={(url) => {
                      setUploadedImageUrl(url)
                      setUploadError(null)
                    }}
                    onError={(error) => {
                      setUploadError(error)
                    }}
                    label="Upload Event Image"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                  )}
                  
                  {/* Image Preview */}
                  {(uploadedImageUrl || editingEvent?.imageUrl) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Image Preview
                      </label>
                      <div className="w-full max-w-md h-48 relative rounded-lg overflow-hidden border border-neutral-light">
                        <Image 
                          src={uploadedImageUrl || editingEvent?.imageUrl || ''} 
                          alt="Event preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={uploadedImageUrl || editingEvent?.imageUrl || ''}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null)
                      setIsAddingEvent(false)
                      setUploadedImageUrl(null)
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
                    {isLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add/Edit News Form */}
          {(isAddingNews || editingNews) && (
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingNews ? 'Edit News' : 'Add New News'}
              </h3>
              
              <form onSubmit={handleSaveNews} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    News Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingNews?.title || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter news title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    News Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingNews?.date ? editingNews.date.split('T')[0] : ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    News Content
                  </label>
                  <textarea
                    name="content"
                    rows={6}
                    defaultValue={editingNews?.content || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter news content"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    News Image
                  </label>
                  <FileUpload
                    type="image"
                    currentUrl={editingNews?.imageUrl}
                    onUpload={(url) => {
                      setUploadedImageUrl(url)
                      setUploadError(null)
                    }}
                    onError={(error) => {
                      setUploadError(error)
                    }}
                    label="Upload News Image"
                    accept="image/*"
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                  )}
                  
                  {/* Image Preview */}
                  {(uploadedImageUrl || editingNews?.imageUrl) && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-dark mb-2">
                        Image Preview
                      </label>
                      <div className="w-full max-w-md h-48 relative rounded-lg overflow-hidden border border-neutral-light">
                        <Image 
                          src={uploadedImageUrl || editingNews?.imageUrl || ''} 
                          alt="News preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="hidden"
                    name="imageUrl"
                    value={uploadedImageUrl || editingNews?.imageUrl || ''}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNews(null)
                      setIsAddingNews(false)
                      setUploadedImageUrl(null)
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
                    {isLoading ? 'Saving...' : (editingNews ? 'Update News' : 'Add News')}
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