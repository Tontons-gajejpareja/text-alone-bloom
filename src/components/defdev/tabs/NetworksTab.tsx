import { useState, useEffect, useRef } from "react";
import { Wifi, Globe, ArrowDown, ArrowUp, Clock, Trash2, AlertTriangle, Pause, Play, Search, Zap, Filter, X, Database, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  duration: number;
  size: string;
  timestamp: Date;
  type: 'fetch' | 'xhr' | 'supabase';
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: string;
  responseBody?: string;
  initiator?: string;
}

// Global interceptor state
let isIntercepting = false;
let requestListeners: ((req: NetworkRequest) => void)[] = [];

const originalFetch = window.fetch;
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const interceptNetwork = () => {
  if (isIntercepting) return;
  isIntercepting = true;

  // Intercept fetch
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const startTime = performance.now();
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
    const method = init?.method || 'GET';
    const id = `fetch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Detect Supabase requests
    const isSupabase = url.includes('supabase') || url.includes('supabase.co');
    
    try {
      const response = await originalFetch.call(this, input, init);
      const duration = Math.round(performance.now() - startTime);
      const clone = response.clone();
      
      let responseBody = '';
      let size = '0 B';
      try {
        const text = await clone.text();
        responseBody = text.slice(0, 5000);
        size = formatBytes(new Blob([text]).size);
      } catch {}

      const req: NetworkRequest = {
        id,
        url,
        method,
        status: response.status,
        statusText: response.statusText,
        duration,
        size,
        timestamp: new Date(),
        type: isSupabase ? 'supabase' : 'fetch',
        requestBody: init?.body?.toString(),
        responseBody,
        initiator: new Error().stack?.split('\n')[3]?.trim()
      };

      requestListeners.forEach(fn => fn(req));
      return response;
    } catch (error) {
      const duration = Math.round(performance.now() - startTime);
      const req: NetworkRequest = {
        id,
        url,
        method,
        status: 0,
        statusText: 'Network Error',
        duration,
        size: '0 B',
        timestamp: new Date(),
        type: isSupabase ? 'supabase' : 'fetch',
        initiator: new Error().stack?.split('\n')[3]?.trim()
      };
      requestListeners.forEach(fn => fn(req));
      throw error;
    }
  };

  // Intercept XHR
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL) {
    (this as any)._defdev = { method, url: url.toString(), startTime: 0 };
    return originalXHROpen.apply(this, arguments as any);
  };

  XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
    const xhr = this;
    const meta = (xhr as any)._defdev;
    if (meta) {
      meta.startTime = performance.now();
      meta.requestBody = body?.toString();
    }

    xhr.addEventListener('loadend', function() {
      if (!meta) return;
      const duration = Math.round(performance.now() - meta.startTime);
      const id = `xhr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const isSupabase = meta.url.includes('supabase');
      
      const req: NetworkRequest = {
        id,
        url: meta.url,
        method: meta.method,
        status: xhr.status,
        statusText: xhr.statusText || '',
        duration,
        size: formatBytes(xhr.responseText?.length || 0),
        timestamp: new Date(),
        type: isSupabase ? 'supabase' : 'xhr',
        requestBody: meta.requestBody,
        responseBody: xhr.responseText?.slice(0, 5000),
        initiator: new Error().stack?.split('\n')[3]?.trim()
      };

      requestListeners.forEach(fn => fn(req));
    });

    return originalXHRSend.apply(this, arguments as any);
  };
};

const stopIntercepting = () => {
  window.fetch = originalFetch;
  XMLHttpRequest.prototype.open = originalXHROpen;
  XMLHttpRequest.prototype.send = originalXHRSend;
  isIntercepting = false;
};

