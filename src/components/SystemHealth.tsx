import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Database, 
  Brain,
  Zap,
  Server
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { API_ROUTES } from '../config';

interface SystemHealthProps {
  backendUrl: string;
}

export function SystemHealth({ backendUrl }: SystemHealthProps) {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => clearInterval(interval);
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-slate-900 mb-2">System Health Dashboard</h2>
        <p className="text-slate-600">Monitor the health and status of all system components</p>
      </div>

      {/* Overall Status */}
      <Card className={`p-6 ${isHealthy ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isHealthy ? (
              <CheckCircle className="size-12 text-green-600" />
            ) : (
              <XCircle className="size-12 text-red-600" />
            )}
            <div>
              <h3 className={isHealthy ? 'text-green-900' : 'text-red-900'}>
                System Status
              </h3>
              <p className={isHealthy ? 'text-green-700' : 'text-red-700'}>
                {isHealthy ? 'All systems operational' : 'System issues detected'}
              </p>
            </div>
          </div>
          <Badge variant={isHealthy ? 'default' : 'destructive'} className="text-lg px-4 py-2">
            {health?.status?.toUpperCase() || 'UNKNOWN'}
          </Badge>
        </div>
      </Card>

      {/* Database Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Database className="size-6 text-blue-600" />
          </div>
          <h3 className="text-slate-900">Database Health</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Status</p>
            <Badge variant={health?.database?.status === 'healthy' ? 'default' : 'destructive'}>
              {health?.database?.status || 'Unknown'}
            </Badge>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Type</p>
            <p className="text-slate-900">{health?.database?.type || 'N/A'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Connected</p>
            <p className="text-slate-900">
              {health?.database?.connected ? '✅ Yes' : '❌ No'}
            </p>
          </div>
        </div>
      </Card>

      {/* Services Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Server className="size-6 text-purple-600" />
          </div>
          <h3 className="text-slate-900">Services Health</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {health?.services && Object.entries(health.services).map(([key, value]: [string, any]) => {
            const isServiceHealthy = value?.status === 'healthy';
            return (
              <Card key={key} className={`p-4 ${isServiceHealthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isServiceHealthy ? (
                    <CheckCircle className="size-4 text-green-600" />
                  ) : (
                    <XCircle className="size-4 text-red-600" />
                  )}
                  <p className="text-slate-900">
                    {key.replace(/_/g, ' ').replace(/service/i, '').trim()}
                  </p>
                </div>
                <Badge variant={isServiceHealthy ? 'default' : 'destructive'}>
                  {value?.status || 'Unknown'}
                </Badge>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Agents Status */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Brain className="size-6 text-indigo-600" />
          </div>
          <h3 className="text-slate-900">AI Agents Status</h3>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
            <p className="text-slate-600 mb-1">Total Agents</p>
            <p className="text-slate-900">
              {health?.agents?.total_agents || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
            <p className="text-slate-600 mb-1">Active Agents</p>
            <p className="text-slate-900">
              {health?.agents?.active_agents || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <p className="text-slate-600 mb-1">Idle Agents</p>
            <p className="text-slate-900">
              {health?.agents?.idle_agents || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
            <p className="text-slate-600 mb-1">Active Workflows</p>
            <p className="text-slate-900">
              {health?.agents?.active_workflows || 0}
            </p>
          </div>
        </div>

        {/* Individual Agents */}
        {health?.agents?.agents && (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(health.agents.agents).map(([key, value]: [string, any]) => {
              const isAgentHealthy = value?.status === 'healthy' || value?.status === 'idle';
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">
                    {key.replace(/_/g, ' ').replace(/agent/i, '').trim()}
                  </span>
                  <Badge variant={isAgentHealthy ? 'default' : 'destructive'}>
                    {value?.status || 'Unknown'}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* System Info */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-slate-100 rounded-lg">
            <Zap className="size-6 text-slate-600" />
          </div>
          <h3 className="text-slate-900">System Information</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Version</p>
            <p className="text-slate-900">{health?.version || 'N/A'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Timestamp</p>
            <p className="text-slate-900">
              {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-slate-600 mb-1">Auto Refresh</p>
            <p className="text-slate-900">✅ Every 5s</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
