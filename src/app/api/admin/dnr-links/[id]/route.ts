import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update a DNR link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, url, description, order } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 })
    }

    const link = await prisma.dnrLink.update({
      where: { id },
      data: {
        title,
        url,
        description: description || null,
        order: order || 0
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating DNR link:', error)
    return NextResponse.json({ error: 'Failed to update DNR link' }, { status: 500 })
  }
}

// DELETE - Delete a DNR link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    await prisma.dnrLink.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'DNR link deleted successfully' })
  } catch (error) {
    console.error('Error deleting DNR link:', error)
    return NextResponse.json({ error: 'Failed to delete DNR link' }, { status: 500 })
  }
} 