import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch approved stories for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const approvedOnly = searchParams.get('approved') !== 'false'

    const stories = await prisma.communityStory.findMany({
      where: approvedOnly ? { isApproved: true } : {},
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching community stories:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}

// POST - Submit a new story (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, authorName, authorEmail, imageUrl } = body

    // Validate required fields
    if (!title || !content || !authorName || !authorEmail) {
      return NextResponse.json(
        { error: 'Title, content, author name, and email are required' },
        { status: 400 }
      )
    }

    // Create the story (will be pending approval)
    const story = await prisma.communityStory.create({
      data: {
        title,
        content,
        authorName,
        authorEmail,
        imageUrl,
        isApproved: false, // Stories start as pending approval
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Story submitted successfully and is pending approval',
      story 
    })
  } catch (error) {
    console.error('Error submitting story:', error)
    return NextResponse.json({ error: 'Failed to submit story' }, { status: 500 })
  }
} 