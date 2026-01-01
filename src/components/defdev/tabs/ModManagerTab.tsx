import { useState, useEffect } from "react";
import { Package, Plus, Trash2, Power, PowerOff, Download, Settings, Search, Filter, Code, Palette, Layout, Wrench, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { modLoader, ModManifest, SAMPLE_MODS } from "@/lib/modLoader";

export const ModManagerTab = () => {
  const [mods, setMods] = useState<ModManifest[]>([]);
  const [availableMods, setAvailableMods] = useState<ModManifest[]>([]);
  const [selectedMod, setSelectedMod] = useState<ModManifest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'app' | 'theme' | 'widget' | 'utility'>('all');
  const [showAvailable, setShowAvailable] = useState(false);

  useEffect(() => {
    refreshMods();
    // Load available mods (sample mods that aren't installed)
    const installed = modLoader.getAllMods();
    const available = SAMPLE_MODS.filter(m => !installed.find(i => i.id === m.id));
    setAvailableMods(available);
  }, []);

  const refreshMods = () => {
    setMods(modLoader.getAllMods());
  };

  const handleToggleMod = (modId: string, enabled: boolean) => {
    if (enabled) {
      modLoader.enableMod(modId);
    } else {
      modLoader.disableMod(modId);
    }
    refreshMods();
  };

  const handleInstallMod = async (mod: ModManifest) => {
    await modLoader.installMod({ ...mod });
    refreshMods();
    setAvailableMods(prev => prev.filter(m => m.id !== mod.id));
  };

  const handleUninstallMod = (modId: string) => {
    const mod = modLoader.getMod(modId);
    modLoader.uninstallMod(modId);
    refreshMods();
    if (mod) {
      setAvailableMods(prev => [...prev, { ...mod, enabled: false, installedAt: '' }]);
    }
    if (selectedMod?.id === modId) {
      setSelectedMod(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app': return <Code className="w-4 h-4" />;
      case 'theme': return <Palette className="w-4 h-4" />;
      case 'widget': return <Layout className="w-4 h-4" />;
      case 'utility': return <Wrench className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'app': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'theme': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'widget': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'utility': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const filteredMods = (showAvailable ? availableMods : mods).filter(mod => {
    const matchesSearch = !searchQuery || 
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || mod.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/50">
        <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
          <Package className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold">Mod Manager</h2>
          <p className="text-xs text-slate-500">
            {mods.filter(m => m.enabled).length} active / {mods.length} installed
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showAvailable ? "outline" : "default"}
            size="sm"
            onClick={() => setShowAvailable(false)}
            className={!showAvailable ? "bg-purple-500/20 text-purple-400" : ""}
          >
            Installed ({mods.length})
          </Button>
          <Button
            variant={showAvailable ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAvailable(true)}
            className={showAvailable ? "bg-green-500/20 text-green-400" : ""}
          >
            <Plus className="w-4 h-4 mr-1" />
            Available ({availableMods.length})
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="p-3 border-b border-slate-800 flex items-center gap-3 bg-slate-900/30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mods..."
            className="w-full pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'app', 'theme', 'widget', 'utility'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                filterType === type
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Mod list */}
        <ScrollArea className="flex-1 p-3">
          {filteredMods.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                {showAvailable ? 'No available mods' : 'No mods installed'}
              </p>
              {!showAvailable && (
                <p className="text-xs mt-1">Click "Available" to browse and install mods</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredMods.map(mod => (
                <Card
                  key={mod.id}
                  onClick={() => setSelectedMod(mod)}
                  className={`p-4 cursor-pointer transition-colors border-slate-700 ${
                    selectedMod?.id === mod.id ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-800/30 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${getTypeColor(mod.type)}`}>
                      {getTypeIcon(mod.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-slate-200">{mod.name}</h3>
                        <span className="text-xs text-slate-500">v{mod.version}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded capitalize ${getTypeColor(mod.type)}`}>
                          {mod.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{mod.description}</p>
                      <p className="text-[10px] text-slate-600">by {mod.author}</p>
                    </div>
                    {showAvailable ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleInstallMod(mod); }}
                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Install
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={mod.enabled}
                          onCheckedChange={(checked) => handleToggleMod(mod.id, checked)}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Details panel */}
        {selectedMod && !showAvailable && (
          <div className="w-72 border-l border-slate-800 flex flex-col bg-slate-900/30">
            <div className="p-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded border ${getTypeColor(selectedMod.type)}`}>
                  {getTypeIcon(selectedMod.type)}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{selectedMod.name}</h3>
                  <p className="text-xs text-slate-500">v{selectedMod.version}</p>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-300">{selectedMod.description}</p>
                </div>

                <div>
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Author</h4>
                  <p className="text-sm text-slate-300">{selectedMod.author}</p>
                </div>

                <div>
                  <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedMod.permissions.map(perm => (
                      <span key={perm} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedMod.installedAt && (
                  <div>
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Installed</h4>
                    <p className="text-xs text-slate-400">
                      {new Date(selectedMod.installedAt).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleToggleMod(selectedMod.id, !selectedMod.enabled)}
                  >
                    {selectedMod.enabled ? (
                      <>
                        <PowerOff className="w-4 h-4 mr-2 text-amber-400" />
                        Disable Mod
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4 mr-2 text-green-400" />
                        Enable Mod
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleUninstallMod(selectedMod.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Uninstall
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModManagerTab;
