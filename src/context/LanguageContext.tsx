import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en';

export interface Translations {
  appName: string;
  vipTier: string;
  gameVersion: string;
  antiBanActive: string;
  activeSlot: string;
  slotNumber: string;
  availableSlots: string;
  slotsCount: string;
  level: string;
  coins: string;
  deviceSync: string;
  cloudSync: string;
  syncing: string;
  exportSave: string;
  importSave: string;
  edit: string;
  
  // Navigation Tabs
  tabOverview: string;
  tabBackups: string;
  tabResources: string;
  tabBarn: string;
  tabBuildings: string;
  tabBlueprints: string;
  tabIntegrity: string;
  tabAndroidFiles: string;
  tabAndroidBridge: string;

  // Dashboard Overview
  vipMembership: string;
  antiBanProtected: string;
  townNamePlaceholder: string;
  mayorNamePlaceholder: string;
  townName: string;
  mayorName: string;
  save: string;
  cancel: string;
  mayor: string;
  xpProgress: string;
  currentLevel: string;
  currentTownLevel: string;
  editResources: string;
  browseBlueprints: string;
  loadBlueprints: string;
  townshipCoins: string;
  safeUnlimitedBalance: string;
  safeAndUnlocked: string;
  tCashTitle: string;
  tCash: string;
  instantBuildingBoost: string;
  instantSpeedup: string;
  gemVault: string;
  gemsVault: string;
  gemVaultTitle: string;
  ruby: string;
  rubyGem: string;
  emerald: string;
  emeraldGem: string;
  topaz: string;
  topazGem: string;
  amethyst: string;
  amethystGem: string;
  townPopulation: string;
  population: string;
  capacityMax: string;
  citizens: string;
  barnCapacityTitle: string;
  barnStatus: string;
  itemsStoredAcrossDepts: string;
  itemsStoredAcross: string;
  manageBarn: string;
  occupancyRate: string;
  currentOccupancy: string;
  barnNails: string;
  barnPaint: string;
  barnHammers: string;
  vipPrivilegesTitle: string;
  vipPrivileges: string;
  instantCropHarvest: string;
  instantHarvest: string;
  doubleFactoryOutput: string;
  doubleProduction: string;
  dealerMarketZeroWait: string;
  noMarketWait: string;
  antiBanChecksumActive: string;
  antiBanShieldActive: string;
  activeStatus: string;
  statusActive: string;
  enabledStatus: string;

  // Backup & Slots Manager
  backupManagerTitle: string;
  backupManagerDesc: string;
  createSnapshotBtn: string;
  snapshotModalTitle: string;
  snapshotModalDesc: string;
  snapshotPlaceholder: string;
  freezeStateTitle: string;
  freezeStateDesc: string;
  placeholderSnapshot: string;
  confirmSave: string;
  confirmAndSave: string;
  confirmDeleteSlot: string;
  activeSaveBadge: string;
  townLevelLabel: string;
  townLevel: string;
  coinsLabel: string;
  tCashLabel: string;
  fileSizeLabel: string;
  fileSize: string;
  cloudSynced: string;
  copied: string;
  copyChecksum: string;
  exportJson: string;
  inspectSlot: string;
  inspect: string;
  deleteSlot: string;
  saveInspectorTitle: string;
  loadThisSave: string;
  close: string;
  syncLogsTitle: string;
  syncLogTitle: string;
  oneSlotRequiredAlert: string;

  // Resource Editor
  resourceEditorTitle: string;
  resourceEditorDesc: string;
  safeMode: string;
  safeModeLabel: string;
  safeModeOn: string;
  safeModeOff: string;
  fillVaultMax: string;
  maxSafeCapBtn: string;
  coinsDesc: string;
  tCashDesc: string;
  quickSlider: string;
  maxLabel: string;
  maxCap: string;
  landToolsTitle: string;
  landExpansionToolsTitle: string;
  buildingMaterialsTitle: string;
  axes: string;
  axesLabel: string;
  saws: string;
  sawsLabel: string;
  shovels: string;
  shovelsLabel: string;
  bricks: string;
  glass: string;
  slabPlates: string;
  nails: string;
  paint: string;
  hammer: string;
  availableUnits: string;
  unitsAvailable: string;

  // Barn Inventory
  barnTitle: string;
  barnDesc: string;
  barnInventoryTitle: string;
  barnInventoryDesc: string;
  totalStoredItems: string;
  totalBarnItems: string;
  maxCapacity: string;
  totalResellValue: string;
  totalSellValue: string;
  barnCapacity: string;
  addBarnCapacity: string;
  addVipCapacity: string;
  searchBarnPlaceholder: string;
  batchActionFor: string;
  quickBatchAction: string;
  add50ToAllShown: string;
  add50All: string;
  catAll: string;
  catCrops: string;
  catFactory: string;
  catFactories: string;
  catAnimals: string;
  catMining: string;
  catSpecial: string;
  quantity: string;
  sellPrice: string;
  rarityCommon: string;
  rarityRare: string;
  rarityEpic: string;
  rarityVip: string;

  // Buildings Manager
  buildingsTitle: string;
  buildingsDesc: string;
  buildingsManagerTitle: string;
  buildingsManagerDesc: string;
  maxAllVipBtn: string;
  maxAllBuildingsBtn: string;
  filterAllBuildings: string;
  filterFactories: string;
  filterInfrastructure: string;
  filterCommunity: string;
  filterSpecial: string;
  searchBuildingsPlaceholder: string;
  filterBuildingsPlaceholder: string;
  typeAll: string;
  typeFactory: string;
  typeInfrastructure: string;
  typeCommunity: string;
  typeSpecial: string;
  unlockLevel: string;
  maxLevelBadge: string;
  maxStatus: string;
  instantUpgradeBtn: string;
  instantUpgrade: string;

  // Blueprints
  blueprintsTitle: string;
  blueprintsDesc: string;
  activeBlueprintLabel: string;
  activeBlueprint: string;
  spaceEfficiency: string;
  perfectRating: string;
  spaceEfficiencyVal: string;
  gridMapPreview: string;
  gridPreviewMap: string;
  matrixLabel: string;
  gridMatrix: string;
  buildingsCountLabel: string;
  farms: string;
  factories: string;
  houses: string;
  roads: string;
  waterChannels: string;
  legendFarms: string;
  legendFactories: string;
  legendHouses: string;
  legendRoads: string;
  legendWaterways: string;
  applyBlueprintWarning: string;
  applyBlueprintDesc: string;
  applyBlueprintBtn: string;
  appliedSuccessBtn: string;
  blueprintAppliedSuccess: string;

  // Security & Anti-ban
  integrityTitle: string;
  integrityDesc: string;
  runDeepScan: string;
  scanningBlocks: string;
  blockHealthTitle: string;
  dbIntegrityTitle: string;
  dbIntegrityDesc: string;
  corruptedHeadersCount: string;
  checksumShieldTitle: string;
  antiBanShieldTitle: string;
  antiBanShieldDesc: string;
  fullyProtected: string;
  safeDeltaLimits: string;
  targetApkEngineTitle: string;
  targetApkEngine: string;
  targetApkDesc: string;
  nativePlayrixFormat: string;
  consoleOutputTitle: string;
  lastVerified: string;
  lastScan: string;
  rawInspectorTitle: string;
  rawSaveInspectorTitle: string;
  rawSaveInspectorDesc: string;
  copyJson: string;
  rawStructureSub: string;
  downloadRawPackage: string;
  downloadRawSave: string;

