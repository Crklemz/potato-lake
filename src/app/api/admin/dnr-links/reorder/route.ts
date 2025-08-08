import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Reorder DNR links
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { links } = body

    if (!Array.isArray(links)) {
      return NextResponse.json({ error: 'Links array is required' }, { status: 400 })
    }

    // Update each link with its new order
    const updatePromises = links.map((link: { id: number; order: number }) =>
      prisma.dnrLink.update({
        where: { id: link.id },
        data: { order: link.order }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Links reordered successfully' })
  } catch (error) {
    console.error('Error reordering DNR links:', error)
    return NextResponse.json({ error: 'Failed to reorder DNR links' }, { status: 500 })
  }
} 