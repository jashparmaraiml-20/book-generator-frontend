import { useState } from 'react';
import { BookGenerationForm } from './BookGenerationForm';
import { BookPlus, BookOpen, Settings, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SidebarProps {
  currentProject: string | null;
  setCurrentProject: (id: string | null) => void;
  allBooks: any[];
  fetchAllBooks: () => void;
  autoRefresh: boolean;
  setAutoRefresh: (value: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (value: number) => void;
  setShowHealth: (value: boolean) => void;
}

export function Sidebar({
  currentProject,
  setCurrentProject,
  allBooks,
  fetchAllBooks,
  autoRefresh,
  setAutoRefresh,
  refreshInterval,
  setRefreshInterval,
  setShowHealth
}: SidebarProps) {
  return (
    <div className="w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-slate-900 mb-1">🚀 Quick Start</h2>
        <p className="text-slate-600">Create and manage your AI books</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="new" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-6 mt-4">
          <TabsTrigger value="new" className="flex items-center gap-2">
            <BookPlus className="size-4" />
            New Book
          </TabsTrigger>
          <TabsTrigger value="library" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            All Books
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="new" className="p-6 mt-0">
            <BookGenerationForm 
              onProjectCreated={(projectId) => setCurrentProject(projectId)}
            />
          </TabsContent>

          <TabsContent value="library" className="p-6 mt-0 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-700">
                {allBooks.length} {allBooks.length === 1 ? 'Book' : 'Books'} Found
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchAllBooks}
              >
                🔄 Refresh
              </Button>
            </div>

            {allBooks.length > 0 ? (
              <div className="space-y-2">
                {allBooks.map((book) => {
                  const progress = book.progress_percentage || 0;
                  let badge = '⏳';
                  if (progress >= 100) badge = '✅';
                  else if (book.status === 'in_progress') badge = '🔄';

                  return (
                    <button
                      key={book.id}
                      onClick={() => {
                        setCurrentProject(book.id);
                        setShowHealth(false);
                      }}
                      className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{badge}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-slate-900 truncate group-hover:text-purple-700">
                            {book.title}
                          </h3>
                          <p className="text-slate-500">
                            {progress}% complete
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <BookOpen className="size-12 mx-auto mb-4 opacity-30" />
                <p>No books found</p>
                <p className="text-slate-400">Create your first book!</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Settings */}
      <div className="p-6 border-t border-slate-200 space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="size-4 text-slate-600" />
          <h3 className="text-slate-900">Settings</h3>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-refresh" className="text-slate-700">
            Auto-refresh
          </Label>
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Refresh Interval</Label>
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(Number(value))}
            disabled={!autoRefresh}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">60 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setShowHealth(true);
            setCurrentProject(null);
          }}
        >
          <Activity className="size-4 mr-2" />
          System Health
        </Button>
      </div>
    </div>
  );
}
