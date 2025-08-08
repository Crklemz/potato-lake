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

    const newsPage = await prisma.newsPage.findFirst({
      include: {
        events: {
          orderBy: {
            date: 'desc'
          }
        },
        news: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    if (!newsPage) {
      return NextResponse.json({ error: 'News page not found' }, { status: 404 })
    }

    return NextResponse.json(newsPage)
  } catch (error) {
    console.error('Error fetching news page data:', error)
    return NextResponse.json({ error: 'Failed to load news page data' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, mainHeading, heroTitle, heroSubtitle, heroImageUrl } = body

    if (!id || !mainHeading || !heroTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const updatedNewsPage = await prisma.newsPage.update({
      where: { id: parseInt(id) },
      data: {
        mainHeading,
        heroTitle,
        heroSubtitle,
        heroImageUrl,
      },
      include: {
        events: {
          orderBy: {
            date: 'desc'
          }
        },
        news: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    return NextResponse.json(updatedNewsPage)
  } catch (error) {
    console.error('Error updating news page:', error)
    return NextResponse.json({ error: 'Failed to update news page' }, { status: 500 })
  }
} 