import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const blog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      blog
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      author,
      published,
      publishedAt,
      tags
    } = body

    const existingBlog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    // Check if slug is unique (if changing slug)
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await db.blog.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        )
      }
    }

    const blog = await db.blog.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(content !== undefined && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(author !== undefined && { author }),
        ...(published !== undefined && { 
          published,
          publishedAt: published ? (publishedAt || new Date()) : null
        }),
        ...(tags !== undefined && { tags })
      }
    })

    return NextResponse.json({
      success: true,
      blog
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const existingBlog = await db.blog.findUnique({
      where: { id: params.id }
    })

    if (!existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      )
    }

    await db.blog.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    )
  }
}