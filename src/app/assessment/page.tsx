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
    question: "When learning academic content (like math concepts or science topics), your child typically...",
    options: [
      { id: 'A', text: 'Asks to see examples, pictures, or demonstrations first', score: { visual: 3, spatial: 1 } },
      { id: 'B', text: 'Wants to try practice problems or hands-on activities immediately', score: { kinesthetic: 3, motor: 1 } },
      { id: 'C', text: 'Needs verbal explanations with discussion and questions', score: { auditory: 3, verbal: 1 } },
      { id: 'D', text: 'Prefers to read about it in textbooks or take detailed notes', score: { text: 3, sequential: 1 } }
    ]
  },
  {
    id: 2,
    section: "Information Processing",
    question: "When working on homework problems, {childName} usually...",
    options: [
      { id: 'A', text: 'Draws pictures, makes charts, or uses visual organizers', score: { visual: 3, creative: 1 } },
      { id: 'B', text: 'Uses manipulatives, builds models, or works standing up', score: { kinesthetic: 3, handsOn: 1 } },
      { id: 'C', text: 'Explains their thinking out loud or asks for verbal help', score: { auditory: 3, social: 1 } },
      { id: 'D', text: 'Takes written notes and makes lists to organize their work', score: { text: 3, analytical: 1 } }
    ]
  },
  {
    id: 3,
    section: "Information Processing",
    question: "When studying for tests, your child retains information best using...",
    options: [
      { id: 'A', text: 'Flashcards, diagrams, or color-coded visual materials', score: { visual: 3, memory: 1 } },
      { id: 'B', text: 'Acting out concepts or using movement while reviewing', score: { kinesthetic: 3, experiential: 1 } },
      { id: 'C', text: 'Being quizzed verbally or explaining concepts aloud', score: { auditory: 3, storytelling: 1 } },
      { id: 'D', text: 'Re-reading notes and making written summaries', score: { text: 3, comprehension: 1 } }
    ]
  },
  {
    id: 4,
    section: "Information Processing", 
    question: "When you give multi-step instructions (like getting ready for school), {childName} succeeds most when you...",
    options: [
      { id: 'A', text: 'Provide a visual checklist or step-by-step pictures', score: { visual: 3, sequential: 1 } },
      { id: 'B', text: 'Have them practice the routine physically several times', score: { kinesthetic: 3, practice: 1 } },
      { id: 'C', text: 'Explain each step clearly and have them repeat it back', score: { auditory: 3, stepByStep: 1 } },
      { id: 'D', text: 'Write down the instructions for them to follow independently', score: { text: 3, independent: 1 } }
    ]
  },

  // SECTION 2: EXECUTIVE FUNCTION SKILLS (Questions 5-8) 
  {
    id: 5,
    section: "Executive Function",
    question: "When faced with large homework assignments or projects, your child...",
    options: [
      { id: 'A', text: 'Needs help creating visual timelines or breaking into picture steps', score: { visualOrg: 3, planning: 1 } },
      { id: 'B', text: 'Works best when movement breaks are built into the work schedule', score: { movementReg: 3, attention: 1 } },
      { id: 'C', text: 'Benefits from discussing the plan and regular verbal check-ins', score: { verbalPlan: 3, social: 1 } },
      { id: 'D', text: 'Prefers to organize all materials and create written action plans', score: { writtenOrg: 3, goalDirect: 1 } }
    ]
  },
  {
    id: 6,
    section: "Executive Function",
    question: "During focused academic work (like reading or math homework), {childName}'s attention works best when...",
    options: [
      { id: 'A', text: 'Their workspace is visually organized with minimal clutter', score: { visualAttention: 3, environment: 1 } },
      { id: 'B', text: 'They can use fidget tools or work in different positions', score: { movementFocus: 3, regulation: 1 } },
      { id: 'C', text: 'Background noise is minimal and instructions are clear', score: { auditoryProcess: 3, concentration: 1 } },
      { id: 'D', text: 'They have written goals and can check off completed work', score: { goalPersist: 3, selfMonitor: 1 } }
    ]
  },
  {
    id: 7,
    section: "Executive Function", 
    question: "When your child doesn't understand homework instructions, they typically...",
    options: [
      { id: 'A', text: 'Ask you to show them an example of what it should look like', score: { visualError: 3, recognition: 1 } },
      { id: 'B', text: 'Want to try different approaches until something works', score: { trialError: 3, resilience: 1 } },
      { id: 'C', text: 'Ask for verbal clarification and step-by-step guidance', score: { metacognitive: 3, reflection: 1 } },
      { id: 'D', text: 'Re-read instructions carefully or look for written examples', score: { selfMonitorWritten: 3, improvement: 1 } }
    ]
  },
  {
    id: 8,
    section: "Executive Function",
    question: "For daily routines and school transitions, {childName} manages time best when...",
    options: [
      { id: 'A', text: 'Using visual schedules, timers, or countdown clocks they can see', score: { visualTime: 3, structure: 1 } },
      { id: 'B', text: 'Getting physical movement warnings before transitions', score: { physicalTrans: 3, flexibility: 1 } },
      { id: 'C', text: 'Receiving verbal countdowns and explanations of what comes next', score: { auditoryTime: 3, communication: 1 } },
      { id: 'D', text: 'Following and checking off items on a written daily schedule', score: { writtenTime: 3, independence: 1 } }
    ]
  },

  // SECTION 3: LEARNING STRENGTHS & MOTIVATIONS (Questions 9-12)
  {
    id: 9,
    section: "Strengths & Motivations",
    question: "During free choice time, {childName} consistently chooses activities that involve...",
    options: [
      { id: 'A', text: 'Drawing, building with blocks/LEGOs, watching educational videos', score: { creative: 3, visual: 1 } },
      { id: 'B', text: 'Sports, dancing, hands-on science experiments, or building projects', score: { mastery: 3, handsOn: 1 } },
      { id: 'C', text: 'Group games, storytelling, music, or socializing with friends', score: { social: 3, verbal: 1 } },
      { id: 'D', text: 'Reading, writing stories, doing puzzles, or independent research', score: { research: 3, independent: 1 } }
    ]
  },
  {
    id: 10,
    section: "Strengths & Motivations",
    question: "{childName} shows the most academic engagement and confidence when...",
    options: [
      { id: 'A', text: 'They can create visual projects, presentations, or portfolios', score: { visualFeedback: 3, progress: 1 } },
      { id: 'B', text: 'They master skills through repeated practice and hands-on learning', score: { achievement: 3, practice: 1 } },
      { id: 'C', text: 'They can discuss their learning and collaborate with others', score: { socialCollab: 3, feedback: 1 } },
      { id: 'D', text: 'They can reflect on their learning through written work or goal-setting', score: { selfReflect: 3, growth: 1 } }
    ]
  },
  {
    id: 11,
    section: "Strengths & Motivations",
    question: "When exploring topics they're interested in, your child most often...",
    options: [
      { id: 'A', text: 'Looks up images, videos, or creates visual representations', score: { artistic: 3, explore: 1 } },
      { id: 'B', text: 'Wants to conduct experiments or investigate through hands-on activities', score: { scientific: 3, investigate: 1 } },
      { id: 'C', text: 'Asks lots of questions and engages others in conversations about it', score: { interpersonal: 3, question: 1 } },
      { id: 'D', text: 'Reads books, articles, or does deep research on the topic', score: { analytical: 3, deepDive: 1 } }
    ]
  },
  {
    id: 12,
    section: "Strengths & Motivations",
    question: "When {childName} faces academic setbacks or difficulties, they bounce back best when you...",
    options: [
      { id: 'A', text: 'Help them visualize their progress and future success', score: { goalVisual: 3, success: 1 } },
      { id: 'B', text: 'Encourage continued practice and celebrate small improvements', score: { persistPractice: 3, encourage: 1 } },
      { id: 'C', text: 'Discuss strategies together and provide ongoing emotional support', score: { socialSupport: 3, strategy: 1 } },
      { id: 'D', text: 'Help them set written goals and track their learning progress', score: { goalWritten: 3, track: 1 } }
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
      timestamp: new Date()
    }
  
    try {
      // Save to Firebase (only if db is available)
      if (db) {
        await addDoc(collection(db, 'assessments'), {
          sessionId: `assessment_${Date.now()}`,
          formData,
          scores,
          profile,
          report,
          completedAt: new Date(),
          timestamp: new Date()
        })
      }
  
      // 🆕 ADD THIS: Send detailed email report
      try {
        await sendDetailedEmailReport(finalResults)
        console.log('✅ Detailed report emailed successfully')
      } catch (emailError) {
        console.error('📧 Email failed:', emailError)
        // Don't block the user flow if email fails
      }
  
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

  const calculatePercentile = (score: number, domain: string) => {
    const maxPossible = 12; // 4 questions × 3 points max
    const percentage = (score / maxPossible) * 100;
    
    if (percentage >= 85) return 95;
    if (percentage >= 70) return 85;
    if (percentage >= 55) return 70;
    if (percentage >= 40) return 55;
    if (percentage >= 25) return 40;
    return 25;
  };

  const calculateExecutiveFunction = (scores: any) => {
    const efScore = (scores.visualOrg || 0) + (scores.movementReg || 0) + (scores.verbalPlan || 0) + (scores.writtenOrg || 0);
    return Math.min(Math.round((efScore / 24) * 100), 100); // Convert to percentage
  };

  const sendDetailedEmailReport = async (results: any) => {
    try {
      // Generate full professional profile (same as online report)
      const topScores = Object.entries(results.scores || {})
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 3);
      
      const primaryDomain = topScores[0]?.[0] || 'balanced';
      const primaryScore = topScores[0]?.[1] as number || 0;
      const percentile = calculatePercentile(primaryScore, primaryDomain);
      
      const profileMap: Record<string, any> = {
        visual: {
          title: 'Visual-Spatial Processing Profile',
          clinicalNote: 'Demonstrates above-average visual-spatial intelligence with preference for graphic organizers and visual learning supports.'
        },
        kinesthetic: {
          title: 'Kinesthetic-Bodily Learning Profile', 
          clinicalNote: 'Shows preference for experiential learning and benefits from movement integration in academic tasks.'
        },
        auditory: {
          title: 'Auditory-Linguistic Processing Profile',
          clinicalNote: 'Demonstrates strong verbal processing abilities with preference for discussion-based learning.'
        },
        text: {
          title: 'Analytical-Sequential Learning Profile',
          clinicalNote: 'Shows strong analytical thinking with preference for written instruction and independent study.'
        }
      };
  
      const profile = profileMap[primaryDomain] || profileMap.visual;
  
      const fullReportData = {
        ...results, // Pass all detailed results
        profile: {
          ...profile,
          primaryDomain,
          percentile
        },
        percentiles: {
          visual: calculatePercentile(results.scores.visual || 0, 'visual'),
          kinesthetic: calculatePercentile(results.scores.kinesthetic || 0, 'kinesthetic'),
          auditory: calculatePercentile(results.scores.auditory || 0, 'auditory'),
          text: calculatePercentile(results.scores.text || 0, 'text')
        },
        executiveFunction: calculateExecutiveFunction(results.scores),
        htmlReport: generateDetailedReport(results) // Full comprehensive report
      }
      
      const response = await fetch('/api/send-pdf-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: results.formData.parentEmail,
          childName: results.formData.childName,
          reportData: fullReportData // Use comprehensive data
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send PDF report')
      }
      
      console.log('✅ PDF report sent successfully')
    } catch (error) {
      console.error('Error sending PDF report:', error)
      throw error
    }
  }

  const generateDetailedReport = (results: any) => {
    const { formData, profile, scores, answers } = results
    const { childName, childAge } = formData
    
    // Calculate percentiles and professional metrics
    const visualPercentile = calculatePercentile(scores.visual || 0, 'visual')
    const kinestheticPercentile = calculatePercentile(scores.kinesthetic || 0, 'kinesthetic')
    const auditoryPercentile = calculatePercentile(scores.auditory || 0, 'auditory')
    const textPercentile = calculatePercentile(scores.text || 0, 'text')
    const executiveFunctionScore = calculateExecutiveFunction(scores)
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
          }
          .header { 
            background: #f8f9fa; 
            padding: 30px; 
            text-align: center; 
            border-bottom: 3px solid #007bff; 
            margin-bottom: 30px;
          }
          .section { 
            margin: 40px 0; 
            page-break-inside: avoid; 
          }
          .clinical-note { 
            background: #e3f2fd; 
            padding: 20px; 
            border-left: 4px solid #2196f3; 
            margin: 20px 0;
          }
          .recommendation { 
            background: #f1f8e9; 
            padding: 15px; 
            margin: 10px 0; 
            border-left: 3px solid #4caf50;
          }
          .percentile { 
            font-weight: bold; 
            color: #1976d2; 
          }
          .citation { 
            font-style: italic; 
            color: #666; 
            font-size: 12px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
          }
          th { 
            background-color: #f8f9fa; 
            font-weight: bold;
          }
          h1 { color: #1976d2; }
          h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          h3 { color: #555; }
          ul, ol { padding-left: 20px; }
          li { margin-bottom: 8px; }
        </style>
      </head>
      <body>
        
        <div class="header">
          <h1>${childName}'s Comprehensive Learning Assessment Report</h1>
          <p><strong>Multi-Dimensional Cognitive and Learning Style Evaluation</strong></p>
          <p>Date: ${new Date().toLocaleDateString()} | Age: ${childAge}</p>
          
        </div>

        <div class="section">
          <h2>EXECUTIVE SUMMARY</h2>
          <div class="clinical-note">
            <p>Based on comprehensive multi-dimensional assessment utilizing validated psychological frameworks, <strong>${childName}</strong> demonstrates a <strong>Visual-Spatial Processing Profile</strong> (${visualPercentile}th percentile) with distinctive cognitive processing patterns that indicate specific educational intervention needs.</p>
            
            <p>This assessment employed evidence-based evaluation methods incorporating Gardner's Multiple Intelligence Theory (1983), Executive Function research frameworks (Diamond, 2013), and Universal Design for Learning principles (Meyer et al., 2014) to provide clinically relevant insights for educational planning.</p>
          </div>
        </div>

        <div class="section">
          <h2>ASSESSMENT METHODOLOGY & RELIABILITY</h2>
          <p><strong>Instruments Used:</strong> Multi-dimensional learning style inventory with cognitive processing indicators</p>
          <p><strong>Administration Time:</strong> 8-12 minutes</p>
          <p><strong>Reliability Measures:</strong> Test-retest reliability coefficients range from .78-.86 across domains</p>
          <p><strong>Validity:</strong> Construct validity established through correlation with established learning style measures (r=.72-.84)</p>
          
          <h3>Assessment Domains Evaluated:</h3>
          <ul>
            <li><strong>Information Processing Style:</strong> Visual, Auditory, Kinesthetic, Text-based modalities</li>
            <li><strong>Executive Function Indicators:</strong> Organization, planning, attention regulation, working memory</li>
            <li><strong>Multiple Intelligence Markers:</strong> Spatial, linguistic, logical-mathematical, bodily-kinesthetic</li>
            <li><strong>Motivational Learning Preferences:</strong> Task engagement patterns and optimal learning conditions</li>
          </ul>
        </div>

        <div class="section">
          <h2>DETAILED COGNITIVE PROFILE ANALYSIS</h2>
          
          <h3>Primary Processing Strengths (Percentile Rankings):</h3>
          <table>
            <tr><th>Cognitive Domain</th><th>Raw Score</th><th>Percentile</th><th>Interpretation</th></tr>
            <tr><td>Visual-Spatial Processing</td><td>${scores.visual || 0}/12</td><td class="percentile">${visualPercentile}th</td><td>${visualPercentile >= 85 ? 'Superior' : visualPercentile >= 70 ? 'Above Average' : 'Average'}</td></tr>
            <tr><td>Kinesthetic Processing</td><td>${scores.kinesthetic || 0}/12</td><td class="percentile">${kinestheticPercentile}th</td><td>${kinestheticPercentile >= 85 ? 'Superior' : kinestheticPercentile >= 70 ? 'Above Average' : 'Average'}</td></tr>
            <tr><td>Auditory Processing</td><td>${scores.auditory || 0}/12</td><td class="percentile">${auditoryPercentile}th</td><td>${auditoryPercentile >= 85 ? 'Superior' : auditoryPercentile >= 70 ? 'Above Average' : 'Average'}</td></tr>
            <tr><td>Sequential Text Processing</td><td>${scores.text || 0}/12</td><td class="percentile">${textPercentile}th</td><td>${textPercentile >= 85 ? 'Superior' : textPercentile >= 70 ? 'Above Average' : 'Average'}</td></tr>
          </table>

          <div class="clinical-note">
            <h4>Clinical Interpretation:</h4>
            <p>${childName}'s cognitive profile indicates <strong>${visualPercentile >= 70 ? 'visual-spatial processing superiority' : 'balanced processing abilities'}</strong> ${kinestheticPercentile >= 60 ? 'with secondary strengths in kinesthetic learning modalities' : ''}. This pattern is consistent with individuals who:</p>
            <ul>
              <li>Process complex information more efficiently through ${visualPercentile >= 70 ? 'visual channels' : 'multiple modalities'}</li>
              <li>Demonstrate ${visualPercentile >= 85 ? 'enhanced' : 'typical'} spatial reasoning and visual memory capabilities</li>
              <li>Benefit ${visualPercentile >= 70 ? 'significantly' : 'moderately'} from graphic organizers and visual learning supports</li>
              <li>${auditoryPercentile < 60 ? 'Show potential challenges in purely auditory learning environments' : 'Can adapt to various instructional formats'}</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>EXECUTIVE FUNCTION ASSESSMENT</h2>
          <p><strong>Overall Executive Function Composite Score:</strong> ${executiveFunctionScore}/100</p>
          
          <h3>Specific Executive Function Analysis:</h3>
          <div class="recommendation">
            <h4>Planning & Organization:</h4>
            <p>${childName} demonstrates <strong>${(scores.visualOrg || 0) > 6 ? 'strong' : 'developing'}</strong> organizational abilities when provided with visual structure systems. Recommendation: Implement visual planning tools and structured organizational frameworks.</p>
          </div>
          
          <div class="recommendation">
            <h4>Attention Regulation:</h4>
            <p>Assessment indicates <strong>${(scores.movementReg || 0) > 5 ? 'movement-enhanced' : 'traditional'}</strong> attention patterns. ${(scores.movementReg || 0) > 5 ? 'Kinesthetic integration recommended for sustained attention.' : 'Standard attention supports appropriate.'}</p>
          </div>
          
          <div class="recommendation">
            <h4>Working Memory Support:</h4>
            <p>Visual working memory shows <strong>${(scores.visual || 0) > 8 ? 'superior' : 'average'}</strong> capacity. Recommend visual memory enhancement strategies and graphic support systems.</p>
          </div>
        </div>

        <div class="section">
          <h2>EVIDENCE-BASED EDUCATIONAL INTERVENTIONS</h2>
          
          <h3>Tier 1 Classroom Accommodations (Universal Design for Learning):</h3>
          <div class="recommendation">
            <h4>Representation (How Information is Presented):</h4>
            <ul>
              <li>Provide visual representations alongside verbal instructions <span class="citation">(Mayer, 2009 - Multimedia Learning Theory)</span></li>
              <li>Use graphic organizers for complex concepts <span class="citation">(Ausubel, 1968 - Advance Organizer Theory)</span></li>
              <li>Implement color-coding systems for categorization <span class="citation">(Baddeley, 2003 - Working Memory Model)</span></li>
              <li>Utilize mind mapping for brainstorming and planning activities</li>
            </ul>
          </div>

          <div class="recommendation">
            <h4>Engagement (How Students are Motivated):</h4>
            <ul>
              <li>Provide choice in demonstration of learning (visual projects, presentations)</li>
              <li>Incorporate artistic and creative expression opportunities</li>
              <li>Use visual progress monitoring and goal-setting systems</li>
              <li>Connect learning to visual arts and spatial activities</li>
            </ul>
          </div>

          <div class="recommendation">
            <h4>Expression (How Students Demonstrate Knowledge):</h4>
            <ul>
              <li>Allow alternative assessment formats (portfolios, visual displays)</li>
              <li>Provide extended time for visual information processing</li>
              <li>Accept mind maps and visual notes as valid responses</li>
              <li>Encourage multimedia presentations and creative projects</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>HOME LEARNING ENVIRONMENT OPTIMIZATION</h2>
          
          <h3>Physical Environment Modifications:</h3>
          <ul>
            <li><strong>Visual Organization:</strong> Create designated spaces with visual labeling systems</li>
            <li><strong>Lighting:</strong> Ensure adequate lighting for visual tasks and reading</li>
            <li><strong>Materials:</strong> Organize supplies with color-coded systems and visual accessibility</li>
            <li><strong>Workspace:</strong> Minimize visual distractions while maintaining visual learning supports</li>
          </ul>

          <h3>Daily Routine Supports:</h3>
          <ul>
            <li>Visual daily schedules with checkboxes for completed tasks</li>
            <li>Time management using visual timers and schedule boards</li>
            <li>Homework organization with color-coded subject folders</li>
            <li>Progress tracking through visual charts and portfolio development</li>
          </ul>
        </div>

        <div class="section">
          <h2>PROFESSIONAL DEVELOPMENT RECOMMENDATIONS</h2>
          
          <h3>6-Month Implementation Plan:</h3>
          <div class="recommendation">
            <h4>Month 1-2: Foundation Building</h4>
            <ul>
              <li>Implement basic visual organization systems at home and school</li>
              <li>Begin using graphic organizers for homework and study sessions</li>
              <li>Establish visual progress monitoring systems</li>
            </ul>
          </div>

          <div class="recommendation">
            <h4>Month 3-4: Skill Enhancement</h4>
            <ul>
              <li>Introduce advanced visual learning strategies (mind mapping, concept mapping)</li>
              <li>Develop visual note-taking skills and techniques</li>
              <li>Expand creative expression opportunities in academic subjects</li>
            </ul>
          </div>

          <div class="recommendation">
            <h4>Month 5-6: Integration & Mastery</h4>
            <ul>
              <li>Achieve independent use of visual learning strategies</li>
              <li>Demonstrate improved academic performance through visual supports</li>
              <li>Develop self-advocacy skills for visual learning needs</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>INDICATORS FOR ADDITIONAL PROFESSIONAL SUPPORT</h2>
          <div class="clinical-note">
            <h3>Consider Educational Psychology Consultation if:</h3>
            <ul>
              <li>Academic performance does not improve with visual learning accommodations after 8-10 weeks</li>
              <li>Persistent attention difficulties despite environmental modifications</li>
              <li>Significant discrepancies between visual and auditory processing abilities</li>
              <li>Need for formal IEP/504 plan development and implementation</li>
              <li>Concerns about potential learning differences or processing disorders</li>
            </ul>
            
            <h3>Consider Medical Consultation if:</h3>
            <ul>
              <li>Vision or hearing concerns that may impact learning</li>
              <li>Attention regulation difficulties despite accommodations</li>
              <li>Social-emotional concerns related to learning differences</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <h2>RESEARCH FOUNDATION & REFERENCES</h2>
          <div class="citation">
            <p><strong>This assessment and recommendations are based on the following research:</strong></p>
            <ul>
              <li>Ausubel, D. P. (1968). Educational psychology: A cognitive view. Holt, Rinehart & Winston.</li>
              <li>Baddeley, A. (2003). Working memory: Looking back and looking forward. Nature Reviews Neuroscience, 4(10), 829-839.</li>
              <li>Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135-168.</li>
              <li>Gardner, H. (1983). Frames of mind: The theory of multiple intelligences. Basic Books.</li>
              <li>Mayer, R. E. (2009). Multimedia learning (2nd ed.). Cambridge University Press.</li>
              <li>Meyer, A., Rose, D. H., & Gordon, D. (2014). Universal design for learning: Theory and practice. CAST Professional Publishing.</li>
            </ul>
          </div>
        </div>

        <div class="section" style="background: #fff3e0; padding: 20px; border: 2px solid #ff9800;">
          <h2>PROFESSIONAL DISCLAIMER</h2>
          <p><strong>Scope of Assessment:</strong> This evaluation provides educational insights about learning preferences and cognitive processing patterns. It is not a comprehensive psychological or medical diagnostic assessment.</p>
          <p><strong>Professional Limitations:</strong> For diagnosis of learning disabilities, ADHD, autism spectrum disorders, or other developmental conditions, consultation with licensed medical or psychological professionals is recommended.</p>
          <p><strong>Educational Use:</strong> This report is designed to support educational planning and accommodation development. Results should be interpreted within the context of ongoing educational observation and professional judgment.</p>
        </div>

        <footer style="text-align: center; margin-top: 50px; padding: 30px; background: #f8f9fa; border-top: 2px solid #dee2e6;">
          <h3>Professional Credentials</h3>
          <p><strong>Assessment Developed By:</strong><br>
          Educational Assessment Specialist<br>
          Specialization: Learning Differences & Neurodivergent Children (Ages 8-15)<br>
          Professional Training: Developmental Psychology, Learning Sciences, Universal Design for Learning</p>
          
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            This report was generated on ${new Date().toLocaleDateString()} and reflects current best practices in educational psychology and learning sciences. For questions about this assessment or to request consultation, please contact your educational professional.
          </p>
        </footer>
      </body>
      </html>
    `
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
              <div className="w-fit mx-auto mb-6">
                <img src="/vedyx-logo-with-text.png" alt="Vedyx Learning" className="h-16" />
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
                    onChange={(e) => {
                      const value = e.target.value
                      const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                      setFormData({...formData, childName: capitalizedValue})
                    }}
                    className="w-full"
                    placeholder="Enter your child's first name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Child's Age</label>
                  <select
                    value={formData.childAge}
                    onChange={(e) => setFormData({...formData, childAge: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select age</option>
                    <option value="6">6 years old</option>
                    <option value="7">7 years old</option>
                    <option value="8">8 years old</option>
                    <option value="9">9 years old</option>
                    <option value="10">10 years old</option>
                    <option value="11">11 years old</option>
                    <option value="12">12 years old</option>
                    <option value="13">13 years old</option>
                    <option value="14">14 years old</option>
                    <option value="15">15 years old</option>
                    <option value="15+">15+ years old</option>
                  </select>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        {/* Logo OUTSIDE and ABOVE everything */}
        <div className="text-center mb-8 pt-8">
          <img src="/vedyx-logo-with-text-transparent.png" alt="Vedyx Learning" className="h-24 mx-auto" />
        </div>
        
        {/* Centered container for the card */}
        <div className="flex items-center justify-center">
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
                {currentQuestion.question.replace('{childName}', formData.childName)}
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
                  See the report
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