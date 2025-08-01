import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const imageId = parseInt(id)
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const carouselImage = await prisma.homePageImage.findUnique({
      where: { id: imageId }
    })

    if (!carouselImage) {
      return NextResponse.json({ error: 'Carousel image not found' }, { status: 404 })
    }

    await prisma.homePageImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ message: 'Carousel image deleted successfully' })
  } catch (error) {
    console.error('Error deleting carousel image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 