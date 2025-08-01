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

    const homePage = await prisma.homePage.findFirst({
      include: {
        carouselImages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!homePage) {
      return NextResponse.json({ error: 'Home page not found' }, { status: 404 })
    }

    return NextResponse.json(homePage.carouselImages)
  } catch (error) {
    console.error('Error fetching carousel images:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url, altText, caption, order } = body

    if (!url) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const homePage = await prisma.homePage.findFirst()
    if (!homePage) {
      return NextResponse.json({ error: 'Home page not found' }, { status: 404 })
    }

    const carouselImage = await prisma.homePageImage.create({
      data: {
        homePageId: homePage.id,
        url,
        altText: altText || null,
        caption: caption || null,
        order: order || 0
      }
    })

    return NextResponse.json(carouselImage)
  } catch (error) {
    console.error('Error creating carousel image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 