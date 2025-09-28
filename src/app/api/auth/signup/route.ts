import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: { 
        email: { equals: email, mode: 'insensitive' }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new admin user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: 'admin',
      }
    })

    // Return user data without sensitive information
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: userWithoutPassword
    }, { status: 201 })
  } catch (error) {
    console.error('Error during signup:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}