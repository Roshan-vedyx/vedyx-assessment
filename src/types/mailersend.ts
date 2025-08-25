// src/types/mailersend.ts (optional - for better type safety)
export interface EmailRequest {
    email: string
    childName: string
    childAge: number
    report: string
  }
  
  export interface EmailResponse {
    success: boolean
    message: string
    messageId?: string
    error?: string
  }