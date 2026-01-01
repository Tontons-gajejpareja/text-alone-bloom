import { useState, useEffect, useCallback, useRef } from "react";
import { Zap, Keyboard, MousePointer, Monitor, AppWindow, Bell, Settings, Trash2, Pause, Play, Filter, Clock, Circle, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SystemEvent {
  id: number;
  type: "keyboard" | "mouse" | "window" | "system" | "notification" | "settings";
  name: string;
  details: string;
  data: Record<string, any>;
  timestamp: Date;
}

let eventIdCounter = 0;

// Event recording state
interface Recording {
  id: string;
  name: string;
  events: SystemEvent[];
  startTime: Date;
  endTime?: Date;
}

export const EventsDebugTab = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [trackKeyboard, setTrackKeyboard] = useState(true);
  const [trackMouse, setTrackMouse] = useState(false);
  const [trackWindow, setTrackWindow] = useState(true);
  const [trackSystem, setTrackSystem] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);
  const [filter, setFilter] = useState<'all' | 'keyboard' | 'mouse' | 'window' | 'system'>('all');
  
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  
  const pausedRef = useRef(false);
  const recordingRef = useRef<SystemEvent[]>([]);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  const addEvent = useCallback((event: Omit<SystemEvent, "id" | "timestamp">) => {
    if (pausedRef.current) return;
    
    const newEvent: SystemEvent = {
      ...event,
      id: eventIdCounter++,
      timestamp: new Date()
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, 200));
    
    // Add to recording if active
    if (isRecording) {
      recordingRef.current.push(newEvent);
    }
  }, [isRecording]);

  // Keyboard events
  useEffect(() => {
    if (!trackKeyboard) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers = [];
      if (e.ctrlKey) modifiers.push('Ctrl');
      if (e.altKey) modifiers.push('Alt');
      if (e.shiftKey) modifiers.push('Shift');
      if (e.metaKey) modifiers.push('Win');
      
      const keyCombo = [...modifiers, e.key].join('+');
      
      addEvent({
        type: "keyboard",
        name: "Key Press",
        details: keyCombo,
        data: {
          key: e.key,
          code: e.code,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [trackKeyboard, addEvent]);

  // Mouse events
  useEffect(() => {
    if (!trackMouse) return;
    
    const handleClick = (e: MouseEvent) => {
      addEvent({
        type: "mouse",
        name: "Click",
        details: `(${e.clientX}, ${e.clientY}) on ${(e.target as HTMLElement)?.tagName}`,
        data: {
          x: e.clientX,
          y: e.clientY,
          button: e.button,
          target: (e.target as HTMLElement)?.tagName
        }
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [trackMouse, addEvent]);

  // Window events
  useEffect(() => {
    if (!trackWindow) return;
    
    const handleResize = () => {
      addEvent({
        type: "window",
        name: "Resize",
        details: `${window.innerWidth}x${window.innerHeight}`,
        data: { width: window.innerWidth, height: window.innerHeight }
      });
    };

    const handleFocus = () => {
      addEvent({
        type: "window",
        name: "Focus",
        details: "Window gained focus",
        data: {}
      });
    };

    const handleBlur = () => {
      addEvent({
        type: "window",
        name: "Blur",
        details: "Window lost focus",
        data: {}
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [trackWindow, addEvent]);

  // Simulated system events
  useEffect(() => {
    if (!trackSystem || isPaused) return;

    const systemEvents = [
      { type: 'system' as const, name: 'Auto-save', details: 'Settings persisted to localStorage' },
      { type: 'notification' as const, name: 'Notification', details: 'New system notification queued' },
      { type: 'settings' as const, name: 'Setting Change', details: 'theme_mode updated' },
      { type: 'system' as const, name: 'Sync Check', details: 'Cloud sync status verified' },
    ];

    const addRandomEvent = () => {
      const evt = systemEvents[Math.floor(Math.random() * systemEvents.length)];
      addEvent({
        type: evt.type,
        name: evt.name,
        details: evt.details,
        data: { simulated: true }
      });
    };

    const interval = setInterval(addRandomEvent, 8000 + Math.random() * 12000);
    return () => clearInterval(interval);
  }, [trackSystem, isPaused, addEvent]);

  const filteredEvents = events.filter(e => filter === 'all' || e.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyboard': return <Keyboard className="w-3 h-3" />;
      case 'mouse': return <MousePointer className="w-3 h-3" />;
      case 'window': return <Monitor className="w-3 h-3" />;
      case 'notification': return <Bell className="w-3 h-3" />;
      case 'settings': return <Settings className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keyboard': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'mouse': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'window': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'notification': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'settings': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  // Recording functions
  const startRecording = () => {
    recordingRef.current = [];
    setCurrentRecording({
      id: `rec-${Date.now()}`,
      name: `Recording ${recordings.length + 1}`,
      events: [],
      startTime: new Date()
    });
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (currentRecording) {
      const finalRecording: Recording = {
        ...currentRecording,
        events: [...recordingRef.current],
        endTime: new Date()
      };
      setRecordings(prev => [...prev, finalRecording]);
    }
    setIsRecording(false);
    setCurrentRecording(null);
    recordingRef.current = [];
  };

  const replayRecording = async (recording: Recording) => {
    setIsReplaying(true);
    console.log(`[DEF-DEV] Replaying ${recording.events.length} events...`);
    
    for (const event of recording.events) {
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`[REPLAY] ${event.name}: ${event.details}`);
    }
    
    setIsReplaying(false);
    console.log('[DEF-DEV] Replay complete');
  };

  const exportRecording = (recording: Recording) => {
    const data = JSON.stringify(recording, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
          <Zap className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Event Debugger</h2>
          <p className="text-xs text-slate-500">{events.length} events captured</p>
        </div>
        <div className="flex gap-2">
          {isRecording ? (
            <Button variant="destructive" size="sm" onClick={stopRecording}>
              <Circle className="w-3 h-3 mr-1 fill-current animate-pulse" />
              Stop Recording
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startRecording} disabled={isReplaying}>
              <Circle className="w-3 h-3 mr-1" />
              Record
            </Button>
          )}
          <Button
            variant={isPaused ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className={isPaused ? "bg-amber-500/20 text-amber-400" : ""}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setEvents([]); setSelectedEvent(null); }}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-4 flex-wrap bg-slate-900/30">
        {/* Toggles */}
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={trackKeyboard} onCheckedChange={setTrackKeyboard} />
          <Keyboard className="w-4 h-4 text-purple-400" />
          <span className="text-slate-400">Keyboard</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={trackMouse} onCheckedChange={setTrackMouse} />
          <MousePointer className="w-4 h-4 text-green-400" />
          <span className="text-slate-400">Mouse</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={trackWindow} onCheckedChange={setTrackWindow} />
          <Monitor className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">Window</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={trackSystem} onCheckedChange={setTrackSystem} />
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">System</span>
        </label>

        <div className="flex-1" />

        {/* Filter */}
        <div className="flex gap-1">
          {(['all', 'keyboard', 'mouse', 'window', 'system'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Event list */}
        <ScrollArea className="flex-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Zap className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No events captured</p>
              <p className="text-xs mt-1">Interact with the system to see events</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(selectedEvent?.id === evt.id ? null : evt)}
                  className={`p-3 cursor-pointer transition-colors flex items-center gap-3 ${
                    selectedEvent?.id === evt.id ? 'bg-purple-500/10' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`p-1.5 rounded border ${getTypeColor(evt.type)}`}>
                    {getTypeIcon(evt.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{evt.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${getTypeColor(evt.type)}`}>
                        {evt.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono truncate">
                      {evt.details}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {evt.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Details/Recordings panel */}
        <div className="w-72 border-l border-slate-800 flex flex-col bg-slate-900/30">
          {selectedEvent ? (
            <>
              <div className="p-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded border ${getTypeColor(selectedEvent.type)}`}>
                    {getTypeIcon(selectedEvent.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{selectedEvent.name}</h3>
                    <p className="text-xs text-slate-500">{selectedEvent.timestamp.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 p-3">
                <Card className="p-3 bg-slate-800/50 border-slate-700">
                  <h4 className="text-xs font-bold text-slate-500 mb-2">Event Data</h4>
                  <pre className="text-xs font-mono whitespace-pre-wrap text-cyan-400">
                    {JSON.stringify(selectedEvent.data, null, 2)}
                  </pre>
                </Card>
              </ScrollArea>
            </>
          ) : (
            <div className="p-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recordings</h4>
              {recordings.length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-4">No recordings yet</p>
              ) : (
                <div className="space-y-2">
                  {recordings.map((rec) => (
                    <Card key={rec.id} className="p-3 bg-slate-800/50 border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{rec.name}</span>
                        <span className="text-[10px] text-slate-500">{rec.events.length} events</span>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 h-7 text-xs"
                          onClick={() => replayRecording(rec)}
                          disabled={isReplaying}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Replay
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7"
                          onClick={() => exportRecording(rec)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 border-t border-slate-800 grid grid-cols-5 gap-3 bg-slate-900/50">
        <div className="text-center">
          <Keyboard className="w-4 h-4 mx-auto mb-1 text-purple-400" />
          <div className="text-sm font-bold text-purple-400">
            {events.filter(e => e.type === 'keyboard').length}
          </div>
          <div className="text-[10px] text-slate-500">Keyboard</div>
        </div>
        <div className="text-center">
          <MousePointer className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-sm font-bold text-green-400">
            {events.filter(e => e.type === 'mouse').length}
          </div>
          <div className="text-[10px] text-slate-500">Mouse</div>
        </div>
        <div className="text-center">
          <Monitor className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
          <div className="text-sm font-bold text-cyan-400">
            {events.filter(e => e.type === 'window').length}
          </div>
          <div className="text-[10px] text-slate-500">Window</div>
        </div>
        <div className="text-center">
          <Zap className="w-4 h-4 mx-auto mb-1 text-blue-400" />
          <div className="text-sm font-bold text-blue-400">
            {events.filter(e => e.type === 'system').length}
          </div>
          <div className="text-[10px] text-slate-500">System</div>
        </div>
        <div className="text-center">
          <Circle className="w-4 h-4 mx-auto mb-1 text-red-400" />
          <div className="text-sm font-bold text-red-400">
            {recordings.length}
          </div>
          <div className="text-[10px] text-slate-500">Recordings</div>
        </div>
      </div>
    </div>
  );
};

export default EventsDebugTab;
