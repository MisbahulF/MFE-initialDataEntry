import React from 'react';
import { TextField, SelectField, CurrencyField, CheckboxField, DateField } from '@template/shared';

export interface InformasiPerbankanProps {
  bankAccForm: any;
  setBankAccForm: React.Dispatch<React.SetStateAction<any>>;
  bankAccounts: any[];
  setBankAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  handleCariBankAcc: () => void;
  handleTambahBankAcc: () => void;

  otherLoanForm: any;
  setOtherLoanForm: React.Dispatch<React.SetStateAction<any>>;
  otherLoans: any[];
  setOtherLoans: React.Dispatch<React.SetStateAction<any[]>>;
  handleCariBankLoan: () => void;
  handleTambahOtherLoan: () => void;

  creditCardForm: any;
  setCreditCardForm: React.Dispatch<React.SetStateAction<any>>;
  creditCards: any[];
  setCreditCards: React.Dispatch<React.SetStateAction<any[]>>;
  handleCariBankCC: () => void;
  handleTambahCreditCard: () => void;

  onLanjut?: (e?: React.FormEvent) => void;
}

const TIPE_ACCOUNT_OPTIONS = [
  { label: 'Tabungan', value: 'Tabungan' },
  { label: 'Giro', value: 'Giro' },
  { label: 'Deposito', value: 'Deposito' },
  { label: 'Lainnya', value: 'Lainnya' },
];

const MATA_UANG_OPTIONS = [
  { label: 'IDR', value: 'IDR' },
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'SGD', value: 'SGD' },
];

const JENIS_FASILITAS_OPTIONS = [
  { label: 'Kredit Pemilikan Rumah (KPR)', value: 'Kredit Pemilikan Rumah (KPR)' },
  { label: 'Kredit Kendaraan Bermotor (KKB)', value: 'Kredit Kendaraan Bermotor (KKB)' },
  { label: 'Kredit Tanpa Agunan (KTA)', value: 'Kredit Tanpa Agunan (KTA)' },
  { label: 'Kredit Multiguna', value: 'Kredit Multiguna' },
  { label: 'Modal Kerja', value: 'Modal Kerja' },
  { label: 'Investasi', value: 'Investasi' },
];

const BULAN_OPTIONS = [
  { label: 'Januari', value: 'Januari' },
  { label: 'Februari', value: 'Februari' },
  { label: 'Maret', value: 'Maret' },
  { label: 'April', value: 'April' },
  { label: 'Mei', value: 'Mei' },
  { label: 'Juni', value: 'Juni' },
  { label: 'Juli', value: 'Juli' },
  { label: 'Agustus', value: 'Agustus' },
  { label: 'September', value: 'September' },
  { label: 'Oktober', value: 'Oktober' },
  { label: 'November', value: 'November' },
  { label: 'Desember', value: 'Desember' },
];

