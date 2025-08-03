'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

export default function SubmitStoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    authorName: '',
    authorEmail: '',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/community-stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit story')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError('Failed to submit story: ' + err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-light py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-primary mb-4">Story Submitted!</h1>
            <p className="text-lg text-neutral-dark mb-6">
              Thank you for sharing your story with the Potato Lake community. 
              Your submission is now pending approval and will be reviewed by our team.
            </p>
            <p className="text-sm text-accent">
              You&apos;ll be redirected to the homepage in a few seconds...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">
            Share Your Story
          </h1>
          <p className="text-neutral-dark mb-8 text-center">
            Tell us about your favorite memories, experiences, or moments at Potato Lake. 
            Your story will be reviewed and may be featured on our website.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-neutral-dark mb-2">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter a title for your story"
              />
            </div>

            <div>
              <label htmlFor="authorName" className="block text-sm font-semibold text-neutral-dark mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="authorName"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block text-sm font-semibold text-neutral-dark mb-2">
                Your Email *
              </label>
              <input
                type="email"
                id="authorEmail"
                name="authorEmail"
                value={formData.authorEmail}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-neutral-dark mb-2">
                Your Story *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Share your story, memories, or experiences at Potato Lake..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Add a Photo (Optional)
              </label>
              <FileUpload
                onUpload={handleImageUpload}
                onError={setError}
                type="image"
                className="w-full"
                maxSize={5 * 1024 * 1024} // 5MB
              />
              {formData.imageUrl && (
                <div className="mt-2 p-2 bg-neutral-light rounded">
                  <p className="text-sm text-accent">✓ Image uploaded successfully</p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Story'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-neutral-light text-neutral-dark rounded-lg font-semibold hover:bg-neutral-light transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 