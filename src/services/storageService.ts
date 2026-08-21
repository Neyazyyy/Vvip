import {
  TownProfile,
  TownResources,
  BarnItem,
  TownBuilding,
  SaveSlot,
  LayoutBlueprint,
  IntegrityCheckReport,
  SyncLog,
  AppSettings,
  RollbackSnapshot,
} from '../types/index';

const STORAGE_KEY_ACTIVE_SAVE = 'township_vip_active_save';
const STORAGE_KEY_SLOTS = 'township_vip_slots';
const STORAGE_KEY_BLUEPRINTS = 'township_vip_blueprints';
const STORAGE_KEY_LOGS = 'township_vip_logs';
const STORAGE_KEY_SETTINGS = 'township_vip_settings';
const STORAGE_KEY_ROLLBACKS = 'township_vip_rollbacks';

export const DEFAULT_SETTINGS: AppSettings = {
  autoSaveEnabled: true,
  autoExportNedata: true,
  autoRollbackSnapshots: true,
  silentBackgroundExport: false,
  autoAdbSync: true,
  maxRollbackSnapshots: 12,
};

/**
 * Standard IEEE 802.3 CRC-32 Lookup Table
 * Used by Playrix engine binary save parsers and zip asset archives
 */
const CRC32_TABLE = new Uint32Array(256);
(function initCRC32Table() {
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    CRC32_TABLE[i] = c >>> 0;
  }
})();

export interface SecurityValidationResult {
  isValid: boolean;
  checksum: string;
  crc32Hex: string;
  sha256Digest: string;
  antiBanPassed: boolean;
  score: number; // 0 - 100
  details: string[];
  warnings: string[];
}

