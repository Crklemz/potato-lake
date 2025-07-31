import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch fishing page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fishingPage = await prisma.fishingPage.findFirst()
    
    if (!fishingPage) {
      // Create default fishing page if none exists
      const defaultFishingPage = await prisma.fishingPage.create({
        data: {
          fishHeading: 'Fishing at Potato Lake',
          fishText: 'Potato Lake offers excellent fishing opportunities throughout the year...',
          imageUrl: null
        }
      })
      return NextResponse.json(defaultFishingPage)
    }

    return NextResponse.json(fishingPage)
  } catch (error) {
    console.error('Error fetching fishing page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update fishing page data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fishHeading, fishText, imageUrl } = body

    const fishingPage = await prisma.fishingPage.findFirst()
    
    if (!fishingPage) {
      return NextResponse.json({ error: 'Fishing page not found' }, { status: 404 })
    }

    const updatedFishingPage = await prisma.fishingPage.update({
      where: { id: fishingPage.id },
      data: {
        fishHeading,
        fishText,
        imageUrl
      }
    })

    return NextResponse.json(updatedFishingPage)
  } catch (error) {
    console.error('Error updating fishing page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 