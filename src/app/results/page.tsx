// src/app/results/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ResultsReport } from '@/components/assessment/ResultsReport'
import { AssessmentResults, FormData } from '@/types/assessment'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('assessmentResults')
    const storedFormData = sessionStorage.getItem('assessmentFormData')
    
    if (!storedResults || !storedFormData) {
      router.push('/')
      return
    }
    
    setResults(JSON.parse(storedResults))
    setFormData(JSON.parse(storedFormData))
  }, [router])

  const handleEmailResults = async () => {
    // Track email request
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_requested', {
        event_category: 'assessment',
        event_label: 'results_email'
      })
    }

    // Here you would integrate with your email service
    // For now, we'll simulate a successful email send
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('Email would be sent to:', formData?.parentEmail)
    console.log('Results:', results)
  }

  if (!results || !formData) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">Loading your results...</div>
    </div>
  }

  return (
    <ResultsReport
      results={results}
      formData={formData}
      onEmailResults={handleEmailResults}
    />
  )
}