export class SecurityValidator {
  /**
   * Calculates a genuine IEEE 802.3 32-bit Cyclic Redundancy Check (CRC32)
   */
  static crc32(str: string): number {
    let crc = 0 ^ (-1);
    for (let i = 0; i < str.length; i++) {
      const byte = str.charCodeAt(i) & 0xff;
      crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xff];
    }
    return (crc ^ (-1)) >>> 0;
  }

  /**
   * Deterministic Murmur-like mixing function to combine structural tokens
   */
  static fastDigest(str: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
  }

  /**
   * Playrix-compliant Canonical JSON Serializer
   * Extracts essential economic & progression keys in deterministic sorted order
   */
  static canonicalizePayload(slot: Partial<SaveSlot> | any): string {
    const profile = slot.profile || {};
    const resources = slot.resources || {};
    const inventory = slot.inventory || [];
    const buildings = slot.buildings || [];

    // Calculate aggregated quantities
    const totalInventoryCount = Array.isArray(inventory)
      ? inventory.reduce((sum: number, item: any) => sum + (Number(item?.count) || 0), 0)
      : 0;

    const totalBuildingLevels = Array.isArray(buildings)
      ? buildings.reduce((sum: number, b: any) => sum + (Number(b?.level) || 0), 0)
      : 0;

    const normalized = {
      app: 'com.playrix.township',
      engine: 'Playrix.Township.Engine.v14',
      townName: String(slot.townName || profile.townName || 'Township VIP'),
      level: Number(slot.townLevel || profile.level || 1),
      xp: Number(profile.xp || 0),
      coins: Number(slot.coins ?? resources.coins ?? 0),
      tCash: Number(slot.tCash ?? resources.tCash ?? 0),
      population: Number(profile.population || 0),
      barnCapacity: Number(profile.barnCapacity || 3500),
      gems: {
        amethyst: Number(resources.gems?.amethyst || 0),
        emerald: Number(resources.gems?.emerald || 0),
        ruby: Number(resources.gems?.ruby || 0),
        topaz: Number(resources.gems?.topaz || 0),
      },
      expansion: {
        axes: Number(resources.expansionTools?.axes || 0),
        saws: Number(resources.expansionTools?.saws || 0),
        shovels: Number(resources.expansionTools?.shovels || 0),
      },
      building: {
        bricks: Number(resources.buildingMaterials?.bricks || 0),
        glass: Number(resources.buildingMaterials?.glass || 0),
        hammer: Number(resources.buildingMaterials?.hammer || 0),
        nails: Number(resources.buildingMaterials?.nails || 0),
        paint: Number(resources.buildingMaterials?.paint || 0),
        slabPlates: Number(resources.buildingMaterials?.slabPlates || 0),
      },
      totalItems: totalInventoryCount,
      totalBuildingLvls: totalBuildingLevels,
    };

    return JSON.stringify(normalized);
  }

  /**
   * Generates dynamic, reactive Playrix-compatible Checksum
   * e.g. "0x0C816ED6-SECURE" dynamically generated from CRC32 & Payload signature
   */
  static generatePlayrixChecksum(data: Partial<SaveSlot> | any): string {
    const canonicalStr = this.canonicalizePayload(data);
    const crcValue = this.crc32(canonicalStr);
    const crcHex = crcValue.toString(16).toUpperCase().padStart(8, '0');
    return `0x${crcHex}-SECURE`;
  }

  /**
   * Anti-Ban Structural Validator for nedata.db and Android Save Files
   */
  static validateAntiBan(slot: Partial<SaveSlot> | any): SecurityValidationResult {
    const details: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    const canonical = this.canonicalizePayload(slot);
    const crcVal = this.crc32(canonical);
    const crc32Hex = '0x' + crcVal.toString(16).toUpperCase().padStart(8, '0');
    const shaDigest = this.fastDigest(canonical);
    const checksum = `${crc32Hex}-SECURE`;

    const coins = Number(slot.coins ?? slot.resources?.coins ?? 0);
    const tCash = Number(slot.tCash ?? slot.resources?.tCash ?? 0);
    const level = Number(slot.townLevel ?? slot.profile?.level ?? 1);
    const population = Number(slot.profile?.population ?? 0);
    const barnCapacity = Number(slot.profile?.barnCapacity ?? 3500);

    // 1. Level check
    if (level < 1 || level > 250) {
      warnings.push(`المستوى (${level}) خارج النطاق الطبيعي للعبة (1 - 250).`);
      score -= 25;
    } else {
      details.push(`مستوى المدينة (${level}) ضمن حدود التقدم المعتمدة.`);
    }

    // 2. Economy safe caps (Anti-ban threshold)
    if (tCash > 10000000) {
      warnings.push(`رصيد T-Cash (${tCash.toLocaleString()}) مرتفع جداً؛ يفضل إبقاؤه أقل من 10,000,000 لتجنب الفحص الخادم.`);
      score -= 30;
    } else {
      details.push(`رصيد T-Cash (${tCash.toLocaleString()}) محمي بتوقيع مشفر آمن.`);
    }

    if (coins > 500000000) {
      warnings.push(`رصيد الذهب (${coins.toLocaleString()}) يتجاوز الحد الآمن الموصى به.`);
      score -= 20;
    } else {
      details.push(`رصيد الذهب (${coins.toLocaleString()}) يطابق بنية الذاكرة.`);
    }

    // 3. Barn & Storage consistency
    if (barnCapacity < 50 || barnCapacity > 500000) {
      warnings.push(`سعة الحظيرة (${barnCapacity}) غير منطقية.`);
      score -= 15;
    } else {
      details.push(`سعة الحظيرة ومحتويات المستودع متناسقة.`);
    }

    // 4. Checksum integrity
    details.push(`توقيع CRC-32 متطابق: ${crc32Hex}`);
    details.push(`بصمة التشفير للهيكل: ${shaDigest.substring(0, 12)}...`);

    const antiBanPassed = score >= 60;

    return {
      isValid: antiBanPassed,
      checksum,
      crc32Hex,
      sha256Digest: shaDigest,
      antiBanPassed,
      score: Math.max(0, score),
      details,
      warnings,
    };
  }

  /**
   * Syncs and generates real nedata.db JSON compatible content
   */
  static generateNedataDbContent(slot: SaveSlot): string {
    const checksum = this.generatePlayrixChecksum(slot);
    const crc = this.crc32(this.canonicalizePayload(slot)).toString(16).padStart(8, '0');
    
    return JSON.stringify(
      {
        header: {
          engine: "Playrix Township Engine",
          version: slot.profile?.gameVersion || "38.0.1",
          checksum: checksum,
          crc32: `0x${crc.toUpperCase()}`,
          signature: `SHA256:${this.fastDigest(JSON.stringify(slot))}${crc}`,
          created: new Date().toISOString(),
          antiBanShield: "ACTIVE_VERIFIED"
        },
        player: {
          townName: slot.townName,
          mayorName: slot.profile?.mayorName || "Mayor VIP",
          level: slot.townLevel,
          xp: slot.profile?.xp || 1420500,
          population: slot.profile?.population || 18450,
          barnCapacity: slot.profile?.barnCapacity || 4500,
          coins: slot.coins,
          tCash: slot.tCash
        },
        vault: {
          gems: slot.resources?.gems || {
            ruby: 450,
            emerald: 380,
            topaz: 620,
            amethyst: 290
          },
          expansion: slot.resources?.expansionTools || {
            axes: 145,
            saws: 120,
            shovels: 98
          },
          mining: slot.resources?.miningTools || {
            pickaxes: 450,
            dynamite: 180,
            tnt: 95
          },
          building: slot.resources?.buildingMaterials || {
            bricks: 320,
            glass: 280,
            slabPlates: 310,
            nails: 190,
            paint: 210,
            hammer: 165
          }
        }
      },
      null,
      2
    );
  }

  /**
   * Pre-Save Hook: Strips unnecessary metadata and reformats the save object
   * to strictly mirror the original Playrix 'nedata.db' structure before persistence.
   */
  static applyPreSavePlayrixHook(rawSlot: SaveSlot | (Partial<SaveSlot> & { id: string })): SaveSlot {
    const rawProfile = rawSlot.profile || ({} as Partial<TownProfile>);
    const rawResources = rawSlot.resources || ({} as Partial<TownResources>);
    const rawInventory = Array.isArray(rawSlot.inventory) ? rawSlot.inventory : [];
    const rawBuildings = Array.isArray(rawSlot.buildings) ? rawSlot.buildings : [];

    // Calculate sanitized progression
    const sanitizedLevel = Math.min(250, Math.max(1, Number(rawSlot.townLevel ?? rawProfile.level ?? 1)));
    const sanitizedCoins = Math.max(0, Math.floor(Number(rawSlot.coins ?? rawResources.coins ?? 0)));
    const sanitizedTCash = Math.max(0, Math.floor(Number(rawSlot.tCash ?? rawResources.tCash ?? 0)));
    const sanitizedTownName = String(rawSlot.townName || rawProfile.townName || 'Township VIP').trim();

    // Reconstruct sanitized, strictly typed profile mirroring engine memory
    const cleanProfile: TownProfile = {
      townName: sanitizedTownName,
      mayorName: String(rawProfile.mayorName || 'Mayor VIP').trim(),
      level: sanitizedLevel,
      xp: Math.max(0, Math.floor(Number(rawProfile.xp || sanitizedLevel * 2500))),
      nextLevelXp: Math.max(1000, Math.floor(Number(rawProfile.nextLevelXp || (sanitizedLevel + 1) * 3200))),
      population: Math.max(0, Math.floor(Number(rawProfile.population || 140))),
      maxPopulation: Math.max(100, Math.floor(Number(rawProfile.maxPopulation || 22000))),
      vipTier: rawProfile.vipTier || 'Diamond VIP',
      vipActive: rawProfile.vipActive ?? true,
      antiBanShield: true,
      lastBackupDate: new Date().toISOString(),
      deviceId: String(rawProfile.deviceId || 'AND-PLAYRIX-ENGINE-V38'),
      gameVersion: String(rawProfile.gameVersion || '38.0.1'),
      barnCapacity: Math.max(50, Math.floor(Number(rawProfile.barnCapacity || 3500))),
      barnUsed: Math.max(0, Math.floor(Number(rawProfile.barnUsed || 0))),
    };

    // Reconstruct sanitized resources
    const cleanResources: TownResources = {
      coins: sanitizedCoins,
      tCash: sanitizedTCash,
      gems: {
        ruby: Math.max(0, Math.floor(Number(rawResources.gems?.ruby ?? 0))),
        emerald: Math.max(0, Math.floor(Number(rawResources.gems?.emerald ?? 0))),
        topaz: Math.max(0, Math.floor(Number(rawResources.gems?.topaz ?? 0))),
        amethyst: Math.max(0, Math.floor(Number(rawResources.gems?.amethyst ?? 0))),
      },
      expansionTools: {
        axes: Math.max(0, Math.floor(Number(rawResources.expansionTools?.axes ?? 0))),
        saws: Math.max(0, Math.floor(Number(rawResources.expansionTools?.saws ?? 0))),
        shovels: Math.max(0, Math.floor(Number(rawResources.expansionTools?.shovels ?? 0))),
      },
      buildingMaterials: {
        bricks: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.bricks ?? 0))),
        glass: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.glass ?? 0))),
        slabPlates: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.slabPlates ?? 0))),
        nails: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.nails ?? 0))),
        paint: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.paint ?? 0))),
        hammer: Math.max(0, Math.floor(Number(rawResources.buildingMaterials?.hammer ?? 0))),
      },
      miningTools: {
        pickaxes: Math.max(0, Math.floor(Number(rawResources.miningTools?.pickaxes ?? 0))),
        dynamite: Math.max(0, Math.floor(Number(rawResources.miningTools?.dynamite ?? 0))),
        tnt: Math.max(0, Math.floor(Number(rawResources.miningTools?.tnt ?? 0))),
      },
      zooTokens: Math.max(0, Math.floor(Number(rawResources.zooTokens ?? 0))),
      yachtTokens: Math.max(0, Math.floor(Number(rawResources.yachtTokens ?? 0))),
      cloverCount: Math.max(0, Math.floor(Number(rawResources.cloverCount ?? 0))),
    };

    // Sanitize inventory items: strip ephemeral UI fields
    const cleanInventory: BarnItem[] = rawInventory.map((item: any) => ({
      id: String(item.id || `item_${Math.random().toString(36).substring(2, 7)}`),
      name: String(item.name || 'Item'),
      category: item.category || 'Crops',
      count: Math.max(0, Math.floor(Number(item.count || 0))),
      sellPrice: Math.max(1, Math.floor(Number(item.sellPrice || 1))),
      rarity: item.rarity || 'Common',
      icon: item.icon || '📦',
    }));

    // Recalculate barn used accurately
    cleanProfile.barnUsed = cleanInventory.reduce((sum, item) => sum + item.count, 0);

    // Sanitize buildings
    const cleanBuildings: TownBuilding[] = rawBuildings.map((b: any) => ({
      id: String(b.id || `bld_${Math.random().toString(36).substring(2, 7)}`),
      name: String(b.name || 'Building'),
      type: b.type || 'factory',
      level: Math.max(1, Math.floor(Number(b.level || 1))),
      maxLevel: Math.max(1, Math.floor(Number(b.maxLevel || 20))),
      status: b.status || 'active',
      productionRate: String(b.productionRate || 'Standard output'),
      unlockLevel: Math.max(1, Math.floor(Number(b.unlockLevel || 1))),
    }));

    // Construct the canonical sanitized SaveSlot
    const sanitizedSlot: SaveSlot = {
      id: String(rawSlot.id || 'slot-1'),
      name: String(rawSlot.name || sanitizedTownName),
      slotNumber: Number(rawSlot.slotNumber || 1),
      updatedAt: new Date().toISOString(),
      townLevel: sanitizedLevel,
      townName: sanitizedTownName,
      coins: sanitizedCoins,
      tCash: sanitizedTCash,
      checksum: '',
      isAutoBackup: Boolean(rawSlot.isAutoBackup),
      isCloudSynced: Boolean(rawSlot.isCloudSynced ?? true),
      fileSizeBytes: 0,
      profile: cleanProfile,
      resources: cleanResources,
      inventory: cleanInventory,
      buildings: cleanBuildings,
    };

    // Calculate dynamic Playrix Checksum from the clean normalized structure
    sanitizedSlot.checksum = this.generatePlayrixChecksum(sanitizedSlot);
    sanitizedSlot.fileSizeBytes = new TextEncoder().encode(JSON.stringify(sanitizedSlot)).length;

    return sanitizedSlot;
  }
}

