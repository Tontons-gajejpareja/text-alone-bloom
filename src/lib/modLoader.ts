/**
 * DEF-DEV 3.0 Mod/Plugin System
 * Allows loading custom mods for apps, themes, and widgets
 */

export interface ModManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  type: 'app' | 'theme' | 'widget' | 'utility';
  entryPoint?: string;
  permissions: string[];
  dependencies?: string[];
  enabled: boolean;
  installedAt: string;
}

export interface ModAPI {
  // System access
  getSettings: () => Record<string, any>;
  setSettings: (key: string, value: any) => void;
  
  // UI access
  showNotification: (title: string, message: string) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  
  // Storage access
  getStorage: (key: string) => any;
  setStorage: (key: string, value: any) => void;
  
  // Event system
  on: (event: string, handler: Function) => void;
  off: (event: string, handler: Function) => void;
  emit: (event: string, data?: any) => void;
  
  // Logging
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

class ModLoader {
  private mods: Map<string, ModManifest> = new Map();
  private loadedMods: Map<string, any> = new Map();
  private eventHandlers: Map<string, Set<Function>> = new Map();
  private modAPI: ModAPI;

  constructor() {
    this.modAPI = this.createModAPI();
    this.loadInstalledMods();
  }

  private createModAPI(): ModAPI {
    return {
      getSettings: () => {
        const settings: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith('settings_')) {
            try {
              settings[key] = JSON.parse(localStorage.getItem(key) || '');
            } catch {
              settings[key] = localStorage.getItem(key);
            }
          }
        }
        return settings;
      },
      
      setSettings: (key: string, value: any) => {
        localStorage.setItem(`settings_${key}`, JSON.stringify(value));
        this.emit('settings:changed', { key, value });
      },
      
      showNotification: (title: string, message: string) => {
        this.emit('notification:show', { title, message });
      },
      
      showToast: (message: string, type = 'info') => {
        this.emit('toast:show', { message, type });
      },
      
      getStorage: (key: string) => {
        try {
          return JSON.parse(localStorage.getItem(`mod_${key}`) || 'null');
        } catch {
          return localStorage.getItem(`mod_${key}`);
        }
      },
      
      setStorage: (key: string, value: any) => {
        localStorage.setItem(`mod_${key}`, JSON.stringify(value));
      },
      
      on: (event: string, handler: Function) => {
        if (!this.eventHandlers.has(event)) {
          this.eventHandlers.set(event, new Set());
        }
        this.eventHandlers.get(event)!.add(handler);
      },
      
      off: (event: string, handler: Function) => {
        this.eventHandlers.get(event)?.delete(handler);
      },
      
      emit: (event: string, data?: any) => {
        this.emit(event, data);
      },
      
