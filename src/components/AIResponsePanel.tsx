import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIResponse } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Bot, Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AIResponsePanelProps {
  aiResponses: AIResponse[];
  isProcessing: boolean;
}

export const AIResponsePanel: React.FC<AIResponsePanelProps> = ({
  aiResponses,
  isProcessing,
}) => {
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiResponses]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast({
        title: 'Copied to clipboard',
        description: 'Response copied successfully',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="h-5 w-5 text-success" />
          AI Responses
          {aiResponses.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {aiResponses.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64" ref={scrollRef}>
          <div className="space-y-4">
            {aiResponses.map((response) => (
              <div
                key={response.id}
                className="slide-up p-4 rounded-lg bg-success/5 border border-success/20"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs border-success/30 text-success">
                        Question
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        "{response.question}"
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        Suggested Response
                      </Badge>
                      <p className="text-sm leading-relaxed mt-1 whitespace-pre-wrap">
                        {response.response}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(response.timestamp, { addSuffix: true })}
                      </p>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(response.response, response.id)}
                        className="h-6 px-2 text-xs hover:bg-success/10"
                      >
                        {copiedId === response.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="p-4 rounded-lg bg-warning/5 border border-warning/20 pulse-subtle">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-warning animate-pulse" />
                  <p className="text-sm text-muted-foreground">
                    Generating AI response...
                  </p>
                </div>
              </div>
            )}
            
            {aiResponses.length === 0 && !isProcessing && (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No AI responses yet</p>
                <p className="text-xs">Ask questions to get AI-powered responses</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};