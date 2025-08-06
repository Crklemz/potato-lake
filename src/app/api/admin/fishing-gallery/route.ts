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

    const galleryImages = await prisma.fishingGalleryImage.findMany({
      where: {
        fishingPageId: fishingPage.id
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(galleryImages)
  } catch (error) {
    console.error('Error fetching fishing gallery images:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery images: ' + error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageUrl, altText, caption, order } = body

    if (!imageUrl || !altText) {
      return NextResponse.json({ error: 'Image URL and alt text are required' }, { status: 400 })
    }

    const fishingPage = await prisma.fishingPage.findFirst()
    if (!fishingPage) {
      return NextResponse.json({ error: 'Fishing page not found' }, { status: 404 })
    }

    const galleryImage = await prisma.fishingGalleryImage.create({
      data: {
        fishingPageId: fishingPage.id,
        imageUrl,
        altText,
        caption,
        order: order || 0
      }
    })

    return NextResponse.json(galleryImage)
  } catch (error) {
    console.error('Error creating fishing gallery image:', error)
    return NextResponse.json({ error: 'Failed to create gallery image: ' + error }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, imageUrl, altText, caption, order } = body

    if (!id || !imageUrl || !altText) {
      return NextResponse.json({ error: 'ID, image URL, and alt text are required' }, { status: 400 })
    }

    const galleryImage = await prisma.fishingGalleryImage.update({
      where: { id: parseInt(id) },
      data: {
        imageUrl,
        altText,
        caption,
        order: order || 0
      }
    })

    return NextResponse.json(galleryImage)
  } catch (error) {
    console.error('Error updating fishing gallery image:', error)
    return NextResponse.json({ error: 'Failed to update gallery image: ' + error }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    await prisma.fishingGalleryImage.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Gallery image deleted successfully' })
  } catch (error) {
    console.error('Error deleting fishing gallery image:', error)
    return NextResponse.json({ error: 'Failed to delete gallery image: ' + error }, { status: 500 })
  }
} 