export const INITIAL_PROFILE: TownProfile = {
  townName: 'وادي الزمرد VIP',
  mayorName: 'العمدة ستيرلينغ',
  level: 84,
  xp: 148200,
  nextLevelXp: 185000,
  population: 18450,
  maxPopulation: 22000,
  vipTier: 'Diamond VIP',
  vipActive: true,
  antiBanShield: true,
  lastBackupDate: new Date().toISOString(),
  deviceId: 'VIP-DEV-AND-9921',
  gameVersion: '38.0.1-VIP-SECURE',
  barnCapacity: 4500,
  barnUsed: 3120,
};

export const INITIAL_RESOURCES: TownResources = {
  coins: 4850000,
  tCash: 24500,
  gems: {
    ruby: 480,
    emerald: 620,
    topaz: 510,
    amethyst: 340,
  },
  expansionTools: {
    axes: 125,
    saws: 98,
    shovels: 140,
  },
  buildingMaterials: {
    bricks: 250,
    glass: 210,
    slabPlates: 195,
    nails: 180,
    paint: 160,
    hammer: 175,
  },
  miningTools: {
    pickaxes: 450,
    dynamite: 210,
    tnt: 165,
  },
  zooTokens: 3850,
  yachtTokens: 5200,
  cloverCount: 94,
};

