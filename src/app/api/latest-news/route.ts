import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch latest news for homepage
export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        date: 'desc'
      },
      take: 4 // Limit to 4 most recent news items
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error('Error fetching latest news:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 