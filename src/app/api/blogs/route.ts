import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (published) {
      where.published = true
    }
    
    if (featured) {
      where.featured = true
    }

    const blogs = await db.blog.findMany({
      where,
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const total = await db.blog.count({ where })

    return NextResponse.json({
      success: true,
      blogs,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      content,
      excerpt,
      featuredImage,
      author,
      published = false,
      publishedAt,
      tags
    } = body

    if (!title || !slug || !content || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug is unique
    const existingBlog = await db.blog.findUnique({
      where: { slug }
    })

    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
        author,
        published,
        publishedAt: published ? (publishedAt || new Date()) : null,
        tags
      }
    })

    return NextResponse.json({
      success: true,
      blog
    })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    )
  }
}