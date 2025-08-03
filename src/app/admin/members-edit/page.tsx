'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminHeader from '@/components/AdminHeader'

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      fetchMembers()
    }
  }, [status, router])

  const fetchMembers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/members')
      if (!response.ok) throw new Error('Failed to fetch members')
      const data = await response.json()
      setMembers(data)
    } catch (err) {
      setError('Failed to load members')
      console.error('Error fetching members:', err)
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
    
    const memberData = {
      name: formData.get('name') as string,
      tier: formData.get('tier') as string,
      isHighlighted: formData.get('isHighlighted') === 'on'
    }

    try {
      setIsLoading(true)
      setError(null)

      const url = '/api/admin/members'
      const method = editingMember ? 'PUT' : 'POST'
      const body = editingMember ? { ...memberData, id: editingMember.id } : memberData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save member')

      await fetchMembers()
      setEditingMember(null)
      setIsAdding(false)
    } catch (err) {
      setError('Failed to save member')
      console.error('Error saving member:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this member?')) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/admin/members?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete member')

      await fetchMembers()
    } catch (err) {
      setError('Failed to delete member')
      console.error('Error deleting member:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const tiers = [
    'Basic Member',
    'Premium Member',
    'Lifetime Member',
    'Honorary Member'
  ]

  return (
    <div className="min-h-screen bg-neutral-light">
      <AdminHeader title="Manage Members" />

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

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {isLoading && !members.length ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">Loading members...</div>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-neutral-dark">No members found. Add your first member!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div key={member.id} className="border border-neutral-light rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-neutral-dark">{member.name}</h3>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setEditingMember(member)}
                          className="bg-primary text-white px-2 py-1 rounded text-xs hover:bg-accent hover:text-primary transition-colors"
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                          disabled={isLoading}
                        >
                          Del
                        </button>
                      </div>
                    </div>
                    <p className="text-neutral-dark text-sm">{member.tier}</p>
                    {member.isHighlighted && (
                      <div className="flex gap-2 mt-2">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Highlighted</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingMember) && (
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold mb-6 text-neutral-dark">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Member Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingMember?.name || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Enter member name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">
                    Membership Tier
                  </label>
                  <select
                    name="tier"
                    defaultValue={editingMember?.tier || ''}
                    className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
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
                      name="isHighlighted"
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
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (editingMember ? 'Update Member' : 'Add Member')}
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