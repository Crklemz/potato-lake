'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DnrPageData {
  id: number
  dnrHeading: string
  dnrText: string
  mapUrl: string | null
}

export default function DnrEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dnrData, setDnrData] = useState<DnrPageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchDnrData()
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
    } catch (err) {
      setError('Failed to load DNR page data')
      console.error('Error fetching DNR page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      dnrHeading: formData.get('dnrHeading') as string,
      dnrText: formData.get('dnrText') as string,
      mapUrl: formData.get('mapUrl') as string
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
      setError('Failed to update DNR page')
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
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit DNR Page</h1>
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