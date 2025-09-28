import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email already exists (prevent duplicate entries)
    const existingEntry = await db.luckyDrawEntry.findFirst({
      where: { email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'This email has already been entered into the lucky draw' },
        { status: 400 }
      )
    }

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Create lucky draw entry
    const entry = await db.luckyDrawEntry.create({
      data: {
        name,
        email,
        phone,
        ipAddress,
        userAgent
      }
    })

    return NextResponse.json({ 
      message: 'Successfully entered into lucky draw',
      entryId: entry.id 
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lucky draw entry:', error)
    return NextResponse.json(
      { error: 'Failed to enter lucky draw' },
      { status: 500 }
    )
  }
}