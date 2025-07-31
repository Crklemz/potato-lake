import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all membership tiers
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tiers = await prisma.membershipTier.findMany({
      orderBy: {
        price: 'asc'
      }
    })

    return NextResponse.json(tiers)
  } catch (error) {
    console.error('Error fetching membership tiers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new membership tier
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, price, isLifetime, benefits, showInListing } = body

    const tier = await prisma.membershipTier.create({
      data: {
        name,
        price: parseFloat(price),
        isLifetime,
        benefits,
        showInListing
      }
    })

    return NextResponse.json(tier, { status: 201 })
  } catch (error) {
    console.error('Error creating membership tier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update membership tier
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, price, isLifetime, benefits, showInListing } = body

    const tier = await prisma.membershipTier.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: parseFloat(price),
        isLifetime,
        benefits,
        showInListing
      }
    })

    return NextResponse.json(tier)
  } catch (error) {
    console.error('Error updating membership tier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete membership tier
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Tier ID is required' }, { status: 400 })
    }

    await prisma.membershipTier.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Membership tier deleted successfully' })
  } catch (error) {
    console.error('Error deleting membership tier:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 