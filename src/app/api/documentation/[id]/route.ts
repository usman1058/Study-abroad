import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const documentation = await db.documentation.findUnique({
      where: { id: params.id }
    })

    if (!documentation) {
      return NextResponse.json(
        { success: false, error: 'Documentation not found' },
        { status: 404 }
      )
    }

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      country,
      required,
      order
    } = body

    const existingDocumentation = await db.documentation.findUnique({
      where: { id: params.id }
    })

    if (!existingDocumentation) {
      return NextResponse.json(
        { success: false, error: 'Documentation not found' },
        { status: 404 }
      )
    }

    const documentation = await db.documentation.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(country !== undefined && { country }),
        ...(required !== undefined && { required }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json({
      success: true,
      documentation
    })
  } catch (error) {
    console.error('Error updating documentation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update documentation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingDocumentation = await db.documentation.findUnique({
      where: { id: params.id }
    })

    if (!existingDocumentation) {
      return NextResponse.json(
        { success: false, error: 'Documentation not found' },
        { status: 404 }
      )
    }

    await db.documentation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Documentation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting documentation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete documentation' },
      { status: 500 }
    )
  }
}