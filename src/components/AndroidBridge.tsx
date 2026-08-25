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
  Activity,
  Copy,
  FileCode,
  Flame,
  Key,
  ShieldAlert,
  Code2,
  FileText,
  Sliders,
  ExternalLink
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
  const [customPath, setCustomPath] = useState(device?.targetStoragePath || '/data/data/com.playrix.township/databases/nedata.db');
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  
  // Root Suite State
  const [activeRootMethod, setActiveRootMethod] = useState<'method1' | 'method2' | 'method3'>('method1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, key: string, toastMsg?: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
    onShowToast(toastMsg || t.toastCommandsCopied);
  };

  const downloadTextFile = (filename: string, content: string, mime: string = 'text/plain') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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

  const handleSaveCustomPath = (newPath?: string) => {
    const pathToSave = (newPath || customPath).trim();
    if (device && pathToSave) {
      setCustomPath(pathToSave);
      AndroidBridgeService.updateDevice({ targetStoragePath: pathToSave });
      setIsEditingPath(false);
      onShowToast('Internal storage path updated: ' + pathToSave);
    }
  };

  const isConnected = connectionState === 'CONNECTED';
  const isPairing = connectionState === 'PAIRING' || connectionState === 'AUTHORIZING';
  const isSyncing = connectionState === 'SYNCING' || isSyncingPush || isSyncingPull;

  const checksum = SecurityValidator.generatePlayrixChecksum(activeSlot);
  const rootShellScript = AndroidBridgeService.generateRootShellScript(activeSlot);
  const deployScript = AndroidBridgeService.generateDeployScript(activeSlot);
  const gameGuardianScript = AndroidBridgeService.generateGameGuardianScript(activeSlot);
  const sharedPrefsXml = AndroidBridgeService.generateSharedPrefsXml(activeSlot);
  const rawNedataJson = SecurityValidator.generateNedataDbContent(activeSlot);

  // Termux 1-Line Execution Command
  const termux1LineCmd = `su -c "curl -s https://raw.githubusercontent.com/township-vip/deploy.sh | sh" || su -c "sh /sdcard/Download/deploy.sh"`;

  // Method 1 Shell Commands String
  const method1ShellCommands = `# === Termux / Root 1-Action Sync Commands ===
su -c "am force-stop com.playrix.township"
su -c "cp -f /sdcard/Download/nedata.db /data/data/com.playrix.township/databases/nedata.db"
su -c "chmod 660 /data/data/com.playrix.township/databases/nedata.db"
su -c "chown -R $(stat -c '%U:%G' /data/data/com.playrix.township) /data/data/com.playrix.township/databases/nedata.db"
su -c "rm -f /data/data/com.playrix.township/databases/nedata.db-journal /data/data/com.playrix.township/databases/nedata.db-wal"
su -c "monkey -p com.playrix.township -c android.intent.category.LAUNCHER 1"`;

  return (
    <div className="space-y-6">
      {/* Top Banner Card: Bridge Status & Connection */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
              <Usb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{t.androidBridgeTitle}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                  {t.rootModeActiveBadge}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {t.androidBridgeDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
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

            {/* Root Superuser Indicator */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Superuser Root (su): Enabled</span>
            </span>

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

      {/* ========================================================================= */}
      {/* 🚀 ROOT POWER SUITE - 3 DEDICATED METHODS FOR ROOTED DEVICES (100% SUCCESS) */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-wide">
                {t.rootSuiteTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {t.rootSuiteDesc}
            </p>
          </div>

          {/* Quick Root Paths Overview Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <button
              onClick={() => copyToClipboard('/data/data/com.playrix.township/databases/nedata.db', 'db_path', 'Root DB Path Copied!')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg transition-colors"
              title="Click to copy Root Database Path"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[200px] sm:max-w-none">/data/data/.../databases/nedata.db</span>
              {copiedKey === 'db_path' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Method Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveRootMethod('method1')}
            className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 ${
              activeRootMethod === 'method1'
                ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-950/40'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>{t.rootMethod1Title}</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                1-Click / Termux
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              {t.rootMethod1Desc}
            </p>
          </button>

          <button
            onClick={() => setActiveRootMethod('method2')}
            className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 ${
              activeRootMethod === 'method2'
                ? 'bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-400" />
                <span>{t.rootMethod2Title}</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                MT Manager
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              {t.rootMethod2Desc}
            </p>
          </button>

          <button
            onClick={() => setActiveRootMethod('method3')}
            className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 ${
              activeRootMethod === 'method3'
                ? 'bg-indigo-500/10 border-indigo-500/60 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>{t.rootMethod3Title}</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                RAM / Lua
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">
              {t.rootMethod3Desc}
            </p>
          </button>
        </div>

        {/* Tab Content 1: 1-Click Shell Script & Commands (deploy.sh) */}
        {activeRootMethod === 'method1' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in">
            {/* deploy.sh Feature Highlight Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono font-bold text-[10px] uppercase">
                    One-Action Root Sync
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    deploy.sh
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{isRtl ? 'ملف سكريبت deploy.sh لتنفيذ المزامنة الكاملة بضغطة واحدة في Termux' : 'Auto-Generated deploy.sh for Instant 1-Action Termux Sync'}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {isRtl
                    ? 'يحتوي على أوامر su المباشرة لإيقاف اللعبة، حقن nedata.db، ضبط الصلاحيات (660)، وتشغيل اللعبة تلقائياً دون أي تدخل يدوي.'
                    : 'Contains the complete su pipeline to force-stop Township, inject nedata.db, enforce 660 permissions & ownership, and hot-start the game.'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap shrink-0">
                <button
                  onClick={() => {
                    downloadTextFile('deploy.sh', deployScript);
                    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
                    onShowToast(t.toastDeployShDownloaded);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-950/50 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadDeployShBtn}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(deployScript, 'deploy_sh_full', t.toastDeployShCopied)}
                  className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-xl text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  {copiedKey === 'deploy_sh_full' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{t.copyDeployShBtn}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3 pt-1">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-300 block">
                  {isRtl ? 'الأوامر التنفيذية المباشرة (Direct su Commands):' : 'Direct su Execution Commands:'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isRtl ? 'يمكنك نسخها ولصقها مباشرة في Termux أو تشغيلها عبر طرفية ADB المدمجة:' : 'Copy-paste directly into Termux terminal or run inside the built-in ADB console:'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    downloadTextFile('apply_save_root.sh', rootShellScript);
                    onShowToast(t.toastRootScriptDownloaded);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                  title="Legacy apply_save_root.sh script"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadRootScriptBtn}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(method1ShellCommands, 'method1_cmds')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  {copiedKey === 'method1_cmds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t.copyShellCommandsBtn}</span>
                </button>

                <button
                  onClick={async () => {
                    await AndroidBridgeService.runAdbCommand('sh deploy.sh');
                    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
                    onShowToast('Executed deploy.sh 1-Action Sync in Terminal!');
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.runRootLiveBtn}</span>
                </button>
              </div>
            </div>

            {/* Code Block of deploy.sh / Commands */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>deploy.sh (Bash / sh)</span>
                <span className="text-amber-400">UID: Dynamic (u0_aXXX) | Permissions: 660 (rw-rw----)</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono text-xs text-amber-200/90 overflow-x-auto select-all relative">
                <pre className="leading-relaxed font-mono whitespace-pre-wrap">
{deployScript}
                </pre>
              </div>
            </div>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">{t.step1StopGame}</span>
                <span className="text-[11px] text-slate-400">إيقاف العملية فوراً لإزالة أقفال SQLite.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">{t.step2CopyDb}</span>
                <span className="text-[11px] text-slate-400">نقل nedata.db للمسار المحمي بدون قيود.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">{t.step3FixPerms}</span>
                <span className="text-[11px] text-slate-400">تطبيق chmod 660 و chown لضمان قراءة اللعبة.</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-0.5">{t.step4LaunchGame}</span>
                <span className="text-[11px] text-slate-400">بدء اللعبة بالموارد المعدلة فوراً.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Manual MT Manager Root Guide */}
        {activeRootMethod === 'method2' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
              <div>
                <h4 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <span>دليل MT Manager اليدوي (بصلاحيات الروت)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  خطوات استبدال ملف الحفظ وتعديل الصلاحيات يدوياً داخل تطبيق MT Manager:
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    downloadTextFile('nedata.db', rawNedataJson, 'application/octet-stream');
                    onShowToast('Downloaded nedata.db database file!');
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل ملف nedata.db</span>
                </button>

                <button
                  onClick={() => {
                    downloadTextFile('com.playrix.township.v2.playerprefs.xml', sharedPrefsXml, 'text/xml');
                    onShowToast(t.toastPrefsXmlDownloaded);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.downloadPrefsXmlBtn}</span>
                </button>
              </div>
            </div>

            {/* Visual Step-by-Step Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-white block">فتح MT Manager ومنحه صلاحيات الروت (SuperUser)</span>
                  <p className="text-slate-400 text-[11px]">
                    افتح MT Manager وتأكد من الموافقة على طلب الروت (Grant Root Access).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="space-y-2 flex-1">
                  <span className="font-bold text-white block">الانتقال إلى مسار النظام الجذري لقواعد البيانات</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value="/data/data/com.playrix.township/databases/"
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-300 flex-1 select-all"
                    />
                    <button
                      onClick={() => copyToClipboard('/data/data/com.playrix.township/databases/', 'step2_path')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-mono text-xs flex items-center gap-1 border border-slate-700"
                    >
                      {copiedKey === 'step2_path' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="space-y-1 flex-1">
                  <span className="font-bold text-white block">نسخ ملف nedata.db واستبدال القديم</span>
                  <p className="text-slate-400 text-[11px]">
                    انسخ ملف <code className="text-emerald-400">nedata.db</code> من مجلد التحميلات (Download) والصقه في مجلد <code className="text-emerald-400">databases</code>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <div className="space-y-2 flex-1">
                  <span className="font-bold text-white block">تعديل الأذونات (Permissions) للملف المنسوخ</span>
                  <p className="text-slate-400 text-[11px]">
                    اضغط مطولاً على ملف <code className="text-emerald-400">nedata.db</code> - اضغط على (Permissions) - واضبط الصلاحيات على:
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded bg-slate-950 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                      rw-rw---- (660)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (Read/Write للمالك والمجموعة فقط)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 3: GameGuardian Live RAM Injector Lua Script */}
        {activeRootMethod === 'method3' && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-3">
              <div>
                <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                  <span>حاقن الذاكرة GameGuardian Lua Script</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  سكريبت Lua مخصص يقوم بتعديل الذهب والكاش والمستوى أثناء تشغيل اللعبة في الذاكرة العشوائية (RAM) فوراً.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    downloadTextFile('township_vip_injector.lua', gameGuardianScript);
                    onShowToast(t.toastGgScriptDownloaded);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadGgScriptBtn}</span>
                </button>

                <button
                  onClick={() => copyToClipboard(gameGuardianScript, 'gg_script', t.toastGgScriptCopied)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center gap-2 border border-slate-700 transition-all"
                >
                  {copiedKey === 'gg_script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{t.copyGgScriptBtn}</span>
                </button>

                <button
                  onClick={async () => {
                    await AndroidBridgeService.runAdbCommand('gg_inject');
                    confetti({ particleCount: 40, spread: 60 });
                    onShowToast('Simulated GameGuardian Live Injection!');
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-indigo-600 text-white font-semibold rounded-lg text-xs flex items-center gap-2 border border-slate-700 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تجربة الحقن المباشر</span>
                </button>
              </div>
            </div>

            {/* Lua Code Preview */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono text-xs text-indigo-200/90 max-h-56 overflow-y-auto space-y-1 select-all">
              <pre className="leading-relaxed font-mono whitespace-pre-wrap">
{gameGuardianScript}
              </pre>
            </div>

            {/* GG Live Targets Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Coins to Inject</span>
                <span className="text-amber-400 font-bold">{activeSlot.resources.coins.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">T-Cash to Inject</span>
                <span className="text-emerald-400 font-bold">{activeSlot.resources.tCash.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Barn Capacity</span>
                <span className="text-indigo-300 font-bold">{activeSlot.profile.barnCapacity.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Speedhack</span>
                <span className="text-rose-400 font-bold">5.0x Speed</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MAIN HARDWARE & STORAGE SPECIFICATION GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Info & Target Storage Path (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Connected Device Spec Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
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
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-semibold text-[10px] border border-amber-500/30">
                    SHIZUKU_ROOT (SuperUser)
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
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
                  onClick={() => handleSaveCustomPath()}
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
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleSaveCustomPath('/data/data/com.playrix.township/databases/nedata.db')}
                    className="text-[10px] px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-mono font-bold"
                  >
                    Root /databases/ (Recommended)
                  </button>
                  <button
                    onClick={() => handleSaveCustomPath('/data/data/com.playrix.township/shared_prefs/')}
                    className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                  >
                    Root /shared_prefs/
                  </button>
                  <button
                    onClick={() => handleSaveCustomPath('/storage/emulated/0/Android/data/com.playrix.township/files/saves/nedata.db')}
                    className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono"
                  >
                    External Storage
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300/90 break-all select-all flex items-center justify-between">
                  <span>{customPath}</span>
                  <button
                    onClick={() => copyToClipboard(customPath, 'target_path_field', 'Path copied!')}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'target_path_field' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Fast path switcher presets */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleSaveCustomPath('/data/data/com.playrix.township/databases/nedata.db')}
                    className={`text-[10px] px-2 py-1 rounded font-mono transition-all ${
                      customPath.includes('databases')
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚡ Root DB Path
                  </button>
                  <button
                    onClick={() => handleSaveCustomPath('/data/data/com.playrix.township/shared_prefs/')}
                    className={`text-[10px] px-2 py-1 rounded font-mono transition-all ${
                      customPath.includes('shared_prefs')
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    SharedPrefs Path
                  </button>
                  <button
                    onClick={() => handleSaveCustomPath('/storage/emulated/0/Android/data/com.playrix.township/files/saves/nedata.db')}
                    className={`text-[10px] px-2 py-1 rounded font-mono transition-all ${
                      customPath.includes('storage')
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    External Path
                  </button>
                </div>
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
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
                    Synced {(lastSyncResult.bytesTransferred / 1024).toFixed(1)} KB to {lastSyncResult.destinationPath} in {lastSyncResult.transferTimeMs}ms
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">
                  {new Date(lastSyncResult.timestamp).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Interactive ADB Terminal Card with Root Shell Support */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{t.adbTerminalHeader}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                  Root su Ready
                </span>
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

            {/* Quick ADB Action Pills with Root Commands */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">{t.quickAdbCommands}:</span>
              <button
                onClick={() => handleQuickCmd('sh /sdcard/Download/apply_save_root.sh')}
                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded font-mono whitespace-nowrap transition-colors font-bold"
              >
                ⚡ 1-Click Root Script
              </button>
              <button
                onClick={() => handleQuickCmd('su -c "am force-stop com.playrix.township"')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                su force-stop
              </button>
              <button
                onClick={() => handleQuickCmd('su -c "chmod 660 /data/data/com.playrix.township/databases/nedata.db"')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                su chmod 660
              </button>
              <button
                onClick={() => handleQuickCmd('su -c "ls -la /data/data/com.playrix.township/databases/"')}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono whitespace-nowrap transition-colors"
              >
                su ls /databases/
              </button>
              <button
                onClick={() => handleQuickCmd('gg_inject')}
                className="px-2 py-1 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded font-mono whitespace-nowrap transition-colors"
              >
                gg_inject
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
                  placeholder="Type ADB or Root su command (e.g., su -c 'ls /data/data/com.playrix.township/databases/')..."
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
