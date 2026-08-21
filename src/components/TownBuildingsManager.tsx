import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  ArrowUpCircle,
  CheckCircle2,
  Lock,
  Zap,
  Hammer,
  Search,
  Check
} from 'lucide-react';
import { TownBuilding } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface TownBuildingsManagerProps {
  buildings: TownBuilding[];
  onUpdateBuildings: (updated: TownBuilding[]) => void;
}

export const TownBuildingsManager: React.FC<TownBuildingsManagerProps> = ({
  buildings,
  onUpdateBuildings,
}) => {
  const { t, isRtl } = useLanguage();
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const types = [
    { key: 'all', label: t.typeAll },
    { key: 'factory', label: t.typeFactory },
    { key: 'infrastructure', label: t.typeInfrastructure },
    { key: 'community', label: t.typeCommunity },
    { key: 'special', label: t.typeSpecial },
  ];

  const filtered = buildings.filter((b) => {
    const matchesType = filterType === 'all' || b.type === filterType;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleUpgradeBuilding = (id: string) => {
    const updated = buildings.map((b) => {
      if (b.id === id && b.level < b.maxLevel) {
        return { ...b, level: b.level + 1, status: 'active' as const };
      }
      return b;
    });
    onUpdateBuildings(updated);
    confetti({ particleCount: 25 });
  };

  const handleMaxAllBuildings = () => {
    const updated = buildings.map((b) => ({
      ...b,
      level: b.maxLevel,
      status: 'active' as const,
    }));
    onUpdateBuildings(updated);
    confetti({ particleCount: 50, spread: 70 });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'factory':
        return t.typeFactory;
      case 'infrastructure':
        return t.typeInfrastructure;
      case 'community':
        return t.typeCommunity;
      case 'special':
        return t.typeSpecial;
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            {t.buildingsManagerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.buildingsManagerDesc}
          </p>
        </div>

        <button
          onClick={handleMaxAllBuildings}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all shrink-0 font-mono"
        >
          <Zap className="w-4 h-4" />
          <span>{t.maxAllBuildingsBtn}</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {types.map((tp) => (
            <button
              key={tp.key}
              onClick={() => setFilterType(tp.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterType === tp.key
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t.filterBuildingsPlaceholder}
          className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-xs"
        />
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => {
          const isMaxed = b.level >= b.maxLevel;
          return (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      {getTypeLabel(b.type)}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{b.name}</h3>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                      isMaxed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {t.level} {b.level}/{b.maxLevel}
                  </span>
                </div>

                {b.productionRate && (
                  <p className="text-xs text-slate-400 bg-slate-850 p-2 rounded-lg border border-slate-800">
                    ⚡ {b.productionRate}
                  </p>
                )}

                {/* Level Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-l from-emerald-500 to-teal-400 h-2 rounded-full transition-all"
                      style={{ width: `${(b.level / b.maxLevel) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Upgrade Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">{t.unlockLevel}: {b.unlockLevel}</span>

                {isMaxed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t.maxStatus}
                  </span>
                ) : (
                  <button
                    onClick={() => handleUpgradeBuilding(b.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-colors"
                  >
                    <ArrowUpCircle className="w-3.5 h-3.5" />
                    <span>{t.instantUpgrade}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
