import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    const body = await request.json()
    const { title, description, fileUrl, order } = body

    if (!title || !description || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resource = await prisma.dnrResource.update({
      where: { id },
      data: {
        title,
        description,
        fileUrl,
        order: order || 0
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating DNR resource:', error)
    return NextResponse.json({ error: 'Failed to update DNR resource' }, { status: 500 })
  }
}

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

    await prisma.dnrResource.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting DNR resource:', error)
    return NextResponse.json({ error: 'Failed to delete DNR resource' }, { status: 500 })
  }
} 