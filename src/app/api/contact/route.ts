import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Get the contact email from the association page
    const associationPage = await prisma.associationPage.findFirst()
    
    if (!associationPage?.contactEmail) {
      return NextResponse.json(
        { error: 'Contact email not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // For now, we'll just log the contact form submission
    // In production, you would integrate with an email service like SendGrid, Resend, or Nodemailer
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      message,
      to: associationPage.contactEmail,
      timestamp: new Date().toISOString()
    })

    // TODO: Implement actual email sending
    // Example with a hypothetical email service:
    // await sendEmail({
    //   to: associationPage.contactEmail,
    //   subject: `New Contact Form Submission from ${name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${message}</p>
    //   `
    // })

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
} 