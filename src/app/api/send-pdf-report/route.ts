// src/app/api/send-pdf-report/route.ts
import { NextResponse } from 'next/server'
import { generatePDFReport, generateEmailBody } from '@/lib/pdf-generator'

export async function POST(request: Request) {
  try {
    const { email, childName, reportData } = await request.json()
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i
    if (!emailRegex.test(email)) {
      console.error('❌ Invalid email format:', email)
      return NextResponse.json(
        { error: `Invalid email format: ${email}` }, 
        { status: 400 }
      )
    }
    
    console.log(`📧 Sending PDF report for ${childName} to ${email}`)
    
    // Generate PDF
    const pdfBuffer = generatePDFReport(reportData)
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')
    
    // Generate email body
    const emailBody = generateEmailBody(childName, reportData)
    
    // Send via Brevo with PDF attachment
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: "Vedyx Learning Assessment Team",
          email: "connect@vedyx.ai"
        },
        to: [{
          email: email,
          name: "Parent"
        }],
        subject: `${childName}'s Learning Assessment Results (PDF Report)`,
        htmlContent: emailBody,
        attachment: [{
          name: `${childName}_Learning_Assessment.pdf`,
          content: pdfBase64
        }],
        tags: ["assessment-pdf", "meta-campaign"]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Brevo API Error:', errorData)
      throw new Error(`Brevo API Error: ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ PDF email sent via Brevo:', result.messageId)
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId
    })
    
  } catch (error) {
    console.error('❌ PDF email error:', error)
    
    // Fix: Properly handle unknown error type
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred'
    
    return NextResponse.json(
      { error: `Failed to send PDF report: ${errorMessage}` }, 
      { status: 500 }
    )
  }
}