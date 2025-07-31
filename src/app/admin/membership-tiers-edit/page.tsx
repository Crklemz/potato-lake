'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface MembershipTier {
  id: number
  name: string
  price: number
  isLifetime: boolean
  benefits: string
  showInListing: boolean
}

export default function MembershipTiersEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tiers, setTiers] = useState<MembershipTier[]>([])
  const [editingTier, setEditingTier] = useState<MembershipTier | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchTiers()
    }
  }, [status, router])

  const fetchTiers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/membership-tiers')
      if (!response.ok) throw new Error('Failed to fetch tiers')
      const data = await response.json()
      setTiers(data)
    } catch (err) {
      setError('Failed to load membership tiers')
      console.error('Error fetching tiers:', err)
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
    
    const tierData = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      benefits: formData.get('benefits') as string,
      isLifetime: formData.get('isLifetime') === 'on',
      showInListing: formData.get('showInListing') === 'on'
    }

    try {
      setIsLoading(true)
      setError(null)

      const url = editingTier 
        ? `/api/admin/membership-tiers` 
        : '/api/admin/membership-tiers'
      
      const method = editingTier ? 'PUT' : 'POST'
      const body = editingTier ? { ...tierData, id: editingTier.id } : tierData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save tier')

      await fetchTiers()
      setEditingTier(null)
      setIsAdding(false)
    } catch (err) {
      setError('Failed to save membership tier')
      console.error('Error saving tier:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this membership tier?')) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/membership-tiers?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete tier')

      await fetchTiers()
    } catch (err) {
      setError('Failed to delete membership tier')
      console.error('Error deleting tier:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Membership Tiers</h1>
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
                Membership Tiers
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Tier
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {isLoading && !tiers.length ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading membership tiers...</div>
              </div>
            ) : tiers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">No membership tiers found. Create your first tier!</div>
              </div>
            ) : (
              <div className="space-y-4">
                {tiers.map((tier) => (
                  <div key={tier.id} className="border border-neutral-light rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-dark">{tier.name}</h3>
                        <p className="text-neutral-dark text-sm">${tier.price}/{tier.isLifetime ? 'lifetime' : 'year'}</p>
                        <p className="text-neutral-dark text-sm">{tier.benefits}</p>
                        <div className="flex gap-2 mt-2">
                          {tier.isLifetime && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Lifetime</span>
                          )}
                          {tier.showInListing && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Show in Listing</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingTier(tier)}
                          className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-accent hover:text-primary transition-colors"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(tier.id)}
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
          {(isAdding || editingTier) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingTier ? 'Edit Membership Tier' : 'Add New Membership Tier'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTier?.name || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter tier name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    defaultValue={editingTier?.price || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Benefits
                  </label>
                  <textarea
                    name="benefits"
                    rows={4}
                    defaultValue={editingTier?.benefits || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter benefits description"
                    required
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isLifetime"
                      defaultChecked={editingTier?.isLifetime || false}
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-dark">Lifetime Membership</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="showInListing"
                      defaultChecked={editingTier?.showInListing || false}
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-dark">Show in Public Listing</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTier(null)
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
                    {isLoading ? 'Saving...' : (editingTier ? 'Update Tier' : 'Add Tier')}
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