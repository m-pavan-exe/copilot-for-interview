export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  confidence?: number;
}

export interface AIResponse {
  id: string;
  question: string;
  response: string;
  timestamp: Date;
  sessionId: string;
}

export interface InterviewSession {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  transcripts: TranscriptEntry[];
  aiResponses: AIResponse[];
  isActive: boolean;
}

export interface SpeechRecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
}

export interface AppState {
  isListening: boolean;
  isHidden: boolean;
  currentSession: InterviewSession | null;
  transcripts: TranscriptEntry[];
  aiResponses: AIResponse[];
  microphonePermission: 'granted' | 'denied' | 'prompt';
  isProcessing: boolean;
}