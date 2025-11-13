import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ProjectMonitor } from './components/ProjectMonitor';
import { SystemHealth } from './components/SystemHealth';
import { API_ROUTES, BACKEND_URL } from './config';

export default function App() {
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [showHealth, setShowHealth] = useState(false);

  // Fetch all books on mount
  const fetchAllBooks = useCallback(async () => {
    try {
      const response = await fetch(API_ROUTES.BOOKS_LIST);
      if (response.ok) {
        const data = await response.json();
        setAllBooks(data.books || []);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllBooks();
  }, [fetchAllBooks]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    fetchAllBooks();
    const intervalId = window.setInterval(fetchAllBooks, refreshInterval * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval, fetchAllBooks]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <Sidebar
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        allBooks={allBooks}
        fetchAllBooks={fetchAllBooks}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        setShowHealth={setShowHealth}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
          <div className="px-8 py-6">
            <h1 className="mb-2">📚 Agentic RAG Book Generator</h1>
            <p className="text-purple-100">AI-Powered Book Creation with Multi-Agent Orchestration</p>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {showHealth ? (
            <SystemHealth backendUrl={BACKEND_URL} />
          ) : currentProject ? (
            <ProjectMonitor
              projectId={currentProject}
              autoRefresh={autoRefresh}
              refreshInterval={refreshInterval}
              onCancel={() => setCurrentProject(null)}
            />
          ) : (
            <WelcomeScreen backendUrl={BACKEND_URL} />
          )}
        </main>
      </div>
    </div>
  );
}
