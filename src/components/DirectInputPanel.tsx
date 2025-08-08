import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DirectInputPanelProps {
  onGenerateResponse: (text: string) => Promise<void>;
  isProcessing: boolean;
  geminiApiKey: string;
}

export const DirectInputPanel: React.FC<DirectInputPanelProps> = ({
  onGenerateResponse,
  isProcessing,
  geminiApiKey,
}) => {
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Enter a question',
        description: 'Please enter a question to ask the AI',
        variant: 'destructive',
      });
      return;
    }

    if (!geminiApiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please set your AI provider API key in AI Setup tab',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsGenerating(true);
      await onGenerateResponse(inputText);
      setInputText('');
      toast({
        title: 'Response Generated',
        description: 'Check the AI responses panel for the answer',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Ask AI Directly
          </div>
          {geminiApiKey ? (
            <Badge variant="default" className="text-xs">
              API Connected
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              API Key Missing
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question here... (Ctrl+Enter to send)"
            className="min-h-[120px] resize-none"
            disabled={isGenerating || isProcessing}
          />
          
          <Button
            onClick={handleSubmit}
            disabled={!inputText.trim() || !geminiApiKey || isGenerating || isProcessing}
            className="w-full"
          >
            {isGenerating || isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Ask AI
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Tip:</strong> Use Ctrl+Enter to quickly send your question</p>
          <p>🎯 Ask about interview questions, technical concepts, or practice scenarios</p>
        </div>
      </CardContent>
    </Card>
  );
};