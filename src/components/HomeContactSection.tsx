'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Enhanced3DCard, ScrollReveal, MicroInteractionButton } from '@/components/animations/ReactBitsIntegration'

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

export default function HomeContactSection() {
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

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
          sourcePage: 'home_contact'
        }),
      })

      if (response.ok) {
        toast({
          title: "Message Sent Successfully! 🎉",
          description: "I'll get back to you within 24 hours with personalized guidance.",
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
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollReveal>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Let's Start Your Study Abroad Journey
                </h2>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  With over a decade of experience, I've helped hundreds of students achieve their dreams of studying abroad. 
                  Whether you're interested in Italy, UK, or other destinations, I'm here to guide you every step of the way.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: "🎯", title: "Personalized Guidance", desc: "Tailored advice based on your academic goals and budget" },
                  { icon: "🌍", title: "Global Network", desc: "Partnerships with top universities across Europe" },
                  { icon: "📊", title: "95% Success Rate", desc: "Proven track record of successful admissions" },
                  { icon: "💼", title: "Career Focus", desc: "Guidance aligned with your career aspirations" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-700">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-900">Quick Response</h4>
                    <p className="text-blue-700 text-sm">I typically respond within 24 hours</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Enhanced3DCard>
                <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-gray-200">
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Get Personalized Advice
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600">
                      Fill out the form and I'll help you find the perfect study abroad program
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { label: 'Full Name', field: 'name', placeholder: 'John Doe', required: true },
                          { label: 'Email Address', field: 'email', placeholder: 'john@example.com', type: 'email', required: true },
                          { label: 'Phone Number', field: 'phone', placeholder: '+1234567890', required: true },
                          { label: 'Current Education', field: 'education', placeholder: 'High School / Bachelor\'s', required: true }
                        ].map((item, index) => (
                          <motion.div
                            key={item.field}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            viewport={{ once: true }}
                          >
                            <Label htmlFor={item.field} className="text-sm font-medium text-gray-700">
                              {item.label}
                            </Label>
                            <Input
                              id={item.field}
                              type={item.type || 'text'}
                              value={formData[item.field as keyof ContactForm]}
                              onChange={(e) => handleInputChange(item.field as keyof ContactForm, e.target.value)}
                              placeholder={item.placeholder}
                              required={item.required}
                              className="mt-1"
                            />
                          </motion.div>
                        ))}
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          viewport={{ once: true }}
                        >
                          <Label htmlFor="countryToGo" className="text-sm font-medium text-gray-700">
                            Preferred Country
                          </Label>
                          <Select onValueChange={(value) => handleInputChange('countryToGo', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Italy">🇮🇹 Italy</SelectItem>
                              <SelectItem value="UK">🇬🇧 UK</SelectItem>
                              <SelectItem value="France">🇫🇷 France</SelectItem>
                              <SelectItem value="Spain">🇪🇸 Spain</SelectItem>
                              <SelectItem value="Netherlands">🇳🇱 Netherlands</SelectItem>
                              <SelectItem value="Other">🌍 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          viewport={{ once: true }}
                        >
                          <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                            Budget Range
                          </Label>
                          <Select onValueChange={(value) => handleInputChange('budget', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under €10,000">Under €10,000</SelectItem>
                              <SelectItem value="€10,000 - €20,000">€10,000 - €20,000</SelectItem>
                              <SelectItem value="€20,000 - €30,000">€20,000 - €30,000</SelectItem>
                              <SelectItem value="€30,000+">€30,000+</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          viewport={{ once: true }}
                        >
                          <Label htmlFor="timeline" className="text-sm font-medium text-gray-700">
                            Timeline
                          </Label>
                          <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Immediate">Immediate (Next 3 months)</SelectItem>
                              <SelectItem value="6 months">6 months</SelectItem>
                              <SelectItem value="1 year">1 year</SelectItem>
                              <SelectItem value="2 years">2 years</SelectItem>
                              <SelectItem value="Just exploring">Just exploring</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        viewport={{ once: true }}
                      >
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Tell me about your goals
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="What are you hoping to achieve? What subjects are you interested in? Any specific questions?"
                          rows={4}
                          className="mt-1"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                      >
                        <MicroInteractionButton
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              ⏳ Sending...
                            </motion.div>
                          ) : (
                            <span>Get Free Consultation</span>
                          )}
                        </MicroInteractionButton>
                      </motion.div>

                      <motion.p 
                        className="text-sm text-gray-600 text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        viewport={{ once: true }}
                      >
                        Your information is secure and will never be shared with third parties.
                      </motion.p>
                    </form>
                  </CardContent>
                </Card>
              </Enhanced3DCard>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}