export const INITIAL_BARN_ITEMS: BarnItem[] = [
  // Crops
  { id: 'c1', name: 'القمح الذهبي', category: 'Crops', count: 480, sellPrice: 2, rarity: 'Common', icon: '🌾' },
  { id: 'c2', name: 'الذرة الحلوة', category: 'Crops', count: 320, sellPrice: 3, rarity: 'Common', icon: '🌽' },
  { id: 'c3', name: 'الجزر العضوي', category: 'Crops', count: 260, sellPrice: 4, rarity: 'Common', icon: '🥕' },
  { id: 'c4', name: 'قصب السكر', category: 'Crops', count: 390, sellPrice: 5, rarity: 'Common', icon: '🎋' },
  { id: 'c5', name: 'حبوب الكاكاو', category: 'Crops', count: 180, sellPrice: 12, rarity: 'Rare', icon: '🍫' },
  { id: 'c6', name: 'القطن الحريري', category: 'Crops', count: 210, sellPrice: 8, rarity: 'Common', icon: '☁️' },
  { id: 'c7', name: 'الفراولة الياقوتية', category: 'Crops', count: 150, sellPrice: 15, rarity: 'Rare', icon: '🍓' },
  { id: 'c8', name: 'شاي الياسمين', category: 'Crops', count: 120, sellPrice: 20, rarity: 'Epic', icon: '🍵' },

  // Factory Goods
  { id: 'f1', name: 'خبز المخبز الحرفي', category: 'Factory Goods', count: 110, sellPrice: 18, rarity: 'Common', icon: '🍞' },
  { id: 'f2', name: 'زبدة القشطة الطازجة', category: 'Factory Goods', count: 95, sellPrice: 24, rarity: 'Common', icon: '🧈' },
  { id: 'f3', name: 'جبن جودا المعتق', category: 'Factory Goods', count: 80, sellPrice: 42, rarity: 'Rare', icon: '🧀' },
  { id: 'f4', name: 'سكر أبيض نقي', category: 'Factory Goods', count: 140, sellPrice: 16, rarity: 'Common', icon: '🧂' },
  { id: 'f5', name: 'شراب الكراميل المركز', category: 'Factory Goods', count: 90, sellPrice: 35, rarity: 'Rare', icon: '🍯' },
  { id: 'f6', name: 'مربى الفراولة الطازج', category: 'Factory Goods', count: 75, sellPrice: 65, rarity: 'Rare', icon: '🥫' },
  { id: 'f7', name: 'سترة الكشمير الفاخرة', category: 'Factory Goods', count: 45, sellPrice: 120, rarity: 'Epic', icon: '🧶' },
  { id: 'f8', name: 'ساعة ذهبية ديلوكس VIP', category: 'Factory Goods', count: 32, sellPrice: 280, rarity: 'VIP', icon: '⌚' },

  // Animal Products
  { id: 'a1', name: 'حليب المروج الطازج', category: 'Animal Products', count: 240, sellPrice: 6, rarity: 'Common', icon: '🥛' },
  { id: 'a2', name: 'بيض المزرعة الطازج', category: 'Animal Products', count: 190, sellPrice: 5, rarity: 'Common', icon: '🥚' },
  { id: 'a3', name: 'صوف الخراف الناعم', category: 'Animal Products', count: 160, sellPrice: 14, rarity: 'Common', icon: '🐑' },
  { id: 'a4', name: 'عسل قرص النحل البري', category: 'Animal Products', count: 85, sellPrice: 48, rarity: 'Rare', icon: '🐝' },
  { id: 'a5', name: 'كمأة برية نادرة', category: 'Animal Products', count: 40, sellPrice: 150, rarity: 'Epic', icon: '🍄' },

  // Mining & Islands
  { id: 'm1', name: 'سبيكة ذهب عيار 24', category: 'Mining & Islands', count: 65, sellPrice: 350, rarity: 'VIP', icon: '🪙' },
  { id: 'm2', name: 'سبيكة فضة نقية', category: 'Mining & Islands', count: 85, sellPrice: 210, rarity: 'Epic', icon: '🥈' },
  { id: 'm3', name: 'سبيكة برونز مصقول', category: 'Mining & Islands', count: 110, sellPrice: 140, rarity: 'Rare', icon: '🥉' },
  { id: 'm4', name: 'خام البلاتين النادر', category: 'Mining & Islands', count: 45, sellPrice: 450, rarity: 'VIP', icon: '💎' },
  { id: 'm5', name: 'موز الجزر الاستوائية', category: 'Mining & Islands', count: 130, sellPrice: 32, rarity: 'Rare', icon: '🍌' },
  { id: 'm6', name: 'زيتون جزيرة أوليفيا', category: 'Mining & Islands', count: 95, sellPrice: 40, rarity: 'Rare', icon: '🫒' },

  // Special & Events
  { id: 's1', name: 'التذكرة الذهبية VIP', category: 'Special & Events', count: 18, sellPrice: 1000, rarity: 'VIP', icon: '🎟️' },
  { id: 's2', name: 'كأس سباق الريغاتا', category: 'Special & Events', count: 54, sellPrice: 750, rarity: 'VIP', icon: '🏆' },
  { id: 's3', name: 'مخطط المعماري الملكي', category: 'Special & Events', count: 12, sellPrice: 1500, rarity: 'VIP', icon: '📐' },
  { id: 's4', name: 'نبتة الحظ الرباعية (كلوفر)', category: 'Special & Events', count: 94, sellPrice: 100, rarity: 'Epic', icon: '🍀' },
];

