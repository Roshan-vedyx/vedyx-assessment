// src/app/api/send-report/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, childName, childAge, report } = await request.json()
    
    console.log(`📧 Sending report for ${childName} to ${email}`)
    
    // Debug API key
    console.log('🔍 Brevo API Key exists:', !!process.env.BREVO_API_KEY)
    
    // Simple Brevo API call (no SDK needed)
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
        subject: `${childName}'s Learning Assessment Results`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌟 ${childName}'s Learning Assessment Results</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Here are ${childName}'s learning assessment results:</p>
              ${report}
              <p>Thank you for using our assessment tool!</p>
            </div>
          </body>
          </html>
        `,
        tags: ["assessment-report", "meta-campaign"]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Brevo API Error:', errorData)
      throw new Error(`Brevo API Error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const result = await response.json()
    console.log('✅ Email sent via Brevo:', result.messageId)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    })
    
  } catch (error) {
    console.error('❌ Email error:', error)
    
    // ✅ FIX: Properly type the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { error: `Failed to send email: ${errorMessage}` }, 
      { status: 500 }
    )
  }
}