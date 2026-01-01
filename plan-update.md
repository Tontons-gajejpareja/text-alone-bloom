# 🎯 URBANSHADE OS v3.0 "THE YEAR UPDATE" MEGA PLAN

**Release Date:** February 27, 2025  
**Development Period:** ~1 month

---

## ✅ ALREADY COMPLETED (by PR #22 & previous work)

### Phase 1: Real File System (In Progress)
- `useVirtualFileSystem` hook enhanced with trash, permissions, copy/cut/paste, favorites, search, file history
- File Explorer wired up with tree view, quick access, favorites, grid/list views, breadcrumbs, search, multi-select, preview panel, dialogs
- Desktop icons integration pending
- File associations pending

### Phase 4: Widget System ✅
- `WidgetManager` with drag-and-drop, edit mode, resize
- 9 Widgets: Clock, Weather, Notes, System Monitor, Quick Links, Anomaly Status, Breach Alert, Security Level, Power Grid
- Persistence via localStorage
- Categories: General, Utility, SCP Facility

### Phase 5: App Store & Plugin Store ✅
- Card-based layout with search & categories
- Featured apps carousel
- Install/uninstall flow with progress tracking
- Plugin categories and management

### Phase 6: DEF-DEV Tabs ✅ (Basic - Wired)
- PerformanceTab, NetworkTab, EventsTab, ComponentTab, FakeModTab, AdminTab

### NAVI AI Security System ✅
- Permanent lockout on 7 violations (until refresh)
- Warning notifications at 3 and 5 attempts
- Lockout screen with NAVI branding

### Moderation Panel Overhaul ✅
- Hadal Blacksite theme
- User details panel with ranks
- Live activity feed
- Zone control & lockdown features
- Personnel ranks (EXR-P, LR-P, MR-P, Staff, Security, Admin)

### Terminology Update (Partial) ✅
- D-Class → EXR-P in FacilityMap, SecurityCameras, PersonnelDirectory

---

## 🔧 REMAINING PHASES

### Phase 2: Notification Center (~3 days)
1. **Slide-out Panel**
   - Animate from right side
   - Grouped notifications by app/time
   - Mark read/dismiss actions
   
2. **Do Not Disturb**
   - Schedule DND times
   - Priority breakthrough settings
   - Quick toggle in system tray

---

### Phase 3: Theme Engine & Visual Effects (~1 week)
1. **Acrylic/Blur Effects**
   - `backdrop-blur` on windows, taskbar, start menu
   - Adjustable blur intensity
   
2. **Smooth Animations**
   - Window open/close/minimize animations
   - Start menu slide animation
   - Transition effects everywhere

3. **Theme Editor Component**
   - Accent colors, window colors, fonts
   - Save/export/import themes as JSON
   - **NEW PRESETS**:
     - **Hadal Blacksite** (deep sea blue-gray, amber accents)
     - **NAVI Terminal** (CRT green, glitch effects)
     - **Pressure Industrial** (rusty orange, brutalist)
     - **Mantle Zone** (lava reds, hellish)
     - **Oxygen Gardens** (bioluminescent greens, cyan)
     - Default Dark, Default Light, Windows 10/11, macOS

---

### Phase 6+: DEF-DEV 3.0 MEGA UPGRADE (~5 days)

**Consolidate duplicate tabs:**
- Merge `ComponentInspectorTab` + `ComponentTab` → keep best features
- Merge `NetworkInspectorTab` + `NetworkTab`
- Merge `EventDebuggerTab` + `EventsTab`

**NEW DEF-DEV FEATURES:**

1. **Boot Process Analyzer**
   - Boot timeline visualization
   - Network connection attempts log
   - Supabase/Port connection diagnostics
   - Startup performance metrics

2. **Crash Analyzer**
   - Detailed stack traces
   - Component tree at crash time
   - "Reproduce crash" button
   - Auto-fix suggestions
   - Export crash report

3. **Mod/Plugin System**
   - `src/lib/modLoader.ts` - load custom mods
   - Mod manager UI in DEF-DEV
   - Enable/disable mods
   - Mod API for custom apps/themes/widgets

4. **Live System Debugger**
   - Click component → highlight in UI
   - Live prop/state editing
   - Performance metrics per component

5. **Memory Profiler**
   - Track memory usage over time
   - Identify memory leaks
   - Component memory footprint

6. **Event Recorder & Replay**
   - Record user actions
   - Replay for debugging
   - Export recordings

---

### Phase 7: PRESSURE/URBANSHADE TERMINOLOGY UPDATE (~1 day)

