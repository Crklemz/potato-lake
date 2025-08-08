import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resources = await prisma.dnrResource.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching DNR resources:', error)
    return NextResponse.json({ error: 'Failed to fetch DNR resources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, fileUrl, order } = body

    if (!title || !description || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resource = await prisma.dnrResource.create({
      data: {
        title,
        description,
        fileUrl,
        order: order || 0
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error creating DNR resource:', error)
    return NextResponse.json({ error: 'Failed to create DNR resource' }, { status: 500 })
  }
} 