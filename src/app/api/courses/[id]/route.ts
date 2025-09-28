import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            logo: true,
            website: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      course
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      featured
    } = body

    const existingCourse = await db.course.findUnique({
      where: { id: params.id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    const course = await db.course.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(degreeType && { degreeType }),
        ...(duration && { duration }),
        ...(tuitionFee && { tuitionFee }),
        ...(requirements && { requirements }),
        ...(universityId && { universityId }),
        ...(country && { country }),
        ...(featured !== undefined && { featured })
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
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingCourse = await db.course.findUnique({
      where: { id: params.id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    await db.course.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}