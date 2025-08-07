import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch resorts page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resortsPage = await prisma.resortsPage.findFirst({
      include: {
        resorts: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!resortsPage) {
      return NextResponse.json({ error: 'Resorts page not found' }, { status: 404 })
    }

    return NextResponse.json(resortsPage)
  } catch (error) {
    console.error('Error fetching resorts page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update resorts page
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      heroTitle, 
      heroSubtitle, 
      heroImageUrl, 
      ctaText, 
      ctaLink, 
      sectionHeading, 
      sectionText 
    } = body

    let resortsPage = await prisma.resortsPage.findFirst()
    
    if (!resortsPage) {
      // Create default resorts page if none exists
      resortsPage = await prisma.resortsPage.create({
        data: {
          heroTitle: heroTitle || 'Resorts & Lodging',
          heroSubtitle: heroSubtitle || 'Find your perfect getaway on Potato Lake',
          heroImageUrl: heroImageUrl || null,
          ctaText: ctaText || 'Book Your Stay',
          ctaLink: ctaLink || '/contact',
          sectionHeading: sectionHeading || 'Resorts on Potato Lake',
          sectionText: sectionText || 'Potato Lake offers a variety of resorts and accommodations to suit every visitor\'s needs.'
        }
      })
    } else {
      // Update existing resorts page
      resortsPage = await prisma.resortsPage.update({
        where: { id: resortsPage.id },
        data: {
          heroTitle,
          heroSubtitle,
          heroImageUrl,
          ctaText,
          ctaLink,
          sectionHeading,
          sectionText
        }
      })
    }

    return NextResponse.json(resortsPage)
  } catch (error) {
    console.error('Error updating resorts page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 