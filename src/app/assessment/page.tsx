'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ResultsSection } from '@/components/assessment/ResultsSection'
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle, Brain, Target, AlertCircle, Clipboard, FileText, TrendingUp, Shield, Award } from 'lucide-react'

// New 12-question assessment with multi-dimensional scoring
const questions = [
  // SECTION 1: INFORMATION PROCESSING (Questions 1-4)
  {
    id: 1,
    section: "Information Processing",
    question: "When your child needs to understand a new concept, they typically...",
    options: [
      { id: 'A', text: 'Ask to see examples or pictures first', score: { visual: 3, spatial: 1 } },
      { id: 'B', text: 'Want to try it hands-on immediately', score: { kinesthetic: 3, motor: 1 } },
      { id: 'C', text: 'Need you to explain it step-by-step verbally', score: { auditory: 3, verbal: 1 } },
      { id: 'D', text: 'Prefer to read about it or take notes', score: { text: 3, sequential: 1 } }
    ]
  },
  {
    id: 2,
    section: "Information Processing",
    question: "When solving problems, your child usually...",
    options: [
      { id: 'A', text: 'Draws pictures or diagrams to work it out', score: { visual: 3, creative: 1 } },
      { id: 'B', text: 'Uses objects or acts it out physically', score: { kinesthetic: 3, handsOn: 1 } },
      { id: 'C', text: 'Talks through the problem out loud', score: { auditory: 3, social: 1 } },
      { id: 'D', text: 'Makes lists or writes down their thinking', score: { text: 3, analytical: 1 } }
    ]
  },
  {
    id: 3,
    section: "Information Processing",
    question: "Your child remembers information best when it's presented...",
    options: [
      { id: 'A', text: 'With charts, graphs, or visual organizers', score: { visual: 3, memory: 1 } },
      { id: 'B', text: 'Through hands-on activities or experiments', score: { kinesthetic: 3, experiential: 1 } },
      { id: 'C', text: 'Through stories, discussions, or lectures', score: { auditory: 3, storytelling: 1 } },
      { id: 'D', text: 'In written form they can review and highlight', score: { text: 3, comprehension: 1 } }
    ]
  },
  {
    id: 4,
    section: "Information Processing",
    question: "When following directions, your child succeeds most when you...",
    options: [
      { id: 'A', text: 'Show them or give them a visual checklist', score: { visual: 3, sequential: 1 } },
      { id: 'B', text: 'Let them practice the steps physically', score: { kinesthetic: 3, practice: 1 } },
      { id: 'C', text: 'Explain each step clearly and check understanding', score: { auditory: 3, stepByStep: 1 } },
      { id: 'D', text: 'Write down the instructions for them to follow', score: { text: 3, independent: 1 } }
    ]
  },

  // SECTION 2: EXECUTIVE FUNCTION SKILLS (Questions 5-8)
  {
    id: 5,
    section: "Executive Function",
    question: "When starting homework or a big project, your child...",
    options: [
      { id: 'A', text: 'Needs help breaking it into smaller visual steps', score: { visualOrg: 3, planning: 1 } },
      { id: 'B', text: 'Does best with movement breaks built into the work', score: { movementReg: 3, attention: 1 } },
      { id: 'C', text: 'Benefits from talking through the plan first', score: { verbalPlan: 3, social: 1 } },
      { id: 'D', text: 'Likes to organize all materials and make a written plan', score: { writtenOrg: 3, goalDirect: 1 } }
    ]
  },
  {
    id: 6,
    section: "Executive Function",
    question: "Your child's attention and focus work best when...",
    options: [
      { id: 'A', text: 'They have a clean, organized visual workspace', score: { visualAttention: 3, environment: 1 } },
      { id: 'B', text: 'They can fidget or move while learning', score: { movementFocus: 3, regulation: 1 } },
      { id: 'C', text: 'Background noise is minimal and they can hear clearly', score: { auditoryProcess: 3, concentration: 1 } },
      { id: 'D', text: 'They have written goals and can check off progress', score: { goalPersist: 3, selfMonitor: 1 } }
    ]
  },
  {
    id: 7,
    section: "Executive Function",
    question: "When your child makes a mistake, they typically...",
    options: [
      { id: 'A', text: 'Need to see what went wrong visually', score: { visualError: 3, recognition: 1 } },
      { id: 'B', text: 'Want to try again immediately with their hands', score: { trialError: 3, resilience: 1 } },
      { id: 'C', text: 'Benefit from talking through what happened', score: { metacognitive: 3, reflection: 1 } },
      { id: 'D', text: 'Like to write down what to do differently next time', score: { selfMonitorWritten: 3, improvement: 1 } }
    ]
  },
  {
    id: 8,
    section: "Executive Function",
    question: "Your child manages time and transitions best when...",
    options: [
      { id: 'A', text: 'They have visual schedules or timers they can see', score: { visualTime: 3, structure: 1 } },
      { id: 'B', text: 'They get physical warnings before transitions', score: { physicalTrans: 3, flexibility: 1 } },
      { id: 'C', text: 'You give verbal countdowns and explanations', score: { auditoryTime: 3, communication: 1 } },
      { id: 'D', text: 'They can check items off a written schedule', score: { writtenTime: 3, independence: 1 } }
    ]
  },

  // SECTION 3: LEARNING STRENGTHS & MOTIVATIONS (Questions 9-12)
  {
    id: 9,
    section: "Strengths & Motivations",
    question: "Your child shows their best thinking when they can...",
    options: [
      { id: 'A', text: 'Create visual projects or presentations', score: { creative: 3, visualMotiv: 1 } },
      { id: 'B', text: 'Build, make, or demonstrate something', score: { mastery: 3, handsOnMotiv: 1 } },
      { id: 'C', text: 'Discuss ideas and explain their thinking', score: { social: 3, verbalMotiv: 1 } },
      { id: 'D', text: 'Research, read, and write about topics', score: { research: 3, independentMotiv: 1 } }
    ]
  },
  {
    id: 10,
    section: "Strengths & Motivations",
    question: "Your child feels most confident learning when...",
    options: [
      { id: 'A', text: 'They can see progress visually (charts, portfolios)', score: { visualFeedback: 3, progress: 1 } },
      { id: 'B', text: 'They achieve through doing and practicing', score: { achievement: 3, practiceMotiv: 1 } },
      { id: 'C', text: 'They can share and get feedback through discussion', score: { socialCollab: 3, feedback: 1 } },
      { id: 'D', text: 'They can track their growth through written reflection', score: { selfReflect: 3, growth: 1 } }
    ]
  },
  {
    id: 11,
    section: "Strengths & Motivations",
    question: "Your child's natural curiosity shows up most when they...",
    options: [
      { id: 'A', text: 'Can explore topics through images, videos, or art', score: { artistic: 3, explore: 1 } },
      { id: 'B', text: 'Can investigate through experiments or field trips', score: { scientific: 3, investigate: 1 } },
      { id: 'C', text: 'Can ask questions and engage in conversations', score: { interpersonal: 3, question: 1 } },
      { id: 'D', text: 'Can dive deep into books or research projects', score: { analytical: 3, deepDive: 1 } }
    ]
  },
  {
    id: 12,
    section: "Strengths & Motivations",
    question: "When your child faces a challenge, they persevere best when you...",
    options: [
      { id: 'A', text: 'Help them visualize success and progress', score: { goalVisual: 3, success: 1 } },
      { id: 'B', text: 'Encourage them to keep trying and practicing', score: { persistPractice: 3, encourage: 1 } },
      { id: 'C', text: 'Talk through strategies and offer support', score: { socialSupport: 3, strategy: 1 } },
      { id: 'D', text: 'Help them set written goals and track progress', score: { goalWritten: 3, track: 1 } }
    ]
  }
]

