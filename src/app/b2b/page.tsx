'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import GlobalNavigation from '@/components/GlobalNavigation'
import {
  Enhanced3DCard,
  ScrollReveal,
  ParallaxContainer,
  MicroInteractionButton,
  InteractiveFloatingElements
} from '@/components/animations/ReactBitsIntegration'
import { AnimatedBackground } from '@/components/animations'
import { 
  Handshake, 
  Users, 
  Globe, 
  Award, 
  Building, 
  GraduationCap, 
  Target,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react'

interface B2BForm {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  serviceType: string
  message: string
}

export default function B2BPage() {
  const [b2bForm, setB2bForm] = useState<B2BForm>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    serviceType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

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
      setIsSubmitting(false)
    }
  }

  const stats = [
    { icon: <Building className="w-6 h-6" />, value: "500+", label: "Partner Institutions" },
    { icon: <Users className="w-6 h-6" />, value: "50K+", label: "Students Placed" },
    { icon: <Globe className="w-6 h-6" />, value: "25+", label: "Countries" },
    { icon: <Award className="w-6 h-6" />, value: "98%", label: "Success Rate" }
  ]

  const services = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "University Partnerships",
      description: "Connect with prestigious universities worldwide for student recruitment and academic collaborations."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Student Recruitment",
      description: "Comprehensive student recruitment services including counseling, application processing, and visa assistance."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Corporate Training",
      description: "Customized training programs for corporate clients focusing on international education and cultural competency."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Market Expansion",
      description: "Strategic partnerships to expand your educational services into new markets and regions."
    }
  ]

  const benefits = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Global Network",
      description: "Access to our extensive network of universities, colleges, and educational institutions worldwide."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Expert Support",
      description: "Dedicated account managers and support teams with deep expertise in international education."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Technology Platform",
      description: "State-of-the-art technology platform for seamless application processing and student management."
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Marketing Resources",
      description: "Comprehensive marketing materials, training, and promotional support for our partners."
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      <InteractiveFloatingElements count={4} />
      
      {/* Navigation */}
      <GlobalNavigation currentPath="/b2b" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-blue-600/10"></div>
        
        <div className="max-w-7xl mx-auto text-center z-10 relative">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 px-4 py-2 text-lg">
                <Handshake className="w-4 h-4 mr-2" />
                Business Partnership
              </Badge>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                B2B
              </span>
              <br />
              <span className="text-gray-900">Partnership Opportunities</span>
            </motion.h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              Partner with us to provide exceptional study abroad services. 
              We offer comprehensive solutions for educational institutions, recruitment agencies, and corporate partners.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="px-12 py-4 text-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-xl"
                >
                  <Handshake className="w-5 h-5 mr-2" />
                  Become a Partner
                </MicroInteractionButton>
              </Enhanced3DCard>
              
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => window.location.href = '/contact'}
                  variant="outline"
                  size="lg"
                  className="px-12 py-4 text-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Us
                </MicroInteractionButton>
              </Enhanced3DCard>
            </div>
          </ScrollReveal>

          {/* Stats */}
          <ScrollReveal direction="up" delay={0.5}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-200"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex justify-center mb-3 text-indigo-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <ParallaxContainer speed={0.2}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partnership Services</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Comprehensive solutions tailored to meet your organization's specific needs
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <Enhanced3DCard>
                    <Card className="h-full text-center p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                          {service.icon}
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-3">{service.title}</CardTitle>
                      <CardDescription className="text-gray-600">{service.description}</CardDescription>
                    </Card>
                  </Enhanced3DCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxContainer>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the advantages of joining our global education network
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                          {benefit.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section id="partnership-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Partnership Journey</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tell us about your organization and how we can collaborate
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Enhanced3DCard>
              <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-indigo-200 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600"></div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Partnership Inquiry Form
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Fill out the form below and our partnership team will contact you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleB2bSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={b2bForm.email}
                          onChange={(e) => setB2bForm({...b2bForm, email: e.target.value})}
                          placeholder="your@email.com"
                          required
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
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
                          placeholder="+1 (555) 123-4567"
                          required
                          className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700 mb-2 block">
                        Service Type Interest *
                      </Label>
                      <Select onValueChange={(value) => setB2bForm({...b2bForm, serviceType: value})}>
                        <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="university-partnership">University Partnership</SelectItem>
                          <SelectItem value="student-recruitment">Student Recruitment</SelectItem>
                          <SelectItem value="corporate-training">Corporate Training</SelectItem>
                          <SelectItem value="market-expansion">Market Expansion</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={b2bForm.message}
                        onChange={(e) => setB2bForm({...b2bForm, message: e.target.value})}
                        placeholder="Tell us about your organization and partnership goals..."
                        required
                        rows={5}
                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex justify-center">
                      <MicroInteractionButton
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Handshake className="w-5 h-5 mr-2" />
                            Submit Partnership Inquiry
                          </>
                        )}
                      </MicroInteractionButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </Enhanced3DCard>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <ParallaxContainer speed={0.1}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
              <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
                Join our network of successful partners and unlock new opportunities in the global education market.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
                    size="lg"
                    className="px-12 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-100 shadow-xl"
                  >
                    <Handshake className="w-5 h-5 mr-2" />
                    Start Partnership
                  </MicroInteractionButton>
                </Enhanced3DCard>
                
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => window.location.href = '/contact'}
                    variant="outline"
                    size="lg"
                    className="px-12 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-indigo-600"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Talk to Expert
                  </MicroInteractionButton>
                </Enhanced3DCard>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxContainer>
    </div>
  )
}