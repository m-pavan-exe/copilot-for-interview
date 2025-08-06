import React from 'react';
import { useInterviewCopilot } from '@/hooks/useInterviewCopilot';
import { MicrophoneButton } from './MicrophoneButton';
import { TranscriptPanel } from './TranscriptPanel';
import { AIResponsePanel } from './AIResponsePanel';
import { ControlPanel } from './ControlPanel';
import { DirectInputPanel } from './DirectInputPanel';
import { StealthMode } from './StealthMode';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import heroImage from '@/assets/hero-bg.jpg';
import { Sparkles, Shield, Zap } from 'lucide-react';

export const InterviewCopilot: React.FC = () => {
  const {
    isListening,
    isHidden,
    isProcessing,
    transcripts,
    aiResponses,
    interimTranscript,
    geminiApiKey,
    microphonePermission,
    toggleListening,
    toggleHidden,
    clearTranscripts,
    updateGeminiApiKey,
    requestMicrophonePermission,
    generateAIResponse,
    generateDirectResponse,
  } = useInterviewCopilot();

  if (isHidden) {
    return <StealthMode isListening={isListening} onClick={toggleHidden} />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gradient-primary p-3 rounded-xl">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Interview Copilot
            </h1>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
            Your AI-powered interview assistant. Get real-time transcription and intelligent response suggestions during job interviews.
          </p>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge variant="secondary" className="glass-effect border-success/30">
              <Shield className="h-3 w-3 mr-1" />
              Stealth Mode
            </Badge>
            <Badge variant="secondary" className="glass-effect border-primary/30">
              <Zap className="h-3 w-3 mr-1" />
              Real-time AI
            </Badge>
            <Badge variant="secondary" className="glass-effect border-warning/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Gemini Powered
            </Badge>
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-7xl mx-auto">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Tabs defaultValue="controls" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="controls">Controls</TabsTrigger>
                  <TabsTrigger value="direct">Ask Gemini</TabsTrigger>
                </TabsList>
                
                <TabsContent value="controls" className="space-y-4 mt-4">
                  <ControlPanel
                    isListening={isListening}
                    isHidden={isHidden}
                    geminiApiKey={geminiApiKey}
                    microphonePermission={microphonePermission}
                    onToggleListening={toggleListening}
                    onToggleHidden={toggleHidden}
                    onUpdateGeminiApiKey={updateGeminiApiKey}
                    onClearTranscripts={clearTranscripts}
                    onRequestMicPermission={requestMicrophonePermission}
                    onGenerateTestResponse={generateAIResponse}
                  />
                </TabsContent>
                
                <TabsContent value="direct" className="mt-4">
                  <DirectInputPanel
                    onGenerateResponse={generateDirectResponse}
                    isProcessing={isProcessing}
                    geminiApiKey={geminiApiKey}
                  />
                </TabsContent>
              </Tabs>

              {/* Quick Stats */}
              <Card className="glass-effect border-border/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {transcripts.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Transcripts
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">
                        {aiResponses.length}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        AI Responses
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Center Column - Transcripts */}
            <div className="lg:col-span-1">
              <TranscriptPanel
                transcripts={transcripts}
                interimTranscript={interimTranscript}
                onAskGemini={generateDirectResponse}
              />
            </div>

            {/* Right Column - AI Responses */}
            <div className="lg:col-span-1">
              <AIResponsePanel
                aiResponses={aiResponses}
                isProcessing={isProcessing}
              />
            </div>
          </div>

          {/* Instructions */}
          {transcripts.length === 0 && (
            <div className="mt-8 text-center">
              <Card className="glass-effect border-border/50 max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-primary">
                    Getting Started
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs mt-0.5">1</Badge>
                      <span>Add your Gemini API key in the Advanced Settings</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs mt-0.5">2</Badge>
                      <span>Grant microphone permission when prompted</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs mt-0.5">3</Badge>
                      <span>Click the microphone or press Ctrl+L to start recording</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="text-xs mt-0.5">4</Badge>
                      <span>Use Ctrl+H to hide the interface during screen sharing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};