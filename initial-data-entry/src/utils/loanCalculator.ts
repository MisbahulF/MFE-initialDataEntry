/**
 * BNI eLO Konsumer - Kalkulator Kredit & Self Financing Helper
 * Pure calculation functions for credit limits, ratios, and financing
 */

export const parseCurrencyToNumber = (value: string | number | undefined | null): number => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const cleaned = String(value).replace(/[^0-9,-]/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatNumberToCurrency = (val: number): string => {
  if (isNaN(val)) return '0';
  return Math.round(val).toLocaleString('id-ID');
};

/**
 * Kalkulasi jumlah rupiah Self Financing berdasarkan persentase
 */
export const calculateSelfFinancingAmount = (propertyValue: number, sfPercentage: number): number => {
  if (propertyValue <= 0 || sfPercentage <= 0) return 0;
  return Math.round((propertyValue * sfPercentage) / 100);
};

/**
 * Kalkulasi persentase Self Financing berdasarkan jumlah rupiah
 */
export const calculateSelfFinancingPercentage = (propertyValue: number, sfAmount: number): number => {
  if (propertyValue <= 0 || sfAmount <= 0) return 0;
  return parseFloat(((sfAmount / propertyValue) * 100).toFixed(2));
};

/**
 * Batas Maksimum Plafon Kredit Griya = Nilai Objek Pembiayaan - Self Financing (Uang Muka)
 * Selalu dibulatkan ke bawah per kelipatan ratusan ribu untuk keamanan plafon
 */
export const calculateMaxCredit = (propertyValue: number, sfAmount: number): number => {
  const maxCredit = Math.max(0, propertyValue - sfAmount);
  return Math.floor(maxCredit / 100000) * 100000;
};

/**
 * Kalkulasi bunga masa tenggang (Grace Period)
 */
export const calculateGracePeriodInterest = (
  plafon: number,
  annualInterestRatePercent: number,
  gracePeriodMonths: number
): number => {
  if (plafon <= 0 || annualInterestRatePercent <= 0 || gracePeriodMonths <= 0) return 0;
  const monthlyRate = (annualInterestRatePercent / 100) / 12;
  return Math.round(plafon * monthlyRate * gracePeriodMonths);
};
