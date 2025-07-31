import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all sponsors
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sponsors = await prisma.sponsor.findMany({
      include: {
        areaServicesPage: true
      }
    })

    return NextResponse.json(sponsors)
  } catch (error) {
    console.error('Error fetching sponsors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new sponsor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, logoUrl, link } = body

    // Get or create area services page
    let areaServicesPage = await prisma.areaServicesPage.findFirst()
    if (!areaServicesPage) {
      areaServicesPage = await prisma.areaServicesPage.create({
        data: {
          heading: 'Area Services',
          description: 'Local businesses and services around Potato Lake'
        }
      })
    }

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        logoUrl,
        link,
        areaServicesPageId: areaServicesPage.id
      }
    })

    return NextResponse.json(sponsor, { status: 201 })
  } catch (error) {
    console.error('Error creating sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update sponsor
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, logoUrl, link } = body

    const sponsor = await prisma.sponsor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logoUrl,
        link
      }
    })

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error updating sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete sponsor
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 })
    }

    await prisma.sponsor.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Sponsor deleted successfully' })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 