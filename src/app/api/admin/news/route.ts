import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all news
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const news = await prisma.news.findMany({
      include: {
        newsPage: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, date, imageUrl } = body

    // Get or create news page
    let newsPage = await prisma.newsPage.findFirst()
    if (!newsPage) {
      newsPage = await prisma.newsPage.create({
        data: {
          mainHeading: 'News & Events'
        }
      })
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        date: new Date(date),
        imageUrl,
        newsPageId: newsPage.id
      }
    })

    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update news
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, content, date, imageUrl } = body

    const news = await prisma.news.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        date: new Date(date),
        imageUrl
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete news
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'News ID is required' }, { status: 400 })
    }

    await prisma.news.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'News deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 