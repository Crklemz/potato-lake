import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch association page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const associationPage = await prisma.associationPage.findFirst()
    
    if (!associationPage) {
      // Create default association page if none exists
      const defaultAssociationPage = await prisma.associationPage.create({
        data: {
          heading: 'About the Association',
          description: 'The Potato Lake Association is dedicated to preserving and promoting the lake...',
          meetingNotes: null
        }
      })
      return NextResponse.json(defaultAssociationPage)
    }

    return NextResponse.json(associationPage)
  } catch (error) {
    console.error('Error fetching association page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update association page data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { heading, description, meetingNotes } = body

    const associationPage = await prisma.associationPage.findFirst()
    
    if (!associationPage) {
      return NextResponse.json({ error: 'Association page not found' }, { status: 404 })
    }

    const updatedAssociationPage = await prisma.associationPage.update({
      where: { id: associationPage.id },
      data: {
        heading,
        description,
        meetingNotes
      }
    })

    return NextResponse.json(updatedAssociationPage)
  } catch (error) {
    console.error('Error updating association page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 