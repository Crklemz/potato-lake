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
      take: 4 // Get up to 4 upcoming events
    })

    // Calculate how many past events we need
    let neededPastEvents = 0
    if (upcomingEvents.length === 0) {
      // If no upcoming events, get up to 2 past events for the fallback display
      neededPastEvents = 2
    } else {
      // If we have upcoming events, fill remaining slots to reach 4 total
      neededPastEvents = Math.max(0, 4 - upcomingEvents.length)
    }
    
    let pastEvents: any[] = []
    if (neededPastEvents > 0) {
      pastEvents = await prisma.event.findMany({
        where: {
          date: {
            lt: new Date()
          }
        },
        orderBy: {
          date: 'desc'
        },
        take: neededPastEvents
      })
    }
    
    return NextResponse.json({
      upcomingEvents,
      pastEvents
    })
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
    return NextResponse.json(
      { error: 'Failed to load upcoming events' },
      { status: 500 }
    )
  }
} 