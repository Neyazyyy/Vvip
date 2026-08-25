/**
 * Native Android Bridge Service
 * Connects the web view UI with the Android Java / Capacitor native superuser bridge.
 */

declare global {
  interface Window {
    Android?: {
      isNativeApp?: () => boolean;
      getAppVersion?: () => string;
      getDeviceId?: () => string;
      isRootAvailable?: () => boolean;
      executeRootCommand?: (cmd: string) => string;
      directInjectNedata?: (content: string) => boolean;
      launchTownship?: () => void;
      forceStopTownship?: () => void;
      copyToClipboard?: (text: string) => void;
      showToast?: (msg: string) => void;
    };
    TownshipBridge?: any;
    Capacitor?: any;
  }
}

export class NativeAndroidBridge {
  /**
   * Check if running inside the native Android APK wrapper
   */
  static isNative(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.Android || window.TownshipBridge || window.Capacitor?.isNativePlatform());
  }

  /**
   * Check if the device has Superuser Root granted to the APK
   */
  static isRootAvailable(): boolean {
    if (window.Android && typeof window.Android.isRootAvailable === 'function') {
      try {
        return window.Android.isRootAvailable();
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * Directly inject the save database and restart Township in 1 single native action
   */
  static directInject(nedataDbContent: string): { success: boolean; message: string } {
    if (window.Android && typeof window.Android.directInjectNedata === 'function') {
      try {
        const ok = window.Android.directInjectNedata(nedataDbContent);
        if (ok) {
          return { success: true, message: '✅ تم حقن الحفظ بنجاح وتشغيل تاون شيب مباشرة!' };
        }
      } catch (err: any) {
        return { success: false, message: `❌ خطأ في الجسر: ${err?.message || err}` };
      }
    }
    return { success: false, message: 'الجسر غير متوفر في المتصفح العادي' };
  }

  /**
   * Execute superuser root command via native Java layer
   */
  static executeRoot(cmd: string): string {
    if (window.Android && typeof window.Android.executeRootCommand === 'function') {
      try {
        return window.Android.executeRootCommand(cmd);
      } catch (err: any) {
        return `[ERROR] ${err?.message || err}`;
      }
    }
    return '[BRIDGE NOT CONNECTED] Running in standard Web Mode.';
  }

  /**
   * Launch Township app
   */
  static launchTownship() {
    if (window.Android && typeof window.Android.launchTownship === 'function') {
      window.Android.launchTownship();
    }
  }

  /**
   * Force stop Township app
   */
  static forceStopTownship() {
    if (window.Android && typeof window.Android.forceStopTownship === 'function') {
      window.Android.forceStopTownship();
    }
  }

  /**
   * Show native Android Toast message
   */
  static showToast(msg: string) {
    if (window.Android && typeof window.Android.showToast === 'function') {
      window.Android.showToast(msg);
    }
  }
}
