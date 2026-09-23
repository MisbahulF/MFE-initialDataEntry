/**
 * Format angka ke representasi Rupiah (contoh: 150000000 -> "Rp 150.000.000")
 */
export function formatRupiah(value: number | string | undefined | null): string {
  if (value === undefined || value === null || value === '') return 'Rp 0';
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Parsing string berformat rupiah ke number (contoh: "Rp 150.000.000" -> 150000000)
 */
export function parseRupiah(formatted: string | undefined | null): number {
  if (!formatted) return 0;
  const cleaned = String(formatted).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Format tanggal ke standar tampilan Indonesia DD/MM/YYYY
 */
export function formatBniDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '-';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Masking No KTP untuk keamanan privasi (contoh: "3201123456780001" -> "320112******0001")
 */
export function maskKtp(ktp: string | undefined | null): string {
  if (!ktp) return '-';
  const s = String(ktp).trim();
  if (s.length < 10) return s;
  return s.substring(0, 6) + '******' + s.substring(s.length - 4);
}
