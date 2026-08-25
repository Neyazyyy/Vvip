// Firebase Realtime Database Integrated License Engine (Strict Network-Only Live Verification)
const FIREBASE_DB_URL = 'https://vip-5ea5f-default-rtdb.firebaseio.com';
const MASTER_KEY = 'VIP2026!';

export interface ActivationCodeRecord {
  id: string;
  code: string;
  status: 'new' | 'used' | 'revoked';
  max_uses: number;
  used_count: number;
  note?: string;
  used_by?: string;
  expiry_date?: string | null;
  created_at: string;
}

export interface LicenseValidationResult {
  isValid: boolean;
  message?: string;
  record?: ActivationCodeRecord;
}

// Compute deterministic & persistent device ID
export function getDeviceId(): string {
  try {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('ts_vip_device_id');
      if (!id) {
        id = 'DEV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        localStorage.setItem('ts_vip_device_id', id);
      }
      return id;
    }
    return 'DEV-DEVICE01';
  } catch {
    return 'DEV-TSVIP8889';
  }
}

// Strictly Live Network-Only Check with Firebase Realtime Database
export async function verifyAndConsumeCode(inputCode: string): Promise<LicenseValidationResult> {
  const cleanCode = inputCode.trim().toUpperCase();
  if (!cleanCode) {
    return { isValid: false, message: 'الرجاء إدخال كود التفعيل' };
  }

  // Check network connectivity first
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      isValid: false,
      message: '⚠️ يتطلب تفعيل كود VIP اتصالاً نشطاً بالإنترنت للتحقق المباشر من قاعدة البيانات.',
    };
  }

  // Master override key (In-Memory Only, never cached locally)
  if (cleanCode === MASTER_KEY || cleanCode === 'VIP-MASTER-ADMIN-2026') {
    return { isValid: true, message: 'تم التفعيل المباشر بالمفتاح الرئيسي للمسؤول' };
  }

  try {
    const currentDevice = getDeviceId();
    const cleanBaseUrl = FIREBASE_DB_URL.endsWith('/') ? FIREBASE_DB_URL.slice(0, -1) : FIREBASE_DB_URL;
    
    // Live Network Request: bypass browser cache completely with cache-busting timestamp & no-store
    const response = await fetch(`${cleanBaseUrl}/activation_codes.json?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });

    if (!response.ok) {
      return { isValid: false, message: 'تعذر الاتصال المباشر بقاعدة بيانات Firebase' };
    }

    const data = await response.json();
    if (!data) {
      return { isValid: false, message: '❌ الكود غير صحيح' };
    }

    const records: ActivationCodeRecord[] = Object.values(data);
    const match = records.find((c) => (c.code || '').toUpperCase() === cleanCode);

    if (!match) {
      return { isValid: false, message: '❌ كود التفعيل غير موجود أو غير صحيح' };
    }

    // Check revocation
    if (match.status === 'revoked') {
      return { isValid: false, message: '🚫 تم إلغاء صلاحية هذا الكود من قبل المشرف' };
    }

    // Check expiry
    if (match.expiry_date && new Date(match.expiry_date) < new Date()) {
      return { isValid: false, message: '⏰ انتهت صلاحية هذا الكود' };
    }

    // Check device binding (حماية القفل على جهاز واحد فقط)
    const boundDevice = (match.used_by || '').trim();
    if (boundDevice !== '') {
      if (boundDevice !== currentDevice) {
        return { 
          isValid: false, 
          message: `🚫 هذا الكود مقفل ومخصص لجهاز آخر فقط (${boundDevice})! لا يمكن تشغيله على جهازك.` 
        };
      }
    } else {
      // If code was not bound to any device, bind it NOW on the first activation!
      try {
        await fetch(`${cleanBaseUrl}/activation_codes/${match.id}.json?t=${Date.now()}`, {
          method: 'PATCH',
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            status: 'used',
            used_count: (match.used_count || 0) + 1,
            used_by: currentDevice,
          }),
        });
      } catch (err) {
        console.warn('Firebase patch live error:', err);
      }
    }

    return { isValid: true, message: 'تم التحقق بنجاح من قاعدة البيانات', record: match };
  } catch (error: any) {
    console.error('Live network license check error:', error);
    return {
      isValid: false,
      message: '⚠️ فشل الاتصال بقاعدة البيانات. تأكد من اتصال الإنترنت وحاول مجدداً.',
    };
  }
}

// No local persistence allowed - purely in-memory
export function getSavedLicenseCode(): string | null {
  return null;
}

export function clearSavedLicense(): void {
  // No-op as no local storage is kept
}
