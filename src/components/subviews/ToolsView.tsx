import React, { useState } from 'react';
import {
  Package,
  Crown,
  Copy,
  ShieldAlert,
  GraduationCap,
  PawPrint,
  Zap,
  Store,
  Infinity as InfinityIcon,
  Train,
  Code,
  ChevronLeft,
  ArrowRight,
  Check,
  Search,
  Sliders
} from 'lucide-react';

interface ToolsViewProps {
  onLog: (text: string) => void;
  onShowToast: (msg: string) => void;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ onLog, onShowToast }) => {
  const [currentSubpage, setCurrentSubpage] = useState<string | null>(null);

  // Barn State
  const [customBarnUpgrade, setCustomBarnUpgrade] = useState<number>(500);
  const [barnCapacity, setBarnCapacity] = useState<number>(35085);
  const [fillQuantity, setFillQuantity] = useState<number>(999);
  const [barnSearch, setBarnSearch] = useState<string>('');
  const [barnFilter, setBarnFilter] = useState<'الكل' | 'المحاصيل' | 'منتجات الحيوانات'>('الكل');

  // Quantities State
  const [quantitiesBatch, setQuantitiesBatch] = useState<number>(999);
  const [cloverCount, setCloverCount] = useState<number>(50);
  const [eventTokens, setEventTokens] = useState<number>(50);

  // Golden Pass Road
  const [passTab, setPassTab] = useState<'مجاني' | 'مميز VIP'>('مجاني');

  // Main Tools List
  const toolsList = [
    { id: 'barn', title: 'الحظيرة (BARN)', desc: 'زيادة سعة الحظيرة وتعبئة كافة المنتجات', icon: Package, color: 'text-amber-400', hasSubpage: true },
    { id: 'golden_pass_editor', title: 'محرر الجولدن باس', desc: 'تعديل عناصر وجوائز ونقاط التذكرة الذهبية', icon: Crown, color: 'text-yellow-400', hasSubpage: true },
    { id: 'clone_decoration', title: 'استنساخ الزينة والمدينة', desc: 'نسخ تصاميم وزينة أي لاعب بالمعرف', icon: Copy, color: 'text-cyan-400' },
    { id: 'unban', title: 'فك الحظر (UNBAN)', desc: 'إزالة القيود وحظر الحساب وتجاوز السيرفر', icon: ShieldAlert, color: 'text-red-400' },
    { id: 'academia', title: 'أكاديمية الصناعة', desc: 'تسريع وتطوير المصانع والمحاصيل للحد الأقصى', icon: GraduationCap, color: 'text-blue-400' },
    { id: 'zoo_cards', title: 'بطاقات حديقة الحيوان', desc: 'إكمال وبناء جميع أقفاص وموائل الحيوانات', icon: PawPrint, color: 'text-pink-400', hasSubpage: true },
    { id: 'advantages', title: 'مزايا الجولدن باس', desc: 'تفعيل مزايا التسريع ومضاعفة الإنتاج فورا', icon: Zap, color: 'text-emerald-400', hasSubpage: true },
    { id: 'market', title: 'السوق والتاجر', desc: 'زيادة خانات التاجر وتخفيض وقت الانتظار لصفر', icon: Store, color: 'text-teal-400' },
    { id: 'quantities', title: 'الكميات والموارد', desc: 'زيادة أدوات المنجم، المعززات، الكوبونات والأرواح', icon: InfinityIcon, color: 'text-indigo-400', hasSubpage: true },
    { id: 'trains', title: 'القطارات السريعة', desc: 'وصول فوري للقطارات وتعديل العربات والمطالب', icon: Train, color: 'text-orange-400' },
    { id: 'encode_decode', title: 'تشفير وفك تشفير XML', desc: 'أداة منفصلة لمعالجة ملف nedata.db وقواعد البيانات', icon: Code, color: 'text-gray-400' },
  ];

  const handleToolClick = (tool: typeof toolsList[0]) => {
    if (tool.hasSubpage) {
      setCurrentSubpage(tool.id);
      return;
    }

    if (tool.id === 'unban') {
      onLog('تم تطبيق باتش مكافحة الحظر. إزالة قيود الحساب.');
      onShowToast('🛡️ تم تطبيق فك الحظر بنجاح!');
    } else if (tool.id === 'clone_decoration') {
      onLog('استنساخ الزينة جاهز: أدخل معرف اللاعب المستهدف');
      onShowToast('📋 أدخل ID اللاعب لنسخ زينة ومدينته');
    } else if (tool.id === 'academia') {
      onLog('تم ترقية الأكاديمية والمصانع للحد الأقصى.');
      onShowToast('🎓 تم تعظيم ترقيات الأكاديمية بنجاح!');
    } else if (tool.id === 'market') {
      onLog('تمت توسعة السوق بإضافة 100 خانة إضافية.');
      onShowToast('🏪 تم توسيع خانات السوق إلى 100 خانة جديدة!');
    } else if (tool.id === 'trains') {
      onLog('تم ضبط وقت وصول القطارات إلى فوري (0 ثانية).');
      onShowToast('🚂 تم ضبط وصول القطارات فورياً!');
    } else if (tool.id === 'encode_decode') {
      onLog('تم تحميل معالج XML / Nedata.db المستقل.');
      onShowToast('💻 تم تهيئة معالج تشفير وفك تشفير ملفات الحفظ');
    }
  };

  // --- Subpage 1: BARN ---
  if (currentSubpage === 'barn') {
    const BARN_PRESETS = [
      { up: 10, cap: 280 },
      { up: 25, cap: 660 },
      { up: 50, cap: 1360 },
      { up: 100, cap: 5285 },
      { up: 200, cap: 12185 },
      { up: 500, cap: 35085 },
    ];

    const BARN_ITEMS_SAMPLE = [
      'قمح', 'ذرة', 'جزر', 'قصب السكر', 'قطن', 'فراولة',
      'طماطم', 'أناناس', 'حليب', 'بيض', 'صوف', 'لحم', 'عسل',
      'خبز', 'بسكويت', 'جبن', 'زبدة', 'سكر', 'شراب سكري', 'أقمشة'
    ];

    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSubpage(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> إدارة الحظيرة (BARN MANAGER)
          </button>
          <span className="text-[10px] text-gray-500">إدارة سعة ومحتويات الحظيرة</span>
        </div>

        {/* Capacity Box */}
        <div className="p-3.5 rounded-2xl bg-[#12141d] border border-[#212638] space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase block">السعة الإجمالية الحالية</span>
              <span className="text-2xl font-mono font-black text-amber-400">{barnCapacity}</span>
              <span className="text-xs text-gray-500 mr-1">خانة</span>
            </div>
            <div className="text-left">
              <span className="text-[10px] text-gray-500 uppercase block">الترقيات الإضافية</span>
              <span className="text-sm font-mono font-bold text-gray-300">+{customBarnUpgrade}</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-6 gap-1">
            {BARN_PRESETS.map((p) => (
              <button
                key={p.up}
                type="button"
                onClick={() => {
                  setCustomBarnUpgrade(p.up);
                  setBarnCapacity(p.cap);
                }}
                className={`py-1.5 rounded-xl border text-center transition-all ${
                  customBarnUpgrade === p.up
                    ? 'bg-amber-500 border-amber-400 text-black font-black'
                    : 'bg-[#0a0b10] border-[#1d2230] text-gray-300 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">+{p.up}</div>
                <div className="text-[9px] opacity-70">{p.cap}</div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              onLog(`الحظيرة: تم تحديث السعة إلى ${barnCapacity} خانة.`);
              onShowToast(`🌾 تم زيادة سعة الحظيرة إلى ${barnCapacity}!`);
            }}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20"
          >
            تطبيق السعة الجديدة
          </button>
        </div>

        {/* Barn Items Box */}
        <div className="p-3.5 rounded-2xl bg-[#12141d] border border-[#212638] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 uppercase flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-400" />
              عناصر ومحاصيل الحظيرة (124 عنصر)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5">
            {(['الكل', 'المحاصيل', 'منتجات الحيوانات'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setBarnFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  barnFilter === f
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-[#0a0b10] border-[#1d2230] text-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Fill Quantity Input */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={fillQuantity}
              onChange={(e) => setFillQuantity(parseInt(e.target.value, 10) || 0)}
              className="flex-1 h-9 bg-[#0a0b10] border border-[#1e2333] focus:border-cyan-500 rounded-xl px-3 font-mono text-sm font-bold text-white outline-none text-center"
              placeholder="حدد الكمية..."
            />
            <button
              type="button"
              onClick={() => {
                onLog(`تعبئة الحظيرة: تم ملء جميع عناصر [${barnFilter}] بالكمية ${fillQuantity}.`);
                onShowToast(`📦 تم تعبئة جميع عناصر ${barnFilter} بالكمية ${fillQuantity}!`);
              }}
              className="px-6 h-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs uppercase shadow-md shadow-emerald-500/20"
            >
              تعبئة فورية (FILL)
            </button>
          </div>

          {/* Items list preview */}
          <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
            {BARN_ITEMS_SAMPLE.map((it) => (
              <div key={it} className="p-2 rounded-xl bg-[#0a0b10] border border-[#1b202e] flex items-center justify-between text-xs font-medium text-gray-300">
                <span>{it}</span>
                <span className="font-mono text-amber-400 font-bold">{fillQuantity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Subpage 2: GOLDEN PASS EDITOR ---
  if (currentSubpage === 'golden_pass_editor') {
    const STAGES = [
      { stage: 0, type: 'صاروخ خطي', count: 1000, claimed: true },
      { stage: 1, type: 'حزمة بطاقات نادرة', count: 1, claimed: false },
      { stage: 2, type: 'قنبلة متفجرة', count: 100, claimed: true },
      { stage: 3, type: 'فأس المنجم', count: 200, claimed: false },
      { stage: 4, type: 'مطرقة الألغاز', count: 100, claimed: true },
      { stage: 5, type: 'صندوق كنز ذهبي', count: 1, claimed: false },
    ];

    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSubpage(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> محرر الجولدن باس
          </button>
          <span className="text-[10px] text-gray-500">تعديل المسار المجاني ومسار VIP</span>
        </div>

        {/* Top Buttons: Load Pass & Save Changes */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onLog('تم تحميل الجولدن باس: 31 مرحلة مجانية + 31 مرحلة VIP.');
              onShowToast('📖 تم تحميل مراحل الجولدن باس بنجاح!');
            }}
            className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase shadow-md shadow-amber-500/20"
          >
            تحميل الجولدن باس
          </button>
          <button
            type="button"
            onClick={() => {
              onLog('الجولدن باس: تم حفظ 62 مرحلة.');
              onShowToast('💾 تم حفظ تغييرات الجولدن باس!');
            }}
            className="flex-1 py-2 rounded-xl bg-[#262c3e] hover:bg-[#343c55] text-white font-black text-xs uppercase border border-[#3b4562]"
          >
            حفظ التغييرات
          </button>
        </div>

        {/* Free / Premium Road Tabs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPassTab('مجاني')}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              passTab === 'مجاني'
                ? 'bg-amber-500 border-amber-400 text-black font-black'
                : 'bg-[#0a0b10] border-[#1d2230] text-gray-400'
            }`}
          >
            المسار المجاني
          </button>
          <button
            type="button"
            onClick={() => setPassTab('مميز VIP')}
            className={`py-2 text-xs font-bold rounded-xl border transition-all ${
              passTab === 'مميز VIP'
                ? 'bg-amber-500 border-amber-400 text-black font-black'
                : 'bg-[#0a0b10] border-[#1d2230] text-gray-400'
            }`}
          >
            مسار VIP الذهبي
          </button>
        </div>

        {/* Stages List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {STAGES.map((st) => (
            <div key={st.stage} className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">المرحلة رقم {st.stage}</span>
                <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
                  <input type="checkbox" defaultChecked={st.claimed} className="accent-amber-500" />
                  تمت المطالبة
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">نوع الجائزة</span>
                  <div className="h-8 bg-[#0a0b10] border border-[#1e2333] rounded-lg px-2 text-xs font-medium flex items-center text-white">
                    {st.type}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">العدد / الكمية</span>
                  <input
                    type="number"
                    defaultValue={st.count}
                    className="w-full h-8 bg-[#0a0b10] border border-[#1e2333] focus:border-amber-500 rounded-lg px-2 font-mono text-xs font-bold text-white outline-none text-center"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Subpage 3: ZOO CARDS ---
  if (currentSubpage === 'zoo_cards') {
    const ZOO_ANIMALS = [
      'الدببة', 'الفلامينغو', 'الحمار الوحشي', 'البطاريق', 'الشمبانزي',
      'الأسود', 'فرس النهر', 'الزرافات', 'الدب القطبي', 'الكوالا',
      'الباندا', 'الجمال', 'الكنغر', 'النمور', 'الفيلة'
    ];

    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSubpage(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> بطاقات حديقة الحيوان
          </button>
          <span className="text-[10px] font-mono text-pink-400 font-bold">50 / 50 مكتمل</span>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
          {ZOO_ANIMALS.map((a) => (
            <div key={a} className="p-2.5 rounded-xl bg-[#12141d] border border-[#212638] flex items-center justify-between text-xs font-bold text-gray-300">
              <span>{a}</span>
              <div className="w-4 h-4 rounded bg-pink-500 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              onLog('أقفاص الحديقة: تم إكمال وبناء جميع حظائر الحيوانات الـ 50.');
              onShowToast('🦁 تم إكمال وترقية جميع أقفاص حديقة الحيوان!');
              setCurrentSubpage(null);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30"
          >
            تطبيق الكل (APPLY ALL)
          </button>
        </div>
      </div>
    );
  }

  // --- Subpage 4: ADVANTAGES ---
  if (currentSubpage === 'advantages') {
    const ADVANTAGES_LIST = [
      'تسريع المحاصيل 1', 'تسريع الإنتاج 2', 'حيوانات الحظيرة', 'سعة التخزين', 'تسريع المصانع 3',
      'قطار مضاعف 2X', 'سوق مضاعف 2X', 'طلبيات الطيران', 'منجم فوري', 'مطالبة تلقائية', 'سعة قصوى'
    ];

    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSubpage(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> مزايا الجولدن باس
          </button>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">11 / 11 مفعلة</span>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
          {ADVANTAGES_LIST.map((adv) => (
            <div key={adv} className="p-2.5 rounded-xl bg-[#12141d] border border-[#212638] flex items-center justify-between text-xs font-bold text-gray-300">
              <span>{adv}</span>
              <div className="w-4 h-4 rounded bg-emerald-500 text-black flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              onLog('تم تحديث وتفعيل مزايا الجولدن باس بنجاح.');
              onShowToast('⚡ تم تفعيل جميع مزايا التذكرة الذهبية الـ 11!');
              setCurrentSubpage(null);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30"
          >
            تفعيل جميع المزايا
          </button>
        </div>
      </div>
    );
  }

  // --- Subpage 5: QUANTITIES ---
  if (currentSubpage === 'quantities') {
    return (
      <div className="space-y-4 dir-rtl" dir="rtl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentSubpage(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white uppercase"
          >
            <ArrowRight className="w-4 h-4" /> الكميات والموارد
          </button>
          <span className="text-[10px] text-gray-500">المعززات، المنجم، المجوهرات والكوبونات</span>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {/* Match-3 */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>معززات الألغاز (MATCH-3) 🧩</span>
              <span className="text-[10px] text-gray-500">10/10</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={quantitiesBatch}
                onChange={(e) => setQuantitiesBatch(parseInt(e.target.value, 10) || 0)}
                className="flex-1 h-8 bg-[#0a0b10] border border-[#1e2333] rounded-lg px-2 text-xs font-mono font-bold text-white outline-none text-center"
              />
              <button
                type="button"
                onClick={() => {
                  onLog(`تم ضبط معززات الألغاز إلى ${quantitiesBatch}.`);
                  onShowToast(`🧩 تم تحديث معززات اللعبة إلى ${quantitiesBatch}!`);
                }}
                className="px-3 h-8 rounded-lg bg-emerald-500 text-black font-black text-xs uppercase"
              >
                تطبيق
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
              {['صاروخ خطي', 'قنبلة متفجرة', 'كرة قوس قزح', 'مطرقة سحرية', 'خط أفقي', 'خط عمودي', 'إعادة خلط', 'قلوب لا نهائية (أيام)'].map(m => (
                <div key={m} className="p-1.5 rounded-lg bg-[#0a0b10] border border-[#1d2230] flex justify-between">
                  <span className="truncate">{m}</span>
                  <span className="font-mono text-emerald-400 font-bold">{quantitiesBatch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mine */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-red-400">
              <span>أدوات وخامات المنجم (MINE) ⛏️</span>
              <span className="text-[10px] text-gray-500">8/8</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
              {['فأس المنجم', 'ديناميت', 'متفجرات TNT', 'خام النحاس', 'خام الفضة', 'خام الذهب', 'خام البلاتين', 'الصلصال الطيني'].map(m => (
                <div key={m} className="p-1.5 rounded-lg bg-[#0a0b10] border border-[#1d2230] flex justify-between">
                  <span>{m}</span>
                  <span className="font-mono text-red-400 font-bold">{quantitiesBatch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Events & Clovers */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-teal-400">
              <span>الفعاليات ونباتات الحظ ⭐</span>
              <span className="text-[10px] text-gray-500">2/2</span>
            </div>
            <div className="text-[10px] text-amber-400 italic">
              ⚠️ لأمان الحساب وتجنب الحظر لا تجعل نباتات الحظ تزيد عن 100
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-gray-500 block mb-1">توكنات الفعاليات</span>
                <input
                  type="number"
                  value={eventTokens}
                  onChange={(e) => setEventTokens(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-8 bg-[#0a0b10] border border-[#1e2333] rounded-lg px-2 font-mono text-xs font-bold text-white outline-none text-center"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block mb-1">نباتات الحظ (Clovers)</span>
                <input
                  type="number"
                  max={100}
                  value={cloverCount}
                  onChange={(e) => setCloverCount(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-8 bg-[#0a0b10] border border-[#1e2333] rounded-lg px-2 font-mono text-xs font-bold text-teal-400 outline-none text-center"
                />
              </div>
            </div>
          </div>

          {/* Coupons */}
          <div className="p-3 rounded-2xl bg-[#12141d] border border-[#212638] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span>كوبونات الترقية الفورية 🎫</span>
              <span className="text-[10px] text-gray-500">7/7</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-300">
              {['كوبون المصنع', 'كوبون الجزيرة', 'كوبون القطار', 'كوبون الطلبيات', 'كوبون توسيع الأرض', 'كوبون ترقية الحظيرة', 'كوبون التاجر'].map(c => (
                <div key={c} className="p-1.5 rounded-lg bg-[#0a0b10] border border-[#1d2230] flex justify-between">
                  <span className="truncate">{c}</span>
                  <span className="font-mono text-amber-400 font-bold">{quantitiesBatch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={() => {
              onLog('تم تحديث كافة الموارد والكميات بنجاح.');
              onShowToast('📦 تم تحديث كافة الموارد والمعززات والكوبونات!');
              setCurrentSubpage(null);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30"
          >
            تطبيق الكل (APPLY ALL)
          </button>
        </div>
      </div>
    );
  }

  // --- Main Tools Grid ---
  return (
    <div className="space-y-3 dir-rtl" dir="rtl">
      <div className="grid grid-cols-2 gap-2.5">
        {toolsList.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="bg-[#12141d] border border-[#212638] hover:border-cyan-500/60 active:scale-[0.98] rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition-all group min-h-[90px]"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl bg-[#0b0c10] border border-[#1e2333] ${tool.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <ChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:-translate-x-0.5 transition-all" />
              </div>

              <div className="mt-2">
                <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider group-hover:text-white transition-colors">
                  {tool.title}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">
                  {tool.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
