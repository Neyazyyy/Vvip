import React, { useState, useEffect } from 'react';
import { Key, Copy, Sparkles, Smartphone, Settings, Check } from 'lucide-react';
import { verifyAndConsumeCode, ActivationCodeRecord, getDeviceId } from '../utils/licenseManager';

interface TsVipLoginProps {
  onLoginSuccess: (key: string, record?: ActivationCodeRecord) => void;
  onShowToast: (msg: string) => void;
}

export const TsVipLogin: React.FC<TsVipLoginProps> = ({ onLoginSuccess, onShowToast }) => {
  const [vipKey, setVipKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [deviceId, setDeviceId] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Fetch unique persistent device ID
    const id = getDeviceId();
    setDeviceId(id);

    // Listen for PWA install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = vipKey.trim().toUpperCase();

    if (!clean) {
      setErrorMsg('الرجاء إدخال مفتاح التفعيل');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setStatusText('جارٍ التحقق من السيرفر...');

    try {
      const res = await verifyAndConsumeCode(clean);
      if (res.isValid) {
        setIsLoading(false);
        setStatusText('تم تسجيل الدخول بنجاح');
        onShowToast('👑 مرحباً بك! تم التحقق وتفعيل صلاحيات VIP');
        setTimeout(() => {
          onLoginSuccess(clean, res.record);
        }, 500);
      } else {
        setIsLoading(false);
        setErrorMsg(res.message || '❌ كود التفعيل غير صحيح');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('❌ تعذر الاتصال بالسيرفر، تأكد من وجود إنترنت');
    }
  };

  const handleCopyDeviceId = () => {
    const textToCopy = deviceId || getDeviceId();
    navigator.clipboard.writeText(textToCopy);
    onShowToast(`⚙️ تم نسخ المعرف (${textToCopy}) إلى الحافظة!`);
  };

  const handleBuyVip = () => {
    window.open('https://t.me/Enreem', '_blank');
    onShowToast('💎 تواصل عبر تلغرام لشراء كود VIP: @Enreem');
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onShowToast('📲 جارٍ تثبيت التطبيق على الشاشة الرئيسية...');
      }
      setDeferredPrompt(null);
    } else {
      onShowToast('📲 لتثبيت التطبيق: اضغط على خيارات المتصفح (⋮) ثم "إضافة إلى الشاشة الرئيسية"');
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050608] text-white flex flex-col items-center justify-center p-5 select-none font-sans z-50 dir-rtl overflow-y-auto" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-[340px] flex flex-col items-center space-y-6 z-10 py-6">
        
        {/* Golden Crown Icon */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative group animate-pulse">
            <span className="text-6xl sm:text-7xl filter drop-shadow-[0_10px_20px_rgba(234,179,8,0.35)]">
              👑
            </span>
          </div>

          <div className="text-center space-y-1">
            <span className="text-xs font-medium text-gray-400 tracking-wider block">
              الوصول المميز
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-[0.25em] text-white uppercase font-mono">
              VIP ACCESS
            </h1>
          </div>
        </div>

        {/* Input & Action Buttons matching the screenshot */}
        <form onSubmit={handleLogin} className="w-full space-y-3">
          
          {/* Key Input Field */}
          <div className="relative">
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg">
              🔑
            </div>
            <input
              type="text"
              value={vipKey}
              onChange={(e) => setVipKey(e.target.value)}
              placeholder="أدخل مفتاح التفعيل هنا"
              className="w-full h-13 bg-[#0d1017] border border-[#1e2433] focus:border-emerald-500/80 rounded-2xl pr-11 pl-4 text-sm font-medium text-white placeholder:text-gray-500 outline-none transition-all text-right shadow-inner shadow-black/40"
              autoComplete="off"
            />
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="text-xs text-rose-400 text-center font-bold py-1 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3">
              {errorMsg}
            </div>
          )}

          {/* Green Main Button: تسجيل الدخول */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#00c875] to-[#00b064] hover:from-[#00db80] hover:to-[#00c875] active:scale-[0.98] text-[#050608] font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              'تسجيل الدخول'
            )}
          </button>

          {/* Button 2: نسخ المعرف ⚙️ */}
          <button
            type="button"
            onClick={handleCopyDeviceId}
            className="w-full h-12 rounded-2xl bg-[#0d1017] hover:bg-[#131722] active:scale-[0.98] border border-[#1b2233] text-gray-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>نسخ المعرف</span>
            <Settings className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          </button>

          {/* Button 3: شراء كود VIP 💎 */}
          <button
            type="button"
            onClick={handleBuyVip}
            className="w-full h-12 rounded-2xl bg-[#0d1017] hover:bg-[#131722] active:scale-[0.98] border border-[#3b321c] hover:border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>شراء كود VIP</span>
            <span>💎</span>
          </button>

          {/* Button 4: تثبيت التطبيق على الشاشة الرئيسية 📲 */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="w-full h-12 rounded-2xl bg-[#0d1017] hover:bg-[#131722] active:scale-[0.98] border border-[#1b2233] text-gray-300 hover:text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>تثبيت التطبيق على الشاشة الرئيسية</span>
            <span>📲</span>
          </button>

        </form>

      </div>
    </div>
  );
};
