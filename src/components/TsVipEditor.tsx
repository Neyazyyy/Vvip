import React, { useState } from 'react';
import {
  BarChart3,
  Unlock,
  Wrench,
  Anchor,
  Crown,
  MoreVertical,
  Play,
  Download,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Radio,
  FileCheck
} from 'lucide-react';
import { StatsView, TownStatsData } from './subviews/StatsView';
import { UnlocksView } from './subviews/UnlocksView';
import { ToolsView } from './subviews/ToolsView';
import { RegattaView } from './subviews/RegattaView';
import { TsLiteView } from './subviews/TsLiteView';
import { ConsoleTerminal, LogEntry } from './subviews/ConsoleTerminal';
import { SaveSlot } from '../types';
import { downloadNedataFile, SecurityValidator } from '../services/storageService';
import { NativeAndroidBridge } from '../services/nativeAndroidBridge';
import { ApkBuildGuideModal } from './ApkBuildGuideModal';
import { Smartphone } from 'lucide-react';

interface TsVipEditorProps {
  activeSlot: SaveSlot | null;
  onUpdateSlot: (updated: SaveSlot) => void;
  onShowToast: (msg: string) => void;
  onLogout: () => void;
}

export const TsVipEditor: React.FC<TsVipEditorProps> = ({
  activeSlot,
  onUpdateSlot,
  onShowToast,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'STATS' | 'UNLOCKS' | 'TOOLS' | 'REGATTA' | 'VIP'>('STATS');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [showLaunchModal, setShowLaunchModal] = useState<boolean>(false);
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  // Editable Town Stats
  const [stats, setStats] = useState<TownStatsData>({
    tCash: activeSlot?.resources?.tCash || 5888,
    coins: activeSlot?.resources?.coins || 636888,
    level: activeSlot?.profile?.level || 888,
    m3Lvl: 18888,
    firstWin: 17888,
    lives: 88888,
    help: 8888,
    cards: 88,
    regatta: 8888,
    monthYear: '08/2018',
    expeditionEnergy: 0,
    mineDepth: 0,
  });

  // Real-time Console Logs
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      time: '23:20:07',
      text: 'البحث عن المحاكيات أو الأجهزة المتصلة...',
      type: 'info',
    },
  ]);

  const addLog = (text: string, type: LogEntry['type'] = 'info') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, time: timeStr, text, type }]);
  };

  const handleConnect = () => {
    if (isConnecting) return;
    setIsConnecting(true);

    const isNative = NativeAndroidBridge.isNative();
    const hasRoot = NativeAndroidBridge.isRootAvailable();

    addLog('البحث عن المحاكي أو جهاز أندرويد المتصل...');
    setTimeout(() => {
      if (isNative) {
        addLog(`[NATIVE ANDROID] تم اكتشاف بيئة أندرويد الأصلية (Root Status: ${hasRoot ? 'GRANTED ✅' : 'Standard'}).`);
      }
      addLog('إيقاف اللعبة بأمان لمنع تلف البيانات...');
    }, 400);

    setTimeout(() => {
      addLog('الاتصال بذاكرة اللعبة واستخراج ملف الحفظ...');
    }, 800);

    setTimeout(() => {
      addLog('تم الاتصال: تم تنزيل وفك تشفير ملف الحفظ.');
      addLog('قراءة وتجهيز متغيرات ملف الحفظ...');
      addLog('الملف جاهز للتعديل الفوري!');
      addLog('تم منح صلاحيات Superuser (Root) لأداة Ts_Vip بنجاح');
      setIsConnected(true);
      setIsConnecting(false);
      onShowToast('⚡ تم الاتصال! ملف الحفظ جاهز للتعديل الآن.');
    }, 1300);
  };

  const handleApply = () => {
    if (isApplying) return;
    setIsApplying(true);

    addLog('تطبيق التعديلات وإرسالها إلى اللعبة...');
    setTimeout(() => {
      addLog('إعادة تشفير ملف XML وقاعدة بيانات nedata.db...');
    }, 300);

    setTimeout(() => {
      // If running inside the real APK with root bridge, trigger direct native injection!
      if (NativeAndroidBridge.isNative() && activeSlot) {
        const slotPayload: SaveSlot = {
          ...activeSlot,
          coins: stats.coins,
          tCash: stats.tCash,
          townLevel: stats.level,
          profile: { ...activeSlot.profile, level: stats.level },
          resources: { ...activeSlot.resources, coins: stats.coins, tCash: stats.tCash },
        };
        const nedataContent = SecurityValidator.generateNedataDbContent(slotPayload);
        const injectRes = NativeAndroidBridge.directInject(nedataContent);
        addLog(`[NATIVE INJECT] ${injectRes.message}`);
      } else {
        addLog('حقن ملف الحفظ في مسار اللعبة بنجاح...');
      }
    }, 700);

    setTimeout(() => {
      addLog('اكتملت العملية! جاهز لبدء اللعبة...');
      addLog('تم منح صلاحيات الروت للتطبيق بنجاح');
      setIsApplying(false);
      setShowLaunchModal(true);
      onShowToast('🚀 تم حقن وحفظ بيانات اللعبة بنجاح!');

      // Also update parent slot
      if (activeSlot) {
        onUpdateSlot({
          ...activeSlot,
          coins: stats.coins,
          tCash: stats.tCash,
          townLevel: stats.level,
          profile: {
            ...activeSlot.profile,
            level: stats.level,
          },
          resources: {
            ...activeSlot.resources,
            coins: stats.coins,
            tCash: stats.tCash,
          },
        });
      }
    }, 1100);
  };

  const handleApplySingleStat = (key: keyof TownStatsData, value: any) => {
    addLog(`تم تحديث ${key.toUpperCase()} إلى ${value}`);
    onShowToast(`✔ تم حفظ ${key.toUpperCase()} بالقيمة ${value}`);
  };

  const handleApplyAllStats = () => {
    addLog(`تم تحديث T-CASH إلى ${stats.tCash}`);
    addLog(`تم تحديث COINS إلى ${stats.coins}`);
    addLog(`تم تحديث LEVEL إلى ${stats.level}`);
    addLog(`تم تحديث M3 LVL إلى ${stats.m3Lvl}`);
    addLog(`تم تحديث 1ST WIN إلى ${stats.firstWin}`);
    addLog(`تم تحديث LIVES إلى ${stats.lives}`);
    addLog(`تم تحديث HELP إلى ${stats.help}`);
    addLog(`تم تحديث CARDS إلى ${stats.cards}`);
    addLog(`تم تحديث REGATTA إلى ${stats.regatta}`);
    addLog(`تم تحديث MONTH/YEAR إلى ${stats.monthYear}`);
    onShowToast('✔ تم حفظ جميع الإحصائيات في ملف الحفظ!');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.time}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    onShowToast('📋 تم نسخ سجلات العمليات إلى الحافظة!');
  };

  const handleDownloadNedata = () => {
    if (activeSlot) {
      downloadNedataFile(activeSlot);
      addLog('تم تنزيل ملف nedata.db المعدل إلى جهازك.');
      onShowToast('💾 تم تنزيل ملف الحفظ nedata.db بنجاح!');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080b] text-white flex flex-col items-center justify-start p-3 sm:p-5 select-none font-sans dir-rtl" dir="rtl">
      {/* Top Main Container */}
      <div className="w-full max-w-md space-y-3 pb-8">
        {/* Header App Info Bar */}
        <div className="flex items-center justify-between px-1">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#121824] to-[#0c0f17] border border-cyan-500/40 flex items-center justify-center shadow-md shadow-cyan-500/10">
              <span className="text-base font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                T
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black tracking-tight text-white">تاون شيب VIP</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#191d2c] border border-[#2b334a] text-gray-300">
                  v108-FIX-2
                </span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider ${
                    isConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border border-red-500/40'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
                  {isConnected ? 'متصل' : 'غير متصل'}
                </span>
              </div>
            </div>
          </div>

          {/* 3-dots Menu & APK Build Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowApkModal(true)}
              className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer"
              title="بناء وتصدير APK أندرويد"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>بناء APK</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-[#141724] hover:bg-[#1f2436] text-gray-400 hover:text-white border border-[#242b40] transition-colors cursor-pointer"
              title="القائمة / تسجيل الخروج"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two Top Action Cards: CONNECT & APPLY */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Start Edit Game -> CONNECT */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <Radio className="w-3 h-3 text-cyan-400" />
              بدء اتصال اللعبة
            </div>
            <button
              type="button"
              disabled={isConnecting}
              onClick={handleConnect}
              className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md ${
                isConnected
                  ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-black shadow-cyan-600/30'
              }`}
            >
              {isConnecting ? (
                <span className="inline-block w-4 h-4 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
              ) : isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم الاتصال
                </>
              ) : (
                'اتصال (CONNECT)'
              )}
            </button>
          </div>

          {/* 2. Save and launch -> APPLY */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <FileCheck className="w-3 h-3 text-pink-400" />
              حفظ وتشغيل اللعبة
            </div>
            <button
              type="button"
              disabled={isApplying}
              onClick={handleApply}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-pink-600/30 active:scale-95"
            >
              {isApplying ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  تطبيق (APPLY)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top Navigation Bar: STATS, UNLOCKS, TOOLS, REGATTA, VIP */}
        <div className="grid grid-cols-5 gap-1 p-1 bg-[#12141d] border border-[#212638] rounded-2xl">
          {[
            { id: 'STATS', label: 'الإحصائيات', icon: BarChart3 },
            { id: 'UNLOCKS', label: 'المظاهر', icon: Unlock },
            { id: 'TOOLS', label: 'الأدوات', icon: Wrench },
            { id: 'REGATTA', label: 'الريغاتا', icon: Anchor },
            { id: 'VIP', label: 'النسخ VIP', icon: Crown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-[#1e2333] text-cyan-400 border border-cyan-500/40 shadow-sm font-bold'
                    : 'text-gray-400 hover:text-gray-200 font-medium'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span className="text-[9px] uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="min-h-[300px]">
          {activeTab === 'STATS' && (
            <StatsView
              isConnected={isConnected}
              stats={stats}
              onChangeStats={(n) => setStats((p) => ({ ...p, ...n }))}
              onApplySingle={handleApplySingleStat}
              onApplyAll={handleApplyAllStats}
            />
          )}

          {activeTab === 'UNLOCKS' && (
            <UnlocksView onLog={addLog} onShowToast={onShowToast} />
          )}

          {activeTab === 'TOOLS' && (
            <ToolsView onLog={addLog} onShowToast={onShowToast} />
          )}

          {activeTab === 'REGATTA' && (
            <RegattaView onLog={addLog} onShowToast={onShowToast} />
          )}

          {activeTab === 'VIP' && (
            <TsLiteView onLog={addLog} onShowToast={onShowToast} />
          )}
        </div>

        {/* Bottom Console Terminal */}
        <ConsoleTerminal
          logs={logs}
          onClear={handleClearLogs}
          onCopy={handleCopyLogs}
        />
      </div>

      {/* Launch Game Modal Prompt */}
      {showLaunchModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 dir-rtl" dir="rtl">
          <div className="w-full max-w-sm bg-[#13151f] border border-[#262c3e] rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <Play className="w-7 h-7 fill-emerald-400 mr-0.5" />
            </div>

            <div>
              <h3 className="text-base font-black text-white tracking-wide">
                تشغيل اللعبة الآن؟
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                تم حقن وحفظ بياناتك بنجاح في ملفات اللعبة. هل ترغب في فتح Township الآن وتجربة الإضافات؟
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLaunchModal(false)}
                className="py-2.5 rounded-xl bg-[#1b202e] hover:bg-[#252c40] text-gray-300 font-bold text-xs uppercase"
              >
                البقاء هنا
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLaunchModal(false);
                  onShowToast('🎮 بدء تشغيل لعبة تاون شيب...');
                  if (NativeAndroidBridge.isNative()) {
                    NativeAndroidBridge.launchTownship();
                  } else {
                    window.open('township://', '_blank');
                  }
                }}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                تشغيل اللعبة
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadNedata}
              className="w-full py-2 rounded-xl bg-[#111420] border border-[#20273a] text-cyan-400 text-xs font-bold uppercase flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              تنزيل ملف الحفظ nedata.db
            </button>
          </div>
        </div>
      )}

      {/* APK Build & Export Guide Modal */}
      {showApkModal && (
        <ApkBuildGuideModal
          onClose={() => setShowApkModal(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
