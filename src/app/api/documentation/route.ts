import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') // 'uk' or 'italy'
    const category = searchParams.get('category') // 'visa', 'academic', 'financial', 'accommodation'
    const required = searchParams.get('required') === 'true'

    const where: any = {}
    
    if (country) {
      where.country = country
    }
    
    if (category) {
      where.category = category
    }
    
    if (required !== null) {
      where.required = required
    }

    const documentation = await db.documentation.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      documentation
    })
  } catch (error) {
    console.error('Error fetching documentation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documentation' },
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
      category,
      country,
      required = true,
      order = 0
    } = body

    if (!title || !description || !category || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const documentation = await db.documentation.create({
      data: {
        title,
        description,
        category,
        country,
        required,
        order
      }
    })

    return NextResponse.json({
      success: true,
      documentation
    })
  } catch (error) {
    console.error('Error creating documentation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create documentation' },
      { status: 500 }
    )
  }
}