import React, { useState } from 'react';
import { Smartphone, Download, Terminal, Code2, CheckCircle2, Copy, Sparkles, X, Layers, ShieldCheck } from 'lucide-react';

interface ApkBuildGuideModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const ApkBuildGuideModal: React.FC<ApkBuildGuideModalProps> = ({ onClose, onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'CAPACITOR' | 'STUDIO' | 'ONLINE'>('CAPACITOR');

  const copyCode = (code: string, label: string) => {
    navigator.clipboard.writeText(code);
    onShowToast(`📋 تم نسخ ${label} إلى الحافظة!`);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 dir-rtl" dir="rtl">
      <div className="w-full max-w-lg bg-[#0e111a] border border-[#222a3d] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1c2233] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">بناء تطبيق أندرويد حقيقي (APK)</h3>
              <p className="text-[11px] text-gray-400">جميع ملفات Capacitor و Android Studio مجهزة بالكامل</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#161a26] hover:bg-[#202738] text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Download Native Zip Button Banner */}
        <div className="p-3 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>📦</span>
              <span>مشروع أندرويد الأصلي جاهز (ZIP)</span>
            </div>
            <p className="text-[10px] text-gray-400">ملفات Java و XML و Gradle كاملة بدون Web</p>
          </div>
          <a
            href="/downloads/Township_VIP_Native_Android.zip"
            download="Township_VIP_Native_Android.zip"
            className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-black text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل ZIP</span>
          </a>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#080a10] border border-[#1b2233] rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('CAPACITOR')}
            className={`py-2 px-1 text-xs rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'CAPACITOR'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            1. أمر Capacitor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('STUDIO')}
            className={`py-2 px-1 text-xs rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'STUDIO'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            2. Android Studio
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ONLINE')}
            className={`py-2 px-1 text-xs rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ONLINE'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            3. أدوات سريعة
          </button>
        </div>

        {/* Tab 1: Capacitor CLI */}
        {activeTab === 'CAPACITOR' && (
          <div className="space-y-3 text-xs leading-relaxed text-gray-300">
            <div className="p-3.5 bg-[#121622] border border-emerald-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs">
                <Terminal className="w-4 h-4" />
                <span>أوامر التجميع المباشر عبر السطر الطرفي (Terminal):</span>
              </div>
              <p className="text-[11px] text-gray-400">
                مشروعك يحتوي على ملفات `@capacitor/android` و `capacitor.config.ts` مسبقاً. نفذ الأوامر التالية:
              </p>
              
              <div className="relative bg-[#07090e] border border-[#1b2233] rounded-xl p-3 font-mono text-[11px] text-emerald-300 space-y-1.5 overflow-x-auto" dir="ltr">
                <div>npm run build</div>
                <div>npx cap sync android</div>
                <div>npx cap open android</div>
                <button
                  type="button"
                  onClick={() => copyCode('npm run build && npx cap sync android && npx cap open android', 'أمر Capacitor')}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#181f2f] hover:bg-[#252f47] text-gray-300 text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  نسخ
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-gray-400">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>سيتم فتح مشروع الأندرويد في Android Studio فوراً وجاهز لتوليد ملف APK (Build &gt; Build Bundle(s) / APK(s) &gt; Build APK).</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>تم تضمين جسر الروت التلقائي (Superuser Java Bridge) لحقن التعديلات بضغطة زر واحدة.</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android Studio Native Project */}
        {activeTab === 'STUDIO' && (
          <div className="space-y-3 text-xs leading-relaxed text-gray-300">
            <div className="p-3.5 bg-[#121622] border border-[#21283b] rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-black text-xs">
                <Layers className="w-4 h-4" />
                <span>مجلد المشروع الأصلي (Android Project Structure)</span>
              </div>
              <p className="text-[11px] text-gray-400">
                قم بتصدير المشروع (Export ZIP) وافتح مجلد <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded">/android</code> مباشرة في Android Studio.
              </p>
              
              <div className="space-y-1.5 text-[11px] text-gray-300 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>افتح Android Studio واختر <strong>Open Project</strong> ثم اختر مجلد <strong>android</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>انسخ مجلد <strong>dist</strong> الناتج عن <code className="text-cyan-300">npm run build</code> إلى مسار <code className="text-cyan-300">app/src/main/assets/dist</code>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>اضغط <strong>Build APK</strong> وسيتم إنشاء ملف <code className="text-emerald-300">TownshipVIP.apk</code> جاهز للتثبيت!</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Online & Web2Apk */}
        {activeTab === 'ONLINE' && (
          <div className="space-y-3 text-xs leading-relaxed text-gray-300">
            <div className="p-3.5 bg-[#121622] border border-[#21283b] rounded-2xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs">
                <Sparkles className="w-4 h-4" />
                <span>البناء عبر برامج التحويل السريع (Website 2 APK Builder / PWABuilder)</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                إذا أردت تحويل المشروع إلى APK بدون كتابة أوامر برمجية:
              </p>
              
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#080a10] border border-[#1c2233]">
                  <strong className="text-white block mb-1">أداة Website 2 APK Builder:</strong>
                  <span>اختر <strong>Local Website Folder</strong> وحدد مجلد <code className="text-amber-300">dist</code>، ثم اضغط <strong>Generate APK</strong>.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#080a10] border border-[#1c2233]">
                  <strong className="text-white block mb-1">أداة PWABuilder (من Microsoft):</strong>
                  <span>ادخل على <code className="text-amber-300">pwabuilder.com</code> وضع رابط التطبيق المنشور واضغط <strong>Package for Android</strong> لتنزيل حزمة APK فوراً.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#171c28] hover:bg-[#202738] text-white font-black text-xs transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
