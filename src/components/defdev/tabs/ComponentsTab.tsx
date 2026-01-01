import { useState, useCallback, useEffect } from "react";
import { Box, ChevronRight, ChevronDown, Eye, Code, Layers, Search, Crosshair, Edit2, RefreshCw, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComponentNode {
  id: string;
  name: string;
  type: 'component' | 'element' | 'provider';
  props: Record<string, any>;
  children?: ComponentNode[];
  renderCount?: number;
  lastRenderTime?: number;
}

// Mock component tree - in production would integrate with React DevTools
const mockComponentTree: ComponentNode = {
  id: 'root',
  name: 'App',
  type: 'component',
  props: {},
  renderCount: 1,
  lastRenderTime: 2.1,
  children: [
    {
      id: 'router',
      name: 'BrowserRouter',
      type: 'provider',
      props: {},
      renderCount: 1,
      children: [
        {
          id: 'query',
          name: 'QueryClientProvider',
          type: 'provider',
          props: {},
          renderCount: 1,
          children: [
            {
              id: 'tooltip',
              name: 'TooltipProvider',
              type: 'provider',
              props: {},
              renderCount: 1,
              children: [
                {
                  id: 'index',
                  name: 'Index',
                  type: 'component',
                  props: { stage: 'desktop' },
                  renderCount: 12,
                  lastRenderTime: 1.4,
                  children: [
                    {
                      id: 'desktop',
                      name: 'Desktop',
                      type: 'component',
                      props: { windows: 3 },
                      renderCount: 8,
                      lastRenderTime: 3.2,
                      children: [
                        { id: 'taskbar', name: 'Taskbar', type: 'component', props: { pinnedApps: 4 }, renderCount: 5, lastRenderTime: 0.8 },
                        { id: 'switcher', name: 'DesktopSwitcher', type: 'component', props: { desktops: 2 }, renderCount: 3, lastRenderTime: 0.5 },
                        { id: 'windowmgr', name: 'WindowManager', type: 'component', props: { windows: 3, onClose: 'fn' }, renderCount: 15, lastRenderTime: 4.5 },
                        { id: 'startmenu', name: 'StartMenu', type: 'component', props: { open: false }, renderCount: 2, lastRenderTime: 0.3 },
                        { id: 'globalsearch', name: 'GlobalSearch', type: 'component', props: { open: false }, renderCount: 1, lastRenderTime: 0.1 },
                        { id: 'taskview', name: 'TaskView', type: 'component', props: { open: false }, renderCount: 1, lastRenderTime: 0.1 },
                        { id: 'notifcenter', name: 'NotificationCenter', type: 'component', props: { open: false }, renderCount: 4, lastRenderTime: 0.6 },
                      ]
                    },
                    { id: 'supacheck', name: 'SupabaseConnectivityChecker', type: 'component', props: {}, renderCount: 2, lastRenderTime: 0.2 },
                    { id: 'changelog', name: 'ChangelogDialog', type: 'component', props: {}, renderCount: 1, lastRenderTime: 0.1 },
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    { id: 'toaster', name: 'Toaster', type: 'component', props: {}, renderCount: 1, lastRenderTime: 0.1 },
    { id: 'sonner', name: 'Sonner', type: 'component', props: {}, renderCount: 1, lastRenderTime: 0.1 },
  ]
};

export const ComponentsTab = () => {
  const [tree, setTree] = useState<ComponentNode>(mockComponentTree);
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root', 'router', 'query', 'tooltip', 'index', 'desktop']));
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [editingProp, setEditingProp] = useState<{ key: string; value: string } | null>(null);
  const [inspectorMode, setInspectorMode] = useState(false);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'component': return 'text-cyan-400';
      case 'provider': return 'text-purple-400';
      default: return 'text-amber-400';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'component': return 'bg-cyan-500/10 border-cyan-500/30';
      case 'provider': return 'bg-purple-500/10 border-purple-500/30';
      default: return 'bg-amber-500/10 border-amber-500/30';
    }
  };

  const highlightInUI = (componentName: string) => {
    setHighlightedElement(componentName);
    console.log(`[DEF-DEV] Highlighting component: ${componentName}`);
    setTimeout(() => setHighlightedElement(null), 2000);
  };

  const logToConsole = (node: ComponentNode) => {
    console.log('[DEF-DEV] Component:', node.name, node);
  };

  const searchTree = (node: ComponentNode, query: string): boolean => {
    if (node.name.toLowerCase().includes(query.toLowerCase())) return true;
    if (node.children) {
      return node.children.some(child => searchTree(child, query));
    }
    return false;
  };

  const renderNode = (node: ComponentNode, depth: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const matchesSearch = searchQuery && node.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isHighlighted = highlightedElement === node.name;

    // Filter out if doesn't match search
    if (searchQuery && !searchTree(node, searchQuery)) return null;

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-1.5 py-1 px-2 rounded cursor-pointer transition-all ${
            isSelected ? 'bg-cyan-500/20' : 'hover:bg-slate-800/50'
          } ${matchesSearch ? 'ring-1 ring-amber-500/50' : ''} ${isHighlighted ? 'ring-2 ring-green-500 bg-green-500/10' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => setSelectedNode(node)}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="p-0.5 hover:bg-white/10 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-slate-400" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}
          
          <span className={`text-sm font-mono ${getTypeColor(node.type)}`}>
            {'<'}{node.name}
            {node.props && Object.keys(node.props).length > 0 && (
              <span className="text-slate-500"> ...</span>
            )}
            {hasChildren ? '>' : ' />'}
          </span>

          {/* Performance indicator */}
          {node.renderCount && node.renderCount > 10 && (
            <span className="ml-auto text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              {node.renderCount}x
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, depth + 1))}
            <div
              className="text-sm font-mono text-slate-500 py-0.5"
              style={{ paddingLeft: `${depth * 16 + 24}px` }}
            >
              {'</'}{node.name}{'>'}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
          <Layers className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Component Inspector</h2>
          <p className="text-xs text-slate-500">React component tree • Live debugging</p>
        </div>
        <Button
          variant={inspectorMode ? "default" : "outline"}
          size="sm"
          onClick={() => setInspectorMode(!inspectorMode)}
          className={inspectorMode ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
        >
          <Crosshair className="w-4 h-4 mr-1" />
          {inspectorMode ? 'Inspecting...' : 'Inspect'}
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Tree */}
        <ScrollArea className="flex-1 p-3">
          {renderNode(tree)}
        </ScrollArea>

        {/* Details panel */}
        {selectedNode && (
          <div className="w-72 border-l border-slate-800 flex flex-col bg-slate-900/30">
            <div className="p-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded border ${getTypeBg(selectedNode.type)}`}>
                  <Box className={`w-4 h-4 ${getTypeColor(selectedNode.type)}`} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedNode.name}</h3>
                  <p className={`text-xs ${getTypeColor(selectedNode.type)}`}>{selectedNode.type}</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                {/* Props */}
                {selectedNode.props && Object.keys(selectedNode.props).length > 0 && (
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      Props
                      <Edit2 className="w-3 h-3 text-slate-500" />
                    </h4>
                    <Card className="p-3 bg-slate-800/50 border-slate-700 space-y-2">
                      {Object.entries(selectedNode.props).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs group">
                          <span className="text-purple-400">{key}:</span>
                          <span className="text-amber-400 font-mono cursor-pointer hover:bg-slate-700 px-1 rounded">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </Card>
                  </div>
                )}

                {/* Performance */}
                <div>
                  <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Gauge className="w-3 h-3" />
                    Performance
                  </h4>
                  <Card className="p-3 bg-slate-800/50 border-slate-700 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Render count:</span>
                      <span className={`font-mono ${(selectedNode.renderCount || 0) > 10 ? 'text-amber-400' : 'text-green-400'}`}>
                        {selectedNode.renderCount || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Last render:</span>
                      <span className="text-cyan-400 font-mono">{selectedNode.lastRenderTime || 0}ms</span>
                    </div>
                  </Card>
                </div>

                {/* Children */}
                {selectedNode.children && (
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Children</h4>
                    <div className="text-xs text-slate-300">
                      {selectedNode.children.length} child component{selectedNode.children.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => highlightInUI(selectedNode.name)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Highlight in UI
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => logToConsole(selectedNode)}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Log to Console
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Force Re-render
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-slate-800 flex gap-4 text-xs bg-slate-900/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Component</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-slate-400">Provider</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-slate-400">Element</span>
        </div>
        <div className="ml-auto text-slate-500">
          💡 Full DevTools integration requires browser extension
        </div>
      </div>
    </div>
  );
};

export default ComponentsTab;
