'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import {
  ScrollReveal,
  ParallaxContainer,
  Enhanced3DCard,
  StaggeredList,
  MicroInteractionButton
} from '@/components/animations/ReactBitsIntegration'

// Testimonials Section
interface Testimonial {
  id: string
  name: string
  content: string
  role?: string
  company?: string
  active: boolean
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials?active=true')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    }
  }

  return (
    <ParallaxContainer speed={0.3}>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What Students Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from students who have successfully embarked on their study abroad journey with my guidance
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={testimonial.id} direction="up" delay={index * 0.1}>
                <Enhanced3DCard>
                  <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          {testimonial.role && (
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                          )}
                          {testimonial.company && (
                            <p className="text-xs text-gray-500">{testimonial.company}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.content}"</p>
                      <div className="flex mt-4">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Enhanced3DCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ParallaxContainer>
  )
}

// Services Section
export function ServicesSection() {
  const services = [
    {
      title: "University Selection",
      description: "Personalized guidance to find the perfect university that matches your academic goals and budget",
      icon: "🎓",
      features: ["Profile assessment", "University matching", "Application strategy"]
    },
    {
      title: "Application Assistance",
      description: "Complete support with university applications, essays, and documentation",
      icon: "📝",
      features: ["Essay review", "Document preparation", "Application tracking"]
    },
    {
      title: "Visa Guidance",
      description: "Expert assistance with visa applications and immigration requirements",
      icon: "🛂",
      features: ["Document checklist", "Application support", "Interview preparation"]
    },
    {
      title: "Pre-departure Support",
      description: "Comprehensive preparation for your study abroad experience",
      icon: "✈️",
      features: ["Accommodation help", "Cultural orientation", "Travel planning"]
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              My Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support throughout your study abroad journey
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <Enhanced3DCard>
                <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 text-center">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Enhanced3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Statistics Section
export function StatisticsSection() {
  const stats = [
    { number: "500+", label: "Students Guided", icon: "👥" },
    { number: "50+", label: "Partner Universities", icon: "🏛️" },
    { number: "15+", label: "Countries Covered", icon: "🌍" },
    { number: "95%", label: "Success Rate", icon: "📈" }
  ]

  return (
    <ParallaxContainer speed={0.2}>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Achievements
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Numbers that speak for themselves
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-5xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-lg text-blue-100">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ParallaxContainer>
  )
}

// FAQ Section
export function FAQSection() {
  const faqs = [
    {
      question: "How much do your services cost?",
      answer: "I offer flexible pricing plans based on your needs. The initial consultation is completely free, and we can discuss personalized packages that fit your budget."
    },
    {
      question: "Which countries do you specialize in?",
      answer: "I specialize in study opportunities across Europe, North America, Australia, and Asia. My expertise covers popular destinations like the UK, USA, Canada, Italy, and many more."
    },
    {
      question: "How long does the application process take?",
      answer: "The timeline varies depending on the country and university. Generally, I recommend starting 6-12 months before your intended start date to ensure a smooth application process."
    },
    {
      question: "Do you help with scholarships?",
      answer: "Yes! I help students identify and apply for scholarships and financial aid opportunities. I have experience with various scholarship programs and can guide you through the application process."
    },
    {
      question: "What makes your service different?",
      answer: "I provide personalized, one-on-one guidance tailored to your specific goals and circumstances. With years of experience and a network of university contacts, I offer insights that you won't find in generic advice."
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about studying abroad
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.1}>
              <Enhanced3DCard>
                <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              </Enhanced3DCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
interface ContactForm {
  name: string
  email: string
  phone: string
  education: string
  countryToGo: string
  budget: string
  timeline: string
  message: string
}

export function ContactSection() {
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
          sourcePage: 'homepage'
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
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
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
    <ParallaxContainer speed={0.3}>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ready to start your study abroad journey? Fill out the form below and I'll provide you with personalized guidance
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left" delay={0.3}>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">📧 Contact Information</h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <strong>Email:</strong> mentor@studyabroad.com
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                    <p className="text-gray-700">
                      <strong>Response Time:</strong> 24-48 hours
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 What to Expect</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Free initial consultation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Personalized guidance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>University matching</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Application support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.3}>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Form</CardTitle>
                  <CardDescription>
                    Fill out the form and I'll get back to you with personalized advice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <StaggeredList staggerDelay={0.05}>
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

                      <div>
                        <Label htmlFor="message" className="text-sm font-medium">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Tell me about your study abroad goals and preferences..."
                          required
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                    </StaggeredList>

                    <MicroInteractionButton
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </MicroInteractionButton>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </ParallaxContainer>
  )
}

// Newsletter Signup Section
export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter!",
        })
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal direction="up" delay={0.2}>
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Subscribe to our newsletter for the latest study abroad tips, university updates, and exclusive offers
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4}>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1"
            />
            <MicroInteractionButton
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </MicroInteractionButton>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}