'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Sponsor {
  id: number
  name: string
  logoUrl: string | null
  link: string | null
}

export default function SponsorsEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchSponsors()
    }
  }, [status, router])

  const fetchSponsors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/admin/sponsors')
      if (!response.ok) throw new Error('Failed to fetch sponsors')
      const data = await response.json()
      setSponsors(data)
    } catch (err) {
      setError('Failed to load sponsors')
      console.error('Error fetching sponsors:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const sponsorData = {
      name: formData.get('name') as string,
      logoUrl: formData.get('logoUrl') as string,
      link: formData.get('link') as string
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const url = '/api/admin/sponsors'
      const method = editingSponsor ? 'PUT' : 'POST'
      const body = editingSponsor ? { ...sponsorData, id: editingSponsor.id } : sponsorData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save sponsor')

      setSuccess(editingSponsor ? 'Sponsor updated successfully!' : 'Sponsor added successfully!')
      await fetchSponsors()
      setEditingSponsor(null)
      setIsAdding(false)
    } catch (err) {
      setError('Failed to save sponsor')
      console.error('Error saving sponsor:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/sponsors?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete sponsor')

      setSuccess('Sponsor deleted successfully!')
      await fetchSponsors()
    } catch (err) {
      setError('Failed to delete sponsor')
      console.error('Error deleting sponsor:', err)
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark">
                Area Services & Sponsors
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Sponsor
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

            {isLoading && !sponsors.length ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading sponsors...</div>
              </div>
            ) : sponsors.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">No sponsors found. Add your first sponsor!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsors.map((sponsor) => (
                  <div key={sponsor.id} className="border border-neutral-light rounded-lg p-4">
                    <div className="mb-4">
                      {sponsor.logoUrl ? (
                        <img 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name}
                          className="w-full h-24 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 bg-accent flex items-center justify-center rounded-lg">
                          <span className="text-primary font-semibold">No Logo</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-neutral-dark mb-2 text-center">{sponsor.name}</h3>
                    {sponsor.link && (
                      <div className="text-center mb-3">
                        <a 
                          href={sponsor.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-primary font-semibold text-sm"
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}
                    <div className="flex gap-2 justify-center">
                      <button 
                        onClick={() => setEditingSponsor(sponsor)}
                        className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(sponsor.id)}
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
          {(isAdding || editingSponsor) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Sponsor Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingSponsor?.name || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter sponsor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    name="logoUrl"
                    defaultValue={editingSponsor?.logoUrl || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter logo URL"
                  />
                  {editingSponsor?.logoUrl && (
                    <div className="mt-2">
                      <img 
                        src={editingSponsor.logoUrl} 
                        alt="Logo preview"
                        className="w-32 h-24 object-contain rounded-lg border"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="link"
                    defaultValue={editingSponsor?.link || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter website URL"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSponsor(null)
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
                    {isLoading ? 'Saving...' : (editingSponsor ? 'Update Sponsor' : 'Add Sponsor')}
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