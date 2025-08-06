import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TranscriptEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot, MessageSquare, X } from 'lucide-react';

interface TranscriptPanelProps {
  transcripts: TranscriptEntry[];
  interimTranscript: string;
  onAskGemini?: (selectedText: string) => void;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcripts,
  interimTranscript,
  onAskGemini,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interimTranscript]);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      setSelectedText(text);
      
      // Get the position of the selection to position the floating button
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setButtonPosition({
        x: rect.right + 10,
        y: rect.top - 40
      });
      
      setShowFloatingButton(true);
    } else {
      setShowFloatingButton(false);
      setSelectedText('');
    }
  }, []);

  const handleAskGemini = () => {
    if (selectedText && onAskGemini) {
      const questionText = `Please explain or help me understand this: "${selectedText}"`;
      onAskGemini(questionText);
      
      // Clear selection and hide button
      window.getSelection()?.removeAllRanges();
      setShowFloatingButton(false);
      setSelectedText('');
    }
  };

  const handleClearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setShowFloatingButton(false);
    setSelectedText('');
  };

  // Hide floating button when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showFloatingButton) {
        setTimeout(() => {
          const selection = window.getSelection();
          if (!selection || selection.toString().trim().length === 0) {
            setShowFloatingButton(false);
            setSelectedText('');
          }
        }, 100);
      }
    };

    document.addEventListener('mouseup', handleClickOutside);
    return () => document.removeEventListener('mouseup', handleClickOutside);
  }, [showFloatingButton]);

  return (
    <div className="relative">
      <Card className="glass-effect border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            Live Transcript
            {transcripts.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {transcripts.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64" ref={scrollRef}>
            <div 
              className="space-y-3" 
              onMouseUp={handleTextSelection}
              style={{ userSelect: 'text' }}
            >
              {transcripts.map((transcript, index) => (
                <div
                  key={transcript.id}
                  className="slide-up p-3 rounded-lg bg-muted/50 border border-border/30"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">
                      {transcript.isUser ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <Bot className="h-4 w-4 text-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed break-words select-text">
                        {transcript.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(transcript.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {interimTranscript && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 pulse-subtle">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic select-text">
                      {interimTranscript}
                    </p>
                  </div>
                </div>
              )}
              
              {transcripts.length === 0 && !interimTranscript && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transcripts yet</p>
                  <p className="text-xs">Start speaking to see transcriptions here</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Floating Action Button for Selected Text */}
      {showFloatingButton && onAskGemini && (
        <div
          className="fixed z-50 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg border animate-in slide-in-from-top-2"
          style={{
            left: Math.min(buttonPosition.x, window.innerWidth - 300),
            top: Math.max(buttonPosition.y, 10),
          }}
        >
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAskGemini}
              className="h-8 px-3 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Ask Gemini
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearSelection}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};