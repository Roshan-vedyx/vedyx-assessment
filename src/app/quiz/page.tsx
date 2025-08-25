// src/app/quiz/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from '@/components/assessment/QuestionCard'
import { useAssessmentEngine } from '@/components/assessment/AssessmentEngine'
import { FormData } from '@/types/assessment'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { generateSessionId } from '@/lib/utils'

export default function QuizPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [sessionId] = useState(generateSessionId())
  
  const {
    currentQuestion,
    totalQuestions,
    question,
    selectedAnswer,
    selectAnswer,
    submitAnswer,
    goToPrevious,
    calculateResults,
    answers,
    isComplete,
    progress,
    canGoBack
  } = useAssessmentEngine()

  // Load form data from sessionStorage
  useEffect(() => {
    const storedFormData = sessionStorage.getItem('assessmentFormData')
    if (!storedFormData) {
      router.push('/form')
      return
    }
    setFormData(JSON.parse(storedFormData))
  }, [router])

  const handleSubmitAnswer = async () => {
    const isFinished = submitAnswer()
    
    if (isFinished && formData) {
      // Calculate results
      const results = calculateResults([...answers, {
        questionId: question.id,
        answer: selectedAnswer!,
        timestamp: new Date()
      }])

      // Save to Firestore
      if (db) {
        try {
          await addDoc(collection(db, 'assessments'), {
            sessionId,
            formData,
            answers: [...answers, {
              questionId: question.id,
              answer: selectedAnswer!,
              timestamp: new Date()
            }],
            results,
            completedAt: new Date(),
            source: 'microsite'
          })
        } catch (error) {
          console.error('Error saving assessment:', error)
        }
      }

      // Store results and redirect
      sessionStorage.setItem('assessmentResults', JSON.stringify(results))
      
      // Track completion
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'assessment_completed', {
          event_category: 'assessment',
          event_label: 'quiz_finished',
          primary_style: results.primaryStyle
        })
      }
      
      router.push('/results')
    }
  }

  if (!formData) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>
  }

  return (
    <QuestionCard
      question={question}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={selectAnswer}
      onSubmit={handleSubmitAnswer}
      onPrevious={canGoBack ? goToPrevious : undefined}
      currentQuestion={currentQuestion}
      totalQuestions={totalQuestions}
      progress={progress}
      canGoBack={canGoBack}
      childName={formData.childName}
    />
  )
}