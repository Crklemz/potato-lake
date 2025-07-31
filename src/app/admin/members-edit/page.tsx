'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Member {
  id: number
  name: string
  tier: string
  isHighlighted: boolean
}

export default function MembersEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [editingMember, setEditingMember] = useState<Member | null>(null)
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

  const handleSave = (member: Partial<Member>) => {
    // TODO: Implement API call to save member
    console.log('Saving member:', member)
    setEditingMember(null)
    setIsAdding(false)
  }

  const handleDelete = (id: number) => {
    // TODO: Implement API call to delete member
    console.log('Deleting member:', id)
  }

  const tiers = [
    'Basic Member',
    'Premium Member',
    'Lifetime Member',
    'Honorary Member'
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Manage Members</h1>
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
                Member Directory
              </h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Add New Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sample Members */}
              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-dark">John Smith</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingMember({ id: 1, name: 'John Smith', tier: 'Premium Member', isHighlighted: true })}
                      className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(1)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-neutral-dark text-sm">Premium Member</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Highlighted</span>
                </div>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-dark">Sarah Johnson</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingMember({ id: 2, name: 'Sarah Johnson', tier: 'Lifetime Member', isHighlighted: false })}
                      className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(2)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-neutral-dark text-sm">Lifetime Member</p>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-dark">Mike Wilson</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingMember({ id: 3, name: 'Mike Wilson', tier: 'Basic Member', isHighlighted: false })}
                      className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(3)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-neutral-dark text-sm">Basic Member</p>
              </div>

              <div className="border border-neutral-light rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-neutral-dark">Lisa Brown</h3>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingMember({ id: 4, name: 'Lisa Brown', tier: 'Honorary Member', isHighlighted: true })}
                      className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-accent hover:text-primary transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(4)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                    >
                      Del
                    </button>
                  </div>
                </div>
                <p className="text-neutral-dark text-sm">Honorary Member</p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Highlighted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingMember) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Member Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingMember?.name || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter member name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Membership Tier
                  </label>
                  <select
                    defaultValue={editingMember?.tier || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select a tier</option>
                    {tiers.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingMember?.isHighlighted || false}
                      className="mr-2"
                    />
                    <span className="text-sm text-neutral-dark">Highlight this member (show prominently)</span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null)
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
                    {editingMember ? 'Update Member' : 'Add Member'}
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