  // Android File Explorer
  androidExplorerTitle: string;
  androidFileManagerTitle: string;
  androidExplorerDesc: string;
  androidFileManagerDesc: string;
  downloadAllRestored: string;
  downloadAllRestoredFiles: string;
  restoredFilesCount: string;
  androidFilesLabel: string;
  packageInfoTitle: string;
  androidPackageInfoTitle: string;
  copyFileContent: string;
  copyCode: string;
  downloadFile: string;
  saveChanges: string;
  fileSavedSuccess: string;
  encodingInfo: string;
  allFilesRestoredReady: string;
  allOriginalFilesRestored: string;

  // Device Sync Modal
  directDeviceSyncTitle: string;
  directSyncModalTitle: string;
  directDeviceSyncDesc: string;
  directSyncModalDesc: string;
  deviceConnectedStatus: string;
  deviceConnected: string;
  deviceStatusConnected: string;
  targetPathLabel: string;
  targetPackagePathLabel: string;
  targetPathHelp: string;
  targetPackagePathDesc: string;
  activePayloadLabel: string;
  transferSuccessAlert: string;
  syncPushSuccess: string;
  pushSaveToDeviceBtn: string;
  sendSaveToDevice: string;
  transferringBtn: string;
  pushingSave: string;
  copyPath: string;
  pathCopied: string;
  downloadedFileName: string;

  // Settings & Auto-Save
  settings: string;
  settingsTitle: string;
  settingsDesc: string;
  autoSaveToggle: string;
  autoSaveToggleDesc: string;
  autoRollbackToggle: string;
  autoRollbackToggleDesc: string;
  silentExportToggle: string;
  silentExportToggleDesc: string;
  rollbackHistoryTitle: string;
  rollbackHistoryEmpty: string;
  restoreRollbackBtn: string;
  exportNedataBtn: string;
  autoSaveActiveBadge: string;
  autoSaveDisabledBadge: string;
  autoAdbSyncToggle: string;
  autoAdbSyncToggleDesc: string;

  // Android Bridge (USB / ADB)
  androidBridgeTitle: string;
  androidBridgeDesc: string;
  usbConnectedBadge: string;
  usbDisconnectedBadge: string;
  usbSyncingBadge: string;
  connectUsbBtn: string;
  disconnectUsbBtn: string;
  pushNedataNowBtn: string;
  pullNedataNowBtn: string;
  restartGameToggle: string;
  restartGameToggleDesc: string;
  realtimeUsbSyncBadge: string;
  connectedDeviceTitle: string;
  targetStoragePathTitle: string;
  deviceModel: string;
  androidVersionLabel: string;
  serialNumberLabel: string;
  batteryLevelLabel: string;
  usbSpeedLabel: string;
  transportModeLabel: string;
  packageStatusLabel: string;
  adbTerminalHeader: string;
  adbTerminalPlaceholder: string;
  clearTerminalBtn: string;
  runCmdBtn: string;
  quickAdbCommands: string;

  // Toast / System Notifications
  toastProfileUpdated: string;
  toastResourcesSynced: string;
  toastInventoryUpdated: string;
  toastBuildingsUpdated: string;
  toastSlotLoaded: string;
  toastBlueprintApplied: string;
  toastBackupExported: string;
  toastImportSuccess: string;
  toastCloudSyncSuccess: string;
  toastIntegrityRepaired: string;
  toastAutoSavedNedata: string;
  toastRollbackRestored: string;
  toastAdbSyncSuccess: string;
  toastAdbPullSuccess: string;
  invalidSaveFileFormat: string;
  confirmResetFactory: string;
  resetFactoryBtn: string;
  footerRights: string;
  footerCompliance: string;
  loadingEngine: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    appName: 'تاون شيب VIP',
    vipTier: 'عضوية VIP',
    gameVersion: 'الإصدار 38.0.1',
    antiBanActive: 'حماية ضد الحظر مفعّلة',
    activeSlot: 'خانة الحفظ النشطة',
    slotNumber: 'خانة',
    availableSlots: 'خانات النسخ المتاحة',
    slotsCount: 'خانات',
    level: 'المستوى',
    coins: 'عملة',
    deviceSync: 'مزامنة الهاتف',
    cloudSync: 'نسخ سحابي',
    syncing: 'جاري المزامنة...',
    exportSave: 'تصدير الحفظ',
    importSave: 'استيراد',
    edit: 'تعديل',

    tabOverview: 'لوحة التحكم',
    tabBackups: 'مواقع الحفظ والنسخ الاحتياطي',
    tabResources: 'العملات والموارد والخبرة',
    tabBarn: 'مستودع الحظيرة',
    tabBuildings: 'المصانع والمناجم والمباني',
    tabBlueprints: 'مخططات وتصاميم المدينة',
    tabIntegrity: 'الأمان والحماية ضد الحظر',
    tabAndroidFiles: 'ملفات الأندرويد و nedata.db',
    tabAndroidBridge: 'جسر أندرويد (USB / ADB)',

    vipMembership: 'عضوية VIP المستوى',
    antiBanProtected: 'محمي بدرع مكافحة الحظر',
    townNamePlaceholder: 'اسم المدينة',
    mayorNamePlaceholder: 'اسم العمدة',
    townName: 'اسم المدينة',
    mayorName: 'اسم العمدة',
    save: 'حفظ',
    cancel: 'إلغاء',
    mayor: 'العمدة',
    xpProgress: 'تقدم نقاط الخبرة XP إلى المستوى',
    currentLevel: 'مستوى المدينة الحالي',
    currentTownLevel: 'مستوى المدينة الحالي',
    editResources: 'تعديل الموارد',
    browseBlueprints: 'تحميل المخططات',
    loadBlueprints: 'تحميل المخططات',
    townshipCoins: 'عملات تاون شيب',
    safeUnlimitedBalance: 'رصيد آمن ومفتوح',
    safeAndUnlocked: 'رصيد آمن ومفتوح',
    tCashTitle: 'كاش T-Cash (أوراق مالية)',
    tCash: 'كاش T-Cash',
    instantBuildingBoost: 'تسريع البناء والقطارات الفوري',
    instantSpeedup: 'تسريع فوري',
    gemVault: 'خزنة الأحجار الكريمة',
    gemsVault: 'خزنة الأحجار الكريمة',
    gemVaultTitle: 'خزنة الأحجار الكريمة',
    ruby: 'ياقوت',
    rubyGem: 'ياقوت أحمر',
    emerald: 'زمرد',
    emeraldGem: 'زمرد أخضر',
    topaz: 'توباز',
    topazGem: 'توباز أصفر',
    amethyst: 'جمشت',
    amethystGem: 'جمشت بنفسجي',
    townPopulation: 'سكان المدينة',
    population: 'سكان المدينة',
    capacityMax: 'السعة',
    citizens: 'مواطن',
    barnCapacityTitle: 'مؤشر سعة الحظيرة والمستودع',
    barnStatus: 'سعة الحظيرة',
    itemsStoredAcrossDepts: 'عنصر مخزن عبر كافة الأقسام',
    itemsStoredAcross: 'عنصر مخزن عبر كافة الأقسام',
    manageBarn: 'إدارة الحظيرة',
    occupancyRate: 'نسبة الإشغال الحالية',
    currentOccupancy: 'نسبة الإشغال الحالية',
    barnNails: 'مسامير بناء الحظيرة',
    barnPaint: 'دلاء الطلاء الأحمر',
    barnHammers: 'المطارق الفولاذية',
    vipPrivilegesTitle: 'ميزات VIP الحصرية المفعّلة',
    vipPrivileges: 'ميزات VIP الحصرية المفعّلة',
    instantCropHarvest: 'حصاد المحاصيل الفوري 0s',
    instantHarvest: 'حصاد فوري',
    doubleFactoryOutput: 'مضاعفة إنتاج المصانع 2x',
    doubleProduction: 'مضاعفة الإنتاج',
    dealerMarketZeroWait: 'سوق التاجر بدون وقت انتظار',
    noMarketWait: 'بدون انتظار للسوق',
    antiBanChecksumActive: 'درع التوقيع المشفر ضد الحظر',
    antiBanShieldActive: 'درع التوقيع المشفر ضد الحظر',
    activeStatus: 'نشط',
    statusActive: 'نشط',
    enabledStatus: 'مفعّل',