export const NetworksTab = () => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'fetch' | 'xhr' | 'supabase' | 'error'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    interceptNetwork();
    
    const listener = (req: NetworkRequest) => {
      if (!pausedRef.current) {
        setRequests(prev => [req, ...prev].slice(0, 100));
      }
    };
    
    requestListeners.push(listener);
    
    return () => {
      requestListeners = requestListeners.filter(fn => fn !== listener);
      if (requestListeners.length === 0) {
        stopIntercepting();
      }
    };
  }, []);

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === 'all' || 
      (filter === 'error' ? (r.status >= 400 || r.status === 0) : r.type === filter);
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'success' && r.status > 0 && r.status < 400) ||
      (statusFilter === 'error' && (r.status >= 400 || r.status === 0));
    const matchesSearch = !searchQuery || 
      r.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: number) => {
    if (status === 0) return 'text-red-400 bg-red-500/10';
    if (status >= 500) return 'text-red-400 bg-red-500/10';
    if (status >= 400) return 'text-amber-400 bg-amber-500/10';
    if (status >= 300) return 'text-blue-400 bg-blue-500/10';
    return 'text-green-400 bg-green-500/10';
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-400';
      case 'POST': return 'bg-blue-500/20 text-blue-400';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400';
      case 'DELETE': return 'bg-red-500/20 text-red-400';
      case 'PATCH': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'supabase': return <Database className="w-3 h-3 text-emerald-400" />;
      case 'fetch': return <Globe className="w-3 h-3 text-blue-400" />;
      default: return <Wifi className="w-3 h-3 text-cyan-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
          <Globe className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Network Inspector</h2>
          <p className="text-xs text-slate-500">{requests.length} requests • Real-time interception</p>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-green-500/10 border border-green-500/30">
          <Zap className="w-3 h-3 text-green-400" />
          <span className="text-xs text-green-400">Live</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-2 flex-wrap bg-slate-900/30">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by URL..."
            className="w-full pl-9 bg-slate-800/50 border-slate-700"
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-1">
          {(['all', 'fetch', 'xhr', 'supabase', 'error'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {f === 'error' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
              {f === 'supabase' && <Database className="w-3 h-3 inline mr-1" />}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
          <SelectTrigger className="w-28 h-8 bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>

        {/* Controls */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`p-2 rounded border transition-colors ${
            isPaused 
              ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>
        <button
          onClick={() => { setRequests([]); setSelectedRequest(null); }}
          className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors"
          title="Clear"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Request list */}
        <ScrollArea className="flex-1">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Wifi className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Waiting for network requests...</p>
              <p className="text-xs mt-1 text-slate-600">Real fetch/XHR requests will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(selectedRequest?.id === req.id ? null : req)}
                  className={`p-3 cursor-pointer transition-colors ${
                    selectedRequest?.id === req.id
                      ? 'bg-cyan-500/10'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getTypeIcon(req.type)}
                    <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${getMethodColor(req.method)}`}>
                      {req.method}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono ${getStatusColor(req.status)}`}>
                      {req.status || 'ERR'}
                    </span>
                    <span className="flex-1 text-sm text-slate-300 truncate font-mono">
                      {new URL(req.url).pathname}
                    </span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {req.duration}ms
                    </span>
                    <span className="text-xs text-slate-500 font-mono w-16 text-right">
                      {req.size}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 ml-7">
                    <span>{new URL(req.url).hostname}</span>
                    <span>•</span>
                    <span>{req.timestamp.toLocaleTimeString()}</span>
                    <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{req.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Request Details */}
        {selectedRequest && (
          <div className="w-80 border-l border-slate-800 flex flex-col bg-slate-900/30">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm">Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                <Card className="p-3 bg-slate-800/50 border-slate-700 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">URL:</span>
                    <span className="font-mono text-cyan-400 truncate max-w-40">{selectedRequest.url}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-mono">{selectedRequest.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className={getStatusColor(selectedRequest.status).split(' ')[0]}>
                      {selectedRequest.status} {selectedRequest.statusText}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span>{selectedRequest.duration}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Size:</span>
                    <span>{selectedRequest.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type:</span>
                    <span className="capitalize">{selectedRequest.type}</span>
                  </div>
                </Card>

                {selectedRequest.initiator && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Initiator</h4>
                    <Card className="p-2 bg-slate-800/50 border-slate-700">
                      <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap break-all">
                        {selectedRequest.initiator}
                      </pre>
                    </Card>
                  </div>
                )}

                {selectedRequest.responseBody && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 mb-1">Response Preview</h4>
                    <Card className="p-2 bg-slate-800/50 border-slate-700 max-h-48 overflow-auto">
                      <pre className="text-[10px] font-mono text-cyan-400 whitespace-pre-wrap">
                        {selectedRequest.responseBody.slice(0, 1000)}
                        {selectedRequest.responseBody.length > 1000 && '...'}
                      </pre>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-3 border-t border-slate-800 grid grid-cols-5 gap-3 bg-slate-900/50">
        <div className="text-center">
          <ArrowDown className="w-4 h-4 mx-auto mb-1 text-green-400" />
          <div className="text-sm font-bold text-green-400">
            {requests.filter(r => r.status >= 200 && r.status < 400).length}
          </div>
          <div className="text-[10px] text-slate-500">Success</div>
        </div>
        <div className="text-center">
          <X className="w-4 h-4 mx-auto mb-1 text-red-400" />
          <div className="text-sm font-bold text-red-400">
            {requests.filter(r => r.status >= 400 || r.status === 0).length}
          </div>
          <div className="text-[10px] text-slate-500">Errors</div>
        </div>
        <div className="text-center">
          <Database className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <div className="text-sm font-bold text-emerald-400">
            {requests.filter(r => r.type === 'supabase').length}
          </div>
          <div className="text-[10px] text-slate-500">Supabase</div>
        </div>
        <div className="text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-amber-400" />
          <div className="text-sm font-bold text-amber-400">
            {requests.length > 0 ? Math.round(requests.reduce((a, b) => a + b.duration, 0) / requests.length) : 0}ms
          </div>
          <div className="text-[10px] text-slate-500">Avg Time</div>
        </div>
        <div className="text-center">
          <ArrowUp className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
          <div className="text-sm font-bold text-cyan-400">{requests.length}</div>
          <div className="text-[10px] text-slate-500">Total</div>
        </div>
      </div>
    </div>
  );
};

export default NetworksTab;
