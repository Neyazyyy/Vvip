import React, { useState } from 'react';
import { Sparkles, Check, CheckSquare, Square } from 'lucide-react';

interface UnlocksViewProps {
  onLog: (text: string) => void;
  onShowToast: (msg: string) => void;
}

export const UnlocksView: React.FC<UnlocksViewProps> = ({ onLog, onShowToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'SKINS' | 'STICKERS' | 'ACHIEVEMENTS'>('SKINS');

  // Skins (22/22)
  const [selectedSkins, setSelectedSkins] = useState<string[]>([
    'heli_golden', 'heli_pirate', 'train_retro', 'train_cyber', 'ship_dragon',
    'station_ice', 'barn_wood', 'airport_steampunk', 'heli_ufo', 'train_bullet',
    'ship_viking', 'station_castle', 'barn_space', 'airport_modern', 'heli_balloon',
    'train_ghost', 'ship_yacht', 'station_future', 'barn_golden', 'airport_gold',
    'heli_santa', 'train_express'
  ]);

  // Stickers (10/10)
  const [selectedStickers, setSelectedStickers] = useState<string[]>([
    'stk_crown', 'stk_fire', 'stk_diamond', 'stk_trophy', 'stk_star',
    'stk_shield', 'stk_heart', 'stk_clover', 'stk_rocket', 'stk_gem'
  ]);

  // Achievements (8/8)
  const [selectedAchievements, setSelectedAchievements] = useState<string[]>([
    'ach_first_harvest', 'ach_train_master', 'ach_mine_deep', 'ach_zoo_keeper',
    'ach_regatta_champ', 'ach_order_frenzy', 'ach_town_legend', 'ach_rich_farmer'
  ]);

  const SKINS_LIST = [
    { id: 'heli_golden', name: 'طائرة هليكوبتر ذهبية VIP', cat: 'المروحية' },
    { id: 'heli_pirate', name: 'طائرة القرصان النفاثة', cat: 'المروحية' },
    { id: 'train_retro', name: 'قطار البخار الأثري', cat: 'القطار' },
    { id: 'train_cyber', name: 'قطار السايبر المستقبلي', cat: 'القطار' },
    { id: 'ship_dragon', name: 'سفينة التنين الملكية', cat: 'الميناء' },
    { id: 'station_ice', name: 'محطة الجليد الكريستالية', cat: 'المحطة' },
    { id: 'barn_wood', name: 'الحظيرة الخشبية الكلاسيكية', cat: 'الحظيرة' },
    { id: 'airport_steampunk', name: 'مطار البخار ستيم بانك', cat: 'المطار' },
    { id: 'heli_ufo', name: 'الطبق الفضائي الطائر UFO', cat: 'المروحية' },
    { id: 'train_bullet', name: 'قطار الرصاصة فائق السرعة', cat: 'القطار' },
    { id: 'ship_viking', name: 'سفينة الفايكنج الأسطورية', cat: 'الميناء' },
    { id: 'station_castle', name: 'محطة القلعة الملكية', cat: 'المحطة' },
    { id: 'barn_space', name: 'حظيرة المحطة الفضائية', cat: 'الحظيرة' },
    { id: 'airport_modern', name: 'المطار الدولي المتطور', cat: 'المطار' },
    { id: 'heli_balloon', name: 'منطاد المغامرات الهوائي', cat: 'المروحية' },
    { id: 'train_ghost', name: 'قطار الشبح المتوهج', cat: 'القطار' },
    { id: 'ship_yacht', name: 'يخت الرفاهية الملكي', cat: 'الميناء' },
    { id: 'station_future', name: 'محطة المستقبل النيونية', cat: 'المحطة' },
    { id: 'barn_golden', name: 'الحظيرة الذهبية الخالصة', cat: 'الحظيرة' },
    { id: 'airport_gold', name: 'المطار الذهبي الفاخر', cat: 'المطار' },
    { id: 'heli_santa', name: 'عربة سانتا الطائرة', cat: 'المروحية' },
    { id: 'train_express', name: 'قطار الإكسبريس السريع', cat: 'القطار' },
  ];

  const STICKERS_LIST = [
    { id: 'stk_crown', name: 'تاج الملوك الذهبي 👑' },
    { id: 'stk_fire', name: 'شعلة النار الحماسية 🔥' },
    { id: 'stk_diamond', name: 'الماسة الزرقاء النادرة 💎' },
    { id: 'stk_trophy', name: 'كأس البطولة الذهبي 🏆' },
    { id: 'stk_star', name: 'النجمة المتوهجة ⭐' },
    { id: 'stk_shield', name: 'درع الأبطال الملكي 🛡️' },
    { id: 'stk_heart', name: 'القلب الماسي الأحمر ❤️' },
    { id: 'stk_clover', name: 'نبتة الحظ الرباعية 🍀' },
    { id: 'stk_rocket', name: 'الصاروخ الفضائي 🚀' },
    { id: 'stk_gem', name: 'الجوهرة الملكية 🔮' },
  ];

  const ACHIEVEMENTS_LIST = [
    { id: 'ach_first_harvest', name: 'المزارع الأسطوري (4 نجوم)', desc: 'جمع أكثر من 1,000,000 محصول' },
    { id: 'ach_train_master', name: 'قائد خطوط القطارات', desc: 'إرسال 10,000 قطار مكتمل' },
    { id: 'ach_mine_deep', name: 'ملك أعماق المنجم', desc: 'استخراج 50,000 خام ذهب وألماس' },
    { id: 'ach_zoo_keeper', name: 'سفير حديقة الحيوان', desc: 'تربية جميع فصائل الحيوانات' },
    { id: 'ach_regatta_champ', name: 'بطل الريغاتا الذهبي', desc: 'الفوز بالدوري الذهبي 50 مرة' },
    { id: 'ach_order_frenzy', name: 'سيد طائرات الهليكوبتر', desc: 'إكمال 20,000 طلبية طيران' },
    { id: 'ach_town_legend', name: 'عمدة المدينة الخارق', desc: 'توسيع جميع أراضي المدينة' },
    { id: 'ach_rich_farmer', name: 'الملياردير الذهبي', desc: 'جمع أكثر من 100 مليون عملة' },
  ];

  const toggleSkin = (id: string) => {
    setSelectedSkins((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSticker = (id: string) => {
    setSelectedStickers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAchievement = (id: string) => {
    setSelectedAchievements((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (activeSubTab === 'SKINS') {
      if (selectedSkins.length === SKINS_LIST.length) {
        setSelectedSkins([]);
      } else {
        setSelectedSkins(SKINS_LIST.map((s) => s.id));
      }
    } else if (activeSubTab === 'STICKERS') {
      if (selectedStickers.length === STICKERS_LIST.length) {
        setSelectedStickers([]);
      } else {
        setSelectedStickers(STICKERS_LIST.map((s) => s.id));
      }
    } else {
      if (selectedAchievements.length === ACHIEVEMENTS_LIST.length) {
        setSelectedAchievements([]);
      } else {
        setSelectedAchievements(ACHIEVEMENTS_LIST.map((a) => a.id));
      }
    }
  };

  const handleApplyTab = () => {
    if (activeSubTab === 'SKINS') {
      onLog(`تم فتح السكنات والمظاهر: ${selectedSkins.length}/${SKINS_LIST.length}`);
      onShowToast(`🎨 تم تفعيل ${selectedSkins.length} مظهر وسكن للمدينة!`);
    } else if (activeSubTab === 'STICKERS') {
      onLog(`تم فتح الملصقات التعبيرية: ${selectedStickers.length}/${STICKERS_LIST.length}`);
      onShowToast(`⭐ تم فتح ${selectedStickers.length} ملصق تعبيري!`);
    } else {
      onLog(`تم تفعيل الإنجازات: ${selectedAchievements.length}/${ACHIEVEMENTS_LIST.length}`);
      onShowToast(`🏆 تم إكمال ${selectedAchievements.length} إنجازاً بالكامل!`);
    }
  };

  const handleApplyAllUnlocks = () => {
    onLog('تم فتح جميع السكنات (22)، الملصقات (10)، والإنجازات (8) بنجاح!');
    onShowToast('✨ تم فتح وتفعيل جميع السكنات والملصقات والإنجازات!');
  };

  const getSubTabCount = () => {
    if (activeSubTab === 'SKINS') return `${selectedSkins.length} / ${SKINS_LIST.length}`;
    if (activeSubTab === 'STICKERS') return `${selectedStickers.length} / ${STICKERS_LIST.length}`;
    return `${selectedAchievements.length} / ${ACHIEVEMENTS_LIST.length}`;
  };

  return (
    <div className="space-y-3 dir-rtl" dir="rtl">
      {/* 3 Subtabs Header */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#12141d] border border-[#212638] rounded-2xl">
        {[
          { id: 'SKINS', label: 'المظاهر والسكنات', count: '22' },
          { id: 'STICKERS', label: 'الملصقات', count: '10' },
          { id: 'ACHIEVEMENTS', label: 'الإنجازات', count: '8' },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-2 px-2 rounded-xl text-center transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-black shadow-md'
                  : 'bg-[#0a0b10] text-gray-400 hover:text-gray-200 border border-[#1b202e]'
              }`}
            >
              <div className="text-[10px] font-extrabold uppercase">{tab.label}</div>
              <div className="text-[9px] font-mono opacity-80">{tab.count} عنصر</div>
            </button>
          );
        })}
      </div>

      {/* Counter & Select All Checkbox */}
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-mono text-cyan-400 font-bold tracking-wider">{getSubTabCount()}</span>
        <button
          type="button"
          onClick={handleSelectAll}
          className="flex items-center gap-1.5 text-gray-300 hover:text-white font-bold transition-colors cursor-pointer"
        >
          <CheckSquare className="w-4 h-4 text-cyan-400" />
          <span>تحديد الكل</span>
        </button>
      </div>

      {/* Items Scrollable List */}
      <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {activeSubTab === 'SKINS' &&
          SKINS_LIST.map((item) => {
            const isChecked = selectedSkins.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSkin(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#151926] border-cyan-500/50 text-white'
                    : 'bg-[#0e1017] border-[#1b202e] text-gray-400 hover:border-[#273047]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      isChecked ? 'bg-cyan-500 text-black' : 'border border-gray-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0a0b10] border border-[#1b202e] text-gray-400 font-mono">
                  {item.cat}
                </span>
              </div>
            );
          })}

        {activeSubTab === 'STICKERS' &&
          STICKERS_LIST.map((item) => {
            const isChecked = selectedStickers.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleSticker(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#151926] border-amber-500/50 text-white'
                    : 'bg-[#0e1017] border-[#1b202e] text-gray-400 hover:border-[#273047]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      isChecked ? 'bg-amber-500 text-black' : 'border border-gray-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
              </div>
            );
          })}

        {activeSubTab === 'ACHIEVEMENTS' &&
          ACHIEVEMENTS_LIST.map((item) => {
            const isChecked = selectedAchievements.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleAchievement(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-[#151926] border-emerald-500/50 text-white'
                    : 'bg-[#0e1017] border-[#1b202e] text-gray-400 hover:border-[#273047]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center ${
                      isChecked ? 'bg-emerald-500 text-black' : 'border border-gray-600'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{item.name}</div>
                    <div className="text-[10px] text-gray-500">{item.desc}</div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Action Buttons: Apply Current Tab & Apply All Unlocks */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={handleApplyTab}
          className="py-2.5 rounded-xl bg-[#202638] hover:bg-[#2b334a] border border-[#2f3850] text-gray-200 font-black text-xs uppercase transition-all"
        >
          تطبيق هذا القسم
        </button>

        <button
          type="button"
          onClick={handleApplyAllUnlocks}
          className="py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-black text-xs uppercase shadow-md shadow-pink-600/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          فتح الكل (APPLY ALL)
        </button>
      </div>
    </div>
  );
};
