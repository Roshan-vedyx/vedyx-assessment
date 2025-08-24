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
  AlertTriangle 
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

// Track event helper (assuming this exists in your utils)
const trackEvent = (eventName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName);
  }
};

export function ResultsSection({ results, formData, onEmailResults }: ResultsSectionProps) {
  const { childName, parentEmail } = formData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {childName}'s Learning Profile
              </h1>
              <p className="text-lg text-slate-600">
                Comprehensive multi-dimensional assessment results
              </p>
            </div>

            {/* Primary Learning Profile */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <Brain className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-slate-900">
                  {results.profile?.title || "Learning Profile"}
                </h2>
              </div>
              <p className="text-lg text-slate-700 mb-4">
                {results.profile?.description || `${childName} shows a unique learning profile...`}
              </p>
              
              {results.profile?.strengths && (
                <div className="bg-white border border-blue-200 rounded p-4">
                  <h4 className="font-semibold text-slate-900 mb-3">Key Learning Strengths:</h4>
                  <ul className="space-y-2">
                    {results.profile.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Executive Function Supports */}
            {results.executiveSupports && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-900">Executive Function Supports</h2>
                </div>
                <p className="text-slate-700 mb-4">
                  {childName} benefits from these organizational and attention supports:
                </p>
                <div className="bg-white border border-purple-200 rounded p-4">
                  <ul className="space-y-2">
                    {results.executiveSupports.supports?.map((support: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Target className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{support}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Motivational Drivers */}
            {results.motivationalDrivers && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-900">What Motivates {childName}</h2>
                </div>
                <p className="text-slate-700 mb-4">
                  {childName} is most engaged when learning involves:
                </p>
                <div className="bg-white border border-green-200 rounded p-4">
                  <ul className="space-y-2">
                    {results.motivationalDrivers.motivators?.map((motivator: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{motivator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Personalized Recommendations */}
            {results.recommendations && (
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-orange-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-900">Personalized Recommendations</h2>
                </div>
                
                {results.recommendations.immediate && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Immediate Actions (Start This Week):</h4>
                    <div className="bg-white border border-orange-200 rounded p-4">
                      <ul className="space-y-2">
                        {results.recommendations.immediate.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {results.recommendations.academic && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">School & Academic Support:</h4>
                    <div className="bg-white border border-orange-200 rounded p-4">
                      <ul className="space-y-2">
                        {results.recommendations.academic.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Target className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {results.recommendations.longTerm && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Long-term Development:</h4>
                    <div className="bg-white border border-orange-200 rounded p-4">
                      <ul className="space-y-2">
                        {results.recommendations.longTerm.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <TrendingUp className="w-4 h-4 text-orange-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Neurodivergent Considerations */}
            {results.neurodivergentConsiderations && results.neurodivergentConsiderations.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Brain className="w-6 h-6 text-indigo-600 mr-3" />
                  <h2 className="text-xl font-semibold text-slate-900">Additional Insights</h2>
                </div>
                <div className="bg-white border border-indigo-200 rounded p-4">
                  <ul className="space-y-2">
                    {results.neurodivergentConsiderations.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Brain className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      <span className="font-semibold">Important Note:</span>{" "}
                      These insights are observational and educational in nature. 
                      For comprehensive evaluation of learning differences, consult qualified educational or medical professionals.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-xl text-slate-900">Get Your Complete Detailed Report</h3>
              </div>
              <p className="text-slate-700 mb-4">
                While the insights above give you immediate actionable strategies, we're also sending a 
                comprehensive detailed report with expanded recommendations to <span className="font-semibold">{parentEmail}</span>
              </p>
              <div className="bg-white border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-800 font-medium">Your detailed email report includes:</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Extended analysis of {childName}'s complete learning profile</li>
                  <li>• Specific classroom accommodation recommendations for teachers</li>
                  <li>• Home learning environment setup guide</li>
                  <li>• Professional summary suitable for educational consultations</li>
                  <li>• Research references supporting the recommendations</li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-slate-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-slate-900 mb-3">
                Ready to Support {childName}'s Learning Journey?
              </h3>
              <p className="text-slate-600 mb-4">
                Explore our research-based learning tools designed specifically for {childName}'s learning style.
              </p>
              <Button 
                onClick={() => {
                  trackEvent('app_trial_clicked')
                  window.location.href = `/?source=assessment&type=${results.primaryLearningStyle}`
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-lg font-semibold shadow-md"
              >
                Explore Personalized Learning Resources
              </Button>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Research-based learning tools • No commitment required
              </p>
            </div>

            {/* Testimonial */}
            <div className="text-center bg-slate-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-slate-600 italic">
                "This assessment helped us understand our child's learning needs much better."
              </p>
              <p className="text-xs text-slate-500 mt-1">— Parent testimonial</p>
            </div>

            {/* Footer Info */}
            <div className="text-center text-xs sm:text-sm text-slate-500 space-y-2 mt-8">
              <p>A detailed report has been sent to {parentEmail}</p>
              <p>Feel free to share insights with teachers for classroom support</p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-xs text-slate-500 mt-8 border-t pt-4 text-left">
          <p className="font-bold text-red-700 mb-2">Important:</p>
          <ul className="list-disc list-inside space-y-2 text-red-700">
            <li>
              This assessment provides insights about learning preferences and is not a medical or educational diagnosis.
            </li>
            <li>
              For concerns about learning differences or development, please consult your child's pediatrician or a licensed educational professional.
            </li>
            <li>
              Results are based on current research in learning styles and neurodevelopment. Individual children may vary.
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}