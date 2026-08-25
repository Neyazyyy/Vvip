import React from 'react';
import { Sparkles, Check, CheckCircle2 } from 'lucide-react';

export interface TownStatsData {
  tCash: number;
  coins: number;
  level: number;
  m3Lvl: number;
  firstWin: number;
  lives: number;
  help: number;
  cards: number;
  regatta: number;
  monthYear: string;
  expeditionEnergy: number;
  mineDepth: number;
}

interface StatsViewProps {
  isConnected: boolean;
  stats: TownStatsData;
  onChangeStats: (newStats: Partial<TownStatsData>) => void;
  onApplySingle: (key: keyof TownStatsData, value: any) => void;
  onApplyAll: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  isConnected,
  stats,
  onChangeStats,
  onApplySingle,
  onApplyAll,
}) => {
  const statFields = [
    { key: 'tCash', label: 'الدولارات (T-CASH)', icon: '💵', color: 'text-emerald-400', isString: false },
    { key: 'coins', label: 'العملات الذهبية (COINS)', icon: '🪙', color: 'text-yellow-400', isString: false },
    { key: 'level', label: 'مستوى المدينة (LEVEL)', icon: '⭐', color: 'text-cyan-400', isString: false },
    { key: 'm3Lvl', label: 'مستوى لعبة الألغاز (M3 LVL)', icon: '🧩', color: 'text-pink-400', isString: false },
    { key: 'firstWin', label: 'أول فوز متتالي (1ST WIN)', icon: '🏆', color: 'text-amber-400', isString: false },
    { key: 'lives', label: 'عدد القلوب والأرواح (LIVES)', icon: '❤️', color: 'text-red-400', isString: false },
    { key: 'help', label: 'المساعدات للأصدقاء (HELP)', icon: '🤝', color: 'text-teal-400', isString: false },
    { key: 'cards', label: 'البطاقات والمجموعات (CARDS)', icon: '🃏', color: 'text-purple-400', isString: false },
    { key: 'regatta', label: 'نقاط الريغاتا (REGATTA)', icon: '⚓', color: 'text-blue-400', isString: false },
    { key: 'monthYear', label: 'تاريخ إنشاء الحساب (MONTH/YEAR)', icon: '📅', color: 'text-gray-300', isString: true },
  ];

  return (
    <div className="space-y-2.5 dir-rtl" dir="rtl">
      {/* Warning banner if not connected */}
      {!isConnected && (
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            ⚠️ تنبيه: اضغط على زر "الاتصال" بالأعلى لقراءة وتعديل الحفظ المباشر
          </span>
          <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">غير متصل</span>
        </div>
      )}

      {/* List of Stat Inputs matching the video layout */}
      <div className="space-y-1.5">
        {statFields.map((field) => {
          const val = (stats as any)[field.key];
          return (
            <div
              key={field.key}
              className="bg-[#12141d] border border-[#212638] hover:border-[#2f3750] rounded-2xl p-2.5 flex items-center justify-between gap-2 transition-all group"
            >
              {/* Stat Name & Icon */}
              <div className="flex items-center gap-2 min-w-[130px]">
                <span className="text-base">{field.icon}</span>
                <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                  {field.label}
                </span>
              </div>

              {/* Input Value & Save Button */}
              <div className="flex items-center gap-1.5 flex-1 justify-end max-w-[200px]">
                <input
                  type={field.isString ? 'text' : 'number'}
                  value={val}
                  onChange={(e) => {
                    const nextVal = field.isString
                      ? e.target.value
                      : parseInt(e.target.value, 10) || 0;
                    onChangeStats({ [field.key]: nextVal });
                  }}
                  className={`w-full h-8 bg-[#0a0b10] border border-[#1e2333] focus:border-cyan-500 rounded-xl px-2.5 font-mono text-xs font-bold text-center outline-none transition-all ${field.color}`}
                />
                <button
                  type="button"
                  title="حفظ هذا الحقل فقط"
                  onClick={() => onApplySingle(field.key as keyof TownStatsData, val)}
                  className="w-8 h-8 rounded-xl bg-[#1a1f2e] hover:bg-cyan-500/20 hover:text-cyan-400 text-gray-400 flex items-center justify-center border border-[#273047] active:scale-95 transition-all flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply All Stats Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onApplyAll}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#e11d48] via-[#f43f5e] to-[#fb7185] hover:opacity-95 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          حفظ وتطبيق جميع الإحصائيات (APPLY ALL)
        </button>
      </div>

      {/* Anti-Ban Protection indicator */}
      <div className="flex items-center justify-center gap-1 text-[11px] text-emerald-400 pt-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>نظام الحماية من الحظر (Anti-Ban Guard) نشط ويعمل</span>
      </div>
    </div>
  );
};
