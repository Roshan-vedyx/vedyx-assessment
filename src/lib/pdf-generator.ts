// src/lib/pdf-generator.ts
import { jsPDF } from 'jspdf'

// Add these helper functions at the top of the file
const addTable = (doc: any, headers: string[], rows: string[][], yPos: number, pageWidth: number, margin: number) => {
    const colWidth = (pageWidth - 2 * margin) / headers.length
    const rowHeight = 8
    
    // Headers
    doc.setFillColor(248, 249, 250)
    doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    headers.forEach((header, i) => {
      doc.text(header, margin + i * colWidth + 2, yPos + 6)
    })
    yPos += rowHeight
    
    // Rows
    doc.setFont('helvetica', 'normal')
    rows.forEach(row => {
      doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight)
      row.forEach((cell, i) => {
        doc.text(cell, margin + i * colWidth + 2, yPos + 6)
      })
      yPos += rowHeight
    })
    
    return yPos + 10
  }
  
  const addHighlightBox = (doc: any, content: string, yPos: number, pageWidth: number, margin: number, bgColor = [235, 248, 255]) => {
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin - 10)
    const boxHeight = lines.length * 6 + 10
    
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 3, 3, 'F')
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(lines, margin + 5, yPos + 8)
    
    return yPos + boxHeight + 10
  }

export interface ReportData {
  childName: string
  childAge: string
  primaryLearningStyle: string
  scores: any
  recommendations: string[]
  strategies: string[]
}

export function generatePDFReport(data: any): Uint8Array {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
  
    // Page setup
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const lineHeight = 7
    let yPos = margin
  
    // Helper functions
    const addText = (text: string, fontSize = 12, style: 'normal' | 'bold' = 'normal') => {
      doc.setFont('helvetica', style)
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, pageWidth - 2 * margin)
      doc.text(lines, margin, yPos)
      yPos += lines.length * lineHeight
      return lines.length * lineHeight
    }
  
    const addSection = (title: string, content: string) => {
      // Check if we need a new page
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = margin
      }
      
      addText(title, 16, 'bold')
      yPos += 5
      addText(content, 11)
      yPos += 10
    }
  
    const addHeader = () => {
        // Header background
        doc.setFillColor(79, 70, 229) // Blue
        doc.rect(0, 0, pageWidth, 45, 'F')
        
        // Title
        doc.setTextColor(255, 255, 255) // White
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(22)
        doc.text(`${data.childName || data.formData?.childName}'s Learning Assessment`, pageWidth/2, 18, { align: 'center' })
        
        // Subtitle
        doc.setFontSize(14)
        doc.text('Vedyx Learning Assessment Center', pageWidth/2, 28, { align: 'center' })
        
        // Professional subtitle
        doc.setFontSize(10)
        doc.text('Multi-Dimensional Cognitive & Learning Style Evaluation', pageWidth/2, 38, { align: 'center' })
        
        // Reset color
        doc.setTextColor(0, 0, 0)
        yPos = 55
      }
  
    // Server-side HTML to text converter
    const htmlToText = (html: string): string => {
      if (!html) return ''
      
      return html
        // Remove script and style elements completely
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        // Convert headers to uppercase with spacing
        .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n')
        // Convert paragraphs to text with spacing
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
        // Convert line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Convert lists
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
        .replace(/<ul[^>]*>|<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>|<\/ol>/gi, '\n')
        // Convert divs to spacing
        .replace(/<div[^>]*>(.*?)<\/div>/gi, '\n$1\n')
        // Remove all other HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        // Clean up extra whitespace
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        .replace(/^\s+|\s+$/g, '')
    }
  
    // If we have the detailed HTML report, use it with enhanced formatting
