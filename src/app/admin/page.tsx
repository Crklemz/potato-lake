'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span>Welcome, {session.user?.name}</span>
              <button
                onClick={handleSignOut}
                className="bg-accent text-primary px-4 py-2 rounded-md font-semibold hover:bg-neutral-light transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-neutral-dark">
            Content Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Home Page Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Home Page</h3>
              <p className="text-neutral-dark mb-4">
                Manage hero content, intro text, and featured sections.
              </p>
              <button 
                onClick={() => router.push('/admin/home-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Edit Home Page
              </button>
            </div>

            {/* Resorts Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resorts</h3>
              <p className="text-neutral-dark mb-4">
                Add, edit, or remove resort listings and information.
              </p>
              <button 
                onClick={() => router.push('/admin/resorts-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Resorts
              </button>
            </div>

            {/* Fishing Page Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Fishing</h3>
              <p className="text-neutral-dark mb-4">
                Update fishing information and reports.
              </p>
              <button 
                onClick={() => router.push('/admin/fishing-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Edit Fishing Page
              </button>
            </div>

            {/* DNR Page Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">DNR Info</h3>
              <p className="text-neutral-dark mb-4">
                Update DNR information and regulations.
              </p>
              <button 
                onClick={() => router.push('/admin/dnr-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Edit DNR Page
              </button>
            </div>

            {/* News & Events Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">News & Events</h3>
              <p className="text-neutral-dark mb-4">
                Manage news articles and upcoming events.
              </p>
              <button 
                onClick={() => router.push('/admin/events-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Events
              </button>
            </div>

            {/* Area Services Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Area Services</h3>
              <p className="text-neutral-dark mb-4">
                Manage sponsor listings and business information.
              </p>
              <button 
                onClick={() => router.push('/admin/sponsors-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Sponsors
              </button>
            </div>

            {/* Association Page Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Association</h3>
              <p className="text-neutral-dark mb-4">
                Update association information and meeting notes.
              </p>
              <button 
                onClick={() => router.push('/admin/association-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Edit Association Page
              </button>
            </div>

            {/* Membership Tiers Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Membership Tiers</h3>
              <p className="text-neutral-dark mb-4">
                Manage membership levels, pricing, and benefits.
              </p>
              <button 
                onClick={() => router.push('/admin/membership-tiers-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Tiers
              </button>
            </div>

            {/* Resources Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Resources</h3>
              <p className="text-neutral-dark mb-4">
                Upload and manage documents, maps, and files.
              </p>
              <button 
                onClick={() => router.push('/admin/resources-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Resources
              </button>
            </div>

            {/* Members Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Members</h3>
              <p className="text-neutral-dark mb-4">
                Manage member directory and highlight featured members.
              </p>
              <button 
                onClick={() => router.push('/admin/members-edit')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage Members
              </button>
            </div>

            {/* SEO Management */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">SEO Settings</h3>
              <p className="text-neutral-dark mb-4">
                Configure SEO metadata for all pages.
              </p>
              <button 
                onClick={() => router.push('/admin/seo-edit/home')}
                className="bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-accent hover:text-primary transition-colors"
              >
                Manage SEO
              </button>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5</div>
                <div className="text-neutral-dark">Active Resorts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">12</div>
                <div className="text-neutral-dark">Upcoming Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">8</div>
                <div className="text-neutral-dark">Area Sponsors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">150</div>
                <div className="text-neutral-dark">Association Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 