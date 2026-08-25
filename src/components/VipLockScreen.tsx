import React, { useState, useEffect } from 'react';
import {
  getDeviceId,
  verifyAndConsumeCode,
  getSavedLicenseCode,
  ActivationCodeRecord,
} from '../utils/licenseManager';

interface VipLockScreenProps {
  onUnlocked: (code: string, record?: ActivationCodeRecord) => void;
  onShowToast: (msg: string) => void;
}

export const VipLockScreen: React.FC<VipLockScreenProps> = ({ onUnlocked, onShowToast }) => {
  const [codeInput, setCodeInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallApp = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        onShowToast('📲 تم بدء تثبيت التطبيق على هاتفك بنجاح!');
      }
      setInstallPrompt(null);
    } else {
      onShowToast('💡 لتثبيت التطبيق: اضغط على الثلاث نقاط بالأعلى ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية"');
    }
  };

  // Form submit handler with strictly live network check
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const raw = codeInput.trim().toUpperCase();
    if (!raw) {
      setErrorMsg('الرجاء إدخال كود التفعيل');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await verifyAndConsumeCode(raw);
      setIsLoading(false);

      if (res.isValid) {
        setIsSuccess(true);
        onShowToast('👑 مرحباً بك في VIP! تم التحقق بنجاح من قاعدة البيانات');
        setTimeout(() => {
          onUnlocked(raw, res.record);
        }, 1000);
      } else {
        setErrorMsg(res.message || '❌ الكود غير صحيح أو منتهي');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('⚠️ تعذر الاتصال بالإنترنت أو بقاعدة البيانات.');
    }
  };

  const handleDeviceCopy = () => {
    const deviceId = getDeviceId();
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    onShowToast(`✅ تم نسخ المعرف: ${deviceId}`);
  };

  const handlePurchase = () => {
    window.open('https://t.me/Enreem', '_blank');
  };

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black text-white flex items-center justify-center p-4 select-none overflow-hidden font-sans z-50"
      dir="rtl"
    >
      {/* Background Ambience & Particles Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0d0d1a_0%,_#000000_70%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Ripple Rings */}
      <div className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/20 animate-ping pointer-events-none opacity-40" />

      {/* Main Container */}
      <div className="relative w-full max-w-sm flex flex-col items-center text-center z-10 px-4 py-8">
        
        {/* Animated Glowing Crown */}
        <div className="mb-2 relative">
          <span className="text-7xl block animate-bounce filter drop-shadow-[0_0_25px_rgba(245,200,66,0.75)] transition-transform">
            👑
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-white/50 font-medium tracking-wide mb-1.5">
          الوصول المميز
        </p>

        {/* VIP ACCESS Title */}
        <h1 className="text-4xl font-black tracking-[6px] text-white uppercase mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <span className="bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            VIP ACCESS
          </span>
        </h1>

        {/* Input Form */}
        <form onSubmit={handleLogin} className="w-full space-y-3.5">
          
          {/* Key Input Box with Gradient Border */}
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none opacity-80">
              🔑
            </span>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.toUpperCase());
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="أدخل مفتاح التفعيل هنا"
              maxLength={25}
              disabled={isLoading || isSuccess}
              className={`w-full py-4 pr-5 pl-12 bg-white/[0.04] focus:bg-white/[0.07] border text-white text-base font-semibold rounded-2xl outline-none transition-all text-right font-sans placeholder-white/30 tracking-wider ${
                errorMsg
                  ? 'border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.25)]'
                  : isSuccess
                  ? 'border-emerald-400/80 shadow-[0_0_20px_rgba(0,229,160,0.3)]'
                  : 'border-[#4a63b0]/50 focus:border-[#7491e0] focus:shadow-[0_0_20px_rgba(80,120,255,0.25)]'
              }`}
            />
          </div>

          {/* Feedback Message */}
          {errorMsg && (
            <p className="text-xs font-semibold text-rose-400 py-1 animate-in fade-in">
              {errorMsg}
            </p>
          )}

          {/* Primary Green "تسجيل الدخول" Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#00e5a0] to-[#00c27e] hover:from-[#00f5aa] hover:to-[#00d68b] active:scale-[0.98] disabled:opacity-70 text-black font-extrabold text-base rounded-2xl shadow-[0_8px_30px_rgba(0,200,150,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : isSuccess ? (
              <span>✅ تم التفعيل بنجاح!</span>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>

          {/* Secondary Blue Border "نسخ المعرف" Button */}
          <button
            type="button"
            onClick={handleDeviceCopy}
            className="w-full py-3.5 px-6 bg-transparent hover:bg-indigo-500/10 active:scale-[0.98] border border-[#5078ff]/50 hover:border-[#7098ff] text-white/80 hover:text-white font-semibold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>⚙️</span>
            <span>{copied ? 'تم نسخ المعرف بنجاح' : 'نسخ المعرف'}</span>
          </button>

          {/* Third Gold Border "شراء كود VIP" Button */}
          <button
            type="button"
            onClick={handlePurchase}
            className="w-full py-3.5 px-6 bg-transparent hover:bg-amber-400/10 active:scale-[0.98] border border-[#f5c842]/50 hover:border-[#f5c842] text-[#f5c842] font-semibold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>💎</span>
            <span>شراء كود VIP</span>
          </button>

          {/* Fourth Install App Button */}
          <button
            type="button"
            onClick={handleInstallApp}
            className="w-full py-3 px-6 bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] border border-white/15 text-slate-300 hover:text-white font-medium text-xs rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>📲</span>
            <span>تثبيت التطبيق على الشاشة الرئيسية</span>
          </button>
        </form>

      </div>

      {/* Success Modal Screen Overlay */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center z-50 animate-in fade-in duration-300">
          <div className="text-7xl mb-5 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-[#00e5a0] mb-2 drop-shadow-[0_0_15px_rgba(0,229,160,0.4)]">
            مرحباً بك في VIP!
          </h2>
          <p className="text-sm text-white/60">
            تم التحقق من كودك بنجاح<br />جاري فتح مدير ملفات تاون شيب...
          </p>
        </div>
      )}

    </div>
  );
};
