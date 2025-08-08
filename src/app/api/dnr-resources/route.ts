import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const resources = await prisma.dnrResource.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching DNR resources:', error)
    return NextResponse.json({ error: 'Failed to fetch DNR resources' }, { status: 500 })
  }
} 