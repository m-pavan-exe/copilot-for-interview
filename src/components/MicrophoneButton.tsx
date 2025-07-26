import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicrophoneButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  onClick: () => void;
  className?: string;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  isListening,
  isProcessing,
  onClick,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={isProcessing}
      variant={isListening ? "default" : "secondary"}
      size="lg"
      className={cn(
        "relative h-14 w-14 rounded-full p-0 transition-all duration-300",
        isListening && "gradient-success scale-110 recording-pulse",
        !isListening && "glass-effect hover:scale-105",
        className
      )}
    >
      {isProcessing ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isListening ? (
        <Mic className="h-6 w-6 text-white" />
      ) : (
        <MicOff className="h-6 w-6" />
      )}
      
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-success/10 animate-pulse" />
        </>
      )}
    </Button>
  );
};