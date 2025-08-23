'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle, Brain, Target, AlertCircle, Clipboard, FileText, TrendingUp, Shield, Award } from 'lucide-react'

// Assessment data with enhanced questions (unchanged)
const questions = [
  {
    id: 1,
    section: "Learning Style",
    question: "When your child needs to learn something new (like tying shoes or a math concept), they learn best when you...",
    options: [
      { id: 'A', text: 'Show them step-by-step while they watch', score: { visual: 1 } },
      { id: 'B', text: 'Let them try it themselves right away', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Explain it out loud with lots of details', score: { auditory: 1 } },
      { id: 'D', text: 'Give them written instructions to follow', score: { reading: 1 } }
    ]
  },
  {
    id: 2,
    section: "Learning Style", 
    question: "Your child is trying to build something (LEGO, puzzle, craft). They typically...",
    options: [
      { id: 'A', text: 'Study the picture/example carefully first', score: { visual: 1 } },
      { id: 'B', text: 'Jump in and figure it out by trying different pieces', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Ask you to talk them through each step', score: { auditory: 1 } },
      { id: 'D', text: 'Read all the instructions before starting', score: { reading: 1 } }
    ]
  },
  {
    id: 3,
    section: "Learning Style",
    question: "When your child tells you about their day, they...",
    options: [
      { id: 'A', text: 'Use lots of gestures and act things out', score: { visual: 1 } },
      { id: 'B', text: 'Move around while talking', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Give you every single detail in order', score: { auditory: 1 } },
      { id: 'D', text: 'Prefer to write notes or draw pictures about it', score: { visual: 0.5, reading: 0.5 } }
    ]
  },
  {
    id: 4,
    section: "Learning Style",
    question: "If your child had to remember a phone number, they would most likely...",
    options: [
      { id: 'A', text: 'Picture the numbers in their head', score: { visual: 1 } },
      { id: 'B', text: 'Tap out the rhythm with their fingers', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Repeat it out loud several times', score: { auditory: 1 } },
      { id: 'D', text: 'Write it down immediately', score: { reading: 1 } }
    ]
  },
  {
    id: 5,
    section: "Focus Patterns",
    question: "During homework time, your child...",
    options: [
      { id: 'A', text: 'Stays focused but takes frequent movement breaks', score: { kinesthetic: 1, adhd: 0.5 } },
      { id: 'B', text: 'Gets distracted easily but refocuses quickly', score: { adhd: 1 } },
      { id: 'C', text: 'Hyperfocuses and loses track of time', score: { autism: 1 } },
      { id: 'D', text: 'Works steadily at their own consistent pace', score: { neurotypical: 1 } }
    ]
  },
  {
    id: 6,
    section: "Focus Patterns",
    question: "In a busy, noisy environment (like a restaurant), your child...",
    options: [
      { id: 'A', text: 'Becomes overstimulated and wants to leave', score: { sensory: 1, autism: 0.5 } },
      { id: 'B', text: 'Gets very energetic and loud themselves', score: { adhd: 1 } },
      { id: 'C', text: 'Shuts down or becomes withdrawn', score: { autism: 1, sensory: 0.5 } },
      { id: 'D', text: 'Adapts fine but might be tired later', score: { neurotypical: 1 } }
    ]
  },
  {
    id: 7,
    section: "Focus Patterns",
    question: "When your child encounters a problem or frustration, they typically...",
    options: [
      { id: 'A', text: 'Get very upset but calm down quickly with support', score: { adhd: 0.5, emotional: 1 } },
      { id: 'B', text: 'Bounce between different solutions rapidly', score: { adhd: 1 } },
      { id: 'C', text: 'Need time alone to process before trying again', score: { autism: 1 } },
      { id: 'D', text: 'Ask for help and work through it step-by-step', score: { neurotypical: 1 } }
    ]
  },
  {
    id: 8,
    section: "Focus Patterns",
    question: "Your child's attention span is...",
    options: [
      { id: 'A', text: 'Short for boring tasks, laser-focused on interests', score: { adhd: 1 } },
      { id: 'B', text: 'Inconsistent - varies greatly day to day', score: { adhd: 1 } },
      { id: 'C', text: 'Very deep when engaged, hard to interrupt', score: { autism: 1 } },
      { id: 'D', text: 'Pretty consistent across different activities', score: { neurotypical: 1 } }
    ]
  },
  {
    id: 9,
    section: "Strengths",
    question: "Your child's biggest strength is their ability to...",
    options: [
      { id: 'A', text: 'Think creatively and see unique solutions', score: { creative: 1 } },
      { id: 'B', text: 'Notice details others miss', score: { detail: 1, autism: 0.5 } },
      { id: 'C', text: 'Connect with others and show empathy', score: { social: 1 } },
      { id: 'D', text: 'Learn quickly once they understand the pattern', score: { pattern: 1 } }
    ]
  },
  {
    id: 10,
    section: "Strengths",
    question: "When playing or working, your child is happiest when they can...",
    options: [
      { id: 'A', text: 'Follow their own ideas and interests', score: { creative: 1, adhd: 0.5 } },
      { id: 'B', text: 'Organize and categorize things their way', score: { detail: 1, autism: 0.5 } },
      { id: 'C', text: 'Collaborate and share with others', score: { social: 1 } },
      { id: 'D', text: 'Master something completely before moving on', score: { mastery: 1 } }
    ]
  },
  {
    id: 11,
    section: "Strengths",
    question: "Other people often comment that your child...",
    options: [
      { id: 'A', text: 'Has an amazing imagination', score: { creative: 1 } },
      { id: 'B', text: 'Remembers incredible details', score: { detail: 1, autism: 0.5 } },
      { id: 'C', text: 'Is very caring and thoughtful', score: { social: 1 } },
      { id: 'D', text: 'Picks up new things remarkably fast', score: { pattern: 1 } }
    ]
  }
]

// Enhanced data collection types
type AssessmentData = {
    childName: string
    childAge: string
    parentEmail: string
    answers: { questionId: number; answer: string; timestamp: Date }[]
    scores: Record<string, number>
    primaryLearningStyle: string
    neurodivergentTraits: string[]
    strengths: string[]
    timestamp: Date
    
    // CRITICAL ADDITIONS:
    referralSource: string
    urgencyLevel: number
    
    // CONVERSION TRACKING:
    hasTriedApp: boolean
    signedUpForTrial: boolean
    conversionEvents: { event: string; timestamp: Date }[]
    
    // EMAIL SEGMENTATION:
    emailPreferences: {
      weeklyTips: boolean
      productUpdates: boolean
      urgentConcerns: boolean
    }
    
    // ANALYTICS:
    sessionId: string
    completionTimeSeconds: number
    deviceInfo: {
      userAgent: string
      screenSize: string
      isMobile: boolean
    }
  }

type FlowStep = 'landing' | 'info' | 'questions' | 'results'

// Utility functions
const getUrlParameter = (name: string): string | null => {
  if (typeof window === 'undefined') return null
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

const calculateUrgencyLevel = (scores: Record<string, number>, neurodivergentTraits: string[]): number => {
  let urgency = 1
  
  // High neurodivergent indicators = higher urgency
  if ((scores.adhd || 0) >= 2.0) urgency += 3
  if ((scores.autism || 0) >= 2.0) urgency += 3  
  if ((scores.sensory || 0) >= 1.0) urgency += 2
  if ((scores.emotional || 0) >= 2.0) urgency += 1
  
  // Multiple traits = very concerned parent
  if (neurodivergentTraits.length >= 2) urgency += 2
  if (neurodivergentTraits.length >= 3) urgency += 1
  
  return Math.min(urgency, 10) // Cap at 10
}

const generateSessionId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

const getDeviceInfo = () => {
  if (typeof window === 'undefined') return { userAgent: '', screenSize: '', isMobile: false }
  
  return {
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    isMobile: window.innerWidth <= 768
  }
}

// Email validation
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  // Common email typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (domain && domain.includes('gmial') && !domain.includes('gmail')) {
    return { isValid: false, error: 'Did you mean gmail.com?' }
  }
  
  if (domain && domain.includes('yahooo') && !domain.includes('yahoo')) {
    return { isValid: false, error: 'Did you mean yahoo.com?' }
  }
  
  return { isValid: true }
}

export default function AssessmentPage() {
  const [step, setStep] = useState<FlowStep>('info')
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [emailValidation, setEmailValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true })
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: number; answer: string; timestamp: Date }[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [results, setResults] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Analytics tracking
  const [sessionId] = useState(generateSessionId())
  const [startTime] = useState(new Date())
  const [conversionEvents, setConversionEvents] = useState<{ event: string; timestamp: Date }[]>([])

  // Track conversion events
  const trackEvent = (event: string) => {
    const newEvent = { event, timestamp: new Date() }
    setConversionEvents(prev => [...prev, newEvent])
  }

  // Email validation on change
  useEffect(() => {
    if (parentEmail) {
      const validation = validateEmail(parentEmail)
      setEmailValidation(validation)
    }
  }, [parentEmail])

  // Track page entry
  useEffect(() => {
    trackEvent('assessment_started')
  }, [])

  // Personalize questions by replacing generic terms with child's name
  const personalizeQuestion = (question: string, childName: string) => {
    return question
      .replace(/your child/gi, childName)
  }

  // Enhanced results calculation
  const calculateResults = (answers: { questionId: number; answer: string; timestamp: Date }[]) => {
    const scores: Record<string, number> = {}
    
    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      const option = question?.options.find(opt => opt.id === answer.answer)
      
      if (option?.score) {
        Object.entries(option.score).forEach(([key, value]) => {
          scores[key] = (scores[key] || 0) + value
        })
      }
    })

    // Better primary learning style calculation
    const learningStyles = { 
      visual: scores.visual || 0, 
      kinesthetic: scores.kinesthetic || 0, 
      auditory: scores.auditory || 0, 
      reading: scores.reading || 0 
    }
    
    const learningStyleEntries = Object.entries(learningStyles)
    const maxScore = Math.max(...learningStyleEntries.map(([_, score]) => score))
    
    const primaryLearningStyle = learningStyleEntries
      .filter(([_, score]) => score === maxScore)
      .sort((a, b) => {
        const priority = { kinesthetic: 4, visual: 3, auditory: 2, reading: 1 }
        return priority[b[0] as keyof typeof priority] - priority[a[0] as keyof typeof priority]
      })[0][0]

    // Neurodivergent identification
    const neurodivergentTraits = []
    if ((scores.adhd || 0) >= 1.5) neurodivergentTraits.push('ADHD traits')
    if ((scores.autism || 0) >= 1.5) neurodivergentTraits.push('Autism traits')  
    if ((scores.sensory || 0) >= 1) neurodivergentTraits.push('Sensory processing differences')

    // Identify strengths
    const strengths = []
    if ((scores.creative || 0) >= 2) strengths.push('Creative Thinking')
    if ((scores.detail || 0) >= 2) strengths.push('Detail-Oriented')
    if ((scores.social || 0) >= 2) strengths.push('Social Connection')
    if ((scores.pattern || 0) >= 2) strengths.push('Pattern Recognition')
    if ((scores.mastery || 0) >= 1) strengths.push('Deep Focus & Mastery')

    return { scores, primaryLearningStyle, neurodivergentTraits, strengths }
  }

  // Enhanced report generation
  const generatePersonalizedReport = (data: any) => {
    const { primaryLearningStyle, neurodivergentTraits, strengths } = data
    
    let reportKey = primaryLearningStyle
    if (neurodivergentTraits.includes('ADHD traits')) reportKey += '_adhd'
    if (neurodivergentTraits.includes('Autism traits')) reportKey += '_autism'
    
    const reports: Record<string, { title: string; description: string; strategies: string[] }> = {
      'kinesthetic_adhd': {
        title: `${childName} is a Movement-Based Learner with ADHD Traits`,
        description: `${childName} needs movement to focus and shows signs that suggest they may benefit from ADHD-friendly learning strategies.`,
        strategies: ['Movement breaks every 15 minutes', 'Fidget tools during focus time', 'Standing desk options', 'Timer-based work sessions', 'High-energy learning activities']
      },
      'visual_autism': {
        title: `${childName} is a Visual Learner with Systematic Thinking`,
        description: `${childName} processes information visually and shows traits suggesting they may benefit from structured, predictable learning approaches.`,
        strategies: ['Visual schedules and calendars', 'Step-by-step visual instructions', 'Consistent routines', 'Advanced notice of changes', 'Color-coded organization systems']
      },
      'auditory_adhd': {
        title: `${childName} is an Auditory Learner with Dynamic Processing`,
        description: `${childName} learns through listening and talking, with ADHD traits that suggest they benefit from varied, engaging auditory experiences.`,
        strategies: ['Audio books and podcasts', 'Discussion-based learning', 'Background music while working', 'Verbal processing time', 'Interactive conversations']
      },
      visual: {
        title: `${childName} is a Visual Learner`,
        description: `${childName} thrives when they can see concepts and information presented visually.`,
        strategies: ['Use mind maps for studying', 'Create visual schedules', 'Try project-based learning', 'Use colorful materials and charts']
      },
      kinesthetic: {
        title: `${childName} is a Kinesthetic Learner`,
        description: `${childName} needs movement to focus and learn effectively.`,
        strategies: ['Provide fidget tools', 'Consider standing desk options', 'Take movement breaks every 15-20 minutes', 'Use hands-on learning activities']
      },
      auditory: {
        title: `${childName} is an Auditory Learner`,
        description: `${childName} learns best through listening and verbal processing.`,
        strategies: ['Read instructions aloud', 'Use audio books and podcasts', 'Encourage verbal explanations', 'Practice through discussion']
      },
      reading: {
        title: `${childName} is a Reading/Writing Learner`,
        description: `${childName} excels when they can work systematically with written information.`,
        strategies: ['Provide step-by-step written instructions', 'Use lists and organizers', 'Encourage note-taking', 'Allow extra time for reading']
      }
    }

    return reports[reportKey] || reports[primaryLearningStyle] || reports.visual
  }

  const handleSubmitResults = async () => {
    setIsSubmitting(true)
    trackEvent('assessment_completed')
    
    const calculatedResults = calculateResults(answers)
    const personalizedReport = generatePersonalizedReport(calculatedResults)
    const completionTime = Math.round((new Date().getTime() - startTime.getTime()) / 1000)
    
    const urgencyLevel = calculateUrgencyLevel(calculatedResults.scores, calculatedResults.neurodivergentTraits)
    
    const assessmentData: AssessmentData = {
      childName,
      childAge,
      parentEmail,
      answers,
      ...calculatedResults,
      timestamp: new Date(),
      
      // CRITICAL ADDITIONS:
      referralSource: getUrlParameter('utm_source') || 'direct',
      urgencyLevel,
      
      // CONVERSION TRACKING:
      hasTriedApp: false,
      signedUpForTrial: false,
      conversionEvents,
      
      // EMAIL SEGMENTATION:
      emailPreferences: {
        weeklyTips: true,
        productUpdates: true,
        urgentConcerns: calculatedResults.neurodivergentTraits.length > 0
      },
      
      // ANALYTICS:
      sessionId,
      completionTimeSeconds: completionTime,
      deviceInfo: getDeviceInfo()
    }
  
    try {
      await addDoc(collection(db, 'assessments'), assessmentData)
      setResults({ ...calculatedResults, report: personalizedReport, urgencyLevel })
      setStep('results')
      trackEvent('results_viewed')
    } catch (error) {
      console.error('Error saving assessment:', error)
      trackEvent('submission_error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnswerClick = (optionId: string) => {
    setSelectedAnswer(optionId)
    const question = questions[currentQuestion]
    
    setTimeout(() => {
      const newAnswers = [...answers, { 
        questionId: question.id, 
        answer: optionId, 
        timestamp: new Date() 
      }]
      setAnswers(newAnswers)
      setSelectedAnswer(null)
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        trackEvent(`question_${currentQuestion + 1}_answered`)
      } else {
        handleSubmitResults()
      }
    }, 600)
  }

  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / questions.length) * 100
  
  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full"
        >
          <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0 bg-white">
            <CardContent>
              <div className="text-center mb-8">
                <div className="bg-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
                  Assessment Information
                </h1>
                <p className="text-base text-slate-600">
                  Please provide the following details to personalize the evaluation
                </p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault()
                if (childName.trim() && childAge && emailValidation.isValid) {
                  setStep('questions')
                  trackEvent('info_completed')
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Child's First Name
                  </label>
                  <Input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your child's first name"
                    className="w-full min-h-[52px] text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Child's Age
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full min-h-[52px] text-base border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    <option value="">Please select age</option>
                    <option value="6">6 years old</option>
                    <option value="7">7 years old</option>
                    <option value="8">8 years old</option>
                    <option value="9">9 years old</option>
                    <option value="10">10 years old</option>
                    <option value="11">11 years old</option>
                    <option value="12">12 years old</option>
                    <option value="13">13 years old</option>
                    <option value="14">14 years old</option>
                    <option value="15">15+ years old</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Email Address (for detailed report)
                  </label>
                  <Input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className={`w-full min-h-[52px] text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                      !emailValidation.isValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                  {!emailValidation.isValid && emailValidation.error && (
                    <div className="flex items-center mt-3 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {emailValidation.error}
                    </div>
                  )}
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-800 mt-3">
                    <div className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold mb-1">You will receive:</p>
                        <ul className="text-xs space-y-1">
                          <li>• Comprehensive learning style analysis</li>
                          <li>• Evidence-based educational strategies</li>
                          <li>• Professional summary for educators</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('landing')}
                    className="flex-1 min-h-[52px] text-base border-slate-300 text-slate-600 hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white min-h-[52px] text-base font-semibold shadow-md"
                    disabled={!childName.trim() || !childAge || !emailValidation.isValid}
                  >
                    Continue to Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (step === 'questions') {
    const question = questions[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="max-w-3xl w-full"
        >
          <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0 bg-white">
            <CardContent>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Clipboard className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800 font-medium mb-1">
                    Learning Assessment for {childName}
                  </p>
                  <p className="text-xs text-blue-600">
                    Section: {question.section}
                  </p>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-8 leading-tight text-slate-900">
                  {personalizeQuestion(question.question, childName)}
                </h3>
              </div>

              <div className="space-y-4">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option.id
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleAnswerClick(option.id)}
                      className={`w-full p-5 sm:p-6 text-left border-2 rounded-xl transition-all min-h-[70px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      whileScale={isSelected ? 0.98 : 1}
                      animate={{
                        backgroundColor: isSelected ? '#f0fdf4' : undefined,
                        borderColor: isSelected ? '#22c55e' : undefined,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start">
                        <span className={`font-semibold mr-4 text-lg sm:text-xl min-w-[2rem] ${
                          isSelected ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {option.id}
                        </span>
                        <div className="flex-1">
                          <span className="text-base sm:text-lg leading-relaxed text-slate-800">
                            {option.text}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex items-center mt-3"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              <span className="text-green-600 text-sm font-semibold">Response Recorded</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {currentQuestion > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(currentQuestion - 1)
                    setAnswers(prev => prev.slice(0, -1))
                    trackEvent(`question_${currentQuestion}_back`)
                  }}
                  className="mt-8 min-h-[52px] text-base border-slate-300 text-slate-600 hover:bg-slate-50"
                  disabled={selectedAnswer !== null}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous Question
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (step === 'results' && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="p-6 sm:p-8 lg:p-10 shadow-lg border-0 bg-white">
            <CardContent>
              <div className="text-center mb-8 sm:mb-10">
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
                  <FileText className="w-8 h-8 text-green-700" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
                  Learning Assessment Results
                </h1>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-2">
                    {results.report.title}
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {results.report.description}
                  </p>
                </div>
              </div>
                
              <div className="grid gap-6 md:grid-cols-2 mb-8 sm:mb-10">
                <Card className="p-6 bg-blue-50 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-semibold text-lg text-slate-900">Recommended Strategies</h3>
                  </div>
                  <ul className="space-y-3">
                    {results.report.strategies.map((strategy: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-slate-700">{strategy}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6 bg-green-50 border border-green-200">
                  <div className="flex items-center mb-4">
                    <Award className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-lg text-slate-900">Identified Strengths</h3>
                  </div>
                  <ul className="space-y-3">
                    {results.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {results.neurodivergentTraits.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <Brain className="w-5 h-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-lg text-slate-900">Additional Learning Considerations</h3>
                  </div>
                  <p className="text-slate-700 mb-4">
                    The assessment indicates {childName} may benefit from approaches commonly effective for learners with:
                  </p>
                  <ul className="space-y-3">
                    {results.neurodivergentTraits.map((trait: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 text-purple-600 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-slate-700">{trait}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-white border border-purple-200 rounded p-4 mt-4">
                    <p className="text-xs text-slate-600 font-medium">
                      Professional Disclaimer: This assessment provides educational insights and is not a clinical diagnosis. 
                      For comprehensive evaluation of learning differences, consult qualified educational or medical professionals.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-xl text-slate-900">Comprehensive Report Delivery</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  A detailed educational assessment report with personalized strategies and recommendations 
                  has been sent to <span className="font-semibold">{parentEmail}</span>
                </p>
                <div className="bg-white border border-blue-200 rounded p-4">
                  <p className="text-sm text-blue-800 font-medium">Report includes:</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Detailed analysis of {childName}'s learning preferences</li>
                    <li>• Evidence-based educational interventions</li>
                    <li>• Professional summary suitable for educator consultation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-lg text-slate-900">Recommended Next Steps</h3>
                  </div>
                  <ul className="text-sm space-y-2 text-slate-700">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Implement one recommended strategy this week
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Share findings with your child's educators if appropriate
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      Monitor and document learning progress
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-slate-600 mr-2" />
                    <h3 className="font-semibold text-lg text-slate-900">Continue Learning Journey</h3>
                  </div>
                  <p className="text-slate-700 mb-4">
                    Now that you understand {childName}'s learning profile, you may find value in exploring 
                    educational resources designed specifically for {results.primaryLearningStyle} learners.
                  </p>
                  <Button 
                    onClick={() => {
                      trackEvent('app_trial_clicked')
                      window.location.href = `/?source=assessment&type=${results.primaryLearningStyle}`
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-lg font-semibold shadow-md"
                  >
                    Explore Personalized Learning Resources
                  </Button>
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Research-based learning tools • No commitment required
                  </p>
                </div>

                <div className="text-center bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 italic">
                    "This assessment helped us understand our child's learning needs much better."
                  </p>
                  <p className="text-xs text-slate-500 mt-1">— Parent testimonial</p>
                </div>
              </div>

              <div className="text-center text-xs sm:text-sm text-slate-500 space-y-2 mt-8">
                <p>A detailed report has been sent to {parentEmail}</p>
                <p>Feel free to share insights with teachers for classroom support</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-slate-500 mt-8 border-t pt-4 text-left">
            <p className="font-bold text-red-700 mb-2">Important:</p>
            <ul className="list-disc list-inside space-y-2 text-red-700">
                <li>
                This assessment provides insights about learning preferences and is not a medical or educational diagnosis.
                </li>
                <li>
                For concerns about learning differences or development, please consult your child's pediatrician or a licensed educational professional.
                </li>
                <li>
                Results are based on current research in learning styles and neurodevelopment. Individual children may vary.
                </li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-6">
          <Clipboard className="w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {isSubmitting ? 'Processing Assessment' : 'Loading Assessment'}
        </h3>
        <p className="text-slate-600 text-sm px-4">
          {isSubmitting ? (
            <>
              Analyzing {childName}'s responses and generating personalized recommendations...
            </>
          ) : (
            'Preparing your learning assessment...'
          )}
        </p>
      </div>
    </div>
  )
}