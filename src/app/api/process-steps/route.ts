import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') // 'uk' or 'italy'

    const where: any = {}
    
    if (country) {
      where.country = country
    }

    const processSteps = await db.processStep.findMany({
      where,
      orderBy: {
        stepNumber: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      processSteps
    })
  } catch (error) {
    console.error('Error fetching process steps:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch process steps' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      stepNumber,
      country,
      timeline,
      tips
    } = body

    if (!title || !description || stepNumber === undefined || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const processStep = await db.processStep.create({
      data: {
        title,
        description,
        stepNumber,
        country,
        timeline,
        tips
      }
    })

    return NextResponse.json({
      success: true,
      processStep
    })
  } catch (error) {
    console.error('Error creating process step:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create process step' },
      { status: 500 }
    )
  }
}