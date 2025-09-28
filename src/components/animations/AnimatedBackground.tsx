'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'italy' | 'germany' | 'about' | 'contact'
  className?: string
}

export default function AnimatedBackground({ variant = 'default', className = '' }: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const getGradientColors = () => {
    switch (variant) {
      case 'italy':
        return 'from-gradient-italy-start via-gradient-italy-middle to-gradient-italy-end'
      case 'germany':
        return 'from-gradient-germany-start via-gradient-germany-middle to-gradient-germany-end'
      case 'about':
        return 'from-gradient-about-start via-gradient-about-middle to-gradient-about-end'
      case 'contact':
        return 'from-gradient-contact-start via-gradient-contact-middle to-gradient-contact-end'
      default:
        return 'from-gradient-default-start via-gradient-default-middle to-gradient-default-end'
    }
  }

  const getFloatingColors = () => {
    switch (variant) {
      case 'italy':
        return [
          'bg-gradient-italy-blob-1',
          'bg-gradient-italy-blob-2', 
          'bg-gradient-italy-blob-3'
        ]
      case 'germany':
        return [
          'bg-gradient-germany-blob-1',
          'bg-gradient-germany-blob-2',
          'bg-gradient-germany-blob-3'
        ]
      case 'about':
        return [
          'bg-gradient-about-blob-1',
          'bg-gradient-about-blob-2',
          'bg-gradient-about-blob-3'
        ]
      case 'contact':
        return [
          'bg-gradient-contact-blob-1',
          'bg-gradient-contact-blob-2',
          'bg-gradient-contact-blob-3'
        ]
      default:
        return [
          'bg-gradient-default-blob-1',
          'bg-gradient-default-blob-2',
          'bg-gradient-default-blob-3'
        ]
    }
  }

  const floatingColors = getFloatingColors()

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Base gradient background - simplified for mobile */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors()} opacity-10 md:opacity-20`} />
      
      {/* Interactive mouse-following gradient - disabled on mobile */}
      <motion.div 
        className="absolute inset-0 opacity-20 hidden md:block"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.08) 0%, transparent 35%)`
        }}
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating animated orbs - reduced for mobile */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 md:opacity-15">
        <motion.div
          className={`absolute top-1/4 left-1/4 w-40 h-40 md:w-80 md:h-80 ${floatingColors[0]} rounded-full mix-blend-soft-light filter blur-2xl md:blur-3xl`}
          animate={{
            y: [0, -10, 0],
            x: [0, 8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0
          }}
        />
        <motion.div
          className={`absolute top-2/3 right-1/4 w-48 h-48 md:w-96 md:h-96 ${floatingColors[1]} rounded-full mix-blend-soft-light filter blur-2xl md:blur-3xl`}
          animate={{
            y: [0, 12, 0],
            x: [0, -8, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        {/* Third orb hidden on mobile for performance */}
        <motion.div
          className={`absolute -bottom-10 left-1/2 w-36 h-36 md:w-72 md:h-72 ${floatingColors[2]} rounded-full mix-blend-soft-light filter blur-2xl md:blur-3xl hidden md:block`}
          animate={{
            y: [0, -8, 0],
            x: [0, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>
      
      {/* Subtle grid pattern - hidden on mobile */}
      <div className="absolute inset-0 opacity-[0.01] hidden md:block">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
    </div>
  )
}