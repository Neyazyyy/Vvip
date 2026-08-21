export type VipTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond VIP' | 'Supreme Master';

export interface TownProfile {
  townName: string;
  mayorName: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  population: number;
  maxPopulation: number;
  vipTier: VipTier;
  vipActive: boolean;
  antiBanShield: boolean;
  lastBackupDate: string;
  deviceId: string;
  gameVersion: string;
  barnCapacity: number;
  barnUsed: number;
}

export interface TownResources {
  coins: number;
  tCash: number;
  gems: {
    ruby: number;
    emerald: number;
    topaz: number;
    amethyst: number;
  };
  expansionTools: {
    axes: number;
    saws: number;
    shovels: number;
  };
  buildingMaterials: {
    bricks: number;
    glass: number;
    slabPlates: number;
    nails: number;
    paint: number;
    hammer: number;
  };
  miningTools: {
    pickaxes: number;
    dynamite: number;
    tnt: number;
  };
  zooTokens: number;
  yachtTokens: number;
  cloverCount: number;
}

export interface BarnItem {
  id: string;
  name: string;
  category: 'Crops' | 'Factory Goods' | 'Animal Products' | 'Mining & Islands' | 'Special & Events';
  count: number;
  sellPrice: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'VIP';
  icon: string;
}

export interface TownBuilding {
  id: string;
  name: string;
  type: 'factory' | 'community' | 'house' | 'infrastructure' | 'special';
  level: number;
  maxLevel: number;
  status: 'active' | 'upgrading' | 'locked';
  productionRate?: string;
  unlockLevel: number;
}

export interface SaveSlot {
  id: string;
  name: string;
  slotNumber: number;
  updatedAt: string;
  townLevel: number;
  townName: string;
  coins: number;
  tCash: number;
  checksum: string;
  isAutoBackup: boolean;
  isCloudSynced: boolean;
  fileSizeBytes: number;
  profile: TownProfile;
  resources: TownResources;
  inventory: BarnItem[];
  buildings: TownBuilding[];
}

export interface LayoutBlueprint {
  id: string;
  title: string;
  description: string;
  category: 'Farming Hub' | 'Metropolitan Core' | 'Waterfront Harbor' | 'Efficient Compact' | 'Aesthetic Resort';
  size: string;
  rating: number;
  buildingCount: number;
  tags: string[];
  gridPreview: string[];
  appliedDate?: string;
}

export interface IntegrityCheckReport {
  databaseFile: string;
  totalBlocks: number;
  corruptedHeaders: number;
  checksumStatus: 'VERIFIED' | 'WARNING' | 'REPAIRED';
  antiBanStatus: 'PROTECTED' | 'MODIFIED_SAFELY';
  fileChecksum: string;
  lastVerified: string;
  logEntries: string[];
}

export interface SyncLog {
  id: string;
  timestamp: string;
  action: 'BACKUP_CREATED' | 'SAVE_RESTORED' | 'CLOUD_SYNC' | 'RESOURCE_MODIFIED' | 'INTEGRITY_FIX' | 'AUTO_SAVE_EXPORT' | 'ROLLBACK_RESTORE' | 'ADB_BRIDGE_SYNC' | 'ADB_BRIDGE_PULL';
  details: string;
  status: 'success' | 'warning' | 'info';
}

export interface RollbackSnapshot {
  id: string;
  createdAt: string;
  triggerAction: string;
  slotBeforeChange: SaveSlot;
  checksum: string;
}

export interface AppSettings {
  autoSaveEnabled: boolean;
  autoExportNedata: boolean;
  autoRollbackSnapshots: boolean;
  silentBackgroundExport: boolean;
  autoAdbSync: boolean;
  maxRollbackSnapshots: number;
}

export type AdbConnectionState = 'DISCONNECTED' | 'PAIRING' | 'AUTHORIZING' | 'CONNECTED' | 'SYNCING' | 'ERROR';

export type AdbTransportMode = 'WEB_USB' | 'ADB_TCP' | 'SAF_STORAGE' | 'SHIZUKU_ROOT';

export interface AndroidDevice {
  id: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  apiLevel: number;
  serialNumber: string;
  batteryLevel: number;
  isRooted: boolean;
  targetStoragePath: string;
  transportMode: AdbTransportMode;
  usbSpeed: string;
  packageInstalled: boolean;
  packageVersion: string;
  connectedAt?: string;
}

export interface AdbTerminalLog {
  id: string;
  timestamp: string;
  command?: string;
  output: string;
  type: 'cmd' | 'stdout' | 'stderr' | 'system' | 'success';
}

export interface AdbSyncResult {
  success: boolean;
  bytesTransferred: number;
  transferTimeMs: number;
  checksum: string;
  destinationPath: string;
  gameRestarted: boolean;
  timestamp: string;
}
