import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Zap,
  Usb,
  Terminal,
  RefreshCw,
  Send,
  Download,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Cpu,
  HardDrive,
  ShieldCheck,
  Radio,
  Check,
  ChevronDown,
  BatteryCharging,
  PowerOff,
  Activity
} from 'lucide-react';
import {
  SaveSlot,
  AndroidDevice,
  AdbConnectionState,
  AdbTerminalLog,
  AdbSyncResult,
  AppSettings
} from '../types/index';
import {
  AndroidBridgeService,
  PRESET_DEVICES,
  DEFAULT_ANDROID_DEVICE
} from '../services/androidBridgeService';
import { SecurityValidator } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface AndroidBridgeProps {
  activeSlot: SaveSlot;
  settings: AppSettings;
  onUpdateSettings?: (newSettings: AppSettings) => void;
  onShowToast: (msg: string) => void;
}

export const AndroidBridge: React.FC<AndroidBridgeProps> = ({
  activeSlot,
  settings,
  onUpdateSettings,
  onShowToast,
}) => {
  const { t, isRtl } = useLanguage();
  const [device, setDevice] = useState<AndroidDevice | null>(() => AndroidBridgeService.getDevice());
  const [connectionState, setConnectionState] = useState<AdbConnectionState>(() => AndroidBridgeService.getState());
  const [terminalLogs, setTerminalLogs] = useState<AdbTerminalLog[]>(() => AndroidBridgeService.getTerminalLogs());
  const [terminalInput, setTerminalInput] = useState('');
  const [isSyncingPush, setIsSyncingPush] = useState(false);
  const [isSyncingPull, setIsSyncingPull] = useState(false);
  const [forceRestartGame, setForceRestartGame] = useState(true);
  const [lastSyncResult, setLastSyncResult] = useState<AdbSyncResult | null>(null);
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [customPath, setCustomPath] = useState(device?.targetStoragePath || DEFAULT_ANDROID_DEVICE.targetStoragePath);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to live AndroidBridge service updates
  useEffect(() => {
    const unsubDevice = AndroidBridgeService.subscribe((dev, state) => {
      setDevice(dev);
      setConnectionState(state);
      if (dev) {
        setCustomPath(dev.targetStoragePath);
      }
    });

    const unsubLogs = AndroidBridgeService.subscribeLogs((logs) => {
      setTerminalLogs(logs);
    });

    return () => {
      unsubDevice();
      unsubLogs();
    };
  }, []);

  // Auto-scroll terminal when new logs arrive
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleConnect = async (preset?: Partial<AndroidDevice>) => {
    setShowPresetMenu(false);
    try {
      const connectedDev = await AndroidBridgeService.connectDevice(preset);
      onShowToast(`${t.usbConnectedBadge}: ${connectedDev.model}`);
    } catch {
      onShowToast('Failed to connect USB device');
    }
  };

  const handleDisconnect = () => {
    AndroidBridgeService.disconnectDevice();
    onShowToast(t.usbDisconnectedBadge);
  };

  const handlePushNedata = async () => {
    if (isSyncingPush) return;
    setIsSyncingPush(true);

    try {
      const result = await AndroidBridgeService.syncNedataToDevice(activeSlot, {
        forceRestartGame,
        targetPath: customPath,
      });
      setLastSyncResult(result);
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      onShowToast(t.toastAdbSyncSuccess);
    } catch (err) {
      console.error(err);
      onShowToast('USB Sync Failed: ' + err);
    } finally {
      setIsSyncingPush(false);
    }
  };

  const handlePullNedata = async () => {
    if (isSyncingPull) return;
    setIsSyncingPull(true);

    try {
      await AndroidBridgeService.pullNedataFromDevice();
      onShowToast(t.toastAdbPullSuccess);
    } catch (err) {
      console.error(err);
      onShowToast('USB Pull Failed: ' + err);
    } finally {
      setIsSyncingPull(false);
    }
  };

  const handleRunCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput;
    setTerminalInput('');
    await AndroidBridgeService.runAdbCommand(cmd);
  };

  const handleQuickCmd = async (cmd: string) => {
    await AndroidBridgeService.runAdbCommand(cmd);
  };

  const handleSaveCustomPath = () => {
    if (device && customPath.trim()) {
      AndroidBridgeService.updateDevice({ targetStoragePath: customPath.trim() });
      setIsEditingPath(false);
      onShowToast('Internal storage path updated');
    }
  };

  const isConnected = connectionState === 'CONNECTED';
  const isPairing = connectionState === 'PAIRING' || connectionState === 'AUTHORIZING';
  const isSyncing = connectionState === 'SYNCING' || isSyncingPush || isSyncingPull;

  const checksum = SecurityValidator.generatePlayrixChecksum(activeSlot);
  const validation = SecurityValidator.validateAntiBan(activeSlot);

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Bridge Status & Connection */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Usb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{t.androidBridgeTitle}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                  ADB Native USB
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {t.androidBridgeDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {/* Status badge */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                isConnected
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-950'
                  : isPairing
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
                  : isSyncing
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 animate-pulse'
                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected
                    ? 'bg-emerald-400 animate-ping'
                    : isPairing
                    ? 'bg-amber-400 animate-ping'
                    : isSyncing
                    ? 'bg-indigo-400 animate-spin'
                    : 'bg-rose-400'
                }`}
              />
              <span>
                {isConnected
                  ? `${t.usbConnectedBadge} (${device?.model})`
                  : isPairing
                  ? 'Authorizing ADB RSA Key...'
                  : isSyncing
                  ? t.usbSyncingBadge
                  : t.usbDisconnectedBadge}
              </span>
            </div>

            {/* Real-time sync badge */}
            {settings?.autoAdbSync && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>{t.realtimeUsbSyncBadge}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons & Device selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {isConnected ? (
            <>
              <button
                onClick={handleDisconnect}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-700/50 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <PowerOff className="w-4 h-4" />
                <span>{t.disconnectUsbBtn}</span>
              </button>

              <button
                onClick={handlePushNedata}
                disabled={isSyncing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 hover:shadow-emerald-900/60 transition-all disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 text-emerald-200 ${isSyncingPush ? 'animate-bounce' : ''}`} />
                <span>{isSyncingPush ? 'Pushing nedata.db...' : t.pushNedataNowBtn}</span>
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                disabled={isPairing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/40 transition-all disabled:opacity-50"
              >
                <Usb className="w-4 h-4" />
                <span>{isPairing ? 'Pairing USB Device...' : t.connectUsbBtn}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>

              {showPresetMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl z-30 p-2 space-y-1 animate-in fade-in slide-in-from-top-2">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Target Android Device
                  </div>
                  {PRESET_DEVICES.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleConnect(preset)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-750 text-xs text-slate-200 flex flex-col transition-colors"
                    >
                      <span className="font-semibold text-white">{preset.model}</span>
                      <span className="text-[11px] text-slate-400">{preset.androidVersion} • {preset.transportMode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Device Info + Quick Sync Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Info & Target Storage Path (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Connected Device Spec Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>{t.connectedDeviceTitle}</span>
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                Port 5037
              </span>
            </div>

            {device ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.deviceModel}</span>
                  <span className="font-semibold text-white">{device.model}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.androidVersionLabel}</span>
                  <span className="font-semibold text-slate-200">{device.androidVersion} (API {device.apiLevel})</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.serialNumberLabel}</span>
                  <span className="font-mono text-emerald-400 font-bold">{device.serialNumber}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.batteryLevelLabel}</span>
                  <div className="flex items-center gap-2">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-white">{device.batteryLevel}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.usbSpeedLabel}</span>
                  <span className="font-medium text-slate-300">{device.usbSpeed}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-850">
                  <span className="text-slate-400">{t.transportModeLabel}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono font-semibold text-[10px]">
                    {device.transportMode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">{t.packageStatusLabel}</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>com.playrix.township (38.0.1)</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No USB device currently connected. Click &quot;Connect Device&quot; to establish bridge.
              </div>
            )}
          </div>

          {/* Internal Storage Target Path Configuration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                <span>{t.targetStoragePathTitle}</span>
              </h3>
              {!isEditingPath ? (
                <button
                  onClick={() => setIsEditingPath(true)}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Edit Path
                </button>
              ) : (
                <button
                  onClick={handleSaveCustomPath}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Save
                </button>
              )}
            </div>

            {isEditingPath ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-xs font-mono text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomPath('/storage/emulated/0/Android/data/com.playrix.township/files/save/nedata.db')}
                    className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    SAF Default
                  </button>
                  <button
                    onClick={() => setCustomPath('/data/data/com.playrix.township/databases/nedata.db')}
                    className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  >
                    Root / Sandbox
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300/90 break-all select-all">
                {device?.targetStoragePath || customPath}
              </div>
            )}

            {/* Restart toggle option */}
            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="restartGameToggle"
                checked={forceRestartGame}
                onChange={(e) => setForceRestartGame(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              <label htmlFor="restartGameToggle" className="text-xs text-slate-300 cursor-pointer">
                <span className="font-semibold block text-white">{t.restartGameToggle}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{t.restartGameToggleDesc}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Sync Action Center + Live ADB Terminal (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Push / Pull Operations Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Real-Time Save Sync Operations</span>
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">CRC32:</span>
                <span className="font-mono font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {checksum}
                </span>
              </div>
            </div>

            {/* Active save summary preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Town</span>
                <span className="font-bold text-white truncate block">{activeSlot.townName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Level</span>
                <span className="font-bold text-emerald-400 font-mono">Lvl {activeSlot.townLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Coins</span>
                <span className="font-bold text-amber-400 font-mono">{activeSlot.coins.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">T-Cash</span>
                <span className="font-bold text-emerald-400 font-mono">{activeSlot.tCash.toLocaleString()}</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handlePushNedata}
                disabled={isSyncing}
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 text-emerald-200 ${isSyncingPush ? 'animate-bounce' : ''}`} />
                <span>{isSyncingPush ? 'Pushing nedata.db...' : t.pushNedataNowBtn}</span>
              </button>

              <button
                onClick={handlePullNedata}
                disabled={isSyncing}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-[0.99] rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all disabled:opacity-50"
              >
                <Download className={`w-4 h-4 text-slate-400 ${isSyncingPull ? 'animate-bounce' : ''}`} />
                <span>{isSyncingPull ? 'Pulling from device...' : t.pullNedataNowBtn}</span>
              </button>
            </div>

            {/* Sync Results Box */}
            {lastSyncResult && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Synced {(lastSyncResult.bytesTransferred / 1024).toFixed(1)} KB in {lastSyncResult.transferTimeMs}ms
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">
                  {new Date(lastSyncResult.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Interactive ADB Terminal Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{t.adbTerminalHeader}</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => AndroidBridgeService.clearTerminalLogs()}
                  className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  {t.clearTerminalBtn}
                </button>
              </div>
            </div>

            {/* Terminal Screen */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 font-mono text-[11px] sm:text-xs h-64 overflow-y-auto space-y-2 select-text shadow-inner">
              {terminalLogs.map((log) => (
                <div key={log.id} className="space-y-0.5">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                    <span>[{log.timestamp}]</span>
                    {log.command && (
                      <span className="text-emerald-400 font-bold">$ {log.command}</span>
                    )}
                  </div>
                  <pre
                    className={`whitespace-pre-wrap leading-relaxed font-mono ${
                      log.type === 'success'
                        ? 'text-emerald-300 font-semibold'
                        : log.type === 'stderr'
                        ? 'text-rose-400'
                        : log.type === 'system'
                        ? 'text-indigo-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log.output}
                  </pre>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick ADB Action Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">{t.quickAdbCommands}:</span>
              <button
                onClick={() => handleQuickCmd('adb devices -l')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                adb devices
              </button>
              <button
                onClick={() => handleQuickCmd('adb shell ls -l /storage/emulated/0/Android/data/com.playrix.township/files/save/')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                ls /save/
              </button>
              <button
                onClick={() => handleQuickCmd('adb shell am force-stop com.playrix.township')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                force-stop
              </button>
              <button
                onClick={() => handleQuickCmd('adb shell am start -n com.playrix.township/com.playrix.township.lib.GameApplication')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                am start
              </button>
              <button
                onClick={() => handleQuickCmd('adb shell df -h /data')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                df -h
              </button>
            </div>

            {/* Command Line Input */}
            <form onSubmit={handleRunCommand} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-emerald-400 font-mono font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder={t.adbTerminalPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                {t.runCmdBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
