import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const homePage = await prisma.homePage.findFirst({
      include: {
        carouselImages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })
    
    if (!homePage) {
      // Create default home page if none exists
      const defaultHomePage = await prisma.homePage.create({
        data: {
          heroTitle: 'Welcome to Potato Lake',
          heroSubtitle: 'A beautiful destination for fishing and recreation',
          heroImageUrl: null,
          introHeading: 'About Potato Lake',
          introText: 'Potato Lake is a premier fishing and recreational destination located in northern Minnesota. Our association is dedicated to preserving the lake\'s natural beauty and promoting responsible use of this precious resource.',
          subHeading: 'Discover the Beauty of Our Lake'
        },
        include: {
          carouselImages: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      })
      return NextResponse.json(defaultHomePage)
    }
    
    return NextResponse.json(homePage)
  } catch (error) {
    console.error('Error fetching home page data:', error)
    return NextResponse.json(
      { error: 'Failed to load home page data' },
      { status: 500 }
    )
  }
} 