// If we have the detailed HTML report, use it with enhanced formatting
if (data.htmlReport) {
    addHeader()
    
    // Add Professional Summary Box
    if (data.profile) {
      yPos = addHighlightBox(
        doc, 
        `PROFESSIONAL ASSESSMENT SUMMARY\n\nBased on comprehensive multi-dimensional assessment, ${data.childName || data.formData?.childName} demonstrates a ${data.profile.title} (${data.profile.percentile}th percentile strength). ${data.profile.clinicalNote}`,
        yPos, pageWidth, margin, [240, 248, 255]
      )
    }
    
    // Add Percentiles Table
    if (data.percentiles) {
      // Check for page break
      if (yPos > pageHeight - 60) {
        doc.addPage()
        yPos = margin
      }
      
      doc.setTextColor(25, 118, 210) // Blue color
      addText('COGNITIVE PROFILE ANALYSIS', 16, 'bold')
      yPos += 5
      
      yPos = addTable(
        doc,
        ['Cognitive Domain', 'Percentile', 'Interpretation'],
        [
          ['Visual-Spatial Processing', `${data.percentiles.visual}th`, data.percentiles.visual >= 70 ? 'Above Average' : 'Average'],
          ['Kinesthetic Processing', `${data.percentiles.kinesthetic}th`, data.percentiles.kinesthetic >= 70 ? 'Above Average' : 'Average'],
          ['Auditory Processing', `${data.percentiles.auditory}th`, data.percentiles.auditory >= 70 ? 'Above Average' : 'Average'],
          ['Text Processing', `${data.percentiles.text}th`, data.percentiles.text >= 70 ? 'Above Average' : 'Average']
        ],
        yPos, pageWidth, margin
      )
    }
    
    // Add Executive Function if available
    if (data.executiveFunction) {
      yPos = addHighlightBox(
        doc,
        `EXECUTIVE FUNCTION ASSESSMENT\n\nOverall Executive Function Composite: ${data.executiveFunction}th percentile\n\nThis metric indicates ${data.childName || data.formData?.childName}'s ability to organize, plan, and regulate attention during learning tasks.`,
        yPos, pageWidth, margin, [245, 255, 245]
      )
    }
    
    // Convert and add remaining HTML content
    doc.setTextColor(0, 0, 0) // Reset to black
    const textContent = htmlToText(data.htmlReport)
    const lines = doc.splitTextToSize(textContent, pageWidth - 2 * margin)
    
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 20) { // Near bottom of page
        doc.addPage()
        yPos = margin
      }
      doc.text(line, margin, yPos)
      yPos += lineHeight
    })
  } else {
    // Fallback to enhanced basic report if no HTML report available
    addHeader()
  
    // Add Professional Summary Box even in fallback
    if (data.profile) {
      yPos = addHighlightBox(
        doc, 
        `PROFESSIONAL ASSESSMENT SUMMARY\n\n${data.childName || data.formData?.childName} demonstrates a ${data.profile.title || 'Multi-modal Learning Profile'}.`,
        yPos, pageWidth, margin, [240, 248, 255]
      )
    }
  
    // Executive Summary
    addSection(
      'Executive Summary',
      `This comprehensive assessment reveals that ${data.childName || data.formData?.childName} (age ${data.childAge || data.formData?.childAge}) demonstrates a primary ${data.primaryLearningStyle || data.profile?.primaryDomain} learning preference. The following report provides evidence-based strategies to support their academic success.`
    )
  
    // Add percentiles table if available
    if (data.percentiles) {
      doc.setTextColor(25, 118, 210) // Blue color
      addText('COGNITIVE PROFILE ANALYSIS', 16, 'bold')
      yPos += 5
      
      yPos = addTable(
        doc,
        ['Cognitive Domain', 'Percentile', 'Interpretation'],
        [
          ['Visual-Spatial Processing', `${data.percentiles.visual}th`, data.percentiles.visual >= 70 ? 'Above Average' : 'Average'],
          ['Kinesthetic Processing', `${data.percentiles.kinesthetic}th`, data.percentiles.kinesthetic >= 70 ? 'Above Average' : 'Average'],
          ['Auditory Processing', `${data.percentiles.auditory}th`, data.percentiles.auditory >= 70 ? 'Above Average' : 'Average'],
          ['Text Processing', `${data.percentiles.text}th`, data.percentiles.text >= 70 ? 'Above Average' : 'Average']
        ],
        yPos, pageWidth, margin
      )
    }
  
    // Learning Style Analysis
    doc.setTextColor(0, 0, 0) // Reset to black
    addSection(
      'Primary Learning Profile: ' + (data.profile?.title || data.primaryLearningStyle || 'Multi-modal'),
      `Based on the assessment responses, ${data.childName || data.formData?.childName} shows strongest alignment with ${(data.primaryLearningStyle || data.profile?.primaryDomain || 'balanced').toLowerCase()} learning approaches. This means they process and retain information most effectively through this modality.`
    )
  
    // Key Recommendations
    if (data.recommendations && Array.isArray(data.recommendations)) {
      let recText = data.recommendations.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n\n')
      addSection('Evidence-Based Recommendations', recText)
    }
  
    // Implementation Strategies
    if (data.strategies && Array.isArray(data.strategies)) {
      let stratText = data.strategies.map((strat: string, i: number) => `${i + 1}. ${strat}`).join('\n\n')
      addSection('Implementation Strategies', stratText)
    }
  }
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('Reprt created by Vedyx Learning Assessment Centre', pageWidth/2, pageHeight - 10, { align: 'center' })
    
    return doc.output('arraybuffer')
  }

