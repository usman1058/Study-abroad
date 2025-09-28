'use client'

import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Enhanced3DCard,
  InteractiveBackground,
  MicroInteractionButton,
  ScrollReveal
} from './animations/ReactBitsIntegration'
import {
  GraduationCap,
  Globe,
  Award,
  Users,
  Star,
  ArrowRight,
  Plane,
  MapPin,
  Target,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle
} from 'lucide-react'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeJourneyTab, setActiveJourneyTab] = useState<'planning' | 'application' | 'success'>('planning')
  const heroRef = useRef<HTMLDivElement>(null)
  
  // Adjusted scroll configuration for better timing
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Improved scroll transformations with adjusted timing and physics
  const y = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, -100]), {
    stiffness: 80,
    damping: 20,
    mass: 1
  })
  
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.8], [1, 0]), {
    stiffness: 60,
    damping: 15,
    mass: 1
  })
  
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.4], [1, 1.05]), {
    stiffness: 70,
    damping: 18,
    mass: 1
  })

  // Subtler parallax effect for background elements
  const bgY1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, 30]), {
    stiffness: 50,
    damping: 20,
    mass: 1
  })
  
  const bgY2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -30]), {
    stiffness: 50,
    damping: 20,
    mass: 1
  })

  // Throttled mouse movement handler for better performance
  useEffect(() => {
    let ticking = false
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const journeySteps = {
    planning: [
      { icon: <Target className="w-5 h-5" />, title: "Destination Research", description: "Explore countries and universities that match your goals" },
      { icon: <BookOpen className="w-5 h-5" />, title: "Academic Planning", description: "Choose the right program and prepare your profile" },
      { icon: <Calendar className="w-5 h-5" />, title: "Timeline Creation", description: "Set deadlines and plan your application strategy" }
    ],
    application: [
      { icon: <CheckCircle className="w-5 h-5" />, title: "Document Preparation", description: "Gather all required documents and certificates" },
      { icon: <Plane className="w-5 h-5" />, title: "Application Submission", description: "Submit applications to chosen universities" },
      { icon: <MapPin className="w-5 h-5" />, title: "Interview Preparation", description: "Prepare for university interviews and tests" }
    ],
    success: [
      { icon: <Award className="w-5 h-5" />, title: "Acceptance Received", description: "Get acceptance letters from your dream universities" },
      { icon: <Plane className="w-5 h-5" />, title: "Visa Processing", description: "Complete student visa requirements and procedures" },
      { icon: <GraduationCap className="w-5 h-5" />, title: "Pre-Departure", description: "Prepare for your journey and settle into your new home" }
    ]
  }

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "5000+", label: "Students Mentored" },
    { icon: <GraduationCap className="w-6 h-6" />, value: "200+", label: "University Partners" },
    { icon: <Globe className="w-6 h-6" />, value: "15+", label: "Countries Covered" },
    { icon: <Award className="w-6 h-6" />, value: "98%", label: "Success Rate" }
  ]

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Guidance",
      description: "Tailored mentorship based on your academic goals and preferences"
    },
    {
      icon: <Plane className="w-8 h-8" />,
      title: "Global Network",
      description: "Access to prestigious universities worldwide and local support"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Career Growth",
      description: "Focus on long-term career opportunities and global networking"
    }
  ]

  return (
    <section 
      ref={heroRef} 
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      <InteractiveBackground />

      {/* Animated Background Elements with Parallax */}
      <div className="absolute inset-0 pointer-events-none">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full filter blur-3xl"
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${20 + (i * 15)}%`,
              transform: 'translate(-50%, -50%)',
              y: i % 2 === 0 ? bgY1 : bgY2,
              willChange: 'transform'
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 15 + i * 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Mouse-following Light Effect */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="w-96 h-96 bg-gradient-to-r from-blue-100/15 to-purple-100/15 rounded-full filter blur-3xl" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="max-w-7xl mx-auto w-full z-10 relative"
        style={{ 
          y, 
          opacity, 
          scale,
          willChange: 'transform, opacity'
        }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-10">

            <ScrollReveal direction="up" delay={0.3}>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                style={{ willChange: 'transform, opacity' }}
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Transform Your Future with
                </span>
                <br />
                <span className="text-gray-900">Study Abroad Excellence</span>
              </motion.h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your trusted mentor for international education. From university selection to visa approval,
                we guide you through every step of your study abroad journey with personalized support and proven success.
              </p>
            </ScrollReveal>

            {/* Stats - Added back with better positioning */}
            <ScrollReveal direction="up" delay={0.5}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.6 + index * 0.1,
                      type: "spring",
                      stiffness: 80,
                      damping: 15
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="text-blue-600">
                        {stat.icon}
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Features Grid */}
            <ScrollReveal direction="up" delay={0.6}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.7 + index * 0.1,
                      type: "spring",
                      stiffness: 80,
                      damping: 15
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="text-blue-600">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column - Journey Visualization */}
          <ScrollReveal direction="right" delay={0.4}>
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <Plane className="w-6 h-6 text-blue-600" />
                  <span>Your Study Abroad Journey</span>
                </h3>
                <div className="flex space-x-2">
                  {Object.keys(journeySteps).map((step) => (
                    <Button
                      key={step}
                      variant={activeJourneyTab === step ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveJourneyTab(step as keyof typeof journeySteps)}
                      className={`text-xs px-3 py-1 ${activeJourneyTab === step
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'border-gray-300 text-gray-600 hover:text-blue-600'
                        }`}
                    >
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Enhanced3DCard>
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Journey Progress */}
                      <div className="flex items-center justify-between mb-8">
                        {['planning', 'application', 'success'].map((step, index) => (
                          <div key={step} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${activeJourneyTab === step
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-200 text-gray-500'
                              }`}>
                              {index + 1}
                            </div>
                            {index < 2 && (
                              <div className={`w-20 h-1.5 mx-2 rounded-full ${activeJourneyTab === step || (activeJourneyTab === 'application' && step === 'planning') || activeJourneyTab === 'success'
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                  : 'bg-gray-200'
                                }`}></div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Journey Steps */}
                      <div className="space-y-4">
                        {journeySteps[activeJourneyTab].map((step, index) => (
                          <motion.div
                            key={index}
                            className="flex items-start space-x-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ 
                              delay: index * 0.1,
                              type: "spring",
                              stiffness: 80,
                              damping: 15
                            }}
                            whileHover={{ 
                              scale: 1.02, 
                              x: 5,
                              transition: { type: "spring", stiffness: 300 }
                            }}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-blue-600">
                                {step.icon}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                              <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Journey Tip */}
                      <motion.div 
                        className="bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-xl border border-blue-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Expert Tip</h4>
                            <p className="text-sm text-gray-600">
                              {activeJourneyTab === 'planning' && "Start your research 12-18 months before your intended start date for the best options."}
                              {activeJourneyTab === 'application' && "Keep copies of all documents and track application deadlines carefully."}
                              {activeJourneyTab === 'success' && "Book your flights early and arrange airport pickup for a smooth arrival."}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </Enhanced3DCard>

              {/* CTA Button */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <MicroInteractionButton>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg"
                  >
                    Start Your Journey Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </MicroInteractionButton>
                <p className="text-sm text-gray-500 mt-3">Join thousands of successful students</p>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </motion.div>
    </section>
  )
}