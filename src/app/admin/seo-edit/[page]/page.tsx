'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import AdminHeader from '@/components/AdminHeader'

interface SeoMeta {
  id: number
  page: string
  title: string
  description: string
  keywords?: string
}

export default function SeoEditPage({ params }: { params: Promise<{ page: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [seoMeta, setSeoMeta] = useState<SeoMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageName, setPageName] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setPageName(decodeURIComponent(resolvedParams.page))
    }
    getParams()
  }, [params])

  const fetchSeoMeta = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/seo-meta?page=${pageName}`)
      if (!response.ok) throw new Error('Failed to fetch SEO metadata')
      const data = await response.json()
      setSeoMeta(data)
    } catch (err) {
      setError('Failed to load SEO metadata: ' + err)
      console.error('Error fetching SEO metadata:', err)
    } finally {
      setIsLoading(false)
    }
  }, [pageName])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated' && pageName) {
      fetchSeoMeta()
    }
  }, [status, router, pageName, fetchSeoMeta])

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
    
    const metaData = {
      page: pageName,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      keywords: formData.get('keywords') as string
    }

    try {
      setIsLoading(true)
      setError(null)

      const url = '/api/admin/seo-meta'
      const method = seoMeta ? 'PUT' : 'POST'
      const body = seoMeta ? { ...metaData, id: seoMeta.id } : metaData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (!response.ok) throw new Error('Failed to save SEO metadata')

      await fetchSeoMeta()
    } catch (err) {
      setError('Failed to save SEO metadata: ' + err)
      console.error('Error saving SEO metadata:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getPageDisplayName = (page: string) => {
    const pageMap: { [key: string]: string } = {
      'home': 'Home Page',
      'resorts': 'Resorts Page',
      'fishing': 'Fishing Page',
      'dnr': 'DNR Page',
      'news': 'News Page',
      'area-services': 'Area Services Page',
      'association': 'Association Page'
    }
    return pageMap[page] || page
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <AdminHeader title="SEO Metadata Editor" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark mb-2">
                {getPageDisplayName(pageName)}
              </h2>
              <p className="text-neutral-dark text-sm">
                Configure SEO metadata for better search engine visibility
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={seoMeta?.title || `${getPageDisplayName(pageName)} - Potato Lake Association`}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter page title (50-60 characters recommended)"
                  maxLength={60}
                  required
                />
                <p className="text-sm text-neutral-dark mt-1">
                  This appears in browser tabs and search results
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Meta Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={seoMeta?.description || `Learn more about ${getPageDisplayName(pageName).toLowerCase()} at Potato Lake Association.`}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter meta description (150-160 characters recommended)"
                  maxLength={160}
                  required
                />
                <p className="text-sm text-neutral-dark mt-1">
                  This appears in search result snippets
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Keywords (Optional)
                </label>
                <input
                  type="text"
                  name="keywords"
                  defaultValue={seoMeta?.keywords || ''}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-sm text-neutral-dark mt-1">
                  Keywords are less important for modern SEO but can still be useful
                </p>
              </div>

              <div className="bg-neutral-light p-4 rounded-lg">
                <h3 className="font-semibold text-neutral-dark mb-2">SEO Preview</h3>
                <div className="border border-neutral-light bg-white p-4 rounded">
                  <div className="text-blue-600 text-sm mb-1">
                    {seoMeta?.title || `${getPageDisplayName(pageName)} - Potato Lake Association`}
                  </div>
                  <div className="text-green-600 text-sm mb-1">
                    potatolake.com › {pageName}
                  </div>
                  <div className="text-neutral-dark text-sm">
                    {seoMeta?.description || `Learn more about ${getPageDisplayName(pageName).toLowerCase()} at Potato Lake Association.`}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
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
                  {isLoading ? 'Saving...' : 'Save SEO Settings'}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Navigation */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h3 className="font-semibold text-neutral-dark mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['home', 'resorts', 'fishing', 'dnr', 'news', 'area-services', 'association'].map((page) => (
                <button
                  key={page}
                  onClick={() => router.push(`/admin/seo-edit/${page}`)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    page === pageName
                      ? 'bg-primary text-white'
                      : 'bg-neutral-light text-neutral-dark hover:bg-accent hover:text-primary'
                  }`}
                >
                  {getPageDisplayName(page)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 