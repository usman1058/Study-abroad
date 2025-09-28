import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const processed = searchParams.get('processed') === 'true'
    const serviceType = searchParams.get('serviceType')

    const where: any = {}
    
    if (processed !== null) {
      where.processed = processed
    }
    
    if (serviceType) {
      where.serviceType = serviceType
    }

    const b2bSubmissions = await db.b2BSubmission.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      b2bSubmissions
    })
  } catch (error) {
    console.error('Error fetching B2B submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch B2B submissions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companyName,
      contactPerson,
      email,
      phone,
      serviceType,
      message,
      ipAddress,
      userAgent
    } = body

    if (!companyName || !contactPerson || !email || !phone || !serviceType || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const b2bSubmission = await db.b2BSubmission.create({
      data: {
        companyName,
        contactPerson,
        email,
        phone,
        serviceType,
        message,
        ipAddress,
        userAgent
      }
    })

    return NextResponse.json({
      success: true,
      b2bSubmission
    })
  } catch (error) {
    console.error('Error creating B2B submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create B2B submission' },
      { status: 500 }
    )
  }
}