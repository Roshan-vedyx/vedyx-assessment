// src/app/form/page.tsx
'use client'

import { FormStep } from '@/components/assessment/FormStep'
import { FormData } from '@/types/assessment'
import { useRouter } from 'next/navigation'

export default function FormPage() {
  const router = useRouter()

  const handleFormSubmit = (formData: FormData) => {
    // Store form data in sessionStorage for the quiz
    sessionStorage.setItem('assessmentFormData', JSON.stringify(formData))
    
    // Track conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_completed', {
        event_category: 'assessment',
        event_label: 'parent_info_form'
      })
    }
    
    router.push('/quiz')
  }

  return <FormStep onSubmit={handleFormSubmit} />
}