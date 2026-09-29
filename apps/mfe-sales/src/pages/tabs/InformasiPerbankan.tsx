import React, { useState } from 'react';
import {
  TextField,
  SelectField,
  CurrencyField,
  DateField,
  CheckboxField
} from '@template/shared';

interface BankAccount {
  id: string;
  bank: string;
  jenisRekening: string;
  noRekening: string;
  mataUang: string;
  saldo: string | number;
  statusJaminan: string;
}

interface OtherAsset {
  id: string;
  tipeAset: string;
  lokasi: string;
  nilaiTaksasi: string | number;
  luasTanah?: string;
  luasBangunan?: string;
  merkKendaraan?: string;
  tahunPembuatan?: string;
  statusJaminan: string;
}

interface OtherLoan {
  id: string;
  bank: string;
  noKontrak?: string;
  fasilitas: string;
  maksKredit: string | number;
  angsuran: string | number;
  jangkaWaktu: string | number;
  status: string;
  isSpouse?: boolean;
}

interface CreditCard {
  id: string;
  bank: string;
  noKartu: string;
  limit: string | number;
  sejak: string;
  outstanding: string | number;
  tunggakan: string | number;
  kolektibilitas?: string;
}

interface InformasiPerbankanProps {
  bankAccForm: any;
  setBankAccForm: (val: any) => void;
  bankAccounts: BankAccount[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  handleCariBankAcc: () => void;
  handleTambahBankAcc: () => void;

  otherLoanForm: any;
  setOtherLoanForm: (val: any) => void;
  otherLoans: OtherLoan[];
  setOtherLoans: React.Dispatch<React.SetStateAction<OtherLoan[]>>;
  handleCariBankLoan: () => void;
  handleTambahOtherLoan: () => void;

  creditCardForm: any;
  setCreditCardForm: (val: any) => void;
  creditCards: CreditCard[];
  setCreditCards: React.Dispatch<React.SetStateAction<CreditCard[]>>;
  handleCariBankCC: () => void;
  handleTambahCreditCard: () => void;

  onLanjut?: (e?: React.FormEvent) => void;
}

export const InformasiPerbankan: React.FC<InformasiPerbankanProps> = ({
  bankAccForm,
  setBankAccForm,
  bankAccounts,
  setBankAccounts,
  handleCariBankAcc,
  handleTambahBankAcc,

  otherLoanForm,
  setOtherLoanForm,
  otherLoans,
  setOtherLoans,
  handleCariBankLoan,
  handleTambahOtherLoan,

  creditCardForm,
  setCreditCardForm,
  creditCards,
  setCreditCards,
  handleCariBankCC,
  handleTambahCreditCard,

  onLanjut,
}) => {
  // CuBES Seksi 2: Aset Lainnya
  const [otherAssets, setOtherAssets] = useState<OtherAsset[]>([
    {
      id: '1',
      tipeAset: 'Tanah & Bangunan',
      lokasi: 'Jl. Merdeka No. 45, Bandung',
      nilaiTaksasi: 'Rp 650.000.000',
      luasTanah: '120 m2',
      luasBangunan: '90 m2',
      statusJaminan: 'Tidak Dijaminkan',
    }
  ]);
  const [assetForm, setAssetForm] = useState<any>({
    tipeAset: 'TANAH_BANGUNAN',
    lokasi: '',
    nilaiTaksasi: 0,
    luasTanah: '',
    luasBangunan: '',
    merkKendaraan: '',
    tahunPembuatan: '',
    isDijaminkan: false,
  });

  // CuBES Seksi 5: Rekanan Asuransi
  const [insuranceForm, setInsuranceForm] = useState<any>({
    perusahaanAsuransi: 'BNI_LIFE',
    tipePembayaranPremi: 'KREDIT', // 'CASH' | 'KREDIT'
    premiAsuransiJiwa: 4500000,
    premiAsuransiKerugian: 2750000,
  });

  const updateBankAcc = (field: string, val: any) => {
    setBankAccForm((prev: any) => ({ ...prev, [field]: val }));
  };

  const updateLoan = (field: string, val: any) => {
    setOtherLoanForm((prev: any) => ({ ...prev, [field]: val }));
  };

  const updateCC = (field: string, val: any) => {
    setCreditCardForm((prev: any) => ({ ...prev, [field]: val }));
  };

  const updateAsset = (field: string, val: any) => {
    setAssetForm((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleTambahAset = () => {
    if (!assetForm.lokasi && !assetForm.merkKendaraan) {
      alert('Mohon isi lokasi aset atau merk kendaraan!');
      return;
    }
    const newAsset: OtherAsset = {
      id: String(Date.now()),
      tipeAset: assetForm.tipeAset === 'TANAH_BANGUNAN' ? 'Tanah & Bangunan' : assetForm.tipeAset === 'KENDARAAN' ? 'Kendaraan Bermotor' : 'Deposito / Logam Mulia',
      lokasi: assetForm.lokasi || assetForm.merkKendaraan,
      nilaiTaksasi: typeof assetForm.nilaiTaksasi === 'number' ? `Rp ${assetForm.nilaiTaksasi.toLocaleString('id-ID')}` : assetForm.nilaiTaksasi,
      luasTanah: assetForm.luasTanah ? `${assetForm.luasTanah} m2` : '-',
      luasBangunan: assetForm.luasBangunan ? `${assetForm.luasBangunan} m2` : '-',
      merkKendaraan: assetForm.merkKendaraan || '-',
      tahunPembuatan: assetForm.tahunPembuatan || '-',
      statusJaminan: assetForm.isDijaminkan ? 'Dijaminkan' : 'Tidak Dijaminkan',
    };
    setOtherAssets(prev => [...prev, newAsset]);
    setAssetForm({
      tipeAset: 'TANAH_BANGUNAN',
      lokasi: '',
      nilaiTaksasi: 0,
      luasTanah: '',
      luasBangunan: '',
      merkKendaraan: '',
      tahunPembuatan: '',
      isDijaminkan: false,
    });
  };

  const handleHapusBankAcc = (id: string) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
  };

  const handleHapusAset = (id: string) => {
    setOtherAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleHapusLoan = (id: string) => {
    setOtherLoans(prev => prev.filter(l => l.id !== id));
  };

  const handleHapusCC = (id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id));
  };

  const BULAN_OPTIONS = [
    { label: 'Januari', value: '1' },
    { label: 'Februari', value: '2' },
    { label: 'Maret', value: '3' },
    { label: 'April', value: '4' },
    { label: 'Mei', value: '5' },
    { label: 'Juni', value: '6' },
    { label: 'Juli', value: '7' },
    { label: 'Agustus', value: '8' },
    { label: 'September', value: '9' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. REKENING SIMPANAN DI BANK (CuBES: PersonalInfoDE3.aspx - txt_ac_num, ddl_ac_type, txt_ac_avgsaldo) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          1. Rekening Simpanan di Bank (Tabungan / Giro / Deposito)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">Nama Bank *</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <TextField
                    value={bankAccForm?.namaBank || ''}
                    onChange={(e) => updateBankAcc('namaBank', e.target.value)}
                    placeholder="Contoh: PT. BANK NEGARA INDONESIA (PERSERO) TBK"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCariBankAcc}
                  className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5"
                >
                  Cari
                </button>
              </div>
            </div>

            <SelectField
              label="Jenis Rekening"
              value={bankAccForm?.jenisRekening || 'TABUNGAN'}
              onChange={(e) => updateBankAcc('jenisRekening', e.target.value)}
              options={[
                { label: 'Tabungan (BNI Taplus / Lainnya)', value: 'TABUNGAN' },
                { label: 'Giro (Current Account)', value: 'GIRO' },
                { label: 'Deposito Berjangka (Time Deposit)', value: 'DEPOSITO' },
              ]}
            />

            <TextField
              label="Nomor Rekening"
              required
              value={bankAccForm?.noRekening || ''}
              onChange={(e) => updateBankAcc('noRekening', e.target.value.replace(/\D/g, ''))}
              placeholder="10 digit nomor rekening"
            />
          </div>

          <div className="space-y-3">
            <SelectField
              label="Mata Uang"
              value={bankAccForm?.mataUang || 'IDR'}
              onChange={(e) => updateBankAcc('mataUang', e.target.value)}
              options={[
                { label: 'IDR - Indonesian Rupiah', value: 'IDR' },
                { label: 'USD - US Dollar', value: 'USD' },
                { label: 'SGD - Singapore Dollar', value: 'SGD' },
              ]}
            />
            <CurrencyField
              label="Saldo Rata-Rata (3 Bulan Terakhir)"
              required
              value={bankAccForm?.saldo || 0}
              onChangeValue={(val) => updateBankAcc('saldo', val)}
            />
            <CheckboxField
              label="Rekening Ini Dijadikan Agunan / Jaminan Tambahan"
              checked={Boolean(bankAccForm?.dijadikanJaminan)}
              onChange={(e) => updateBankAcc('dijadikanJaminan', e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTambahBankAcc}
            className="px-8 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95"
          >
            + Tambah Rekening Simpanan
          </button>
        </div>

        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-2.5 border-r border-gray-200">Nama Bank</th>
                <th className="p-2.5 border-r border-gray-200">Jenis Rekening</th>
                <th className="p-2.5 border-r border-gray-200">Nomor Rekening</th>
                <th className="p-2.5 text-right border-r border-gray-200">Saldo Rata-rata</th>
                <th className="p-2.5 text-center border-r border-gray-200">Status Jaminan</th>
                <th className="p-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {bankAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-400 italic">
                    Belum ada data rekening simpanan.
                  </td>
                </tr>
              ) : (
                bankAccounts.map((b) => (
                  <tr key={b.id} className="hover:bg-amber-50/40">
                    <td className="p-2.5 font-semibold text-gray-900 border-r border-gray-200">{b.bank}</td>
                    <td className="p-2.5 border-r border-gray-200">{b.jenisRekening}</td>
                    <td className="p-2.5 font-mono border-r border-gray-200">{b.noRekening}</td>
                    <td className="p-2.5 text-right font-mono font-semibold border-r border-gray-200">
                      {typeof b.saldo === 'number' ? `Rp ${b.saldo.toLocaleString('id-ID')}` : b.saldo}
                    </td>
                    <td className="p-2.5 text-center border-r border-gray-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.statusJaminan === 'Dijaminkan' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'}`}>
                        {b.statusJaminan}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleHapusBankAcc(b.id)}
                        className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. ASET LAINNYA DEBITUR (CuBES: PersonalInfoDE3.aspx - ddl_type, txt_location, txt_nilai_tak, txt_luas_tnh, bgn) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          2. Aset Lainnya Debitur (Di Luar Agunan yang Diajukan)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SelectField
              label="Tipe Aset"
              value={assetForm?.tipeAset || 'TANAH_BANGUNAN'}
              onChange={(e) => updateAsset('tipeAset', e.target.value)}
              options={[
                { label: 'Tanah & Bangunan', value: 'TANAH_BANGUNAN' },
                { label: 'Kendaraan Bermotor (Mobil / Motor)', value: 'KENDARAAN' },
                { label: 'Deposito / Logam Mulia / Lainnya', value: 'LAINNYA' },
              ]}
            />
            {assetForm?.tipeAset === 'KENDARAAN' ? (
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Merk / Tipe Kendaraan"
                  value={assetForm?.merkKendaraan || ''}
                  onChange={(e) => updateAsset('merkKendaraan', e.target.value)}
                  placeholder="Toyota Innova, Honda HR-V"
                />
                <TextField
                  label="Tahun Pembuatan"
                  type="number"
                  value={assetForm?.tahunPembuatan || ''}
                  onChange={(e) => updateAsset('tahunPembuatan', e.target.value)}
                  placeholder="2022"
                />
              </div>
            ) : (
              <TextField
                label="Lokasi / Alamat Aset"
                value={assetForm?.lokasi || ''}
                onChange={(e) => updateAsset('lokasi', e.target.value)}
                placeholder="Alamat lengkap lokasi tanah/bangunan aset"
              />
            )}
          </div>
          <div className="space-y-3">
            {assetForm?.tipeAset === 'TANAH_BANGUNAN' && (
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Luas Tanah (m2)"
                  type="number"
                  value={assetForm?.luasTanah || ''}
                  onChange={(e) => updateAsset('luasTanah', e.target.value)}
                  placeholder="Contoh: 150"
                />
                <TextField
                  label="Luas Bangunan (m2)"
                  type="number"
                  value={assetForm?.luasBangunan || ''}
                  onChange={(e) => updateAsset('luasBangunan', e.target.value)}
                  placeholder="Contoh: 100"
                />
              </div>
            )}
            <CurrencyField
              label="Nilai Taksasi / Perkiraan Harga Pasar"
              value={assetForm?.nilaiTaksasi || 0}
              onChangeValue={(val) => updateAsset('nilaiTaksasi', val)}
            />
            <CheckboxField
              label="Aset Ini Sedang Dijaminkan di Lembaga Lain"
              checked={Boolean(assetForm?.isDijaminkan)}
              onChange={(e) => updateAsset('isDijaminkan', e.target.checked)}
            />
          </div>
        </div>
        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTambahAset}
            className="px-8 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95"
          >
            + Tambah Aset Lainnya
          </button>
        </div>
        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-2.5 border-r border-gray-200">Tipe Aset</th>
                <th className="p-2.5 border-r border-gray-200">Deskripsi / Lokasi</th>
                <th className="p-2.5 border-r border-gray-200">Luas Tanah / Bangunan</th>
                <th className="p-2.5 text-right border-r border-gray-200">Nilai Taksasi</th>
                <th className="p-2.5 text-center border-r border-gray-200">Status Jaminan</th>
                <th className="p-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {otherAssets.map((a) => (
                <tr key={a.id} className="hover:bg-amber-50/40">
                  <td className="p-2.5 font-semibold text-gray-900 border-r border-gray-200">{a.tipeAset}</td>
                  <td className="p-2.5 border-r border-gray-200">{a.lokasi}</td>
                  <td className="p-2.5 border-r border-gray-200">{a.luasTanah || '-'} / {a.luasBangunan || '-'}</td>
                  <td className="p-2.5 text-right font-mono font-semibold border-r border-gray-200">{a.nilaiTaksasi}</td>
                  <td className="p-2.5 text-center border-r border-gray-200">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.statusJaminan === 'Dijaminkan' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {a.statusJaminan}
                    </span>
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleHapusAset(a.id)}
                      className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FASILITAS PINJAMAN DI BANK LAIN (CuBES: PersonalInfoDE3.aspx - TXT_BANKNAMELOAN, txt_NO_KONTRAK, chk_STS_SPOUSE) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          3. Pinjaman di Bank Lain (Fasilitas Kredit Bank Lain)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">Nama Bank *</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <TextField
                    value={otherLoanForm?.namaBank || ''}
                    onChange={(e) => updateLoan('namaBank', e.target.value)}
                    placeholder="Nama bank kreditor"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCariBankLoan}
                  className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5"
                >
                  Cari
                </button>
              </div>
            </div>

            <TextField
              label="No. Kontrak / Perjanjian Kredit"
              value={otherLoanForm?.noKontrak || ''}
              onChange={(e) => updateLoan('noKontrak', e.target.value)}
              placeholder="Nomor kontrak pinjaman"
            />
            <SelectField
              label="Jenis Fasilitas Pinjaman"
              value={otherLoanForm?.jenisFasilitas || 'KPR'}
              onChange={(e) => updateLoan('jenisFasilitas', e.target.value)}
              options={[
                { label: 'KPR (Kredit Pemilikan Rumah)', value: 'KPR' },
                { label: 'KKB (Kredit Kendaraan Bermotor)', value: 'KKB' },
                { label: 'KTA (Kredit Tanpa Agunan)', value: 'KTA' },
                { label: 'Kredit Modal Kerja / Usaha', value: 'KMK' },
                { label: 'Pinjaman Koperasi / Multiguna', value: 'MULTIGUNA' },
              ]}
            />
            <CurrencyField
              label="Maksimum Kredit (Plafon Awal)"
              required
              value={otherLoanForm?.maksKredit || 0}
              onChangeValue={(val) => updateLoan('maksKredit', val)}
            />
            <DateField
              label="Tanggal Mulai Pinjaman"
              dayValue={otherLoanForm?.tglMulaiTgl || ''}
              monthValue={otherLoanForm?.tglMulaiBln || ''}
              yearValue={otherLoanForm?.tglMulaiThn || ''}
              onDayChange={(v) => updateLoan('tglMulaiTgl', v)}
              onMonthChange={(v) => updateLoan('tglMulaiBln', v)}
              onYearChange={(v) => updateLoan('tglMulaiThn', v)}
            />
          </div>

          <div className="space-y-3">
            <DateField
              label="Tanggal Berakhir Pinjaman"
              dayValue={otherLoanForm?.tglSelesaiTgl || ''}
              monthValue={otherLoanForm?.tglSelesaiBln || ''}
              yearValue={otherLoanForm?.tglSelesaiThn || ''}
              onDayChange={(v) => updateLoan('tglSelesaiTgl', v)}
              onMonthChange={(v) => updateLoan('tglSelesaiBln', v)}
              onYearChange={(v) => updateLoan('tglSelesaiThn', v)}
            />
            <CurrencyField
              label="Angsuran per Bulan"
              required
              value={otherLoanForm?.angsuran || 0}
              onChangeValue={(val) => updateLoan('angsuran', val)}
            />
            <TextField
              label="Sisa Jangka Waktu (Bulan)"
              type="number"
              value={otherLoanForm?.jangkaWaktu || ''}
              onChange={(e) => updateLoan('jangkaWaktu', e.target.value)}
              placeholder="Contoh: 60"
            />
            <SelectField
              label="Kolektibilitas / Status Pinjaman"
              value={otherLoanForm?.status || 'LANCAR'}
              onChange={(e) => updateLoan('status', e.target.value)}
              options={[
                { label: 'Kol 1 - Lancar', value: 'LANCAR' },
                { label: 'Kol 2 - Dalam Perhatian Khusus', value: 'DPK' },
                { label: 'Kol 3 - Kurang Lancar', value: 'KL' },
                { label: 'Kol 4 - Diragukan', value: 'DIRAGUKAN' },
                { label: 'Kol 5 - Macet', value: 'MACET' },
              ]}
            />
            {/* CuBES: chk_STS_SPOUSE (Pinjaman Pasangan) */}
            <CheckboxField
              label="Pinjaman Ini Atas Nama Pasangan (Bukan Debitur)"
              checked={Boolean(otherLoanForm?.pasangan)}
              onChange={(e) => updateLoan('pasangan', e.target.checked)}
            />
          </div>
        </div>

        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTambahOtherLoan}
            className="px-8 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95"
          >
            + Tambah Pinjaman Bank Lain
          </button>
        </div>

        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-2.5 border-r border-gray-200">Nama Bank</th>
                <th className="p-2.5 border-r border-gray-200">Jenis Fasilitas</th>
                <th className="p-2.5 text-right border-r border-gray-200">Maks Kredit</th>
                <th className="p-2.5 text-right border-r border-gray-200">Angsuran / Bln</th>
                <th className="p-2.5 text-center border-r border-gray-200">Tenor</th>
                <th className="p-2.5 text-center border-r border-gray-200">Debitur / Pasangan</th>
                <th className="p-2.5 text-center border-r border-gray-200">Status</th>
                <th className="p-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {otherLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400 italic">
                    Belum ada data pinjaman di bank lain.
                  </td>
                </tr>
              ) : (
                otherLoans.map((l) => (
                  <tr key={l.id} className="hover:bg-amber-50/40">
                    <td className="p-2.5 font-semibold text-gray-900 border-r border-gray-200">{l.bank}</td>
                    <td className="p-2.5 border-r border-gray-200">{l.fasilitas}</td>
                    <td className="p-2.5 text-right font-mono font-semibold border-r border-gray-200">
                      {typeof l.maksKredit === 'number' ? `Rp ${l.maksKredit.toLocaleString('id-ID')}` : l.maksKredit}
                    </td>
                    <td className="p-2.5 text-right font-mono border-r border-gray-200">
                      {typeof l.angsuran === 'number' ? `Rp ${l.angsuran.toLocaleString('id-ID')}` : l.angsuran}
                    </td>
                    <td className="p-2.5 text-center border-r border-gray-200">{l.jangkaWaktu} bln</td>
                    <td className="p-2.5 text-center border-r border-gray-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.isSpouse ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {l.isSpouse ? 'Pasangan' : 'Debitur'}
                      </span>
                    </td>
                    <td className="p-2.5 text-center border-r border-gray-200">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${l.status === 'LANCAR' || l.status === 'Kol 1 - Lancar' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleHapusLoan(l.id)}
                        className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FASILITAS KARTU KREDIT (CuBES: PersonalInfoDE3.aspx - TXT_BANKNAMECC, txt_cc_num, txt_cc_limit, outstand, tunggakan) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          4. Fasilitas Kartu Kredit (Credit Card)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">Nama Bank Penerbit *</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <TextField
                    value={creditCardForm?.namaBank || ''}
                    onChange={(e) => updateCC('namaBank', e.target.value)}
                    placeholder="Nama bank penerbit kartu kredit"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCariBankCC}
                  className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5"
                >
                  Cari
                </button>
              </div>
            </div>

            <TextField
              label="Nomor Kartu Kredit"
              required
              maxLength={16}
              value={creditCardForm?.noKartu || ''}
              onChange={(e) => updateCC('noKartu', e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="16 digit nomor kartu kredit"
            />
            <CurrencyField
              label="Limit Kartu Kredit"
              required
              value={creditCardForm?.limit || 0}
              onChangeValue={(val) => updateCC('limit', val)}
            />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Menjadi Nasabah Sejak (Bulan)"
                value={creditCardForm?.sejakBln || '1'}
                onChange={(e) => updateCC('sejakBln', e.target.value)}
                options={BULAN_OPTIONS}
              />
              <TextField
                label="Tahun"
                maxLength={4}
                value={creditCardForm?.sejakThn || ''}
                onChange={(e) => updateCC('sejakThn', e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="YYYY"
              />
            </div>
            <CurrencyField
              label="Baki Debet / Outstanding (Pemakaian)"
              value={creditCardForm?.outstanding || 0}
              onChangeValue={(val) => updateCC('outstanding', val)}
            />
            <CurrencyField
              label="Tunggakan Pembayaran"
              value={creditCardForm?.tunggakan || 0}
              onChangeValue={(val) => updateCC('tunggakan', val)}
            />
          </div>
        </div>

        <div className="flex justify-center py-2 bg-gray-50 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTambahCreditCard}
            className="px-8 py-1.5 bg-black hover:bg-slate-800 text-white font-bold text-xs rounded border border-slate-600 shadow cursor-pointer active:scale-95"
          >
            + Tambah Kartu Kredit
          </button>
        </div>

        <div className="overflow-x-auto border-t border-gray-200">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
              <tr>
                <th className="p-2.5 border-r border-gray-200">Nama Bank</th>
                <th className="p-2.5 border-r border-gray-200">No. Kartu</th>
                <th className="p-2.5 text-right border-r border-gray-200">Limit</th>
                <th className="p-2.5 text-center border-r border-gray-200">Sejak</th>
                <th className="p-2.5 text-right border-r border-gray-200">Outstanding</th>
                <th className="p-2.5 text-right border-r border-gray-200">Tunggakan</th>
                <th className="p-2.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {creditCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400 italic">
                    Belum ada data kartu kredit.
                  </td>
                </tr>
              ) : (
                creditCards.map((c) => (
                  <tr key={c.id} className="hover:bg-amber-50/40">
                    <td className="p-2.5 font-semibold text-gray-900 border-r border-gray-200">{c.bank}</td>
                    <td className="p-2.5 font-mono border-r border-gray-200">{c.noKartu}</td>
                    <td className="p-2.5 text-right font-mono font-semibold border-r border-gray-200">
                      {typeof c.limit === 'number' ? `Rp ${c.limit.toLocaleString('id-ID')}` : c.limit}
                    </td>
                    <td className="p-2.5 text-center border-r border-gray-200">{c.sejak}</td>
                    <td className="p-2.5 text-right font-mono border-r border-gray-200">
                      {typeof c.outstanding === 'number' ? `Rp ${c.outstanding.toLocaleString('id-ID')}` : c.outstanding}
                    </td>
                    <td className="p-2.5 text-right font-mono text-red-600 font-semibold border-r border-gray-200">
                      {typeof c.tunggakan === 'number' ? `Rp ${c.tunggakan.toLocaleString('id-ID')}` : c.tunggakan}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleHapusCC(c.id)}
                        className="text-red-600 hover:text-red-800 font-semibold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. REKANAN ASURANSI (CuBES: PersonalInfoDE3.aspx - DDL_PR_CODE, DDL_INSR_TYPE, LBL_INSR_CASH, LBL_INSR_CRED) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          5. Rekanan Asuransi & Premi Pembiayaan
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SelectField
              label="Perusahaan Rekanan Asuransi BNI"
              value={insuranceForm?.perusahaanAsuransi || 'BNI_LIFE'}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, perusahaanAsuransi: e.target.value })}
              options={[
                { label: 'PT. BNI Life Insurance', value: 'BNI_LIFE' },
                { label: 'PT. Asuransi Tri Pakarta', value: 'TRIPAKARTA' },
                { label: 'PT. Asuransi Jasa Indonesia (Jasindo)', value: 'JASINDO' },
                { label: 'PT. Asuransi Bangun Askrida', value: 'ASKRIDA' },
              ]}
            />
            <SelectField
              label="Jenis Pembayaran Premi Asuransi"
              value={insuranceForm?.tipePembayaranPremi || 'KREDIT'}
              onChange={(e) => setInsuranceForm({ ...insuranceForm, tipePembayaranPremi: e.target.value })}
              options={[
                { label: 'Ditambahkan ke Plafon Kredit (Dikreditkan)', value: 'KREDIT' },
                { label: 'Dibayar Tunai di Awal (Cash)', value: 'CASH' },
              ]}
            />
          </div>
          <div className="space-y-3">
            <CurrencyField
              label="Perkiraan Premi Asuransi Jiwa Kredit"
              value={insuranceForm?.premiAsuransiJiwa || 0}
              onChangeValue={(val) => setInsuranceForm({ ...insuranceForm, premiAsuransiJiwa: val })}
            />
            <CurrencyField
              label="Perkiraan Premi Asuransi Kerugian / Kebakaran"
              value={insuranceForm?.premiAsuransiKerugian || 0}
              onChangeValue={(val) => setInsuranceForm({ ...insuranceForm, premiAsuransiKerugian: val })}
            />
          </div>
        </div>
      </div>

      {onLanjut && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onLanjut}
            className="px-8 py-2.5 bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>Lanjut & Jalankan Pre-Screening</span>
            <span className="text-sm">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InformasiPerbankan;
