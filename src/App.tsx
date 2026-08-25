import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { TsVipLogin } from './components/TsVipLogin';
import { TsVipEditor } from './components/TsVipEditor';
import { SaveSlot } from './types/index';
import { clearSavedLicense } from './utils/licenseManager';

export function App() {
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  const [activeSlot, setActiveSlot] = useState<SaveSlot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const loadedSlots = StorageService.getSlots();
    const loadedActive = StorageService.getActiveSlot();
    setSlots(loadedSlots);
    setActiveSlot(loadedActive);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateSlot = (updated: SaveSlot) => {
    setActiveSlot(updated);
    StorageService.saveSlot(updated);
  };

  const handleLogout = () => {
    clearSavedLicense();
    setActiveCode(null);
    showToast('🔒 Logged out of TsVip Editor');
  };

  // 1. If not unlocked with VIP code, render TsVip Login screen
  if (!activeCode) {
    return (
      <>
        <TsVipLogin
          onLoginSuccess={(code) => {
            setActiveCode(code);
          }}
          onShowToast={showToast}
        />
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#12151f] border border-cyan-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in zoom-in">
            {toastMessage}
          </div>
        )}
      </>
    );
  }

  // 2. Once unlocked, render the exact TsVip Save Editor from the video
  return (
    <>
      <TsVipEditor
        activeSlot={activeSlot}
        onUpdateSlot={handleUpdateSlot}
        onShowToast={showToast}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#12151f] border border-cyan-500/50 text-white px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold animate-in fade-in zoom-in">
          {toastMessage}
        </div>
      )}
    </>
  );
}

export default App;
