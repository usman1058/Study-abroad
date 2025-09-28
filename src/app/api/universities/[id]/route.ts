import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const university = await db.university.findUnique({
      where: { id: params.id }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error fetching university:', error)
    return NextResponse.json(
      { error: 'Failed to fetch university' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id: params.id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    const university = await db.university.update({
      where: { id: params.id },
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

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error updating university:', error)
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id: params.id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    const university = await db.university.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(university)
  } catch (error) {
    console.error('Error updating university:', error)
    return NextResponse.json(
      { error: 'Failed to update university' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if university exists
    const existingUniversity = await db.university.findUnique({
      where: { id: params.id }
    })

    if (!existingUniversity) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    await db.university.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'University deleted successfully' })
  } catch (error) {
    console.error('Error deleting university:', error)
    return NextResponse.json(
      { error: 'Failed to delete university' },
      { status: 500 }
    )
  }
}