const DataTable = ({ headers, children }: { headers: string[]; children: React.ReactNode }) => (
  <div className="overflow-x-auto border-t border-gray-200">
    <table className="w-full text-xs text-left border-collapse">
      <thead className="bg-[#e65a29] text-white font-bold text-center border-b border-white">
        <tr>
          {headers.map((h, i) => (
            <th key={h} className={`p-2 ${i < headers.length - 1 ? 'border-r border-[#d34a19]' : ''}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-center bg-white">{children}</tbody>
    </table>
  </div>
);

const SearchInput = ({ label, value, onChange, onSearch, placeholder }: any) => (
  <div className="flex items-end gap-2">
    <div className="flex-1">
      <TextField label={label} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
    <button type="button" onClick={onSearch} className="px-3 py-1.5 bg-[#007b83] hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">
      Cari
    </button>
  </div>
);

export const InformasiPerbankan: React.FC<InformasiPerbankanProps> = ({
  bankAccForm, setBankAccForm, bankAccounts, handleCariBankAcc, handleTambahBankAcc,
  otherLoanForm, setOtherLoanForm, otherLoans, handleCariBankLoan, handleTambahOtherLoan,
  creditCardForm, setCreditCardForm, creditCards, handleCariBankCC, handleTambahCreditCard,
  onLanjut,
}) => {
  const updateBank = (k: string, v: any) => setBankAccForm((p: any) => ({ ...p, [k]: v }));
  const updateLoan = (k: string, v: any) => setOtherLoanForm((p: any) => ({ ...p, [k]: v }));
  const updateCC = (k: string, v: any) => setCreditCardForm((p: any) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      {/* 1. ACCOUNT BANK */}
      <div className="bg-white border border-[#007b83] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 via-[#007b83] to-teal-800 px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">ACCOUNT BANK</div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SearchInput label="Nama Bank" value={bankAccForm?.namaBank || ''} onChange={(e: any) => updateBank('namaBank', e.target.value)} onSearch={handleCariBankAcc} placeholder="Contoh: BANK BNI" />
            <SelectField label="Tipe Account" value={bankAccForm?.tipeAccount || ''} onChange={(e) => updateBank('tipeAccount', e.target.value)} options={TIPE_ACCOUNT_OPTIONS} />
            <TextField label="No. Account #" value={bankAccForm?.noAccount || ''} onChange={(e) => updateBank('noAccount', e.target.value)} placeholder="Nomor rekening" />
          </div>
          <div className="space-y-3">
            <SelectField label="Mata Uang" value={bankAccForm?.mataUang || ''} onChange={(e) => updateBank('mataUang', e.target.value)} options={MATA_UANG_OPTIONS} />
            <CurrencyField label="Saldo Rata-rata" value={bankAccForm?.saldo || 0} onChangeValue={(val) => updateBank('saldo', val)} />
            <CheckboxField label="Jaminan" checked={Boolean(bankAccForm?.jaminan)} onChange={(e) => updateBank('jaminan', e.target.checked)} />
          </div>
        </div>
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button type="button" onClick={handleTambahBankAcc} className="px-10 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95">Tambah Account Bank</button>
        </div>
        <DataTable headers={['Nama Bank', 'Tipe Account', 'No. Account', 'Mata Uang', 'Saldo Rata-rata', 'Status']}>
          {bankAccounts.length === 0 ? (
            <tr><td colSpan={6} className="p-3 text-center text-gray-400 italic">(Tidak ada data account bank)</td></tr>
          ) : (
            bankAccounts.map((b) => (
              <tr key={b.id} className="hover:bg-amber-50/50">
                <td className="p-2 text-left font-semibold text-gray-900 border-r border-gray-200">{b.bank}</td>
                <td className="p-2 border-r border-gray-200">{b.tipe}</td>
                <td className="p-2 font-mono border-r border-gray-200">{b.noRek}</td>
                <td className="p-2 border-r border-gray-200">{b.mataUang}</td>
                <td className="p-2 text-right font-mono font-semibold border-r border-gray-200">{b.saldo}</td>
                <td className="p-2 text-center">{b.statusJaminan}</td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {/* 2. PINJAMAN DI BANK LAIN */}
      <div className="bg-white border border-[#007b83] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 via-[#007b83] to-teal-800 px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">PINJAMAN DI BANK LAIN</div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SearchInput label="Nama Bank" value={otherLoanForm?.namaBank || ''} onChange={(e: any) => updateLoan('namaBank', e.target.value)} onSearch={handleCariBankLoan} placeholder="Nama bank" />
            <TextField label="No. Kontrak" value={otherLoanForm?.noKontrak || ''} onChange={(e) => updateLoan('noKontrak', e.target.value)} placeholder="Nomor kontrak pinjaman" />
            <SelectField label="Jenis Fasilitas" value={otherLoanForm?.jenisFasilitas || ''} onChange={(e) => updateLoan('jenisFasilitas', e.target.value)} options={JENIS_FASILITAS_OPTIONS} />
            <CurrencyField label="Maksimum Kredit" value={otherLoanForm?.maksKredit || 0} onChangeValue={(val) => updateLoan('maksKredit', val)} />
            <DateField label="Tanggal Mulai" dayValue={otherLoanForm?.tglMulaiTgl || ''} monthValue={otherLoanForm?.tglMulaiBln || ''} yearValue={otherLoanForm?.tglMulaiThn || ''} onDayChange={(v) => updateLoan('tglMulaiTgl', v)} onMonthChange={(v) => updateLoan('tglMulaiBln', v)} onYearChange={(v) => updateLoan('tglMulaiThn', v)} />
            <DateField label="Tanggal Selesai" dayValue={otherLoanForm?.tglSelesaiTgl || ''} monthValue={otherLoanForm?.tglSelesaiBln || ''} yearValue={otherLoanForm?.tglSelesaiThn || ''} onDayChange={(v) => updateLoan('tglSelesaiTgl', v)} onMonthChange={(v) => updateLoan('tglSelesaiBln', v)} onYearChange={(v) => updateLoan('tglSelesaiThn', v)} />
          </div>
          <div className="space-y-3">
            <CurrencyField label="Angsuran (per Bulan)" value={otherLoanForm?.angsuran || 0} onChangeValue={(val) => updateLoan('angsuran', val)} />
            <TextField label="Jangka Waktu (Bulan)" type="number" value={otherLoanForm?.jangkaWaktu || ''} onChange={(e) => updateLoan('jangkaWaktu', e.target.value)} placeholder="Contoh: 120" />
            <TextField label="Kontak Personal" value={otherLoanForm?.kontakPersonal || ''} onChange={(e) => updateLoan('kontakPersonal', e.target.value)} placeholder="Nama kontak personal" />
            <TextField label="Status" value={otherLoanForm?.status || ''} onChange={(e) => updateLoan('status', e.target.value)} placeholder="Status kredit" />
            <CheckboxField label="Pinjaman Pasangan" checked={Boolean(otherLoanForm?.pasangan)} onChange={(e) => updateLoan('pasangan', e.target.checked)} />
          </div>
        </div>
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button type="button" onClick={handleTambahOtherLoan} className="px-10 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95">Tambah Pinjaman Bank Lain</button>
        </div>
        <DataTable headers={['Nama Bank', 'Jenis Fasilitas', 'Maks Kredit', 'Angsuran', 'Jangka Waktu', 'Status']}>
          {otherLoans.length === 0 ? (
            <tr><td colSpan={6} className="p-3 text-center text-gray-400 italic">(Tidak ada data pinjaman lain)</td></tr>
          ) : (
            otherLoans.map((l) => (
              <tr key={l.id} className="hover:bg-amber-50/50">
                <td className="p-2 text-left font-semibold text-gray-900 border-r border-gray-200">{l.bank}</td>
                <td className="p-2 border-r border-gray-200">{l.fasilitas}</td>
                <td className="p-2 text-right font-mono font-semibold border-r border-gray-200">{l.maksKredit}</td>
                <td className="p-2 text-right font-mono border-r border-gray-200">{l.angsuran}</td>
                <td className="p-2 text-center border-r border-gray-200">{l.jangkaWaktu} bln</td>
                <td className="p-2 text-center">{l.status}</td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {/* 3. KARTU KREDIT */}
      <div className="bg-white border border-[#007b83] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 via-[#007b83] to-teal-800 px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">KARTU KREDIT</div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SearchInput label="Nama Bank" value={creditCardForm?.namaBank || ''} onChange={(e: any) => updateCC('namaBank', e.target.value)} onSearch={handleCariBankCC} placeholder="Nama bank penerbit" />
            <TextField label="No. Kartu" value={creditCardForm?.noKartu || ''} onChange={(e) => updateCC('noKartu', e.target.value)} placeholder="16 digit nomor kartu" />
            <CurrencyField label="Limit Kartu Kredit" value={creditCardForm?.limit || 0} onChangeValue={(val) => updateCC('limit', val)} />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Sejak Bulan" value={creditCardForm?.sejakBln || ''} onChange={(e) => updateCC('sejakBln', e.target.value)} options={BULAN_OPTIONS} />
              <TextField label="Tahun" maxLength={4} value={creditCardForm?.sejakThn || ''} onChange={(e) => updateCC('sejakThn', e.target.value)} placeholder="YYYY" />
            </div>
            <CurrencyField label="Outstanding (Pemakaian)" value={creditCardForm?.outstanding || 0} onChangeValue={(val) => updateCC('outstanding', val)} />
            <CurrencyField label="Tunggakan" value={creditCardForm?.tunggakan || 0} onChangeValue={(val) => updateCC('tunggakan', val)} />
          </div>
        </div>
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button type="button" onClick={handleTambahCreditCard} className="px-10 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95">Tambah Kartu Kredit</button>
        </div>
        <DataTable headers={['Nama Bank', 'No. Kartu', 'Limit', 'Sejak', 'Outstanding', 'Tunggakan']}>
          {creditCards.length === 0 ? (
            <tr><td colSpan={6} className="p-3 text-center text-gray-400 italic">(Tidak ada data kartu kredit)</td></tr>
          ) : (
            creditCards.map((c) => (
              <tr key={c.id} className="hover:bg-amber-50/50">
                <td className="p-2 text-left font-semibold text-gray-900 border-r border-gray-200">{c.bank}</td>
                <td className="p-2 font-mono border-r border-gray-200">{c.noKartu}</td>
                <td className="p-2 text-right font-mono font-semibold border-r border-gray-200">{c.limit}</td>
                <td className="p-2 border-r border-gray-200">{c.sejak}</td>
                <td className="p-2 text-right font-mono border-r border-gray-200">{c.outstanding}</td>
                <td className="p-2 text-right font-mono">{c.tunggakan}</td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {onLanjut && (
        <div className="flex justify-center py-2">
          <button type="button" onClick={onLanjut} className="px-12 py-2 bg-black hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded border border-slate-600 shadow-md cursor-pointer active:scale-95">Selesai</button>
        </div>
      )}
    </div>
  );
};

export default InformasiPerbankan;
