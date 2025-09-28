'use client'

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useParallax } from '@reactuses/core'
import PrismComponent from '@/components/PrismComponent'

// Enhanced 3D Card with ReactBits-style animations - optimized for mobile
export function Enhanced3DCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const rotateYValue = (e.clientX - centerX) / 25
    const rotateXValue = -(e.clientY - centerY) / 25
    
    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
    setScale(1.05)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    setRotateX(0)
    setRotateY(0)
    setScale(1)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative transform-gpu ${className}`}
      style={{
        transformStyle: isMobile ? 'flat' : 'preserve-3d',
        perspective: isMobile ? 'none' : '1000px'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        scale: isMobile ? 1 : scale
      }}
      transition={{
        type: 'spring',
        stiffness: isMobile ? 100 : 300,
        damping: isMobile ? 30 : 20
      }}
    >
      {children}
    </motion.div>
  )
}

// Parallax container with smooth scrolling - optimized for mobile
export function ParallaxContainer({ children, className = '', speed = 0.3 }: { 
  children: React.ReactNode; 
  className?: string; 
  speed?: number 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Disable parallax on mobile for better performance
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -50 * speed])
  const springY = useSpring(y, { stiffness: 80, damping: 20 })

  return (
    <div ref={ref} className={`relative overflow-visible ${className}`}>
      <motion.div style={{ y: springY }}>
        {children}
      </motion.div>
    </div>
  )
}

// Scroll-triggered reveal animation - optimized for mobile
export function ScrollReveal({ 
  children, 
  className = '', 
  direction = 'up',
  delay = 0,
  duration = 0.6
}: { 
  children: React.ReactNode; 
  className?: string; 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isInView = useInView(ref, { 
    once: true, 
    margin: isMobile ? '-20px' : '-50px',
    amount: isMobile ? 0.1 : 0.3
  })

  const getInitialPosition = () => {
    const distance = isMobile ? 20 : 60
    switch (direction) {
      case 'up': return { y: distance, opacity: 0 }
      case 'down': return { y: -distance, opacity: 0 }
      case 'left': return { x: distance, opacity: 0 }
      case 'right': return { x: -distance, opacity: 0 }
      default: return { y: distance, opacity: 0 }
    }
  }

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down': return { y: 0, opacity: 1 }
      case 'left':
      case 'right': return { x: 0, opacity: 1 }
      default: return { y: 0, opacity: 1 }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{
        duration: isMobile ? duration * 0.7 : duration,
        delay: isMobile ? delay * 0.5 : delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {children}
    </motion.div>
  )
}

// Interactive floating elements - optimized for mobile
export function InteractiveFloatingElements({ count = 4 }: { count?: number }) {
  const [elements, setElements] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([])

  useEffect(() => {
    const colors = [
      'bg-blue-50/5',
      'bg-purple-50/5', 
      'bg-pink-50/5',
      'bg-indigo-50/5'
    ]

    const newElements = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // Keep elements more centered
      y: Math.random() * 80 + 10,
      size: Math.random() * 80 + 60, // Smaller sizes for mobile
      color: colors[i % colors.length]
    }))

    setElements(newElements)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className={`absolute rounded-full filter blur-xl ${element.color}`}
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size
          }}
          animate={{
            x: [0, Math.random() * 20 - 10], // Much smaller movement range for mobile
            y: [0, Math.random() * 20 - 10],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: Math.random() * 12 + 16, // Slower animations for better performance
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  )
}

// Enhanced button with micro-interactions
export function MicroInteractionButton({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'default' | 'outline' | 'ghost';
  [key: string]: any 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border-2 border-transparent bg-transparent hover:border-blue-500 text-blue-600 hover:bg-blue-50'
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700'
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
    }
  }

  return (
    <motion.button
      className={`relative px-8 py-3 rounded-lg font-semibold overflow-hidden ${getVariantStyles()} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '0%' }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Staggered animation for lists
export function StaggeredList({ 
  children, 
  className = '', 
  staggerDelay = 0.08 
}: { 
  children: React.ReactNode[]; 
  className?: string; 
  staggerDelay?: number 
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          direction="up"
          delay={index * staggerDelay}
          duration={0.5}
          className="mb-3"
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  )
}

// Interactive background with mouse tracking
export function InteractiveBackground({ className = '' }: { className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.03) 0%, transparent 40%)`
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  )
}

// Export additional components
export {
  PrismComponent
}