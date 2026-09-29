/**
 * BNI eLO Konsumer - Banking Field Validation Utilities
 * Centralized regex patterns & validation logic for credit applications
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const REGEX_PATTERNS = {
  KTP: /^[0-9]{16}$/,
  NPWP_15: /^[0-9]{15}$/,
  NPWP_16: /^[0-9]{16}$/,
  PHONE: /^08[0-9]{8,11}$/,
  GENERAL_PHONE: /^[0-9]{10,13}$/,
  REKENING_BNI: /^[0-9]{10}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  NUMERIC_ONLY: /^[0-9]+$/,
};

/**
 * Validasi Nomor KTP (NIK) wajib 16 digit angka
 */
export const validateKtp = (ktp: string): ValidationResult => {
  if (!ktp) return { isValid: false, message: 'Nomor KTP wajib diisi.' };
  const cleaned = ktp.trim();
  if (cleaned.length !== 16) {
    return { isValid: false, message: `Nomor KTP harus 16 digit angka (saat ini ${cleaned.length} digit).` };
  }
  if (!REGEX_PATTERNS.KTP.test(cleaned)) {
    return { isValid: false, message: 'Nomor KTP hanya boleh berisi angka.' };
  }
  return { isValid: true };
};

/**
 * Validasi NPWP (15 atau 16 digit angka)
 */
export const validateNpwp = (npwp: string): ValidationResult => {
  if (!npwp) return { isValid: true }; // optional depending on form
  const cleaned = npwp.replace(/[^0-9]/g, '');
  if (cleaned.length !== 15 && cleaned.length !== 16) {
    return { isValid: false, message: 'NPWP harus 15 atau 16 digit angka format valid.' };
  }
  return { isValid: true };
};

/**
 * Validasi Nomor HP (10 - 13 digit angka diawali 08...)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) return { isValid: false, message: 'Nomor HP wajib diisi.' };
  const cleaned = phone.trim().replace(/[^0-9]/g, '');
  if (cleaned.length < 10 || cleaned.length > 13) {
    return { isValid: false, message: 'Nomor HP harus antara 10 sampai 13 digit angka.' };
  }
  return { isValid: true };
};

/**
 * Validasi Nomor Rekening BNI (10 digit angka)
 */
export const validateRekeningBni = (rekening: string): ValidationResult => {
  if (!rekening) return { isValid: false, message: 'Nomor Rekening BNI wajib diisi.' };
  const cleaned = rekening.trim();
  if (!REGEX_PATTERNS.REKENING_BNI.test(cleaned)) {
    return { isValid: false, message: 'Nomor Rekening BNI harus tepat 10 digit angka.' };
  }
  return { isValid: true };
};

/**
 * Validasi Usia Debitur (21 - 65 tahun pada saat lunas)
 */
export const validateAge = (
  birthYear: number | string,
  birthMonth: number | string = 1,
  birthDay: number | string = 1,
  minAge: number = 21,
  maxAge: number = 65
): ValidationResult => {
  const y = parseInt(String(birthYear), 10);
  if (isNaN(y) || y < 1920) return { isValid: false, message: 'Tahun lahir tidak valid.' };

  const currentYear = new Date().getFullYear();
  const calculatedAge = currentYear - y;

  if (calculatedAge < minAge) {
    return { isValid: false, message: `Usia pemohon minimal ${minAge} tahun (saat ini ${calculatedAge} tahun).` };
  }
  if (calculatedAge > maxAge) {
    return { isValid: false, message: `Usia pemohon melebihi batas maksimal ${maxAge} tahun saat lunas.` };
  }

  return { isValid: true };
};

/**
 * Validasi Mandatory Fields
 */
export const validateMandatoryFields = (
  formData: Record<string, any>,
  requiredKeys: string[]
): { isValid: boolean; missingKeys: string[] } => {
  const missingKeys = requiredKeys.filter(key => {
    const val = formData[key];
    return val === undefined || val === null || String(val).trim() === '' || val === '- SELECT -';
  });
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};
