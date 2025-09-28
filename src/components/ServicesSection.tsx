'use client'

import { motion } from 'framer-motion'
import { ScrollReveal, Enhanced3DCard } from '@/components/animations/ReactBitsIntegration'
import { Button } from '@/components/ui/button'

const services = [
  {
    title: "University Selection",
    description: "Find the perfect university that matches your academic goals, budget, and career aspirations. We help you navigate through hundreds of options to find your ideal fit.",
    icon: "🎯",
    features: ["Personalized matching", "Budget analysis", "Career alignment", "Success rate analysis"]
  },
  {
    title: "Application Assistance",
    description: "From crafting compelling personal statements to preparing outstanding application packages, we guide you through every step of the application process.",
    icon: "📝",
    features: ["Personal statement help", "Document review", "Application tracking", "Deadline management"]
  },
  {
    title: "Visa Guidance",
    description: "Navigate the complex visa application process with confidence. We provide up-to-date information and step-by-step guidance for your target country.",
    icon: "🛂",
    features: ["Document preparation", "Interview preparation", "Status tracking", "Compliance guidance"]
  },
  {
    title: "Pre-departure Support",
    description: "Prepare for your new life abroad with comprehensive support including accommodation, banking, insurance, and cultural orientation.",
    icon: "✈️",
    features: ["Accommodation help", "Banking setup", "Insurance guidance", "Cultural orientation"]
  },
  {
    title: "Scholarship Assistance",
    description: "Discover and apply for scholarships that can significantly reduce your study abroad costs. We help you find funding opportunities you might have missed.",
    icon: "💰",
    features: ["Scholarship search", "Application help", "Essay guidance", "Deadline alerts"]
  },
  {
    title: "Career Counseling",
    description: "Plan your career path with expert guidance. We help you understand job markets, internship opportunities, and long-term career prospects.",
    icon: "💼",
    features: ["Career planning", "Internship placement", "Job market analysis", "Alumni network"]
  }
]

export default function ServicesSection() {
  return (
    <ScrollReveal>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Comprehensive Study Abroad Services
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              From university selection to career planning, we provide end-to-end support for your study abroad journey. 
              Our expert guidance ensures you make informed decisions at every step.
            </motion.p>
          </div>

  

          {/* Traditional Grid Layout as Fallback */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Enhanced3DCard>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <motion.div
                      className="text-5xl mb-6"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {service.icon}
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <motion.li
                            key={featureIndex}
                            className="flex items-center text-gray-700"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + featureIndex * 0.05 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Enhanced3DCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 border border-blue-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Begin Your Journey?
              </h3>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Let's discuss your goals and create a personalized plan for your study abroad success. 
                Book a free consultation today!
              </p>
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Book Free Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  )
}