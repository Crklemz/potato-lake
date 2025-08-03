'use client'

import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  title: string
  showViewSite?: boolean
}

export default function AdminHeader({ title, showViewSite = true }: AdminHeaderProps) {
  const router = useRouter()
  
  return (
    <div className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
            >
              Back to Dashboard
            </button>
            {showViewSite && (
              <a
                href="/"
                target="_blank"
                className="bg-neutral-light text-neutral-dark px-4 py-2 rounded-md font-semibold hover:bg-white transition-colors"
              >
                View Site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 