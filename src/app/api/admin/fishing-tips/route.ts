import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fishingPage = await prisma.fishingPage.findFirst()
    if (!fishingPage) {
      return NextResponse.json({ error: 'Fishing page not found' }, { status: 404 })
    }

    const tips = await prisma.fishingTip.findMany({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(tips)
  } catch (error) {
    console.error('Error fetching fishing tips:', error)
    return NextResponse.json({ error: 'Failed to fetch fishing tips' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text, submittedBy } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Tip text is required' }, { status: 400 })
    }

    const fishingPage = await prisma.fishingPage.findFirst()
    if (!fishingPage) {
      return NextResponse.json({ error: 'Fishing page not found' }, { status: 404 })
    }

    // Get the highest order value
    const lastTip = await prisma.fishingTip.findFirst({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'desc'
      }
    })

    const newOrder = lastTip ? lastTip.order + 1 : 0

    const tip = await prisma.fishingTip.create({
      data: {
        text: text.trim(),
        submittedBy: submittedBy?.trim() || null,
        order: newOrder,
        fishingPageId: fishingPage.id
      }
    })

    return NextResponse.json(tip)
  } catch (error) {
    console.error('Error creating fishing tip:', error)
    return NextResponse.json({ error: 'Failed to create fishing tip' }, { status: 500 })
  }
} 