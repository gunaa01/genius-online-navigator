import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export interface ContentFormProps {
  mode: 'ai-assisted' | 'manual';
  initialContent?: string;
  onGenerate?: (prompt: string) => Promise<string>;
  onSubmit: (content: string) => void;
}

export const ContentForm = ({
  mode,
  initialContent = '',
  onGenerate,
  onSubmit
}: ContentFormProps) => {
  const [content, setContent] = useState(initialContent);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();

  // GDPR compliance
  const [showWarning, setShowWarning] = useState(true);
  
  // Auto-save drafts every 2 minutes
  useEffect(() => {
    if (mode === 'manual') {
      const interval = setInterval(() => {
        localStorage.setItem('contentDraft', content);
      }, 120000);
      return () => clearInterval(interval);
    }
  }, [content, mode]);

  const handleGenerate = async () => {
    if (!onGenerate) return;
    setIsGenerating(true);
    try {
      const generated = await onGenerate(content);
      setContent(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {showWarning && (
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">GDPR Notice</h3>
          <p>All content is stored securely and anonymized for quality purposes.</p>
          <Button 
            size="sm" 
            className="mt-2"
            onClick={() => setShowWarning(false)}
          >
            Acknowledge
          </Button>
        </div>
      )}

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content..."
        className="min-h-[300px]"
      />

      <div className="flex gap-2 justify-end">
        {mode === 'ai-assisted' && (
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'AI Enhance'}
          </Button>
        )}
        <Button
          type="button"
          onClick={() => onSubmit(content)}
        >
          Submit Content
        </Button>
      </div>
    </div>
  );
};
