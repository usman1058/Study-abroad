import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country') // 'uk' or 'italy'
    const degreeType = searchParams.get('degreeType') // 'bachelor' or 'master'
    const universityId = searchParams.get('universityId')
    const featured = searchParams.get('featured') === 'true'

    const where: any = {}
    
    if (country) {
      where.country = country
    }
    
    if (degreeType) {
      where.degreeType = degreeType
    }
    
    if (universityId) {
      where.universityId = universityId
    }
    
    if (featured) {
      where.featured = true
    }

    const courses = await db.course.findMany({
      where,
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            logo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      courses
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
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
      degreeType,
      duration,
      tuitionFee,
      requirements,
      universityId,
      country,
      featured = false
    } = body

    if (!title || !description || !degreeType || !duration || !tuitionFee || !requirements || !universityId || !country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const course = await db.course.create({
      data: {
        title,
        description,
        degreeType,
        duration,
        tuitionFee,
        requirements,
        universityId,
        country,
        featured
      },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            logo: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      course
    })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}