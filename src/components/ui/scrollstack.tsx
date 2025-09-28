'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScrollStackProps {
  children: React.ReactNode[]
  className?: string
  offset?: number
  scale?: number
  rotate?: number
}

export default function ScrollStack({ 
  children, 
  className = "", 
  offset = 100,
  scale = 0.8,
  rotate = 5
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      const calculatedHeight = containerRef.current.scrollHeight
      setHeight(calculatedHeight)
      console.log('ScrollStack height set:', calculatedHeight, 'children count:', children.length)
    }
  }, [children])

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        
        const progress = Math.max(0, Math.min(1, 
          (scrollTop + windowHeight - elementTop) / (elementHeight + windowHeight)
        ))
        
        setScrollProgress(progress)
        // console.log('Scroll progress:', progress) // Commented out to avoid spam
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const calculateTransform = (index: number) => {
    const progress = scrollProgress
    const yOffset = progress * offset * (index + 1) * 0.3
    const scaleValue = 1 - (1 - scale) * progress * (index + 1) * 0.2
    const rotateValue = progress * rotate * (index + 1) * 0.2
    
    return {
      y: yOffset,
      scale: scaleValue,
      rotate: rotateValue
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative ${className}`}
      style={{ height: `${height}px` }}
    >
      {children.map((child, index) => {
        const transform = calculateTransform(index)
        return (
          <motion.div
            key={index}
            className="absolute top-0 left-0 w-full"
            style={{
              zIndex: children.length - index,
              transformOrigin: 'center center'
            }}
            animate={{
              y: transform.y,
              scale: transform.scale,
              rotate: transform.rotate
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}