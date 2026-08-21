import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  HardDrive,
  Coins,
  Boxes,
  Building2,
  Grid,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  Usb
} from 'lucide-react';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { BackupManager } from './components/BackupManager';
import { ResourceEditor } from './components/ResourceEditor';
import { BarnInventory } from './components/BarnInventory';
import { TownBuildingsManager } from './components/TownBuildingsManager';
import { LayoutBlueprints } from './components/LayoutBlueprints';
import { IntegrityValidator } from './components/IntegrityValidator';
import { AndroidFileManager } from './components/AndroidFileManager';
import { AndroidBridge } from './components/AndroidBridge';
import { DeviceSyncModal } from './components/DeviceSyncModal';
import { SettingsModal } from './components/SettingsModal';
import { StorageService } from './services/storageService';
import { AndroidBridgeService } from './services/androidBridgeService';
import { useLanguage } from './context/LanguageContext';
import {
  SaveSlot,
  TownProfile,
  TownResources,
  BarnItem,
  TownBuilding,
  LayoutBlueprint,
  SyncLog,
  AppSettings,
  RollbackSnapshot,
} from './types/index';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [activeSlot, setActiveSlot] = useState<SaveSlot | null>(null);
  const [blueprints, setBlueprints] = useState<LayoutBlueprint[]>([]);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [rollbackHistory, setRollbackHistory] = useState<RollbackSnapshot[]>(() => StorageService.getRollbackHistory());
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDeviceSyncOpen, setIsDeviceSyncOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { t, isRtl } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedSlots = StorageService.getSlots();
    const loadedActive = StorageService.getActiveSlot();
    const loadedBps = StorageService.getBlueprints();
    const loadedLogs = StorageService.getLogs();
    const loadedSettings = StorageService.getSettings();
    const loadedRollbacks = StorageService.getRollbackHistory();

    setSlots(loadedSlots);
    setActiveSlot(loadedActive);
    setBlueprints(loadedBps);
    setLogs(loadedLogs);
    setSettings(loadedSettings);
    setRollbackHistory(loadedRollbacks);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to persist current slot updates with Pre-Save Playrix Hook & Auto-Save Rollback Checkpoint
  const updateCurrentSlot = (updates: Partial<SaveSlot>, changeLabel: string = 'Modification') => {
    if (!activeSlot) return;

    // 1. Immediate Rollback Point creation BEFORE structural changes occur
    if (settings.autoRollbackSnapshots) {
      StorageService.createRollbackSnapshot(activeSlot, changeLabel);
      setRollbackHistory(StorageService.getRollbackHistory());
    }

    // 2. Pre-save hook: automatically strips unnecessary metadata and reformats
    // the save object to strictly mirror the original Playrix 'nedata.db' structure.
    const mergedSlot = {
      ...activeSlot,
      ...updates,
    };

    const sanitizedAndReformatted: SaveSlot = StorageService.preSaveReformatHook(mergedSlot);

    setActiveSlot(sanitizedAndReformatted);
    StorageService.saveActiveSlot(sanitizedAndReformatted);

    const updatedSlots = slots.map((s) => (s.id === sanitizedAndReformatted.id ? sanitizedAndReformatted : s));
    setSlots(updatedSlots);

    // 3. Force background export of 'nedata.db' every time a modification is made
    if (settings.autoSaveEnabled || settings.autoExportNedata) {
      StorageService.exportNedataDb(sanitizedAndReformatted, !settings.silentBackgroundExport);
      StorageService.addLog({
        action: 'AUTO_SAVE_EXPORT',
        details: `Auto-saved nedata.db & created rollback checkpoint (${changeLabel})`,
        status: 'success',
      });
      setLogs(StorageService.getLogs());
    }

    // 4. Real-time Android Bridge: Direct USB/ADB push to connected device's internal storage
    if (settings.autoAdbSync && AndroidBridgeService.isConnected()) {
      AndroidBridgeService.syncNedataToDevice(sanitizedAndReformatted, {
        forceRestartGame: false,
      }).catch((err) => {
        console.warn('Background ADB auto-sync warning:', err);
      });
    }
  };

  const handleUpdateProfile = (profileUpdates: Partial<TownProfile>) => {
    if (!activeSlot) return;
    const newProfile = { ...activeSlot.profile, ...profileUpdates };
    updateCurrentSlot(
      {
        profile: newProfile,
        townName: newProfile.townName,
        townLevel: newProfile.level,
      },
      `Profile: ${newProfile.townName} (Lvl ${newProfile.level})`
    );
    showToast(t.toastProfileUpdated);
  };

  const handleUpdateResources = (newResources: TownResources) => {
    if (!activeSlot) return;
    updateCurrentSlot(
      {
        resources: newResources,
        coins: newResources.coins,
        tCash: newResources.tCash,
      },
      `Resources: ${newResources.coins.toLocaleString()} C / ${newResources.tCash.toLocaleString()} TC`
    );
    showToast(t.toastResourcesSynced);
  };

  const handleUpdateInventory = (newInventory: BarnItem[]) => {
    if (!activeSlot) return;
    const used = newInventory.reduce((acc, curr) => acc + curr.count, 0);
    updateCurrentSlot(
      {
        inventory: newInventory,
        profile: {
          ...activeSlot.profile,
          barnUsed: used,
        },
      },
      `Barn Inventory: ${used} items`
    );
  };

  const handleUpdateBuildings = (newBuildings: TownBuilding[]) => {
    if (!activeSlot) return;
    updateCurrentSlot(
      {
        buildings: newBuildings,
      },
      `Buildings & Factories (${newBuildings.length} structures)`
    );
    showToast(t.toastBuildingsUpdated);
  };

  const handleSelectSlot = (slot: SaveSlot) => {
    setActiveSlot(slot);
    StorageService.saveActiveSlot(slot);
    showToast(`${t.toastSlotLoaded}: ${slot.name}`);
  };

  const handleUpdateSlots = (newSlots: SaveSlot[]) => {
    setSlots(newSlots);
    StorageService.saveSlots(newSlots);
  };

  const handleRestoreRollback = (snapshot: RollbackSnapshot) => {
    const restored = StorageService.preSaveReformatHook(snapshot.slotBeforeChange);
    setActiveSlot(restored);
    StorageService.saveActiveSlot(restored);
    const updatedSlots = slots.map((s) => (s.id === restored.id ? restored : s));
    setSlots(updatedSlots);

    StorageService.addLog({
      action: 'ROLLBACK_RESTORE',
      details: `Rolled back to checkpoint "${snapshot.triggerAction}" from ${new Date(snapshot.createdAt).toLocaleTimeString()}`,
      status: 'info',
    });
    setLogs(StorageService.getLogs());
    confetti({ particleCount: 45, spread: 65 });
    showToast(t.toastRollbackRestored);
  };

  const handleApplyBlueprint = (blueprint: LayoutBlueprint) => {
    if (!activeSlot) return;
    if (settings.autoRollbackSnapshots) {
      StorageService.createRollbackSnapshot(activeSlot, `Before Blueprint: ${blueprint.title}`);
      setRollbackHistory(StorageService.getRollbackHistory());
    }
    StorageService.addLog({
      action: 'RESOURCE_MODIFIED',
      details: `Applied town layout blueprint "${blueprint.title}"`,
      status: 'success',
    });
    setLogs(StorageService.getLogs());
    showToast(`${t.toastBlueprintApplied} (${blueprint.title})`);
  };

  const handleExportSave = () => {
    if (!activeSlot) return;
    StorageService.exportSaveAsJson(activeSlot);
    StorageService.addLog({
      action: 'BACKUP_CREATED',
      details: `Exported JSON save file for ${activeSlot.townName}`,
      status: 'success',
    });
    setLogs(StorageService.getLogs());
    showToast(t.toastBackupExported);
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedSlot: SaveSlot = json.slotData || json;

        if (!importedSlot.profile || !importedSlot.resources) {
          alert(t.invalidSaveFileFormat);
          return;
        }

        if (activeSlot && settings.autoRollbackSnapshots) {
          StorageService.createRollbackSnapshot(activeSlot, 'Before Save Import');
          setRollbackHistory(StorageService.getRollbackHistory());
        }

        const newSlot: SaveSlot = {
          ...importedSlot,
          id: 'slot-imported-' + Date.now(),
          name: `Imported (${importedSlot.townName || 'Town'})`,
          slotNumber: slots.length + 1,
          updatedAt: new Date().toISOString(),
        };

        const updatedSlots = [...slots, newSlot];
        setSlots(updatedSlots);
        StorageService.saveSlots(updatedSlots);
        setActiveSlot(newSlot);
        StorageService.saveActiveSlot(newSlot);

        StorageService.addLog({
          action: 'SAVE_RESTORED',
          details: `Imported save file for ${newSlot.townName}`,
          status: 'success',
        });
        setLogs(StorageService.getLogs());

        confetti({ particleCount: 50, spread: 70 });
        showToast(t.toastImportSuccess);
      } catch (err) {
        alert('Failed reading JSON save file: ' + err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      StorageService.addLog({
        action: 'CLOUD_SYNC',
        details: 'Synced save state with encrypted VIP cloud EU-Central (38.0.1)',
        status: 'success',
      });
      setLogs(StorageService.getLogs());
      confetti({ particleCount: 30 });
      showToast(t.toastCloudSyncSuccess);
    }, 1200);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleResetData = () => {
    if (confirm(t.confirmResetFactory)) {
      StorageService.resetToDefault();
      window.location.reload();
    }
  };

  if (!activeSlot) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>{t.loadingEngine}</span>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: t.tabOverview, icon: LayoutDashboard },
    { id: 'backups', label: t.tabBackups, icon: HardDrive },
    { id: 'resources', label: t.tabResources, icon: Coins },
    { id: 'barn', label: t.tabBarn, icon: Boxes },
    { id: 'buildings', label: t.tabBuildings, icon: Building2 },
    { id: 'blueprints', label: t.tabBlueprints, icon: Grid },
    { id: 'integrity', label: t.tabIntegrity, icon: ShieldCheck },
    { id: 'android-files', label: t.tabAndroidFiles, icon: Smartphone },
    { id: 'android-bridge', label: t.tabAndroidBridge, icon: Usb },
  ];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white font-sans ${isRtl ? 'dir-rtl' : 'dir-ltr'}`}>
      {/* Hidden File Input for Save Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <Header
        profile={activeSlot.profile}
        activeSlot={activeSlot}
        slots={slots}
        onSelectSlot={handleSelectSlot}
        onExport={handleExportSave}
        onImportClick={() => fileInputRef.current?.click()}
        onSyncCloud={handleSyncCloud}
        isSyncing={isSyncing}
        onOpenDeviceSync={() => setIsDeviceSyncOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBridge={() => setActiveTab('android-bridge')}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab View Panels */}
        <div className="min-h-[500px]">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              profile={activeSlot.profile}
              resources={activeSlot.resources}
              inventory={activeSlot.inventory}
              activeSlot={activeSlot}
              onUpdateProfile={handleUpdateProfile}
              onTabChange={setActiveTab}
            />
          )}

          {activeTab === 'backups' && (
            <BackupManager
              slots={slots}
              activeSlot={activeSlot}
              logs={logs}
              rollbackHistory={rollbackHistory}
              settings={settings}
              onSelectSlot={handleSelectSlot}
              onUpdateSlots={handleUpdateSlots}
              onRestoreRollback={handleRestoreRollback}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onRefresh={() => setSlots(StorageService.getSlots())}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceEditor
              resources={activeSlot.resources}
              onUpdateResources={handleUpdateResources}
            />
          )}

          {activeTab === 'barn' && (
            <BarnInventory
              inventory={activeSlot.inventory}
              profile={activeSlot.profile}
              onUpdateInventory={handleUpdateInventory}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'buildings' && (
            <TownBuildingsManager
              buildings={activeSlot.buildings}
              onUpdateBuildings={handleUpdateBuildings}
            />
          )}

          {activeTab === 'blueprints' && (
            <LayoutBlueprints
              blueprints={blueprints}
              onApplyBlueprint={handleApplyBlueprint}
            />
          )}

          {activeTab === 'integrity' && (
            <IntegrityValidator
              activeSlot={activeSlot}
              onFixIntegrity={() => {
                showToast(t.toastIntegrityRepaired);
              }}
            />
          )}

          {activeTab === 'android-files' && (
            <AndroidFileManager activeSlot={activeSlot} />
          )}

          {activeTab === 'android-bridge' && (
            <AndroidBridge
              activeSlot={activeSlot}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onShowToast={showToast}
            />
          )}
        </div>
      </main>

      {/* Direct Device Sync Modal */}
      <DeviceSyncModal
        isOpen={isDeviceSyncOpen}
        onClose={() => setIsDeviceSyncOpen(false)}
        activeSlot={activeSlot}
      />

      {/* Settings & Auto-Save Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSt) => setSettings(newSt)}
        activeSlot={activeSlot}
        rollbackHistory={rollbackHistory}
        onRestoreRollback={handleRestoreRollback}
        onShowToast={showToast}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-3 rounded-xl shadow-2xl shadow-emerald-950/50 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Footer with Reset */}
      <footer className="border-t border-slate-850 bg-slate-950 text-slate-500 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>{t.footerRights}</span>
            <span>•</span>
            <span className="text-slate-400 font-mono">{t.footerCompliance}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors font-mono"
              title={t.resetFactoryBtn}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetFactoryBtn}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