    backupManagerTitle: 'مدير خانات الحفظ والنسخ الاحتياطي',
    backupManagerDesc: 'أنشئ لقطات حفظ واسترجاع فورية، انقل البيانات بين الأجهزة، أو صدّر ملفات الحفظ المشفرة.',
    createSnapshotBtn: 'إنشاء لقطة حفظ (Snapshot)',
    snapshotModalTitle: 'تجميد وحفظ حالة اللعبة الحالية',
    snapshotModalDesc: 'سيتم تجميد جميع العملات، الكاش، محتويات الحظيرة، ومستوى المدينة في خانة مستقلة.',
    snapshotPlaceholder: 'مثال: قبل سباق الريغاتا / تجهيزات توسيع المزرعة',
    freezeStateTitle: 'تجميد وحفظ حالة اللعبة الحالية',
    freezeStateDesc: 'سيتم تجميد جميع العملات، الكاش، محتويات الحظيرة، ومستوى المدينة في خانة مستقلة.',
    placeholderSnapshot: 'مثال: قبل سباق الريغاتا / تجهيزات توسيع المزرعة',
    confirmSave: 'تأكيد وحفظ',
    confirmAndSave: 'تأكيد وحفظ',
    confirmDeleteSlot: 'هل أنت متأكد من حذف خانة الحفظ هذه؟',
    activeSaveBadge: 'الحفظ النشط',
    townLevelLabel: 'مستوى المدينة',
    townLevel: 'مستوى المدينة',
    coinsLabel: 'العملات',
    tCashLabel: 'كاش T-Cash',
    fileSizeLabel: 'حجم الملف',
    fileSize: 'حجم الملف',
    cloudSynced: 'متزامن سحابياً',
    copied: 'تم النسخ',
    copyChecksum: 'نسخ التوقيع الرقمي Checksum',
    exportJson: 'تصدير',
    inspectSlot: 'فحص',
    inspect: 'فحص',
    deleteSlot: 'حذف هذه الخانة',
    saveInspectorTitle: 'فاحص خانة الحفظ',
    loadThisSave: 'تحميل هذا الحفظ',
    close: 'إغلاق',
    syncLogsTitle: 'سجل عمليات النسخ الاحتياطي والمزامنة',
    syncLogTitle: 'سجل عمليات النسخ الاحتياطي والمزامنة',
    oneSlotRequiredAlert: 'يجب الإبقاء على خانة حفظ نشطة واحدة على الأقل.',

    resourceEditorTitle: 'معدّل الموارد والعملات لتاون شيب',
    resourceEditorDesc: 'تعديل فوري لموارد ملف الحفظ مع مزامنة التوقيع التشفيري وحماية ضد الحظر.',
    safeMode: 'الوضع الآمن',
    safeModeLabel: 'الوضع الآمن',
    safeModeOn: 'مفعّل (موصى به)',
    safeModeOff: 'معطّل (بدون سقف)',
    fillVaultMax: 'ملء الخزنة بأقصى حد آمن',
    maxSafeCapBtn: 'ملء الخزنة بأقصى حد آمن',
    coinsDesc: 'تستخدم للمباني، الطرق والمحاصيل',
    tCashDesc: 'تسريع فوري وفتح الخصائص المميزة',
    quickSlider: 'شريط التمرير السريع',
    maxLabel: 'الحد الأقصى',
    maxCap: 'الحد الأقصى',
    landToolsTitle: 'أدوات توسيع أراضي المدينة',
    landExpansionToolsTitle: 'أدوات توسيع أراضي المدينة',
    buildingMaterialsTitle: 'مواد البناء وتوسيع الحظيرة والمستودع',
    axes: 'فؤوس تقطيع الخشب',
    axesLabel: 'فؤوس تقطيع الخشب',
    saws: 'مناشير الأشجار الكبيرة',
    sawsLabel: 'مناشير الأشجار الكبيرة',
    shovels: 'مجارف حفر وتسوية الأراضي',
    shovelsLabel: 'مجارف حفر وتسوية الأراضي',
    bricks: 'طوب أحمر',
    glass: 'ألواح زجاج',
    slabPlates: 'ألواح خرسانية',
    nails: 'مسامير الحظيرة',
    paint: 'طلاء الحظيرة',
    hammer: 'مطارق فولاذية',
    availableUnits: 'وحدة متوفرة',
    unitsAvailable: 'وحدة متوفرة',

    barnTitle: 'إدارة مخزون الحظيرة والمستودع',
    barnDesc: 'تحكم دقيق في كميات محاصيل المزرعة، منتجات المصانع، سبائك المنجم، ومقتنيات الفعاليات الحصرية VIP.',
    barnInventoryTitle: 'إدارة مخزون الحظيرة والمستودع',
    barnInventoryDesc: 'تحكم دقيق في كميات محاصيل المزرعة، منتجات المصانع، سبائك المنجم، ومقتنيات الفعاليات الحصرية VIP.',
    totalStoredItems: 'إجمالي العناصر المخزنة',
    totalBarnItems: 'إجمالي العناصر المخزنة',
    maxCapacity: 'السعة القصوى',
    totalResellValue: 'قيمة إعادة البيع الإجمالية',
    totalSellValue: 'قيمة إعادة البيع الإجمالية',
    barnCapacity: 'سعة الحظيرة',
    addBarnCapacity: '+500 سعة الحظيرة',
    addVipCapacity: '+2,000 سعة VIP',
    searchBarnPlaceholder: 'البحث عن محصول، منتج، سبيكة، تذكرة...',
    batchActionFor: 'إجراء جماعي سريع لقسم',
    quickBatchAction: 'إجراء جماعي سريع لقسم',
    add50ToAllShown: '+50 لجميع العناصر المعروضة',
    add50All: '+50 لجميع العناصر المعروضة',
    catAll: 'الكل',
    catCrops: 'المحاصيل الزراعية',
    catFactory: 'منتجات المصانع',
    catFactories: 'منتجات المصانع',
    catAnimals: 'منتجات الحيوانات',
    catMining: 'التعدين والجزر',
    catSpecial: 'خاص والفعاليات',
    quantity: 'الكمية',
    sellPrice: 'سعر البيع',
    rarityCommon: 'عادي',
    rarityRare: 'نادر',
    rarityEpic: 'ملحمي',
    rarityVip: 'VIP مميز',

