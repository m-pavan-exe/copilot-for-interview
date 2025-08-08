import { useState, useEffect, useCallback, useRef } from 'react';
import { speechService } from '@/services/speechService';
import { getGeminiService, initializeGeminiService } from '@/services/geminiService';
import { getChatGPTService, initializeChatGPTService } from '@/services/chatgptService';
import { TranscriptEntry, AIResponse, InterviewSession, AppState, AIProvider, PersonalContext } from '@/types';
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
    selectedProvider: 'gemini',
    personalContext: {
      name: '',
      role: '',
      experience: '',
      education: '',
      skills: '',
      resume: '',
    },
  });

  const [interimTranscript, setInterimTranscript] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [chatgptApiKey, setChatgptApiKey] = useState('');
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
    const currentApiKey = appState.selectedProvider === 'gemini' ? geminiApiKey : chatgptApiKey;
    if (currentApiKey) {
      // Debounce AI response generation
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        generateAIResponse(text);
      }, 500); // Reduced debounce time for faster response
    }
  }, [geminiApiKey, chatgptApiKey, appState.selectedProvider]);

  const generateAIResponse = async (text: string) => {
    const currentApiKey = appState.selectedProvider === 'gemini' ? geminiApiKey : chatgptApiKey;
    const providerName = appState.selectedProvider === 'gemini' ? 'Gemini' : 'ChatGPT';
    
    if (!currentApiKey) {
      console.log('No API key provided');
      toast({
        title: 'API Key Required',
        description: `Please set your ${providerName} API key to enable AI responses`,
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Generating AI response for:', text);
      setAppState(prev => ({ ...prev, isProcessing: true }));
      
      let service;
      let isQuestionDetected = false;
      let question = '';
      
      // Initialize and use the appropriate service
      if (appState.selectedProvider === 'gemini') {
        try {
          service = getGeminiService();
        } catch (error) {
          console.log('Gemini service not initialized, initializing now...');
          service = initializeGeminiService(geminiApiKey);
        }
        isQuestionDetected = service.isQuestionDetected(text);
        question = service.extractQuestion(text);
      } else {
        try {
          service = getChatGPTService();
        } catch (error) {
          console.log('ChatGPT service not initialized, initializing now...');
          service = initializeChatGPTService(chatgptApiKey);
        }
        isQuestionDetected = service.isQuestionDetected(text);
        question = service.extractQuestion(text);
      }
      
      if (!isQuestionDetected) {
        console.log('No question detected in:', text);
        setAppState(prev => ({ ...prev, isProcessing: false }));
        return;
      }

      console.log('Extracted question:', question);
      
      // Create context string from personal context
      const contextParts = [];
      const { personalContext } = appState;
      if (personalContext.name) contextParts.push(`Name: ${personalContext.name}`);
      if (personalContext.role) contextParts.push(`Role: ${personalContext.role}`);
      if (personalContext.experience) contextParts.push(`Experience: ${personalContext.experience}`);
      if (personalContext.education) contextParts.push(`Education: ${personalContext.education}`);
      if (personalContext.skills) contextParts.push(`Skills: ${personalContext.skills}`);
      if (personalContext.resume) contextParts.push(`Resume: ${personalContext.resume}`);
      
      const contextString = contextParts.length > 0 ? contextParts.join('\n') : undefined;
      
      const response = await service.generateResponse(question, contextString);
      console.log('Generated response:', response);

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
        description: `New response from ${providerName}`,
      });

    } catch (error) {
      console.error('Failed to generate AI response:', error);
      toast({
        title: 'AI Response Failed',
        description: `Failed to generate response from ${providerName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    console.log('Updating API key:', apiKey ? 'Key provided' : 'No key');
    setGeminiApiKey(apiKey);
    if (apiKey) {
      try {
        initializeGeminiService(apiKey);
        console.log('Gemini service initialized successfully');
        toast({
          title: 'API Key Updated',
          description: 'Gemini AI service is now active',
        });
      } catch (error) {
        console.error('Failed to initialize Gemini service:', error);
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

  const updateChatGPTApiKey = (apiKey: string) => {
    console.log('Updating ChatGPT API key:', apiKey ? 'Key provided' : 'No key');
    setChatgptApiKey(apiKey);
    if (apiKey) {
      try {
        initializeChatGPTService(apiKey);
        console.log('ChatGPT service initialized successfully');
        toast({
          title: 'API Key Updated',
          description: 'ChatGPT AI service is now active',
        });
      } catch (error) {
        console.error('Failed to initialize ChatGPT service:', error);
        toast({
          title: 'Invalid API Key',
          description: 'Please check your ChatGPT API key',
          variant: 'destructive',
        });
      }
    }
  };

  const updateAIProvider = (provider: AIProvider) => {
    setAppState(prev => ({ ...prev, selectedProvider: provider }));
    toast({
      title: 'AI Provider Changed',
      description: `Switched to ${provider === 'gemini' ? 'Google Gemini' : 'OpenAI ChatGPT'}`,
    });
  };

  const updatePersonalContext = (context: PersonalContext) => {
    setAppState(prev => ({ ...prev, personalContext: context }));
    toast({
      title: 'Context Updated',
      description: 'Personal context saved for personalized responses',
    });
  };

  const generateDirectResponse = async (text: string) => {
    console.log('Direct response generation for:', text);
    await generateAIResponse(text);
  };

  return {
    ...appState,
    interimTranscript,
    geminiApiKey,
    chatgptApiKey,
    toggleListening,
    toggleHidden,
    clearTranscripts,
    updateGeminiApiKey,
    updateChatGPTApiKey,
    updateAIProvider,
    updatePersonalContext,
    createNewSession,
    requestMicrophonePermission,
    generateAIResponse,
    generateDirectResponse,
  };
};