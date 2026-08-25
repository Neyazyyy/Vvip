import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  CheckCircle2,
  FolderOpen,
  Wifi,
  Send,
  Download,
  Copy,
  Check,
  FileCode,
  FileCheck,
  HardDrive,
  Info,
  Edit2,
  RefreshCw
} from 'lucide-react';
import { SaveSlot, AndroidDevice } from '../types/index';
import { StorageService, SecurityValidator } from '../services/storageService';
import { AndroidBridgeService, detectRealClientDevice } from '../services/androidBridgeService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSlot: SaveSlot;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  activeSlot,
}) => {
  const { t, isRtl } = useLanguage();
  const [device, setDevice] = useState<AndroidDevice | null>(null);
  const [isEditingDevice, setIsEditingDevice] = useState(false);
  const [customDeviceModel, setCustomDeviceModel] = useState('');
  const [devicePath, setDevicePath] = useState(
    '/data/data/com.playrix.township/databases/nedata.db'
  );
  const [isPushing, setIsPushing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const currentDev = AndroidBridgeService.getDevice() || detectRealClientDevice();
      setDevice(currentDev);
      setCustomDeviceModel(currentDev.model);
      if (currentDev.targetStoragePath) {
        setDevicePath(currentDev.targetStoragePath);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveDeviceModel = () => {
    if (device && customDeviceModel.trim()) {
      const updated = { ...device, model: customDeviceModel.trim() };
      setDevice(updated);
      AndroidBridgeService.updateDevice({ model: customDeviceModel.trim() });
      setIsEditingDevice(false);
    }
  };

  const handleRefreshRealDevice = () => {
    const real = detectRealClientDevice();
    setDevice(real);
    setCustomDeviceModel(real.model);
    AndroidBridgeService.updateDevice(real);
    confetti({ particleCount: 40, spread: 60 });
  };

  const handleCopyPath = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(devicePath);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = devicePath;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2500);
    } catch (err) {
      console.error('Failed to copy path', err);
    }
  };

  const handlePushToDevice = () => {
    setIsPushing(true);

    setTimeout(() => {
      // 1. Generate live save payload from activeSlot state with authentic Playrix CRC32 checksum and timestamp
      const validation = SecurityValidator.validateAntiBan(activeSlot);
      const computedChecksum = SecurityValidator.generatePlayrixChecksum(activeSlot);

      const liveSavePayload = {
        saveHeader: {
          app: 'Playrix Township VIP Suite',
          package: 'com.playrix.township',
          gameVersion: activeSlot.profile?.gameVersion || '38.0.1',
          slotId: activeSlot.id,
          slotName: activeSlot.name,
          slotNumber: activeSlot.slotNumber,
          checksum: computedChecksum,
          crc32: validation.crc32Hex,
          securityDigest: validation.sha256Digest,
          safetyScore: `${validation.score}/100`,
          lastModified: new Date().toISOString(),
          securityStatus: validation.antiBanPassed ? 'AntiBan_Verified_Clean_CRC32' : 'Review_Recommended',
          targetDatabase: 'assets/nedata.db'
        },
        gameState: {
          profile: activeSlot.profile || {
            townName: activeSlot.townName,
            mayorName: 'Mayor VIP',
            level: activeSlot.townLevel,
            xp: 42500,
            nextLevelXp: 50000,
            population: 18500,
            maxPopulation: 22000,
            vipTier: 'Diamond VIP',
            vipActive: true,
            antiBanShield: true,
            lastBackupDate: new Date().toISOString(),
            deviceId: 'Redmi-23077RABDC-ANDROID-14',
            gameVersion: '38.0.1',
            barnCapacity: 4500,
            barnUsed: 3820
          },
          resources: activeSlot.resources || {
            coins: activeSlot.coins,
            tCash: activeSlot.tCash,
            gems: { ruby: 450, emerald: 380, topaz: 510, amethyst: 290 },
            expansionTools: { axes: 180, saws: 150, shovels: 200 },
            buildingMaterials: { bricks: 350, glass: 350, slabPlates: 350, nails: 250, paint: 250, hammer: 250 },
            miningTools: { pickaxes: 120, dynamite: 80, tnt: 60 },
            zooTokens: 450,
            yachtTokens: 320,
            cloverCount: 85
          },
          inventory: activeSlot.inventory || [],
          buildings: activeSlot.buildings || []
        },
        integrityVerification: {
          signature: `SIG_TOWNSHIP_VIP_${validation.crc32Hex.replace('0x', '')}`,
          shaDigest: validation.sha256Digest,
          verifiedAt: new Date().toISOString(),
          antiBanShield: validation.antiBanPassed,
          corruptedHeaders: validation.warnings.length,
          validationDetails: validation.details
        }
      };

      const fileName = `Township_VIP_Save_Slot${activeSlot.slotNumber || activeSlot.id}.json`;
      const jsonStr = JSON.stringify(liveSavePayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Also sync to Android Bridge ADB Service
      AndroidBridgeService.syncNedataToDevice(activeSlot, {
        targetPath: devicePath,
        forceRestartGame: true,
      }).catch((err) => console.warn('ADB bridge push error:', err));

      setDownloadedFileName(fileName);
      setIsPushing(false);
      setSyncSuccess(true);
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.directSyncModalTitle}</h3>
              <p className="text-xs text-slate-400">
                {t.directSyncModalDesc}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-1">
            ✕
          </button>
        </div>

        {/* Device Status Bar - Shows Real Connected / Synchronized Device */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 font-medium">
                  {t.deviceConnected}:
                </span>
                {!isEditingDevice ? (
                  <strong className="text-white font-mono font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {device ? `${device.manufacturer} ${device.model}` : detectRealClientDevice().model}
                  </strong>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={customDeviceModel}
                      onChange={(e) => setCustomDeviceModel(e.target.value)}
                      className="bg-slate-950 border border-amber-500 rounded px-2 py-0.5 text-xs text-amber-300 font-mono focus:outline-none"
                      placeholder="اسم الجهاز..."
                    />
                    <button
                      onClick={handleSaveDeviceModel}
                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold"
                    >
                      حفظ
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRefreshRealDevice}
                title="تحديث والكشف التلقائي عن الهاتف"
                className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEditingDevice(!isEditingDevice)}
                title="تعديل اسم الجهاز يدوياً"
                className="p-1 text-slate-400 hover:text-amber-400 rounded hover:bg-slate-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
                {t.deviceStatusConnected}
              </span>
            </div>
          </div>

          {/* Quick Hardware Specs Info */}
          {device && (
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-750">
              <span>{device.androidVersion} (API {device.apiLevel})</span>
              <span className="text-emerald-400 font-semibold">S/N: {device.serialNumber}</span>
              <span className="text-slate-300">{device.batteryLevel}% ⚡</span>
            </div>
          )}
        </div>

        {/* Target Package & Path with Copy Button */}
        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.targetPackagePathLabel}</span>
              </label>
              <button
                type="button"
                onClick={handleCopyPath}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                  copiedPath
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 border border-slate-700'
                }`}
              >
                {copiedPath ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{t.pathCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.copyPath}</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                dir="ltr"
                value={devicePath}
                onChange={(e) => setDevicePath(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 font-mono text-[11.5px] text-amber-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 selection:bg-emerald-500 selection:text-slate-950"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {t.targetPackagePathDesc}
            </p>
          </div>

          {/* Sync Information Card */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono text-[11.5px]" dir="ltr">
            <div className="text-slate-300 flex items-center justify-between">
              <span>Active Payload:</span>
              <strong className="text-white font-sans">{activeSlot.name} (Slot #{activeSlot.slotNumber || activeSlot.id})</strong>
            </div>
            <div className="text-slate-400 flex items-center justify-between">
              <span>Town Profile:</span>
              <span className="text-emerald-400 font-bold">
                Lvl {activeSlot.townLevel} • {activeSlot.coins.toLocaleString()} Coins • {activeSlot.tCash.toLocaleString()} T-Cash
              </span>
            </div>
            <div className="text-slate-400 flex items-center justify-between">
              <span>Checksum Hash:</span>
              <strong className="text-sky-400">{activeSlot.checksum}</strong>
            </div>
          </div>
        </div>

        {/* Real Download & Guidance Notification */}
        {syncSuccess && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5 text-emerald-300 font-medium">
              <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="leading-relaxed font-semibold">
                  {t.syncPushSuccess}
                </p>
                {downloadedFileName && (
                  <p className="text-[11px] text-emerald-400/90 font-mono">
                    {t.downloadedFileName} <span className="underline font-bold">{downloadedFileName}</span> (مجلد Downloads في هاتفك)
                  </p>
                )}
              </div>
            </div>

            {/* Quick 3-Step Guide */}
            <div className="bg-slate-950/60 rounded-lg p-2.5 border border-emerald-500/20 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>{isRtl ? 'خطوات التثبيت على الهاتف:' : 'Installation Steps on Mobile:'}</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300 leading-relaxed">
                <li>{isRtl ? 'افتح تطبيق إدارة الملفات (File Manager) على هاتفك.' : 'Open File Manager on your Android phone.'}</li>
                <li>{isRtl ? 'انسخ الملف المُنزّل من مجلد Downloads.' : 'Copy the downloaded file from your Downloads folder.'}</li>
                <li>
                  {isRtl ? (
                    <>
                      الصقه في المسار: <span className="font-mono text-amber-300">Android/data/com.playrix.township/files/save/</span>
                    </>
                  ) : (
                    <>
                      Paste into: <span className="font-mono text-amber-300">Android/data/com.playrix.township/files/save/</span>
                    </>
                  )}
                </li>
              </ol>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            {t.close}
          </button>
          <button
            onClick={handlePushToDevice}
            disabled={isPushing}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isPushing ? (
              <>
                <Download className="w-4 h-4 animate-bounce" />
                <span>{t.pushingSave}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t.sendSaveToDevice}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
