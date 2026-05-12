import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 
  (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || 
  (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '')

const pathSchema = {
  type: 'object' as const,
  properties: {
    title: { type: 'string' as const },
    description: { type: 'string' as const },
    milestones: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          title: { type: 'string' as const },
          description: { type: 'string' as const },
          key_concepts: { type: 'array' as const, items: { type: 'string' as const } },
          estimated_hours: { type: 'number' as const }
        },
        required: ['title', 'description', 'key_concepts', 'estimated_hours']
      }
    }
  },
  required: ['title', 'description', 'milestones']
}

const flashcardSchema = {
  type: 'array' as const,
  items: {
    type: 'object' as const,
    properties: {
      question: { type: 'string' as const },
      answer: { type: 'string' as const }
    },
    required: ['question', 'answer']
  }
}

export async function generateLearningPath(topic: string) {
  if (!topic || !topic.trim()) {
    throw new Error('Topic is required')
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: pathSchema
    }
  })

  const prompt = `You are an expert curriculum designer. Create a structured learning path with 5-8 milestones for: ${topic}. Return valid JSON.`
  
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text)
}

export async function generateFlashcards(
  milestoneTitle: string,
  milestoneDescription: string,
  keyConcepts: string[]
) {
  if (!milestoneTitle) {
    throw new Error('Milestone title is required')
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: flashcardSchema
    }
  })

  const prompt = `You are an expert educator. Create 6-8 flashcards for this milestone:
  Title: ${milestoneTitle}
  Description: ${milestoneDescription}
  Key Concepts: ${keyConcepts.join(', ')}
  
  Test conceptual understanding. Return a JSON array of {question, answer} objects.`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text)
}

