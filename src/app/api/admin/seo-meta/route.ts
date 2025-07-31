import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch SEO metadata for a specific page
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    if (!page) {
      return NextResponse.json({ error: 'Page parameter is required' }, { status: 400 })
    }

    const seoMeta = await prisma.seoMeta.findFirst({
      where: { page }
    })

    if (!seoMeta) {
      // Create default SEO metadata if none exists
      const defaultSeoMeta = await prisma.seoMeta.create({
        data: {
          page,
          title: `${page.charAt(0).toUpperCase() + page.slice(1)} - Potato Lake Association`,
          description: `Learn more about ${page} at Potato Lake Association.`,
          keywords: null
        }
      })
      return NextResponse.json(defaultSeoMeta)
    }

    return NextResponse.json(seoMeta)
  } catch (error) {
    console.error('Error fetching SEO metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new SEO metadata
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { page, title, description, keywords } = body

    const seoMeta = await prisma.seoMeta.create({
      data: {
        page,
        title,
        description,
        keywords
      }
    })

    return NextResponse.json(seoMeta, { status: 201 })
  } catch (error) {
    console.error('Error creating SEO metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update SEO metadata
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, page, title, description, keywords } = body

    const seoMeta = await prisma.seoMeta.update({
      where: { id: parseInt(id) },
      data: {
        page,
        title,
        description,
        keywords
      }
    })

    return NextResponse.json(seoMeta)
  } catch (error) {
    console.error('Error updating SEO metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete SEO metadata
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'SEO metadata ID is required' }, { status: 400 })
    }

    await prisma.seoMeta.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'SEO metadata deleted successfully' })
  } catch (error) {
    console.error('Error deleting SEO metadata:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 