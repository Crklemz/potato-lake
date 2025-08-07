import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch DNR page data
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dnrPage = await prisma.dnrPage.findFirst()
    
    if (!dnrPage) {
      // Create default DNR page if none exists
      const defaultDnrPage = await prisma.dnrPage.create({
        data: {
          dnrHeading: 'DNR Information',
          dnrText: 'Important information from the Department of Natural Resources...',
          mapUrl: null,
          dnrStewardshipHeading: 'Wisconsin DNR & Lake Stewardship',
          dnrStewardshipText: 'The Wisconsin Department of Natural Resources works in partnership with local organizations like the Potato Lake Association to protect lake health and encourage responsible use. These efforts include water quality monitoring, shoreline protection, aquatic habitat restoration, and invasive species prevention.',
          dnrStewardshipCtaText: 'Visit Wisconsin Lakes Partnership',
          dnrStewardshipCtaUrl: 'https://www.uwsp.edu/cnr-ap/UWEXLakes/Pages/partnership.aspx'
        }
      })
      return NextResponse.json(defaultDnrPage)
    }

    return NextResponse.json(dnrPage)
  } catch (error) {
    console.error('Error fetching DNR page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update DNR page data
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      dnrHeading, 
      dnrText, 
      heroImageUrl, 
      ctaText, 
      ctaLink, 
      mapUrl,
      dnrStewardshipHeading,
      dnrStewardshipText,
      dnrStewardshipCtaText,
      dnrStewardshipCtaUrl,
      dnrFishingCardHeading,
      dnrFishingCardItems,
      dnrFishingCardCtaText,
      dnrFishingCardCtaUrl,
      dnrBoatingCardHeading,
      dnrBoatingCardItems,
      dnrBoatingCardCtaText,
      dnrBoatingCardCtaUrl,
      regulationsHeading,
      regulationsSubheading
    } = body

    const dnrPage = await prisma.dnrPage.findFirst()
    
    if (!dnrPage) {
      return NextResponse.json({ error: 'DNR page not found' }, { status: 404 })
    }

    const updatedDnrPage = await prisma.dnrPage.update({
      where: { id: dnrPage.id },
      data: {
        dnrHeading,
        dnrText,
        heroImageUrl,
        ctaText,
        ctaLink,
        mapUrl,
        dnrStewardshipHeading,
        dnrStewardshipText,
        dnrStewardshipCtaText,
        dnrStewardshipCtaUrl,
        dnrFishingCardHeading,
        dnrFishingCardItems,
        dnrFishingCardCtaText,
        dnrFishingCardCtaUrl,
        dnrBoatingCardHeading,
        dnrBoatingCardItems,
        dnrBoatingCardCtaText,
        dnrBoatingCardCtaUrl,
        regulationsHeading,
        regulationsSubheading
      }
    })

    return NextResponse.json(updatedDnrPage)
  } catch (error) {
    console.error('Error updating DNR page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 