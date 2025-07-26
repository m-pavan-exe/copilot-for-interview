import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService } from '@/services/speechService';
import { getGeminiService, initializeGeminiService } from '@/services/geminiService';
import { TranscriptEntry, AIResponse, InterviewSession, AppState } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useInterviewCopilot = () => {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>({
    isListening: false,
    isHidden: false,
    currentSession: null,
    transcripts: [],
    aiResponses: [],
    microphonePermission: 'prompt',
    isProcessing: false,
  });

  const [interimTranscript, setInterimTranscript] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const lastProcessedTextRef = useRef('');

  // Initialize speech service callbacks
  useEffect(() => {
    speechService.setOnTranscript((text: string, isFinal: boolean) => {
      if (isFinal) {
        handleFinalTranscript(text);
        setInterimTranscript('');
      } else {
        setInterimTranscript(text);
      }
    });

    speechService.setOnError((error: string) => {
      toast({
        title: 'Speech Recognition Error',
        description: `Error: ${error}`,
        variant: 'destructive',
      });
      setAppState(prev => ({ ...prev, isListening: false }));
    });
  }, []);

  // Setup keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'l') {
        event.preventDefault();
        toggleListening();
      } else if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        toggleHidden();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState.isListening]);

  const handleFinalTranscript = useCallback((text: string) => {
    if (!text.trim() || text === lastProcessedTextRef.current) return;
    
    lastProcessedTextRef.current = text;
    
    const newTranscript: TranscriptEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date(),
      isUser: true,
    };

    setAppState(prev => ({
      ...prev,
      transcripts: [...prev.transcripts, newTranscript],
    }));

    // Check if this looks like a question and generate AI response
    if (geminiApiKey) {
      // Debounce AI response generation
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        generateAIResponse(text);
      }, 1000);
    }
  }, [geminiApiKey]);

  const generateAIResponse = async (text: string) => {
    if (!geminiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please set your Gemini API key to enable AI responses',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAppState(prev => ({ ...prev, isProcessing: true }));
      
      const geminiService = getGeminiService();
      
      if (!geminiService.isQuestionDetected(text)) {
        setAppState(prev => ({ ...prev, isProcessing: false }));
        return;
      }

      const question = geminiService.extractQuestion(text);
      const response = await geminiService.generateResponse(question);

      const aiResponse: AIResponse = {
        id: Date.now().toString(),
        question,
        response: response.text,
        timestamp: new Date(),
        sessionId: appState.currentSession?.id || 'default',
      };

      setAppState(prev => ({
        ...prev,
        aiResponses: [...prev.aiResponses, aiResponse],
        isProcessing: false,
      }));

      toast({
        title: 'AI Response Generated',
        description: 'New response available in the panel',
      });

    } catch (error) {
      console.error('Failed to generate AI response:', error);
      toast({
        title: 'AI Response Failed',
        description: 'Failed to generate response. Check your API key.',
        variant: 'destructive',
      });
      setAppState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const granted = await speechService.requestMicrophonePermission();
      setAppState(prev => ({
        ...prev,
        microphonePermission: granted ? 'granted' : 'denied',
      }));
      return granted;
    } catch (error) {
      setAppState(prev => ({ ...prev, microphonePermission: 'denied' }));
      return false;
    }
  };

  const toggleListening = async () => {
    if (!speechService.isSpeechRecognitionSupported()) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    if (appState.microphonePermission !== 'granted') {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        toast({
          title: 'Permission Denied',
          description: 'Microphone permission is required for speech recognition',
          variant: 'destructive',
        });
        return;
      }
    }

    if (appState.isListening) {
      speechService.stopListening();
      setAppState(prev => ({ ...prev, isListening: false }));
    } else {
      speechService.startListening();
      setAppState(prev => ({ ...prev, isListening: true }));
    }
  };

  const toggleHidden = () => {
    setAppState(prev => ({ ...prev, isHidden: !prev.isHidden }));
  };

  const clearTranscripts = () => {
    setAppState(prev => ({
      ...prev,
      transcripts: [],
      aiResponses: [],
    }));
    setInterimTranscript('');
    lastProcessedTextRef.current = '';
  };

  const updateGeminiApiKey = (apiKey: string) => {
    setGeminiApiKey(apiKey);
    if (apiKey) {
      try {
        initializeGeminiService(apiKey);
        toast({
          title: 'API Key Updated',
          description: 'Gemini AI service is now active',
        });
      } catch (error) {
        toast({
          title: 'Invalid API Key',
          description: 'Please check your Gemini API key',
          variant: 'destructive',
        });
      }
    }
  };

  const createNewSession = (name: string) => {
    const session: InterviewSession = {
      id: Date.now().toString(),
      name,
      startTime: new Date(),
      transcripts: [],
      aiResponses: [],
      isActive: true,
    };

    setAppState(prev => ({
      ...prev,
      currentSession: session,
      transcripts: [],
      aiResponses: [],
    }));

    return session;
  };

  return {
    ...appState,
    interimTranscript,
    geminiApiKey,
    toggleListening,
    toggleHidden,
    clearTranscripts,
    updateGeminiApiKey,
    createNewSession,
    requestMicrophonePermission,
    generateAIResponse: (text: string) => generateAIResponse(text),
  };
};