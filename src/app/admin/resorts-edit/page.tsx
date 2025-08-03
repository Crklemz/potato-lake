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
}

export default function ResortsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resorts, setResorts] = useState<Resort[]>([])
  const [editingResort, setEditingResort] = useState<Resort | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchResorts()
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const resortData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      imageUrl: formData.get('imageUrl') as string,
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
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark">
                Resorts Directory
              </h2>
              <button
                onClick={() => setIsAdding(true)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resorts.map((resort) => (
                  <div key={resort.id} className="border border-neutral-light rounded-lg p-4">
                    <div className="mb-4">
                      {resort.imageUrl ? (
                        <div className="w-full h-32 relative rounded-lg">
                          <Image 
                            src={resort.imageUrl} 
                            alt={resort.name}
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
                    <h3 className="font-semibold text-neutral-dark mb-2">{resort.name}</h3>
                    <p className="text-neutral-dark text-sm mb-1">{resort.address}</p>
                    <p className="text-neutral-dark text-sm mb-2">{resort.phone}</p>
                    {resort.description && (
                      <p className="text-neutral-dark text-sm mb-2 line-clamp-2">{resort.description}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => setEditingResort(resort)}
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
                ))}
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
                    currentUrl={editingResort?.imageUrl}
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