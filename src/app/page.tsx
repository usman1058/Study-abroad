'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { toast } from '@/hooks/use-toast'
import LoadingPage from '@/components/LoadingPage'
import HeroSection from '@/components/HeroSection'
import StatisticsSection from '@/components/StatisticsSection'
import ServicesSection from '@/components/ServicesSection'
import HomeContactSection from '@/components/HomeContactSection'
import NewsletterSection from '@/components/NewsletterSection'
import {
  InteractiveFloatingElements,
  ScrollReveal,
  ParallaxContainer,
  Enhanced3DCard,
  StaggeredList,
  MicroInteractionButton
} from '@/components/animations/ReactBitsIntegration'
import GlobalNavigation from '@/components/GlobalNavigation'
import { AnimatedBackground } from '@/components/animations'

interface University {
  id: string
  name: string
  country: string
  description: string
  duration: string
  tuitionFee: string
  featured: boolean
  logo?: string
}



export default function Home() {
  const [universities, setUniversities] = useState<University[]>([])
  const [italyUniversities, setItalyUniversities] = useState<University[]>([])
  const [ukUniversities, setUkUniversities] = useState<University[]>([])
  const [luckyDrawForm, setLuckyDrawForm] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [b2bForm, setB2bForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isB2bSubmitting, setIsB2bSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    fetchFeaturedUniversities()
    fetchItalyUniversities()
    fetchUkUniversities()
    
    return () => clearTimeout(timer)
  }, [])

  const fetchFeaturedUniversities = async () => {
    try {
      const response = await fetch('/api/universities?featured=true')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || data)
        console.log('Featured universities loaded:', data.universities?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const fetchItalyUniversities = async () => {
    try {
      const response = await fetch('/api/universities?country=Italy&limit=6')
      if (response.ok) {
        const data = await response.json()
        setItalyUniversities(data.universities || data)
        console.log('Italy universities loaded:', data.universities?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching Italy universities:', error)
    }
  }

  const fetchUkUniversities = async () => {
    try {
      const response = await fetch('/api/universities?country=UK&limit=6')
      if (response.ok) {
        const data = await response.json()
        setUkUniversities(data.universities || data)
        console.log('UK universities loaded:', data.universities?.length || 0)
      }
    } catch (error) {
      console.error('Error fetching UK universities:', error)
    }
  }

  const handleLuckyDrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/luckydraw/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(luckyDrawForm),
      })

      if (response.ok) {
        toast({
          title: "Success! 🎉",
          description: "You've been entered into the lucky draw. Good luck!",
        })
        setLuckyDrawForm({ name: '', email: '', phone: '' })
      } else {
        throw new Error('Failed to enter lucky draw')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enter lucky draw. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsB2bSubmitting(true)

    try {
      // Get client IP and user agent
      const ipAddress = '127.0.0.1' // In production, this would be obtained from the request
      const userAgent = navigator.userAgent

      const response = await fetch('/api/b2b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...b2bForm,
          ipAddress,
          userAgent
        }),
      })

      if (response.ok) {
        toast({
          title: "Success! 🤝",
          description: "Your B2B inquiry has been submitted. We'll contact you within 24 hours.",
        })
        setB2bForm({ 
          companyName: '', 
          contactPerson: '', 
          email: '', 
          phone: '', 
          serviceType: '', 
          message: '' 
        })
      } else {
        throw new Error('Failed to submit B2B inquiry')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit B2B inquiry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsB2bSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      <InteractiveFloatingElements count={2} />
      
      {/* Navigation */}
      <GlobalNavigation />

      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Featured Universities Section */}
      <ParallaxContainer speed={0.2}>
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Featured Universities
                </h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Discover top-ranked institutions from Italy and UK
                </p>
              </div>
            </ScrollReveal>

            {/* Combined Universities Carousel */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {[...italyUniversities.slice(0, 3), ...ukUniversities.slice(0, 3)].map((university, index) => (
                      <CarouselItem key={university.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Enhanced3DCard>
                            <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm overflow-hidden group">
                              <div className={`h-2 bg-gradient-to-r ${
                                university.country === 'Italy' 
                                  ? 'from-blue-600 to-purple-600' 
                                  : 'from-purple-600 to-pink-600'
                              }`}></div>
                              <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                      {university.name}
                                    </CardTitle>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="secondary" className={
                                        university.country === 'Italy' 
                                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                                          : 'bg-purple-100 text-purple-800 border-purple-200'
                                      }>
                                        {university.country}
                                      </Badge>
                                      {university.featured && (
                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                          ⭐ Featured
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                                  {university.description}
                                </p>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">📅 Duration</span>
                                    <span className="text-xs font-semibold text-gray-900">{university.duration}</span>
                                  </div>
                                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">💰 Tuition</span>
                                    <span className="text-xs font-semibold text-green-600">{university.tuitionFee}</span>
                                  </div>
                                </div>
                                
                                <MicroInteractionButton 
                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                                  onClick={() => window.location.href = university.country === 'Italy' ? '/study-in-italy' : '/study-in-uk'}
                                >
                                  Learn More
                                </MicroInteractionButton>
                              </CardContent>
                            </Card>
                          </Enhanced3DCard>
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center mt-6 space-x-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                  </div>
                </Carousel>
              </div>
            </ScrollReveal>

            {/* View All Buttons */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                <Button 
                  onClick={() => window.location.href = '/study-in-italy'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  🇮🇹 View All Italy Universities
                </Button>
                <Button 
                  onClick={() => window.location.href = '/study-in-uk'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  🇬🇧 View All UK Universities
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxContainer>

      {/* Contact Section */}
      <HomeContactSection />

      {/* B2B Section */}
      <ParallaxContainer speed={0.2}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  B2B Partnership Opportunities
                </h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                  Partner with us to provide exceptional study abroad services to your clients. 
                  We offer comprehensive solutions for educational institutions, recruitment agencies, and corporate partners.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - B2B Form */}
              <ScrollReveal direction="up" delay={0.3}>
                <Enhanced3DCard>
                  <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-blue-200 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600"></div>
                    <CardHeader className="text-center pb-6">
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        Partner With Us
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Tell us about your organization and how we can collaborate
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <form onSubmit={handleB2bSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">
                              Company Name *
                            </Label>
                            <Input
                              id="companyName"
                              value={b2bForm.companyName}
                              onChange={(e) => setB2bForm({...b2bForm, companyName: e.target.value})}
                              placeholder="Your company name"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="contactPerson" className="text-sm font-medium text-gray-700 mb-2 block">
                              Contact Person *
                            </Label>
                            <Input
                              id="contactPerson"
                              value={b2bForm.contactPerson}
                              onChange={(e) => setB2bForm({...b2bForm, contactPerson: e.target.value})}
                              placeholder="Full name"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={b2bForm.email}
                              onChange={(e) => setB2bForm({...b2bForm, email: e.target.value})}
                              placeholder="business@email.com"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                              Phone Number *
                            </Label>
                            <Input
                              id="phone"
                              value={b2bForm.phone}
                              onChange={(e) => setB2bForm({...b2bForm, phone: e.target.value})}
                              placeholder="+1234567890"
                              required
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700 mb-2 block">
                            Service Type *
                          </Label>
                          <select
                            id="serviceType"
                            value={b2bForm.serviceType}
                            onChange={(e) => setB2bForm({...b2bForm, serviceType: e.target.value})}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select service type</option>
                            <option value="partnership">Strategic Partnership</option>
                            <option value="recruitment">Student Recruitment</option>
                            <option value="training">Training Programs</option>
                            <option value="consulting">Educational Consulting</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                            Message *
                          </Label>
                          <textarea
                            id="message"
                            value={b2bForm.message}
                            onChange={(e) => setB2bForm({...b2bForm, message: e.target.value})}
                            placeholder="Tell us about your partnership goals and requirements..."
                            required
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                          />
                        </div>
                        
                        <MicroInteractionButton
                          type="submit"
                          className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-700 text-white font-semibold py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={isB2bSubmitting}
                        >
                          {isB2bSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="flex items-center justify-center"
                            >
                              <span className="mr-2">⏳</span>
                              Submitting...
                            </motion.div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <span className="mr-2">🤝</span>
                              Submit Partnership Inquiry
                            </div>
                          )}
                        </MicroInteractionButton>
                      </form>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800 text-center">
                          <strong>Response Time:</strong> We'll contact you within 24 business hours<br/>
                          <span className="text-xs">All inquiries are handled by our partnership team</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Enhanced3DCard>
              </ScrollReveal>

              {/* Right side - B2B Benefits */}
              <ScrollReveal direction="up" delay={0.4}>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h3>
                    <div className="space-y-4">
                      {[
                        {
                          icon: "🎯",
                          title: "Extensive Network",
                          description: "Access to 500+ universities across Italy, UK, and other European countries"
                        },
                        {
                          icon: "📊",
                          title: "Proven Track Record",
                          description: "10+ years of experience with 95% student satisfaction rate"
                        },
                        {
                          icon: "🌍",
                          title: "Global Reach",
                          description: "Partners with institutions and agencies in 25+ countries"
                        },
                        {
                          icon: "💼",
                          title: "Comprehensive Support",
                          description: "End-to-end services from counseling to post-arrival support"
                        }
                      ].map((benefit, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-100">
                          <div className="text-2xl">{benefit.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <h4 className="font-bold text-gray-900 mb-3">Our Partnership Programs</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm">University Partnerships</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Agency Collaborations</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Corporate Training</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700 text-sm">Educational Consulting</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ParallaxContainer>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Lucky Draw Section */}
      <ParallaxContainer speed={0.15}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-red-400 rounded-full blur-3xl"></div>
          </div>
          
          <ScrollReveal>
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-center mb-12">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    repeatDelay: 2 
                  }}
                >
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                    🎯 Lucky Draw
                  </h2>
                </motion.div>
                <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                  Enter for a chance to win <span className="font-bold text-orange-600">FREE consultation services</span> worth $500!
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Form */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Enhanced3DCard>
                    <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-orange-200 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                      <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl font-bold text-gray-900">
                          Enter the Draw
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                          Fill in your details for a chance to win
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <form onSubmit={handleLuckyDrawSubmit} className="space-y-4">
                          <StaggeredList staggerDelay={0.1}>
                            {[
                              { 
                                field: 'name', 
                                label: 'Full Name', 
                                placeholder: 'John Doe',
                                icon: '👤'
                              },
                              { 
                                field: 'email', 
                                label: 'Email Address', 
                                placeholder: 'john@example.com',
                                type: 'email',
                                icon: '📧'
                              },
                              { 
                                field: 'phone', 
                                label: 'Phone Number', 
                                placeholder: '+1234567890',
                                icon: '📱'
                              }
                            ].map((item, index) => (
                              <div key={item.field} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-400">{item.icon}</span>
                                </div>
                                <Input
                                  id={item.field}
                                  type={item.type || 'text'}
                                  value={luckyDrawForm[item.field as keyof typeof luckyDrawForm]}
                                  onChange={(e) => setLuckyDrawForm({...luckyDrawForm, [item.field]: e.target.value})}
                                  placeholder={item.placeholder}
                                  required
                                  className="pl-10 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                                />
                              </div>
                            ))}
                          </StaggeredList>
                          
                          <MicroInteractionButton
                            type="submit"
                            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="flex items-center justify-center"
                              >
                                <span className="mr-2">⏳</span>
                                Entering...
                              </motion.div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <span className="mr-2">🎉</span>
                                Enter Lucky Draw
                              </div>
                            )}
                          </MicroInteractionButton>
                        </form>
                        
                        <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-800 text-center">
                            <strong>Next Draw:</strong> End of this month<br/>
                            <span className="text-xs">Winner will be notified via email</span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Enhanced3DCard>
                </motion.div>

                {/* Right side - Prize info */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-6">
                    {/* Prize Card */}
                    <Enhanced3DCard>
                      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 border border-orange-200">
                        <div className="text-center mb-6">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0]
                            }}
                            transition={{ 
                              duration: 4, 
                              repeat: Infinity, 
                              repeatDelay: 3 
                            }}
                            className="text-6xl mb-4"
                          >
                            🏆
                          </motion.div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Grand Prize
                          </h3>
                          <p className="text-3xl font-bold text-orange-600">
                            $500 VALUE
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">Free 1-on-1 consultation session</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">Personalized university selection</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">Application review & guidance</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700">Visa preparation assistance</span>
                          </div>
                        </div>
                      </div>
                    </Enhanced3DCard>

                    {/* Testimonial */}
                    <Enhanced3DCard>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                            👤
                          </div>
                          <div>
                            <p className="text-gray-700 italic mb-2">
                              "I won the lucky draw and got amazing guidance! Helped me get into my dream university in the UK."
                            </p>
                            <p className="text-sm font-semibold text-gray-900">- Sarah M., Winner</p>
                          </div>
                        </div>
                      </div>
                    </Enhanced3DCard>
                  </div>
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </ParallaxContainer>

      {/* Footer */}
      <ScrollReveal>
        <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-xl mb-8">
                Ready to start your study abroad journey?
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <MicroInteractionButton
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Get Started Today
              </MicroInteractionButton>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.6}>
              <div className="mt-12 pt-8 border-t border-gray-700">
                <p className="text-gray-400">
                  © 2024 Study Abroad Mentor. All rights reserved.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  )
}