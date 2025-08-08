import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all DNR links
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const links = await prisma.dnrLink.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching DNR links:', error)
    return NextResponse.json({ error: 'Failed to fetch DNR links' }, { status: 500 })
  }
}

// POST - Create a new DNR link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, url, description, order } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    const link = await prisma.dnrLink.create({
      data: {
        title,
        url,
        description: description || null,
        order: order || 0
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error creating DNR link:', error)
    return NextResponse.json({ error: 'Failed to create DNR link' }, { status: 500 })
  }
} 