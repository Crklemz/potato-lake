import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all fish species
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fishSpecies = await prisma.fishSpecies.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(fishSpecies)
  } catch (error) {
    console.error('Error fetching fish species:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new fish species
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, order, fishingPageId, description, bait, timeOfDay, weather, imageUrl } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const fishSpecies = await prisma.fishSpecies.create({
      data: {
        name,
        order: order || 0,
        fishingPageId: fishingPageId || null,
        description: description || null,
        bait: bait || null,
        timeOfDay: timeOfDay || null,
        weather: weather || null,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json(fishSpecies)
  } catch (error) {
    console.error('Error creating fish species:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update fish species
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, order, fishingPageId, description, bait, timeOfDay, weather, imageUrl } = body

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 })
    }

    const fishSpecies = await prisma.fishSpecies.update({
      where: { id: parseInt(id) },
      data: {
        name,
        order: order || 0,
        fishingPageId: fishingPageId || null,
        description: description || null,
        bait: bait || null,
        timeOfDay: timeOfDay || null,
        weather: weather || null,
        imageUrl: imageUrl || null
      }
    })

    return NextResponse.json(fishSpecies)
  } catch (error) {
    console.error('Error updating fish species:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete fish species
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.fishSpecies.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Fish species deleted successfully' })
  } catch (error) {
    console.error('Error deleting fish species:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 