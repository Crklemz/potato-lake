import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch home page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const homePage = await prisma.homePage.findFirst()
    
    if (!homePage) {
      // Create default home page if none exists
      const defaultHomePage = await prisma.homePage.create({
        data: {
          heroTitle: 'Welcome to Potato Lake',
          heroSubtitle: 'A beautiful destination for fishing and recreation',
          heroImageUrl: null,
          introHeading: 'About Potato Lake',
          introText: 'Potato Lake is a premier fishing and recreational destination...'
        }
      })
      return NextResponse.json(defaultHomePage)
    }

    return NextResponse.json(homePage)
  } catch (error) {
    console.error('Error fetching home page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update home page data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { heroTitle, heroSubtitle, heroImageUrl, introHeading, introText } = body

    const homePage = await prisma.homePage.findFirst()
    
    if (!homePage) {
      return NextResponse.json({ error: 'Home page not found' }, { status: 404 })
    }

    const updatedHomePage = await prisma.homePage.update({
      where: { id: homePage.id },
      data: {
        heroTitle,
        heroSubtitle,
        heroImageUrl,
        introHeading,
        introText
      }
    })

    return NextResponse.json(updatedHomePage)
  } catch (error) {
    console.error('Error updating home page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 