import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const b2bSubmission = await db.b2BSubmission.findUnique({
      where: { id: params.id }
    })

    if (!b2bSubmission) {
      return NextResponse.json(
        { success: false, error: 'B2B submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      b2bSubmission
    })
  } catch (error) {
    console.error('Error fetching B2B submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch B2B submission' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      companyName,
      contactPerson,
      email,
      phone,
      serviceType,
      message,
      processed
    } = body

    const existingB2BSubmission = await db.b2BSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingB2BSubmission) {
      return NextResponse.json(
        { success: false, error: 'B2B submission not found' },
        { status: 404 }
      )
    }

    const b2bSubmission = await db.b2BSubmission.update({
      where: { id: params.id },
      data: {
        ...(companyName !== undefined && { companyName }),
        ...(contactPerson !== undefined && { contactPerson }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(serviceType !== undefined && { serviceType }),
        ...(message !== undefined && { message }),
        ...(processed !== undefined && { processed })
      }
    })

    return NextResponse.json({
      success: true,
      b2bSubmission
    })
  } catch (error) {
    console.error('Error updating B2B submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update B2B submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingB2BSubmission = await db.b2BSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingB2BSubmission) {
      return NextResponse.json(
        { success: false, error: 'B2B submission not found' },
        { status: 404 }
      )
    }

    await db.b2BSubmission.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'B2B submission deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting B2B submission:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete B2B submission' },
      { status: 500 }
    )
  }
}