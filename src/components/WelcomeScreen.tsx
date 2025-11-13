import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, BookOpen, Download, Target, Activity, CheckCircle, XCircle } from 'lucide-react';
import { API_ROUTES } from '../config';

interface WelcomeScreenProps {
  backendUrl: string;
}

export function WelcomeScreen({ backendUrl }: WelcomeScreenProps) {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      const url = backendUrl ? `${backendUrl}/health` : API_ROUTES.HEALTH;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-slate-900 mb-2">Welcome to Agentic RAG Book Generator! 👋</h2>
        <p className="text-slate-600">
          Create professional AI-generated books with our multi-agent orchestration system
        </p>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="size-6 text-purple-600" />
            </div>
            <h3 className="text-slate-900">AI-Powered Writing</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            <li>• Multi-agent orchestration</li>
            <li>• Advanced RAG architecture</li>
            <li>• Quality-focused generation</li>
            <li>• Real-time progress tracking</li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Download className="size-6 text-blue-600" />
            </div>
            <h3 className="text-slate-900">Multiple Formats</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            <li>• TXT for plain text</li>
            <li>• Markdown for formatting</li>
            <li>• JSON for data processing</li>
            <li>• Easy downloads</li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="size-6 text-green-600" />
            </div>
            <h3 className="text-slate-900">Smart Categories</h3>
          </div>
          <ul className="space-y-2 text-slate-600">
            <li>• Technology & Programming</li>
            <li>• Business & Entrepreneurship</li>
            <li>• Health & Wellness</li>
            <li>• Personal Finance</li>
          </ul>
        </Card>
      </div>

      {/* System Overview */}
      {health && (
        <Card className="p-6">
          <h3 className="text-slate-900 mb-6">📈 System Overview</h3>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                {health.status === 'healthy' ? (
                  <CheckCircle className="size-5 text-green-600" />
                ) : (
                  <XCircle className="size-5 text-red-600" />
                )}
                <span className="text-slate-900">System Status</span>
              </div>
              <Badge variant={health.status === 'healthy' ? 'default' : 'destructive'}>
                {health.status === 'healthy' ? '🟢 Healthy' : '🔴 Issues'}
              </Badge>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="size-5 text-blue-600" />
                <span className="text-slate-900">Agents</span>
              </div>
              <p className="text-slate-600">
                {health.agents?.total_agents || 0} Active
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-5 text-purple-600" />
                <span className="text-slate-900">Projects</span>
              </div>
              <p className="text-slate-600">
                {health.agents?.active_workflows || 0} Active
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="size-5 text-amber-600" />
                <span className="text-slate-900">Version</span>
              </div>
              <p className="text-slate-600">
                {health.version || 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Getting Started */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
        <h3 className="text-slate-900 mb-4">🚀 Getting Started</h3>
        
        <div className="space-y-4 text-slate-700">
          <div className="flex gap-3">
            <div className="flex items-center justify-center size-8 bg-purple-600 text-white rounded-full flex-shrink-0">
              1
            </div>
            <div>
              <strong>Configure Your Book:</strong> Use the sidebar "New Book" tab to set title, category, and preferences
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center size-8 bg-purple-600 text-white rounded-full flex-shrink-0">
              2
            </div>
            <div>
              <strong>Start Generation:</strong> Click "Generate Book" to begin the AI writing process
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center size-8 bg-purple-600 text-white rounded-full flex-shrink-0">
              3
            </div>
            <div>
              <strong>Monitor Progress:</strong> Watch real-time progress as agents work together
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center size-8 bg-purple-600 text-white rounded-full flex-shrink-0">
              4
            </div>
            <div>
              <strong>Download Results:</strong> Get your completed book in multiple formats (TXT, Markdown, JSON)
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center justify-center size-8 bg-purple-600 text-white rounded-full flex-shrink-0">
              5
            </div>
            <div>
              <strong>Browse All Books:</strong> Use the "All Books" tab to view all your generated books
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-8">
        <h3 className="text-slate-900 mb-6">✨ Key Features</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-slate-800 mb-2">🎯 Intelligent Category Selection</h4>
            <p className="text-slate-600">
              AI automatically selects the best category for your content based on advanced analysis
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 mb-2">🔍 Comprehensive Research</h4>
            <p className="text-slate-600">
              Multi-source knowledge acquisition and thorough fact-checking for accuracy
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 mb-2">✏️ Professional Writing</h4>
            <p className="text-slate-600">
              High-quality content generation with proper structure and engaging narrative
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 mb-2">✅ Quality Assurance</h4>
            <p className="text-slate-600">
              Built-in editing and quality control processes ensure polished final output
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 mb-2">📦 Multi-Format Output</h4>
            <p className="text-slate-600">
              Download in TXT, Markdown, or JSON formats for maximum flexibility
            </p>
          </div>

          <div>
            <h4 className="text-slate-800 mb-2">📊 Real-time Progress</h4>
            <p className="text-slate-600">
              Monitor generation progress with detailed stage information and ETAs
            </p>
          </div>
        </div>
      </Card>

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-slate-600 mb-4">
          Ready to create your first AI-generated book?
        </p>
        <p className="text-purple-600">
          Use the sidebar to get started! →
        </p>
      </div>
    </div>
  );
}
