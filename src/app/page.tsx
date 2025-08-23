// src/app/page.tsx - PREMIUM LANDING PAGE
'use client'

import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { Brain, Clock, Users, CheckCircle, ArrowRight, Star, Award, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Vedyx Leap
            </span>
          </div>
          <Button 
            onClick={() => router.push('/form')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
          >
            Start Assessment
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium mb-8">
              <Award className="w-4 h-4 mr-2" />
              Research-backed assessment used by 10,000+ families
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              <span className="text-gray-900">Unlock Your Child's</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Learning Superpower
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover your child's unique learning style with our scientifically-designed assessment. 
              Get personalized strategies that transform struggling readers into confident learners.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <Button
                size="lg"
                onClick={() => router.push('/form')}
                className="px-10 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Get My Child's Profile
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-indigo-500" />
                <span className="font-medium">5 minutes • Ages 11-14 • 100% Free</span>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Privacy Protected
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                4.9/5 Parent Rating
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                10,000+ Children Assessed
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Preview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See What Parents Discover
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive learning profile that reveals your child's strengths and shows exactly how to support their growth.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sarah's Learning Profile</h3>
                    <p className="text-gray-600">Visual + Kinesthetic Learner</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Visual Learning</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="w-28 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Hands-On Learning</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="w-24 h-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Auditory Learning</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="w-16 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Key Insight:</strong> Sarah learns best with colorful charts and hands-on activities. 
                    Try mind mapping and visual organizers for reading comprehension.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <h4 className="font-semibold text-gray-900 mb-2">Personalized Strategies</h4>
                <p className="text-gray-600">Get specific, actionable recommendations tailored to your child's learning style.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <h4 className="font-semibold text-gray-900 mb-2">Strength-Based Approach</h4>
                <p className="text-gray-600">Focus on what your child does well, then build from their natural abilities.</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
                <h4 className="font-semibold text-gray-900 mb-2">Next Steps Plan</h4>
                <p className="text-gray-600">Clear guidance on activities and resources that match your child's profile.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Parents Everywhere
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finally understood why traditional methods weren't working for Emma. The visual strategies transformed her reading confidence in just 2 weeks.",
                author: "Michelle K., Mother of 12-year-old",
                rating: 5
              },
              {
                quote: "The assessment revealed my son's kinesthetic learning style. Now homework is actually enjoyable with the hands-on approaches they suggested.",
                author: "David R., Father of 11-year-old", 
                rating: 5
              },
              {
                quote: "As a teacher and parent, I was impressed by the depth and accuracy of the assessment. It gave me tools I use both at home and in my classroom.",
                author: "Sarah M., Teacher & Mother",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <p className="text-sm text-gray-600 font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Your Child's Learning Journey Starts Here
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of parents who've unlocked their child's potential. 
              Get your personalized learning profile in just 5 minutes.
            </p>
            <Button
              size="lg"
              onClick={() => router.push('/form')}
              className="px-12 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Start Your Child's Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-indigo-200 text-sm mt-4">
              No signup required • Results in 5 minutes • 100% Free
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}