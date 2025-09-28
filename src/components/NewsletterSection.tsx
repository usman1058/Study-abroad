'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Enhanced3DCard, ScrollReveal, MicroInteractionButton } from '@/components/animations/ReactBitsIntegration'

interface NewsletterForm {
  email: string
  name: string
}

export default function NewsletterSection() {
  const [formData, setFormData] = useState<NewsletterForm>({
    email: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof NewsletterForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Successfully subscribed! 🎉",
          description: "You'll receive our latest updates and exclusive content.",
        })
        setFormData({ email: '', name: '' })
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
    <ScrollReveal>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Stay Updated with Our Newsletter
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Get exclusive study abroad tips, scholarship opportunities, and latest updates delivered to your inbox.
            </motion.p>
          </div>

          <Enhanced3DCard>
            <Card className="shadow-2xl bg-white/95 backdrop-blur-sm border border-blue-200 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  viewport={{ once: true }}
                  className="text-5xl mb-4"
                >
                  📧
                </motion.div>
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Join Our Community
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Subscribe to get weekly insights and exclusive content
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { 
                        label: 'Your Name', 
                        field: 'name', 
                        placeholder: 'John Doe',
                        icon: '👤'
                      },
                      { 
                        label: 'Email Address', 
                        field: 'email', 
                        placeholder: 'john@example.com',
                        type: 'email',
                        icon: '📧'
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.field}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative"
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-400">{item.icon}</span>
                        </div>
                        <Label htmlFor={item.field} className="text-sm font-medium text-gray-700 sr-only">
                          {item.label}
                        </Label>
                        <Input
                          id={item.field}
                          type={item.type || 'text'}
                          value={formData[item.field as keyof NewsletterForm]}
                          onChange={(e) => handleInputChange(item.field as keyof NewsletterForm, e.target.value)}
                          placeholder={item.placeholder}
                          required
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <MicroInteractionButton
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center justify-center"
                        >
                          <span className="mr-2">⏳</span>
                          Subscribing...
                        </motion.div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="mr-2">🚀</span>
                          Subscribe Now
                        </div>
                      )}
                    </MicroInteractionButton>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {[
                      { icon: '🎓', text: 'Study Tips' },
                      { icon: '💰', text: 'Scholarships' },
                      { icon: '🌍', text: 'Global Insights' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.p 
                    className="text-sm text-gray-600 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    By subscribing, you agree to receive our newsletter. You can unsubscribe at any time. 
                    We respect your privacy and will never share your email address.
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