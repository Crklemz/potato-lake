'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SponsorsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Sponsors</h1>
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
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">
              Area Services Management
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter heading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter description"
                />
              </div>

              <div className="flex gap-4">
                <button className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors">
                  Save Changes
                </button>
                <button className="bg-neutral-light text-neutral-dark px-6 py-2 rounded-md font-semibold hover:bg-accent transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-dark">Sponsor Listings</h3>
              <button className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors">
                Add New Sponsor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-neutral-light rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="h-16 bg-accent rounded flex items-center justify-center mb-2">
                    <span className="text-primary text-sm">Logo</span>
                  </div>
                  <h4 className="font-semibold text-neutral-dark">Local Restaurant</h4>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors flex-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex-1">
                    Delete
                  </button>
                </div>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="h-16 bg-accent rounded flex items-center justify-center mb-2">
                    <span className="text-primary text-sm">Logo</span>
                  </div>
                  <h4 className="font-semibold text-neutral-dark">Bait & Tackle Shop</h4>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors flex-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex-1">
                    Delete
                  </button>
                </div>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="h-16 bg-accent rounded flex items-center justify-center mb-2">
                    <span className="text-primary text-sm">Logo</span>
                  </div>
                  <h4 className="font-semibold text-neutral-dark">Marina Services</h4>
                </div>
                <div className="flex gap-2">
                  <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors flex-1">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex-1">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 