// Multi-dimensional scoring and analysis functions
function calculateMultiDimensionalScores(answers: { questionId: number; answer: string }[]) {
  const scores = {
    // Processing Strengths (Q1-4)
    visual: 0, kinesthetic: 0, auditory: 0, text: 0,
    // Executive Function Needs (Q5-8)  
    visualOrg: 0, movementReg: 0, verbalPlan: 0, writtenOrg: 0,
    visualAttention: 0, movementFocus: 0, auditoryProcess: 0, goalPersist: 0,
    // Motivational Drivers (Q9-12)
    creative: 0, mastery: 0, social: 0, research: 0
  }

  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId)
    if (question) {
      const option = question.options.find(opt => opt.id === answer.answer)
      if (option) {
        Object.entries(option.score).forEach(([trait, points]) => {
          if (scores.hasOwnProperty(trait)) {
            scores[trait as keyof typeof scores] += points
          }
        })
      }
    }
  })

  return scores
}

function analyzeLearningProfile(scores: any) {
  // Processing Strengths Analysis
  const processingScores = {
    visual: scores.visual,
    kinesthetic: scores.kinesthetic, 
    auditory: scores.auditory,
    text: scores.text
  }
  const primaryProcessing = Object.entries(processingScores).reduce((a, b) => 
    processingScores[a[0] as keyof typeof processingScores] > processingScores[b[0] as keyof typeof processingScores] ? a : b
  )[0]

  // Executive Function Support Needs
  const execScores = {
    visual: scores.visualOrg + scores.visualAttention,
    movement: scores.movementReg + scores.movementFocus,
    verbal: scores.verbalPlan + scores.auditoryProcess,
    written: scores.writtenOrg + scores.goalPersist
  }
  const primaryExecSupport = Object.entries(execScores).reduce((a, b) => 
    execScores[a[0] as keyof typeof execScores] > execScores[b[0] as keyof typeof execScores] ? a : b
  )[0]

  // Motivational Drivers
  const motivScores = {
    creative: scores.creative,
    mastery: scores.mastery,
    social: scores.social, 
    research: scores.research
  }
  const primaryMotivation = Object.entries(motivScores).reduce((a, b) => 
    motivScores[a[0] as keyof typeof motivScores] > motivScores[b[0] as keyof typeof motivScores] ? a : b
  )[0]

  return {
    primaryProcessing,
    primaryExecSupport,
    primaryMotivation,
    processingScores,
    execScores,
    motivScores,
    totalScores: scores
  }
}

