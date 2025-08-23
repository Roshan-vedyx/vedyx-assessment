// src/components/assessment/FormStep.tsx - PREMIUM VERSION
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { validateEmail } from '@/lib/utils'
import { FormData } from '@/types/assessment'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, ArrowRight, Shield, Clock, Star } from 'lucide-react'

interface FormStepProps {
  onSubmit: (formData: FormData) => void
}

export function FormStep({ onSubmit }: FormStepProps) {
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true })

  useEffect(() => {
    if (parentEmail) {
      const validation = validateEmail(parentEmail)
      setEmailValidation(validation)
    }
  }, [parentEmail])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!childName.trim() || !childAge.trim() || !parentEmail.trim()) {
      return
    }

    if (!emailValidation.isValid) {
      return
    }

    onSubmit({
      childName: childName.trim(),
      childAge: childAge.trim(),
      parentEmail: parentEmail.trim()
    })
  }

  const isValid = childName.trim() && childAge.trim() && parentEmail.trim() && emailValidation.isValid

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-4"
        >
          <Clock className="w-4 h-4 mr-2" />
          Step 1 of 2 • 2 minutes remaining
        </motion.div>
      </div>

      <div className="flex items-center justify-center px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  Let's Personalize Your Experience
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  We'll create a tailored assessment that speaks directly to your child's unique learning journey.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    What's your child's first name?
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Enter first name"
                      className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 rounded-xl"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    How old are they?
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={childAge}
                      onChange={(e) => setChildAge(e.target.value)}
                      className="pl-12 h-14 w-full text-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl bg-white appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select age</option>
                      <option value="11">11 years old</option>
                      <option value="12">12 years old</option>
                      <option value="13">13 years old</option>
                      <option value="14">14 years old</option>
                    </select>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Your email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className={`pl-12 h-14 text-lg border-2 rounded-xl ${
                        !emailValidation.isValid 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                          : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                      }`}
                      required
                    />
                  </div>
                  {!emailValidation.isValid && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-600 text-sm mt-2 flex items-center"
                    >
                      {emailValidation.error}
                    </motion.p>
                  )}
                  <p className="text-gray-500 text-sm mt-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    We'll email you a detailed personalized report
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full h-14 text-lg font-semibold rounded-xl transition-all duration-200 ${
                      isValid
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    disabled={!isValid}
                  >
                    Start My Child's Assessment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </form>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center mt-6 text-sm text-gray-500 space-x-6"
              >
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Privacy Protected
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  4.9/5 Rating
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  5 Min Assessment
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}