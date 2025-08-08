import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resources } = body

    if (!Array.isArray(resources)) {
      return NextResponse.json({ error: 'Invalid resources array' }, { status: 400 })
    }

    // Update the order of each resource
    const updatePromises = resources.map((resource: { id: number; order: number }) =>
      prisma.dnrResource.update({
        where: { id: resource.id },
        data: { order: resource.order }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering DNR resources:', error)
    return NextResponse.json({ error: 'Failed to reorder DNR resources' }, { status: 500 })
  }
} 