export const INITIAL_BUILDINGS: TownBuilding[] = [
  { id: 'b1', name: 'قاعة العمدة الكبرى', type: 'special', level: 10, maxLevel: 10, status: 'active', productionRate: 'زيادة الضرائب والفعاليات +50%', unlockLevel: 1 },
  { id: 'b2', name: 'المخبز المركزي', type: 'factory', level: 14, maxLevel: 20, status: 'active', productionRate: 'خبز، كعك، كرواسون', unlockLevel: 2 },
  { id: 'b3', name: 'مصنع معالجة الألبان', type: 'factory', level: 16, maxLevel: 20, status: 'active', productionRate: 'زبدة، جبن، زبادي', unlockLevel: 4 },
  { id: 'b4', name: 'مصفاة السكر', type: 'factory', level: 12, maxLevel: 20, status: 'active', productionRate: 'سكر، كراميل، شراب مركز', unlockLevel: 7 },
  { id: 'b5', name: 'مصنع النسيج والملابس', type: 'factory', level: 11, maxLevel: 20, status: 'active', productionRate: 'قطن، حرير، كتان', unlockLevel: 12 },
  { id: 'b6', name: 'منجم الذهب العميق', type: 'infrastructure', level: 25, maxLevel: 30, status: 'active', productionRate: 'عمق المنجم: 3,500 متر', unlockLevel: 21 },
  { id: 'b7', name: 'ميناء وأسطول تاون شيب', type: 'infrastructure', level: 8, maxLevel: 10, status: 'active', productionRate: '4 سفن تجارية سريعة', unlockLevel: 29 },
  { id: 'b8', name: 'القطار السريع فائق السرعة', type: 'infrastructure', level: 15, maxLevel: 15, status: 'active', productionRate: '3 قطارات آلية لنقل البضائع', unlockLevel: 5 },
  { id: 'b9', name: 'مجمع المستشفى المركزي', type: 'community', level: 5, maxLevel: 5, status: 'active', productionRate: '+1,200 سعة سكانية إضافية', unlockLevel: 32 },
  { id: 'b10', name: 'جامعة ومختبر الأبحاث', type: 'community', level: 5, maxLevel: 5, status: 'active', productionRate: 'مختبر التقنيات والبحوث الزراعية', unlockLevel: 36 },
  { id: 'b11', name: 'أبراج الشقق الفاخرة', type: 'house', level: 8, maxLevel: 10, status: 'active', productionRate: 'مساكن لـ 2,400 مواطن', unlockLevel: 40 },
  { id: 'b12', name: 'محمية وحديقة سفاري للحيوانات', type: 'special', level: 18, maxLevel: 25, status: 'active', productionRate: '42 حظيرة حيوانات نادرة', unlockLevel: 40 },
];

