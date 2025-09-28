import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const newsletter = await db.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!newsletter) {
      return NextResponse.json(
        { error: 'Newsletter subscription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(newsletter)
  } catch (error) {
    console.error('Error fetching newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch newsletter subscription' },
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
    const { email, name, active } = body

    // Check if newsletter subscription exists
    const existingNewsletter = await db.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!existingNewsletter) {
      return NextResponse.json(
        { error: 'Newsletter subscription not found' },
        { status: 404 }
      )
    }

    // If email is being changed, check if new email already exists
    if (email && email !== existingNewsletter.email) {
      const emailExists = await db.newsletter.findFirst({
        where: { 
          email: email,
          id: { not: params.id }
        }
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        )
      }
    }

    const newsletter = await db.newsletter.update({
      where: { id: params.id },
      data: {
        email: email || existingNewsletter.email,
        name: name !== undefined ? name : existingNewsletter.name,
        active: active !== undefined ? active : existingNewsletter.active
      }
    })

    return NextResponse.json(newsletter)
  } catch (error) {
    console.error('Error updating newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update newsletter subscription' },
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

    // Check if newsletter subscription exists
    const existingNewsletter = await db.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!existingNewsletter) {
      return NextResponse.json(
        { error: 'Newsletter subscription not found' },
        { status: 404 }
      )
    }

    const newsletter = await db.newsletter.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(newsletter)
  } catch (error) {
    console.error('Error updating newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update newsletter subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if newsletter subscription exists
    const existingNewsletter = await db.newsletter.findUnique({
      where: { id: params.id }
    })

    if (!existingNewsletter) {
      return NextResponse.json(
        { error: 'Newsletter subscription not found' },
        { status: 404 }
      )
    }

    await db.newsletter.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Newsletter subscription deleted successfully' })
  } catch (error) {
    console.error('Error deleting newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to delete newsletter subscription' },
      { status: 500 }
    )
  }
}