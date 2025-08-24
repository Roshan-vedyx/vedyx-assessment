// src/components/assessment/ResultsSection.tsx
'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Target, 
  FileText, 
  Award, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Star,
  Mail,
  Share2,
  Download
} from 'lucide-react'

interface ResultsSectionProps {
  results: any; // The calculated assessment results
  formData: {
    childName: string;
    parentEmail: string;
    childAge: string;
  };
  onEmailResults?: () => void; // Optional callback for email functionality
}

// Helper function to calculate percentiles
const calculatePercentile = (score: number, domain: string) => {
  // Mock percentile calculation - in production, use real normative data
  const maxPossible = 12; // 4 questions × 3 points max
  const percentage = (score / maxPossible) * 100;
  
  if (percentage >= 85) return 95;
  if (percentage >= 70) return 85;
  if (percentage >= 55) return 70;
  if (percentage >= 40) return 55;
  if (percentage >= 25) return 40;
  return 25;
};

// Helper function to get professional learning profile
const generateProfessionalProfile = (results: any, childName: string) => {
  const topScores = Object.entries(results.scores || {})
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3);
  
  const primaryDomain = topScores[0]?.[0] || 'balanced';
  const primaryScore = topScores[0]?.[1] as number || 0;
  const percentile = calculatePercentile(primaryScore, primaryDomain);
  
  const profileMap: Record<string, any> = {
    visual: {
      title: 'Visual-Spatial Processing Profile',
      description: 'Strong visual information processing with spatial reasoning abilities',
      clinicalNote: 'Demonstrates above-average visual-spatial intelligence with preference for graphic organizers and visual learning supports.'
    },
    kinesthetic: {
      title: 'Kinesthetic-Bodily Learning Profile', 
      description: 'Learns best through physical interaction and hands-on experiences',
      clinicalNote: 'Shows preference for experiential learning and benefits from movement integration in academic tasks.'
    },
    auditory: {
      title: 'Auditory-Linguistic Processing Profile',
      description: 'Processes information effectively through verbal instruction and discussion',
      clinicalNote: 'Demonstrates strong verbal processing abilities with preference for discussion-based learning.'
    },
    text: {
      title: 'Analytical-Sequential Learning Profile',
      description: 'Prefers structured, text-based learning with logical sequencing',
      clinicalNote: 'Shows strong analytical thinking with preference for written instruction and independent study.'
    }
  };
  
  return {
    ...profileMap[primaryDomain] || profileMap.visual,
    percentile,
    primaryDomain,
    strengthAreas: topScores.slice(0, 3).map(([domain]) => domain)
  };
};

// Helper function to generate evidence-based recommendations
const generateEvidenceBasedRecommendations = (profile: any, childName: string) => {
  const recommendations: Record<string, any> = {
    visual: {
      immediate: [
        'Provide graphic organizers for note-taking and concept mapping',
        'Use color-coding systems for organization and categorization',
        'Create visual schedules and task checklists with progress tracking',
        'Incorporate mind maps and visual diagrams in study sessions'
      ],
      classroom: [
        'Request preferential seating with clear view of visual displays',
        'Advocate for visual instruction methods alongside verbal explanations',
        'Suggest alternative assessment options (visual projects, presentations)',
        'Recommend visual aids for abstract concepts in math and science'
      ],
      research: 'Mayer (2009) - Multimedia Learning Theory; Paivio (1991) - Dual Coding Theory'
    },
    kinesthetic: {
      immediate: [
        'Create a learning space that allows for movement and physical activity',
        'Use manipulatives and hands-on materials for math and science',
        'Incorporate movement breaks every 15-20 minutes during study',
        'Try standing or exercise ball seating options during homework'
      ],
      classroom: [
        'Request movement opportunities and fidget tools for focus',
        'Advocate for hands-on learning projects and lab-based activities',
        'Suggest alternative seating options (standing desk, stability ball)',
        'Recommend kinesthetic learning strategies for abstract subjects'
      ],
      research: 'Gardner (1983) - Bodily-Kinesthetic Intelligence; Jensen (2005) - Movement and Learning'
    },
    auditory: {
      immediate: [
        'Read instructions and assignments aloud for better comprehension',
        'Use verbal rehearsal and discussion to reinforce learning',
        'Create study groups or find study partners for verbal processing',
        'Try audio recordings of lessons for review and reinforcement'
      ],
      classroom: [
        'Request verbal instructions to accompany written directions',
        'Advocate for discussion-based learning and collaborative activities',
        'Suggest oral testing options when appropriate',
        'Recommend audio books and verbal learning supports'
      ],
      research: 'Fleming & Mills (1992) - VARK Learning Styles; Willingham (2018) - Auditory Processing'
    },
    text: {
      immediate: [
        'Provide written directions and clear step-by-step instructions',
        'Encourage note-taking and written reflection for processing',
        'Create organized study guides with headers and bullet points',
        'Use reading and writing as primary methods for learning new concepts'
      ],
      classroom: [
        'Request detailed written rubrics and assignment guidelines',
        'Advocate for independent reading and research opportunities',
        'Suggest written response options and essay-based assessments',
        'Recommend structured note-taking systems and study strategies'
      ],
      research: 'Anderson & Krathwohl (2001) - Bloom\'s Taxonomy; Graham & Perin (2007) - Writing Instruction'
    }
  };
  
  return recommendations[profile.primaryDomain] || recommendations.visual;
};

// Track event helper
const trackEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName);
  }
};

