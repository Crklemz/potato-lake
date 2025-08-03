'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FileUpload from '@/components/FileUpload'
import AdminHeader from '@/components/AdminHeader'

interface Resource {
  id: number
  title: string
  description?: string
  fileUrl: string
  category?: string
}

export default function ResourcesEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [resources, setResources] = useState<Resource[]>([])
  const [editingResource, setEditingResource] = useState<Resource | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchResources()
    }
  }, [status, router])

  const fetchResources = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/resources')
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (err) {
      setError('Failed to load resources')
      console.error('Error fetching resources:', err)
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

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const resourceData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      fileUrl: formData.get('fileUrl') as string,
      category: formData.get('category') as string
    }

    try {
      setIsLoading(true)
      setError(null)

      const url = '/api/admin/resources'
      const method = editingResource ? 'PUT' : 'POST'
      const body = editingResource ? { ...resourceData, id: editingResource.id } : resourceData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save resource')

      await fetchResources()
      setEditingResource(null)
      setIsAdding(false)
    } catch (err) {
      setError('Failed to save resource')
      console.error('Error saving resource:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete resource')

      await fetchResources()
    } catch (err) {
      setError('Failed to delete resource')
      console.error('Error deleting resource:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    'Fishing Regulations',
    'Lake Maps',
    'Meeting Minutes',
    'Newsletters',
    'Forms',
    'Other'
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      <AdminHeader title="Manage Resources" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark">
                Resources Library
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Resource
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {isLoading && !resources.length ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading resources...</div>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">No resources found. Add your first resource!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {resources.map((resource) => (
                  <div key={resource.id} className="border border-neutral-light rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-dark">{resource.title}</h3>
                        <p className="text-neutral-dark text-sm">{resource.description}</p>
                        <p className="text-neutral-dark text-sm">Category: {resource.category}</p>
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-primary text-sm font-semibold">
                          View File →
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingResource(resource)}
                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(resource.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                          disabled={isLoading}
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

          {/* Add/Edit Form */}
          {(isAdding || editingResource) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingResource?.title || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter resource title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editingResource?.description || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter resource description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Resource File
                  </label>
                  <FileUpload
                    type="file"
                    currentUrl={editingResource?.fileUrl}
                    onUpload={(url) => {
                      // Update the form field with the uploaded URL
                      const fileUrlInput = document.querySelector('input[name="fileUrl"]') as HTMLInputElement
                      if (fileUrlInput) {
                        fileUrlInput.value = url
                      }
                      setUploadError(null)
                    }}
                    onError={(error) => {
                      setUploadError(error)
                    }}
                    label="Upload Resource File"
                    accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,image/*"
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                  {uploadError && (
                    <div className="mt-2 text-sm text-red-600">{uploadError}</div>
                  )}
                  <input
                    type="hidden"
                    name="fileUrl"
                    defaultValue={editingResource?.fileUrl || ''}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingResource?.category || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResource(null)
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
                    {isLoading ? 'Saving...' : (editingResource ? 'Update Resource' : 'Add Resource')}
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