      log: (...args: any[]) => console.log('[MOD]', ...args),
      warn: (...args: any[]) => console.warn('[MOD]', ...args),
      error: (...args: any[]) => console.error('[MOD]', ...args),
    };
  }

  private loadInstalledMods() {
    const stored = localStorage.getItem('defdev_mods');
    if (stored) {
      try {
        const mods: ModManifest[] = JSON.parse(stored);
        for (const mod of mods) {
          this.mods.set(mod.id, mod);
          if (mod.enabled) {
            this.enableMod(mod.id);
          }
        }
      } catch (e) {
        console.error('[ModLoader] Failed to load mods:', e);
      }
    }
  }

  private saveMods() {
    const mods = Array.from(this.mods.values());
    localStorage.setItem('defdev_mods', JSON.stringify(mods));
  }

  emit(event: string, data?: any) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          console.error(`[ModLoader] Event handler error for ${event}:`, e);
        }
      });
    }
  }

  async installMod(manifest: ModManifest): Promise<boolean> {
    if (this.mods.has(manifest.id)) {
      console.warn(`[ModLoader] Mod ${manifest.id} already installed`);
      return false;
    }

    manifest.installedAt = new Date().toISOString();
    manifest.enabled = false;
    
    this.mods.set(manifest.id, manifest);
    this.saveMods();
    
    console.log(`[ModLoader] Installed mod: ${manifest.name} v${manifest.version}`);
    this.emit('mod:installed', manifest);
    
    return true;
  }

  uninstallMod(modId: string): boolean {
    const mod = this.mods.get(modId);
    if (!mod) {
      console.warn(`[ModLoader] Mod ${modId} not found`);
      return false;
    }

    if (mod.enabled) {
      this.disableMod(modId);
    }

    this.mods.delete(modId);
    this.loadedMods.delete(modId);
    this.saveMods();
    
    // Clean up mod storage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`mod_${modId}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`[ModLoader] Uninstalled mod: ${mod.name}`);
    this.emit('mod:uninstalled', mod);
    
    return true;
  }

  enableMod(modId: string): boolean {
    const mod = this.mods.get(modId);
    if (!mod) {
      console.warn(`[ModLoader] Mod ${modId} not found`);
      return false;
    }

    if (mod.enabled) {
      return true;
    }

    try {
      // In a real implementation, this would dynamically load the mod's code
      mod.enabled = true;
      this.saveMods();
      
      console.log(`[ModLoader] Enabled mod: ${mod.name}`);
      this.emit('mod:enabled', mod);
      
      return true;
    } catch (e) {
      console.error(`[ModLoader] Failed to enable mod ${modId}:`, e);
      return false;
    }
  }

  disableMod(modId: string): boolean {
    const mod = this.mods.get(modId);
    if (!mod) {
      console.warn(`[ModLoader] Mod ${modId} not found`);
      return false;
    }

    if (!mod.enabled) {
      return true;
    }

    try {
      mod.enabled = false;
      this.loadedMods.delete(modId);
      this.saveMods();
      
      console.log(`[ModLoader] Disabled mod: ${mod.name}`);
      this.emit('mod:disabled', mod);
      
      return true;
    } catch (e) {
      console.error(`[ModLoader] Failed to disable mod ${modId}:`, e);
      return false;
    }
  }

  getMod(modId: string): ModManifest | undefined {
    return this.mods.get(modId);
  }

  getAllMods(): ModManifest[] {
    return Array.from(this.mods.values());
  }

  getEnabledMods(): ModManifest[] {
    return this.getAllMods().filter(m => m.enabled);
  }

  getModsByType(type: ModManifest['type']): ModManifest[] {
    return this.getAllMods().filter(m => m.type === type);
  }

  getAPI(): ModAPI {
    return this.modAPI;
  }
}

// Singleton instance
export const modLoader = new ModLoader();

// Sample mods for testing
export const SAMPLE_MODS: ModManifest[] = [
  {
    id: 'dark-hacker-theme',
    name: 'Dark Hacker Theme',
    version: '1.0.0',
    author: 'CyberDev',
    description: 'A sleek dark theme with green accents inspired by hacker aesthetics',
    type: 'theme',
    permissions: ['settings:read', 'settings:write'],
    enabled: false,
    installedAt: ''
  },
  {
    id: 'system-stats-widget',
    name: 'System Stats Widget',
    version: '2.1.0',
    author: 'WidgetMaster',
    description: 'Displays real-time CPU, memory, and network statistics on your desktop',
    type: 'widget',
    permissions: ['system:read'],
    enabled: false,
    installedAt: ''
  },
  {
    id: 'quick-notes-app',
    name: 'Quick Notes',
    version: '1.2.0',
    author: 'ProductivityTools',
    description: 'A simple but powerful note-taking app with markdown support',
    type: 'app',
    permissions: ['storage:read', 'storage:write'],
    enabled: false,
    installedAt: ''
  },
  {
    id: 'auto-backup-utility',
    name: 'Auto Backup',
    version: '1.0.5',
    author: 'SafeData',
    description: 'Automatically backs up your settings and data at regular intervals',
    type: 'utility',
    permissions: ['storage:read', 'storage:write', 'settings:read'],
    enabled: false,
    installedAt: ''
  }
];
