import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Key, 
  Trash2, 
  Eye, 
  EyeOff, 
  Keyboard,
  Mic,
  MicOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ControlPanelProps {
  isListening: boolean;
  isHidden: boolean;
  geminiApiKey: string;
  microphonePermission: 'granted' | 'denied' | 'prompt';
  onToggleListening: () => void;
  onToggleHidden: () => void;
  onUpdateGeminiApiKey: (apiKey: string) => void;
  onClearTranscripts: () => void;
  onRequestMicPermission: () => void;
  onGenerateTestResponse?: (text: string) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isListening,
  isHidden,
  geminiApiKey,
  microphonePermission,
  onToggleListening,
  onToggleHidden,
  onUpdateGeminiApiKey,
  onClearTranscripts,
  onRequestMicPermission,
  onGenerateTestResponse,
}) => {
  const { toast } = useToast();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testQuestion, setTestQuestion] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSaveApiKey = () => {
    onUpdateGeminiApiKey(apiKeyInput);
    setSettingsOpen(false);
  };

  const handleTestAI = () => {
    if (!testQuestion.trim()) {
      toast({
        title: 'Enter a question',
        description: 'Please enter a test question first',
        variant: 'destructive',
      });
      return;
    }
    
    if (onGenerateTestResponse) {
      onGenerateTestResponse(testQuestion);
      setTestQuestion('');
      toast({
        title: 'Test Response Generated',
        description: 'Check the AI responses panel',
      });
    }
  };

  const getMicrophoneStatus = () => {
    switch (microphonePermission) {
      case 'granted':
        return { label: 'Granted', variant: 'default' as const, color: 'text-success' };
      case 'denied':
        return { label: 'Denied', variant: 'destructive' as const, color: 'text-destructive' };
      default:
        return { label: 'Pending', variant: 'secondary' as const, color: 'text-warning' };
    }
  };

  const micStatus = getMicrophoneStatus();

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-primary" />
          Control Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Recording Status</Label>
            <Badge variant={isListening ? "default" : "secondary"} className="w-full justify-center">
              {isListening ? (
                <>
                  <Mic className="h-3 w-3 mr-1" />
                  Recording
                </>
              ) : (
                <>
                  <MicOff className="h-3 w-3 mr-1" />
                  Stopped
                </>
              )}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Microphone</Label>
            <Badge variant={micStatus.variant} className="w-full justify-center">
              <div className={`h-2 w-2 rounded-full mr-2 ${micStatus.color}`} />
              {micStatus.label}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={onToggleListening}
            className="text-xs"
          >
            {isListening ? (
              <>
                <MicOff className="h-3 w-3 mr-1" />
                Stop
              </>
            ) : (
              <>
                <Mic className="h-3 w-3 mr-1" />
                Start
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleHidden}
            className="text-xs"
          >
            {isHidden ? (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide
              </>
            )}
          </Button>
        </div>

        {/* Microphone Permission */}
        {microphonePermission !== 'granted' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRequestMicPermission}
            className="w-full text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Grant Microphone Access
          </Button>
        )}

        {/* Settings Dialog */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full text-xs">
              <Settings className="h-3 w-3 mr-1" />
              Advanced Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] glass-effect">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Configuration
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* API Key Configuration */}
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button onClick={handleSaveApiKey} size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from Google AI Studio
                </p>
              </div>

              {/* Test AI Response */}
              <div className="space-y-2">
                <Label htmlFor="test-question">Test AI Response</Label>
                <Textarea
                  id="test-question"
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  placeholder="Enter a test question to see how AI responds..."
                  className="min-h-[80px]"
                />
                <Button 
                  onClick={handleTestAI} 
                  size="sm" 
                  className="w-full"
                  disabled={!geminiApiKey || !testQuestion.trim()}
                >
                  Generate Test Response
                </Button>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Keyboard Shortcuts
                </Label>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Toggle Listening:</span>
                    <Badge variant="outline" className="text-xs">Ctrl + L</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Hide/Show Interface:</span>
                    <Badge variant="outline" className="text-xs">Ctrl + H</Badge>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Clear Data */}
        <Button
          variant="outline"
          size="sm"
          onClick={onClearTranscripts}
          className="w-full text-xs text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear All Data
        </Button>
      </CardContent>
    </Card>
  );
};