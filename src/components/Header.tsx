import React, { useState } from 'react';
import {
  ShieldCheck,
  Crown,
  Cloud,
  HardDrive,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Lock,
  Smartphone,
  Languages,
  Globe,
  Settings,
  Zap,
  Usb
} from 'lucide-react';
import { SaveSlot, TownProfile, AppSettings } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface HeaderProps {
  profile: TownProfile;
  activeSlot: SaveSlot;
  slots: SaveSlot[];
  onSelectSlot: (slot: SaveSlot) => void;
  onExport: () => void;
  onImportClick: () => void;
  onSyncCloud: () => void;
  isSyncing: boolean;
  onOpenDeviceSync: () => void;
  onOpenSettings?: () => void;
  onOpenBridge?: () => void;
  settings?: AppSettings;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeSlot,
  slots,
  onSelectSlot,
  onExport,
  onImportClick,
  onSyncCloud,
  isSyncing,
  onOpenDeviceSync,
  onOpenSettings,
  onOpenBridge,
  settings,
}) => {
  const [slotDropdownOpen, setSlotDropdownOpen] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();

  const handleConfetti = () => {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.1 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4">
          {/* Logo & App Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 text-white font-extrabold text-xl shrink-0">
              <Crown className="w-6 h-6 text-amber-300 drop-shadow" />
              <span className="absolute -bottom-1 -left-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-l from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  {t.appName}
                </h1>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {profile.vipTier}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 hidden sm:flex">
                <span>{profile.gameVersion}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t.antiBanActive}
                </span>
              </p>
            </div>
          </div>

          {/* Slot Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSlotDropdownOpen(!slotDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-xs sm:text-sm font-medium text-slate-200 shadow-sm"
              title={t.activeSlot}
            >
              <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className={`${isRtl ? 'text-right' : 'text-left'} hidden md:block`}>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">{t.activeSlot}</div>
                <div className="font-semibold text-slate-200 truncate max-w-[140px]">{activeSlot.name}</div>
              </div>
              <span className="md:hidden font-semibold">{t.slotNumber} #{activeSlot.slotNumber}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 ${isRtl ? 'mr-1' : 'ml-1'}`} />
            </button>

            {slotDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSlotDropdownOpen(false)} />
                <div className={`absolute ${isRtl ? 'left-0 sm:right-0 sm:left-auto' : 'right-0 sm:left-0 sm:right-auto'} mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 space-y-1`}>
                  <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                    <span>{t.availableSlots}</span>
                    <span className="text-emerald-400 font-bold">{slots.length} {t.slotsCount}</span>
                  </div>
                  {slots.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectSlot(s);
                        setSlotDropdownOpen(false);
                        handleConfetti();
                      }}
                      className={`w-full ${isRtl ? 'text-right' : 'text-left'} px-3 py-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        s.id === activeSlot.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-medium text-slate-200 truncate max-w-[160px]">{s.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {t.level} {s.townLevel} • {s.coins.toLocaleString()} {t.coins}
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                        #{s.slotNumber}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Tools & Language Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Switch Toggle (AR / EN) */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-0.5 shadow-inner" title="تبديل اللغة / Switch Language">
              <button
                onClick={() => setLanguage('ar')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  language === 'ar'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="العربية (Arabic)"
              >
                <span>AR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20 font-black'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="English"
              >
                <span>EN</span>
              </button>
            </div>

            {onOpenBridge && (
              <button
                onClick={onOpenBridge}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors shadow-sm shadow-emerald-950/40"
                title="Android USB / ADB Bridge"
              >
                <Usb className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">USB Bridge</span>
              </button>
            )}

            <button
              onClick={onOpenDeviceSync}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              title={t.deviceSync}
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{t.deviceSync}</span>
            </button>

            <button
              onClick={onSyncCloud}
              disabled={isSyncing}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title={t.cloudSync}
            >
              <Cloud className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">{isSyncing ? t.syncing : t.cloudSync}</span>
            </button>

            <button
              onClick={() => {
                onExport();
                handleConfetti();
              }}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
              title={t.exportSave}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.exportSave}</span>
            </button>

            <button
              onClick={onImportClick}
              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              title={t.importSave}
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.importSave}</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className={`relative px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  settings?.autoSaveEnabled
                    ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
                }`}
                title={t.settingsTitle}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.settings}</span>
                {settings?.autoSaveEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
