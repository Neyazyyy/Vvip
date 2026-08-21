import React, { useState } from 'react';
import {
  Coins,
  Sparkles,
  Gem,
  Axe,
  Hammer,
  Pickaxe,
  Trophy,
  ShieldCheck,
  Zap,
  RotateCcw,
  PlusCircle,
  Sliders,
  CheckCircle,
  Package
} from 'lucide-react';
import { TownResources } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface ResourceEditorProps {
  resources: TownResources;
  onUpdateResources: (updated: TownResources) => void;
}

export const ResourceEditor: React.FC<ResourceEditorProps> = ({
  resources,
  onUpdateResources,
}) => {
  const { t, isRtl } = useLanguage();
  const [safeMode, setSafeMode] = useState(true);

  const handleCoinChange = (val: number) => {
    const limit = safeMode ? 20000000 : 99999999;
    onUpdateResources({
      ...resources,
      coins: Math.max(0, Math.min(limit, val)),
    });
  };

  const handleCashChange = (val: number) => {
    const limit = safeMode ? 50000 : 999999;
    onUpdateResources({
      ...resources,
      tCash: Math.max(0, Math.min(limit, val)),
    });
  };

  const handleGemChange = (type: keyof TownResources['gems'], delta: number) => {
    const current = resources.gems[type];
    onUpdateResources({
      ...resources,
      gems: {
        ...resources.gems,
        [type]: Math.max(0, current + delta),
      },
    });
  };

  const handleToolChange = (type: keyof TownResources['expansionTools'], delta: number) => {
    const current = resources.expansionTools[type];
    onUpdateResources({
      ...resources,
      expansionTools: {
        ...resources.expansionTools,
        [type]: Math.max(0, current + delta),
      },
    });
  };

  const handleMaterialChange = (type: keyof TownResources['buildingMaterials'], delta: number) => {
    const current = resources.buildingMaterials[type];
    onUpdateResources({
      ...resources,
      buildingMaterials: {
        ...resources.buildingMaterials,
        [type]: Math.max(0, current + delta),
      },
    });
  };

  const handleMiningChange = (type: keyof TownResources['miningTools'], delta: number) => {
    const current = resources.miningTools[type];
    onUpdateResources({
      ...resources,
      miningTools: {
        ...resources.miningTools,
        [type]: Math.max(0, current + delta),
      },
    });
  };

  const handleMaxAllTools = () => {
    onUpdateResources({
      ...resources,
      expansionTools: { axes: 500, saws: 500, shovels: 500 },
      buildingMaterials: {
        bricks: 600,
        glass: 600,
        slabPlates: 600,
        nails: 500,
        paint: 500,
        hammer: 500,
      },
      miningTools: { pickaxes: 999, dynamite: 450, tnt: 350 },
      gems: { ruby: 800, emerald: 800, topaz: 800, amethyst: 800 },
    });
    confetti({ particleCount: 50, spread: 70 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Safe Mode switch */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            {t.resourceEditorTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.resourceEditorDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setSafeMode(!safeMode)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              safeMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.safeMode}: {safeMode ? t.safeModeOn : t.safeModeOff}</span>
          </button>

          <button
            onClick={handleMaxAllTools}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.maxSafeCapBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Currencies Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coins Modifier Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.coins}</h3>
                <p className="text-xs text-slate-400">{t.coinsDesc}</p>
              </div>
            </div>
            <div className="font-extrabold text-xl text-amber-400 font-mono">
              {resources.coins.toLocaleString()}
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[10000, 50000, 250000, 1000000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleCoinChange(resources.coins + amt)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 hover:border-amber-500/40 transition-colors font-mono"
              >
                +{amt >= 1000000 ? '1M' : amt / 1000 + 'k'}
              </button>
            ))}
          </div>

          {/* Direct Input Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.quickSlider}</span>
              <span className="font-mono">{t.maxCap}: {safeMode ? '20,000,000' : '99,999,999'}</span>
            </div>
            <input
              type="range"
              min="0"
              max={safeMode ? 20000000 : 99999999}
              step="10000"
              value={resources.coins}
              onChange={(e) => handleCoinChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* T-Cash Modifier Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.tCash}</h3>
                <p className="text-xs text-slate-400">{t.tCashDesc}</p>
              </div>
            </div>
            <div className="font-extrabold text-xl text-emerald-400 font-mono">
              {resources.tCash.toLocaleString()}
            </div>
          </div>

          {/* Quick Increment Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[500, 2000, 5000, 10000].map((amt) => (
              <button
                key={amt}
                onClick={() => handleCashChange(resources.tCash + amt)}
                className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 hover:border-emerald-500/40 transition-colors font-mono"
              >
                +{amt / 1000 >= 1 ? `${amt / 1000}k` : amt}
              </button>
            ))}
          </div>

          {/* Direct Input Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{t.quickSlider}</span>
              <span className="font-mono">{t.maxCap}: {safeMode ? '50,000' : '999,999'}</span>
            </div>
            <input
              type="range"
              min="0"
              max={safeMode ? 50000 : 999999}
              step="500"
              value={resources.tCash}
              onChange={(e) => handleCashChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Gem Vault Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Gem className="w-5 h-5 text-rose-400" />
          {t.gemVaultTitle}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { key: 'ruby' as const, name: t.rubyGem, color: 'text-rose-400', bg: 'bg-rose-500/10', count: resources.gems.ruby, icon: '💎' },
            { key: 'emerald' as const, name: t.emeraldGem, color: 'text-emerald-400', bg: 'bg-emerald-500/10', count: resources.gems.emerald, icon: '💎' },
            { key: 'topaz' as const, name: t.topazGem, color: 'text-amber-400', bg: 'bg-amber-500/10', count: resources.gems.topaz, icon: '💎' },
            { key: 'amethyst' as const, name: t.amethystGem, color: 'text-purple-400', bg: 'bg-purple-500/10', count: resources.gems.amethyst, icon: '💎' },
          ].map((gem) => (
            <div key={gem.key} className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${gem.color}`}>{gem.name}</span>
                <span className="text-lg">{gem.icon}</span>
              </div>
              <div className={`text-xl font-bold font-mono ${gem.color}`}>{gem.count}</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleGemChange(gem.key, -25)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded font-mono"
                >
                  -25
                </button>
                <button
                  onClick={() => handleGemChange(gem.key, 50)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded font-mono"
                >
                  +50
                </button>
                <button
                  onClick={() => handleGemChange(gem.key, 200)}
                  className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded font-mono"
                >
                  +200
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expansion & Building Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Land Expansion Tools */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Axe className="w-5 h-5 text-emerald-400" />
            {t.landExpansionToolsTitle}
          </h3>
          <div className="space-y-3">
            {[
              { key: 'axes' as const, label: t.axesLabel, count: resources.expansionTools.axes, icon: '🪓' },
              { key: 'saws' as const, label: t.sawsLabel, count: resources.expansionTools.saws, icon: '🪚' },
              { key: 'shovels' as const, label: t.shovelsLabel, count: resources.expansionTools.shovels, icon: '🦯' },
            ].map((tool) => (
              <div
                key={tool.key}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-850 border border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{tool.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{tool.label}</div>
                    <div className="text-xs text-slate-400 font-mono">{tool.count} {t.unitsAvailable}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToolChange(tool.key, -10)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded font-mono"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleToolChange(tool.key, 25)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 rounded font-mono"
                  >
                    +25
                  </button>
                  <button
                    onClick={() => handleToolChange(tool.key, 100)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded font-mono"
                  >
                    +100
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Building & Barn Expansion Materials */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Hammer className="w-5 h-5 text-amber-400" />
            {t.buildingMaterialsTitle}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'bricks' as const, label: t.bricks, count: resources.buildingMaterials.bricks, icon: '🧱' },
              { key: 'glass' as const, label: t.glass, count: resources.buildingMaterials.glass, icon: '🪟' },
              { key: 'slabPlates' as const, label: t.slabPlates, count: resources.buildingMaterials.slabPlates, icon: '📦' },
              { key: 'nails' as const, label: t.nails, count: resources.buildingMaterials.nails, icon: '📌' },
              { key: 'paint' as const, label: t.paint, count: resources.buildingMaterials.paint, icon: '🎨' },
              { key: 'hammer' as const, label: t.hammer, count: resources.buildingMaterials.hammer, icon: '🔨' },
            ].map((mat) => (
              <div
                key={mat.key}
                className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mat.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-[80px]">{mat.label}</div>
                    <div className="text-xs font-extrabold text-amber-400 font-mono">{mat.count}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleMaterialChange(mat.key, 50)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-emerald-400 rounded font-mono"
                >
                  +50
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
