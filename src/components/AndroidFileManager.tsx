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
  Database
} from 'lucide-react';
import { SaveSlot } from '../types/index';
import { SecurityValidator } from '../services/storageService';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';

interface AndroidFileItem {
  id: string;
  name: string;
  path: string;
  type: 'xml' | 'json' | 'db' | 'properties' | 'asset';
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
    const nedataContent = slot
      ? SecurityValidator.generateNedataDbContent(slot)
      : `{
  "header": {
    "engine": "Playrix Township Engine",
    "version": "38.0.1",
    "checksum": "0x8F4A9B2E-SECURE",
    "crc32": "0x8F4A9B2E",
    "signature": "SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "created": "2026-08-20T14:20:00Z"
  },
  "player": {
    "townName": "Emerald Valley",
    "level": 85,
    "xp": 1420500,
    "population": 18450,
    "barnCapacity": 3500,
    "coins": 4850000,
    "tCash": 12500
  },
  "vault": {
    "gems": {
      "ruby": 450,
      "emerald": 380,
      "topaz": 620,
      "amethyst": 290
    },
    "expansion": {
      "axes": 145,
      "saws": 120,
      "shovels": 98
    },
    "mining": {
      "pickaxes": 450,
      "dynamite": 180,
      "tnt": 95
    },
    "building": {
      "bricks": 320,
      "glass": 280,
      "slabPlates": 310,
      "nails": 190,
      "paint": 210,
      "hammer": 165
    }
  }
}`;

    return [
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

        <activity
            android:name="com.playrix.township.GPlayActivity"
            android:launchMode="singleTask"
            android:screenOrientation="sensorLandscape"
            android:configChanges="fontScale|layoutDirection|density|smallestScreenSize|screenSize|uiMode|screenLayout|orientation|navigation|keyboardHidden|keyboard|touchscreen|locale" />
    </application>
</manifest>`,
      },
      {
        id: 'nedata',
        name: 'assets/nedata.db (Township Save Database)',
        path: '/assets/nedata.db',
        type: 'db',
        size: '2.4 KB',
        description: isRtl
          ? 'قاعدة بيانات الحفظ الرسمية للعبة متوافقة مع توقيع الـ CRC32 وحماية Anti-Ban.'
          : 'Original Township save database dynamically matched with active state & CRC32 checksum.',
        content: nedataContent,
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
  const [selectedFile, setSelectedFile] = useState<AndroidFileItem>(() => files[1] || files[0]);
  const [editedContent, setEditedContent] = useState<string>(() => (files[1] || files[0]).content);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync nedata.db whenever activeSlot changes
  useEffect(() => {
    if (activeSlot) {
      const freshContent = SecurityValidator.generateNedataDbContent(activeSlot);
      setFiles((prev) =>
        prev.map((f) => (f.id === 'nedata' ? { ...f, content: freshContent } : f))
      );
      if (selectedFile.id === 'nedata') {
        setEditedContent(freshContent);
      }
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
    link.download = file.name.includes('nedata') ? 'nedata.db' : file.name.split(' ')[0];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    files.forEach((f) => handleDownloadFile(f));
    confetti({ particleCount: 50, spread: 70 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            {t.androidFileManagerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t.androidFileManagerDesc}
          </p>
        </div>

        <button
          onClick={handleDownloadAll}
          className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-sky-900/30 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{t.downloadAllRestoredFiles}</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Files List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 font-mono">
            {t.androidFilesLabel} ({files.length})
          </div>

          <div className="space-y-2">
            {files.map((file) => {
              const isSelected = file.id === selectedFile.id;
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-sky-500 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          file.type === 'xml'
                            ? 'bg-amber-500/10 text-amber-400'
                            : file.type === 'db'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-sky-500/10 text-sky-400'
                        }`}
                      >
                        {file.type === 'xml' ? (
                          <FileCode className="w-4 h-4" />
                        ) : file.type === 'db' ? (
                          <Database className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">{file.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{file.path}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {file.size}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                    {file.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Live Editor */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{selectedFile.name}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-sky-400 font-mono">
                  {selectedFile.type.toUpperCase()}
                </span>
                {selectedFile.id === 'nedata' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>AntiBan-CRC32</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedFile.path}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyContent}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copyJson}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadFile(selectedFile)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadFile}</span>
              </button>

              <button
                onClick={handleSaveFile}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveChanges}</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{t.fileSavedSuccess}</span>
            </div>
          )}

          <div className="relative">
            <textarea
              dir="ltr"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[400px] bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-y leading-relaxed"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