    buildingsTitle: 'إدارة مصانع ومنشآت البنية التحتية',
    buildingsDesc: 'ترقية المصانع، تسريع شبكة القطارات، توسيع المنجم العميق، والوصول لأقصى مستوى لكافة المباني.',
    buildingsManagerTitle: 'إدارة مصانع ومنشآت البنية التحتية',
    buildingsManagerDesc: 'ترقية المصانع، تسريع شبكة القطارات، توسيع المنجم العميق، والوصول لأقصى مستوى لكافة المباني.',
    maxAllVipBtn: 'ترقية الكل للحد الأقصى (VIP)',
    maxAllBuildingsBtn: 'ترقية الكل للحد الأقصى (VIP)',
    filterAllBuildings: 'كافة المنشآت',
    filterFactories: 'المصانع الإنتاجية',
    filterInfrastructure: 'البنية التحتية والقطارات',
    filterCommunity: 'المباني المجتمعية',
    filterSpecial: 'المنشآت الخاصة وحديقة الحيوان',
    searchBuildingsPlaceholder: 'تصفية المباني والمنشآت...',
    filterBuildingsPlaceholder: 'تصفية المباني والمنشآت...',
    typeAll: 'كافة المنشآت',
    typeFactory: 'مصنع إنتاجي',
    typeInfrastructure: 'بنية تحتية',
    typeCommunity: 'مجتمعي',
    typeSpecial: 'منشأة خاصة',
    unlockLevel: 'الفتح: المستوى',
    maxLevelBadge: 'الحد الأقصى (Max)',
    maxStatus: 'الحد الأقصى (Max)',
    instantUpgradeBtn: 'ترقية فورية',
    instantUpgrade: 'ترقية فورية',

    blueprintsTitle: 'المخططات الهندسية وتصميم تقسيم المدينة',
    blueprintsDesc: 'التبديل الفوري بين تصاميم المزارع المحسنة، ناطحات السحاب والمجمعات الحضرية، والمنتجعات الساحلية المائية.',
    activeBlueprintLabel: 'المخطط الهندسي النشط',
    activeBlueprint: 'المخطط الهندسي النشط',
    spaceEfficiency: 'كثافة واستغلال المساحة',
    perfectRating: 'مثالي 100%',
    spaceEfficiencyVal: 'مثالي 100%',
    gridMapPreview: 'معاينة خريطة التوزيع الهندسي للأحياء',
    gridPreviewMap: 'معاينة خريطة التوزيع الهندسي للأحياء',
    matrixLabel: 'المصفوفة',
    gridMatrix: 'المصفوفة',
    buildingsCountLabel: 'مبنى',
    farms: 'مزارع',
    factories: 'مصانع',
    houses: 'مبانٍ سكنية',
    roads: 'شبكة طرق',
    waterChannels: 'قنوات مائية',
    legendFarms: '🌾 مزارع',
    legendFactories: '🏭 مصانع',
    legendHouses: '🏢 مبانٍ سكنية',
    legendRoads: '🛣️ شبكة طرق',
    legendWaterways: '🌊 قنوات مائية',
    applyBlueprintWarning: 'سيؤدي تطبيق هذا المخطط إلى إعادة ترتيب إحداثيات ومواقع جميع المصانع، المزارع والمباني السكنية.',
    applyBlueprintDesc: 'سيؤدي تطبيق هذا المخطط إلى إعادة ترتيب إحداثيات ومواقع جميع المصانع، المزارع والمباني السكنية.',
    applyBlueprintBtn: 'تطبيق المخطط على ملف الحفظ',
    appliedSuccessBtn: 'تم التطبيق على المدينة بنجاح!',
    blueprintAppliedSuccess: 'تم التطبيق على المدينة بنجاح!',

    integrityTitle: 'فاحص سلامة البيانات والتشفير والحماية ضد الحظر',
    integrityDesc: 'فحص عميق لملف nedata.db، ومطابقة التوقيع التشفيري Checksum، وتأمين حساب اللعبة ضد الحظر.',
    runDeepScan: 'تشغيل الفحص العميق للسلامة',
    scanningBlocks: 'جارٍ فحص الكتل...',
    blockHealthTitle: 'سلامة كتل قاعدة البيانات',
    dbIntegrityTitle: 'سلامة كتل قاعدة البيانات',
    dbIntegrityDesc: 'تم اكتشاف 0 ترويسات تالفة (سليم 100%)',
    corruptedHeadersCount: 'تم اكتشاف 0 ترويسات تالفة (سليم 100%)',
    checksumShieldTitle: 'درع التوقيع والحماية ضد الحظر',
    antiBanShieldTitle: 'درع التوقيع والحماية ضد الحظر',
    antiBanShieldDesc: 'محددات الأمان والمطابقة مفعلة',
    fullyProtected: 'محمي بالكامل',
    safeDeltaLimits: 'محددات الأمان والمطابقة مفعلة',
    targetApkEngineTitle: 'محرك حزمة APK المستهدفة',
    targetApkEngine: 'محرك حزمة APK المستهدفة',
    targetApkDesc: 'تنسيق Playrix Township الأصلي',
    nativePlayrixFormat: 'تنسيق Playrix Township الأصلي',
    consoleOutputTitle: 'مخرجات وحدة التحكم وسجل الفحص',
    lastVerified: 'آخر فحص',
    lastScan: 'آخر فحص',
    rawInspectorTitle: 'مستعرض كود ملف الحفظ الخام',
    rawSaveInspectorTitle: 'مستعرض كود ملف الحفظ الخام',
    rawSaveInspectorDesc: 'الهيكل المشفر والبيانات المفكوكة للموقع النشط',
    copyJson: 'نسخ JSON',
    rawStructureSub: 'الهيكل المشفر والبيانات المفكوكة للموقع النشط',
    downloadRawPackage: 'تحميل حزمة ملف الحفظ الخام',
    downloadRawSave: 'تحميل حزمة ملف الحفظ الخام',

    androidExplorerTitle: 'مستعرض حزمة أندرويد وملفات nedata.db المستعادة',
    androidFileManagerTitle: 'مستعرض حزمة أندرويد وملفات nedata.db المستعادة',
    androidExplorerDesc: 'استعراض، تعديل وتحميل كافة ملفات الأندرويد المسترجعة، AndroidManifest.xml، وقاعدة بيانات الحفظ وخصائص الحزمة.',
    androidFileManagerDesc: 'استعراض، تعديل وتحميل كافة ملفات الأندرويد المسترجعة، AndroidManifest.xml، وقاعدة بيانات الحفظ وخصائص الحزمة.',
    downloadAllRestored: 'تحميل كافة الملفات المستعادة',
    downloadAllRestoredFiles: 'تحميل كافة الملفات المستعادة',
    restoredFilesCount: 'ملفات الأندرويد والحفظ المسترجعة',
    androidFilesLabel: 'ملفات الأندرويد والحفظ المسترجعة',
    packageInfoTitle: 'معلومات حزمة أندرويد لتاون شيب',
    androidPackageInfoTitle: 'معلومات حزمة أندرويد لتاون شيب',
    copyFileContent: 'نسخ الكود',
    copyCode: 'نسخ الكود',
    downloadFile: 'تحميل',
    saveChanges: 'حفظ التعديلات',
    fileSavedSuccess: 'تم حفظ الملف بنجاح! تم تطبيق التعديلات على بيئة التشغيل الفورية.',
    encodingInfo: 'الترميز: UTF-8',
    allFilesRestoredReady: 'كافة ملفات أندرويد الأصلية مستعادة وجاهزة للاستخدام',
    allOriginalFilesRestored: 'كافة ملفات أندرويد الأصلية مستعادة وجاهزة للاستخدام',

