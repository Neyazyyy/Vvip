import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  Save,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Zap,
  Sliders,
  History,
  Clock,
  Database,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { AppSettings, RollbackSnapshot, SaveSlot } from '../types/index';
import { StorageService } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  activeSlot: SaveSlot;
  rollbackHistory: RollbackSnapshot[];
  onRestoreRollback: (snapshot: RollbackSnapshot) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  activeSlot,
  rollbackHistory,
  onRestoreRollback,
  onShowToast,
}) => {
  const { t, isRtl } = useLanguage();
  const [selectedSnapshot, setSelectedSnapshot] = useState<RollbackSnapshot | null>(null);

  if (!isOpen) return null;

  const handleToggleAutoSave = () => {
    const updated: AppSettings = {
      ...settings,
      autoSaveEnabled: !settings.autoSaveEnabled,
      autoExportNedata: !settings.autoSaveEnabled, // Keep synced with auto-save
    };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
    onShowToast(
      updated.autoSaveEnabled ? t.autoSaveActiveBadge : t.autoSaveDisabledBadge
    );
  };

  const handleToggleAutoExport = () => {
    const updated: AppSettings = {
      ...settings,
      autoExportNedata: !settings.autoExportNedata,
    };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleToggleAdbSync = () => {
    const updated: AppSettings = {
      ...settings,
      autoAdbSync: !settings.autoAdbSync,
    };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
    onShowToast(
      updated.autoAdbSync ? 'Real-Time USB/ADB Push: ON' : 'Real-Time USB/ADB Push: OFF'
    );
  };

  const handleToggleRollback = () => {
    const updated: AppSettings = {
      ...settings,
      autoRollbackSnapshots: !settings.autoRollbackSnapshots,
    };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleToggleSilent = () => {
    const updated: AppSettings = {
      ...settings,
      silentBackgroundExport: !settings.silentBackgroundExport,
    };
    onUpdateSettings(updated);
    StorageService.saveSettings(updated);
  };

  const handleManualExportNedata = () => {
    StorageService.exportNedataDb(activeSlot, true);
    StorageService.addLog({
      action: 'AUTO_SAVE_EXPORT',
      details: `Manual export of Playrix nedata.db v38.0.1 (${activeSlot.townName})`,
      status: 'success',
    });
    onShowToast(t.toastAutoSavedNedata);
    confetti({ particleCount: 30, spread: 55 });
  };

  const handleRestore = (snapshot: RollbackSnapshot) => {
    onRestoreRollback(snapshot);
    setSelectedSnapshot(null);
    onClose();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/80 overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{t.settingsTitle}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  v38.0.1
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{t.settingsDesc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Main Auto-Save & Export Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>{t.autoSaveToggle}</span>
              <span className={`flex items-center gap-1.5 ${settings.autoSaveEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${settings.autoSaveEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                {settings.autoSaveEnabled ? t.autoSaveActiveBadge : t.autoSaveDisabledBadge}
              </span>
            </div>

            {/* Toggle 1: Auto-Save on modification */}
            <div
              onClick={handleToggleAutoSave}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                settings.autoSaveEnabled
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${settings.autoSaveEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.autoSaveToggle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {t.autoSaveToggleDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoSaveEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoSaveEnabled ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Immediate Rollback Points before modification */}
            <div
              onClick={handleToggleRollback}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                settings.autoRollbackSnapshots
                  ? 'bg-indigo-950/20 border-indigo-500/40 hover:border-indigo-500/60'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${settings.autoRollbackSnapshots ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.autoRollbackToggle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {t.autoRollbackToggleDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoRollbackSnapshots ? 'bg-indigo-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoRollbackSnapshots ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Force nedata.db export on changes */}
            <div
              onClick={handleToggleAutoExport}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                settings.autoExportNedata
                  ? 'bg-sky-950/20 border-sky-500/40 hover:border-sky-500/60'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${settings.autoExportNedata ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Playrix nedata.db Auto-Export</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    Syncs and updates the canonical Playrix Township database binary format on state modifications.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoExportNedata ? 'bg-sky-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoExportNedata ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: Real-time USB/ADB Direct Push */}
            <div
              onClick={handleToggleAdbSync}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                settings.autoAdbSync
                  ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/60'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg mt-0.5 ${settings.autoAdbSync ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{t.autoAdbSyncToggle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                    {t.autoAdbSyncToggleDesc}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.autoAdbSync ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.autoAdbSync ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Quick Manual Export Banner */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-850 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Export nedata.db (Playrix v38.0.1)</p>
                <p className="text-[11px] text-slate-400">Ready for instant Android /storage/ injection</p>
              </div>
            </div>
            <button
              onClick={handleManualExportNedata}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.exportNedataBtn}</span>
            </button>
          </div>

          {/* Rollback Checkpoints Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                <span>{t.rollbackHistoryTitle}</span>
              </h3>
              <span className="text-xs text-slate-500">
                {rollbackHistory.length} checkpoints
              </span>
            </div>

            {rollbackHistory.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center bg-slate-900/40">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">{t.rollbackHistoryEmpty}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {rollbackHistory.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-850 hover:bg-slate-800/80 border border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="text-xs font-bold text-white">
                          {item.triggerAction || 'Pre-Change Snapshot'}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {item.checksum.substring(0, 10)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>Lvl {item.slotBeforeChange.townLevel}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-mono">
                          {item.slotBeforeChange.coins.toLocaleString()} C
                        </span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">
                          {item.slotBeforeChange.tCash.toLocaleString()} T-Cash
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestore(item)}
                      className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-indigo-900/40 self-end sm:self-auto"
                      title={t.restoreRollbackBtn}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{t.restoreRollbackBtn}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Playrix Township Engine v38.0.1 Auto-Guard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};
