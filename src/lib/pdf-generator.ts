// src/lib/pdf-generator.ts - COMPLETE PROFESSIONAL VERSION
import { jsPDF } from 'jspdf'

type LearningDomain = 'visual' | 'kinesthetic' | 'auditory' | 'text';

interface ProfileContent {
  superpower: string;
  whyStruggles: string;
  whatThisMeans: string;
  homeStrategies: string[];
  schoolAdvocacy: string;
  redFlags: string;
}

type ProfilesMap = Record<LearningDomain, ProfileContent>;

interface ProfileInsights {
  profileType: string;
  translation: string;
  example: string;
  mismatch: string;
  strengths: string;
  quickAction: string;
}

type InsightsMap = Record<LearningDomain, ProfileInsights>;

// PROFESSIONAL HELPER FUNCTIONS
const addTable = (doc: any, headers: string[], rows: string[][], yPos: number, pageWidth: number, margin: number) => {
  const colWidth = (pageWidth - 2 * margin) / headers.length
  const rowHeight = 12 // Increased from 8 for better readability
  
  // Professional header styling
  doc.setFillColor(248, 250, 252) // Light gray background
  doc.setDrawColor(226, 232, 240) // Border color
  doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight, 'FD')
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11) // Increased from 10
  doc.setTextColor(30, 41, 59) // Dark slate
  
  headers.forEach((header, i) => {
    doc.text(header, margin + i * colWidth + 6, yPos + 8) // Better padding
  })
  yPos += rowHeight
  
  // Professional row styling
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  
  rows.forEach((row, rowIndex) => {
    // Alternating row colors for better readability
    if (rowIndex % 2 === 0) {
      doc.setFillColor(255, 255, 255) // White
    } else {
      doc.setFillColor(249, 250, 251) // Very light gray
    }
    
    doc.rect(margin, yPos, pageWidth - 2 * margin, rowHeight, 'FD')
    
    row.forEach((cell, i) => {
      // Color-code percentiles for visual impact
      if (i === 1 && cell.includes('th')) {
        const percentile = parseInt(cell)
        if (percentile >= 85) doc.setTextColor(21, 128, 61) // Green for superior
        else if (percentile >= 70) doc.setTextColor(59, 130, 246) // Blue for above average
        else doc.setTextColor(75, 85, 99) // Gray for average
      } else {
        doc.setTextColor(30, 41, 59)
      }
      
      doc.text(cell, margin + i * colWidth + 6, yPos + 8)
    })
    yPos += rowHeight
  })
  
  doc.setTextColor(0, 0, 0) // Reset color
  return yPos + 15
}

const addHighlightBox = (doc: any, content: string, yPos: number, pageWidth: number, margin: number, bgColor = [235, 248, 255], borderColor = [59, 130, 246]) => {
  const lines = doc.splitTextToSize(content, pageWidth - 2 * margin - 20)
  const boxHeight = lines.length * 6 + 20
  
  // Add shadow effect for depth
  doc.setFillColor(0, 0, 0, 0.1)
  doc.roundedRect(margin + 2, yPos + 2, pageWidth - 2 * margin, boxHeight, 5, 5, 'F')
  
  // Main card background
  doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
  doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 5, 5, 'F')
  
  // Left border accent (like online version)
  doc.setFillColor(borderColor[0], borderColor[1], borderColor[2])
  doc.rect(margin, yPos, 4, boxHeight)
  
  // Content with better typography
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(30, 41, 59)
  doc.text(lines, margin + 15, yPos + 12)
  
  return yPos + boxHeight + 15
}

export interface ReportData {
  childName: string
  childAge: string
  primaryLearningStyle: string
  scores: any
  recommendations: string[]
  strategies: string[]
  // Add the missing properties that your code is using:
  profile?: {
    primaryDomain?: string
    percentile?: number
    title?: string
    clinicalNote?: string
    [key: string]: any
  }
  percentiles?: {
    visual?: number
    kinesthetic?: number
    auditory?: number
    text?: number
    [key: string]: any
  }
  formData?: {
    childName?: string
    parentEmail?: string
    childAge?: string
    [key: string]: any
  }
  executiveFunction?: number
  htmlReport?: string
  [key: string]: any  // This allows for any additional properties
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
  let yPos = margin

