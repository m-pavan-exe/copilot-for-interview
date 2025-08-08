import React, { useState } from 'react';
import { useInterviewCopilot } from '@/hooks/useInterviewCopilot';
import { MicrophoneButton } from './MicrophoneButton';
import { TranscriptPanel } from './TranscriptPanel';
import { AIResponsePanel } from './AIResponsePanel';
import { StealthMode } from './StealthMode';
import { AppSidebar } from './AppSidebar';
import { MaximizedAIPanel } from './MaximizedAIPanel';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import heroImage from '@/assets/hero-bg.jpg';
import { Sparkles, Shield, Zap, Menu } from 'lucide-react';

export const InterviewCopilot: React.FC = () => {
  const {
    isListening,
    isHidden,
    isProcessing,
    transcripts,
    aiResponses,
    interimTranscript,
    geminiApiKey,
    chatgptApiKey,
    selectedProvider,
    personalContext,
    microphonePermission,
    toggleListening,
    toggleHidden,
    clearTranscripts,
    updateGeminiApiKey,
    updateChatGPTApiKey,
    updateAIProvider,
    updatePersonalContext,
    requestMicrophonePermission,
    generateAIResponse,
    generateDirectResponse,
  } = useInterviewCopilot();

  const [isAIMaximized, setIsAIMaximized] = useState(false);

  if (isHidden) {
    return <StealthMode isListening={isListening} onClick={toggleHidden} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        
        {/* Sidebar */}
        <AppSidebar
          isListening={isListening}
          isHidden={isHidden}
          isProcessing={isProcessing}
          geminiApiKey={geminiApiKey}
          chatgptApiKey={chatgptApiKey}
          selectedProvider={selectedProvider}
          personalContext={personalContext}
          microphonePermission={microphonePermission}
          transcriptCount={transcripts.length}
          aiResponseCount={aiResponses.length}
          onToggleListening={toggleListening}
          onToggleHidden={toggleHidden}
          onUpdateGeminiApiKey={updateGeminiApiKey}
          onUpdateChatGPTApiKey={updateChatGPTApiKey}
          onUpdateAIProvider={updateAIProvider}
          onUpdatePersonalContext={updatePersonalContext}
          onClearTranscripts={clearTranscripts}
          onRequestMicPermission={requestMicrophonePermission}
          onGenerateTestResponse={generateAIResponse}
          onGenerateDirectResponse={generateDirectResponse}
        />
        
        {/* Main Content */}
        <main className="flex-1 relative z-10">
          {/* Header with Sidebar Toggle */}
          <header className="h-16 flex items-center justify-between border-b border-border/50 px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <div className="gradient-primary p-2 rounded-lg">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Interview Copilot
                </h1>
              </div>
            </div>
            
            {/* Feature Badges */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="glass-effect border-success/30">
                <Shield className="h-3 w-3 mr-1" />
                Stealth Mode
              </Badge>
              <Badge variant="secondary" className="glass-effect border-primary/30">
                <Zap className="h-3 w-3 mr-1" />
                Real-time AI
              </Badge>
            </div>
          </header>

          <div className="p-6">
            {/* Central Microphone Button */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <MicrophoneButton
                  isListening={isListening}
                  isProcessing={isProcessing}
                  onClick={toggleListening}
                  className="scale-125"
                />
                
                {/* Status Indicator */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    variant={isListening ? "default" : "secondary"}
                    className={`
                      px-3 py-1 text-xs font-medium
                      ${isListening ? 'gradient-success text-white' : 'glass-effect'}
                    `}
                  >
                    {isListening ? '🎙️ Recording...' : '⏸️ Click to Start'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Content Grid - Only Transcript and AI Response */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* Transcript Panel */}
              <TranscriptPanel
                transcripts={transcripts}
                interimTranscript={interimTranscript}
                onAskGemini={generateDirectResponse}
              />

              {/* AI Response Panel */}
              <AIResponsePanel
                aiResponses={aiResponses}
                isProcessing={isProcessing}
                onMaximize={() => setIsAIMaximized(true)}
              />
            </div>
          </div>
        </main>

        {/* Maximized AI Panel */}
        {isAIMaximized && (
          <MaximizedAIPanel
            aiResponses={aiResponses}
            isProcessing={isProcessing}
            onClose={() => setIsAIMaximized(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};