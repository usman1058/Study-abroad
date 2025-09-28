'use client'

import { motion } from 'framer-motion'
import { Button, ButtonProps } from '@/components/ui/button'
import { ReactNode } from 'react'

interface EnhancedButtonProps extends ButtonProps {
  variant?: 'default' | 'italy' | 'germany' | 'about' | 'contact'
  ripple?: boolean
  glow?: boolean
  children: ReactNode
}

export default function EnhancedButton({
  variant = 'default',
  ripple = true,
  glow = true,
  children,
  className = '',
  ...props
}: EnhancedButtonProps) {
  const getGradientColors = () => {
    switch (variant) {
      case 'italy':
        return 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
      case 'germany':
        return 'from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700'
      case 'about':
        return 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
      case 'contact':
        return 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
      default:
        return 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
    }
  }

  const gradientColors = getGradientColors()

  const buttonContent = (
    <>
      <span className="relative z-10">{children}</span>
      
      {/* Sliding highlight effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
    </>
  )

  if (props.variant === 'outline') {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-block"
      >
        <Button
          variant="outline"
          className={`relative overflow-hidden transition-all duration-300 ${className}`}
          {...props}
        >
          {buttonContent}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <Button
        className={`relative overflow-hidden transition-all duration-300 bg-gradient-to-r ${gradientColors} text-white ${className}`}
        {...props}
      >
        {buttonContent}
        
        {/* Glow effect */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-md opacity-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
              filter: 'blur(10px)'
            }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
    </motion.div>
  )
}