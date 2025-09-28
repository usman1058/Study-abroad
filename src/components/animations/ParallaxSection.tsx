'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
  direction?: 'up' | 'down'
  className?: string
}

export default function ParallaxSection({
  children,
  speed = 0.5,
  direction = 'up',
  className = ''
}: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Calculate parallax movement based on direction
  const y = useTransform(
    scrollYProgress, 
    [0, 1], 
    direction === 'up' 
      ? [`${speed * 20}%`, `-${speed * 20}%`]
      : [`-${speed * 20}%`, `${speed * 20}%`]
  )

  return (
    <motion.div 
      ref={ref} 
      className={`relative ${className}`}
    >
      <motion.div 
        style={{ y }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}