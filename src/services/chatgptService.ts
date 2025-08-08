export interface ChatGPTResponse {
  text: string;
  confidence?: number;
}

export class ChatGPTService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

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

${context ? `Additional context about the candidate: ${context}` : ''}

Response:`;
  }

  public async generateResponse(question: string, context?: string): Promise<ChatGPTResponse> {
    if (!this.apiKey) {
      throw new Error('ChatGPT API key not provided');
    }

    try {
      const prompt = this.createInterviewPrompt(question, context);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert interview coach specializing in Computer Science, AI, ML, and DL interviews. Provide concise, professional responses that sound natural and conversational.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`ChatGPT API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error('Invalid response format from ChatGPT API');
      }

      return {
        text: data.choices[0].message.content.trim(),
        confidence: 0.9
      };

    } catch (error) {
      console.error('ChatGPT API error:', error);
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
let chatgptService: ChatGPTService | null = null;

export const initializeChatGPTService = (apiKey: string): ChatGPTService => {
  console.log('=== Initializing ChatGPT Service ===');
  console.log('API key provided:', !!apiKey);
  console.log('API key length:', apiKey?.length || 0);
  
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API key is required and cannot be empty');
  }
  
  if (!apiKey.startsWith('sk-')) {
    throw new Error('ChatGPT API key must start with "sk-"');
  }
  
  if (apiKey.length < 20) {
    throw new Error('API key appears to be too short');
  }
  
  chatgptService = new ChatGPTService(apiKey);
  console.log('ChatGPT service instance created successfully');
  return chatgptService;
};

export const getChatGPTService = (): ChatGPTService => {
  if (!chatgptService) {
    throw new Error('ChatGPT service not initialized. Call initializeChatGPTService first or check the API key');
  }
  return chatgptService;
};