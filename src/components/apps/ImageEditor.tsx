import { useState, useRef } from "react";
import { 
  FileImage, Upload, Download, Save, Trash2, Edit, FolderOpen, Search, 
  RefreshCw, Database, Code, Plus, ChevronRight, HardDrive, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface ImageData {
  [key: string]: string;
}

export const ImageEditor = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [savedImages, setSavedImages] = useState<string[]>(() => {
    const images = localStorage.getItem('urbanshade_recovery_images');
    return images ? JSON.parse(images) : [];
  });

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setImageData(data);
        setFileName(file.name);
        toast.success(`Loaded ${file.name}`);
      } catch {
        toast.error("Failed to parse file. Make sure it's a valid .img or .json file.");
      }
    };
    reader.readAsText(file);
  };

  const handleLoadFromStorage = (imageName: string) => {
    const data = localStorage.getItem(`recovery_image_${imageName}`);
    if (data) {
      setImageData(JSON.parse(data));
      setFileName(imageName);
      toast.success(`Loaded ${imageName}`);
    }
  };

  const handleCreateNew = () => {
    const systemImage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('recovery_image_')) {
        systemImage[key] = localStorage.getItem(key) || "";
      }
    }
    setImageData(systemImage);
    setFileName(`urbanshade_image_${Date.now()}.img`);
    toast.success("Created image from current system state");
  };

  const handleSaveValue = (key: string) => {
    if (!imageData) return;
    setImageData({ ...imageData, [key]: editValue });
    setEditingKey(null);
    toast.success(`Updated ${key}`);
  };

  const handleDeleteKey = (key: string) => {
    if (!imageData) return;
    const newData = { ...imageData };
    delete newData[key];
    setImageData(newData);
    toast.success(`Deleted ${key}`);
  };

  const handleAddKey = () => {
    if (!imageData || !newKey) return;
    if (imageData[newKey] !== undefined) {
      toast.error("Key already exists");
      return;
    }
    setImageData({ ...imageData, [newKey]: newValue });
    setNewKey("");
    setNewValue("");
    toast.success(`Added ${newKey}`);
  };

  const handleExport = () => {
    if (!imageData) return;
    const blob = new Blob([JSON.stringify(imageData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `urbanshade_image_${Date.now()}.img`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Image exported successfully");
  };

  const handleApplyToSystem = () => {
    if (!imageData) return;
    if (!window.confirm("This will replace your current system state. Continue?")) return;
    
    localStorage.clear();
    Object.entries(imageData).forEach(([key, value]) => localStorage.setItem(key, value));
    toast.success("System image applied. Reloading...");
    setTimeout(() => window.location.reload(), 1500);
  };

  const handleSaveToStorage = () => {
    if (!imageData || !fileName) return;
    const imageName = fileName.replace(/\.(img|json)$/, '');
    localStorage.setItem(`recovery_image_${imageName}`, JSON.stringify(imageData));
    
    const images = JSON.parse(localStorage.getItem('urbanshade_recovery_images') || '[]');
    if (!images.includes(imageName)) {
      images.push(imageName);
      localStorage.setItem('urbanshade_recovery_images', JSON.stringify(images));
      setSavedImages(images);
    }
    toast.success(`Saved ${imageName} to storage`);
  };

  const filteredEntries = imageData 
    ? Object.entries(imageData).filter(([key, value]) => 
        key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getValuePreview = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return `{...} (${Object.keys(parsed).length} keys)`;
      }
      return String(parsed);
    } catch {
      return value.length > 50 ? value.substring(0, 50) + "..." : value;
    }
  };

  const formatValue = (value: string) => {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50 p-5 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center">
            <FileImage className="w-7 h-7 text-amber-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">.Img Editor</h1>
            <p className="text-sm text-muted-foreground">Edit recovery images and system snapshots</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <input ref={fileInputRef} type="file" accept=".img,.json" onChange={handleImportFile} className="hidden" />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleCreateNew} className="gap-2">
            <Database className="w-4 h-4" />
            Snapshot
          </Button>
          {imageData && (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveToStorage} className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="destructive" size="sm" onClick={handleApplyToSystem} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Apply
              </Button>
            </>
          )}
        </div>
      </div>

      {!imageData ? (
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Empty State */}
            <div className="text-center py-12">
              <div className="w-24 h-24 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <FileImage className="w-12 h-12 text-muted-foreground/40" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Image Loaded</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Import an existing .img file, create a snapshot from your current system, or select a saved recovery image.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => fileInputRef.current?.click()} className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import File
                </Button>
                <Button variant="outline" onClick={handleCreateNew} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Snapshot
                </Button>
              </div>
            </div>

            {/* Saved Images */}
            {savedImages.length > 0 && (
              <div className="border border-border/50 rounded-2xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-amber-500" />
                  Saved Images
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {savedImages.map(img => (
                    <button
                      key={img}
                      onClick={() => handleLoadFromStorage(img)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/30 hover:border-primary/30 transition-all text-left group"
                    >
                      <FileImage className="w-8 h-8 text-amber-500/70 group-hover:text-amber-500 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{img}</p>
                        <p className="text-xs text-muted-foreground">.img file</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* File Info Bar */}
          <div className="px-5 py-3 bg-muted/20 border-b border-border/30 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <FileImage className="w-5 h-5 text-amber-500" />
              <span className="font-mono text-sm">{fileName}</span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                {Object.keys(imageData).length} entries
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 h-9 bg-background/50"
              />
            </div>
          </div>

          <Tabs defaultValue="entries" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-5 mt-4 flex-shrink-0 w-fit">
              <TabsTrigger value="entries" className="gap-2">
                <Edit className="w-4 h-4" />
                Entries
              </TabsTrigger>
              <TabsTrigger value="raw" className="gap-2">
                <Code className="w-4 h-4" />
                Raw JSON
              </TabsTrigger>
              <TabsTrigger value="add" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="flex-1 min-h-0 mt-0 p-5 pt-4">
              <ScrollArea className="h-full">
                <div className="space-y-2 pr-2">
                  {filteredEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className="border border-border/50 rounded-xl p-4 hover:border-primary/30 transition-colors bg-muted/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-primary font-medium mb-2">
                            {key}
                          </div>
                          {editingKey === key ? (
                            <div className="space-y-3">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full h-32 bg-background border border-border rounded-lg p-3 font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleSaveValue(key)}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>Cancel</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground font-mono truncate bg-background/50 px-3 py-2 rounded-lg">
                              {getValuePreview(value)}
                            </div>
                          )}
                        </div>
                        {editingKey !== key && (
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditingKey(key);
                                setEditValue(formatValue(value));
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteKey(key)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="raw" className="flex-1 min-h-0 mt-0 p-5 pt-4">
              <ScrollArea className="h-full">
                <pre className="text-xs font-mono bg-muted/30 rounded-xl p-5 whitespace-pre-wrap border border-border/30">
                  {JSON.stringify(imageData, null, 2)}
                </pre>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="flex-1 min-h-0 mt-0 p-5 pt-4">
              <div className="max-w-lg space-y-5">
                <div className="p-5 rounded-xl bg-muted/30 border border-border/30">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Entry
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Key</label>
                      <Input
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="settings_custom_value"
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Value</label>
                      <textarea
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder='{"example": "value"} or plain text'
                        className="w-full h-32 bg-background border border-border rounded-lg p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <Button onClick={handleAddKey} disabled={!newKey} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Entry
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};