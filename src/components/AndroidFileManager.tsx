import React, { useState, useEffect } from 'react';
import {
  FileCode,
  FolderOpen,
  FileText,
  Download,
  Upload,
  Copy,
  Check,
  Smartphone,
  Save,
  RefreshCw,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  ShieldCheck,
  Database,
  Terminal,
  Flame,
  Cpu
} from 'lucide-react';
import { SaveSlot } from '../types/index';
import { StorageService, SecurityValidator } from '../services/storageService';
import { AndroidBridgeService } from '../services/androidBridgeService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface AndroidFileItem {
  id: string;
  name: string;
  path: string;
  type: 'xml' | 'json' | 'db' | 'properties' | 'asset' | 'sh' | 'lua';
  size: string;
  description: string;
  content: string;
}

interface AndroidFileManagerProps {
  activeSlot?: SaveSlot;
}

export const AndroidFileManager: React.FC<AndroidFileManagerProps> = ({ activeSlot }) => {
  const { t, isRtl } = useLanguage();

  const generateInitialFiles = (slot?: SaveSlot): AndroidFileItem[] => {
    const currentSlot = slot || StorageService.getActiveSlot();
    const nedataContent = SecurityValidator.generateNedataDbContent(currentSlot);
    const rootScriptContent = AndroidBridgeService.generateRootShellScript(currentSlot);
    const deployScriptContent = AndroidBridgeService.generateDeployScript(currentSlot);
    const ggScriptContent = AndroidBridgeService.generateGameGuardianScript(currentSlot);
    const sharedPrefsContent = AndroidBridgeService.generateSharedPrefsXml(currentSlot);

    return [
      {
        id: 'deploy_sh',
        name: 'deploy.sh (Termux 1-Action Sync Script)',
        path: '/sdcard/Download/deploy.sh',
        type: 'sh',
        size: '1.9 KB',
        description: isRtl
          ? 'سكريبت التنفيذ الشامل لـ Termux لتطبيق المزامنة الكاملة بضغطة واحدة مع رفع صلاحيات su التلقائية وضبط التصاريح 660.'
          : 'All-in-one Termux execution script. Automates su root escalation, nedata.db deployment, 660 chmod/chown, and game launcher in 1 step.',
        content: deployScriptContent,
      },
      {
        id: 'nedata',
        name: 'nedata.db (Township Save Database)',
        path: '/data/data/com.playrix.township/databases/nedata.db',
        type: 'db',
        size: '2.4 KB',
        description: isRtl
          ? 'قاعدة بيانات الحفظ الرسمية للعبة في مسار الروت الداخلي المحمي مع توقيع CRC32 و Anti-Ban.'
          : 'Official Township save database targeting internal root path (/data/data/.../databases/nedata.db) with CRC32.',
        content: nedataContent,
      },
      {
        id: 'root_sh',
        name: 'apply_save_root.sh (1-Click Root Installer)',
        path: '/sdcard/Download/apply_save_root.sh',
        type: 'sh',
        size: '1.5 KB',
        description: isRtl
          ? 'سكريبت الشل التلقائي لتثبيت الحفظ، ضبط الصلاحيات rw-rw---- (660)، وتغيير المالك chown على أجهزة الروت بنقرة واحدة.'
          : 'Automated 1-click Bash installer for rooted devices. Sets chmod 660, chown, force-stops, and hot-starts Township.',
        content: rootScriptContent,
      },
      {
        id: 'shared_prefs',
        name: 'com.playrix.township.v2.playerprefs.xml',
        path: '/data/data/com.playrix.township/shared_prefs/com.playrix.township.v2.playerprefs.xml',
        type: 'xml',
        size: '1.8 KB',
        description: isRtl
          ? 'ملف تفضيلات اللاعب المشفرة Shared Preferences الخاص بالذهب والـ VIP والمستوى.'
          : 'Player Preferences XML file containing VIP tiers, coin overrides, and offline sync state.',
        content: sharedPrefsContent,
      },
      {
        id: 'gg_lua',
        name: 'township_vip_injector.lua (GameGuardian Script)',
        path: '/sdcard/GameGuardian/township_vip_injector.lua',
        type: 'lua',
        size: '1.2 KB',
        description: isRtl
          ? 'سكريبت GameGuardian للحقن المباشر في الذاكرة العشوائية (RAM) أثناء تشغيل اللعبة دون استبدال الملفات.'
          : 'Lua memory injection script for GameGuardian to hot-patch coins, t-cash, and barn capacity in RAM.',
        content: ggScriptContent,
      },
      {
        id: 'manifest',
        name: 'AndroidManifest.xml',
        path: '/AndroidManifest.xml',
        type: 'xml',
        size: '1.2 KB',
        description: isRtl
          ? 'ملف المانيفست الخاص بتطبيق Township مع إعدادات الأنشطة (Activity) والصلاحيات (Permissions).'
          : 'Township Android manifest file with Activity definitions and system permissions.',
        content: `<?xml version="1.0" encoding="utf-8"?>
<!-- Township v38.0.1 Genuine Playrix Android Manifest -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.playrix.township"
    android:versionCode="1038010"
    android:versionName="38.0.1"
    android:installLocation="auto"
    android:compileSdkVersion="36"
    android:compileSdkVersionCodename="16"
    platformBuildVersionCode="36"
    platformBuildVersionName="16">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="35" />

    <uses-permission android:name="com.android.vending.CHECK_LICENSE" />
    <uses-permission android:name="com.android.vending.BILLING" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="com.google.android.gms.permission.AD_ID" />
    <uses-permission android:name="com.google.android.c2dm.permission.RECEIVE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:name="com.playrix.township.lib.GameApplication"
        android:allowBackup="true"
        android:restoreAnyVersion="false"
        android:hardwareAccelerated="true"
        android:supportsRtl="true"
        android:fullBackupOnly="true"
        android:appCategory="game"
        android:appComponentFactory="androidx.core.app.CoreComponentFactory">

        <meta-data
            android:name="com.playrix.engine.version"
            android:value="38.0.1" />
        <meta-data
            android:name="com.playrix.township.save_schema"
            android:value="nedata.db.v38" />

        <activity
            android:name="com.playrix.township.Launcher"
            android:exported="true"
            android:launchMode="singleTask"
            android:screenOrientation="sensorLandscape"
            android:configChanges="fontScale|layoutDirection|density|smallestScreenSize|screenSize|uiMode|screenLayout|orientation|navigation|keyboardHidden|keyboard|touchscreen|locale">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
      },
      {
        id: 'metadata',
        name: 'app-metadata.properties',
        path: '/META-INF/com/android/build/gradle/app-metadata.properties',
        type: 'properties',
        size: '240 B',
        description: isRtl
          ? 'ملف خصائص وإعدادات حزمة الأندرويد والـ SDK.'
          : 'Android package build properties, SDK level, and gradle configuration metadata.',
        content: `# Android Gradle Plugin App Metadata
# Township Android Package Properties
android.build.versionCode=1038010
android.build.versionName=38.0.1
android.build.packageName=com.playrix.township
android.build.targetSdk=35
android.build.minSdk=21
android.build.compileSdk=36`,
      },
    ];
  };

  const [files, setFiles] = useState<AndroidFileItem[]>(() => generateInitialFiles(activeSlot));
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(() => files[0]);
  const [editedContent, setEditedContent] = useState<string>(() => files[0].content);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync files whenever activeSlot changes
  useEffect(() => {
    if (activeSlot) {
      const freshFiles = generateInitialFiles(activeSlot);
      setFiles(freshFiles);
      const currentSelected = freshFiles.find((f) => f.id === selectedFile.id) || freshFiles[0];
      setSelectedFile(currentSelected);
      setEditedContent(currentSelected.content);
    }
  }, [activeSlot?.townLevel, activeSlot?.coins, activeSlot?.tCash, activeSlot?.townName]);

  const handleSelectFile = (file: AndroidFileItem) => {
    setSelectedFile(file);
    setEditedContent(file.content);
    setSavedSuccess(false);
  };

  const handleSaveFile = () => {
    const updatedFiles = files.map((f) =>
      f.id === selectedFile.id ? { ...f, content: editedContent } : f
    );
    setFiles(updatedFiles);
    setSelectedFile({ ...selectedFile, content: editedContent });
    setSavedSuccess(true);
    confetti({ particleCount: 30 });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: AndroidFileItem) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name.includes('nedata')
      ? 'nedata.db'
      : file.name.includes('apply_save_root')
      ? 'apply_save_root.sh'
      : file.name.includes('township_vip_injector')
      ? 'township_vip_injector.lua'
      : file.name.includes('playerprefs')
      ? 'com.playrix.township.v2.playerprefs.xml'
      : file.name.split(' ')[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    files.forEach((f) => handleDownloadFile(f));
    confetti({ particleCount: 50, spread: 70 });
  };

  const getFileIcon = (file: AndroidFileItem) => {
    if (file.id === 'nedata') return <Database className="w-4 h-4 text-amber-400" />;
    if (file.id === 'root_sh') return <Terminal className="w-4 h-4 text-emerald-400" />;
    if (file.id === 'gg_lua') return <Cpu className="w-4 h-4 text-indigo-400" />;
    if (file.type === 'xml') return <FileCode className="w-4 h-4 text-sky-400" />;
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-emerald-400" />
            <span>{t.androidFileManagerTitle}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
              Root Paths Ready
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.androidFileManagerDesc}
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t.downloadAllRestoredFiles}</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Files List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 font-mono flex items-center justify-between">
            <span>{t.androidFilesLabel} ({files.length})</span>
            <span className="text-amber-400 text-[10px] font-bold">Root / Internal</span>
          </div>

          <div className="space-y-2">
            {files.map((file) => {
              const isSelected = file.id === selectedFile.id;
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-white truncate">
                          {file.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                          {file.path}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(file);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors shrink-0"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right File Editor & Inspector */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  {getFileIcon(selectedFile)}
                  <span>{selectedFile.name}</span>
                </h3>
                <div className="text-[11px] font-mono text-emerald-400 mt-0.5 select-all">
                  {selectedFile.path}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyContent}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedSuccess ? 'Saved!' : 'Save Edits'}</span>
                </button>
              </div>
            </div>

            {/* Description Banner */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              {selectedFile.description}
            </div>

            {/* Code Textarea */}
            <div className="relative">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={16}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 leading-relaxed shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
