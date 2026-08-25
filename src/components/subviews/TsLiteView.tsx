import React, { useState } from 'react';
import {
  Download,
  FolderOpen,
  Star,
  Cloud,
  LogOut,
  Folder,
  Box,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Calendar
} from 'lucide-react';

interface TsLiteViewProps {
  onLog: (text: string) => void;
  onShowToast: (msg: string) => void;
}

export const TsLiteView: React.FC<TsLiteViewProps> = ({ onLog, onShowToast }) => {
  const [subView, setSubView] = useState<'HOME' | 'BROWSER' | 'SLOT_VIEW'>('HOME');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showUnbanModal, setShowUnbanModal] = useState<boolean>(false);

  const BACKUP_FOLDERS = [
    { id: '1', name: 'TS-VIP 999_0QHZ7nc9DM', label: 'هوية الحساب المحفوظة', level: 999, date: '11/08/2026' },
    { id: '2', name: 'TS-VIP 888_GLtzbil2Fd', label: 'هوية الحساب المحفوظة', level: 888, date: '11/08/2026' },
    { id: '3', name: 'Township_gXoI9uIVcr', label: 'هوية الحساب المحفوظة', level: 250, date: '10/08/2026' },
    { id: '4', name: 'st66_4Ji9gnCMHI', label: 'هوية الحساب المحفوظة', level: 120, date: '08/08/2026' },
    { id: '5', name: 'GuestUser_y2QGCcgJ0t', label: 'هوية الحساب المحفوظة', level: 50, date: '05/08/2026' },
    { id: '6', name: 'BD Legend_y2QGCcgJ0t', label: 'هوية الحساب المحفوظة', level: 888, date: '10/08/2026' },
  ];

  const handleBackupNow = () => {
    const backupPath = `/storage/emulated/0/a_TS_Files/TS-VIP_888_${Date.now().toString(36)}_lvl_888.zip`;
    onLog('بدء عملية النسخ الاحتياطي...');
    onLog('الرجاء الانتظار قليلاً...');
    setTimeout(() => {
      onLog(`تم النسخ بنجاح: ${backupPath}`);
      onShowToast('📦 تم إنشاء النسخة الاحتياطية بنجاح في الذاكرة الداخلية!');
    }, 600);
  };

  const handleUnbanSelect = (backupFirst: boolean) => {
    setShowUnbanModal(false);
    if (backupFirst) {
      onLog('حفظ نسخة احتياطية من الملفات الحالية قبل التصفير...');
    }
    onLog('تعليق جلسات العمل المباشرة...');
    onLog('توسيع حزم البيانات المشفرة...');
    onLog('حقن المعرفات النظيفة في مسار الجذر...');
    onLog('نجاح: تم حقن الملفات وتفعيل درع مكافحة الحظر.');
    onLog('تمت إزالة الحساب المحظور وإنشاء حساب جديد نظيف بنجاح');
    onShowToast('🌟 تمت إزالة الحساب المحظور! تم إنشاء بروفايل مستوى 1 نظيف.');
  };

  if (subView === 'SLOT_VIEW') {
    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubView('BROWSER')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> ملفات النسخ الاحتياطي
          </button>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-[#0c1017] p-2.5 rounded-xl border border-[#1b2333]">
          الذاكرة الداخلية &gt; a_TS_Files &gt; {selectedFolder}
        </div>

        <div className="p-4 rounded-2xl bg-[#12141d] border border-[#212638] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-200">المستوى 888 (11/08/2026)</div>
              <div className="text-xs text-gray-500">جلسة حفظ • تم التحقق من nedata.db</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onLog('إغلاق اللعبة لمنع تضارب البيانات...');
              onLog('الاتصال واستخراج ملف الحفظ...');
              onLog(`تم استخراج ملف الحفظ من ${selectedFolder}.`);
              onLog('قراءة وتجهيز ملف الحفظ...');
              onLog('جاهز للتعديل!');
              onShowToast('📥 تم استرجاع ملف الحفظ وهو جاهز للتعديل الآن!');
              setSubView('HOME');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase"
          >
            استرجاع
          </button>
        </div>
      </div>
    );
  }

  if (subView === 'BROWSER') {
    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSubView('HOME')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> ذاكرة TS LITE
          </button>
          <span className="text-[10px] text-gray-500">اختر النسخة المراد استرجاعها</span>
        </div>

        <div className="text-xs font-mono text-emerald-400 bg-[#0c1017] p-2.5 rounded-xl border border-[#1b2333]">
          الذاكرة الداخلية &gt; a_TS_Files
        </div>

        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {BACKUP_FOLDERS.map((f) => (
            <div
              key={f.id}
              onClick={() => {
                setSelectedFolder(f.name);
                setSubView('SLOT_VIEW');
              }}
              className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] hover:border-cyan-500/50 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Folder className="w-6 h-6 text-amber-400 fill-amber-400/20" />
                <div>
                  <div className="text-xs font-bold text-gray-200">{f.name}</div>
                  <div className="text-[10px] text-gray-500">{f.label} • مستوى {f.level}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-gray-500">{f.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 dir-rtl" dir="rtl">
      {/* Header Info */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#141724] to-[#1a1e30] border border-[#262e48] shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xl">
            🐺
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-white tracking-wide">TS LITE</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 border border-yellow-500/30 text-yellow-400">
                v1.3
              </span>
            </div>
            <p className="text-[11px] text-gray-400">نظام النسخ الاحتياطي وحماية الحسابات</p>
          </div>
        </div>

        <div className="text-left">
          <span className="text-[10px] text-gray-400 block">انتهاء الصلاحية</span>
          <span className="text-xs font-bold font-mono text-cyan-400">05/09/2026</span>
          <span className="text-[10px] text-gray-500 block mt-0.5">المستخدم: <strong className="text-gray-300">عضو VIP</strong></span>
        </div>
      </div>

      {/* 4 Action Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Backup Now */}
        <button
          type="button"
          onClick={handleBackupNow}
          className="p-4 rounded-3xl bg-[#12141d] border border-[#212638] hover:border-cyan-500 active:scale-95 flex flex-col items-center justify-center text-center gap-2.5 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-200 group-hover:text-white uppercase tracking-wider">
            نسخ احتياطي الآن
          </span>
        </button>

        {/* Restore Backup */}
        <button
          type="button"
          onClick={() => setSubView('BROWSER')}
          className="p-4 rounded-3xl bg-[#12141d] border border-[#212638] hover:border-amber-500 active:scale-95 flex flex-col items-center justify-center text-center gap-2.5 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <FolderOpen className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-200 group-hover:text-white uppercase tracking-wider">
            استرجاع نسخة سابقة
          </span>
        </button>

        {/* unBAN Device */}
        <button
          type="button"
          onClick={() => setShowUnbanModal(true)}
          className="p-4 rounded-3xl bg-[#12141d] border border-[#212638] hover:border-yellow-500 active:scale-95 flex flex-col items-center justify-center text-center gap-2.5 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6 fill-yellow-400/20" />
          </div>
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
            فك حظر الجهاز (unBAN)
          </span>
        </button>

        {/* Cloud Backup */}
        <button
          type="button"
          onClick={() => {
            onLog('المزامنة السحابية: تم رفع البيانات إلى خادم Firebase.');
            onShowToast('☁️ تمت المزامنة والنسخ السحابي بنجاح!');
          }}
          className="p-4 rounded-3xl bg-[#12141d] border border-[#212638] hover:border-blue-500 active:scale-95 flex flex-col items-center justify-center text-center gap-2.5 transition-all group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Cloud className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-gray-200 group-hover:text-white uppercase tracking-wider">
            النسخ السحابي
          </span>
        </button>
      </div>

      {/* Exit System Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            onLog('إغلاق النظام. تم تسجيل الخروج بنجاح.');
            onShowToast('🚪 تم تسجيل الخروج من نظام TS LITE');
            window.location.reload();
          }}
          className="w-full py-3 rounded-2xl bg-[#1a1318] hover:bg-red-950/40 border border-red-900/30 text-red-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج من النظام
        </button>
      </div>

      {/* Fresh Level 1 Account Modal */}
      {showUnbanModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 dir-rtl" dir="rtl">
          <div className="w-full max-w-sm bg-[#13151f] border border-[#262c3e] rounded-3xl p-6 shadow-2xl space-y-4 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mx-auto">
              <Star className="w-7 h-7 fill-yellow-400" />
            </div>

            <div>
              <h3 className="text-base font-black text-white tracking-wide">
                إنشاء حساب جديد نظيف (مستوى 1) 🌟
              </h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                أنت على وشك إنشاء حساب تاون شيب نظيف تماماً مع معرفات جهاز جديدة لتجاوز الحظر نهائياً.
              </p>
              <p className="text-xs font-bold text-amber-400 mt-2">
                قبل البدء، هل تريد أخذ نسخة احتياطية من بياناتك الحالية أولاً؟
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleUnbanSelect(false)}
                className="py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold text-xs uppercase"
              >
                ✖ لا، ابدأ فوراً
              </button>
              <button
                type="button"
                onClick={() => handleUnbanSelect(true)}
                className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase shadow-md shadow-emerald-500/20"
              >
                ✔ نعم، احفظ أولاً
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowUnbanModal(false)}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-300 uppercase"
            >
              إلغاء / تراجع
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
