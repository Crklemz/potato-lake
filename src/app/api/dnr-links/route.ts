import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all DNR links for public display
export async function GET() {
  try {
    const links = await prisma.dnrLink.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching DNR links:', error)
    return NextResponse.json({ error: 'Failed to fetch DNR links' }, { status: 500 })
  }
} 