// src/components/assessment/ResultsReport.tsx - PREMIUM VERSION
'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AssessmentResults, FormData } from '@/types/assessment'
import { motion } from 'framer-motion'
import { Brain, Target, Mail, Download, Star, Sparkles, ArrowRight, CheckCircle, Award } from 'lucide-react'
import { useState } from 'react'

interface ResultsReportProps {
  results: AssessmentResults
  formData: FormData
  onEmailResults: () => Promise<void>
}

export function ResultsReport({ results, formData, onEmailResults }: ResultsReportProps) {
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleEmailResults = async () => {
    setIsEmailSending(true)
    try {
      await onEmailResults()
      setEmailSent(true)
    } catch (error) {
      console.error('Error sending email:', error)
    } finally {
      setIsEmailSending(false)
    }
  }

  const getStyleInfo = (style: string) => {
    const styles = {
      visual: {
        icon: '👁️',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'from-purple-50 to-pink-50',
        textColor: 'text-purple-700'
      },
      auditory: {
        icon: '👂',
        color: 'from-blue-500 to-indigo-500',
        bgColor: 'from-blue-50 to-indigo-50', 
        textColor: 'text-blue-700'
      },
      kinesthetic: {
        icon: '✋',
        color: 'from-green-500 to-teal-500',
        bgColor: 'from-green-50 to-teal-50',
        textColor: 'text-green-700'
      },
      reading: {
        icon: '📚',
        color: 'from-orange-500 to-red-500',
        bgColor: 'from-orange-50 to-red-50',
        textColor: 'text-orange-700'
      }
    }
    return styles[style as keyof typeof styles] || styles.visual
  }

  const primaryStyle = getStyleInfo(results.primaryStyle)
  const maxScore = Math.max(...Object.values(results.scores))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            🎉 {formData.childName}'s Learning Profile is Ready!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've analyzed {formData.childName}'s responses and discovered their unique learning superpowers. 
            Here's how to unlock their full potential.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Primary Learning Style - Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className={`bg-gradient-to-br ${primaryStyle.bgColor} p-8 relative`}>
                <div className="absolute top-4 right-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${primaryStyle.color} rounded-2xl flex items-center justify-center text-2xl`}>
                    {primaryStyle.icon}
                  </div>
                </div>
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 bg-white/80 rounded-full text-sm font-semibold text-gray-700 mb-4">
                    <Award className="w-4 h-4 mr-2" />
                    Primary Learning Style
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {results.report.title}
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {results.report.description}
                  </p>
                </div>
              </div>
              
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  {formData.childName}'s Learning Superpowers
                </h3>
                <div className="space-y-3">
                  {results.report.strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className={`w-2 h-2 ${primaryStyle.color.replace('from-', 'bg-').replace(' to-pink-500', '').replace(' to-indigo-500', '').replace(' to-teal-500', '').replace(' to-red-500', '')} rounded-full mt-2 mr-3 flex-shrink-0`} />
                      <p className="text-gray-700">{strength}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Style Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="h-full shadow-xl border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Learning Style Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(results.scores)
                    .sort(([,a], [,b]) => b - a)
                    .map(([style, score], index) => {
                      const styleInfo = getStyleInfo(style)
                      const percentage = Math.round((score / maxScore) * 100)
                      
                      return (
                        <motion.div
                          key={style}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <span className="text-lg mr-2">{styleInfo.icon}</span>
                              <span className="font-medium capitalize">{style}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-600">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <motion.div 
                              className={`h-3 bg-gradient-to-r ${styleInfo.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Home Strategies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="h-full shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Personalized Home Strategies
                </h3>
                <div className="space-y-4">
                  {results.report.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Card className="h-full shadow-xl border-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6">
                  Next Steps with Vedyx Leap
                </h3>
                <div className="space-y-4 mb-6">
                  {results.report.nextSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0" />
                      <p className="text-indigo-100 leading-relaxed">{step}</p>
                    </motion.div>
                  ))}
                </div>
                <Button
                  className="w-full bg-white text-indigo-600 hover:bg-gray-50 font-semibold py-3 rounded-xl"
                  onClick={() => window.open('https://vedyx-leap.com', '_blank')}
                >
                  Try Vedyx Leap Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform {formData.childName}'s Learning Journey?
              </h2>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                You now have the roadmap to {formData.childName}'s success. Get your detailed report delivered 
                to your inbox and start implementing these strategies today.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  onClick={handleEmailResults}
                  disabled={isEmailSending || emailSent}
                  size="lg"
                  className={`flex-1 py-4 font-semibold rounded-xl transition-all duration-200 ${
                    emailSent 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  } shadow-lg hover:shadow-xl`}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {emailSent ? 'Report Sent!' : isEmailSending ? 'Sending...' : 'Email Full Report'}
                </Button>
              </div>
              
              <p className="text-gray-300 text-sm mt-4">
                Detailed PDF report • Personalized activities • Implementation guide
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}