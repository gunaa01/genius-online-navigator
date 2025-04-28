import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Save, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import * as contentGenerationService from '@/services/ai-content/contentGenerationService';

interface BrandVoiceFormProps {
  profile?: contentGenerationService.BrandVoiceProfile;
  onSave: (profile: Omit<contentGenerationService.BrandVoiceProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSaving: boolean;
}

/**
 * Brand Voice Profile Form
 * 
 * Form for creating and editing brand voice profiles
 */
export default function BrandVoiceForm({
  profile,
  onSave,
  isSaving
}: BrandVoiceFormProps) {
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState<string>('professional');
  const [toneAttributes, setToneAttributes] = useState<string[]>([]);
  const [toneAttributeInput, setToneAttributeInput] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [valueInput, setValueInput] = useState('');
  const [prohibitedWords, setProhibitedWords] = useState<string[]>([]);
  const [prohibitedWordInput, setProhibitedWordInput] = useState('');
  const [exampleContent, setExampleContent] = useState<string[]>(['']);
  
  // Set profile values if provided
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setDescription(profile.description);
      setStyle(profile.style);
      setToneAttributes(profile.toneAttributes);
      setValues(profile.values);
      setProhibitedWords(profile.prohibitedWords);
      setExampleContent(profile.exampleContent);
    }
  }, [profile]);
  
  // Add tone attribute
  const addToneAttribute = () => {
    if (toneAttributeInput.trim() && !toneAttributes.includes(toneAttributeInput.trim())) {
      setToneAttributes([...toneAttributes, toneAttributeInput.trim()]);
      setToneAttributeInput('');
    }
  };
  
  // Remove tone attribute
  const removeToneAttribute = (attribute: string) => {
    setToneAttributes(toneAttributes.filter(a => a !== attribute));
  };
  
  // Add value
  const addValue = () => {
    if (valueInput.trim() && !values.includes(valueInput.trim())) {
      setValues([...values, valueInput.trim()]);
      setValueInput('');
    }
  };
  
  // Remove value
  const removeValue = (value: string) => {
    setValues(values.filter(v => v !== value));
  };
  
  // Add prohibited word
  const addProhibitedWord = () => {
    if (prohibitedWordInput.trim() && !prohibitedWords.includes(prohibitedWordInput.trim())) {
      setProhibitedWords([...prohibitedWords, prohibitedWordInput.trim()]);
      setProhibitedWordInput('');
    }
  };
  
  // Remove prohibited word
  const removeProhibitedWord = (word: string) => {
    setProhibitedWords(prohibitedWords.filter(w => w !== word));
  };
  
  // Add example content
  const addExampleContent = () => {
    setExampleContent([...exampleContent, '']);
  };
  
  // Update example content
  const updateExampleContent = (index: number, content: string) => {
    const updatedExamples = [...exampleContent];
    updatedExamples[index] = content;
    setExampleContent(updatedExamples);
  };
  
  // Remove example content
  const removeExampleContent = (index: number) => {
    if (exampleContent.length > 1) {
      const updatedExamples = [...exampleContent];
      updatedExamples.splice(index, 1);
      setExampleContent(updatedExamples);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the brand voice profile.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a description for the brand voice profile.',
        variant: 'destructive',
      });
      return;
    }
    
    if (toneAttributes.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one tone attribute.',
        variant: 'destructive',
      });
      return;
    }
    
    // Filter out empty example content
    const filteredExamples = exampleContent.filter(example => example.trim() !== '');
    
    if (filteredExamples.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one example of content that reflects your brand voice.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Prepare profile data
      const profileData = {
        name,
        description,
        style,
        toneAttributes,
        values,
        prohibitedWords,
        exampleContent: filteredExamples,
      };
      
      // Save profile
      await onSave(profileData);
    } catch (error) {
      console.error('Error saving brand voice profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save brand voice profile. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{profile ? 'Edit' : 'Create'} Brand Voice Profile</CardTitle>
          <CardDescription>
            Define your brand's voice and tone for consistent messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name</Label>
            <Input
              id="name"
              placeholder="e.g., Professional, Friendly, Innovative"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and characteristics of this brand voice"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select
              value={style}
              onValueChange={setStyle}
            >
              <SelectTrigger id="style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone-attributes">Tone Attributes</Label>
            <div className="flex space-x-2">
              <Input
                id="tone-attributes"
                placeholder="e.g., authoritative, friendly, clear"
                value={toneAttributeInput}
                onChange={(e) => setToneAttributeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToneAttribute();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addToneAttribute}
                aria-label="Add tone attribute"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {toneAttributes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {toneAttributes.map((attribute) => (
                  <Badge
                    key={attribute}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {attribute}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => removeToneAttribute(attribute)}
                      aria-label={`Remove ${attribute}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="values">Brand Values</Label>
            <div className="flex space-x-2">
              <Input
                id="values"
                placeholder="e.g., innovation, reliability, expertise"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addValue();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addValue}
                aria-label="Add brand value"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {values.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {value}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => removeValue(value)}
                      aria-label={`Remove ${value}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prohibited-words">Prohibited Words/Phrases</Label>
            <div className="flex space-x-2">
              <Input
                id="prohibited-words"
                placeholder="e.g., slang, jargon, buzzwords"
                value={prohibitedWordInput}
                onChange={(e) => setProhibitedWordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addProhibitedWord();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addProhibitedWord}
                aria-label="Add prohibited word"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {prohibitedWords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {prohibitedWords.map((word) => (
                  <Badge
                    key={word}
                    variant="outline"
                    className="flex items-center gap-1 border-red-200 text-red-500"
                  >
                    {word}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                      onClick={() => removeProhibitedWord(word)}
                      aria-label={`Remove ${word}`}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Example Content</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExampleContent}
                aria-label="Add example content"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Example
              </Button>
            </div>
            <div className="space-y-4">
              {exampleContent.map((example, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`example-${index}`}>Example {index + 1}</Label>
                    {exampleContent.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExampleContent(index)}
                        aria-label={`Remove example ${index + 1}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`example-${index}`}
                    placeholder="Enter an example of content that reflects your brand voice"
                    value={example}
                    onChange={(e) => updateExampleContent(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
