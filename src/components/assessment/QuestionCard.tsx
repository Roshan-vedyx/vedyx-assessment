// src/components/assessment/QuestionCard.tsx - PREMIUM VERSION
'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AssessmentQuestion } from '@/types/assessment'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowLeft, ArrowRight, Brain } from 'lucide-react'

interface QuestionCardProps {
  question: AssessmentQuestion
  selectedAnswer: string | null
  onSelectAnswer: (answerId: string) => void
  onSubmit: () => void
  onPrevious?: () => void
  currentQuestion: number
  totalQuestions: number
  progress: number
  canGoBack: boolean
  childName: string
}

export function QuestionCard({
  question,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  onPrevious,
  currentQuestion,
  totalQuestions,
  progress,
  canGoBack,
  childName
}: QuestionCardProps) {
  
  const personalizeQuestion = (questionText: string, childName: string) => {
    return questionText.replace(/your child/gi, childName)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Learning Style Assessment</p>
                <p className="text-lg font-bold text-gray-900">Question {currentQuestion} of {totalQuestions}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">{Math.round(progress)}% Complete</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full">
                <motion.div 
                  className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-10">
              {/* Question Header */}
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block"
                >
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-sm font-semibold rounded-full mb-6">
                    {question.section}
                  </span>
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight"
                >
                  {personalizeQuestion(question.question, childName)}
                </motion.h2>
              </div>

              {/* Answer Options */}
              <div className="space-y-4 mb-10">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === option.id
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => onSelectAnswer(option.id)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`group w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-gradient-to-r from-indigo-500 to-purple-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-purple-25 hover:shadow-md'
                      } ${isSelected ? 'transform scale-[1.02]' : 'hover:transform hover:scale-[1.01]'}`}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 font-bold text-lg transition-colors ${
                          isSelected 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                        }`}>
                          {option.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-lg leading-relaxed transition-colors ${
                            isSelected ? 'text-gray-900 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                          }`}>
                            {option.text}
                          </p>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="flex items-center mt-3"
                            >
                              <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                              <span className="text-indigo-600 text-sm font-semibold">Selected</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Navigation Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex justify-between items-center"
              >
                {canGoBack ? (
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    disabled={!onPrevious}
                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Previous
                  </Button>
                ) : (
                  <div /> // Spacer
                )}
                
                <Button
                  onClick={onSubmit}
                  disabled={!selectedAnswer}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    selectedAnswer
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentQuestion === totalQuestions ? (
                    <>
                      Get My Results
                      <Brain className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Encouraging message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm">
            {currentQuestion < totalQuestions 
              ? `${totalQuestions - currentQuestion} more questions to unlock ${childName}'s learning profile`
              : `All done! Let's see ${childName}'s unique learning style`
            }
          </p>
        </motion.div>
      </div>
    </div>
  )
}