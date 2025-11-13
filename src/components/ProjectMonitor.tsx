import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import {
  RefreshCw,
  X,
  Eye,
  Download,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';
import { API_ROUTES } from '../config';
import ReactMarkdown from "react-markdown";

interface ProjectMonitorProps {
  projectId: string;
  autoRefresh: boolean;
  refreshInterval: number;
  onCancel: () => void;
}

export function ProjectMonitor({
  projectId,
  autoRefresh,
  refreshInterval,
  onCancel
}: ProjectMonitorProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookContent, setBookContent] = useState<any>(null);
  const [showContent, setShowContent] = useState(false);

  // --- UNIVERSAL LLM CLEANER ---
  const cleanLLMOutput = (raw: any) => {
    if (!raw) return "";

    let text = String(raw);

    // Remove code fences
    text = text
      .replace(/```json/g, "")
      .replace(/```python/g, "")
      .replace(/```/g, "");

    // Remove triple quotes """ """
    text = text.replace(/"""/g, "");

    // Try parsing root JSON (chapters sometimes wrapped)
    if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
      try {
        const parsed = JSON.parse(text);
        if (parsed.content) return parsed.content;
        if (parsed.chapter_content) return parsed.chapter_content;
      } catch {
        // not JSON; ignore
      }
    }

    // Remove inline JSON keys if present
    text = text
      .replace(/"title":\s*"[^"]*",?/g, "")
      .replace(/"summary":\s*"[^"]*",?/g, "")
      .replace(/"key_takeaways":\s*\[[\s\S]*?\],?/g, "")
      .replace(/"content":\s*"/g, "")
      .replace(/"}$/g, "");

    // Remove escaped quotes
    text = text.replace(/\\"/g, '"');

    return text.trim();
  };

  useEffect(() => {
    fetchStatus();
  }, [projectId]);

  useEffect(() => {
    if (autoRefresh && status?.progress_percentage < 100) {
      const interval = setInterval(fetchStatus, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, status?.progress_percentage]);

  const fetchStatus = async () => {
    try {
      const response = await fetch(API_ROUTES.projectStatus(projectId));
      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(API_ROUTES.cancelProject(projectId), {
        method: 'DELETE',
      });
      if (response.ok) {
        toast.success('Project cancelled');
        onCancel();
      }
    } catch (error) {
      toast.error('Failed to cancel project');
    }
  };

  const viewContent = async () => {
    try {
      const response = await fetch(API_ROUTES.viewBook(projectId));
      if (response.ok) {
        const data = await response.json();

        // Clean each chapter output
        data.chapters = data.chapters.map((ch: any) => ({
          ...ch,
          content: cleanLLMOutput(ch.content || ch.raw_output)
        }));

        setBookContent(data);
        setShowContent(true);
      }
    } catch (error) {
      toast.error('Failed to load content');
    }
  };

  const downloadBook = async (format: string) => {
    try {
      const response = await fetch(API_ROUTES.downloadBook(projectId, format));
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `book_${projectId.substring(0, 8)}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`Downloaded ${format.toUpperCase()} file`);
      } else {
        toast.error('Download failed');
      }
    } catch (error) {
      toast.error('Download error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!status) {
    return (
      <Alert>
        <AlertCircle className="size-4" />
        <AlertDescription>Failed to load project status</AlertDescription>
      </Alert>
    );
  }

  const progress = status.progress_percentage || 0;
  const completedStages = status.completed_stages || [];
  const failedStages = status.failed_stages || [];
  const currentStage = status.current_stage || 'Unknown';

  const stages = [
    { id: 'category_selection', name: '📋 Category Selection' },
    { id: 'research_planning', name: '🔍 Research Planning' },
    { id: 'knowledge_acquisition', name: '📚 Knowledge Acquisition' },
    { id: 'fact_checking', name: '✅ Fact Checking' },
    { id: 'content_generation', name: '✏️ Content Generation' },
    { id: 'illustration', name: '🎨 Illustration' },
    { id: 'editing_qa', name: '📝 Editing & QA' },
    { id: 'publication', name: '📖 Publication' },
  ];

  const getElapsedTime = () => {
    if (!status.started_at) return 'N/A';
    const start = new Date(status.started_at);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-1">
            📖 Project: {projectId.substring(0, 8)}...
          </h2>
          <p className="text-slate-600">Monitor your book generation progress</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchStatus}>
            <RefreshCw className="size-4 mr-2" />
            Refresh
          </Button>
          {progress >= 100 && (
            <Button variant="outline" size="sm" onClick={viewContent}>
              <Eye className="size-4 mr-2" />
              View Content
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <X className="size-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">📊 Progress Overview</h3>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-slate-700">{progress.toFixed(1)}% Complete</span>
            <span className="text-slate-600">Stage: {currentStage}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Target className="size-4" />
              <span className="text-purple-900">Progress</span>
            </div>
            <p className="text-slate-600">{progress.toFixed(1)}%</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <CheckCircle2 className="size-4" />
              <span className="text-blue-900">Stages</span>
            </div>
            <p className="text-slate-600">{completedStages.length}/8 Completed</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Clock className="size-4" />
              <span className="text-green-900">Elapsed</span>
            </div>
            <p className="text-slate-600">{getElapsedTime()}</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Clock className="size-4" />
              <span className="text-amber-900">ETA</span>
            </div>
            <p className="text-slate-600">
              {status.estimated_completion ? 'Calculating...' : 'Soon!'}
            </p>
          </div>
        </div>
      </Card>

      {/* Download Section */}
      {progress >= 100 && (
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">📥 Download Your Book</h3>
          <div className="grid grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => downloadBook('txt')}
            >
              <Download className="size-5 mb-2" />
              TXT
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => downloadBook('md')}
            >
              <Download className="size-5 mb-2" />
              Markdown
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={() => downloadBook('json')}
            >
              <Download className="size-5 mb-2" />
              JSON
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-4"
              onClick={viewContent}
            >
              <Eye className="size-5 mb-2" />
              View
            </Button>
          </div>
        </Card>
      )}

      {/* Workflow Stages */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">📄 Workflow Stages</h3>
        <div className="grid grid-cols-4 gap-3">
          {stages.map((stage) => {
            const isCompleted = completedStages.includes(stage.id);
            const isFailed = failedStages.includes(stage.id);
            const isCurrent = stage.id === currentStage;

            return (
              <Badge
                key={stage.id}
                variant={
                  isCompleted
                    ? 'default'
                    : isFailed
                    ? 'destructive'
                    : isCurrent
                    ? 'secondary'
                    : 'outline'
                }
                className="justify-center py-2"
              >
                {isCompleted && '✅ '}
                {isFailed && '❌ '}
                {isCurrent && '🔄 '}
                {!isCompleted && !isFailed && !isCurrent && '⏳ '}
                {stage.name}
              </Badge>
            );
          })}
        </div>
      </Card>

      {/* Errors */}
      {status.errors && status.errors.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-red-900 mb-4">⚠️ Issues</h3>
          <div className="space-y-2">
            {status.errors.slice(-3).map((error: any, index: number) => (
              <Alert key={index} variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  <strong>{error.stage || 'Unknown'}:</strong>{' '}
                  {error.error || 'Unknown error'}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Book Content Modal */}
      {showContent && bookContent && (
        <Card className="p-6 max-h-96 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">📖 Full Book Content</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowContent(false)}>
              <X className="size-4" />
            </Button>
          </div>

          <div className="prose max-w-none">
            <h1>{bookContent.project?.title}</h1>
            <p>
              <strong>Category:</strong> {bookContent.project?.category}
            </p>
            <p>
              <strong>Target Audience:</strong> {bookContent.project?.target_audience}
            </p>
            <p>
              <strong>Writing Style:</strong> {bookContent.project?.writing_style}
            </p>
            <hr />

            {bookContent.chapters?.map((chapter: any) => (
              <div key={chapter.chapter_number}>
                <h2>
                  Chapter {chapter.chapter_number}: {chapter.title}
                </h2>

                <ReactMarkdown>
                  {chapter.content || "*Content not yet generated*"}
                </ReactMarkdown>

                <p className="text-slate-500">
                  Words: {chapter.word_count || 0} | Status: {chapter.status}
                </p>
                <hr />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
