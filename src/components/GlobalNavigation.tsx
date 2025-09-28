'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SidebarNavigation from './SidebarNavigation'
import { 
  Menu, 
  Home, 
  GraduationCap, 
  Globe, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Handshake,
  ChevronDown,
  X,
  Plane,
  MapPin,
  Star
} from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
  badge?: string
  isActive?: boolean
  children?: NavigationItem[]
}

interface GlobalNavigationProps {
  currentPath?: string
  className?: string
}

export default function GlobalNavigation({ currentPath = '', className = '' }: GlobalNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()

  const navBackground = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['bg-transparent', 'bg-white/98 backdrop-blur-md']
  )

  const navBorder = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['border-transparent', 'border-gray-200/50']
  )

  const navShadow = useTransform(
    scrollYProgress,
    [0, 0.1],
    ['none', '0 4px 20px -4px rgba(0, 0, 0, 0.1)']
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems: NavigationItem[] = [
       {
      label: 'About',
      href: '/about',
      icon: <User className="w-4 h-4" />,
      description: 'Learn about our services',
      isActive: currentPath === '/about'
    },
    {
      label: 'Study Destinations',
      href: '#',
      icon: <Globe className="w-4 h-4" />,
      description: 'Explore study opportunities',
      badge: 'Popular',
      children: [
        {
          label: 'Study in UK',
          href: '/study-in-uk',
          icon: <GraduationCap className="w-4 h-4" />,
          description: 'UK universities',
          isActive: currentPath === '/study-in-uk'
        },
        {
          label: 'Study in Italy',
          href: '/study-in-italy',
          icon: <MapPin className="w-4 h-4" />,
          description: 'Italian universities',
          isActive: currentPath === '/study-in-italy'
        }
      ]
    },
    {
      label: 'B2B Partnership',
      href: '/b2b',
      icon: <Handshake className="w-4 h-4" />,
      description: 'Business partnerships',
      badge: 'New',
      isActive: currentPath === '/b2b'
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: <BookOpen className="w-4 h-4" />,
      description: 'Latest articles and news',
      isActive: currentPath === '/blog'
    },
  ]

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    setActiveDropdown(null)
    if (href !== '#') {
      window.location.href = href
    }
  }

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${className}`}
        style={{
          background: navBackground,
          borderBottom: `1px solid ${navBorder}`,
          boxShadow: navShadow
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/'}
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Plane className="w-5 h-5 text-white" />
              </motion.div>
              
              <div className="hidden sm:block">
                <motion.h1 
                  className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
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
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => item.children && setActiveDropdown(null)}
                >
                  {item.children ? (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        className={`relative h-10 px-4 rounded-lg transition-all duration-300 ${
                          activeDropdown === item.label || item.isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => handleDropdownToggle(item.label)}
                      >
                        <div className="flex items-center space-x-2">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={`ml-2 text-xs px-2 py-0.5 ${
                                activeDropdown === item.label || item.isActive
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </Button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
                        >
                          {item.children.map((child, childIndex) => (
                            <Button
                              key={child.href}
                              variant="ghost"
                              className={`w-full justify-start h-auto p-3 rounded-lg ${
                                child.isActive
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                              }`}
                              onClick={() => handleNavClick(child.href)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {child.icon}
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-sm">{child.label}</div>
                                  <div className="text-xs text-gray-500">{child.description}</div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <Button
                      variant={item.isActive ? "default" : "ghost"}
                      className={`relative h-10 px-4 rounded-lg transition-all duration-300 ${
                        item.isActive
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
                              item.isActive 
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
                        animate={{ scaleX: item.isActive ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Button>
                  )}
                  
                  {/* Tooltip */}
                  {item.description && !item.children && (
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
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                onClick={() => window.location.href = '/contact'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Us
              </motion.button>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Study Abroad Mentor</h2>
                    <p className="text-sm text-gray-500">Your Global Education Guide</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <div key={item.href}>
                    {item.children ? (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-3 rounded-lg"
                          onClick={() => handleDropdownToggle(item.label)}
                        >
                          <div className="flex items-center space-x-3">
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </Button>
                        
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 space-y-2"
                          >
                            {item.children.map((child) => (
                              <Button
                                key={child.href}
                                variant="ghost"
                                className={`w-full justify-start p-3 rounded-lg ${
                                  child.isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                                onClick={() => handleNavClick(child.href)}
                              >
                                <div className="flex items-center space-x-3">
                                  {child.icon}
                                  <div className="text-left">
                                    <div className="font-medium text-sm">{child.label}</div>
                                    <div className="text-xs text-gray-500">{child.description}</div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <Button
                        variant={item.isActive ? "default" : "ghost"}
                        className={`w-full justify-start p-3 rounded-lg ${
                          item.isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                        onClick={() => handleNavClick(item.href)}
                      >
                        <div className="flex items-center space-x-3">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                item.isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-blue-100 text-blue-600'
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  onClick={() => handleNavClick('/contact')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                 Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}