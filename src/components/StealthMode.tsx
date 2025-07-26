import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface StealthModeProps {
  isListening: boolean;
  onClick: () => void;
}

export const StealthMode: React.FC<StealthModeProps> = ({ isListening, onClick }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={onClick}
        size="sm"
        variant="ghost"
        className={`
          relative h-8 w-8 rounded-full p-0 shadow-lg backdrop-blur-sm border
          ${isListening 
            ? 'bg-success/20 border-success/30 hover:bg-success/30' 
            : 'bg-background/20 border-border/30 hover:bg-background/30'
          }
          transition-all duration-300 hover:scale-110
        `}
      >
        <Eye className="h-4 w-4" />
        
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
            <div className="absolute top-0 right-0 h-2 w-2 bg-success rounded-full animate-pulse" />
          </>
        )}
      </Button>
    </div>
  );
};