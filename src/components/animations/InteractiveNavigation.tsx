'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface InteractiveNavigationProps {
  items: NavigationItem[]
  variant?: 'default' | 'italy' | 'germany' | 'about' | 'contact'
  className?: string
}

export default function InteractiveNavigation({ 
  items, 
  variant = 'default', 
  className = '' 
}: InteractiveNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const getActiveColor = () => {
    switch (variant) {
      case 'italy':
        return 'from-green-600 to-emerald-600'
      case 'germany':
        return 'from-yellow-600 to-amber-600'
      case 'about':
        return 'from-purple-600 to-pink-600'
      case 'contact':
        return 'from-blue-600 to-indigo-600'
      default:
        return 'from-blue-600 to-purple-600'
    }
  }

  const getButtonVariant = (isActive?: boolean) => {
    if (isActive) return 'default'
    return 'ghost'
  }

  const getButtonClass = (isActive?: boolean) => {
    const baseClass = "relative group overflow-hidden transition-all duration-300"
    if (isActive) {
      return `${baseClass} text-white`
    }
    return baseClass
  }

  const activeColor = getActiveColor()

  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          onHoverStart={() => setHoveredItem(item.label)}
          onHoverEnd={() => setHoveredItem(null)}
        >
          <Button
            variant={getButtonVariant(item.isActive)}
            onClick={() => window.location.href = item.href}
            className={getButtonClass(item.isActive)}
          >
            <span className="relative z-10">{item.label}</span>
            
            {/* Animated underline for non-active items */}
            {!item.isActive && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r"
                style={{
                  background: `linear-gradient(to right, ${activeColor.split(' ')[0].replace('from-', '')}, ${activeColor.split(' ')[1].replace('to-', '')})`
                }}
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: hoveredItem === item.label ? 1 : 0 
                }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            {/* Hover effect for active items */}
            {item.isActive && (
              <motion.div
                className="absolute inset-0 bg-white opacity-0"
                initial={{ x: "-100%" }}
                animate={{ 
                  x: hoveredItem === item.label ? "100%" : "-100%" 
                }}
                transition={{ duration: 0.6 }}
              />
            )}
          </Button>
        </motion.div>
      ))}
    </nav>
  )
}