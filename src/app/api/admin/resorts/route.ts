import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all resorts
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resorts = await prisma.resort.findMany({
      include: {
        resortsPage: true
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(resorts)
  } catch (error) {
    console.error('Error fetching resorts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new resort
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, address, phone, imageUrl, description, websiteUrl } = body

    // Get or create resorts page
    let resortsPage = await prisma.resortsPage.findFirst()
    if (!resortsPage) {
      resortsPage = await prisma.resortsPage.create({
        data: {}
      })
    }

    // Get the highest order value and add 1 for the new resort
    const maxOrder = await prisma.resort.aggregate({
      where: { resortsPageId: resortsPage.id },
      _max: { order: true }
    })
    const newOrder = (maxOrder._max.order || 0) + 1

    const resort = await prisma.resort.create({
      data: {
        name,
        address,
        phone,
        imageUrl,
        description,
        websiteUrl,
        order: newOrder,
        resortsPageId: resortsPage.id
      }
    })

    return NextResponse.json(resort, { status: 201 })
  } catch (error) {
    console.error('Error creating resort:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update resort
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, address, phone, imageUrl, description, websiteUrl, order } = body

    const resort = await prisma.resort.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        phone,
        imageUrl,
        description,
        websiteUrl,
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(resort)
  } catch (error) {
    console.error('Error updating resort:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete resort
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Resort ID is required' }, { status: 400 })
    }

    await prisma.resort.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Resort deleted successfully' })
  } catch (error) {
    console.error('Error deleting resort:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 