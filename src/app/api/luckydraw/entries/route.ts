import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    const isWinner = searchParams.get('isWinner')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (isWinner !== null) {
      where.isWinner = isWinner === 'true'
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ]
    }

    const entries = await db.luckyDrawEntry.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    const total = await db.luckyDrawEntry.count({ where })

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching lucky draw entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lucky draw entries' },
      { status: 500 }
    )
  }
}