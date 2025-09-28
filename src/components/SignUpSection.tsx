'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Enhanced3DCard, ScrollReveal, MicroInteractionButton } from '@/components/animations/ReactBitsIntegration'

interface SignUpForm {
  name: string
  email: string
  phone: string
  education: string
  interests: string
}

export default function SignUpSection() {
  const [formData, setFormData] = useState<SignUpForm>({
    name: '',
    email: '',
    phone: '',
    education: '',
    interests: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof SignUpForm, value: string) => {
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
          countryToGo: 'Not specified',
          budget: 'Not specified',
          timeline: 'Not specified',
          message: `User signed up for updates. Interests: ${formData.interests}`,
          sourcePage: 'home_signup'
        }),
      })

      if (response.ok) {
        toast({
          title: "Welcome aboard! 🎉",
          description: "You've successfully signed up for study abroad updates.",
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          education: '',
          interests: ''
        })
      } else {
        throw new Error('Failed to sign up')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollReveal>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stay Updated on Study Abroad Opportunities
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get personalized recommendations, exclusive scholarship information, and expert guidance delivered to your inbox.
            </motion.p>
          </div>

          <Enhanced3DCard>
            <Card className="shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sign Up for Updates
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Join thousands of students who have successfully studied abroad with our guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: 'Full Name', field: 'name', placeholder: 'John Doe', required: true },
                      { label: 'Email Address', field: 'email', placeholder: 'john@example.com', type: 'email', required: true },
                      { label: 'Phone Number', field: 'phone', placeholder: '+1234567890', required: true },
                      { label: 'Current Education', field: 'education', placeholder: 'High School / Bachelor\'s Degree', required: true }
                    ].map((item, index) => (
                      <motion.div
                        key={item.field}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Label htmlFor={item.field} className="text-sm font-medium text-gray-700">
                          {item.label}
                        </Label>
                        <Input
                          id={item.field}
                          type={item.type || 'text'}
                          value={formData[item.field as keyof SignUpForm]}
                          onChange={(e) => handleInputChange(item.field as keyof SignUpForm, e.target.value)}
                          placeholder={item.placeholder}
                          required={item.required}
                          className="mt-1"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Label htmlFor="interests" className="text-sm font-medium text-gray-700">
                      What are you most interested in?
                    </Label>
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      placeholder="e.g., Engineering, Medicine, Business, Arts..."
                      className="mt-1"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
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
                          ⏳ Signing up...
                        </motion.div>
                      ) : (
                        <span>Get Started Today</span>
                      )}
                    </MicroInteractionButton>
                  </motion.div>

                  <motion.p 
                    className="text-sm text-gray-600 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    By signing up, you agree to receive educational updates and personalized guidance. 
                    We respect your privacy and you can unsubscribe anytime.
                  </motion.p>
                </form>
              </CardContent>
            </Card>
          </Enhanced3DCard>
        </div>
      </section>
    </ScrollReveal>
  )
}