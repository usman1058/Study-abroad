'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import GlobalNavigation from '@/components/GlobalNavigation'
import {
  InteractiveFloatingElements,
  ScrollReveal,
  ParallaxContainer,
  Enhanced3DCard,
  StaggeredList,
  MicroInteractionButton
} from '@/components/animations/ReactBitsIntegration'
import {
  AnimatedBackground
} from '@/components/animations'

interface Testimonial {
  id: string
  name: string
  content: string
  role?: string
  company?: string
  active: boolean
}

export default function About() {
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
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground variant="about" />
      <InteractiveFloatingElements count={8} />
      
      {/* Navigation */}
      <GlobalNavigation currentPath="/about" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative pt-16">
        <div className="max-w-6xl mx-auto text-center z-10">
          <ScrollReveal>
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              About Your Mentor
            </motion.h1>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-4xl mx-auto"
            >
              With over a decade of experience in international education, I've helped hundreds of students 
              achieve their dreams of studying abroad.
            </motion.p>
          </ScrollReveal>
          
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <MicroInteractionButton
                onClick={() => window.location.href = '/contact'}
                size="lg"
                className="px-12 py-4 text-lg"
              >
                Get Personalized Advice
              </MicroInteractionButton>
              <MicroInteractionButton
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="lg"
                className="px-12 py-4 text-lg"
              >
                Back to Home
              </MicroInteractionButton>
            </div>
          </ScrollReveal>
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <motion.div
            className="w-full h-full border-4 border-purple-300 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 border-2 border-pink-300 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </section>

      {/* Biography Section */}
      <ParallaxContainer speed={0.3}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
          <ScrollReveal>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <ScrollReveal direction="left">
                  <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                    My Journey
                  </h2>
                  <StaggeredList staggerDelay={0.1}>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      My passion for international education began when I was a student myself, navigating the 
                      complex process of applying to universities abroad. I understand the challenges, fears, 
                      and excitement that come with this life-changing decision.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Over the years, I've built strong relationships with universities across Europe, 
                      particularly in Italy and UK, and have developed a deep understanding of what 
                      makes a successful application.
                    </p>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      My approach is personalized and holistic. I don't just help you get admitted; 
                      I help you find the right fit for your academic goals, budget, and career aspirations.
                    </p>
                  </StaggeredList>
                </ScrollReveal>
                
                <ScrollReveal direction="right" delay={0.2}>
                  <Enhanced3DCard>
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 shadow-2xl">
                      <StaggeredList staggerDelay={0.1}>
                        {[
                          { icon: "🎓", text: "10+ years of experience" },
                          { icon: "👥", text: "500+ students mentored" },
                          { icon: "📊", text: "95% success rate" },
                          { icon: "🌍", text: "Partner universities in 15+ countries" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-4">
                            <motion.div
                              className="text-3xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {item.icon}
                            </motion.div>
                            <span className="text-gray-800 font-medium text-lg">{item.text}</span>
                          </div>
                        ))}
                      </StaggeredList>
                    </div>
                  </Enhanced3DCard>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </ParallaxContainer>

      {/* My Approach */}
      <ScrollReveal>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Approach
              </h2>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Personalized Guidance",
                  description: "Every student is unique. I take the time to understand your goals, preferences, and constraints to provide tailored advice.",
                  icon: "🎯",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  title: "End-to-End Support",
                  description: "From university selection to visa applications, I'm with you every step of the way, ensuring nothing falls through the cracks.",
                  icon: "🤝",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Results-Driven",
                  description: "My focus is on getting you admitted to your dream university. I've developed proven strategies that maximize your chances of success.",
                  icon: "🚀",
                  color: "from-green-500 to-teal-500"
                }
              ].map((approach, index) => (
                <Enhanced3DCard key={approach.title}>
                  <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden">
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        className="text-6xl mb-4"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {approach.icon}
                      </motion.div>
                      <CardTitle className="text-xl bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${approach.color})` }}>
                        {approach.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 leading-relaxed">{approach.description}</p>
                    </CardContent>
                  </Card>
                </Enhanced3DCard>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Testimonials */}
      <ParallaxContainer speed={0.3}>
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm">
          <ScrollReveal>
            <div className="max-w-7xl mx-auto">
              <ScrollReveal direction="up">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  What My Students Say
                </h2>
              </ScrollReveal>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Enhanced3DCard key={testimonial.id}>
                    <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="pt-8">
                      <motion.div
                        className="text-4xl mb-4"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 400, damping: 10 }}
                        viewport={{ once: true }}
                      >
                        "❝"
                      </motion.div>
                      <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                        {testimonial.content}
                      </p>
                      <div className="mt-auto border-t pt-4">
                        <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                        {testimonial.role && (
                          <p className="text-sm text-gray-600">{testimonial.role}</p>
                        )}
                        {testimonial.company && (
                          <p className="text-sm text-gray-500">{testimonial.company}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Enhanced3DCard>
              ))}
            </div>
          </div>
        </ScrollReveal>
        </section>
      </ParallaxContainer>

      {/* CTA Section */}
      <ScrollReveal>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal direction="up">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Start Your Journey?
              </h2>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                Let's work together to make your study abroad dreams a reality.
              </p>
            </ScrollReveal>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <ScrollReveal direction="up" delay={0.4}>
                <MicroInteractionButton 
                  onClick={() => window.location.href = '/contact'}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
                >
                  Get Started Today
                </MicroInteractionButton>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.6}>
                <MicroInteractionButton 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="px-12 py-4 text-lg"
                >
                  Back to Home
                </MicroInteractionButton>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <ScrollReveal>
        <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-xl mb-8">
                Ready to start your study abroad journey?
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <MicroInteractionButton
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
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