'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import GlobalNavigation from '@/components/GlobalNavigation'
import {
  InteractiveFloatingElements,
  ScrollReveal,
  ParallaxContainer,
  Enhanced3DCard,
  MicroInteractionButton
} from '@/components/animations/ReactBitsIntegration'
import { AnimatedBackground } from '@/components/animations'

interface University {
  id: string
  name: string
  country: string
}

interface ContactForm {
  name: string
  email: string
  phone: string
  education: string
  countryToGo: string
  budget: string
  timeline: string
  message: string
  universityId?: string
}

export default function Contact() {
  const [universities, setUniversities] = useState<University[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    education: '',
    countryToGo: '',
    budget: '',
    timeline: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchUniversities()
    checkForPreselectedUniversity()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities?limit=100')
      if (response.ok) {
        const data = await response.json()
        setUniversities(data.universities || [])
      }
    } catch (error) {
      console.error('Error fetching universities:', error)
    }
  }

  const checkForPreselectedUniversity = () => {
    const universityId = sessionStorage.getItem('selectedUniversity')
    if (universityId) {
      // Find the university in the list (we'll set it when universities are loaded)
      setFormData(prev => ({ ...prev, universityId }))
      sessionStorage.removeItem('selectedUniversity')
    }
  }

  useEffect(() => {
    if (formData.universityId && universities.length > 0) {
      const university = universities.find(u => u.id === formData.universityId)
      setSelectedUniversity(university || null)
    }
  }, [formData.universityId, universities])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sourcePage: 'contact'
        }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your message has been sent. I'll get back to you soon!",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          education: '',
          countryToGo: '',
          budget: '',
          timeline: '',
          message: ''
        })
        setSelectedUniversity(null)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit form')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <AnimatedBackground />
      {/* <AnimatedBackground /> */}
      
      {/* Navigation */}
      <GlobalNavigation currentPath="/contact" />

      {/* Hero Section */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-600/10"></div>
        
        <div className="max-w-4xl mx-auto text-center z-10 relative">
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Get Personalized Advice
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto">
              Ready to take the next step in your study abroad journey? 
              Fill out the form below and I'll provide you with personalized guidance 
              tailored to your goals and preferences.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl"
                >
                  Start Your Journey
                </MicroInteractionButton>
              </Enhanced3DCard>
              
              <Enhanced3DCard>
                <MicroInteractionButton
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  size="lg"
                  className="px-12 py-4 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Back to Home
                </MicroInteractionButton>
              </Enhanced3DCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Form</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Please fill out all required fields so I can provide you with the best guidance.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Enhanced3DCard>
              <Card className="shadow-2xl bg-white border-0">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">Get In Touch</CardTitle>
                  <CardDescription className="text-gray-600">
                    I'll get back to you within 24-48 hours with personalized guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected University Display */}
                {selectedUniversity && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Selected University</p>
                        <p className="text-lg font-semibold text-blue-700">{selectedUniversity.name}</p>
                        <Badge variant="secondary" className="mt-1">{selectedUniversity.country}</Badge>
                      </div>
                      <Button 
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUniversity(null)
                          handleInputChange('universityId', '')
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1234567890"
                    required
                    className="mt-1"
                  />
                </div>

                {/* Current Education */}
                <div>
                  <Label htmlFor="education" className="text-sm font-medium">
                    Current Education <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('education', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                      <SelectItem value="Master's">Master's</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Country */}
                <div>
                  <Label htmlFor="countryToGo" className="text-sm font-medium">
                    Preferred Country <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('countryToGo', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your preferred country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Range */}
                <div>
                  <Label htmlFor="budget" className="text-sm font-medium">
                    Budget Range <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under $20,000">Under $20,000</SelectItem>
                      <SelectItem value="$20,000–$30,000">$20,000–$30,000</SelectItem>
                      <SelectItem value="$30,000–$40,000">$30,000–$40,000</SelectItem>
                      <SelectItem value="$40,000–$50,000">$40,000–$50,000</SelectItem>
                      <SelectItem value="Over $50,000">Over $50,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timeline */}
                <div>
                  <Label htmlFor="timeline" className="text-sm font-medium">
                    Timeline <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate (Next 3 months)">Immediate (Next 3 months)</SelectItem>
                      <SelectItem value="Soon (3–6 months)">Soon (3–6 months)</SelectItem>
                      <SelectItem value="Medium (6–12 months)">Medium (6–12 months)</SelectItem>
                      <SelectItem value="Long (1+ year)">Long (1+ year)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell me about your study abroad goals, preferences, and any specific questions you have..."
                    required
                    className="mt-1"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <MicroInteractionButton 
                    type="submit" 
                    className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
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

      {/* Additional Information */}
      <ParallaxContainer speed={0.2}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose My Guidance?</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  I provide comprehensive support throughout your study abroad journey
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "📧",
                  title: "Quick Response",
                  description: "I typically respond to all inquiries within 24-48 hours. For urgent matters, please indicate so in your message."
                },
                {
                  icon: "🎯",
                  title: "Personalized Approach",
                  description: "Every student is unique. I provide customized guidance based on your specific goals, budget, and preferences."
                },
                {
                  icon: "📋",
                  title: "Free Consultation",
                  description: "Your initial consultation is completely free. Let's discuss how I can help you achieve your study abroad dreams."
                }
              ].map((item, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <Enhanced3DCard>
                    <Card className="h-full text-center p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="text-5xl mb-4">{item.icon}</div>
                      <CardTitle className="text-lg mb-3">{item.title}</CardTitle>
                      <CardDescription className="text-gray-600">{item.description}</CardDescription>
                    </Card>
                  </Enhanced3DCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ParallaxContainer>

      {/* CTA Section */}
      <ParallaxContainer speed={0.1}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Take the first step towards your dream education abroad. I'm here to guide you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                    size="lg"
                    className="px-12 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
                  >
                    Get Started Now
                  </MicroInteractionButton>
                </Enhanced3DCard>
                
                <Enhanced3DCard>
                  <MicroInteractionButton
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    size="lg"
                    className="px-12 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Explore More
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