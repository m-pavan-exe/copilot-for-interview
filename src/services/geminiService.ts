export interface GeminiResponse {
  text: string;
  confidence?: number;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private createInterviewPrompt(question: string, context?: string): string {
    return `You are an expert interview coach with great knowledge on Computer science, AI, ML and DL stuff, helping a candidate during a job interview. 

Question detected: "${question}"

Please provide a concise, professional response that:
1. Directly answers the question 
2. Is approximately 30-60 seconds when spoken
3. Uses the STAR method when appropriate (Situation, Task, Action, Result)
4. Sounds natural and conversational
5. Shows confidence and competence

${context ? `Additional context: ${context}` : ''}

Response:`;
  }

  public async generateResponse(question: string, context?: string): Promise<GeminiResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not provided');
    }

    try {
      const prompt = this.createInterviewPrompt(question, context);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 200,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      return {
        text: data.candidates[0].content.parts[0].text.trim(),
        confidence: data.candidates[0].safetyRatings?.[0]?.probability === 'NEGLIGIBLE' ? 0.95 : 0.8
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  public isQuestionDetected(text: string): boolean {
    const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'can you', 'could you', 'would you', 'tell me', 'describe', 'explain'];
    const lowerText = text.toLowerCase();
    
    // Check for question words and question marks
    const hasQuestionWord = questionWords.some(word => lowerText.includes(word));
    const hasQuestionMark = text.includes('?');
    
    // Check for interview-specific patterns
    const interviewPatterns = [
      'experience with',
      'worked on',
      'strength',
      'weakness',
      'challenge',
      'difficult situation',
      'achieve',
      'goal',
      'project'
    ];
    
    const hasInterviewPattern = interviewPatterns.some(pattern => lowerText.includes(pattern));
    
    return hasQuestionWord || hasQuestionMark || hasInterviewPattern;
  }

  public extractQuestion(text: string): string {
    // Split by sentence endings and find the sentence that looks most like a question
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    for (const sentence of sentences) {
      if (this.isQuestionDetected(sentence)) {
        return sentence.trim();
      }
    }
    
    // If no clear question found, return the last sentence
    return sentences[sentences.length - 1]?.trim() || text;
  }
}

// Create a singleton instance that can be configured later
let geminiService: GeminiService | null = null;

export const initializeGeminiService = (apiKey: string): GeminiService => {
  geminiService = new GeminiService(apiKey);
  return geminiService;
};

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    throw new Error('Gemini service not initialized. Call initializeGeminiService first or check the API Usage limits');
  }
  return geminiService;
};