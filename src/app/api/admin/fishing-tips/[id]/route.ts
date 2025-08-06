import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tip ID' }, { status: 400 })
    }

    const body = await request.json()
    const { text, submittedBy } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Tip text is required' }, { status: 400 })
    }

    const tip = await prisma.fishingTip.findUnique({
      where: { id }
    })

    if (!tip) {
      return NextResponse.json({ error: 'Fishing tip not found' }, { status: 404 })
    }

    const updatedTip = await prisma.fishingTip.update({
      where: { id },
      data: {
        text: text.trim(),
        submittedBy: submittedBy?.trim() || null
      }
    })

    return NextResponse.json(updatedTip)
  } catch (error) {
    console.error('Error updating fishing tip:', error)
    return NextResponse.json({ error: 'Failed to update fishing tip' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid tip ID' }, { status: 400 })
    }

    const tip = await prisma.fishingTip.findUnique({
      where: { id }
    })

    if (!tip) {
      return NextResponse.json({ error: 'Fishing tip not found' }, { status: 404 })
    }

    await prisma.fishingTip.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fishing tip:', error)
    return NextResponse.json({ error: 'Failed to delete fishing tip' }, { status: 500 })
  }
} 