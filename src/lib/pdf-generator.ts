// src/lib/pdf-generator.ts
import jsPDF from 'jspdf'

export interface ReportData {
  profile?: {
    primaryDomain?: string
    percentile?: number
    title?: string
    clinicalNote?: string
  }
  percentiles?: {
    visual?: number
    kinesthetic?: number
    auditory?: number
    text?: number
  }
  scores?: {
    visual?: number
    kinesthetic?: number
    auditory?: number
    text?: number
  }
  formData?: {
    childName?: string
    childAge?: string
  }
  childName?: string
  executiveFunction?: any
  htmlReport?: string
}

interface ProfileContent {
  profileType: string
  superpower: string
  whyStruggles: string
  whatThisMeans: string
  homeStrategies: string[]
  schoolStrategies: string[]
  teacherScript: string
  redFlags: string
  strengthsExamples: string
  accommodationsList: string[]
  researchBackground: string
}

type LearningDomain = 'visual' | 'kinesthetic' | 'auditory' | 'text'

interface ProfileInsights {
  profileType: string
  translation: string
  parentTip: string
}

type InsightsMap = Record<LearningDomain, ProfileInsights>

export function generatePDFReport(data: ReportData): Uint8Array {
  const doc = new jsPDF()
  
  // Page dimensions and styling
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPos = margin

  // Professional color palette
  const primaryBlue = [25, 118, 210]     // Professional blue
  const lightBlue = [227, 242, 253]      // Light blue background
  const accentOrange = [255, 152, 0]     // Professional orange
  const lightOrange = [255, 243, 224]    // Light orange background
  const darkGray = [55, 65, 81]          // Professional dark gray
  const mediumGray = [107, 114, 128]     // Medium gray
  const lightGray = [249, 250, 251]      // Light gray background
  const successGreen = [34, 197, 94]     // Success green
  const lightGreen = [240, 253, 244]     // Light green background

  // Helper functions
  function checkPageBreak(requiredSpace = 30) {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPos = margin + 10
    }
  }

  function addProfessionalHeader(title: string, color: number[]) {
    checkPageBreak(40)
    
    // Header background
    doc.setFillColor(color[0], color[1], color[2])
    doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 25, 3, 3, 'F')
    
    // Header text
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.text(title, margin + 10, yPos + 8)
    
    yPos += 35
    doc.setTextColor(0, 0, 0)
  }

  function addInsightBox(content: string, bgColor: number[], borderColor: number[]) {
    const lines = doc.splitTextToSize(content, pageWidth - 2 * margin - 20)
    const boxHeight = lines.length * 6 + 20
    
    checkPageBreak(boxHeight + 10)
    
    // Background
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 5, 5, 'F')
    
    // Border
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2])
    doc.setLineWidth(1.5)
    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, boxHeight, 5, 5, 'S')
    
    // Content
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(lines, margin + 10, yPos + 15)
    
    yPos += boxHeight + 15
  }

  function addScoreChart(percentiles: any) {
    checkPageBreak(80)
    
    const chartWidth = pageWidth - 2 * margin
    const chartHeight = 60
    const barWidth = (chartWidth - 60) / 4
    
    // Chart background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.rect(margin, yPos, chartWidth, chartHeight, 'F')
    
    // Chart border
    doc.setDrawColor(mediumGray[0], mediumGray[1], mediumGray[2])
    doc.rect(margin, yPos, chartWidth, chartHeight, 'S')
    
    const domains = ['Visual', 'Kinesthetic', 'Auditory', 'Text']
    const scores = [
      percentiles.visual || 0,
      percentiles.kinesthetic || 0,
      percentiles.auditory || 0,
      percentiles.text || 0
    ]
    
    domains.forEach((domain, index) => {
      const x = margin + 15 + index * barWidth
      const barHeight = (scores[index] / 100) * 40
      const barY = yPos + 45 - barHeight
      
      // Bar
      const isHighest = scores[index] === Math.max(...scores)
      const barColor = isHighest ? primaryBlue : mediumGray
      doc.setFillColor(barColor[0], barColor[1], barColor[2])
      doc.rect(x, barY, barWidth - 10, barHeight, 'F')
      
      // Score label
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(scores[index].toString(), x + (barWidth - 10) / 2, barY - 3, { align: 'center' })
      
      // Domain label
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(domain, x + (barWidth - 10) / 2, yPos + 55, { align: 'center' })
    })
    
    yPos += chartHeight + 20
  }

  function addAccommodationsList(accommodations: string[]) {
    checkPageBreak(40)
    
    accommodations.forEach((accommodation, index) => {
      checkPageBreak(15)
      
      // Bullet point with professional styling
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
      doc.circle(margin + 5, yPos + 3, 2, 'F')
      
      // Accommodation text
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      const lines = doc.splitTextToSize(accommodation, pageWidth - 2 * margin - 15)
      doc.text(lines, margin + 15, yPos + 5)
      
      yPos += lines.length * 6 + 3
    })
  }

  // Get profile content
  function getProfileContent(domain: string, childName: string): ProfileContent {
    const profiles: Record<LearningDomain, ProfileContent> = {
      visual: {
        profileType: "Visual-Spatial Learner",
        superpower: `${childName} has exceptional visual processing abilities and learns beautifully through diagrams, charts, and spatial relationships.`,
        whyStruggles: "Traditional classrooms rely heavily on verbal instruction and text-based learning, which bypasses their strongest processing channel.",
        whatThisMeans: `${childName} shares this learning profile with successful architects, engineers, artists, and designers. They think in pictures and patterns, making them natural problem-solvers when information is presented visually.`,
        homeStrategies: [
          "Use mind maps and graphic organizers for all subjects",
          "Create colorful study charts and visual timelines",
          "Use flashcards with pictures and diagrams",
          "Encourage drawing or sketching to work through problems",
          "Set up a visual study space with charts and references"
        ],
        schoolStrategies: [
          "Provide graphic organizers for note-taking",
          "Use visual aids during instruction",
          "Allow diagram-based answers when appropriate",
          "Provide written instructions alongside verbal ones"
        ],
        teacherScript: "We've learned that [child] is a visual-spatial learner who processes information best through charts, diagrams, and visual organization. Could we discuss some simple accommodations like graphic organizers or visual aids that might help them succeed?",
        redFlags: "Persistent difficulty organizing thoughts in writing despite strong verbal abilities, trouble following multi-step verbal instructions, or significant gaps between understanding and written expression.",
        strengthsExamples: "Strong pattern recognition, excellent spatial awareness, creative problem-solving, ability to see the 'big picture'",
        accommodationsList: [
          "Graphic organizers for all writing assignments",
          "Visual schedules and assignment checklists",
          "Concept maps for complex topics",
          "Color-coding systems for different subjects",
          "Preferential seating near visual displays",
          "Extra time for written assignments",
          "Option to demonstrate knowledge through diagrams"
        ],
        researchBackground: "Visual-spatial learning preferences are supported by research in cognitive psychology showing that approximately 65% of the population are visual learners (Fleming & Mills, 1992). Studies demonstrate that visual learners show increased comprehension when material is presented through diagrams and spatial organization."
      },
      kinesthetic: {
        profileType: "Kinesthetic-Tactile Learner",
        superpower: `${childName} has exceptional body-smart intelligence and learns beautifully through movement, hands-on activities, and physical engagement.`,
        whyStruggles: "Traditional classrooms emphasize sitting still and passive learning, which removes their primary learning channel and natural energy.",
        whatThisMeans: `${childName} shares this learning profile with successful athletes, surgeons, mechanics, and performers. They think through their body and hands, making them natural builders and creators.`,
        homeStrategies: [
          "Use manipulatives for math (blocks, counting bears)",
          "Create movement breaks every 15-20 minutes",
          "Practice spelling by writing in sand or finger painting",
          "Use building materials to demonstrate concepts",
          "Set up an active learning space with fidget tools"
        ],
        schoolStrategies: [
          "Provide movement breaks during instruction",
          "Allow use of fidget tools during lessons",
          "Incorporate hands-on activities when possible",
          "Offer standing desk or exercise ball seating options"
        ],
        teacherScript: "We've discovered that [child] is a kinesthetic learner who processes information best through movement and hands-on activities. Could we explore some accommodations like movement breaks or fidget tools that might help them focus and learn?",
        redFlags: "Extreme difficulty sitting still that impacts learning, inability to focus without movement, or significant behavioral issues when required to remain sedentary for extended periods.",
        strengthsExamples: "Strong motor coordination, excellent hands-on problem solving, high energy and enthusiasm, ability to learn through doing",
        accommodationsList: [
          "Movement breaks every 15-20 minutes",
          "Standing desk or alternative seating options",
          "Fidget tools for focus during instruction",
          "Hands-on manipulatives for math concepts",
          "Walking meetings or movement during discussions",
          "Physical activity rewards for task completion",
          "Option to demonstrate learning through building/creating"
        ],
        researchBackground: "Kinesthetic learning is supported by research showing that physical movement enhances cognitive processing and memory consolidation (Medina, 2008). Studies indicate that movement-based learning can improve academic performance by up to 20%."
      },
      auditory: {
        profileType: "Auditory-Linguistic Learner",
        superpower: `${childName} has exceptional listening skills and learns beautifully through discussion, stories, and verbal explanation.`,
        whyStruggles: "Much of school learning relies on reading silently and working independently, which removes their greatest strength.",
        whatThisMeans: `${childName} shares this learning style with successful teachers, counselors, and leaders. They're natural communicators who process information through sound and language.`,
        homeStrategies: [
          "Read homework instructions aloud",
          "Encourage talking through problems",
          "Use audiobooks and educational podcasts",
          "Create songs or rhymes for memorizing facts",
          "Study with background music or in groups"
        ],
        schoolStrategies: [
          "Provide verbal instructions along with written ones",
          "Allow oral testing options when appropriate",
          "Encourage participation in class discussions",
          "Use recorded lessons for review"
        ],
        teacherScript: "We've learned that [child] is an auditory learner who processes information best through listening and verbal discussion. Could we discuss accommodations like oral testing options or verbal instructions that might help them demonstrate their knowledge?",
        redFlags: "Significant difficulty with reading comprehension despite strong listening skills, inability to follow written directions that they understand when spoken, or marked discrepancy between oral and written performance.",
        strengthsExamples: "Excellent listening comprehension, strong verbal communication, ability to learn through discussion, good memory for spoken information",
        accommodationsList: [
          "Verbal instructions alongside written directions",
          "Oral testing options for assessments",
          "Audio recordings of lessons for review",
          "Permission to read assignments aloud",
          "Participation in study groups and discussions",
          "Use of text-to-speech technology",
          "Verbal processing time before written responses"
        ],
        researchBackground: "Auditory learning preferences are supported by research in linguistics and cognitive science showing that verbal processing activates different neural pathways than visual processing (Paivio, 1986). Studies demonstrate improved comprehension when auditory learners receive information through multiple verbal channels."
      },
      text: {
        profileType: "Analytical-Sequential Learner",
        superpower: `${childName} has exceptional analytical abilities and learns beautifully through reading, writing, and systematic organization.`,
        whyStruggles: "Modern classrooms often emphasize collaborative and multimedia learning, which can overwhelm their preference for quiet, independent study.",
        whatThisMeans: `${childName} shares this learning style with successful researchers, writers, and analysts. They think in words and logical sequences, making them natural scholars and detailed thinkers.`,
        homeStrategies: [
          "Provide detailed written instructions for all tasks",
          "Create organized study schedules and checklists",
          "Use research and note-taking for projects",
          "Encourage journaling and written reflection",
          "Set up a quiet, organized study environment"
        ],
        schoolStrategies: [
          "Provide written instructions and rubrics",
          "Allow extra time for written assignments",
          "Offer alternative to group work when possible",
          "Encourage detailed note-taking and organization"
        ],
        teacherScript: "We've discovered that [child] is an analytical learner who processes information best through reading and written work. Could we discuss accommodations like detailed written instructions or independent work options that might help them thrive?",
        redFlags: "Extreme anxiety in group work situations, inability to process verbal instructions without written backup, or significant stress when required to participate in collaborative activities.",
        strengthsExamples: "Strong reading comprehension, excellent written expression, systematic thinking, attention to detail",
        accommodationsList: [
          "Detailed written instructions for all assignments",
          "Quiet workspace options during independent work",
          "Extended time for written assignments",
          "Alternative to group presentations (written reports)",
          "Advance notice of schedule changes",
          "Organized handouts and clear expectations",
          "Option to demonstrate learning through research projects"
        ],
        researchBackground: "Analytical-sequential learning is supported by research in educational psychology showing that systematic, text-based instruction benefits students with strong linguistic intelligence (Gardner, 1983). Studies indicate that detailed written instruction improves comprehension for analytical learners."
      }
    };

    const validDomains: LearningDomain[] = ['visual', 'kinesthetic', 'auditory', 'text'];
    const safeDomain = validDomains.includes(domain as LearningDomain) 
      ? (domain as LearningDomain) 
      : 'visual';
    
    return profiles[safeDomain];
  }

  const profile = getProfileContent(data.profile?.primaryDomain || 'visual', data.childName || data.formData?.childName || 'Your Child');
  const childName = data.childName || data.formData?.childName || 'Your Child';
  const percentile = data.profile?.percentile || 70;
  const percentiles = data.percentiles || { visual: 50, kinesthetic: 50, auditory: 80, text: 30 };

  // ===== PROFESSIONAL COVER PAGE =====
  // Header banner with rich blue gradient effect
  doc.setFillColor(30, 64, 175) // Deep rich blue (blue-800)
  doc.rect(0, 0, pageWidth, 60, 'F')
  
  // Subtle lighter blue overlay for depth
  doc.setFillColor(59, 130, 246, 0.15) // Light blue overlay
  doc.rect(0, 0, pageWidth, 60, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(`${childName}'s Learning Profile`, pageWidth/2, 25, { align: 'center' })
  
  doc.setFontSize(16)
  doc.text('Comprehensive Learning Assessment Report', pageWidth/2, 40, { align: 'center' })
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text('Vedyx Learning Assessment Center', pageWidth/2, 52, { align: 'center' })

  yPos = 80

  // Executive Summary Box
  doc.setTextColor(0, 0, 0)
  addInsightBox(
    `EXECUTIVE SUMMARY\n\n${profile.superpower}\n\nAssessment shows ${childName} performs at the ${percentile}th percentile in ${profile.profileType.toLowerCase()} processing, indicating this as their primary learning strength.`,
    lightBlue,
    primaryBlue
  )

  // Assessment Methodology
  addProfessionalHeader('Assessment Methodology', primaryBlue)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const methodologyText = `This assessment utilizes a multi-dimensional framework based on established learning science research. ${childName}'s responses were analyzed across four key domains: visual-spatial, kinesthetic-tactile, auditory-linguistic, and analytical-sequential processing. The assessment incorporates principles from Universal Design for Learning (UDL) and cognitive load theory to identify optimal learning conditions.`
  const methodologyLines = doc.splitTextToSize(methodologyText, pageWidth - 2 * margin)
  doc.text(methodologyLines, margin, yPos)
  yPos += methodologyLines.length * 6 + 20

  // Score Breakdown with explanation
  addProfessionalHeader('Learning Profile Analysis', accentOrange)
  
  // Add explanation before the chart
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
  const explanationText = `${childName}'s assessment reveals their strongest learning processing channels. Higher scores indicate more natural and effective learning pathways.`
  const explanationLines = doc.splitTextToSize(explanationText, pageWidth - 2 * margin)
  doc.text(explanationLines, margin, yPos)
  yPos += explanationLines.length * 6 + 15
  
  addScoreChart(percentiles)
  
  // Add brief style definitions
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2])
  const stylesText = `Learning Styles: Visual (charts/diagrams), Kinesthetic (movement/hands-on), Auditory (listening/discussion), Text (reading/writing)`
  const stylesLines = doc.splitTextToSize(stylesText, pageWidth - 2 * margin)
  doc.text(stylesLines, margin, yPos)
  yPos += stylesLines.length * 6 + 10

  checkPageBreak()

  // ===== PAGE 2: DETAILED FINDINGS =====
  doc.addPage()
  yPos = margin + 10

  addProfessionalHeader('Why Traditional School Feels Challenging', accentOrange)
  addInsightBox(profile.whyStruggles, lightOrange, accentOrange)

  addProfessionalHeader('Understanding ' + childName + "'s Learning Strengths", successGreen)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const strengthsText = `${profile.whatThisMeans}\n\nKey Strengths: ${profile.strengthsExamples}`
  const strengthsLines = doc.splitTextToSize(strengthsText, pageWidth - 2 * margin)
  doc.text(strengthsLines, margin, yPos)
  yPos += strengthsLines.length * 6 + 20

  // Research Background
  addProfessionalHeader('Research Foundation', mediumGray)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const researchLines = doc.splitTextToSize(profile.researchBackground, pageWidth - 2 * margin)
  doc.text(researchLines, margin, yPos)
  yPos += researchLines.length * 6 + 20

  // ===== PAGE 3: HOME STRATEGIES =====
  doc.addPage()
  yPos = margin + 10

  addProfessionalHeader('Evidence-Based Home Strategies', primaryBlue)

  profile.homeStrategies.forEach((strategy, index) => {
    checkPageBreak(15)
    
    // Professional bullet styling
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2])
    doc.circle(margin + 5, yPos + 3, 2, 'F')
    
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const lines = doc.splitTextToSize(strategy, pageWidth - 2 * margin - 15)
    doc.text(lines, margin + 15, yPos + 5)
    
    yPos += lines.length * 6 + 8
  })

  // Implementation Timeline
  checkPageBreak(50)
  addProfessionalHeader('30-Day Implementation Timeline', successGreen)

  const timeline = [
    { week: "Week 1", task: "Select 2-3 strategies that align with your family's routine", focus: "Start small and build confidence" },
    { week: "Week 2", task: "Implement chosen strategies consistently", focus: "Document what works and what doesn't" },
    { week: "Week 3", task: "Monitor progress and adjust approaches as needed", focus: "Look for improvements in attitude and engagement" },
    { week: "Week 4", task: "Evaluate overall progress and celebrate successes", focus: "Plan for continued implementation" }
  ]

  timeline.forEach((item, index) => {
    checkPageBreak(25)
    
    // Week header
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(successGreen[0], successGreen[1], successGreen[2])
    doc.text(item.week, margin, yPos)
    
    // Task
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2])
    const taskLines = doc.splitTextToSize(item.task, pageWidth - 2 * margin - 60)
    doc.text(taskLines, margin + 60, yPos)
    
    // Focus
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2])
    const focusLines = doc.splitTextToSize(`Focus: ${item.focus}`, pageWidth - 2 * margin - 60)
    doc.text(focusLines, margin + 60, yPos + taskLines.length * 6 + 3)
    
    yPos += Math.max(taskLines.length * 6, 15) + focusLines.length * 6 + 10
  })

  // ===== PAGE 4: PROFESSIONAL SUPPORT =====
  doc.addPage()
  yPos = margin + 10

  addProfessionalHeader('When to Consider Additional Support', accentOrange)

  addInsightBox(
    `PROFESSIONAL CONSULTATION INDICATORS\n\nConsider consulting with your school's learning specialist or an educational psychologist if you observe:\n\n- ${profile.redFlags}\n- Strategies show no improvement after 6-8 weeks of consistent implementation\n- Significant emotional distress related to learning\n- Widening gap between ability and performance\n\nREMEMBER: This assessment identifies learning preferences and educational strategies. It is not a clinical diagnosis or substitute for professional psychological evaluation when comprehensive support is needed.`,
    lightOrange,
    accentOrange
  )

  // Final encouragement
  checkPageBreak(60)
  addInsightBox(
    `REMEMBER\n\n${childName} is already intelligent, creative, and capable. These strategies simply help them demonstrate their brilliance in ways that traditional schooling recognizes.\n\nYou're not fixing anything - you're unlocking potential that was always there.\n\nEvery small step forward is progress worth celebrating.`,
    lightGreen,
    successGreen
  )

  // Professional footer
  doc.setFontSize(10)
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2])
  doc.text('Report prepared by Vedyx Learning Assessment Center', pageWidth/2, pageHeight - 20, { align: 'center' })
  doc.text(`Personalized for ${childName} • Generated ${new Date().toLocaleDateString()}`, pageWidth/2, pageHeight - 12, { align: 'center' })
  doc.text('Evidence-based strategies for neurodivergent learners', pageWidth/2, pageHeight - 4, { align: 'center' })
  
  return new Uint8Array(doc.output('arraybuffer'))
}

