import React from 'react';
import { Anchor, Sparkles, CheckCircle2 } from 'lucide-react';

interface RegattaViewProps {
  onLog: (text: string) => void;
  onShowToast: (msg: string) => void;
}

export const RegattaView: React.FC<RegattaViewProps> = ({ onLog, onShowToast }) => {
  const handleInjectTasks = () => {
    onLog('الريغاتا: تم حقن 100 مهمة بنجاح بنقاط 150.');
    onShowToast('⚓ تم حقن 100 مهمة ريغاتا بـ 150 نقطة كاملة بنجاح!');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-6 dir-rtl" dir="rtl">
      {/* Glow Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1c1424] to-[#120e18] border border-pink-500/30 flex items-center justify-center relative shadow-2xl">
          <Anchor className="w-12 h-12 text-pink-500" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 max-w-xs">
        <h3 className="text-lg font-black text-white tracking-wide uppercase">
          مهام سباق الريغاتا (REGATTA)
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed">
          حقن 100 مهمة بأعلى تقييم (150 نقطة لكل مهمة) في سباق الريغاتا الخاص بك. يعمل في حال كان موسم الريغاتا متاحاً في مدينتك.
        </p>
      </div>

      {/* Big Action Button */}
      <button
        type="button"
        onClick={handleInjectTasks}
        className="w-full max-w-xs h-13 py-3.5 rounded-2xl bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb7185] hover:opacity-95 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all"
      >
        <Sparkles className="w-5 h-5 text-yellow-200" />
        حقن 100 مهمة ريغاتا (150 نقطة)
      </button>

      {/* Points note */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        150 نقطة مضمونة لكل مهمة مع إنجاز فوري
      </div>
    </div>
  );
};
