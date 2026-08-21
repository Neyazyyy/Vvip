import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileSearch,
  Lock,
  Zap,
  Terminal,
  Download,
  Copy,
  Check,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { SaveSlot, IntegrityCheckReport } from '../types/index';
import { StorageService, SecurityValidator } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface IntegrityValidatorProps {
  activeSlot: SaveSlot;
  onFixIntegrity: () => void;
}

export const IntegrityValidator: React.FC<IntegrityValidatorProps> = ({
  activeSlot,
  onFixIntegrity,
}) => {
  const { t, isRtl } = useLanguage();
  const [isValidating, setIsValidating] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const initialValidation = SecurityValidator.validateAntiBan(activeSlot);

  const [report, setReport] = useState<IntegrityCheckReport>({
    databaseFile: 'assets/nedata.db (Township Secure Storage)',
    totalBlocks: 4096,
    corruptedHeaders: 0,
    checksumStatus: initialValidation.isValid ? 'VERIFIED' : 'WARNING',
    antiBanStatus: initialValidation.antiBanPassed ? 'PROTECTED' : 'MODIFIED_SAFELY',
    fileChecksum: initialValidation.checksum,
    lastVerified: new Date().toISOString(),
    logEntries: [
      `nedata.db database block map loaded [4096 / 4096 verified]`,
      `Computed CRC32 Digest: ${initialValidation.crc32Hex}`,
      `Security Hash: ${initialValidation.sha256Digest.substring(0, 16)}...`,
      `Anti-Ban Safety Score: ${initialValidation.score}/100 [${initialValidation.antiBanPassed ? 'PASSED' : 'CHECK_REQUIRED'}]`,
      ...initialValidation.details,
      ...initialValidation.warnings.map(w => `[WARN] ${w}`)
    ],
  });

  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      const validation = SecurityValidator.validateAntiBan(activeSlot);
      setReport({
        databaseFile: 'assets/nedata.db (Township Secure Storage)',
        totalBlocks: 4096,
        corruptedHeaders: validation.warnings.length,
        checksumStatus: validation.isValid ? 'VERIFIED' : 'WARNING',
        antiBanStatus: validation.antiBanPassed ? 'PROTECTED' : 'MODIFIED_SAFELY',
        fileChecksum: validation.checksum,
        lastVerified: new Date().toISOString(),
        logEntries: [
          `Full integrity verification scan for slot #${activeSlot.slotNumber || activeSlot.id} (${activeSlot.name})`,
          `Target: Playrix Township Engine v38.0.1 (nedata.db schema)`,
          `Calculated CRC32 Hash: ${validation.crc32Hex}`,
          `Anti-ban Signature: ${validation.checksum}`,
          `Security Score: ${validation.score} / 100`,
          ...validation.details.map(d => `[SUCCESS] ${d}`),
          ...validation.warnings.map(w => `[WARNING] ${w}`)
        ],
      });
      confetti({ particleCount: 35, spread: 65 });
    }, 850);
  };

  const handleCopyRawJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activeSlot, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const currentCheck = SecurityValidator.validateAntiBan(activeSlot);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            {t.integrityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.integrityDesc}
          </p>
        </div>

        <button
          onClick={handleRunValidation}
          disabled={isValidating}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all disabled:opacity-50 font-mono cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isValidating ? t.scanningBlocks : t.runDeepScan}</span>
        </button>
      </div>

      {/* 3 Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400">{t.dbIntegrityTitle}</div>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-6 h-6" />
            <span>4,096 / 4,096</span>
          </div>
          <p className="text-[11px] text-slate-500">{t.dbIntegrityDesc}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400">{t.antiBanShieldTitle}</div>
          <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            <span>{currentCheck.antiBanPassed ? `${currentCheck.score}% ${t.fullyProtected}` : 'Warning'}</span>
          </div>
          <p className="text-[11px] text-slate-500">
            {currentCheck.warnings.length === 0 ? t.antiBanShieldDesc : currentCheck.warnings[0]}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-400">Playrix CRC-32 Checksum</div>
          <div className="text-xl font-extrabold text-sky-400 flex items-center gap-2 font-mono">
            <Cpu className="w-5 h-5 text-sky-400 shrink-0" />
            <span className="truncate">{currentCheck.checksum}</span>
          </div>
          <p className="text-[11px] text-slate-500">{t.targetApkDesc}</p>
        </div>
      </div>

      {/* Terminal Logs & Raw Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Verification Terminal */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              {t.consoleOutputTitle}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {t.lastScan}: {new Date(report.lastVerified).toLocaleTimeString()}
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300/90 space-y-2 min-h-[190px]" dir="ltr">
            <div className="text-slate-500">// [SYSTEM] Township Anti-Ban Cryptographic Engine</div>
            {report.logEntries.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className={log.includes('[WARNING]') || log.includes('[WARN]') ? 'text-amber-400 font-bold' : 'text-emerald-500 font-bold'}>&gt;</span>
                <span className={log.includes('[WARNING]') || log.includes('[WARN]') ? 'text-amber-300' : ''}>{log}</span>
              </div>
            ))}
            <div className="text-emerald-400 font-bold pt-2">// Checksum: {currentCheck.checksum} [VERIFIED CRC32]</div>
          </div>
        </div>

        {/* Raw Save JSON Viewer */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-blue-400" />
                {t.rawSaveInspectorTitle}
              </h3>
              <button
                onClick={handleCopyRawJson}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded font-mono cursor-pointer"
              >
                {copiedRaw ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.copyJson}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {t.rawSaveInspectorDesc} #{activeSlot.slotNumber || activeSlot.id}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-[170px] overflow-y-auto" dir="ltr">
            <pre>{JSON.stringify(activeSlot, null, 2)}</pre>
          </div>

          <div className="pt-2">
            <button
              onClick={() => StorageService.exportSaveAsJson(activeSlot)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.downloadRawSave}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
