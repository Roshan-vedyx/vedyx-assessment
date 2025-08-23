'use client'

import { useState, useCallback } from 'react'
import { questions } from '@/data/questions'
import { AssessmentAnswer, AssessmentResults, FormData } from '@/types/assessment'

export interface AssessmentEngineProps {
  onResults: (results: AssessmentResults) => void
  formData: FormData
}

export function useAssessmentEngine() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const getCurrentQuestion = useCallback(() => {
    return questions[currentQuestion]
  }, [currentQuestion])

  const selectAnswer = useCallback((answerId: string) => {
    setSelectedAnswer(answerId)
  }, [])

  const submitAnswer = useCallback(() => {
    if (!selectedAnswer) return false

    const newAnswer: AssessmentAnswer = {
      questionId: questions[currentQuestion].id,
      answer: selectedAnswer,
      timestamp: new Date()
    }

    setAnswers(prev => [...prev, newAnswer])
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      return false // Not finished
    }

    return true // Finished
  }, [selectedAnswer, currentQuestion])

  const goToPrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setAnswers(prev => prev.slice(0, -1))
      setSelectedAnswer(null)
    }
  }, [currentQuestion])

  const calculateResults = useCallback((finalAnswers: AssessmentAnswer[]): AssessmentResults => {
    const scores: Record<string, number> = {}
    
    finalAnswers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId)
      const option = question?.options.find(opt => opt.id === answer.answer)
      
      if (option?.score) {
        Object.entries(option.score).forEach(([key, value]) => {
          scores[key] = (scores[key] || 0) + value
        })
      }
    })

    // Determine primary and secondary learning styles
    const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a)
    const primaryStyle = sortedScores[0]?.[0] || 'balanced'
    const secondaryStyle = sortedScores[1]?.[0]

    // Generate report based on primary style
    const report = generateReport(primaryStyle, secondaryStyle, scores)

    return {
      primaryStyle,
      secondaryStyle,
      scores,
      report
    }
  }, [])

  const isComplete = currentQuestion >= questions.length
  const progress = ((currentQuestion + (selectedAnswer ? 0.5 : 0)) / questions.length) * 100

  return {
    currentQuestion: currentQuestion + 1,
    totalQuestions: questions.length,
    question: getCurrentQuestion(),
    selectedAnswer,
    selectAnswer,
    submitAnswer,
    goToPrevious,
    calculateResults,
    answers,
    isComplete,
    progress,
    canGoBack: currentQuestion > 0
  }
}

function generateReport(primary: string, secondary: string | undefined, scores: Record<string, number>) {
  const reports = {
    visual: {
      title: "Visual Learner",
      description: "Your child learns best through seeing and visualizing information",
      strengths: [
        "Excellent at following visual instructions and diagrams",
        "Strong spatial awareness and pattern recognition", 
        "Remembers information better when it's presented visually"
      ],
      recommendations: [
        "Use colorful charts, graphs, and visual aids during study time",
        "Encourage mind mapping and visual note-taking techniques",
        "Choose books with illustrations and graphic organizers"
      ],
      nextSteps: [
        "Try our visual story-building activities",
        "Explore reading comprehension with picture supports",
        "Practice math concepts using visual manipulatives"
      ]
    },
    auditory: {
      title: "Auditory Learner", 
      description: "Your child processes information most effectively through listening and verbal instruction",
      strengths: [
        "Excellent listening skills and verbal communication",
        "Learns well through discussion and explanation",
        "Strong memory for spoken information"
      ],
      recommendations: [
        "Read aloud together daily and discuss stories",
        "Use songs, rhymes, and verbal repetition for memorization",
        "Encourage your child to explain concepts back to you"
      ],
      nextSteps: [
        "Try our audio-supported reading activities", 
        "Explore storytelling and verbal expression exercises",
        "Practice phonics through sound-based games"
      ]
    },
    kinesthetic: {
      title: "Hands-On Learner",
      description: "Your child learns best through movement, touch, and hands-on experiences",
      strengths: [
        "Excellent at learning through direct experience",
        "Strong physical coordination and body awareness",
        "High energy and engagement with active learning"
      ],
      recommendations: [
        "Incorporate movement into learning activities",
        "Use manipulatives, building blocks, and tactile materials",
        "Take frequent breaks for physical activity"
      ],
      nextSteps: [
        "Try our interactive word-building games",
        "Explore math through hands-on problem solving",
        "Practice reading with finger-tracking and movement"
      ]
    },
    reading: {
      title: "Text-Based Learner",
      description: "Your child learns effectively through written text and independent reading",
      strengths: [
        "Strong independent reading and comprehension skills",
        "Excellent at following written instructions", 
        "Self-directed learning through text-based resources"
      ],
      recommendations: [
        "Provide plenty of books at appropriate reading levels",
        "Encourage journaling and written reflection",
        "Use written step-by-step instructions for tasks"
      ],
      nextSteps: [
        "Try our advanced reading comprehension activities",
        "Explore creative writing and story creation",
        "Practice complex text analysis and critical thinking"
      ]
    }
  }

  return reports[primary as keyof typeof reports] || reports.visual
}