**Replace ALL "D-Class" with "EXR-P" across:**
- `src/components/apps/Terminal.tsx` (blackbox data)
- `src/components/apps/ContainmentMonitor.tsx` (personnel counts)
- `src/components/apps/IncidentReports.tsx` (reports)
- All documentation files

**Add New Pressure-Inspired Elements:**
- **NAVI AI** references in terminal/system messages
- **HQ/Dispatch** command references
- **Kroner** as in-app currency (if applicable)
- **PDG (Prisoner Diving Gear)** references in equipment lists
- **Hadal Blacksite** facility name usage
- Zone names: The Ridge, Oxygen Gardens, Mantle Extraction

---

### Phase 8: SCP Facility Integration (~4 days)
1. **Security Clearance System** (already partial)
   - Levels 0-5 with granular access
   - Upgrade through tasks/achievements
   - Lockdown based on clearance

2. **Anomaly Events**
   - Random breach events with alarms
   - Facility-wide alerts
   - Containment procedures (NAVI AI announcements)
   - Evacuation protocols

3. **Enhanced SCP Database**
   - Audio logs with transcripts
   - Redacted documents
   - Security footage (placeholders)
   - **Z-Number designations** (like Z-17 The DiVine from Pressure)

---

### Phase 9: Multiplayer/Social (~1 week)
1. **Real-time Messaging**
   - Message threads
   - Read receipts & typing indicators
   - File attachments

2. **User Presence**
   - Online/offline status
   - Custom status messages

---

### Phase 10: OS Realism Polish (~4 days)
1. **Process Manager** - Real process tree with PIDs
2. **Services** - Background services management
3. **Registry Editor** - Proper tree structure

---

### Phase 11: Final Polish & Release (~3 days)
1. Update version to v3.0
2. **MASSIVE** changelog entry with Pressure/Urbanshade theming
3. Thank supporters from v0.1 ALPHA
4. First-time tour for new features
5. Documentation updates with EXR-P terminology

---

## 📊 REVISED DEVELOPMENT TIMELINE

```
Week 1 (Jan 27 - Feb 2):
├── Complete Phase 1: Real File System (Desktop icons, file associations)
├── Phase 2: Notification Center
└── Phase 7: Terminology Update (remaining files)

Week 2 (Feb 3 - Feb 9):
├── Phase 3: Theme Engine & Visual Effects
│   └── Hadal Blacksite, NAVI Terminal, Pressure Industrial themes
└── Phase 4: Widgets (any remaining polish)

Week 3 (Feb 10 - Feb 16):
├── Phase 6+: DEF-DEV 3.0 MEGA UPGRADE
│   ├── Boot Analyzer, Crash Analyzer
│   ├── Mod/Plugin System
│   └── Consolidate duplicate tabs
└── Continue DEF-DEV enhancements

Week 4 (Feb 17 - Feb 23):
├── Phase 8: SCP Facility Integration
│   └── NAVI AI, breach events, Z-number specimens
└── Phase 9: Multiplayer/Social

Week 5 (Feb 24 - Feb 27):
├── Phase 10: OS Realism Polish
└── Phase 11: Final Polish & Release 🎉
```

---

## 🎨 THEME PRESETS (Pressure-Inspired)

| Theme Name | Colors | Aesthetic |
|------------|--------|-----------|
| **Hadal Blacksite** | Deep blue-gray, amber accents | Deep sea industrial |
| **NAVI Terminal** | CRT green on black, scanlines | Retro AI terminal |
| **Pressure Industrial** | Rusty orange, steel gray | Brutalist machinery |
| **Mantle Zone** | Lava reds, molten orange | Hellish extraction |
| **Oxygen Gardens** | Bioluminescent greens, cyan | Alien flora vibes |

---

## 🏷️ TERMINOLOGY CHEAT SHEET

| Old Term | New Term (Pressure) | Description |
|----------|---------------------|-------------|
| D-Class | **EXR-P** | Expendable Rank-Prisoner |
| - | **LR-P** | Low Rank-Prisoner |
| - | **MR-P** | Medium Rank-Prisoner |
| Site AI | **NAVI** | Central AI system |
| Command | **HQ/Dispatch** | Central command |
| Credits | **Kroner** | Currency (optional) |
| SCP-XXX | **Z-XX** | Specimen designation style |

---

## 📋 LEGAL PAGES (Added Jan 2026)

- `/terms` - Terms of Service with dual-mode toggle (legal/human-friendly)
- `/privacy` - Privacy Policy with dual-mode toggle (legal/human-friendly)