export function generateEmailBody(childName: string, reportData: ReportData): string {
  const { primaryLearningStyle } = reportData
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          line-height: 1.6; 
          color: #333; 
          margin: 0; 
          padding: 0;
          background: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
        }
        .header { 
          background: linear-gradient(135deg, #4F46E5, #7C3AED);
          color: white; 
          padding: 30px 20px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 24px; 
          font-weight: 600;
        }
        .content { 
          padding: 30px 20px;
        }
        .summary-box {
          background: #EBF8FF;
          border: 1px solid #3B82F6;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .highlight {
          background: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 15px;
          margin: 20px 0;
        }
        .pdf-info {
          background: #F0FDF4;
          border: 1px solid #10B981;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        ul { 
          padding-left: 20px; 
          margin: 15px 0;
        }
        li { 
          margin-bottom: 8px;
        }
        .footer {
          background: #F9FAFB;
          padding: 20px;
          text-align: center;
          color: #6B7280;
          font-size: 14px;
        }
        
        /* Mobile responsive */
        @media only screen and (max-width: 480px) {
          .container { 
            margin: 0;
            border-radius: 0;
          }
          .header, .content, .footer { 
            padding: 20px 15px;
          }
          .header h1 { 
            font-size: 20px;
          }
          .summary-box, .highlight, .pdf-info {
            margin: 15px -5px;
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
            <h1>🌟 ${childName}'s Learning Assessment Results</h1>
            <p style="margin: 5px 0; font-size: 16px; font-weight: 600;">Vedyx Learning Assessment Center</p>
            <p style="margin: 0; font-size: 14px;">Professional Multi-Dimensional Cognitive Evaluation</p>
        </div>
        
        <div class="content">
          <p>Hi there!</p>
          
          <p>Great news! We've completed ${childName}'s comprehensive learning assessment, and the results show some fantastic insights about how they learn best.</p>
          
          <div class="summary-box">
            <h3 style="margin-top: 0; color: #1E40AF;">Professional Assessment Summary</h3>
            <p><strong>Primary Learning Profile:</strong> ${reportData.profile?.title || 'Multi-modal Learning Profile'}</p>
            <p>${reportData.profile?.clinicalNote || `${childName} demonstrates unique learning strengths that can be leveraged through targeted educational approaches.`}</p>
            <p><strong>Percentile Ranking:</strong> ${reportData.profile?.percentile || 'Above Average'}th percentile in primary learning domain</p>
          </div>
          
          <div class="highlight">
            <p><strong>📎 Your detailed learning report is attached!</strong></p>
            <p>The attached PDF contains everything you need - and it's print-ready for sharing with teachers.</p>
          </div>
          
          <h3>Your Detailed Report includes:</h3>
          <ul>
            <li><strong>Detailed Learning Style Analysis</strong> - Understanding ${childName}'s processing preferences</li>
            <li><strong>Executive Function Assessment</strong> - How ${childName} organizes and manages tasks</li>
            <li><strong>Personalized Strategies</strong> - Specific techniques for home and school</li>
            <li><strong>Implementation Guide</strong> - Step-by-step approaches you can start using today</li>
            <li><strong>Teacher Sharing Tips</strong> - How to communicate these insights with educators</li>
          </ul>
                             
          <p>The strategies in this report are based on current research in neurodivergent-friendly education and have helped thousands of children improve their learning outcomes.</p>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Download and read the attached PDF</li>
            <li>Try 2-3 strategies that resonate most with you</li>
            <li>Share relevant sections with ${childName}'s teachers</li>
            <li>Give the strategies 2-3 weeks to show results</li>
          </ol>
          
          <p>Questions about the report? Simply email us at connect@vedyx.ai - we're here to help!</p>
          
          <p>Wishing ${childName} continued learning success,</p>
          <p><strong>The Vedyx Learning Assessment Team</strong></p>
        </div>
        
        <div class="footer">
          <p>📱 This email and PDF are optimized for mobile viewing</p>
          <p>Visit <a href="https://vedyx.ai" style="color: #4F46E5;">vedyx.ai</a> for more learning resources</p>
        </div>
      </div>
    </body>
    </html>
  `
}