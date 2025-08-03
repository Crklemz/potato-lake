import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const upcomingEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      },
      take: 3 // Limit to 3 upcoming events
    })
    
    return NextResponse.json(upcomingEvents)
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return NextResponse.json(
      { error: 'Failed to load upcoming events' },
      { status: 500 }
    )
  }
} 