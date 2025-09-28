'use client'

import { motion } from 'framer-motion'
import { useState, useRef, ReactNode } from 'react'

interface ThreeDCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  glowOnHover?: boolean
  variant?: 'default' | 'italy' | 'germany' | 'about' | 'contact'
}

export default function ThreeDCard({
  children,
  className = '',
  intensity = 25,
  glowOnHover = true,
  variant = 'default'
}: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const getGlowColor = () => {
    switch (variant) {
      case 'italy':
        return 'rgba(34, 197, 94, 0.3)' // green-500
      case 'germany':
        return 'rgba(251, 191, 36, 0.3)' // amber-500
      case 'about':
        return 'rgba(168, 85, 247, 0.3)' // purple-500
      case 'contact':
        return 'rgba(59, 130, 246, 0.3)' // blue-500
      default:
        return 'rgba(99, 102, 241, 0.3)' // indigo-500
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const rotateY = ((e.clientX - centerX) / intensity)
    const rotateX = -((e.clientY - centerY) / intensity)
    
    setRotateX(rotateX)
    setRotateY(rotateY)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ 
        scale: 1.02,
        zIndex: 10
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }}
    >
      {/* Glow effect on hover */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${getGlowColor()} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            zIndex: -1
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}