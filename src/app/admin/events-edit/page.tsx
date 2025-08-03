'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import AdminHeader from '@/components/AdminHeader'

interface Event {
  id: number
  title: string
  date: string
  description: string
  imageUrl: string | null
}

export default function EventsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchEvents()
    }
  }, [status, router])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError('Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
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
      setIsAdding(false)
    } catch (err) {
      setError('Failed to save event')
      console.error('Error saving event:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
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
      setError('Failed to delete event')
      console.error('Error deleting event:', err)
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
      <AdminHeader title="Manage Events" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark">
                News & Events
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Event
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
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-lg"
                        />
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
                        onClick={() => handleDelete(event.id)}
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

          {/* Add/Edit Form */}
          {(isAdding || editingEvent) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
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
                      // Update the form field with the uploaded URL
                      const imageUrlInput = document.querySelector('input[name="imageUrl"]') as HTMLInputElement
                      if (imageUrlInput) {
                        imageUrlInput.value = url
                      }
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
                  <input
                    type="hidden"
                    name="imageUrl"
                    defaultValue={editingEvent?.imageUrl || ''}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEvent(null)
                      setIsAdding(false)
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
        </div>
      </div>
    </div>
  )
} 