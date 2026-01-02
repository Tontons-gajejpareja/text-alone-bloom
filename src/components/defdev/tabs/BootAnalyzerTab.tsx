import { useState, useEffect } from "react";
import { Power, Wifi, Database, HardDrive, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Cpu, Activity, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface BootEvent {
  id: string;
  phase: "init" | "network" | "storage" | "services" | "ui";
  name: string;
  status: "pending" | "running" | "success" | "failed" | "warning";
  duration?: number;
  startTime: number;
  endTime?: number;
  details?: string;
  port?: number;
}

interface ConnectionAttempt {
  id: string;
  target: string;
  port?: number;
  status: "success" | "failed" | "timeout";
  latency: number;
  timestamp: Date;
  error?: string;
}

export const BootAnalyzerTab = () => {
  const [bootEvents, setBootEvents] = useState<BootEvent[]>([]);
  const [connectionAttempts, setConnectionAttempts] = useState<ConnectionAttempt[]>([]);
  const [bootTime, setBootTime] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastBootData, setLastBootData] = useState<{ time: number; events: BootEvent[]; connections: ConnectionAttempt[] } | null>(null);

  // Load last boot data from localStorage
  useEffect(() => {
    const savedBoot = localStorage.getItem('defdev_last_boot');
    if (savedBoot) {
      setLastBootData(JSON.parse(savedBoot));
    }
    
    // Simulate current boot data
    simulateBootAnalysis();
  }, []);

  const simulateBootAnalysis = () => {
    const events: BootEvent[] = [
      { id: '1', phase: 'init', name: 'BIOS POST', status: 'success', startTime: 0, endTime: 150, duration: 150, details: 'Power-on self test completed' },
      { id: '2', phase: 'init', name: 'Memory Check', status: 'success', startTime: 150, endTime: 280, duration: 130, details: '4096MB RAM verified' },
      { id: '3', phase: 'init', name: 'CPU Init', status: 'success', startTime: 280, endTime: 350, duration: 70, details: 'Virtual x86-64 @ 2.4GHz' },
      { id: '4', phase: 'network', name: 'Port 21 (FTP)', status: 'failed', startTime: 350, endTime: 520, duration: 170, port: 21, details: 'Connection refused' },
      { id: '5', phase: 'network', name: 'Port 80 (HTTP)', status: 'success', startTime: 520, endTime: 620, duration: 100, port: 80, details: 'HTTP ready' },
      { id: '6', phase: 'network', name: 'Port 443 (HTTPS)', status: 'success', startTime: 620, endTime: 720, duration: 100, port: 443, details: 'HTTPS ready' },
      { id: '7', phase: 'storage', name: 'Mount C:\\', status: 'success', startTime: 720, endTime: 850, duration: 130, details: 'Primary drive mounted' },
      { id: '8', phase: 'storage', name: 'Mount D:\\', status: 'success', startTime: 850, endTime: 950, duration: 100, details: 'Secondary drive mounted' },
      { id: '9', phase: 'storage', name: 'Backup Drive', status: 'success', startTime: 950, endTime: 1100, duration: 150, details: 'Backup volume connected' },
      { id: '10', phase: 'services', name: 'Core Modules', status: 'success', startTime: 1100, endTime: 1300, duration: 200, details: 'System modules loaded' },
      { id: '11', phase: 'services', name: 'Display Drivers', status: 'success', startTime: 1300, endTime: 1450, duration: 150, details: 'GPU acceleration enabled' },
      { id: '12', phase: 'services', name: 'Network Stack', status: 'success', startTime: 1450, endTime: 1600, duration: 150, details: 'TCP/IP initialized' },
      { id: '13', phase: 'services', name: 'Supabase Backend', status: 'warning', startTime: 1600, endTime: 2100, duration: 500, details: 'Running in offline mode' },
      { id: '14', phase: 'ui', name: 'Desktop Environment', status: 'success', startTime: 2100, endTime: 2400, duration: 300, details: 'UI framework ready' },
    ];

    const connections: ConnectionAttempt[] = [
      { id: 'c1', target: 'localhost', port: 21, status: 'failed', latency: 170, timestamp: new Date(), error: 'Connection refused' },
      { id: 'c2', target: 'localhost', port: 80, status: 'success', latency: 45, timestamp: new Date() },
      { id: 'c3', target: 'localhost', port: 443, status: 'success', latency: 52, timestamp: new Date() },
      { id: 'c4', target: 'supabase.co', port: 443, status: 'timeout', latency: 5000, timestamp: new Date(), error: 'Connection timeout' },
      { id: 'c5', target: 'api.supabase.co', port: 443, status: 'failed', latency: 3200, timestamp: new Date(), error: 'DNS resolution failed' },
    ];

    setBootEvents(events);
    setConnectionAttempts(connections);
    setBootTime(events[events.length - 1]?.endTime || 0);

    // Save to localStorage
    localStorage.setItem('defdev_last_boot', JSON.stringify({
      time: events[events.length - 1]?.endTime || 0,
      events,
      connections,
      date: new Date().toISOString()
    }));
  };

  const reanalyze = async () => {
    setIsAnalyzing(true);
    setBootEvents([]);
    setConnectionAttempts([]);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    simulateBootAnalysis();
    setIsAnalyzing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'running': return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'init': return <Cpu className="w-4 h-4" />;
      case 'network': return <Globe className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'services': return <Zap className="w-4 h-4" />;
      case 'ui': return <Activity className="w-4 h-4" />;
      default: return <Power className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'init': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'network': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'storage': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'services': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'ui': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const phases = ['init', 'network', 'storage', 'services', 'ui'];
  const groupedEvents = phases.map(phase => ({
    phase,
    events: bootEvents.filter(e => e.phase === phase)
  }));

  const successCount = bootEvents.filter(e => e.status === 'success').length;
  const failedCount = bootEvents.filter(e => e.status === 'failed').length;
  const warningCount = bootEvents.filter(e => e.status === 'warning').length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
          <Power className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Boot Process Analyzer</h2>
          <p className="text-xs text-slate-500">
            Boot time: {(bootTime / 1000).toFixed(2)}s • {bootEvents.length} events
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reanalyze} disabled={isAnalyzing}>
          <RefreshCw className={`w-4 h-4 mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Re-analyze
        </Button>
      </div>

      {/* Timeline overview */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/30">
        <div className="flex items-center gap-4 mb-2">
          <span className="text-xs text-slate-500">Boot Timeline</span>
          <div className="flex-1 h-6 bg-slate-800 rounded-lg overflow-hidden relative">
            {groupedEvents.map(({ phase, events }) => {
              if (events.length === 0) return null;
              const start = events[0].startTime;
              const end = events[events.length - 1].endTime || start;
              const left = (start / bootTime) * 100;
              const width = ((end - start) / bootTime) * 100;
              
              return (
                <div
                  key={phase}
                  className={`absolute h-full ${getPhaseColor(phase).split(' ')[1]} opacity-80`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${phase}: ${end - start}ms`}
                />
              );
            })}
          </div>
          <span className="text-xs text-slate-400 font-mono">{bootTime}ms</span>
        </div>
        <div className="flex gap-4 text-xs">
          {phases.map(phase => (
            <div key={phase} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${getPhaseColor(phase).split(' ')[1]}`} />
              <span className="text-slate-500 capitalize">{phase}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Boot events */}
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-4">
            {groupedEvents.map(({ phase, events }) => (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1 rounded border ${getPhaseColor(phase)}`}>
                    {getPhaseIcon(phase)}
                  </div>
                  <span className="text-sm font-bold capitalize text-slate-300">{phase}</span>
                  <span className="text-xs text-slate-600">
                    {events.reduce((sum, e) => sum + (e.duration || 0), 0)}ms
                  </span>
                </div>
                <div className="space-y-1 ml-7">
                  {events.map(event => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 transition-colors"
                    >
                      {getStatusIcon(event.status)}
                      <span className="text-sm text-slate-200">{event.name}</span>
                      {event.port && (
                        <span className="text-xs text-slate-500 font-mono">:{event.port}</span>
                      )}
                      <span className="flex-1 text-xs text-slate-500 truncate">{event.details}</span>
                      <span className="text-xs text-slate-600 font-mono">{event.duration}ms</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Connection attempts panel */}
        <div className="w-72 border-l border-slate-800 flex flex-col bg-slate-900/30">
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-sm">Network Connections</h3>
            </div>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {connectionAttempts.map(conn => (
                <Card key={conn.id} className="p-3 bg-slate-800/50 border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    {conn.status === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-400" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400" />
                    )}
                    <span className="text-sm font-mono text-slate-200">
                      {conn.target}{conn.port ? `:${conn.port}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span className={conn.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                      {conn.status.toUpperCase()}
                    </span>
                    <span className="font-mono">{conn.latency}ms</span>
                  </div>
                  {conn.error && (
                    <p className="text-xs text-red-400 mt-1">{conn.error}</p>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 border-t border-slate-800 grid grid-cols-4 gap-3 bg-slate-900/50">
        <div className="text-center">
          <CheckCircle className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-sm font-bold text-green-400">{successCount}</div>
          <div className="text-[10px] text-slate-500">Success</div>
        </div>
        <div className="text-center">
          <XCircle className="w-4 h-4 mx-auto mb-1 text-red-400" />
          <div className="text-sm font-bold text-red-400">{failedCount}</div>
          <div className="text-[10px] text-slate-500">Failed</div>
        </div>
        <div className="text-center">
          <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-amber-400" />
          <div className="text-sm font-bold text-amber-400">{warningCount}</div>
          <div className="text-[10px] text-slate-500">Warnings</div>
        </div>
        <div className="text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
          <div className="text-sm font-bold text-cyan-400">{(bootTime / 1000).toFixed(2)}s</div>
          <div className="text-[10px] text-slate-500">Boot Time</div>
        </div>
      </div>
    </div>
  );
};

export default BootAnalyzerTab;
