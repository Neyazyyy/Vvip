import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  Layers,
  CheckCircle2,
  Grid,
  Download,
  Upload,
  ArrowRight,
  Maximize2,
  Building,
  Star,
  Check
} from 'lucide-react';
import { LayoutBlueprint } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface LayoutBlueprintsProps {
  blueprints: LayoutBlueprint[];
  onApplyBlueprint: (blueprint: LayoutBlueprint) => void;
}

export const LayoutBlueprints: React.FC<LayoutBlueprintsProps> = ({
  blueprints,
  onApplyBlueprint,
}) => {
  const { t, isRtl } = useLanguage();
  const [selectedBp, setSelectedBp] = useState<LayoutBlueprint>(blueprints[0]);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleApply = (bp: LayoutBlueprint) => {
    onApplyBlueprint(bp);
    setAppliedId(bp.id);
    confetti({ particleCount: 50, spread: 70 });
    setTimeout(() => setAppliedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-blue-400" />
            {t.blueprintsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.blueprintsDesc}
          </p>
        </div>
      </div>

      {/* Blueprint Grid + Live Visualizer split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Blueprints */}
        <div className="lg:col-span-5 space-y-3">
          {blueprints.map((bp) => {
            const isSelected = bp.id === selectedBp.id;
            return (
              <div
                key={bp.id}
                onClick={() => setSelectedBp(bp)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-850 border-blue-500 shadow-md shadow-blue-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                      {bp.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{bp.title}</h3>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {bp.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{bp.description}</p>

                <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono">
                    {bp.size}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono">
                    {bp.buildingCount} {t.buildingsCountLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Live Layout Visualizer & Actions */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {t.activeBlueprint}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedBp.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedBp.description}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400">{t.spaceEfficiency}</span>
                <div className="text-sm font-bold text-emerald-400 font-mono">{t.spaceEfficiencyVal}</div>
              </div>
            </div>

            {/* Simulated Grid Matrix Layout Visualizer */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-800">
                <span>{t.gridPreviewMap}</span>
                <span className="text-[11px] font-mono text-emerald-400">{t.gridMatrix} {selectedBp.size}</span>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-2">
                {selectedBp.gridPreview.map((row, idx) => (
                  <div
                    key={idx}
                    className="text-2xl sm:text-3xl tracking-widest bg-slate-950/70 px-4 py-1.5 rounded-lg border border-slate-800 font-mono select-none"
                  >
                    {row}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
                <span className="flex items-center gap-1">🌾 {t.farms}</span>
                <span className="flex items-center gap-1">🏭 {t.factories}</span>
                <span className="flex items-center gap-1">🏢 {t.houses}</span>
                <span className="flex items-center gap-1">🛣️ {t.roads}</span>
                <span className="flex items-center gap-1">🌊 {t.waterChannels}</span>
              </div>
            </div>

            {/* Blueprint Tags */}
            <div className="flex flex-wrap gap-2">
              {selectedBp.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-medium border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Blueprint Action Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {t.applyBlueprintDesc}
            </div>

            <button
              onClick={() => handleApply(selectedBp)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2 transition-all shrink-0 font-mono"
            >
              {appliedId === selectedBp.id ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{t.blueprintAppliedSuccess}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.applyBlueprintBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
