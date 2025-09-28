import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    // Check if contact submission exists
    const existingContact = await db.contactSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      )
    }

    const contact = await db.contactSubmission.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if contact submission exists
    const existingContact = await db.contactSubmission.findUnique({
      where: { id: params.id }
    })

    if (!existingContact) {
      return NextResponse.json(
        { error: 'Contact submission not found' },
        { status: 404 }
      )
    }

    await db.contactSubmission.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Contact submission deleted successfully' })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    )
  }
}