function generateComprehensiveReport(profile: any, childName: string) {
  const { primaryProcessing, primaryExecSupport, primaryMotivation } = profile
  
  const processingProfiles = {
    visual: {
      title: "Visual-Spatial Processor",
      description: `${childName} learns best through seeing and visualizing information`,
      strengths: [
        "Processes visual information quickly and effectively",
        "Remembers what they see better than what they hear",
        "Benefits from charts, diagrams, and visual organizers",
        "Strong spatial awareness and visual memory"
      ]
    },
    kinesthetic: {
      title: "Hands-On Kinesthetic Learner", 
      description: `${childName} learns through movement and tactile experiences`,
      strengths: [
        "Learns by doing and physical practice",
        "Strong motor coordination and body awareness", 
        "Benefits from movement breaks during learning",
        "Remembers through muscle memory and physical experience"
      ]
    },
    auditory: {
      title: "Auditory-Sequential Processor",
      description: `${childName} processes information best through listening and verbal instruction`,
      strengths: [
        "Excellent listening and verbal comprehension skills",
        "Learns through discussion and verbal explanation",
        "Strong sequential processing abilities",
        "Benefits from talking through problems"
      ]
    },
    text: {
      title: "Text-Based Independent Learner",
      description: `${childName} excels at learning through reading and written materials`,
      strengths: [
        "Strong independent reading and writing skills",
        "Learns effectively through written instruction",
        "Excellent at processing complex written information",
        "Self-directed learning through text-based resources"
      ]
    }
  }

  const execProfiles = {
    visual: {
      supports: [
        "Visual schedules and organizational systems",
        "Color-coded materials and visual cues",
        "Breaking tasks into visual steps",
        "Clean, organized learning spaces"
      ]
    },
    movement: {
      supports: [
        "Movement breaks built into learning",
        "Fidget tools and flexible seating",
        "Physical activity before focused work", 
        "Standing or walking while learning"
      ]
    },
    verbal: {
      supports: [
        "Talking through plans and strategies",
        "Verbal processing time before transitions",
        "Discussion-based problem solving",
        "Clear verbal instructions and feedback"
      ]
    },
    written: {
      supports: [
        "Written goal-setting and progress tracking",
        "Checklists and written organizers",
        "Journaling and reflection activities",
        "Step-by-step written instructions"
      ]
    }
  }

  const motivProfiles = {
    creative: {
      motivators: [
        "Art, design, and creative expression opportunities",
        "Open-ended projects with creative freedom",
        "Visual storytelling and multimedia projects",
        "Connecting learning to artistic interests"
      ]
    },
    mastery: {
      motivators: [
        "Hands-on building and making activities",
        "Clear skill progression and practice opportunities",
        "Real-world problem solving",
        "Demonstrating competence through doing"
      ]
    },
    social: {
      motivators: [
        "Collaborative learning and group discussions",
        "Teaching and explaining to others", 
        "Social feedback and peer interaction",
        "Community-connected learning projects"
      ]
    },
    research: {
      motivators: [
        "Deep-dive research projects",
        "Independent exploration of interests",
        "Analytical and critical thinking challenges",
        "Self-directed learning opportunities"
      ]
    }
  }

  // Ensure we return a complete profile with fallbacks
  const selectedProfile = processingProfiles[primaryProcessing as keyof typeof processingProfiles] || processingProfiles.visual
  const selectedExecSupports = execProfiles[primaryExecSupport as keyof typeof execProfiles] || execProfiles.visual
  const selectedMotivators = motivProfiles[primaryMotivation as keyof typeof motivProfiles] || motivProfiles.creative

  return {
    primaryLearningStyle: primaryProcessing,
    profile: selectedProfile,
    executiveSupports: selectedExecSupports,
    motivationalDrivers: selectedMotivators,
    recommendations: generatePersonalizedRecommendations(primaryProcessing, primaryExecSupport, primaryMotivation),
    neurodivergentConsiderations: generateNeurodivergentInsights(profile)
  }
}

