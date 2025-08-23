export interface AssessmentQuestion {
    id: number
    section: string
    question: string
    options: AssessmentOption[]
  }
  
  export interface AssessmentOption {
    id: string
    text: string
    score: Record<string, number>
  }
  
  export interface AssessmentAnswer {
    questionId: number
    answer: string
    timestamp: Date
  }
  
  export interface AssessmentResults {
    primaryStyle: string
    secondaryStyle?: string
    scores: Record<string, number>
    report: {
      title: string
      description: string
      strengths: string[]
      recommendations: string[]
      nextSteps: string[]
    }
  }
  
  export interface FormData {
    childName: string
    childAge: string
    parentEmail: string
  }
  
  export interface ConversionEvent {
    event: string
    timestamp: Date
  }
  
  export interface AssessmentSession {
    sessionId: string
    startTime: Date
    formData?: FormData
    answers: AssessmentAnswer[]
    results?: AssessmentResults
    conversionEvents: ConversionEvent[]
    completedAt?: Date
  }