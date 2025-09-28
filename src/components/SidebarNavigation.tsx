'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Home, User, GraduationCap, Mail, Phone, MapPin, ChevronRight } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  description?: string
}

interface SidebarNavigationProps {
  items: NavItem[]
  className?: string
}

export default function SidebarNavigation({ items, className = '' }: SidebarNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const handleItemClick = (href: string) => {
    setActiveItem(href)
    setIsOpen(false)
    window.location.href = href
  }

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: 'easeOut'
      }
    })
  }

  return (
    <div className={className}>
      {/* Mobile menu trigger */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent side="left" className="w-80 p-0 bg-white/95 backdrop-blur-md border-r border-gray-200">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={sidebarVariants}
                className="h-full flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <GraduationCap className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Study Abroad
                      </h2>
                      <p className="text-sm text-gray-500">Navigation Menu</p>
                    </div>
                  </motion.div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="space-y-2">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.href}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Button
                          variant={activeItem === item.href ? "default" : "ghost"}
                          className="w-full justify-start h-auto p-4 text-left group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                          onClick={() => handleItemClick(item.href)}
                        >
                          <div className="flex items-center space-x-4 w-full">
                            <motion.div
                              className="flex-shrink-0"
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {item.icon}
                            </motion.div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-medium ${activeItem === item.href ? 'text-white' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                  {item.label}
                                </span>
                                <ChevronRight className={`h-4 w-4 transition-transform ${activeItem === item.href ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
                              </div>
                              
                              {item.description && (
                                <p className={`text-sm mt-1 ${activeItem === item.href ? 'text-white/80' : 'text-gray-500 group-hover:text-blue-600'}`}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </nav>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-3">Need immediate help?</p>
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => {
                          setIsOpen(false)
                          window.location.href = '/contact'
                        }}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Get Advice Now
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>24/7 Support</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Global Reach</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </div>
  )
}