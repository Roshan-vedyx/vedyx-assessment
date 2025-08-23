import { AssessmentQuestion } from '@/types/assessment'

export const questions: AssessmentQuestion[] = [
  {
    id: 1,
    section: "Learning Style",
    question: "When your child needs to learn something new (like tying shoes or a math concept), they learn best when you...",
    options: [
      { id: 'A', text: 'Show them step-by-step while they watch', score: { visual: 1 } },
      { id: 'B', text: 'Let them try it themselves right away', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Explain it out loud with lots of details', score: { auditory: 1 } },
      { id: 'D', text: 'Give them written instructions to follow', score: { reading: 1 } }
    ]
  },
  {
    id: 2,
    section: "Learning Style", 
    question: "Your child is trying to build something (LEGO, puzzle, craft). They typically...",
    options: [
      { id: 'A', text: 'Study the picture/example carefully first', score: { visual: 1 } },
      { id: 'B', text: 'Jump in and figure it out by trying different pieces', score: { kinesthetic: 1 } },
      { id: 'C', text: 'Ask you to talk them through each step', score: { auditory: 1 } },
      { id: 'D', text: 'Read all the instructions before starting', score: { reading: 1 } }
    ]
  },
  {
    id: 3,
    section: "Focus Patterns",
    question: "During homework time, your child...",
    options: [
      { id: 'A', text: 'Stays focused but takes frequent movement breaks', score: { kinesthetic: 1, adhd: 0.5 } },
      { id: 'B', text: 'Gets distracted easily but refocuses quickly', score: { adhd: 1 } },
      { id: 'C', text: 'Hyperfocuses and loses track of time', score: { autism: 1 } },
      { id: 'D', text: 'Works steadily for predictable periods', score: { visual: 0.5, reading: 0.5 } }
    ]
  },
  {
    id: 4,
    section: "Social Learning",
    question: "When your child encounters a problem they can't solve, they...",
    options: [
      { id: 'A', text: 'Keep trying different approaches alone', score: { kinesthetic: 1, autism: 0.5 } },
      { id: 'B', text: 'Ask for help immediately', score: { auditory: 1 } },
      { id: 'C', text: 'Look for similar examples or patterns', score: { visual: 1 } },
      { id: 'D', text: 'Research or read about solutions', score: { reading: 1 } }
    ]
  },
  {
    id: 5,
    section: "Information Processing",
    question: "When explaining their day, your child...",
    options: [
      { id: 'A', text: 'Uses gestures and acts things out', score: { visual: 1, kinesthetic: 0.5 } },
      { id: 'B', text: 'Gives lots of detailed descriptions', score: { auditory: 1 } },
      { id: 'C', text: 'Focuses on specific facts in order', score: { autism: 1, reading: 0.5 } },
      { id: 'D', text: 'Jumps between topics excitedly', score: { adhd: 1 } }
    ]
  }
]