  // Brand colors (matching email)
  const teal = [59, 185, 176]      // #3BB9B0
  const coral = [255, 122, 89]    // #FF7A59  
  const lightTeal = [240, 253, 252] // #F0FDFC
  const lightCoral = [255, 233, 214] // #FFE9D6
  const darkGray = [30, 41, 59]    // #1E293B
  const mediumGray = [100, 116, 139] // #64748B

  // Helper functions for better design
  const addColoredHeader = (title: string, bgColor: number[], textColor: number[] = [255, 255, 255]) => {
    const headerHeight = 15
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, headerHeight, 3, 3, 'F')
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2])
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(title, pageWidth/2, yPos + 10, { align: 'center' })
    
    yPos += headerHeight + 10
    doc.setTextColor(0, 0, 0) // Reset to black
  }

  const addInsightBox = (content: string, bgColor: number[], borderColor: number[]) => {
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin - 16)
    const boxHeight = lines.length * 6 + 20
    
    // Background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 5, 5, 'F')
    
    // Border
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(0.5)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 5, 5, 'S')
    
    // Content
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(lines, margin + 8, yPos + 12)
    
    yPos += boxHeight + 15
  }

  const addActionableStrategy = (title: string, content: string, icon: string = "*") => {
    // Strategy title with icon
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.text(`${icon} ${title}`, margin, yPos)
    yPos += 8
    
    // Strategy content
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(60, 60, 60)
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin - 10)
    doc.text(lines, margin + 5, yPos)
    yPos += lines.length * 5 + 8
  }

  const checkPageBreak = (neededSpace: number = 40) => {
    if (yPos > pageHeight - neededSpace) {
      doc.addPage()
      yPos = margin
    }
  }

  // Get profile-specific insights
  const getProfileContent = (domain: string, childName: string): ProfileContent => {
    const profiles: ProfilesMap = {
      visual: {
        superpower: `${childName} has a remarkable visual-spatial mind that can see patterns and solutions others miss.`,
        whyStruggles: "Most classrooms rely heavily on verbal instruction and lecture-style teaching, which doesn't match how visual learners process information.",
        whatThisMeans: `When ${childName} sees a diagram or chart, they can understand complex concepts that might take pages of text to explain. They naturally organize information spatially and remember things better when they can visualize them.`,
        homeStrategies: [
          "* Create visual schedules and checklists for daily routines",
          "* Use mind maps and diagrams for homework planning", 
          "* Replace verbal instructions with step-by-step visual guides",
          "* Use color-coding for organization (subjects, priorities, categories)"
        ],
        schoolAdvocacy: `Request that ${childName}'s teachers provide visual aids alongside verbal instructions, use graphic organizers for note-taking, and allow visual project options for assessments.`,
        redFlags: "If visual strategies aren't helping with homework completion after 4-6 weeks, or if organizational systems aren't improving daily routines."
      },
      kinesthetic: {
        superpower: `${childName} learns best through hands-on exploration and needs movement to think clearly and process information.`,
        whyStruggles: "Traditional classrooms require sitting still for long periods, which actually makes it harder for kinesthetic learners to focus and learn.",
        whatThisMeans: `${childName} isn't being disruptive when they need to move — movement actually helps their brain process information.`,
        homeStrategies: [
          "* Allow movement during homework time",
          "* Use hands-on materials for learning",
          "* Take frequent movement breaks",
          "* Create physical games for practicing skills"
        ],
        schoolAdvocacy: `Ask teachers about movement opportunities, fidget tools, hands-on learning options, and flexible seating.`,
        redFlags: "Constant restlessness even with movement opportunities, or becoming disruptive when forced to sit still."
      },
      auditory: {
        superpower: `${childName} has exceptional listening skills and learns beautifully through discussion, stories, and verbal explanation.`,
        whyStruggles: "Much of school learning relies on reading silently and working independently, which removes their greatest strength.",
        whatThisMeans: `${childName} shares this learning style with successful teachers, counselors, and leaders. They're natural communicators.`,
        homeStrategies: [
          "* Read homework instructions aloud",
          "* Encourage talking through problems",
          "* Use audiobooks and educational podcasts",
          "* Create songs or rhymes for memorizing facts"
        ],
        schoolAdvocacy: `Request that teachers provide verbal instructions along with written ones and allow oral testing options.`,
        redFlags: "Significant difficulty with reading comprehension despite strong listening skills."
      },
      text: {
        superpower: `${childName} excels at processing written information and thinking analytically.`,
        whyStruggles: "Many classroom activities involve group work and quick verbal responses, which doesn't allow them to use their analytical strengths.",
        whatThisMeans: `${childName} has the learning style of successful researchers, writers, and scholars. They thrive when given time to read and organize their thoughts.`,
        homeStrategies: [
          "* Provide written summaries of verbal instructions",
          "* Allow extra time for processing questions",
          "* Encourage note-taking and written planning",
          "* Create quiet, organized study spaces"
        ],
        schoolAdvocacy: `Ask teachers to provide written instructions and allow extra processing time.`,
        redFlags: "Extreme anxiety about verbal participation despite strong written work."
      }
    };
  
    // Type-safe way to access profiles
    const validDomains: LearningDomain[] = ['visual', 'kinesthetic', 'auditory', 'text'];
    const safeDomain = validDomains.includes(domain as LearningDomain) 
      ? (domain as LearningDomain) 
      : 'visual';
    
    return profiles[safeDomain];
  };

  const profile = getProfileContent(data.profile?.primaryDomain || 'visual', data.childName || data.formData?.childName);
  const childName = data.childName || data.formData?.childName;
  const percentile = data.profile?.percentile || 70;

  // ===== COVER PAGE =====
  // Header banner
  doc.setFillColor(teal[0], teal[1], teal[2])
  doc.rect(0, 0, pageWidth, 50, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text(`${childName}'s Learning Journey`, pageWidth/2, 20, { align: 'center' })
  
  doc.setFontSize(16)
  doc.text('Personalized Learning Guide', pageWidth/2, 32, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text('Vedyx Learning Assessment Center', pageWidth/2, 42, { align: 'center' })

  yPos = 70

  // Hero insight box
  doc.setTextColor(0, 0, 0)
  addInsightBox(
    `THE DISCOVERY\n\n${profile.superpower}\n\nThis isn't just a "learning style" - it's ${childName}'s natural intelligence at work.`,
    lightTeal,
    teal
  )

  // Why school feels hard
  addColoredHeader('Why Traditional School Feels Hard', coral)
  addInsightBox(profile.whyStruggles, lightCoral, coral)

  // What this means for your child
  addColoredHeader('What This Means for Your Family', teal)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const meaningLines = doc.splitTextToSize(profile.whatThisMeans, pageWidth - 2 * margin)
  doc.text(meaningLines, margin, yPos)
  yPos += meaningLines.length * 6 + 15

  checkPageBreak()

  // ===== STRATEGIES PAGE =====
  addColoredHeader('Strategies You Can Start Using Today', teal)

  profile.homeStrategies.forEach((strategy: string) => {
    // If your strategies have emojis or prefixes, strip them here
    const parts = strategy.split(' ')
    const content = parts.slice(1).join(' ') // remove emoji/prefix if needed
  
    // Use a bullet character instead of repeating "At Home"
    addActionableStrategy('•', content, '')  
  
    checkPageBreak(25)
  })

  checkPageBreak(40)

  // School advocacy section
  addColoredHeader('Supporting ' + childName + ' at School', coral)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const schoolLines = doc.splitTextToSize(profile.schoolAdvocacy, pageWidth - 2 * margin)
  doc.text(schoolLines, margin, yPos)
  yPos += schoolLines.length * 6 + 15

  {/*// Teacher conversation starter box
  addInsightBox(
    `TEACHER CONVERSATION STARTER\n\n"Hi [Teacher's name], we recently had ${childName} assessed and learned they're a ${(data.profile?.primaryDomain || 'visual').toLowerCase()} learner. Could we chat about some simple accommodations that might help them succeed in your classroom?"`,
    [245, 245, 255], // Very light blue
    [147, 197, 253]  // Light blue border
  )*/}

  checkPageBreak(60)

  // Warning signs section
  addColoredHeader('When to Seek Additional Support', [251, 146, 60]) // Orange

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const warningText = `Consider consulting with your school's learning specialist or an educational psychologist if:\n\n${profile.redFlags}\n\nRemember: This assessment identifies learning preferences, not learning disabilities. Professional evaluation may be needed for comprehensive support.`
  const warningLines = doc.splitTextToSize(warningText, pageWidth - 2 * margin)
  doc.text(warningLines, margin, yPos)
  yPos += warningLines.length * 6 + 20

  // Success timeline
  checkPageBreak(40)
  addColoredHeader('Your 30-Day Success Timeline', teal)

  const timeline = [
    "Week 1: Try 1-2 strategies that feel most natural for your family",
    "Week 2: Share insights with " + childName + "'s teachers using our conversation guide", 
    "Week 3: Look for small improvements in homework time or attitude toward learning",
    "Week 4: Adjust strategies based on what's working and celebrate progress"
  ]

  timeline.forEach((item, index) => {
    addActionableStrategy(`Week ${index + 1}`, item, "*")
    checkPageBreak(20)
  })

  // Bottom encouragement
  checkPageBreak(30)
  addInsightBox(
    `REMEMBER\n\n${childName} is already smart, creative, and capable. These strategies simply help them show their brilliance in ways that traditional schooling recognizes.\n\nYou're not fixing anything - you're unlocking potential that was always there.`,
    [252, 247, 255], // Very light purple
    [168, 85, 247]   // Purple border
  )

  // Footer
  doc.setFontSize(10)
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2])
  doc.text('Report created by Vedyx Learning Assessment Center', pageWidth/2, pageHeight - 15, { align: 'center' })
  doc.text(`For ${childName} • Generated on ${new Date().toLocaleDateString()}`, pageWidth/2, pageHeight - 8, { align: 'center' })
  
  return new Uint8Array(doc.output('arraybuffer'))
}

