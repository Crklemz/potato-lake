'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

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

  const handleSave = (resource: Partial<Resource>) => {
    // TODO: Implement API call to save resource
    console.log('Saving resource:', resource)
    setEditingResource(null)
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    // TODO: Implement API call to delete resource
    console.log('Deleting resource:', id)
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
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Resources</h1>
            <button
              onClick={() => router.push('/admin')}
              className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

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

            <div className="space-y-4">
              {/* Sample Resources */}
              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-dark">2024 Fishing Regulations</h3>
                    <p className="text-neutral-dark text-sm">Updated fishing regulations for Potato Lake</p>
                    <p className="text-neutral-dark text-sm">Category: Fishing Regulations</p>
                    <a href="#" className="text-accent hover:text-primary text-sm font-semibold">
                      View File →
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingResource({ id: 1, title: '2024 Fishing Regulations', description: 'Updated fishing regulations for Potato Lake', fileUrl: '/files/regulations.pdf', category: 'Fishing Regulations' })}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(1)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-dark">Lake Map 2024</h3>
                    <p className="text-neutral-dark text-sm">Detailed map of Potato Lake with depth contours</p>
                    <p className="text-neutral-dark text-sm">Category: Lake Maps</p>
                    <a href="#" className="text-accent hover:text-primary text-sm font-semibold">
                      View File →
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingResource({ id: 2, title: 'Lake Map 2024', description: 'Detailed map of Potato Lake with depth contours', fileUrl: '/files/lake-map.pdf', category: 'Lake Maps' })}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(2)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-dark">January 2024 Meeting Minutes</h3>
                    <p className="text-neutral-dark text-sm">Minutes from the January association meeting</p>
                    <p className="text-neutral-dark text-sm">Category: Meeting Minutes</p>
                    <a href="#" className="text-accent hover:text-primary text-sm font-semibold">
                      View File →
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingResource({ id: 3, title: 'January 2024 Meeting Minutes', description: 'Minutes from the January association meeting', fileUrl: '/files/january-minutes.pdf', category: 'Meeting Minutes' })}
                      className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(3)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingResource) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Resource Title
                  </label>
                  <input
                    type="text"
                    defaultValue={editingResource?.title || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter resource title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue={editingResource?.description || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter resource description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    File URL or Upload
                  </label>
                  <input
                    type="url"
                    defaultValue={editingResource?.fileUrl || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter file URL or upload file"
                  />
                  <p className="text-sm text-neutral-dark mt-1">
                    For file uploads, drag and drop files here or click to browse
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Category
                  </label>
                  <select
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
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
                  >
                    {editingResource ? 'Update Resource' : 'Add Resource'}
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