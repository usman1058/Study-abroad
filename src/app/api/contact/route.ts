import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      education,
      countryToGo,
      budget,
      timeline,
      message,
      universityId,
      sourcePage
    } = body

    // Validate required fields
    if (!name || !email || !phone || !education || !countryToGo || !budget || !timeline || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create contact submission
    const submission = await db.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        education,
        countryToGo,
        budget,
        timeline,
        message,
        universityId: universityId || null,
        sourcePage: sourcePage || 'contact',
        ipAddress,
        userAgent
      }
    })

    // TODO: Send email notification to admin (implement email service)

    return NextResponse.json({ 
      message: 'Contact form submitted successfully',
      submissionId: submission.id 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const country = searchParams.get('country')
    const timeline = searchParams.get('timeline')
    const processed = searchParams.get('processed')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (country) {
      where.countryToGo = { equals: country, mode: 'insensitive' }
    }
    
    if (timeline) {
      where.timeline = { equals: timeline }
    }
    
    if (processed !== null) {
      where.processed = processed === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ]
    }

    const submissions = await db.contactSubmission.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true
          }
        }
      }
    })

    const total = await db.contactSubmission.count({ where })

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}