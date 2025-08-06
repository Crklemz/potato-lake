import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tipIds } = body

    if (!Array.isArray(tipIds) || tipIds.length === 0) {
      return NextResponse.json({ error: 'Tip IDs array is required' }, { status: 400 })
    }

    // Update the order of each tip
    const updatePromises = tipIds.map((id: number, index: number) => {
      return prisma.fishingTip.update({
        where: { id },
        data: { order: index }
      })
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering fishing tips:', error)
    return NextResponse.json({ error: 'Failed to reorder fishing tips' }, { status: 500 })
  }
} 