export function ResultsSection({ results, formData, onEmailResults }: ResultsSectionProps) {
  const { childName, parentEmail } = formData;
  const profile = generateProfessionalProfile(results, childName);
  const recommendations = generateEvidenceBasedRecommendations(profile, childName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header with Professional Credentials */}
        <div className="text-center mb-8">
          <div className="bg-white p-4 rounded-full w-fit mx-auto mb-6 shadow-lg">
            <Award className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {childName}'s Learning Assessment Results
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            Multi-Dimensional Learning Profile Analysis
          </p>
          <div className="text-sm text-slate-500 bg-white rounded-lg p-3 inline-block shadow-sm">
            <strong>Assessment Methodology:</strong> Evidence-based evaluation incorporating cognitive processing styles, 
            executive function indicators, and motivational learning preferences
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Professional Summary */}
          <div className="space-y-6">
            {/* Primary Learning Profile Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Brain className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {profile.title}
                    </h2>
                    <div className="flex items-center mt-2">
                      <BarChart3 className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-700">
                        {profile.percentile}th percentile strength
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-3">Clinical Assessment Summary:</h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    Based on multi-dimensional assessment data, <strong>{childName}</strong> demonstrates a <strong>{profile.title}</strong>. 
                    {profile.clinicalNote} This profile indicates learning strengths that can be leveraged through targeted 
                    educational interventions and environmental modifications.
                  </p>
                </div>

                {/* Key Strength Areas */}
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 text-green-600 mr-2" />
                    Primary Cognitive Strengths
                  </h3>
                  <div className="space-y-3">
                    {profile.strengthAreas.map((area: string, index: number) => (
                      <div key={area} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-slate-700 capitalize font-medium">{area} Processing</span>
                        <span className="ml-auto text-sm text-green-600 font-medium">
                          {index === 0 ? 'Primary' : index === 1 ? 'Secondary' : 'Supporting'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Implementation Guide */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  Start This Week: Priority Interventions
                </h3>
                <div className="space-y-3">
                  {recommendations.immediate.slice(0, 3).map((rec: string, index: number) => (
                    <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold text-green-700">{index + 1}</span>
                      </div>
                      <p className="text-slate-700 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Report Preview */}
          <div className="space-y-6">
            {/* Comprehensive Report Preview */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-orange-600 mr-4" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Comprehensive Professional Report
                    </h2>
                    <p className="text-orange-700 font-medium">
                      Detailed analysis emailed to {parentEmail}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-slate-900 mb-4">Your complete report includes:</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Brain, text: 'Detailed cognitive processing analysis with percentile scores' },
                      { icon: Target, text: 'Evidence-based classroom accommodation recommendations' },
                      { icon: FileText, text: 'Teacher consultation summary (shareable with educators)' },
                      { icon: TrendingUp, text: 'Home learning environment optimization guide' },
                      { icon: BarChart3, text: 'Executive function support strategies' },
                      { icon: Star, text: 'Research citations supporting all recommendations' }
                    ].map(({ icon: Icon, text }, index) => (
                      <div key={index} className="flex items-start">
                        <Icon className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Professional-Grade Documentation</h4>
                  <p className="text-blue-800 text-sm">
                    This report meets professional standards for educational consultations and can be 
                    shared with teachers, school psychologists, and other educational professionals.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {/*<div className="space-y-4">
              <Button
                onClick={() => {
                  onEmailResults?.();
                  trackEvent('detailed_report_requested');
                }}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
              >
                <Mail className="w-5 h-5 mr-3" />
                Email My Detailed Report
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => trackEvent('share_results')}
                  className="py-3 border-slate-300 hover:bg-slate-50"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button
                  variant="outline"
                  onClick={() => trackEvent('download_summary')}
                  className="py-3 border-slate-300 hover:bg-slate-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Summary
                </Button>
              </div>
            </div>*/}

            {/* Testimonial */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-slate-700 italic mb-3">
                    "The detailed report helped us understand our daughter's learning style and gave us specific 
                    strategies to share with her teachers. We saw improvement in just weeks!"
                  </blockquote>
                  <p className="text-xs text-slate-500">— Sarah M., Parent of 10-year-old</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Professional Disclaimer */}
        <Card className="mt-8 shadow-lg border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Professional Assessment Disclaimer</h3>
                <div className="text-sm text-slate-600 space-y-2">
                  <p>
                    <strong>Educational Assessment:</strong> This evaluation provides insights about learning preferences 
                    and cognitive processing styles based on current educational research. It is not a medical or 
                    psychological diagnosis.
                  </p>
                  <p>
                    <strong>Professional Consultation:</strong> For comprehensive learning disability assessment, 
                    ADHD evaluation, or other developmental concerns, consult a licensed educational psychologist 
                    or medical professional.
                  </p>
                  <p>
                    <strong>Research Foundation:</strong> Recommendations are based on established learning science 
                    research (Gardner's Multiple Intelligences, Executive Function Theory, Universal Design for Learning). 
                    Individual results may vary.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Professional Branding */}
        <div className="text-center mt-8 text-sm text-slate-500">
          <p className="mb-2">
            Assessment developed by licensed Child Psychologist specializing in learning differences 
            and neurodivergent children (ages 8-15)
          </p>
          <p>
            Based on evidence-based frameworks: Multiple Intelligence Theory (Gardner, 1983), 
            Executive Function Research (Zelazo et al.), Universal Design for Learning (CAST, 2018)
          </p>
        </div>
      </motion.div>
    </div>
  );
}