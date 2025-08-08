import React from 'react';
import { ControlPanel } from './ControlPanel';
import { DirectInputPanel } from './DirectInputPanel';
import { AIProviderSettings, AIProvider } from './AIProviderSettings';
import { PersonalContextPanel, PersonalContext } from './PersonalContextPanel';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Bot, User } from 'lucide-react';

interface AppSidebarProps {
  isListening: boolean;
  isHidden: boolean;
  isProcessing: boolean;
  geminiApiKey: string;
  chatgptApiKey: string;
  selectedProvider: AIProvider;
  personalContext: PersonalContext;
  microphonePermission: 'granted' | 'denied' | 'prompt';
  transcriptCount: number;
  aiResponseCount: number;
  onToggleListening: () => void;
  onToggleHidden: () => void;
  onUpdateGeminiApiKey: (apiKey: string) => void;
  onUpdateChatGPTApiKey: (apiKey: string) => void;
  onUpdateAIProvider: (provider: AIProvider) => void;
  onUpdatePersonalContext: (context: PersonalContext) => void;
  onClearTranscripts: () => void;
  onRequestMicPermission: () => void;
  onGenerateTestResponse: (text: string) => void;
  onGenerateDirectResponse: (text: string) => Promise<void>;
}

export function AppSidebar({
  isListening,
  isHidden,
  isProcessing,
  geminiApiKey,
  chatgptApiKey,
  selectedProvider,
  personalContext,
  microphonePermission,
  transcriptCount,
  aiResponseCount,
  onToggleListening,
  onToggleHidden,
  onUpdateGeminiApiKey,
  onUpdateChatGPTApiKey,
  onUpdateAIProvider,
  onUpdatePersonalContext,
  onClearTranscripts,
  onRequestMicPermission,
  onGenerateTestResponse,
  onGenerateDirectResponse,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-80"} collapsible="icon">
      <div className="p-2">
        <SidebarTrigger className="ml-auto" />
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {!collapsed && "Controls"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            {!collapsed && (
              <div className="space-y-4">
                <Tabs defaultValue="controls" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 text-xs">
                    <TabsTrigger value="controls">Controls</TabsTrigger>
                    <TabsTrigger value="ai">AI Setup</TabsTrigger>
                    <TabsTrigger value="context">Context</TabsTrigger>
                    <TabsTrigger value="direct">Ask AI</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="controls" className="space-y-4 mt-4">
                    <ControlPanel
                      isListening={isListening}
                      isHidden={isHidden}
                      geminiApiKey={geminiApiKey}
                      microphonePermission={microphonePermission}
                      onToggleListening={onToggleListening}
                      onToggleHidden={onToggleHidden}
                      onUpdateGeminiApiKey={onUpdateGeminiApiKey}
                      onClearTranscripts={onClearTranscripts}
                      onRequestMicPermission={onRequestMicPermission}
                      onGenerateTestResponse={onGenerateTestResponse}
                    />
                  </TabsContent>

                  <TabsContent value="ai" className="mt-4">
                    <AIProviderSettings
                      selectedProvider={selectedProvider}
                      geminiApiKey={geminiApiKey}
                      chatgptApiKey={chatgptApiKey}
                      onProviderChange={onUpdateAIProvider}
                      onGeminiApiKeyChange={onUpdateGeminiApiKey}
                      onChatGPTApiKeyChange={onUpdateChatGPTApiKey}
                    />
                  </TabsContent>

                  <TabsContent value="context" className="mt-4">
                    <PersonalContextPanel
                      context={personalContext}
                      onContextChange={onUpdatePersonalContext}
                    />
                  </TabsContent>
                  
                  <TabsContent value="direct" className="mt-4">
                    <DirectInputPanel
                      onGenerateResponse={onGenerateDirectResponse}
                      isProcessing={isProcessing}
                      geminiApiKey={selectedProvider === 'gemini' ? geminiApiKey : chatgptApiKey}
                    />
                  </TabsContent>
                </Tabs>

                {/* Quick Stats */}
                <Card className="glass-effect border-border/50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {transcriptCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Transcripts
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-success">
                          {aiResponseCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          AI Responses
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {collapsed && (
              <div className="flex flex-col items-center gap-4 p-2">
                <Badge variant="secondary" className="w-10 h-6 p-0 text-xs">
                  {transcriptCount}
                </Badge>
                <Badge variant="secondary" className="w-10 h-6 p-0 text-xs">
                  {aiResponseCount}
                </Badge>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}