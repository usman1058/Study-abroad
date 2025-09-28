import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const processStep = await db.processStep.findUnique({
      where: { id: params.id }
    })

    if (!processStep) {
      return NextResponse.json(
        { success: false, error: 'Process step not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      processStep
    })
  } catch (error) {
    console.error('Error fetching process step:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch process step' },
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
      stepNumber,
      country,
      timeline,
      tips
    } = body

    const existingProcessStep = await db.processStep.findUnique({
      where: { id: params.id }
    })

    if (!existingProcessStep) {
      return NextResponse.json(
        { success: false, error: 'Process step not found' },
        { status: 404 }
      )
    }

    const processStep = await db.processStep.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(stepNumber !== undefined && { stepNumber }),
        ...(country !== undefined && { country }),
        ...(timeline !== undefined && { timeline }),
        ...(tips !== undefined && { tips })
      }
    })

    return NextResponse.json({
      success: true,
      processStep
    })
  } catch (error) {
    console.error('Error updating process step:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update process step' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingProcessStep = await db.processStep.findUnique({
      where: { id: params.id }
    })

    if (!existingProcessStep) {
      return NextResponse.json(
        { success: false, error: 'Process step not found' },
        { status: 404 }
      )
    }

    await db.processStep.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Process step deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting process step:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete process step' },
      { status: 500 }
    )
  }
}