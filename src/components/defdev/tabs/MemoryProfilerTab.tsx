import { useState, useEffect, useRef } from "react";
import { MemoryStick, TrendingUp, TrendingDown, AlertTriangle, Trash2, RefreshCw, Clock, Layers, Activity, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  external: number;
  jsHeapSizeLimit: number;
}

interface ComponentMemory {
  name: string;
  estimatedSize: number;
  instances: number;
  trend: 'stable' | 'increasing' | 'decreasing';
  lastUpdate: Date;
}

interface MemoryLeak {
  id: string;
  type: 'potential' | 'confirmed';
  component: string;
  description: string;
  growth: string;
  detectedAt: Date;
}

export const MemoryProfilerTab = () => {
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [componentMemory, setComponentMemory] = useState<ComponentMemory[]>([]);
  const [leaks, setLeaks] = useState<MemoryLeak[]>([]);
  const [isProfiling, setIsProfiling] = useState(false);
  const [currentMemory, setCurrentMemory] = useState<MemorySnapshot | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialize with mock data
  useEffect(() => {
    const mockComponents: ComponentMemory[] = [
      { name: 'WindowManager', estimatedSize: 2048, instances: 3, trend: 'increasing', lastUpdate: new Date() },
      { name: 'Desktop', estimatedSize: 1536, instances: 1, trend: 'stable', lastUpdate: new Date() },
      { name: 'Taskbar', estimatedSize: 512, instances: 1, trend: 'stable', lastUpdate: new Date() },
      { name: 'StartMenu', estimatedSize: 768, instances: 1, trend: 'stable', lastUpdate: new Date() },
      { name: 'NotificationCenter', estimatedSize: 384, instances: 1, trend: 'increasing', lastUpdate: new Date() },
      { name: 'Terminal', estimatedSize: 1024, instances: 2, trend: 'stable', lastUpdate: new Date() },
      { name: 'Settings', estimatedSize: 896, instances: 1, trend: 'decreasing', lastUpdate: new Date() },
      { name: 'FileExplorer', estimatedSize: 1280, instances: 1, trend: 'stable', lastUpdate: new Date() },
    ];

    const mockLeaks: MemoryLeak[] = [
      {
        id: 'leak-1',
        type: 'potential',
        component: 'NotificationCenter',
        description: 'Event listeners not being cleaned up on unmount',
        growth: '+12KB/min',
        detectedAt: new Date(Date.now() - 300000)
      },
      {
        id: 'leak-2',
        type: 'potential',
        component: 'WindowManager',
        description: 'Window references retained after close',
        growth: '+8KB/min',
        detectedAt: new Date(Date.now() - 600000)
      }
    ];

    setComponentMemory(mockComponents);
    setLeaks(mockLeaks);
    
    // Get initial memory if available
    updateMemory();
  }, []);

  const updateMemory = () => {
    // @ts-ignore - performance.memory is non-standard
    const memory = (performance as any).memory;
    
    if (memory) {
      const snapshot: MemorySnapshot = {
        timestamp: new Date(),
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        external: 0,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
      setCurrentMemory(snapshot);
      setSnapshots(prev => [...prev.slice(-100), snapshot]);
    } else {
      // Simulate memory data for browsers without performance.memory
      const baseHeap = 50 * 1024 * 1024;
      const variation = Math.random() * 10 * 1024 * 1024;
      const snapshot: MemorySnapshot = {
        timestamp: new Date(),
        heapUsed: baseHeap + variation,
        heapTotal: 100 * 1024 * 1024,
        external: 5 * 1024 * 1024,
        jsHeapSizeLimit: 2 * 1024 * 1024 * 1024
      };
      setCurrentMemory(snapshot);
      setSnapshots(prev => [...prev.slice(-100), snapshot]);
    }
  };

  const startProfiling = () => {
    setIsProfiling(true);
    updateMemory();
    intervalRef.current = window.setInterval(updateMemory, 1000);
  };

  const stopProfiling = () => {
    setIsProfiling(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const forceGC = () => {
    // @ts-ignore
    if (window.gc) {
      // @ts-ignore
      window.gc();
      console.log('[DEF-DEV] Forced garbage collection');
    } else {
      console.log('[DEF-DEV] GC not exposed. Run Chrome with --js-flags="--expose-gc"');
    }
    updateMemory();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMemoryPercentage = (): number => {
    if (!currentMemory) return 0;
    return (currentMemory.heapUsed / currentMemory.jsHeapSizeLimit) * 100;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-3 h-3 text-red-400" />;
      case 'decreasing': return <TrendingDown className="w-3 h-3 text-green-400" />;
      default: return <Activity className="w-3 h-3 text-slate-400" />;
    }
  };

  const totalComponentMemory = componentMemory.reduce((sum, c) => sum + c.estimatedSize * c.instances, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
          <MemoryStick className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Memory Profiler</h2>
          <p className="text-xs text-slate-500">
            {currentMemory ? formatBytes(currentMemory.heapUsed) : 'N/A'} used
          </p>
        </div>
        <div className="flex gap-2">
          {isProfiling ? (
            <Button variant="destructive" size="sm" onClick={stopProfiling}>
              <Activity className="w-4 h-4 mr-1 animate-pulse" />
              Stop Profiling
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startProfiling}>
              <Activity className="w-4 h-4 mr-1" />
              Start Profiling
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={forceGC} title="Force Garbage Collection">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Memory overview */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/30">
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-3 bg-slate-800/50 border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Heap Used</div>
            <div className="text-lg font-bold text-emerald-400">
              {currentMemory ? formatBytes(currentMemory.heapUsed) : 'N/A'}
            </div>
          </Card>
          <Card className="p-3 bg-slate-800/50 border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Heap Total</div>
            <div className="text-lg font-bold text-blue-400">
              {currentMemory ? formatBytes(currentMemory.heapTotal) : 'N/A'}
            </div>
          </Card>
          <Card className="p-3 bg-slate-800/50 border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Heap Limit</div>
            <div className="text-lg font-bold text-purple-400">
              {currentMemory ? formatBytes(currentMemory.jsHeapSizeLimit) : 'N/A'}
            </div>
          </Card>
          <Card className="p-3 bg-slate-800/50 border-slate-700">
            <div className="text-xs text-slate-500 mb-1">Usage</div>
            <div className="text-lg font-bold text-amber-400">
              {getMemoryPercentage().toFixed(1)}%
            </div>
          </Card>
        </div>
        
        <div className="mt-3">
          <Progress value={getMemoryPercentage()} className="h-2" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Component memory */}
        <ScrollArea className="flex-1 p-3">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold">Component Memory Footprint</h3>
            <span className="text-xs text-slate-500">({formatBytes(totalComponentMemory * 1024)})</span>
          </div>
          
          <div className="space-y-2">
            {componentMemory.sort((a, b) => (b.estimatedSize * b.instances) - (a.estimatedSize * a.instances)).map(comp => (
              <Card key={comp.name} className="p-3 bg-slate-800/30 border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">{comp.name}</span>
                    <span className="text-xs text-slate-500">×{comp.instances}</span>
                    {getTrendIcon(comp.trend)}
                  </div>
                  <span className="text-sm font-mono text-cyan-400">
                    {formatBytes(comp.estimatedSize * comp.instances * 1024)}
                  </span>
                </div>
                <Progress 
                  value={(comp.estimatedSize * comp.instances / totalComponentMemory) * 100} 
                  className="h-1.5" 
                />
              </Card>
            ))}
          </div>

          {/* Memory timeline */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold">Memory Timeline</h3>
              <span className="text-xs text-slate-500">({snapshots.length} samples)</span>
            </div>
            
            <Card className="p-3 bg-slate-800/30 border-slate-700 h-24">
              {snapshots.length > 1 ? (
                <div className="h-full flex items-end gap-0.5">
                  {snapshots.slice(-50).map((snapshot, i) => {
                    const height = (snapshot.heapUsed / (currentMemory?.jsHeapSizeLimit || snapshot.heapUsed)) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-emerald-500/60 rounded-t transition-all"
                        style={{ height: `${Math.max(height, 5)}%` }}
                        title={`${formatBytes(snapshot.heapUsed)} at ${snapshot.timestamp.toLocaleTimeString()}`}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  Start profiling to see memory timeline
                </div>
              )}
            </Card>
          </div>
        </ScrollArea>

        {/* Leaks panel */}
        <div className="w-72 border-l border-slate-800 flex flex-col bg-slate-900/30">
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm">Potential Leaks</h3>
            </div>
          </div>
          <ScrollArea className="flex-1 p-3">
            {leaks.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No memory leaks detected</p>
              </div>
            ) : (
              <div className="space-y-2">
                {leaks.map(leak => (
                  <Card key={leak.id} className="p-3 bg-amber-500/10 border-amber-500/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-amber-400">{leak.component}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        leak.type === 'confirmed' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {leak.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{leak.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Growth rate:</span>
                      <span className="text-red-400 font-mono">{leak.growth}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MemoryProfilerTab;
