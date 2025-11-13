import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown, Rocket, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { API_ROUTES } from '../config';

interface BookGenerationFormProps {
  onProjectCreated: (projectId: string) => void;
}

export function BookGenerationForm({ onProjectCreated }: BookGenerationFormProps) {
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('technology');
  const [targetAudience, setTargetAudience] = useState('');
  const [chapterCount, setChapterCount] = useState([8]);
  const [targetLength, setTargetLength] = useState([15000]);
  const [writingStyle, setWritingStyle] = useState('informative');
  const [language, setLanguage] = useState('en');
  const [customRequirements, setCustomRequirements] = useState('');

  const categories = [
    { value: 'technology', label: '🖥️ Technology & Programming' },
    { value: 'business', label: '💼 Business & Entrepreneurship' },
    { value: 'health', label: '🏥 Health & Wellness' },
    { value: 'finance', label: '💰 Personal Finance' },
    { value: 'education', label: '🎓 Education & Learning' },
    { value: 'lifestyle', label: '🌟 Lifestyle & Self-Help' },
  ];

  const styles = [
    'informative', 'conversational', 'technical',
    'professional', 'academic', 'creative'
  ];

  const languages = [
    { value: 'en', label: '🇺🇸 English' },
    { value: 'es', label: '🇪🇸 Spanish' },
    { value: 'fr', label: '🇫🇷 French' },
    { value: 'de', label: '🇩🇪 German' },
    { value: 'it', label: '🇮🇹 Italian' },
    { value: 'pt', label: '🇵🇹 Portuguese' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAudience) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_ROUTES.CREATE_BOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          category,
          target_audience: targetAudience,
          writing_style: writingStyle,
          chapter_count: chapterCount[0],
          target_length: targetLength[0],
          language,
          custom_requirements: customRequirements,
          output_formats: ['txt', 'md', 'json']
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Book generation started! Project ID: ${result.project_id.substring(0, 8)}...`);
        onProjectCreated(result.project_id);
        
        // Reset form
        setTitle('');
        setTargetAudience('');
        setCustomRequirements('');
      } else {
        toast.error('Failed to start generation');
      }
    } catch (error) {
      toast.error('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Book Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Complete Guide to Python Programming"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Target Audience *</Label>
        <Input
          id="audience"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="e.g., Beginner programmers, Business professionals"
          required
        />
      </div>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
          <ChevronDown className={`size-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          Advanced Settings
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label>Chapters: {chapterCount[0]}</Label>
              <Slider
                value={chapterCount}
                onValueChange={setChapterCount}
                min={3}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-3">
              <Label>Target Length: {targetLength[0].toLocaleString()} words</Label>
              <Slider
                value={targetLength}
                onValueChange={setTargetLength}
                min={5000}
                max={50000}
                step={1000}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Writing Style</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Custom Requirements</Label>
            <Textarea
              id="requirements"
              value={customRequirements}
              onChange={(e) => setCustomRequirements(e.target.value)}
              placeholder="Any specific requirements or preferences..."
              rows={4}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Starting Generation...
          </>
        ) : (
          <>
            <Rocket className="size-4 mr-2" />
            Generate Book
          </>
        )}
      </Button>
    </form>
  );
}