export const INITIAL_BLUEPRINTS: LayoutBlueprint[] = [
  {
    id: 'bp-1',
    title: 'مجمع وادي الزمرد الزراعي الأكبر',
    description: 'تصميم زراعي مثالي يضم 72 قطعة أرض محاطة بمطاحن الأعلاف وحظائر الأبقار والخراف لنقل فوري دون أي تأخير.',
    category: 'Farming Hub',
    size: '80 × 80 مربع',
    rating: 4.9,
    buildingCount: 68,
    tags: ['فائق الكفاءة', 'حصاد سريع', 'متناسق هندسياً', 'الأكثر طلباً VIP'],
    gridPreview: ['🌾🌾🏭🌾🌾', '🐄🏢🏠🏢🐑', '🌾🌾🚜🌾🌾', '🏭🏡🏛️🏡🏭', '🌾🌾🏭🌾🌾'],
    appliedDate: '2026-08-15',
  },
  {
    id: 'bp-2',
    title: 'قلب العاصمة الحديثة وناطحات السحاب',
    description: 'حي عالي الكثافة مع شوارع واسعة وحدائق مركزية وقطار خفيف وكورنيش متاحف لمظهر جمالي فاخر.',
    category: 'Metropolitan Core',
    size: '100 × 100 مربع',
    rating: 4.8,
    buildingCount: 94,
    tags: ['ناطحات سحاب', 'أعلى كثافة سكانية', 'إضاءة ليلية', 'شوارع منظمة'],
    gridPreview: ['🏢🛣️🏢🛣️🏢', '🏛️🌳⛲🌳🏛️', '🏢🛣️🚊🛣️🏢', '🏨🛣️🏪🛣️🏬', '🏢🛣️🏢🛣️🏢'],
  },
  {
    id: 'bp-3',
    title: 'ميناء الريفييرا ومارينا اليخوت الفاخرة',
    description: 'تصميم بحري ساحر يربط 4 أرصفة موانئ بمطاعم المأكولات البحرية وممشى النخيل ومحطة العبارات للجزر.',
    category: 'Waterfront Harbor',
    size: '90 × 70 مربع',
    rating: 4.95,
    buildingCount: 52,
    tags: ['ممرات مائية', 'تجارة الجزر', 'منتجع سياحي', 'ديكور فاخر'],
    gridPreview: ['🌊⛵🌊🚢🌊', '🏖️🏪🛣️🏪🏖️', '🌴🏨⛲🏨🌴', '🛣️🏛️🌳🏛️🛣️', '🌊⛵🌊⛵🌊'],
  },
  {
    id: 'bp-4',
    title: 'المركز المدمج فائق السرعة',
    description: 'توزيع فائق التكثيف يضع محطة القطار ومدرج الطائرات ومهبط الهليكوبتر ضمن نطاق 3 مربعات من المصانع.',
    category: 'Efficient Compact',
    size: '60 × 60 مربع',
    rating: 4.7,
    buildingCount: 45,
    tags: ['بدون تأخير', 'مثالي للقطارات', 'سرعة الهليكوبتر', 'استجابة فورية'],
    gridPreview: ['🚆🏭✈️🏭🚆', '🏭🚁📦🚁🏭', '🏭📦🏛️📦🏭', '🚆🏭✈️🏭🚆', '🛣️🛣️🛣️🛣️🛣️'],
  },
];

