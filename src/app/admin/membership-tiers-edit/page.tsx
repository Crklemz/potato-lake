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

  const handleSave = (tier: Partial<MembershipTier>) => {
    // TODO: Implement API call to save tier
    console.log('Saving tier:', tier)
    setEditingTier(null)
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    // TODO: Implement API call to delete tier
    console.log('Deleting tier:', id)
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

            <div className="space-y-4">
              {/* Sample Tiers */}
              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-dark">Basic Member</h3>
                    <p className="text-neutral-dark text-sm">$25/year</p>
                    <p className="text-neutral-dark text-sm">Access to basic resources and newsletters</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Lifetime</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Show in Listing</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingTier({ id: 1, name: 'Basic Member', price: 25, isLifetime: true, benefits: 'Access to basic resources and newsletters', showInListing: true })}
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
                    <h3 className="font-semibold text-neutral-dark">Premium Member</h3>
                    <p className="text-neutral-dark text-sm">$50/year</p>
                    <p className="text-neutral-dark text-sm">All basic benefits plus exclusive events and priority access</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Annual</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Show in Listing</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingTier({ id: 2, name: 'Premium Member', price: 50, isLifetime: false, benefits: 'All basic benefits plus exclusive events and priority access', showInListing: true })}
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
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingTier) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingTier ? 'Edit Membership Tier' : 'Add New Membership Tier'}
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTier?.name || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter tier name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={editingTier?.price || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Benefits
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={editingTier?.benefits || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter benefits description"
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingTier?.isLifetime || false}
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-dark">Lifetime Membership</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
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
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
                  >
                    {editingTier ? 'Update Tier' : 'Add Tier'}
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