// UPDATED EMAIL BODY (Remove clinical psychology references)
export function generateEmailBody(childName: string, reportData: ReportData): string {
  const profile = reportData.profile || {};
  const percentiles = reportData.percentiles || {};
  const primaryDomain = profile.primaryDomain || 'balanced';
  const percentile = profile.percentile || 70;
  
  // Generate personalized insights based on learning profile
  const getProfileInsights = (domain: string): ProfileInsights => {
    const insights: InsightsMap = {
      visual: {
        profileType: "Visual-Spatial Learner",
        translation: "Excels when information is presented through pictures, diagrams, and visual organization",
        example: "understand directions better when you show them charts or draw simple diagrams",
        mismatch: "reading dense text and listening to long verbal explanations",
        strengths: "visual patterns, spatial relationships, and graphic organization",
        quickAction: `Create a simple visual checklist for ${childName}'s homework routine with checkboxes they can mark off`
      },
      kinesthetic: {
        profileType: "Hands-On Learner",
        translation: "Learns best through physical interaction, movement, and hands-on experiences", 
        example: "seem to understand concepts better when they can touch, build, or act things out",
        mismatch: "sitting still for long periods and learning through worksheets alone",
        strengths: "experiential learning, physical problem-solving, and learning through movement",
        quickAction: `Let ${childName} stand, pace, or use a fidget tool during homework time — movement actually helps them focus`
      },
      auditory: {
        profileType: "Auditory-Linguistic Learner",
        translation: "Excels when information is presented through discussion, storytelling, and verbal explanation",
        example: "remember stories and instructions better when you talk through them together",
        mismatch: "reading silently and processing visual information without verbal context",
        strengths: "verbal processing, listening comprehension, and learning through discussion",
        quickAction: `Read homework instructions aloud and encourage ${childName} to explain their thinking verbally`
      },
      text: {
        profileType: "Analytical-Sequential Learner", 
        translation: "Thrives with structured, written information and learns best through reading and independent analysis",
        example: "prefer to read instructions rather than have them explained, and work through problems step-by-step",
        mismatch: "group activities and verbal instructions without written backup",
        strengths: "independent analysis, written processing, and logical sequencing",
        quickAction: `Provide written summaries of verbal instructions and create a quiet, organized study space for ${childName}`
      }
    };
  
    // Type-safe way to access insights (same pattern as getProfileContent)
    const validDomains: LearningDomain[] = ['visual', 'kinesthetic', 'auditory', 'text'];
    const safeDomain = validDomains.includes(domain as LearningDomain) 
      ? (domain as LearningDomain) 
      : 'visual';
    
    return insights[safeDomain];
  };
  
  const insights = getProfileInsights(primaryDomain);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.7; 
          color: #1e293b; 
          margin: 0; 
          padding: 0;
          background: #f6f6f6;
          font-size: 16px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
        }
        .header { 
          background: #3BB9B0;
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { 
          font-family: 'Montserrat', sans-serif;
          margin: 0; 
          font-size: 24px; 
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .content { 
          padding: 40px 30px;
          font-size: 16px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .hook {
          margin: 25px 0;
          font-size: 16px;
        }
        .profile-section {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 25px;
          margin: 30px 0;
          text-align: center;
        }
        .profile-section h3 {
          font-family: 'Montserrat', sans-serif;
          color: #0f172a;
          margin-top: 0;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .profile-translation {
          font-size: 16px;
          margin-bottom: 15px;
        }
        .profile-example {
          font-style: italic;
          color: #3730a3;
          background: #eef2ff;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
          font-size: 15px;
        }
        .struggle-section {
          background: #fefbf3;
          border-left: 4px solid #f59e0b;
          padding: 25px;
          margin: 30px 0;
          border-radius: 0 8px 8px 0;
        }
        .struggle-section h4 {
          font-family: 'Montserrat', sans-serif;
          color: #92400e;
          margin-top: 0;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .superpower-section {
          background: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 25px;
          margin: 30px 0;
          border-radius: 0 8px 8px 0;
        }
        .superpower-section h4 {
          font-family: 'Montserrat', sans-serif;
          color: #166534;
          margin-top: 0;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .quick-win {
          background: #faf5ff;
          border: 1px solid #a855f7;
          border-radius: 10px;
          padding: 25px;
          margin: 30px 0;
        }
        .quick-win h4 {
          font-family: 'Montserrat', sans-serif;
          color: #7c2d12;
          margin-top: 0;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        .pdf-reminder {
          background: #f0fdf4;
          border: 1px solid #22c55e;
          border-radius: 10px;
          padding: 25px;
          margin: 35px 0;
          text-align: center;
        }
        .pdf-reminder h3 {
          font-family: 'Montserrat', sans-serif;
          color: #166534;
          margin-top: 0;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
        }
        .cta-section {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 35px 30px;
          text-align: center;
          margin: 35px 0;
          border-radius: 10px;
        }
        .cta-section h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
          margin-top: 0;
        }
        .cta-button {
          display: inline-block;
          background: #3BB9B0;
          color: white;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 17px;
          margin: 25px 0 15px 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(59, 185, 176, 0.3);
        }
        .cta-button:hover {
          background: #339B94;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 185, 176, 0.4);
        }
        .offer-block {
          background: #FFE9D6;
          border: 1px solid #FF7A59;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        .offer-block p {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          font-size: 15px;
        }
        .footer {
          background: #f6f6f6;
          padding: 30px;
          color: #64748b;
          font-size: 14px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer-logo {
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
        }
        h4 {
          margin-bottom: 12px;
        }
        p {
          margin-bottom: 16px;
        }
        ul {
          padding-left: 0;
          margin: 18px 0;
          list-style: none;
        }
        li {
          margin-bottom: 8px;
          font-size: 15px;
          padding-left: 20px;
          position: relative;
        }
        li:before {
          content: "✅";
          position: absolute;
          left: 0;
        }
        .results-list li:before {
          content: "📈";
        }
        .section-break {
          border-top: 1px solid #e2e8f0;
          margin: 35px 0;
        }
        @media (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
          .header {
            padding: 25px 20px;
          }
          .header h1 {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Personalised Learning Report Is Ready</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            <p>Hi there,</p>
          </div>
          
          <div class="hook">
            <p>Remember when you clicked our assessment wondering: <em>"Why does my smart child struggle in school?"</em></p>
            <p>We've found the answer for ${childName}, and it's actually <strong>great news</strong>.</p>
          </div>
          
          <div class="profile-section">
            <h3>🧠 ${childName} is a ${insights.profileType}</h3>
            <div class="profile-translation">
              <p><strong>Translation:</strong> ${insights.translation}</p>
            </div>
            <div class="profile-example">
              👉 Have you noticed ${childName} ${insights.example}?
            </div>
          </div>
          
          <div class="struggle-section">
            <h4>📚 Why School Feels Hard for ${childName}</h4>
            <p>Many lessons rely on ${insights.mismatch}, which doesn't align with how ${childName}'s brain processes information best.</p>
            <p><strong>💡 Your child isn't broken. The method just doesn't match their brain.</strong></p>
          </div>
          
          <div class="superpower-section">
            <h4>⭐ ${childName}'s Learning Superpower</h4>
            <p>${childName} shows strong ${insights.strengths} ${percentile >= 70 ? `(${percentile}th percentile)` : ''}. This means they thrive when learning through ${primaryDomain}-based approaches.</p>
          </div>
          
          <div class="quick-win">
            <h4>🚀 One Thing You Can Try Today</h4>
            <p><strong>Try this tonight:</strong> ${insights.quickAction}</p>
            <p>Many parents see improvements within days of making this simple shift!</p>
          </div>
          
          <div class="section-break"></div>
          
          <div style="text-align: left; margin: 16px 0;">
            <h3>📄 Your Complete Learning Guide Is Attached</h3>
            <p>Inside, you'll find:</p>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 6px;">✅ Specific homework strategies</li>
              <li style="margin-bottom: 6px;">✅ Conversation guide for teachers</li>
              <li style="margin-bottom: 6px;">✅ Red flags + when to seek extra support</li>
              <li style="margin-bottom: 6px;">✅ Long-term success plan based on ${childName}'s strengths</li>
            </ul>
          </div>
          
          <div style="background-color:#FFF8F3; border-radius:12px; padding:20px; margin:24px 0; text-align:left;">
            <h3 style="margin-top:0;">🎮 The Next Step: Learning That Fits ${childName}</h3>
            
            <p>${childName} would thrive with approaches built around their ${primaryDomain} learning strengths.</p>
            
            <p>That’s why we created <strong>Vedyx Leap</strong> - a literacy program designed specifically for learners like ${childName}, turning learning struggles into successes.</p>
            
            <p><strong>What families are seeing:</strong></p>
            <ul style="list-style:none; padding:0; margin:0;">
              <li style="margin-bottom:6px;">✅ 87% of kids show more reading engagement in 2 weeks</li>
              <li style="margin-bottom:6px;">✅ Average +1.2 grade levels in just 3 months</li>
              <li style="margin-bottom:6px;">✅ Parents say kids actually <em>ask</em> to practice reading</li>
            </ul>
            
            <div style="text-align:center; margin:20px 0;">
              <a href="https://vedyx.ai?utm_source=assessment&utm_medium=email&utm_campaign=meta&profile=${primaryDomain}&child=${encodeURIComponent(childName)}"
                style="display:inline-block; background-color:#3BB9B0; color:#fff; font-weight:bold; padding:14px 28px; border-radius:8px; text-decoration:none;">
                See How Vedyx Leap Works for ${insights.profileType}s
              </a>
            </div>
            
            <div style="background-color:#FFE9D6; border-radius:8px; padding:12px; text-align:center; font-size:14px;">
              🎁 Early access offer for assessment participants
            </div>
          </div>

          
          <div class="section-break"></div>
          
          <p>Questions about ${childName}'s report? Just hit reply - I personally read every email.</p>
          
          <p>Here to support ${childName}'s learning journey,</p>
          <p><strong>Sarah Chen</strong><br>
          <em>Child Learning Specialist</em><br>
          <em>Vedyx Learning Team</em></p>
          
          <p style="font-style: italic; color: #64748b; margin-top: 25px; font-size: 15px;">
            <strong>P.S.</strong> Over the next few days, I'll share success stories and simple strategies for ${insights.profileType.toLowerCase()}s like ${childName}. Keep an eye on your inbox!
          </p>
        </div>
        
        <div class="footer">
          <div class="footer-logo">Vedyx Learning Assessment Center</div>
          <p>Helping neurodivergent kids thrive since 2023</p>
          <p style="margin-top: 20px;">
            <a href="#" style="color: #64748b; text-decoration: none;">Unsubscribe</a> | 
            <a href="#" style="color: #64748b; text-decoration: none;">Update Preferences</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}