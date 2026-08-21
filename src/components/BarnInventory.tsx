import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Minus,
  Sparkles,
  Zap,
  Filter,
  DollarSign,
  Boxes,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { BarnItem, TownProfile } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface BarnInventoryProps {
  inventory: BarnItem[];
  profile: TownProfile;
  onUpdateInventory: (updated: BarnItem[]) => void;
  onUpdateProfile: (updated: Partial<TownProfile>) => void;
}

export const BarnInventory: React.FC<BarnInventoryProps> = ({
  inventory,
  profile,
  onUpdateInventory,
  onUpdateProfile,
}) => {
  const { t, isRtl, language } = useLanguage();
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', label: t.catAll, arName: 'الكل' },
    { key: 'crops', label: t.catCrops, arName: 'المحاصيل الزراعية' },
    { key: 'factories', label: t.catFactories, arName: 'منتجات المصانع' },
    { key: 'animals', label: t.catAnimals, arName: 'منتجات الحيوانات' },
    { key: 'mining', label: t.catMining, arName: 'التعدين والجزر' },
    { key: 'special', label: t.catSpecial, arName: 'خاص والفعاليات' },
  ];

  const totalBarnItems = inventory.reduce((acc, curr) => acc + curr.count, 0);
  const totalSellValue = inventory.reduce((acc, curr) => acc + curr.count * curr.sellPrice, 0);

  const selectedCategoryObj = categories.find((c) => c.key === selectedCategoryKey) || categories[0];

  const filteredItems = inventory.filter((item) => {
    const matchesCategory =
      selectedCategoryKey === 'all' ||
      item.category === selectedCategoryObj.arName ||
      item.category === selectedCategoryObj.label;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemCountChange = (id: string, delta: number) => {
    const updated = inventory.map((item) => {
      if (item.id === id) {
        return { ...item, count: Math.max(0, item.count + delta) };
      }
      return item;
    });
    onUpdateInventory(updated);
  };

  const handleSetExactCount = (id: string, count: number) => {
    const updated = inventory.map((item) => {
      if (item.id === id) {
        return { ...item, count: Math.max(0, count) };
      }
      return item;
    });
    onUpdateInventory(updated);
  };

  const handleTopUpCategory = () => {
    const updated = inventory.map((item) => {
      const match =
        selectedCategoryKey === 'all' ||
        item.category === selectedCategoryObj.arName ||
        item.category === selectedCategoryObj.label;
      if (match) {
        return { ...item, count: item.count + 50 };
      }
      return item;
    });
    onUpdateInventory(updated);
    confetti({ particleCount: 30 });
  };

  const handleExpandBarn = (amount: number) => {
    onUpdateProfile({
      barnCapacity: profile.barnCapacity + amount,
    });
    confetti({ particleCount: 40, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {/* Barn Metrics Top Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">{t.barnInventoryTitle}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {t.barnInventoryDesc}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <span className="text-slate-300">
              {t.totalBarnItems}:{' '}
              <strong className="text-white font-bold font-mono">{totalBarnItems.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              {t.maxCapacity}:{' '}
              <strong className="text-emerald-400 font-bold font-mono">{profile.barnCapacity.toLocaleString()}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              {t.totalSellValue}:{' '}
              <strong className="text-amber-400 font-bold font-mono">{totalSellValue.toLocaleString()} {t.coins}</strong>
            </span>
          </div>
        </div>

        {/* Barn Capacity Booster Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExpandBarn(500)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 hover:border-emerald-500 flex items-center gap-1.5 transition-colors font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+500 {t.barnCapacity}</span>
          </button>
          <button
            onClick={() => handleExpandBarn(2000)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all font-mono"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>+2,000 {t.vipTier}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className={`w-4 h-4 text-slate-400 absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchBarnPlaceholder}
            className={`w-full ${isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategoryKey(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryKey === cat.key
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Batch Top Up Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-400 font-medium">
          {t.quickBatchAction} <strong className="text-slate-200">{selectedCategoryObj.label}</strong>:
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleTopUpCategory}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 font-mono"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.add50All}</span>
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl p-1 bg-slate-800/80 rounded-xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </div>
              </div>

              <span
                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  item.rarity === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.rarity === 'Epic'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : item.rarity === 'Rare'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {item.rarity === 'VIP'
                  ? t.rarityVip
                  : item.rarity === 'Epic'
                  ? t.rarityEpic
                  : item.rarity === 'Rare'
                  ? t.rarityRare
                  : t.rarityCommon}
              </span>
            </div>

            {/* Count Display & Sell Price */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">{t.quantity}</span>
                <div className="text-base font-extrabold text-emerald-400 font-mono">{item.count}</div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">{t.sellPrice}</span>
                <div className="text-xs font-bold text-amber-400 font-mono">
                  {(item.count * item.sellPrice).toLocaleString()} {t.coins}
                </div>
              </div>
            </div>

            {/* Quick Count Increments */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                onClick={() => handleItemCountChange(item.id, -20)}
                className="py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-xs font-medium font-mono"
              >
                -20
              </button>
              <button
                onClick={() => handleItemCountChange(item.id, 20)}
                className="py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded text-xs font-bold font-mono"
              >
                +20
              </button>
              <button
                onClick={() => handleItemCountChange(item.id, 100)}
                className="py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-xs font-bold font-mono"
              >
                +100
              </button>
              <button
                onClick={() => handleSetExactCount(item.id, 250)}
                className="py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-bold font-mono"
              >
                250
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
