'use client'

import { motion } from 'framer-motion'

interface FloatingElementsProps {
  count?: number
  variant?: 'default' | 'italy' | 'germany' | 'about' | 'contact'
  className?: string
}

export default function FloatingElements({ count = 8, variant = 'default', className = '' }: FloatingElementsProps) {
  const getElementColors = () => {
    switch (variant) {
      case 'italy':
        return 'from-green-400 to-emerald-400'
      case 'germany':
        return 'from-yellow-400 to-amber-400'
      case 'about':
        return 'from-purple-400 to-pink-400'
      case 'contact':
        return 'from-blue-400 to-indigo-400'
      default:
        return 'from-blue-400 to-purple-400'
    }
  }

  const colors = getElementColors()

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 8 + 4 // Random size between 4-12
        const duration = Math.random() * 4 + 3 // Random duration between 3-7 seconds
        const delay = Math.random() * 3 // Random delay up to 3 seconds
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, var(--tw-gradient-stops))`,
            }}
            animate={{
              y: [0, -40 - Math.random() * 20, 0],
              x: [0, 20 + Math.random() * 20, 0],
              scale: [1, 1.2 + Math.random() * 0.3, 1],
              rotate: [0, 180 + Math.random() * 180, 360],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }}
          >
            <div className={`w-full h-full bg-gradient-to-r ${colors} rounded-full`} />
          </motion.div>
        )
      })}
    </div>
  )
}