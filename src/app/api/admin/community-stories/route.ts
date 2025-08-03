import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all stories for admin management
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stories = await prisma.communityStory.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching community stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

// PUT - Approve/reject a story
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, isApproved } = body

    if (typeof id !== 'number' || typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const story = await prisma.communityStory.update({
      where: { id },
      data: { isApproved },
    })

    return NextResponse.json(story)
  } catch (error) {
    console.error('Error updating story:', error)
    return NextResponse.json({ error: 'Failed to update story' }, { status: 500 })
  }
}

// DELETE - Delete a story
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Story ID is required' }, { status: 400 })
    }

    await prisma.communityStory.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting story:', error)
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
} 