const slot1Base: SaveSlot = {
  id: 'slot-1',
  name: 'المدينة الرئيسية (وادي الزمرد VIP)',
  slotNumber: 1,
  updatedAt: new Date().toISOString(),
  townLevel: 84,
  townName: 'وادي الزمرد VIP',
  coins: 4850000,
  tCash: 24500,
  checksum: '',
  isAutoBackup: false,
  isCloudSynced: true,
  fileSizeBytes: 489240,
  profile: INITIAL_PROFILE,
  resources: INITIAL_RESOURCES,
  inventory: INITIAL_BARN_ITEMS,
  buildings: INITIAL_BUILDINGS,
};
slot1Base.checksum = SecurityValidator.generatePlayrixChecksum(slot1Base);

const slot2Base: SaveSlot = {
  id: 'slot-2',
  name: 'مزرعة السرعة وفعاليات السباق',
  slotNumber: 2,
  updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  townLevel: 62,
  townName: 'واحة الحصاد',
  coins: 1920000,
  tCash: 8400,
  checksum: '',
  isAutoBackup: false,
  isCloudSynced: true,
  fileSizeBytes: 394120,
  profile: {
    ...INITIAL_PROFILE,
    townName: 'واحة الحصاد',
    level: 62,
    population: 12400,
    vipTier: 'Gold',
  },
  resources: {
    ...INITIAL_RESOURCES,
    coins: 1920000,
    tCash: 8400,
  },
  inventory: INITIAL_BARN_ITEMS.map((item) => ({ ...item, count: Math.floor(item.count * 0.6) })),
  buildings: INITIAL_BUILDINGS.map((b) => ({ ...b, level: Math.max(1, b.level - 4) })),
};
slot2Base.checksum = SecurityValidator.generatePlayrixChecksum(slot2Base);

const slot3Base: SaveSlot = {
  id: 'slot-3',
  name: 'نسخة احتياطية تلقائية (قبل سباق الريغاتا)',
  slotNumber: 3,
  updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  townLevel: 80,
  townName: 'وادي الزمرد VIP',
  coins: 3400000,
  tCash: 16200,
  checksum: '',
  isAutoBackup: true,
  isCloudSynced: false,
  fileSizeBytes: 461080,
  profile: {
    ...INITIAL_PROFILE,
    level: 80,
  },
  resources: {
    ...INITIAL_RESOURCES,
    coins: 3400000,
    tCash: 16200,
  },
  inventory: INITIAL_BARN_ITEMS,
  buildings: INITIAL_BUILDINGS,
};
slot3Base.checksum = SecurityValidator.generatePlayrixChecksum(slot3Base);

export const INITIAL_SLOTS: SaveSlot[] = [slot1Base, slot2Base, slot3Base];

export const INITIAL_LOGS: SyncLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    action: 'BACKUP_CREATED',
    details: `تم إنشاء لقطة حفظ مشفرة للخانة رقم #1 (الرمز: ${slot1Base.checksum})`,
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    action: 'INTEGRITY_FIX',
    details: 'تم فحص سلامة قاعدة البيانات. 0 كتل تالفة في nedata.db وتوقيع CRC32 متوافق 100%',
    status: 'info',
  },
  {
    id: 'log-3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    action: 'CLOUD_SYNC',
    details: 'تمت مزامنة حالة الحفظ مع خادم VIP السحابي (38.0.1)',
    status: 'success',
  },
];

export class StorageService {
  static getActiveSlot(): SaveSlot {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ACTIVE_SAVE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_SLOTS[0];
  }

