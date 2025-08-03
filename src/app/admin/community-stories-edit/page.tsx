'use client'

import { useState, useEffect } from 'react'
import AdminHeader from '@/components/AdminHeader'
import Image from 'next/image'
import type { CommunityStory } from '@/types/database'

export default function CommunityStoriesEditPage() {
  const [stories, setStories] = useState<CommunityStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/admin/community-stories')
      if (!response.ok) {
        throw new Error('Failed to fetch stories')
      }
      const data = await response.json()
      setStories(data)
    } catch (err) {
      setError('Failed to load stories: ' + err)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (storyId: number, isApproved: boolean) => {
    setUpdating(storyId)
    try {
      const response = await fetch('/api/admin/community-stories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: storyId, isApproved }),
      })

      if (!response.ok) {
        throw new Error('Failed to update story')
      }

      // Update the local state
      setStories(prev => 
        prev.map(story => 
          story.id === storyId 
            ? { ...story, isApproved } 
            : story
        )
      )
    } catch (err) {
      setError('Failed to update story: ' + err)
      console.error('Error:', err)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (storyId: number) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return
    }

    setUpdating(storyId)
    try {
      const response = await fetch(`/api/admin/community-stories?id=${storyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete story')
      }

      // Remove from local state
      setStories(prev => prev.filter(story => story.id !== storyId))
    } catch (err) {
      setError('Failed to delete story: ' + err)
      console.error('Error:', err)
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <AdminHeader title="Community Stories Management" />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-6 bg-neutral-light rounded mb-4"></div>
                  <div className="h-4 bg-neutral-light rounded mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
          <div className="min-h-screen bg-neutral-light">
        <AdminHeader title="Community Stories Management" />
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Community Stories Management</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-dark">
                Stories ({stories.length})
              </h2>
              <div className="text-sm text-neutral-dark">
                {stories.filter(s => s.isApproved).length} approved, {stories.filter(s => !s.isApproved).length} pending
              </div>
            </div>

            {stories.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">No Stories Yet</h3>
                <p className="text-neutral-dark">Community stories will appear here once users submit them.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {stories.map((story) => (
                  <div key={story.id} className="border border-neutral-light rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-primary">{story.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            story.isApproved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {story.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-dark mb-2">
                          By {story.authorName} ({story.authorEmail}) • {formatDate(story.createdAt)}
                        </p>
                      </div>
                    </div>

                    {story.imageUrl && (
                      <div className="mb-4">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-neutral-dark leading-relaxed whitespace-pre-wrap">
                        {story.content}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {!story.isApproved ? (
                        <button
                          onClick={() => handleApprove(story.id, true)}
                          disabled={updating === story.id}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {updating === story.id ? 'Approving...' : 'Approve'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApprove(story.id, false)}
                          disabled={updating === story.id}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                          {updating === story.id ? 'Updating...' : 'Unapprove'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(story.id)}
                        disabled={updating === story.id}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {updating === story.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 