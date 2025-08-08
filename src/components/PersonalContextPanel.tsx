import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Save, FileText } from 'lucide-react';

export interface PersonalContext {
  name: string;
  role: string;
  experience: string;
  education: string;
  skills: string;
  resume: string;
}

interface PersonalContextPanelProps {
  context: PersonalContext;
  onContextChange: (context: PersonalContext) => void;
}

export function PersonalContextPanel({
  context,
  onContextChange,
}: PersonalContextPanelProps) {
  const [localContext, setLocalContext] = useState<PersonalContext>(context);
  const [isSaved, setIsSaved] = useState(true);

  const handleInputChange = (field: keyof PersonalContext, value: string) => {
    setLocalContext(prev => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onContextChange(localContext);
    setIsSaved(true);
  };

  const getContextSummary = () => {
    const fields = Object.values(localContext).filter(value => value.trim()).length;
    return `${fields}/6 fields completed`;
  };

  const hasContext = () => {
    return Object.values(localContext).some(value => value.trim());
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            Personal Context
          </CardTitle>
          <Badge 
            variant={hasContext() ? "default" : "secondary"}
            className={hasContext() ? "gradient-primary text-white" : ""}
          >
            {getContextSummary()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Your full name"
              value={localContext.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Current/Target Role</Label>
            <Input
              id="role"
              placeholder="e.g., Software Engineer, Data Scientist"
              value={localContext.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Work Experience</Label>
            <Textarea
              id="experience"
              placeholder="Brief summary of your work experience, key projects, and achievements..."
              value={localContext.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              rows={3}
            />
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              placeholder="Your educational background, degrees, certifications..."
              value={localContext.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              rows={2}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Key Skills</Label>
            <Textarea
              id="skills"
              placeholder="Programming languages, frameworks, tools, soft skills..."
              value={localContext.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              rows={2}
            />
          </div>

          {/* Resume/CV */}
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV Summary</Label>
            <Textarea
              id="resume"
              placeholder="Paste key sections of your resume or CV for more personalized responses..."
              value={localContext.resume}
              onChange={(e) => handleInputChange('resume', e.target.value)}
              rows={4}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" />
            This context will be included in AI responses
          </div>
          <Button 
            onClick={handleSave}
            size="sm"
            disabled={isSaved}
            variant={isSaved ? "secondary" : "default"}
          >
            <Save className="h-3 w-3 mr-1" />
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}