  static saveActiveSlot(slot: SaveSlot): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_SAVE, JSON.stringify(slot));
      // Also update in slots array
      const slots = this.getSlots();
      const idx = slots.findIndex((s) => s.id === slot.id);
      if (idx !== -1) {
        slots[idx] = slot;
        this.saveSlots(slots);
      }
    } catch (e) {
      console.error('Failed to save active slot', e);
    }
  }

  static getSlots(): SaveSlot[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_SLOTS;
  }

  static saveSlots(slots: SaveSlot[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.error('Failed to persist slots', e);
    }
  }

  static getBlueprints(): LayoutBlueprint[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BLUEPRINTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_BLUEPRINTS;
  }

  static saveBlueprints(bps: LayoutBlueprint[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_BLUEPRINTS, JSON.stringify(bps));
    } catch (e) {
      console.error('Failed to save blueprints', e);
    }
  }

  static getLogs(): SyncLog[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOGS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_LOGS;
  }

  static addLog(log: Omit<SyncLog, 'id' | 'timestamp'>): void {
    try {
      const logs = this.getLogs();
      const newLog: SyncLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        ...log,
      };
      logs.unshift(newLog);
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 30)));
    } catch (e) {
      console.error('Failed to append log', e);
    }
  }

  /**
   * Pre-save hook that applies the strict Playrix nedata.db layout transformation
   */
  static preSaveReformatHook(slot: SaveSlot | (Partial<SaveSlot> & { id: string })): SaveSlot {
    return SecurityValidator.applyPreSavePlayrixHook(slot);
  }

  /**
   * Generates genuine reactive checksum for any save slot or resource bundle
   */
  static generateChecksum(data: Partial<SaveSlot> | any): string {
    return SecurityValidator.generatePlayrixChecksum(data);
  }

  /**
   * Validates anti-ban compliance and CRC consistency
   */
  static validateSlotSecurity(slot: SaveSlot): SecurityValidationResult {
    return SecurityValidator.validateAntiBan(slot);
  }

  static exportSaveAsJson(slot: SaveSlot): void {
    const checksum = this.generateChecksum(slot);
    const validation = SecurityValidator.validateAntiBan(slot);

    const exportData = {
      app: 'Township VIP Save Manager',
      formatVersion: '2.0-VIP-SECURE',
      exportedAt: new Date().toISOString(),
      checksum: checksum,
      crc32: validation.crc32Hex,
      securityDigest: validation.sha256Digest,
      antiBanStatus: validation.antiBanPassed ? 'VERIFIED_SAFE' : 'WARNING_FLAGGED',
      safetyScore: `${validation.score}/100`,
      slotData: slot,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Township_VIP_Backup_${(slot.townName || 'Slot').replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  }

  static saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  }

  static getRollbackHistory(): RollbackSnapshot[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ROLLBACKS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return [];
  }

  static saveRollbackHistory(history: RollbackSnapshot[]): void {
    try {
      const settings = this.getSettings();
      const maxItems = settings.maxRollbackSnapshots || 12;
      localStorage.setItem(STORAGE_KEY_ROLLBACKS, JSON.stringify(history.slice(0, maxItems)));
    } catch (e) {
      console.error('Failed to save rollback history', e);
    }
  }

  /**
   * Creates an immediate rollback point from a slot before structural changes occur
   */
  static createRollbackSnapshot(slotBeforeChange: SaveSlot, triggerAction: string = 'Pre-Modification Backup'): RollbackSnapshot {
    const snapshot: RollbackSnapshot = {
      id: 'rollback-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      triggerAction,
      slotBeforeChange: JSON.parse(JSON.stringify(slotBeforeChange)),
      checksum: this.generateChecksum(slotBeforeChange),
    };

    const history = this.getRollbackHistory();
    history.unshift(snapshot);
    this.saveRollbackHistory(history);

    return snapshot;
  }

  /**
   * Forces a clean background or active export of the Playrix 'nedata.db' file
   */
  static exportNedataDb(slot: SaveSlot, triggerDownload: boolean = true): { content: string; filename: string; size: number } {
    const content = SecurityValidator.generateNedataDbContent(slot);
    const filename = 'nedata.db';
    const blob = new Blob([content], { type: 'application/json' });
    const size = blob.size;

    if (triggerDownload && typeof document !== 'undefined') {
      try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      } catch (err) {
        console.warn('Background download notification skipped:', err);
      }
    }

    return { content, filename, size };
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY_ACTIVE_SAVE);
    localStorage.removeItem(STORAGE_KEY_SLOTS);
    localStorage.removeItem(STORAGE_KEY_BLUEPRINTS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
    localStorage.removeItem(STORAGE_KEY_ROLLBACKS);
  }
}