    directDeviceSyncTitle: 'المزامنة المباشرة مع هاتف أندرويد',
    directSyncModalTitle: 'المزامنة المباشرة مع هاتف أندرويد',
    directDeviceSyncDesc: 'ربط وحقن ملف الحفظ مع ذاكرة تخزين جهاز الأندرويد وخدمة BackupService',
    directSyncModalDesc: 'ربط وحقن ملف الحفظ مع ذاكرة تخزين جهاز الأندرويد وخدمة BackupService',
    deviceConnectedStatus: 'متصل بنجاح',
    deviceConnected: 'الجهاز المتصل',
    deviceStatusConnected: 'متصل بنجاح',
    targetPathLabel: 'مسار حزمة تاون شيب المستهدفة على الهاتف',
    targetPackagePathLabel: 'مسار حزمة تاون شيب المستهدفة على الهاتف',
    targetPathHelp: 'المسار الفعلي لقاعدة بيانات nedata.db ومزامنة التوقيع التشفيري للعبة Playrix Township.',
    targetPackagePathDesc: 'المسار الفعلي لقاعدة بيانات nedata.db ومزامنة التوقيع التشفيري للعبة Playrix Township.',
    activePayloadLabel: 'ملف الحفظ النشط',
    transferSuccessAlert: 'تم تجهيز وتنزيل ملف الحفظ بنجاح! يرجى نسخه ولصقه يدوياً في مسار اللعبة: /storage/emulated/0/Android/data/com.playrix.township/files/save/',
    syncPushSuccess: 'تم تجهيز وتنزيل ملف الحفظ بنجاح! يرجى نسخه ولصقه يدوياً في مسار اللعبة: /storage/emulated/0/Android/data/com.playrix.township/files/save/',
    pushSaveToDeviceBtn: 'إرسال الحفظ إلى الهاتف',
    sendSaveToDevice: 'إرسال الحفظ إلى الهاتف',
    transferringBtn: 'جارٍ تجهيز وتنزيل الحفظ...',
    pushingSave: 'جارٍ تجهيز وتنزيل الحفظ...',
    copyPath: 'نسخ المسار',
    pathCopied: 'تم نسخ المسار بنجاح!',
    downloadedFileName: 'اسم الملف:',

    // Settings & Auto-Save
    settings: 'الإعدادات',
    settingsTitle: 'إعدادات الحفظ والأمان التلقائي',
    settingsDesc: 'إدارة الحفظ التلقائي ونقاط التراجع والتصدير الفوري لملف nedata.db في الخلفية',
    autoSaveToggle: 'الحفظ والتصدير التلقائي (Auto-Save)',
    autoSaveToggleDesc: 'تصدير ملف nedata.db تلقائياً في الخلفية عند كل تعديل باللعبة',
    autoRollbackToggle: 'إنشاء نقاط تراجع فورية (Immediate Rollback Points)',
    autoRollbackToggleDesc: 'حفظ لقطة فورية قبل تطبيق أي تعديل هيكلي للرجوع إليها في أي وقت بضغطة واحدة',
    silentExportToggle: 'التصدير الصامت للخلفية',
    silentExportToggleDesc: 'تنزيل وحفظ التحديثات بدون مقاطعة أو نوافذ منبثقة متكررة',
    rollbackHistoryTitle: 'سجل نقاط التراجع الفورية (Rollback Checkpoints)',
    rollbackHistoryEmpty: 'لا توجد نقاط تراجع مسجلة حتى الآن. سيتم إنشاؤها تلقائياً مع كل تعديل.',
    restoreRollbackBtn: 'استرجاع هذه النقطة',
    exportNedataBtn: 'تصدير nedata.db الآن',
    autoSaveActiveBadge: 'الحفظ التلقائي: مفعّل',
    autoSaveDisabledBadge: 'الحفظ التلقائي: معطل',
    autoAdbSyncToggle: 'المزامنة الفورية عبر USB/ADB',
    autoAdbSyncToggleDesc: 'تمرير ملف nedata.db تلقائياً إلى ذاكرة الهاتف الداخلي عند كل تعديل باللعبة',

    // Android Bridge (USB / ADB)
    androidBridgeTitle: 'جسر أندرويد للاتصال المباشر (USB / ADB)',
    androidBridgeDesc: 'مزامنة وتمرير ملف nedata.db بشكل فوري ومباشر إلى ذاكرة التخزين الداخلية للجهاز المتصل عبر منفذ USB',
    usbConnectedBadge: 'جسر USB: متصل',
    usbDisconnectedBadge: 'جسر USB: غير متصل',
    usbSyncingBadge: 'جارِ النقل عبر USB...',
    connectUsbBtn: 'توصيل عبر USB / ADB',
    disconnectUsbBtn: 'فصل اتصال USB',
    pushNedataNowBtn: 'تمرير nedata.db للهاتف الآن (USB Push)',
    pullNedataNowBtn: 'سحب nedata.db من الهاتف (USB Pull)',
    restartGameToggle: 'إعادة تشغيل لعبة Township تلقائياً بعد التمرير',
    restartGameToggleDesc: 'تنفيذ force-stop ثم إعادة تشغيل اللعبة فوراً لتطبيق التعديلات الحية',
    realtimeUsbSyncBadge: 'تحديثات اللعبة الفورية: مفعّلة',
    connectedDeviceTitle: 'معلومات الجهاز المتصل',
    targetStoragePathTitle: 'مسار التخزين الداخلي المستهدف',
    deviceModel: 'موديل الجهاز',
    androidVersionLabel: 'إصدار أندرويد',
    serialNumberLabel: 'الرقم التسلسلي (ADB ID)',
    batteryLevelLabel: 'نسبة البطارية',
    usbSpeedLabel: 'سرعة منفذ USB',
    transportModeLabel: 'بروتوكول النقل',
    packageStatusLabel: 'حزمة Township',
    adbTerminalHeader: 'موجه أوامر ADB وسجل النقل المباشر',
    adbTerminalPlaceholder: 'اكتب أمر ADB هنا (مثال: adb shell ls -l /data/data/com.playrix.township/files/save/)...',
    clearTerminalBtn: 'مسح السجل',
    runCmdBtn: 'تنفيذ',
    quickAdbCommands: 'أوامر سريعة',

