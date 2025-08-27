'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Brain, FileText, TrendingUp, Shield, Award, Users, Clock, Star, ArrowRight, Clipboard, Target } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/vedyx-logo-with-text.png" alt="Vedyx Learning" className="h-20" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Vedyx Learning Assessment Center</h1>
                <p className="text-sm text-slate-600">Evidence-Based Educational Evaluation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                <span>COPPA Compliant</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                <span>Research-Based</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div>
              <div className="bg-blue-600 p-4 rounded-full w-fit mx-auto mb-8">
                <Clipboard className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Understand Your Child's
                <span className="block text-blue-600">Learning Style</span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                A comprehensive, research-based assessment that identifies your child's unique learning preferences and provides evidence-backed educational strategies.
              </p>

              <div className="bg-white p-6 rounded-lg shadow-md mb-12 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-green-100 p-3 rounded-full mb-2">
                      <Clock className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">5-7 Minutes</span>
                    <span className="text-xs text-slate-600">Quick Assessment</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                      <FileText className="w-6 h-6 text-blue-700" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">Detailed Report</span>
                    <span className="text-xs text-slate-600">Emailed Instantly</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-purple-100 p-3 rounded-full mb-2">
                      <Shield className="w-6 h-6 text-purple-700" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">Completely Free</span>
                    <span className="text-xs text-slate-600">No Hidden Costs</span>
                  </div>
                </div>
              </div>

              <Link href="/assessment" prefetch={true}>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl font-bold min-h-[60px] shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Start Free Assessment
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
              
              <p className="text-sm text-slate-500 mt-4">
                Trusted by over 10,000 families • No registration required • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comprehensive Learning Profile Analysis
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our assessment is grounded in established educational research and provides actionable insights for parents and educators.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-green-100 p-3 rounded-full w-fit mb-4">
                  <Brain className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Learning Style Identification</h3>
                <p className="text-slate-600 mb-4">
                  Determines whether your child learns best through visual, auditory, kinesthetic, or reading/writing methods.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Primary learning modality analysis</li>
                  <li>• Secondary preference identification</li>
                  <li>• Personalized learning recommendations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                  <Target className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Cognitive Pattern Recognition</h3>
                <p className="text-slate-600 mb-4">
                  Identifies attention patterns, focus preferences, and processing styles that may indicate neurodivergent traits.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Attention span analysis</li>
                  <li>• Focus pattern identification</li>
                  <li>• Sensory processing insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent>
                <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Strength-Based Assessment</h3>
                <p className="text-slate-600 mb-4">
                  Identifies your child's unique cognitive strengths and natural abilities to build upon.
                </p>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Creative thinking assessment</li>
                  <li>• Pattern recognition skills</li>
                  <li>• Social connection abilities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Trusted by Families Worldwide</h2>
            <div className="flex items-center justify-center space-x-8 text-slate-600">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span className="font-semibold">10,000+ Assessments</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                <span className="font-semibold">4.8/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span className="font-semibold">Privacy Protected</span>
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 bg-white border-0 shadow-md">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "This assessment helped us understand why traditional teaching methods weren't working for our son. The recommendations were spot-on."
                </p>
                <p className="text-sm text-slate-600">— Sarah M., Parent</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-md">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "As a teacher, I found this assessment incredibly valuable for understanding my students' learning needs. Very professional."
                </p>
                <p className="text-sm text-slate-600">— Jennifer L., Elementary Teacher</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-md">
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 mb-4 italic">
                  "The detailed report gave us concrete strategies to help our daughter succeed. We shared it with her school team too."
                </p>
                <p className="text-sm text-slate-600">— Michael R., Parent</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You'll Receive Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What You'll Receive</h2>
            <p className="text-lg text-slate-600">A comprehensive report delivered instantly to your email</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Detailed Learning Style Analysis</h3>
                  <p className="text-slate-600">Complete breakdown of your child's primary and secondary learning preferences with specific examples.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Evidence-Based Strategies</h3>
                  <p className="text-slate-600">Actionable recommendations grounded in current educational research and UDL principles.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Professional Summary</h3>
                  <p className="text-slate-600">Formatted report suitable for sharing with teachers, tutors, and educational specialists.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Next Steps Guide</h3>
                  <p className="text-slate-600">Clear action items and resources to implement the recommendations immediately.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-lg">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-slate-900">Sample Report Preview</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium text-slate-900">Primary Learning Style: Visual</p>
                    <p className="text-slate-600">Emma processes information most effectively through visual channels...</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium text-slate-900">Key Strengths: Pattern Recognition</p>
                    <p className="text-slate-600">Shows exceptional ability to identify and understand patterns...</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <p className="font-medium text-slate-900">Recommendations:</p>
                    <p className="text-slate-600">• Use mind maps for studying • Create visual schedules...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Understand Your Child's Learning Style?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of parents who have discovered their child's unique learning needs through our research-based assessment.
          </p>
          
          <Link href="/assessment" prefetch={true}>
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-xl font-bold min-h-[60px] shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Begin Assessment Now
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          
          <p className="text-sm text-blue-200 mt-4">
            5-7 minutes • Completely free • Instant results • No registration required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">Learning Assessment</span>
              </div>
              <p className="text-slate-400 text-sm">
                Evidence-based educational assessments to help every child reach their potential.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Assessment</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Learning Styles</li>
                <li>Cognitive Patterns</li>
                <li>Strength Analysis</li>
                <li>Professional Reports</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>How It Works</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact Us</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Trust & Safety</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>COPPA Compliant</li>
                <li>Data Protection</li>
                <li>Research-Based</li>
                <li>Educational Use</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                © 2024 Learning Assessment Center. All rights reserved.
              </p>
              <div className="text-xs text-slate-500 mt-4 md:mt-0">
                <p>This assessment provides educational insights and is not a diagnostic tool.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}