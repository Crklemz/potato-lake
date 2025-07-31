import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { AssociationPage } from '@/types/database'

async function getAssociationData() {
  try {
    const associationPage = await prisma.associationPage.findFirst()
    
    if (!associationPage) {
      // Create default association page if none exists
      const defaultAssociationPage = await prisma.associationPage.create({
        data: {
          heading: 'Potato Lake Association',
          description: 'The Potato Lake Association is dedicated to preserving and enhancing the natural beauty and recreational opportunities of Potato Lake. Our members work together to maintain water quality, promote responsible use, and foster a strong community around our beloved lake.',
          meetingNotes: null
        }
      })
      return defaultAssociationPage
    }
    
    return associationPage
  } catch (error) {
    console.error('Error fetching association data:', error)
    throw new Error('Failed to load association data')
  }
}

function AssociationPageContent({ associationPage }: { associationPage: AssociationPage }) {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-neutral-dark">
            {associationPage.heading}
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              About Our Association
            </h2>
            <p className="text-lg text-neutral-dark leading-relaxed">
              {associationPage.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Our Mission</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Preserve water quality and natural resources</li>
                <li>• Promote responsible lake use and recreation</li>
                <li>• Foster community engagement and education</li>
                <li>• Advocate for lake-friendly policies and practices</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-primary">Get Involved</h3>
              <ul className="space-y-2 text-neutral-dark">
                <li>• Attend monthly association meetings</li>
                <li>• Participate in lake clean-up events</li>
                <li>• Volunteer for water quality monitoring</li>
                <li>• Support conservation initiatives</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Membership Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary">Regular Membership</h4>
                <ul className="space-y-1 text-neutral-dark text-sm">
                  <li>• Voting rights at association meetings</li>
                  <li>• Access to member-only events</li>
                  <li>• Regular newsletter and updates</li>
                  <li>• Participation in lake management decisions</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary">Lifetime Membership</h4>
                <ul className="space-y-1 text-neutral-dark text-sm">
                  <li>• All regular membership benefits</li>
                  <li>• One-time payment, no annual fees</li>
                  <li>• Recognition as a founding supporter</li>
                  <li>• Special recognition at events</li>
                </ul>
              </div>
            </div>
          </div>

          {associationPage.meetingNotes && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Latest Meeting Notes</h3>
              <div className="bg-neutral-light p-4 rounded-lg">
                <p className="text-neutral-dark whitespace-pre-wrap">
                  {associationPage.meetingNotes}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-8">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary">General Inquiries</h4>
                <p className="text-neutral-dark mb-2">Email: info@potatolakeassociation.org</p>
                <p className="text-neutral-dark">Phone: (555) 123-4567</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2 text-primary">Meeting Information</h4>
                <p className="text-neutral-dark mb-2">Monthly meetings held on the first Tuesday</p>
                <p className="text-neutral-dark">Time: 7:00 PM</p>
                <p className="text-neutral-dark">Location: Community Center</p>
              </div>
            </div>
            <div className="mt-6">
              <a href="/admin" className="text-accent hover:text-primary font-semibold">
                Admin Login →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingAssociationPage() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-dark rounded mb-8"></div>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded mb-2"></div>
              <div className="h-6 bg-neutral-dark rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-primary rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                    <div className="h-4 bg-neutral-dark rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="h-6 bg-primary rounded mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-neutral-dark rounded"></div>
                      <div className="h-4 bg-neutral-dark rounded"></div>
                      <div className="h-4 bg-neutral-dark rounded"></div>
                      <div className="h-4 bg-neutral-dark rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="h-8 bg-primary rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i}>
                    <div className="h-6 bg-primary rounded mb-2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-neutral-dark rounded"></div>
                      <div className="h-4 bg-neutral-dark rounded"></div>
                      <div className="h-4 bg-neutral-dark rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <div className="h-4 bg-accent rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function AssociationPage() {
  try {
    const associationPage = await getAssociationData()
    
    return (
      <Suspense fallback={<LoadingAssociationPage />}>
        <AssociationPageContent associationPage={associationPage} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error in AssociationPage:', error)
    notFound()
  }
} 