    toastProfileUpdated: 'تم تحديث الملف التعريفي للمدينة بنجاح!',
    toastResourcesSynced: 'تمت مزامنة العملات والموارد مع ملف الحفظ',
    toastInventoryUpdated: 'تم تحديث مخزون الحظيرة بنجاح!',
    toastBuildingsUpdated: 'تم تحديث مستويات المباني والمصانع بنجاح!',
    toastSlotLoaded: 'تم تحميل وتفعيل موقع الحفظ',
    toastBlueprintApplied: 'تم تطبيق المخطط على المدينة بنجاح!',
    toastBackupExported: 'تم تحميل نسخة الحفظ الاحتياطية إلى جهازك',
    toastImportSuccess: 'تم استيراد وتفعيل ملف الحفظ بنجاح!',
    toastCloudSyncSuccess: 'اكتملت مزامنة الحفظ السحابي بنجاح!',
    toastIntegrityRepaired: 'تم تطبيق إصلاحات السلامة على قاعدة بيانات الحفظ',
    toastAutoSavedNedata: 'تم الحفظ والتصدير التلقائي لـ nedata.db وإنشاء نقطة تراجع',
    toastRollbackRestored: 'تمت استعادة نقطة الحفظ السابقة بنجاح!',
    toastAdbSyncSuccess: 'تمت مزامنة وتمرير ملف nedata.db إلى هاتف أندرويد بنجاح عبر USB Bridge!',
    toastAdbPullSuccess: 'تم سحب ملف nedata.db الحي من هاتف أندرويد بنجاح!',
    invalidSaveFileFormat: 'صيغة ملف الحفظ غير صالحة لـ Township VIP.',
    confirmResetFactory: 'هل أنت متأكد من إعادة ضبط كافة البيانات واستعادة الملف الافتراضي الأصلي؟',
    resetFactoryBtn: 'استعادة ضبط المصنع الافتراضي',
    footerRights: 'مجموعة تاون شيب VIP لإدارة الحفظ والنسخ الاحتياطي',
    footerCompliance: 'متوافق مع إصدار Playrix Township v38.0.1 (تحديث أغسطس 2026)',
    loadingEngine: 'جارٍ تحميل محرك حفظ تاون شيب VIP...',
  },
  en: {
    appName: 'Township VIP Suite',
    vipTier: 'VIP Tier',
    gameVersion: 'v38.0.1 Edition',
    antiBanActive: 'Anti-Ban Shield Active',
    activeSlot: 'Active Save Slot',
    slotNumber: 'Slot',
    availableSlots: 'Available Save Slots',
    slotsCount: 'slots',
    level: 'Level',
    coins: 'coins',
    deviceSync: 'Device Sync',
    cloudSync: 'Cloud Sync',
    syncing: 'Syncing...',
    exportSave: 'Export Save',
    importSave: 'Import Save',
    edit: 'Edit',

    tabOverview: 'Dashboard',
    tabBackups: 'Save Slots & Backups',
    tabResources: 'Currency & Materials',
    tabBarn: 'Barn Inventory',
    tabBuildings: 'Factories & Buildings',
    tabBlueprints: 'Layout Blueprints',
    tabIntegrity: 'Security & Anti-Ban',
    tabAndroidFiles: 'Android & nedata.db Files',
    tabAndroidBridge: 'Android Bridge (USB / ADB)',

    vipMembership: 'VIP Membership Level',
    antiBanProtected: 'Protected by Anti-Ban Shield',
    townNamePlaceholder: 'Town Name',
    mayorNamePlaceholder: 'Mayor Name',
    townName: 'Town Name',
    mayorName: 'Mayor Name',
    save: 'Save',
    cancel: 'Cancel',
    mayor: 'Mayor',
    xpProgress: 'XP Progress to Level',
    currentLevel: 'Current Town Level',
    currentTownLevel: 'Current Town Level',
    editResources: 'Edit Resources',
    browseBlueprints: 'Browse Blueprints',
    loadBlueprints: 'Load Blueprints',
    townshipCoins: 'Township Coins',
    safeUnlimitedBalance: 'Safe & Verified Balance',
    safeAndUnlocked: 'Safe & Verified Balance',
    tCashTitle: 'T-Cash (Banknotes)',
    tCash: 'T-Cash',
    instantBuildingBoost: 'Instant Factory & Train Acceleration',
    instantSpeedup: 'Instant Speedup',
    gemVault: 'Gemstone Vault',
    gemsVault: 'Gemstone Vault',
    gemVaultTitle: 'Gemstone Vault',
    ruby: 'Ruby',
    rubyGem: 'Ruby',
    emerald: 'Emerald',
    emeraldGem: 'Emerald',
    topaz: 'Topaz',
    topazGem: 'Topaz',
    amethyst: 'Amethyst',
    amethystGem: 'Amethyst',
    townPopulation: 'Town Population',
    population: 'Town Population',
    capacityMax: 'Capacity',
    citizens: 'citizens',
    barnCapacityTitle: 'Barn & Warehouse Capacity Indicator',
    barnStatus: 'Barn Capacity',
    itemsStoredAcrossDepts: 'items stored across all departments',
    itemsStoredAcross: 'items stored across all departments',
    manageBarn: 'Manage Barn',
    occupancyRate: 'Current Occupancy',
    currentOccupancy: 'Current Occupancy',
    barnNails: 'Barn Nails',
    barnPaint: 'Red Paint Buckets',
    barnHammers: 'Steel Hammers',
    vipPrivilegesTitle: 'Active VIP Privileges',
    vipPrivileges: 'Active VIP Privileges',
    instantCropHarvest: 'Instant Crop Harvest (0s)',
    instantHarvest: 'Instant Harvest',
    doubleFactoryOutput: '2x Factory Production Output',
    doubleProduction: '2x Production',
    dealerMarketZeroWait: 'Zero-Cooldown Dealer Market',
    noMarketWait: 'No Market Wait',
    antiBanChecksumActive: 'Anti-Ban Encrypted Signature Shield',
    antiBanShieldActive: 'Anti-Ban Encrypted Signature Shield',
    activeStatus: 'Active',
    statusActive: 'Active',
    enabledStatus: 'Enabled',

    backupManagerTitle: 'Save Slots & Snapshot Manager',
    backupManagerDesc: 'Create instant save snapshots, restore state across devices, and export encrypted JSON backups.',
    createSnapshotBtn: 'Create Save Snapshot',
    snapshotModalTitle: 'Freeze & Snapshot Live Town State',
    snapshotModalDesc: 'Freezes all coins, T-cash, barn vault contents, and town level into a standalone slot.',
    snapshotPlaceholder: 'e.g., Pre-Regatta Race / Farm Expansion Prep',
    freezeStateTitle: 'Freeze & Snapshot Live Town State',
    freezeStateDesc: 'Freezes all coins, T-cash, barn vault contents, and town level into a standalone slot.',
    placeholderSnapshot: 'e.g., Pre-Regatta Race / Farm Expansion Prep',
    confirmSave: 'Confirm & Snapshot',
    confirmAndSave: 'Confirm & Snapshot',
    confirmDeleteSlot: 'Are you sure you want to delete this save slot?',
    activeSaveBadge: 'Active Slot',
    townLevelLabel: 'Town Level',
    townLevel: 'Town Level',
    coinsLabel: 'Coins',
    tCashLabel: 'T-Cash',
    fileSizeLabel: 'File Size',
    fileSize: 'File Size',
    cloudSynced: 'Cloud Synced',
    copied: 'Copied',
    copyChecksum: 'Copy Checksum Hash',
    exportJson: 'Export',
    inspectSlot: 'Inspect',
    inspect: 'Inspect',
    deleteSlot: 'Delete Slot',
    saveInspectorTitle: 'Save Slot Inspector',
    loadThisSave: 'Load This Save',
    close: 'Close',
    syncLogsTitle: 'Backup & Cloud Synchronization Logs',
    syncLogTitle: 'Backup & Cloud Synchronization Logs',
    oneSlotRequiredAlert: 'At least one active save slot must be maintained.',

    resourceEditorTitle: 'Township Resource & Currency Editor',
    resourceEditorDesc: 'Real-time resource editing with instant checksum calculation and anti-ban safeguards.',
    safeMode: 'Safe Mode',
    safeModeLabel: 'Safe Mode',
    safeModeOn: 'Enabled (Recommended)',
    safeModeOff: 'Disabled (No Cap)',
    fillVaultMax: 'Fill Vault to Safe Maximum',
    maxSafeCapBtn: 'Fill Vault to Safe Maximum',
    coinsDesc: 'Used for buildings, roads, and crop expansions',
    tCashDesc: 'Instant boost & unlock exclusive town assets',
    quickSlider: 'Quick Range Slider',
    maxLabel: 'Maximum Cap',
    maxCap: 'Maximum Cap',
    landToolsTitle: 'Land Expansion Tools',
    landExpansionToolsTitle: 'Land Expansion Tools',
    buildingMaterialsTitle: 'Building Materials & Barn Expansion',
    axes: 'Woodcutting Axes',
    axesLabel: 'Woodcutting Axes',
    saws: 'Large Tree Saws',
    sawsLabel: 'Large Tree Saws',
    shovels: 'Land Leveling Shovels',
    shovelsLabel: 'Land Leveling Shovels',
    bricks: 'Red Bricks',
    glass: 'Glass Panes',
    slabPlates: 'Concrete Slab Plates',
    nails: 'Barn Nails',
    paint: 'Barn Red Paint',
    hammer: 'Steel Hammers',
    availableUnits: 'units available',
    unitsAvailable: 'units available',

    barnTitle: 'Barn & Warehouse Inventory Manager',
    barnDesc: 'Fine-tuned stock control for crops, factory goods, mining ingots, and exclusive VIP regatta artifacts.',
    barnInventoryTitle: 'Barn & Warehouse Inventory Manager',
    barnInventoryDesc: 'Fine-tuned stock control for crops, factory goods, mining ingots, and exclusive VIP regatta artifacts.',
    totalStoredItems: 'Total Stored Items',
    totalBarnItems: 'Total Stored Items',
    maxCapacity: 'Max Capacity',
    totalResellValue: 'Total Resale Value',
    totalSellValue: 'Total Resale Value',
    barnCapacity: 'Barn Space',
    addBarnCapacity: '+500 Barn Space',
    addVipCapacity: '+2,000 VIP Space',
    searchBarnPlaceholder: 'Search crops, goods, ingots, tickets...',
    batchActionFor: 'Quick batch top-up for',
    quickBatchAction: 'Quick batch top-up for',
    add50ToAllShown: '+50 to all displayed items',
    add50All: '+50 to all displayed items',
    catAll: 'All',
    catCrops: 'Crops',
    catFactory: 'Factory Goods',
    catFactories: 'Factory Goods',
    catAnimals: 'Animal Products',
    catMining: 'Mining & Islands',
    catSpecial: 'Special & Events',
    quantity: 'Quantity',
    sellPrice: 'Resale Price',
    rarityCommon: 'Common',
    rarityRare: 'Rare',
    rarityEpic: 'Epic',
    rarityVip: 'VIP Exclusive',

    buildingsTitle: 'Factory & Infrastructure Management',
    buildingsDesc: 'Upgrade factories, speed up freight trains, deepen the gold mine, and max out all community structures.',
    buildingsManagerTitle: 'Factory & Infrastructure Management',
    buildingsManagerDesc: 'Upgrade factories, speed up freight trains, deepen the gold mine, and max out all community structures.',
    maxAllVipBtn: 'Max All Structures (VIP)',
    maxAllBuildingsBtn: 'Max All Structures (VIP)',
    filterAllBuildings: 'All Buildings',
    filterFactories: 'Production Factories',
    filterInfrastructure: 'Infrastructure & Trains',
    filterCommunity: 'Community Buildings',
    filterSpecial: 'Special & Safari Zoo',
    searchBuildingsPlaceholder: 'Filter buildings and structures...',
    filterBuildingsPlaceholder: 'Filter buildings and structures...',
    typeAll: 'All Buildings',
    typeFactory: 'Factory',
    typeInfrastructure: 'Infrastructure',
    typeCommunity: 'Community',
    typeSpecial: 'Special Facility',
    unlockLevel: 'Unlock: Level',
    maxLevelBadge: 'Max Level',
    maxStatus: 'Max Level',
    instantUpgradeBtn: 'Instant Upgrade',
    instantUpgrade: 'Instant Upgrade',

    blueprintsTitle: 'Town Planning & Architectural Blueprints',
    blueprintsDesc: 'Switch effortlessly between optimized high-yield farm zoning, modern metropolis layouts, and yacht resorts.',
    activeBlueprintLabel: 'Active Blueprint',
    activeBlueprint: 'Active Blueprint',
    spaceEfficiency: 'Space Efficiency',
    perfectRating: '100% Optimal',
    spaceEfficiencyVal: '100% Optimal',
    gridMapPreview: 'District Grid Layout Preview',
    gridPreviewMap: 'District Grid Layout Preview',
    matrixLabel: 'Matrix',
    gridMatrix: 'Matrix',
    buildingsCountLabel: 'buildings',
    farms: 'Farms',
    factories: 'Factories',
    houses: 'Residential',
    roads: 'Roads',
    waterChannels: 'Canals',
    legendFarms: '🌾 Farms',
    legendFactories: '🏭 Factories',
    legendHouses: '🏢 Residential',
    legendRoads: '🛣️ Roads',
    legendWaterways: '🌊 Canals',
    applyBlueprintWarning: 'Applying this blueprint will recalculate and reorganize the coordinates of all town structures.',
    applyBlueprintDesc: 'Applying this blueprint will recalculate and reorganize the coordinates of all town structures.',
    applyBlueprintBtn: 'Apply Blueprint to Save File',
    appliedSuccessBtn: 'Applied to Town Successfully!',
    blueprintAppliedSuccess: 'Applied to Town Successfully!',

    integrityTitle: 'Database Integrity & Anti-Ban Validator',
    integrityDesc: 'Deep inspection of nedata.db block mapping, CRC checksum validation, and game profile safety.',
    runDeepScan: 'Run Deep Integrity Scan',
    scanningBlocks: 'Scanning Blocks...',
    blockHealthTitle: 'Database Block Health',
    dbIntegrityTitle: 'Database Block Health',
    dbIntegrityDesc: '0 corrupted headers detected (100% Clean)',
    corruptedHeadersCount: '0 corrupted headers detected (100% Clean)',
    checksumShieldTitle: 'Anti-Ban Checksum Shield',
    antiBanShieldTitle: 'Anti-Ban Checksum Shield',
    antiBanShieldDesc: 'Safe bounds & validation enforced',
    fullyProtected: 'Fully Protected',
    safeDeltaLimits: 'Safe bounds & validation enforced',
    targetApkEngineTitle: 'Target APK Engine',
    targetApkEngine: 'Target APK Engine',
    targetApkDesc: 'Playrix Township Native Format',
    nativePlayrixFormat: 'Playrix Township Native Format',
    consoleOutputTitle: 'Integrity Console & Diagnostic Logs',
    lastVerified: 'Last Verified',
    lastScan: 'Last Verified',
    rawInspectorTitle: 'Raw Save Code Inspector',
    rawSaveInspectorTitle: 'Raw Save Code Inspector',
    rawSaveInspectorDesc: 'Decrypted structure and payload for active slot',
    copyJson: 'Copy JSON',
    rawStructureSub: 'Decrypted structure and payload for active slot',
    downloadRawPackage: 'Download Raw Save Package',
    downloadRawSave: 'Download Raw Save Package',

    androidExplorerTitle: 'Android Package & nedata.db File Explorer',
    androidFileManagerTitle: 'Android Package & nedata.db File Explorer',
    androidExplorerDesc: 'Browse, edit, and download all restored Android files, AndroidManifest.xml, nedata.db database, and build properties.',
    androidFileManagerDesc: 'Browse, edit, and download all restored Android files, AndroidManifest.xml, nedata.db database, and build properties.',
    downloadAllRestored: 'Download All Restored Files',
    downloadAllRestoredFiles: 'Download All Restored Files',
    restoredFilesCount: 'Restored Android & Save Files',
    androidFilesLabel: 'Restored Android & Save Files',
    packageInfoTitle: 'Township Android Package Info',
    androidPackageInfoTitle: 'Township Android Package Info',
    copyFileContent: 'Copy Code',
    copyCode: 'Copy Code',
    downloadFile: 'Download',
    saveChanges: 'Save Changes',
    fileSavedSuccess: 'File saved successfully! Live environment changes updated.',
    encodingInfo: 'Encoding: UTF-8',
    allFilesRestoredReady: 'All original Android files restored & ready for deployment',
    allOriginalFilesRestored: 'All original Android files restored & ready for deployment',

    directDeviceSyncTitle: 'Direct Android Device Sync',
    directSyncModalTitle: 'Direct Android Device Sync',
    directDeviceSyncDesc: 'Bridge Township save state with your Android storage / APK BackupService',
    directSyncModalDesc: 'Bridge Township save state with your Android storage / APK BackupService',
    deviceConnectedStatus: 'Connected',
    deviceConnected: 'Connected Device',
    deviceStatusConnected: 'Connected',
    targetPathLabel: 'Township Target Package Path',
    targetPackagePathLabel: 'Township Target Package Path',
    targetPathHelp: 'Target path for Playrix Township nedata.db save database and checksum injection.',
    targetPackagePathDesc: 'Target path for Playrix Township nedata.db save database and checksum injection.',
    activePayloadLabel: 'Active Payload',
    transferSuccessAlert: 'Save file downloaded successfully! Please copy and paste it into the game path: /storage/emulated/0/Android/data/com.playrix.township/files/save/',
    syncPushSuccess: 'Save file downloaded successfully! Please copy and paste it into the game path: /storage/emulated/0/Android/data/com.playrix.township/files/save/',
    pushSaveToDeviceBtn: 'Push Save to Device',
    sendSaveToDevice: 'Push Save to Device',
    transferringBtn: 'Preparing & Downloading...',
    pushingSave: 'Preparing & Downloading...',
    copyPath: 'Copy Path',
    pathCopied: 'Path copied successfully!',
    downloadedFileName: 'Downloaded File:',

    // Settings & Auto-Save
    settings: 'Settings',
    settingsTitle: 'Automated Save & Security Settings',
    settingsDesc: 'Configure automated background nedata.db exports, instant rollback points, and safe sync',
    autoSaveToggle: 'Auto-Save & Background Export',
    autoSaveToggleDesc: 'Forces a background export of the nedata.db file every time a modification is made',
    autoRollbackToggle: 'Immediate Pre-Modification Rollback Points',
    autoRollbackToggleDesc: 'Ensures an immediate rollback checkpoint is always created before any structural changes occur',
    silentExportToggle: 'Silent Background Processing',
    silentExportToggleDesc: 'Download and cache database updates in background without repetitive notification alerts',
    rollbackHistoryTitle: 'Immediate Rollback Checkpoints',
    rollbackHistoryEmpty: 'No rollback checkpoints created yet. They will be generated automatically before each edit.',
    restoreRollbackBtn: 'Rollback to this state',
    exportNedataBtn: 'Export nedata.db Now',
    autoSaveActiveBadge: 'Auto-Save: ACTIVE',
    autoSaveDisabledBadge: 'Auto-Save: OFF',
    autoAdbSyncToggle: 'Real-Time USB/ADB Direct Push',
    autoAdbSyncToggleDesc: 'Directly syncs local nedata.db to connected device internal storage upon every modification',

    // Android Bridge (USB / ADB)
    androidBridgeTitle: 'Android USB / ADB Real-Time Bridge',
    androidBridgeDesc: 'Direct real-time synchronization between web save state and connected Android device internal storage (/storage/emulated/0/.../nedata.db)',
    usbConnectedBadge: 'USB Bridge: CONNECTED',
    usbDisconnectedBadge: 'USB Bridge: DISCONNECTED',
    usbSyncingBadge: 'Syncing over USB...',
    connectUsbBtn: 'Connect Device (USB/ADB)',
    disconnectUsbBtn: 'Disconnect USB',
    pushNedataNowBtn: 'Push nedata.db to Device',
    pullNedataNowBtn: 'Pull nedata.db from Device',
    restartGameToggle: 'Auto-restart Township process upon sync',
    restartGameToggleDesc: 'Executes force-stop followed by instant activity restart to apply live save changes without rebooting phone',
    realtimeUsbSyncBadge: 'Real-Time Game Updates: ON',
    connectedDeviceTitle: 'Connected Device Hardware & ADB',
    targetStoragePathTitle: 'Target Internal Storage Path',
    deviceModel: 'Device Model',
    androidVersionLabel: 'Android OS Version',
    serialNumberLabel: 'ADB Serial Identifier',
    batteryLevelLabel: 'Battery Level',
    usbSpeedLabel: 'USB Connection Speed',
    transportModeLabel: 'Transport Protocol',
    packageStatusLabel: 'Township Package Status',
    adbTerminalHeader: 'Interactive ADB Terminal & Live Logcat',
    adbTerminalPlaceholder: 'Type ADB command (e.g., adb shell ls -l /data/data/com.playrix.township/files/save/)...',
    clearTerminalBtn: 'Clear Log',
    runCmdBtn: 'Execute',
    quickAdbCommands: 'Quick ADB Actions',

    toastProfileUpdated: 'Town profile updated successfully!',
    toastResourcesSynced: 'Currencies and resources synced with save file',
    toastInventoryUpdated: 'Barn inventory updated successfully!',
    toastBuildingsUpdated: 'Building and factory levels updated successfully!',
    toastSlotLoaded: 'Loaded and activated save slot',
    toastBlueprintApplied: 'Layout blueprint applied to town successfully!',
    toastBackupExported: 'Save backup JSON downloaded to your computer',
    toastImportSuccess: 'Save file imported and activated successfully!',
    toastCloudSyncSuccess: 'Cloud save synchronization completed successfully!',
    toastIntegrityRepaired: 'Integrity repairs applied to save database',
    toastAutoSavedNedata: 'Auto-saved & exported nedata.db with immediate rollback point created',
    toastRollbackRestored: 'Successfully rolled back to previous save state!',
    toastAdbSyncSuccess: 'Successfully synced nedata.db to Android device via USB Bridge!',
    toastAdbPullSuccess: 'Successfully pulled live nedata.db from connected Android device!',
    invalidSaveFileFormat: 'Invalid save file format for Township VIP.',
    confirmResetFactory: 'Are you sure you want to reset all data and restore factory defaults?',
    resetFactoryBtn: 'Reset Factory Defaults',
    footerRights: 'Township VIP Save & Backup Management Suite',
    footerCompliance: 'Playrix Township v38.0.1 Compliant (August 2026)',
    loadingEngine: 'Loading Township VIP Save Engine...',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  isRtl: boolean;
}

const STORAGE_KEY_LANG = 'township_vip_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'ar' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'ar';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.error('Failed to save language preference', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  useEffect(() => {
    const isRtl = language === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
    isRtl: language === 'ar',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
