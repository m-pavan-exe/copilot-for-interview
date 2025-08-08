import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bot, Key } from 'lucide-react';

export type AIProvider = 'gemini' | 'chatgpt';

interface AIProviderSettingsProps {
  selectedProvider: AIProvider;
  geminiApiKey: string;
  chatgptApiKey: string;
  onProviderChange: (provider: AIProvider) => void;
  onGeminiApiKeyChange: (apiKey: string) => void;
  onChatGPTApiKeyChange: (apiKey: string) => void;
}

export function AIProviderSettings({
  selectedProvider,
  geminiApiKey,
  chatgptApiKey,
  onProviderChange,
  onGeminiApiKeyChange,
  onChatGPTApiKeyChange,
}: AIProviderSettingsProps) {
  const [localGeminiKey, setLocalGeminiKey] = useState(geminiApiKey);
  const [localChatGPTKey, setLocalChatGPTKey] = useState(chatgptApiKey);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalGeminiKey(geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    setLocalChatGPTKey(chatgptApiKey);
  }, [chatgptApiKey]);

  const handleGeminiKeySubmit = () => {
    console.log('=== Gemini API Key Save Debug ===');
    console.log('Local key length:', localGeminiKey.length);
    console.log('Key starts with:', localGeminiKey.substring(0, 10) + '...');
    onGeminiApiKeyChange(localGeminiKey);
    console.log('Save callback completed');
  };

  const handleChatGPTKeySubmit = () => {
    console.log('=== ChatGPT API Key Save Debug ===');
    console.log('Local key length:', localChatGPTKey.length);
    console.log('Key starts with:', localChatGPTKey.substring(0, 10) + '...');
    onChatGPTApiKeyChange(localChatGPTKey);
    console.log('Save callback completed');
  };

  const getCurrentApiKey = () => {
    const currentKey = selectedProvider === 'gemini' ? geminiApiKey : chatgptApiKey;
    console.log('Status check - Provider:', selectedProvider, 'Has key:', !!currentKey, 'Key length:', currentKey?.length || 0);
    return currentKey;
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4" />
          AI Provider
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider-select">Select AI Provider</Label>
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="chatgpt">OpenAI ChatGPT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge 
            variant={getCurrentApiKey() ? "default" : "secondary"}
            className={getCurrentApiKey() ? "gradient-success text-white" : ""}
          >
            {getCurrentApiKey() ? "Connected" : "Not Connected"}
          </Badge>
        </div>

        {/* API Key Input based on selected provider */}
        {selectedProvider === 'gemini' && (
          <div className="space-y-2">
            <Label htmlFor="gemini-key">Gemini API Key</Label>
            <div className="flex gap-2">
              <Input
                id="gemini-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={localGeminiKey}
                onChange={(e) => setLocalGeminiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleGeminiKeySubmit}
                size="sm"
                disabled={!localGeminiKey.trim()}
              >
                <Key className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {selectedProvider === 'chatgpt' && (
          <div className="space-y-2">
            <Label htmlFor="chatgpt-key">ChatGPT API Key</Label>
            <div className="flex gap-2">
              <Input
                id="chatgpt-key"
                type="password"
                placeholder="Enter your OpenAI API key"
                value={localChatGPTKey}
                onChange={(e) => setLocalChatGPTKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleChatGPTKeySubmit}
                size="sm"
                disabled={!localChatGPTKey.trim()}
              >
                <Key className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Your API key is stored locally and never sent to our servers.
        </div>
      </CardContent>
    </Card>
  );
}