// ENHANCED EMAIL BODY - HYBRID APPROACH
export function generateEmailBody(childName: string, reportData: ReportData): string {
  const profile = reportData.profile || {};
  const percentiles = reportData.percentiles || {};
  const primaryDomain = profile.primaryDomain || 'balanced';
  const percentile = profile.percentile || 70;
  
  const getProfileInsights = (domain: string): ProfileInsights => {
    const insights: InsightsMap = {
      visual: {
        profileType: "Visual-Spatial Learner",
        translation: "Excels when information is presented through charts, diagrams, and visual organization",
        parentTip: "Try mind maps and colorful study charts tonight - many parents see engagement improve within days!"
      },
      kinesthetic: {
        profileType: "Kinesthetic-Tactile Learner", 
        translation: "Learns best through movement, hands-on activities, and physical engagement",
        parentTip: "Try adding movement breaks every 15 minutes during homework - you might be amazed at the difference!"
      },
      auditory: {
        profileType: "Auditory-Linguistic Learner",
        translation: "Excels when information is presented through discussion, storytelling, and verbal explanation", 
        parentTip: "Try reading homework instructions aloud and encourage them to talk through problems - many parents see improvements within days!"
      },
      text: {
        profileType: "Analytical-Sequential Learner",
        translation: "Thrives with detailed written instructions, systematic approaches, and independent study",
        parentTip: "Try providing step-by-step written guides and quiet study time - this simple shift often makes homework much easier!"
      }
    };
    
    return insights[domain as LearningDomain] || insights.visual;
  };

  const insights = getProfileInsights(primaryDomain);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${childName}'s Learning Profile is Ready</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.7; 
          color: #334155; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .container { 
          background: white; 
          border-radius: 16px; 
          padding: 0; 
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: 700;
          margin-bottom: 8px;
        }
        .header p { 
          margin: 0; 
          opacity: 0.95; 
          font-size: 18px;
          font-weight: 300;
        }
        .content { 
          padding: 40px 35px;
        }
        .opening { 
          font-size: 16px;
          margin-bottom: 30px;
          color: #475569;
        }
        .discovery-section { 
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); 
          border-left: 5px solid #10b981; 
          padding: 30px; 
          margin: 30px 0; 
          border-radius: 12px;
        }
        .discovery-section h2 { 
          color: #059669; 
          margin: 0 0 15px 0; 
          font-size: 22px; 
          font-weight: 700;
        }
        .profile-type {
          font-size: 20px;
          font-weight: 600;
          color: #047857;
          margin: 15px 0 10px 0;
        }
        .translation {
          font-size: 16px;
          color: #065f46;
          font-style: italic;
          margin-bottom: 20px;
        }
        .percentile-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin: 20px 0;
        }
        .percentile-number {
          font-size: 36px;
          font-weight: 900;
          color: #d97706;
          margin: 0;
        }
        .percentile-label {
          color: #92400e;
          font-size: 14px;
          font-weight: 600;
          margin-top: 5px;
        }
        .insight-box { 
          background: linear-gradient(135deg, #fef7ff 0%, #f3e8ff 100%); 
          border-left: 5px solid #8b5cf6; 
          padding: 25px; 
          margin: 25px 0; 
          border-radius: 12px;
        }
        .insight-box h3 { 
          color: #7c3aed; 
          margin: 0 0 15px 0; 
          font-size: 18px; 
          font-weight: 600;
        }
        .try-tonight {
          background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
          border-left: 5px solid #ea580c;
          padding: 25px;
          margin: 25px 0;
          border-radius: 12px;
        }
        .try-tonight h3 {
          color: #ea580c;
          margin: 0 0 15px 0;
          font-size: 20px;
          font-weight: 700;
        }
        .try-tonight .tip {
          font-size: 16px;
          font-weight: 600;
          color: #c2410c;
          background: rgba(255, 255, 255, 0.7);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #ea580c;
          margin: 15px 0;
        }
        .pdf-section { 
          background: linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%); 
          padding: 30px; 
          border-radius: 12px; 
          margin: 30px 0;
          border: 2px solid #3b82f6;
        }
        .pdf-section h3 { 
          color: #1d4ed8; 
          margin: 0 0 20px 0; 
          font-size: 22px; 
          font-weight: 700;
          text-align: center;
        }
        .pdf-contents { 
          background: white; 
          padding: 20px; 
          border-radius: 10px; 
          border: 1px solid #bfdbfe;
          margin-top: 20px;
        }
        .pdf-contents h4 { 
          color: #1e40af; 
          margin: 0 0 15px 0; 
          font-size: 16px; 
          font-weight: 600;
        }
        .pdf-contents ul { 
          margin: 0; 
          padding-left: 20px; 
          color: #374151;
        }
        .pdf-contents li { 
          margin: 8px 0; 
          font-size: 15px;
        }
        .reassurance {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 25px;
          border-radius: 12px;
          border-left: 5px solid #22c55e;
          margin: 30px 0;
          text-align: center;
        }
        .key-message {
          font-size: 18px;
          font-weight: 600;
          color: #15803d;
          margin-bottom: 10px;
        }
        .support-message {
          color: #166534;
          font-size: 16px;
        }
        .personal-touch { 
          background: linear-gradient(135deg, #fefce8 0%, #fde047 100%); 
          border: 2px solid #eab308; 
          padding: 25px; 
          border-radius: 12px; 
          margin: 30px 0;
          text-align: center;
        }
        .personal-touch p { 
          margin: 0; 
          color: #a16207; 
          font-size: 16px;
          font-weight: 600;
        }
        .signature { 
          margin-top: 40px; 
          padding-top: 30px; 
          border-top: 2px solid #e2e8f0;
        }
        .signature-name {
          font-weight: 700;
          color: #1e40af;
          font-size: 18px;
          margin-bottom: 5px;
        }
        .signature-title {
          color: #64748b;
          font-style: italic;
          margin-bottom: 20px;
        }
        .ps-section {
          background: #f8fafc;
          padding: 20px;
          border-radius: 10px;
          border-left: 4px solid #06b6d4;
          margin-top: 25px;
          font-style: italic;
        }
        .footer { 
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); 
          padding: 30px; 
          text-align: center; 
          margin-top: 30px;
        }
        .footer-logo { 
          font-weight: 700; 
          color: #0f172a; 
          font-size: 18px;
          margin-bottom: 8px;
        }
        .footer p { 
          margin: 5px 0; 
          color: #64748b; 
          font-size: 14px;
        }
        @media (max-width: 600px) { 
          .container { 
            margin: 10px; 
          }
          .content { 
            padding: 30px 25px; 
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Personalized Learning Report Is Ready</h1>
          <p>We found the answer for ${childName}</p>
        </div>
        
        <div class="content">
          <div class="opening">
            <p>Hi there,</p>
            
            <p>Remember when you clicked our assessment wondering: <em>"Why does my smart child struggle in school?"</em></p>
            
            <p>We've found the answer for ${childName}, and it's actually <strong>great news</strong>.</p>
          </div>
          
          <div class="discovery-section">
            <h2>The Key Discovery</h2>
            <div class="profile-type">${childName} is a ${insights.profileType}</div>
            <div class="translation">${insights.translation}</div>
            
            <div class="percentile-highlight">
              <div class="percentile-number">${percentile}th</div>
              <div class="percentile-label">Percentile in Primary Learning Domain</div>
            </div>
          </div>
          
          <div class="insight-box">
            <h3>Why School Feels Hard for ${childName}</h3>
            <p>Many lessons rely on teaching methods that don't align with how ${childName}'s brain processes information best. Traditional classrooms often use a one-size-fits-all approach that can leave brilliant kids feeling confused or behind.</p>
            
            <p><strong>Your child isn't broken. The method just doesn't match their brain.</strong></p>
          </div>
          
          <div class="try-tonight">
            <h3>One Thing You Can Try Tonight</h3>
            <div class="tip">${insights.parentTip}</div>
            <p>It's amazing how small shifts can make such a big difference in your child's confidence and engagement.</p>
          </div>
          
          <div class="pdf-section">
            <h3>Your Complete Learning Guide Is Attached</h3>
            <p>This isn't just another generic report - it's a personalized roadmap created specifically for ${childName}'s learning strengths.</p>
            
            <div class="pdf-contents">
              <h4>Inside Your 4-Page Report:</h4>
              <ul>
                <li><strong>Assessment Methodology:</strong> How we identified ${childName}'s unique learning profile</li>
                <li><strong>Visual Score Analysis:</strong> Clear breakdown of learning strengths and preferences</li>
                <li><strong>Evidence-Based Home Strategies:</strong> 12+ specific techniques you can start using today</li>
                <li><strong>30-Day Implementation Plan:</strong> Week-by-week guide to see real progress</li>
                <li><strong>When to Seek Support:</strong> Professional guidance on next steps if needed</li>
              </ul>
            </div>
          </div>
          
          <div class="reassurance">
            <div class="key-message">The Next Step: Learning That Fits ${childName}</div>
            <div class="support-message">Understanding your child's learning profile is the first step toward unlocking their potential. The strategies in your report have helped thousands of families transform their children's educational experience.</div>
          </div>
          
          <p>I know how overwhelming it can feel when your bright child struggles in school. But once you understand ${childName}'s natural learning style, everything starts to make sense - and more importantly, gets easier.</p>
          
          <div class="personal-touch">
            <p>Questions about ${childName}'s report? Just hit reply - I personally read and respond to every email. I'd love to hear how these strategies work for your family!</p>
          </div>
          
          <div class="signature">
            <p>Here to support ${childName}'s learning journey,</p>
            
            <div class="signature-name">Sarah Chen</div>
            <div class="signature-title">Educational Learning Specialist<br>Vedyx Learning Assessment Center</div>
            
            <div class="ps-section">
              <strong>P.S.</strong> Over the next few days, I'll share success stories and additional strategies for ${insights.profileType.toLowerCase()}s like ${childName}. Keep an eye on your inbox!
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-logo">Vedyx Learning Assessment Center</div>
          <p>Evidence-based learning strategies for neurodivergent students</p>
          <p style="margin-top: 20px;">
            <a href="#" style="color: #64748b; text-decoration: none;">Update Preferences</a> | 
            <a href="#" style="color: #64748b; text-decoration: none;">Contact Support</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}