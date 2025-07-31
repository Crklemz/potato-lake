'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SeoMeta {
  id: number
  page: string
  title: string
  description: string
  keywords?: string
}

export default function SeoEditPage({ params }: { params: { page: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [seoMeta, setSeoMeta] = useState<SeoMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pageName = decodeURIComponent(params.page)

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

  const handleSave = (meta: Partial<SeoMeta>) => {
    // TODO: Implement API call to save SEO metadata
    console.log('Saving SEO metadata:', meta)
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
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">SEO Metadata Editor</h1>
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
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-dark mb-2">
                {getPageDisplayName(pageName)}
              </h2>
              <p className="text-neutral-dark text-sm">
                Configure SEO metadata for better search engine visibility
              </p>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  defaultValue={seoMeta?.title || `${getPageDisplayName(pageName)} - Potato Lake Association`}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter page title (50-60 characters recommended)"
                  maxLength={60}
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
                  rows={3}
                  defaultValue={seoMeta?.description || `Learn more about ${getPageDisplayName(pageName).toLowerCase()} at Potato Lake Association.`}
                  className="w-full px-3 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter meta description (150-160 characters recommended)"
                  maxLength={160}
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
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
                >
                  Save SEO Settings
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