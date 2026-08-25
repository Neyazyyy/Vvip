import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Coins,
  Gem,
  Package,
  Users,
  Trophy,
  Zap,
  ArrowUpLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Lock,
  Edit2,
  Check,
  TrendingUp,
  Boxes,
  Upload,
  Usb,
  Database,
  CheckCheck,
  Smartphone
} from 'lucide-react';
import { TownProfile, TownResources, BarnItem, SaveSlot } from '../types/index';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface DashboardOverviewProps {
  profile: TownProfile;
  resources: TownResources;
  inventory: BarnItem[];
  activeSlot: SaveSlot;
  onUpdateProfile: (updated: Partial<TownProfile>) => void;
  onTabChange: (tab: string) => void;
  onImportClick?: () => void;
  onOpenApkModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  profile,
  resources,
  inventory,
  activeSlot,
  onUpdateProfile,
  onTabChange,
  onImportClick,
  onOpenApkModal,
}) => {
  const { t, isRtl } = useLanguage();
  const [isEditingTown, setIsEditingTown] = useState(false);
  const [townNameInput, setTownNameInput] = useState(profile.townName);
  const [mayorNameInput, setMayorNameInput] = useState(profile.mayorName);

  const totalBarnItems = inventory.reduce((acc, curr) => acc + curr.count, 0);
  const barnPercentage = Math.min(100, Math.round((totalBarnItems / profile.barnCapacity) * 100));

  const totalGems =
    resources.gems.ruby +
    resources.gems.emerald +
    resources.gems.topaz +
    resources.gems.amethyst;

  const handleSaveName = () => {
    onUpdateProfile({
      townName: townNameInput.trim() || profile.townName,
      mayorName: mayorNameInput.trim() || profile.mayorName,
    });
    setIsEditingTown(false);
    confetti({ particleCount: 30, spread: 50 });
  };

  const ArrowIcon = isRtl ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="space-y-6">
      {/* Top Banner Card with Town Summary */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        {/* Background glow accents */}
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 -mb-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.vipTier} {t.level} {profile.level}
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                {t.antiBanActive}
              </span>
            </div>

            {isEditingTown ? (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <input
                  type="text"
                  value={townNameInput}
                  onChange={(e) => setTownNameInput(e.target.value)}
                  placeholder={t.townName}
                  className="bg-slate-800 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-base font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  value={mayorNameInput}
                  onChange={(e) => setMayorNameInput(e.target.value)}
                  placeholder={t.mayorName}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  {t.save}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {profile.townName}
                  </h2>
                  <button
                    onClick={() => setIsEditingTown(true)}
                    className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    title={t.edit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-400">
                  {t.mayorName}: <span className="text-slate-200 font-medium">{profile.mayorName}</span> • {t.activeSlot}:{' '}
                  <span className="text-emerald-400 font-medium font-mono">#{activeSlot.slotNumber}</span>
                </p>
              </div>
            )}

            {/* Level & XP Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">{t.xpProgress} {profile.level + 1}</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  {profile.xp.toLocaleString()} / {profile.nextLevelXp.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-l from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (profile.xp / profile.nextLevelXp) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Level Adjuster & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 pt-2 lg:pt-0">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
                {profile.level}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-slate-400">{t.currentTownLevel}</div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onUpdateProfile({ level: Math.max(1, profile.level - 1) });
                    }}
                    className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => {
                      onUpdateProfile({ level: profile.level + 1 });
                      confetti({ particleCount: 20 });
                    }}
                    className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold text-white"
                  >
                    +1 {t.level}
                  </button>
                  <button
                    onClick={() => {
                      onUpdateProfile({ level: profile.level + 10 });
                      confetti({ particleCount: 40 });
                    }}
                    className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 rounded text-xs font-bold text-white"
                  >
                    +10
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTabChange('resources')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span>{t.editResources}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => onTabChange('blueprints')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <span>{t.loadBlueprints}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Data & Save File Synchronization Control Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">
                {isRtl ? 'إدارة وحقن ملف الحفظ الفعلي (Real nedata.db Pipeline)' : 'Real In-Game Save & Hardware Synchronizer'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                100% Real Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl
                ? 'قم برفع ملف nedata.db الحقيقي من هاتفك أو اسحبه مباشرة عبر USB/Root لتعديل وحقن موارد مدينتك الفعلية فوراً.'
                : 'Upload your genuine nedata.db save file or sync live via USB/Termux Root to edit your exact game progress.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          {onImportClick && (
            <button
              onClick={onImportClick}
              className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isRtl ? 'استيراد ملف الحفظ الحقيقي (nedata.db)' : 'Import Real nedata.db'}</span>
            </button>
          )}

          <button
            onClick={() => onTabChange('android-bridge')}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-emerald-500/30 transition-all cursor-pointer"
          >
            <Usb className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'المزامنة مع الهاتف (USB / Root)' : 'Live USB / Root Sync'}</span>
          </button>
        </div>
      </div>

      {/* 4 Main Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Coins Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.coins}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {resources.coins.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{t.safeAndUnlocked}</span>
            </p>
          </div>
        </div>

        {/* T-Cash Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.tCash}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">
              {resources.tCash.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">{t.instantSpeedup}</p>
          </div>
        </div>

        {/* Gems Total Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-rose-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.gemsVault}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gem className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {totalGems.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 flex-wrap">
              <span className="text-rose-400">{t.ruby} {resources.gems.ruby}</span>
              <span className="text-emerald-400">{t.emerald} {resources.gems.emerald}</span>
              <span className="text-amber-400">{t.topaz} {resources.gems.topaz}</span>
              <span className="text-purple-400">{t.amethyst} {resources.gems.amethyst}</span>
            </div>
          </div>
        </div>

        {/* Population Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/40 transition-colors group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">{t.population}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {profile.population.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t.barnCapacity}: <span className="text-slate-200 font-medium font-mono">{profile.maxPopulation.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Barn Capacity & Quick Tools Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Barn Capacity Status */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.barnStatus}</h3>
                <p className="text-xs text-slate-400">
                  {totalBarnItems} {t.itemsStoredAcross}
                </p>
              </div>
            </div>
            <button
              onClick={() => onTabChange('barn')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>{t.manageBarn}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Barn Capacity Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t.currentOccupancy}: {barnPercentage}%</span>
              <span className="font-semibold text-slate-200 font-mono">
                {totalBarnItems.toLocaleString()} / {profile.barnCapacity.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  barnPercentage > 90
                    ? 'bg-gradient-to-l from-amber-500 to-rose-500'
                    : 'bg-gradient-to-l from-emerald-500 to-teal-400'
                }`}
                style={{ width: `${barnPercentage}%` }}
              />
            </div>
          </div>

          {/* Quick Barn Expansion Tool Bar */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
              <div className="text-xs text-slate-400">{t.nails}</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">{resources.buildingMaterials.nails}</div>
            </div>
            <div className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
              <div className="text-xs text-slate-400">{t.paint}</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">{resources.buildingMaterials.paint}</div>
            </div>
            <div className="p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/60">
              <div className="text-xs text-slate-400">{t.hammer}</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">{resources.buildingMaterials.hammer}</div>
            </div>
          </div>
        </div>

        {/* VIP Active Privileges */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">{t.vipPrivileges}</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.instantHarvest}</span>
              </div>
              <span className="font-bold text-emerald-400">{t.statusActive}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.doubleProduction}</span>
              </div>
              <span className="font-bold text-emerald-400">{t.statusActive}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.noMarketWait}</span>
              </div>
              <span className="font-bold text-emerald-400">{t.statusActive}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{t.antiBanShieldActive}</span>
              </div>
              <span className="font-bold text-emerald-400">{t.statusActive}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
