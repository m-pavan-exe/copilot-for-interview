import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIResponse } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Bot, Copy, Check, Sparkles, Minimize2, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MaximizedAIPanelProps {
  aiResponses: AIResponse[];
  isProcessing: boolean;
  onClose: () => void;
}

export const MaximizedAIPanel: React.FC<MaximizedAIPanelProps> = ({
  aiResponses,
  isProcessing,
  onClose,
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] glass-effect border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bot className="h-6 w-6 text-success" />
              AI Responses (Maximized)
              {aiResponses.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {aiResponses.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="space-y-6 pr-4">
              {aiResponses.map((response) => (
                <div
                  key={response.id}
                  className="slide-up p-6 rounded-lg bg-success/5 border border-success/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Bot className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <Badge variant="outline" className="text-sm border-success/30 text-success">
                          Question
                        </Badge>
                        <p className="text-base text-muted-foreground mt-2 italic">
                          "{response.question}"
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <Badge variant="outline" className="text-sm border-primary/30 text-primary">
                          Suggested Response
                        </Badge>
                        <p className="text-base leading-relaxed mt-2 whitespace-pre-wrap">
                          {response.response}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(response.timestamp, { addSuffix: true })}
                        </p>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(response.response, response.id)}
                          className="h-8 px-3 text-sm hover:bg-success/10"
                        >
                          {copiedId === response.id ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="p-6 rounded-lg bg-warning/5 border border-warning/20 pulse-subtle">
                  <div className="flex items-center gap-4">
                    <Sparkles className="h-5 w-5 text-warning animate-pulse" />
                    <p className="text-base text-muted-foreground">
                      Generating AI response...
                    </p>
                  </div>
                </div>
              )}
              
              {aiResponses.length === 0 && !isProcessing && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No AI responses yet</p>
                  <p className="text-sm">Ask questions to get AI-powered responses</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};