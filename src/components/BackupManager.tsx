import React, { useState } from 'react';
import {
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Shield,
  FileCode,
  Copy,
  Check,
  AlertCircle,
  Cloud,
  FileCheck,
  RotateCcw,
  Zap,
  Settings,
  History
} from 'lucide-react';
import { SaveSlot, SyncLog, RollbackSnapshot, AppSettings } from '../types/index';
import { StorageService } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface BackupManagerProps {
  slots: SaveSlot[];
  activeSlot: SaveSlot;
  logs: SyncLog[];
  rollbackHistory?: RollbackSnapshot[];
  settings?: AppSettings;
  onSelectSlot: (slot: SaveSlot) => void;
  onUpdateSlots: (slots: SaveSlot[]) => void;
  onRestoreRollback?: (snapshot: RollbackSnapshot) => void;
  onOpenSettings?: () => void;
  onRefresh: () => void;
}

export const BackupManager: React.FC<BackupManagerProps> = ({
  slots,
  activeSlot,
  logs,
  rollbackHistory = [],
  settings,
  onSelectSlot,
  onUpdateSlots,
  onRestoreRollback,
  onOpenSettings,
  onRefresh,
}) => {
  const { t, isRtl } = useLanguage();
  const [newSlotName, setNewSlotName] = useState('');
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);
  const [copiedChecksum, setCopiedChecksum] = useState<string | null>(null);
  const [selectedSlotForDiff, setSelectedSlotForDiff] = useState<SaveSlot | null>(null);

  const handleCreateBackup = () => {
    const nextSlotNum = slots.length + 1;
    const name = newSlotName.trim() || `${t.slotNumber} #${nextSlotNum} (${activeSlot.townName})`;

    const newSlot: SaveSlot = {
      ...activeSlot,
      id: 'slot-' + Date.now(),
      name,
      slotNumber: nextSlotNum,
      updatedAt: new Date().toISOString(),
      checksum: StorageService.generateChecksum(activeSlot),
      isAutoBackup: false,
      isCloudSynced: true,
      fileSizeBytes: Math.floor(450000 + Math.random() * 80000),
    };

    const updated = [...slots, newSlot];
    onUpdateSlots(updated);
    StorageService.addLog({
      action: 'BACKUP_CREATED',
      details: `Created snapshot for slot #${nextSlotNum}: "${name}"`,
      status: 'success',
    });
    setNewSlotName('');
    setIsCreatingSlot(false);
    confetti({ particleCount: 35, spread: 60 });
  };

  const handleDeleteSlot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (slots.length <= 1) {
      alert(t.confirmDeleteSlot);
      return;
    }
    const filtered = slots.filter((s) => s.id !== id);
    onUpdateSlots(filtered);
    if (activeSlot.id === id) {
      onSelectSlot(filtered[0]);
    }
  };

  const handleCopyChecksum = (chk: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(chk);
    setCopiedChecksum(chk);
    setTimeout(() => setCopiedChecksum(null), 2000);
  };

  const handleExportSlot = (slot: SaveSlot, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.exportSaveAsJson(slot);
    confetti({ particleCount: 25 });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-emerald-400" />
              {t.backupManagerTitle}
            </h2>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
              settings?.autoSaveEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${settings?.autoSaveEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {settings?.autoSaveEnabled ? t.autoSaveActiveBadge : t.autoSaveDisabledBadge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.backupManagerDesc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{t.settings}</span>
            </button>
          )}
          <button
            onClick={() => setIsCreatingSlot(!isCreatingSlot)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createSnapshotBtn}</span>
          </button>
        </div>
      </div>

      {/* Immediate Rollback Checkpoints (Pre-Modification Snapshots) */}
      {rollbackHistory && rollbackHistory.length > 0 && (
        <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>{t.rollbackHistoryTitle}</span>
            </h3>
            <span className="text-xs text-indigo-300 font-mono">
              {rollbackHistory.length} checkpoints
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rollbackHistory.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[140px]">
                      {item.triggerAction || 'Pre-Change Snapshot'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5">
                    <span>Lvl {item.slotBeforeChange.townLevel}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-mono">{item.slotBeforeChange.coins.toLocaleString()} C</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">{item.slotBeforeChange.tCash.toLocaleString()} TC</span>
                  </div>
                </div>

                {onRestoreRollback && (
                  <button
                    onClick={() => onRestoreRollback(item)}
                    className="w-full py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-950/40 mt-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.restoreRollbackBtn}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Slot Creator Input (if active) */}
      {isCreatingSlot && (
        <div className="bg-slate-850 border border-emerald-500/40 rounded-xl p-4 sm:p-6 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            {t.freezeStateTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.freezeStateDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newSlotName}
              onChange={(e) => setNewSlotName(e.target.value)}
              placeholder={t.placeholderSnapshot}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBackup}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                {t.confirmAndSave}
              </button>
              <button
                onClick={() => setIsCreatingSlot(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isActive = slot.id === activeSlot.id;
          return (
            <div
              key={slot.id}
              onClick={() => onSelectSlot(slot)}
              className={`cursor-pointer rounded-xl p-5 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-850 border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className={`absolute top-0 ${isRtl ? 'left-0 rounded-br-lg' : 'right-0 rounded-bl-lg'} bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 flex items-center gap-1 shadow`}>
                  <CheckCircle className="w-3 h-3" />
                  {t.activeSaveBadge}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      {t.slotNumber} #{slot.slotNumber}
                    </span>
                    <h4 className="text-base font-bold text-white truncate max-w-[200px]">
                      {slot.name}
                    </h4>
                    <p className="text-xs text-slate-400">{slot.townName}</p>
                  </div>
                </div>

                {/* Slot Details Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800/80">
                  <div>
                    <span className="text-slate-400">{t.townLevel}:</span>
                    <div className="font-bold text-white text-sm font-mono">{t.level} {slot.townLevel}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">{t.coins}:</span>
                    <div className="font-bold text-amber-400 text-sm font-mono">
                      {slot.coins.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">{t.tCash}:</span>
                    <div className="font-bold text-emerald-400 text-sm font-mono">
                      {slot.tCash.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">{t.fileSize}:</span>
                    <div className="font-medium text-slate-300 text-xs font-mono">
                      {(slot.fileSizeBytes / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>

                {/* Checksum & Timestamp */}
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(slot.updatedAt).toLocaleDateString()} {new Date(slot.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {slot.isCloudSynced && (
                      <span className="text-sky-400 flex items-center gap-1 font-medium">
                        <Cloud className="w-3 h-3" /> {t.cloudSynced}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400">
                    <span className="font-mono text-[10px] text-slate-300 truncate max-w-[140px]">
                      {slot.checksum}
                    </span>
                    <button
                      onClick={(e) => handleCopyChecksum(slot.checksum, e)}
                      className="p-1 hover:text-white transition-colors"
                      title={t.copyChecksum}
                    >
                      {copiedChecksum === slot.checksum ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleExportSlot(slot, e)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    title={t.exportJson}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">{t.exportJson}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSlotForDiff(slot);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    title={t.inspect}
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px]">{t.inspect}</span>
                  </button>
                </div>

                {!isActive && (
                  <button
                    onClick={(e) => handleDeleteSlot(slot.id, e)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title={t.deleteSlot}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot Diff & Inspector Modal */}
      {selectedSlotForDiff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{t.saveInspectorTitle}</h3>
                <p className="text-xs text-slate-400">{selectedSlotForDiff.name}</p>
              </div>
              <button
                onClick={() => setSelectedSlotForDiff(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <div className="text-slate-400">{t.townName}</div>
                  <div className="font-bold text-white mt-1">{selectedSlotForDiff.townName}</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <div className="text-slate-400">{t.level}</div>
                  <div className="font-bold text-white mt-1 font-mono">{t.level} {selectedSlotForDiff.townLevel}</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                  <div className="text-slate-400">{t.coins}</div>
                  <div className="font-bold text-amber-400 mt-1 font-mono">
                    {selectedSlotForDiff.coins.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 text-left" dir="ltr">
                <div className="text-emerald-400 font-bold mb-2">// Encrypted Header Data</div>
                <div>checksum: &quot;{selectedSlotForDiff.checksum}&quot;</div>
                <div>updatedAt: &quot;{selectedSlotForDiff.updatedAt}&quot;</div>
                <div>gameEngine: &quot;Township Core 38.0.1&quot;</div>
                <div>barnItemsCount: {selectedSlotForDiff.inventory.length} distinct item types</div>
                <div>buildingsCount: {selectedSlotForDiff.buildings.length} structures placed</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onSelectSlot(selectedSlotForDiff);
                  setSelectedSlotForDiff(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
              >
                {t.loadThisSave}
              </button>
              <button
                onClick={() => setSelectedSlotForDiff(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Activity Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          {t.syncLogTitle}
        </h3>
        <div className="space-y-2">
          {logs.slice(0, 8).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    log.status === 'success'
                      ? 'bg-emerald-400'
                      : log.status === 'warning'
                      ? 'bg-amber-400'
                      : 'bg-blue-400'
                  }`}
                />
                <span className="text-slate-200 font-medium">{log.details}</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
