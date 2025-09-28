import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prize, numberOfWinners = 1 } = body

    // Get all valid entries (non-winners)
    const validEntries = await db.luckyDrawEntry.findMany({
      where: { isWinner: false }
    })

    if (validEntries.length === 0) {
      return NextResponse.json(
        { error: 'No valid entries found for the draw' },
        { status: 400 }
      )
    }

    // Randomly select winners
    const winners = []
    const availableEntries = [...validEntries]
    
    for (let i = 0; i < Math.min(numberOfWinners, availableEntries.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableEntries.length)
      const winner = availableEntries.splice(randomIndex, 1)[0]
      winners.push(winner)
    }

    // Update winners in database
    const drawDate = new Date()
    const updatedWinners = await Promise.all(
      winners.map(winner =>
        db.luckyDrawEntry.update({
          where: { id: winner.id },
          data: {
            isWinner: true,
            drawDate,
            prize: prize || 'Free Consultation'
          }
        })
      )
    )

    // TODO: Send email notifications to winners (implement email service)

    return NextResponse.json({
      message: 'Lucky draw completed successfully',
      winners: updatedWinners,
      drawDate
    })
  } catch (error) {
    console.error('Error running lucky draw:', error)
    return NextResponse.json(
      { error: 'Failed to run lucky draw' },
      { status: 500 }
    )
  }
}