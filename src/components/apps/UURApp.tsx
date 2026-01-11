import { useState, useEffect, useRef } from "react";
import { Package, Download, Star, CheckCircle, Trash2, Send, Github, AlertTriangle, Search, List, Plus, X, LayoutGrid, Play, Loader2 } from "lucide-react";
import { 
  UUR_REAL_PACKAGES, 
  getUURAppHtml, 
  getInstalledUURApps, 
  installUURApp, 
  uninstallUURApp,
  isUURAppInstalled,
  getOfficialList,
  getCustomLists,
  addCustomList,
  removeCustomList,
  getAllPackages,
  UUR_CATEGORIES,
  installFromGithub,
  type InstalledUURApp,
  type UURList,
  type UURPackage,
  type UURCategory
} from "@/lib/uurRepository";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UURAppProps {
  onClose: () => void;
}

type ViewMode = 'terminal' | 'gui' | 'run';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'warning' | 'info';
  text: string;
}

export const UURApp = ({ onClose }: UURAppProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('terminal');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [installedApps, setInstalledApps] = useState<InstalledUURApp[]>([]);
  const [allPackages, setAllPackages] = useState<UURPackage[]>([]);
  const [runningApp, setRunningApp] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInstalledApps(getInstalledUURApps());
    setAllPackages(getAllPackages());
    
    // Initial terminal welcome
    setTerminalLines([
      { type: 'info', text: '------------------------------------------' },
      { type: 'info', text: 'UUR Terminal v1.2' },
      { type: 'info', text: '------------------------------------------' },
      { type: 'warning', text: 'The UUR terminal is not recommended' },
      { type: 'warning', text: 'for inexperienced users.' },
      { type: 'info', text: 'For GUI install do "uur gui"' },
      { type: 'info', text: '------------------------------------------' },
      { type: 'output', text: '' },
      { type: 'output', text: 'Type "help" for available commands.' },
    ]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setTerminalLines(prev => [...prev, { type, text }]);
  };

  const refreshPackages = () => {
    setAllPackages(getAllPackages());
    setInstalledApps(getInstalledUURApps());
  };

  const processCommand = async (cmd: string) => {
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    addLine('input', `> ${cmd}`);
    setIsProcessing(true);

    await new Promise(r => setTimeout(r, 100));

    switch (command) {
      case 'help':
        addLine('info', 'Available commands:');
        addLine('output', '  uur gui          - Open graphical interface');
        addLine('output', '  uur list         - List all available packages');
        addLine('output', '  uur installed    - List installed packages');
        addLine('output', '  uur install <id> - Install a package');
        addLine('output', '  uur remove <id>  - Remove a package');
        addLine('output', '  uur run <id>     - Run an installed package');
        addLine('output', '  uur search <q>   - Search packages');
        addLine('output', '  uur info <id>    - Show package info');
        addLine('output', '  clear            - Clear terminal');
        addLine('output', '  exit             - Close UUR');
        break;

      case 'uur':
        if (args[0] === 'gui') {
          addLine('success', 'Opening GUI mode...');
          setTimeout(() => setViewMode('gui'), 500);
        } else if (args[0] === 'list') {
          addLine('info', `Found ${allPackages.length} packages:`);
          allPackages.forEach(pkg => {
            const installed = isUURAppInstalled(pkg.id);
            addLine('output', `  ${installed ? '[✓]' : '[ ]'} ${pkg.id} - ${pkg.name} v${pkg.version}`);
          });
        } else if (args[0] === 'installed') {
          if (installedApps.length === 0) {
            addLine('warning', 'No packages installed.');
          } else {
            addLine('info', `Installed packages (${installedApps.length}):`);
            installedApps.forEach(app => {
              addLine('output', `  ${app.id} - ${app.name} v${app.version}`);
            });
          }
        } else if (args[0] === 'install' && args[1]) {
          const pkgId = args[1];
          const pkg = allPackages.find(p => p.id.toLowerCase() === pkgId);
          if (!pkg) {
            addLine('error', `Package "${pkgId}" not found.`);
          } else if (isUURAppInstalled(pkg.id)) {
            addLine('warning', `Package "${pkg.name}" is already installed.`);
          } else {
            addLine('output', `Installing ${pkg.name}...`);
            await new Promise(r => setTimeout(r, 1000));
            if (installUURApp(pkg.id)) {
              refreshPackages();
              addLine('success', `✓ Successfully installed ${pkg.name}`);
            } else {
              addLine('error', 'Installation failed.');
            }
          }
        } else if (args[0] === 'remove' && args[1]) {
          const pkgId = args[1];
          const installed = installedApps.find(a => a.id.toLowerCase() === pkgId);
          if (!installed) {
            addLine('error', `Package "${pkgId}" is not installed.`);
          } else {
            addLine('output', `Removing ${installed.name}...`);
            await new Promise(r => setTimeout(r, 500));
            if (uninstallUURApp(installed.id)) {
              refreshPackages();
              addLine('success', `✓ Removed ${installed.name}`);
            } else {
              addLine('error', 'Removal failed.');
            }
          }
        } else if (args[0] === 'run' && args[1]) {
          const pkgId = args[1];
          const installed = installedApps.find(a => a.id.toLowerCase() === pkgId);
          if (!installed) {
            addLine('error', `Package "${pkgId}" is not installed.`);
          } else {
            addLine('success', `Launching ${installed.name}...`);
            setRunningApp(installed.id);
            setViewMode('run');
          }
        } else if (args[0] === 'search' && args[1]) {
          const query = args.slice(1).join(' ');
          const results = allPackages.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          );
          if (results.length === 0) {
            addLine('warning', `No packages found for "${query}"`);
          } else {
            addLine('info', `Found ${results.length} packages:`);
            results.forEach(pkg => {
              addLine('output', `  ${pkg.id} - ${pkg.name}`);
            });
          }
        } else if (args[0] === 'info' && args[1]) {
          const pkg = allPackages.find(p => p.id.toLowerCase() === args[1]);
          if (!pkg) {
            addLine('error', `Package "${args[1]}" not found.`);
          } else {
            addLine('info', `Package: ${pkg.name}`);
            addLine('output', `  ID: ${pkg.id}`);
            addLine('output', `  Version: ${pkg.version}`);
            addLine('output', `  Author: ${pkg.author}`);
            addLine('output', `  Category: ${pkg.category}`);
            addLine('output', `  Description: ${pkg.description}`);
            addLine('output', `  Installed: ${isUURAppInstalled(pkg.id) ? 'Yes' : 'No'}`);
          }
        } else {
          addLine('error', 'Unknown uur command. Type "help" for usage.');
        }
        break;

      case 'clear':
        setTerminalLines([]);
        break;

      case 'exit':
        onClose();
        break;

      case '':
        break;

      default:
        addLine('error', `Command not found: ${command}`);
        addLine('output', 'Type "help" for available commands.');
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing) {
      processCommand(currentInput);
      setCurrentInput("");
    }
  };

  // GUI Mode
  if (viewMode === 'gui') {
    return (
      <div className="h-full flex flex-col bg-slate-950 text-white">
        {/* GUI Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
              <Package className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-cyan-400">UUR Manager</h1>
              <p className="text-[10px] text-slate-500">Graphical Interface</p>
            </div>
          </div>
          <button
            onClick={() => setViewMode('terminal')}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            Back to Terminal
          </button>
        </div>

        {/* GUI Content */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Installed Section */}
            {installedApps.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Installed ({installedApps.length})
                </h2>
                <div className="grid gap-2">
                  {installedApps.map(app => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="font-medium text-sm">{app.name}</p>
                          <p className="text-xs text-slate-500">v{app.version}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setRunningApp(app.id);
                            setViewMode('run');
                          }}
                          className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            uninstallUURApp(app.id);
                            refreshPackages();
                            toast.success(`Removed ${app.name}`);
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Packages */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Available Packages
              </h2>
              <div className="grid gap-2">
                {allPackages.filter(p => !isUURAppInstalled(p.id)).map(pkg => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-sm">{pkg.name}</p>
                        <p className="text-xs text-slate-500">{pkg.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (installUURApp(pkg.id)) {
                          refreshPackages();
                          toast.success(`Installed ${pkg.name}`);
                        }
                      }}
                      className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      Install
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Run Mode
  if (viewMode === 'run' && runningApp) {
    const appHtml = getUURAppHtml(runningApp);
    return (
      <div className="h-full flex flex-col bg-slate-950">
        <div className="p-2 border-b border-cyan-500/20 bg-slate-900/80 flex items-center justify-between">
          <span className="text-sm text-cyan-400 font-mono">Running: {runningApp}</span>
          <button
            onClick={() => {
              setRunningApp(null);
              setViewMode('terminal');
            }}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="flex-1">
          {appHtml ? (
            <iframe
              srcDoc={appHtml}
              className="w-full h-full border-0"
              sandbox="allow-scripts"
              title={runningApp}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              App content not available
            </div>
          )}
        </div>
      </div>
    );
  }

  // Terminal Mode (default)
  return (
    <div className="h-full flex flex-col bg-slate-950 font-mono text-sm">
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {terminalLines.map((line, i) => (
          <div 
            key={i} 
            className={`leading-relaxed ${
              line.type === 'input' ? 'text-cyan-400' :
              line.type === 'error' ? 'text-red-400' :
              line.type === 'success' ? 'text-green-400' :
              line.type === 'warning' ? 'text-amber-400' :
              line.type === 'info' ? 'text-slate-500' :
              'text-slate-300'
            }`}
          >
            {line.text}
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-cyan-400">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-transparent text-slate-300 outline-none caret-cyan-400"
            autoFocus
          />
          {isProcessing && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
        </div>
      </div>
    </div>
  );
};