function generatePersonalizedRecommendations(processing: string, execSupport: string, motivation: string) {
  const baseRecommendations = {
    immediate: [
      `Create a ${processing}-friendly learning environment`,
      `Implement ${execSupport} organizational supports`,
      `Incorporate ${motivation} motivational elements into daily learning`
    ],
    academic: [
      "Work with teachers to implement classroom accommodations",
      "Advocate for learning style considerations in school settings",
      "Request seating and environmental modifications as needed"
    ],
    longTerm: [
      "Continue to observe and refine understanding of learning needs",
      "Build on identified strengths while supporting challenge areas",
      "Consider professional consultation if additional support is needed"
    ]
  }

  return baseRecommendations
}

function generateNeurodivergentInsights(profile: any) {
  const insights = []
  
  // Check for patterns that might suggest neurodivergent traits
  if (profile.execScores.movement > 8) {
    insights.push("Strong preference for movement-based regulation (common in ADHD)")
  }
  
  if (profile.totalScores.goalPersist > 6 && profile.totalScores.selfMonitorWritten > 4) {
    insights.push("Excellent self-monitoring abilities (strength in executive function)")
  }
  
  if (profile.processingScores.visual > 9 && profile.motivScores.creative > 8) {
    insights.push("Strong visual-creative processing style")
  }

  if (insights.length === 0) {
    insights.push("Learning profile shows balanced development across domains")
  }
  
  return insights
}

type Step = 'landing' | 'questions' | 'email' | 'processing' | 'results'

interface FormData {
  childName: string
  childAge: string
  parentEmail: string
}

