'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminHeader from '@/components/AdminHeader'

interface AssociationPageData {
  id: number
  heading: string
  description: string
  meetingNotes: string | null
}

export default function AssociationEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [associationData, setAssociationData] = useState<AssociationPageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchAssociationData()
    }
  }, [status, router])

  const fetchAssociationData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/association-page')
      if (!response.ok) throw new Error('Failed to fetch association page data')
      const data = await response.json()
      setAssociationData(data)
    } catch (err) {
      setError('Failed to load association page data: ' + err)
      console.error('Error fetching association page data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const updateData = {
      heading: formData.get('heading') as string,
      description: formData.get('description') as string,
      meetingNotes: formData.get('meetingNotes') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/association-page', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) throw new Error('Failed to update association page')

      setSuccess('Association page updated successfully!')
      await fetchAssociationData()
    } catch (err) {
      setError('Failed to update association page: ' + err)
      console.error('Error updating association page:', err)
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
      <AdminHeader title="Edit Association Page" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark">
              Association Page Content Management
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

            {isLoading && !associationData ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading association page data...</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Page Heading
                  </label>
                  <input
                    type="text"
                    name="heading"
                    defaultValue={associationData?.heading || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter page heading"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Association Description
                  </label>
                  <textarea
                    name="description"
                    rows={6}
                    defaultValue={associationData?.description || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter association description and information"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Meeting Notes
                  </label>
                  <textarea
                    name="meetingNotes"
                    rows={8}
                    defaultValue={associationData?.meetingNotes || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter meeting notes, minutes, or important announcements"
                  />
                  <p className="text-sm text-neutral-dark mt-1">
                    This field is optional and can be used for meeting minutes, announcements, or other important information.
                  </p>
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
                    onClick={() => router.push('/association')}
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