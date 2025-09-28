'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SidebarNavigation from './SidebarNavigation'
import { Menu, Home, User, GraduationCap, Mail, Phone, MapPin, Globe, Award, BookOpen, Handshake } from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
  badge?: string
}

interface MainNavigationProps {
  className?: string
}

export default function MainNavigation({ className = '' }: MainNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { scrollYProgress } = useScroll()

  const navBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['bg-transparent', 'bg-white/95 backdrop-blur-md']
  )

  const navBorder = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['border-transparent', 'border-gray-200']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems: NavigationItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: <Home className="w-5 h-5" />,
      description: 'Return to homepage'
    },
    {
      label: 'About',
      href: '/about',
      icon: <User className="w-5 h-5" />,
      description: 'Learn about our services'
    },
    {
      label: 'Study in Italy',
      href: '/study-in-italy',
      icon: <Globe className="w-5 h-5" />,
      description: 'Italian universities',
      badge: 'Popular'
    },
    {
      label: 'Study in UK',
      href: '/study-in-uk',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'UK universities',
      badge: 'Popular'
    },
    {
      label: 'Study in Italy',
      href: '/study-in-italy',
      icon: <Globe className="w-5 h-5" />,
      description: 'Italian universities',
      badge: 'Popular'
    },
    {
      label: 'B2B Partnership',
      href: '/b2b',
      icon: <Handshake className="w-5 h-5" />,
      description: 'Business partnerships',
      badge: 'New'
    },
    {
      label: 'Services',
      href: '/services',
      icon: <Award className="w-5 h-5" />,
      description: 'Our comprehensive services'
    },
    {
      label: 'Contact',
      href: '/contact',
      icon: <Mail className="w-5 h-5" />,
      description: 'Get in touch with us'
    }
  ]

  const handleNavClick = (href: string) => {
    setActiveSection(href)
    window.location.href = href
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
      style={{
        background: navBackground,
        borderBottom: `1px solid ${navBorder}`,
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </motion.div>
            
            <div className="hidden sm:block">
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Study Abroad Mentor
              </motion.h1>
              <motion.p 
                className="text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Your Global Education Guide
              </motion.p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Button
                  variant={activeSection === item.href ? "default" : "ghost"}
                  className={`relative h-10 px-4 rounded-lg transition-all duration-300 ${
                    activeSection === item.href
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="secondary" 
                        className={`ml-2 text-xs px-2 py-0.5 ${
                          activeSection === item.href 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Animated underline */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeSection === item.href ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
                
                {/* Tooltip */}
                {item.description && (
                  <motion.div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0, y: -10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    {item.description}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            className="hidden lg:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.location.href = '/contact'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Get Advice
            </Button>
          </motion.div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <SidebarNavigation items={navItems} />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}