export default function AssessmentPage() {
  const [step, setStep] = useState<Step>('landing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ questionId: number; answer: string }[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    childName: '',
    childAge: '',
    parentEmail: ''
  })
  const [results, setResults] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailValidation, setEmailValidation] = useState({ isValid: true, error: '' })

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return { isValid: false, error: 'Email is required' }
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' }
    }
    return { isValid: true, error: '' }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateEmail(formData.parentEmail)
    setEmailValidation(validation)
    
    if (validation.isValid && formData.childName && formData.childAge) {
      setStep('questions')
    }
  }

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId)
  }

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, { questionId: questions[currentQuestionIndex].id, answer: selectedAnswer }]
      setAnswers(newAnswers)
      setSelectedAnswer('')

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Assessment complete
        setStep('email')
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setAnswers(answers.slice(0, -1))
      setSelectedAnswer('')
    }
  }

  const handleFinalSubmit = async () => {
    if (!emailValidation.isValid) return
    
    setStep('processing')
    setIsSubmitting(true)
    
    // Calculate results using multi-dimensional scoring
    const scores = calculateMultiDimensionalScores(answers)
    const profile = analyzeLearningProfile(scores)
    const report = generateComprehensiveReport(profile, formData.childName)
    
    const finalResults = {
      ...report,
      profile,
      scores,
      formData,
      answers,
      timestamp: new Date()
    }

    try {
      // Save to Firebase
      await addDoc(collection(db, 'assessments'), {
        ...finalResults,
        sessionId: `assessment_${Date.now()}`,
        completedAt: new Date()
      })

      // Track completion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'assessment_completed', {
          event_category: 'assessment',
          primary_style: report.primaryLearningStyle
        })
      }

      setResults(finalResults)
      setStep('results')
    } catch (error) {
      console.error('Error saving assessment:', error)
      setResults(finalResults) // Still show results even if save fails
      setStep('results')
    } finally {
      setIsSubmitting(false)
    }
  }

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'assessment',
        ...properties
      })
    }
  }

  // Landing Step
  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Discover Your Child's Learning Style
              </h1>
              
              <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                A comprehensive assessment to understand how your child learns best, 
                with personalized strategies from child psychology research.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8 text-left">
                <div className="bg-white p-4 rounded-lg border">
                  <Target className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-slate-900">Multi-Dimensional</h3>
                  <p className="text-sm text-slate-600">Processing style, executive function, and motivation assessment</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <Shield className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-slate-900">Evidence-Based</h3>
                  <p className="text-sm text-slate-600">Based on developmental psychology and learning science research</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <Award className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-slate-900">Actionable</h3>
                  <p className="text-sm text-slate-600">Specific strategies you can use at home and share with teachers</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-left max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Child's Name</label>
                  <Input
                    type="text"
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                    className="w-full"
                    placeholder="Enter your child's first name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Child's Age</label>
                  <Input
                    type="text"
                    value={formData.childAge}
                    onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                    className="w-full"
                    placeholder="e.g., 8 or 8 years old"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Your Email</label>
                  <Input
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => {
                      setFormData({...formData, parentEmail: e.target.value})
                      setEmailValidation({ isValid: true, error: '' })
                    }}
                    className={`w-full ${
                      !emailValidation.isValid ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    placeholder="your.email@example.com"
                    required
                  />
                  {!emailValidation.isValid && emailValidation.error && (
                    <div className="flex items-center mt-2 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {emailValidation.error}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold mt-6"
                >
                  Start Assessment <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <p className="text-xs text-slate-500 mt-4">
                Takes 3-5 minutes • Results emailed immediately • No spam, ever
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Questions Step
  if (step === 'questions') {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full shadow-xl border-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-slate-600">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {currentQuestion.section}
                </span>
              </div>
              
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                      selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mr-3 mt-0.5 ${
                        selectedAnswer === option.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {option.id}
                      </span>
                      <span className="text-sm sm:text-base">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-4">
                {currentQuestionIndex > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className={`${currentQuestionIndex === 0 ? 'flex-1' : 'flex-1'} py-3 ${
                    selectedAnswer
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email Confirmation Step
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Assessment Complete!
              </h2>
              
              <p className="text-lg text-slate-600 mb-6">
                Great job! We've analyzed {formData.childName}'s responses using our 
                multi-dimensional learning assessment framework.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-slate-900 mb-3">Your comprehensive report will include:</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    Primary learning processing style analysis
                  </li>
                  <li className="flex items-center">
                    <Brain className="w-4 h-4 text-purple-600 mr-2" />
                    Executive function support recommendations  
                  </li>
                  <li className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
                    Motivational strategies personalized for {formData.childName}
                  </li>
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 text-orange-600 mr-2" />
                    Evidence-based teaching strategies for home and school
                  </li>
                </ul>
              </div>

              <div className="text-left max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm email address for results:
                </label>
                <Input
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => {
                    setFormData({...formData, parentEmail: e.target.value})
                    setEmailValidation(validateEmail(e.target.value))
                  }}
                  className={`w-full ${
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
                  onClick={handleFinalSubmit}
                  disabled={!emailValidation.isValid}
                  className="flex-1 min-h-[52px] text-base bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300"
                >
                  Send My Results
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Processing Step
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
                Analyzing {formData.childName}'s responses and generating personalized recommendations...
              </>
            ) : (
              'Preparing your learning assessment...'
            )}
          </p>
        </div>
      </div>
    )
  }

  // Results Step
if (step === 'results' && results) {
  return (
    <ResultsSection 
      results={results}
      formData={formData}
      onEmailResults={() => {
        // Any email tracking logic if needed
        console.log('Email results requested for:', formData.parentEmail)
        // Add any analytics tracking here
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_results_requested', {
            event_category: 'assessment',
            event_label: 'detailed_report'
          })
        }
      }}
    />
  )
}

  return null
}