import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const country = searchParams.get('country')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    const where: any = {}

    if (featured === 'true') {
      where.featured = true
    }

    if (country) {
      where.country = {
        equals: country,
        mode: 'insensitive' // This makes the filter case-insensitive
      }
    }

    const universities = await db.university.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await db.university.count({ where })

    return NextResponse.json({
      universities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      country,
      description,
      duration,
      tuitionFee,
      applicationFee,
      studyMode,
      englishTest,
      website,
      featured
    } = body

    // Validate required fields
    if (!name || !country || !description || !duration || !tuitionFee || !applicationFee || !studyMode || !englishTest) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const university = await db.university.create({
      data: {
        name,
        country,
        description,
        duration,
        tuitionFee,
        applicationFee,
        studyMode,
        englishTest,
        website: website || null,
        featured: featured || false
      }
    })

    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    console.error('Error creating university:', error)
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    )
  }
}