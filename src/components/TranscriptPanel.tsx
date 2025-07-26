import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TranscriptEntry } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot } from 'lucide-react';

interface TranscriptPanelProps {
  transcripts: TranscriptEntry[];
  interimTranscript: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcripts,
  interimTranscript,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, interimTranscript]);

  return (
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
          <div className="space-y-3">
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
                    <p className="text-sm leading-relaxed break-words">
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
                  <p className="text-sm text-muted-foreground italic">
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
  );
};