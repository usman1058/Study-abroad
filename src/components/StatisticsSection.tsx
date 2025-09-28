'use client'

import { motion } from 'framer-motion'
import { ScrollReveal, Enhanced3DCard } from '@/components/animations/ReactBitsIntegration'

const stats = [
  { number: "500+", label: "Students Mentored", icon: "🎓" },
  { number: "15+", label: "Countries", icon: "🌍" },
  { number: "95%", label: "Success Rate", icon: "📊" },
  { number: "10+", label: "Years Experience", icon: "⭐" }
]

const destinations = [
  { country: "Italy", universities: 45, students: 156, flag: "🇮🇹" },
  { country: "UK", universities: 160, students: 500, flag: "🇬🇧" },
  { country: "France", universities: 32, students: 98, flag: "🇫🇷" },
  { country: "Spain", universities: 28, students: 87, flag: "🇪🇸" }
]

export default function StatisticsSection() {
  return (
    <ScrollReveal>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Trusted by Students Worldwide
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join thousands of successful students who have achieved their study abroad dreams with our guidance
            </motion.p>
          </div>

          {/* Main Statistics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Enhanced3DCard>
                  <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                    <motion.div
                      className="text-5xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-lg text-gray-700 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </Enhanced3DCard>
              </motion.div>
            ))}
          </div>

          {/* Destination Statistics */}
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <motion.h3 
              className="text-3xl font-bold text-gray-900 mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Popular Study Destinations
            </motion.h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((dest, index) => (
                <motion.div
                  key={dest.country}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">{dest.flag}</div>
                      <div className="text-sm text-gray-500">Top {index + 1}</div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{dest.country}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Universities</span>
                        <span className="font-semibold text-blue-600">{dest.universities}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Students Placed</span>
                        <span className="font-semibold text-purple-600">{dest.students}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                        <motion.div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(dest.students / 156) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 text-center p-6 bg-blue-50 rounded-xl border border-blue-200"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="text-2xl">🚀</div>
                <div>
                  <h4 className="font-semibold text-blue-900">Ready to Join These Success Stories?</h4>
                  <p className="text-blue-700 text-sm">Your journey starts with a single conversation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}