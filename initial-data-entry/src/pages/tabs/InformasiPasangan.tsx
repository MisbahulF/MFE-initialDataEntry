import React from 'react';
import { TextField, SelectField, CheckboxField, DateField } from '@template/shared';

export interface InformasiPasanganProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onCariZipPasangan?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const InformasiPasangan: React.FC<InformasiPasanganProps> = ({
  formData,
  onChange,
  onCariZipPasangan,
  onLanjut,
}) => {
  const handleCariZip = () => {
    if (onCariZipPasangan) onCariZipPasangan();
    else if (formData?.kodeposPasangan) onChange('kotaPasangan', 'Petamburan JAKARTA');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-[#007b83] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 via-[#007b83] to-teal-800 px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center shadow-2xs">
          INFORMASI PASANGAN
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-xs bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <CheckboxField label="Join Income" checked={Boolean(formData?.joinIncomePasangan)} onChange={(e) => onChange('joinIncomePasangan', e.target.checked)} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Gelar Sebelum" value={formData?.gelarSebelumPasangan || ''} onChange={(e) => onChange('gelarSebelumPasangan', e.target.value)} placeholder="Dr., Ir." />
              <TextField label="Gelar Setelah" value={formData?.gelarSetelahPasangan || ''} onChange={(e) => onChange('gelarSetelahPasangan', e.target.value)} placeholder="S.Kom, M.M." />
            </div>
            <TextField label="Nama Depan" required value={formData?.namaDepanPasangan || ''} onChange={(e) => onChange('namaDepanPasangan', e.target.value)} placeholder="Nama depan pasangan" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Nama Tengah" value={formData?.namaTengahPasangan || ''} onChange={(e) => onChange('namaTengahPasangan', e.target.value)} placeholder="Nama tengah" />
              <TextField label="Nama Belakang" value={formData?.namaBelakangPasangan || ''} onChange={(e) => onChange('namaBelakangPasangan', e.target.value)} placeholder="Nama belakang" />
            </div>
            <TextField label="Nama Ibu Kandung" value={formData?.namaIbuKandungPasangan || ''} onChange={(e) => onChange('namaIbuKandungPasangan', e.target.value)} placeholder="Nama ibu kandung pasangan" />
            <TextField label="Alamat KTP" value={formData?.alamatKtpPasangan || ''} onChange={(e) => onChange('alamatKtpPasangan', e.target.value)} placeholder="Jalan, RT/RW, No. Rumah" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Kelurahan" value={formData?.kelurahanPasangan || ''} onChange={(e) => onChange('kelurahanPasangan', e.target.value)} placeholder="Kelurahan" />
              <TextField label="Kecamatan" value={formData?.kecamatanPasangan || ''} onChange={(e) => onChange('kecamatanPasangan', e.target.value)} placeholder="Kecamatan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="RT" maxLength={5} value={formData?.rtPasangan || ''} onChange={(e) => onChange('rtPasangan', e.target.value)} placeholder="001" />
              <TextField label="RW" maxLength={5} value={formData?.rwPasangan || ''} onChange={(e) => onChange('rwPasangan', e.target.value)} placeholder="002" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Kodepos" maxLength={10} value={formData?.kodeposPasangan || ''} onChange={(e) => onChange('kodeposPasangan', e.target.value)} placeholder="Contoh: 10260" />
              </div>
              <button type="button" onClick={handleCariZip} className="px-3 py-1.5 bg-[#007b83] hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
            </div>
            <TextField label="Kota" disabled value={formData?.kotaPasangan || ''} onChange={(e) => onChange('kotaPasangan', e.target.value)} placeholder="Kota otomatis terisi" />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            <TextField label="Tempat Lahir" value={formData?.tempatLahirPasangan || ''} onChange={(e) => onChange('tempatLahirPasangan', e.target.value)} placeholder="Kota lahir" />
            <DateField label="Tanggal Lahir" dayValue={formData?.tglLahirPasanganHari || ''} monthValue={formData?.tglLahirPasanganBulan || ''} yearValue={formData?.tglLahirPasanganTahun || ''} onDayChange={(v) => onChange('tglLahirPasanganHari', v)} onMonthChange={(v) => onChange('tglLahirPasanganBulan', v)} onYearChange={(v) => onChange('tglLahirPasanganTahun', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Kebangsaan" value={formData?.kebangsaanPasangan || ''} onChange={(e) => onChange('kebangsaanPasangan', e.target.value)} options={[{ label: 'WNI', value: 'WNI' }, { label: 'WNA', value: 'WNA' }]} />
              <SelectField label="Pendidikan" value={formData?.pendidikanPasangan || ''} onChange={(e) => onChange('pendidikanPasangan', e.target.value)} options={['SD', 'SMP', 'SMA/SMK', 'DIPLOMA (D1-D4)', 'SARJANA (S1)', 'PASCASARJANA (S2)', 'DOKTOR (S3)'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Email" type="email" value={formData?.emailPasangan || ''} onChange={(e) => onChange('emailPasangan', e.target.value)} placeholder="pasangan@email.com" />
              <TextField label="No. Handphone" value={formData?.noHpPasangan || ''} onChange={(e) => onChange('noHpPasangan', e.target.value)} placeholder="0812xxxxxxxx" />
            </div>
            <TextField label="No. KTP" maxLength={16} value={formData?.noKtpPasangan || ''} onChange={(e) => onChange('noKtpPasangan', e.target.value)} placeholder="16 digit nomor KTP" />
            <CheckboxField label="Seumur Hidup" checked={Boolean(formData?.isSeumurHidupPasangan)} onChange={(e) => onChange('isSeumurHidupPasangan', e.target.checked)} />
            <DateField label="Tanggal Terbit KTP" dayValue={formData?.tglTerbitKtpPasanganHari || ''} monthValue={formData?.tglTerbitKtpPasanganBulan || ''} yearValue={formData?.tglTerbitKtpPasanganTahun || ''} onDayChange={(v) => onChange('tglTerbitKtpPasanganHari', v)} onMonthChange={(v) => onChange('tglTerbitKtpPasanganBulan', v)} onYearChange={(v) => onChange('tglTerbitKtpPasanganTahun', v)} />
            {!formData?.isSeumurHidupPasangan && (
              <DateField label="Masa Berlaku KTP" dayValue={formData?.masaBerlakuKtpPasanganHari || ''} monthValue={formData?.masaBerlakuKtpPasanganBulan || ''} yearValue={formData?.masaBerlakuKtpPasanganTahun || ''} onDayChange={(v) => onChange('masaBerlakuKtpPasanganHari', v)} onMonthChange={(v) => onChange('masaBerlakuKtpPasanganBulan', v)} onYearChange={(v) => onChange('masaBerlakuKtpPasanganTahun', v)} />
            )}
            <TextField label="No. Paspor" value={formData?.pasporPasangan || ''} onChange={(e) => onChange('pasporPasangan', e.target.value)} placeholder="Nomor paspor (opsional)" />
            <DateField label="Tanggal Terbit Paspor" dayValue={formData?.tglTerbitPasporPasanganHari || ''} monthValue={formData?.tglTerbitPasporPasanganBulan || ''} yearValue={formData?.tglTerbitPasporPasanganTahun || ''} onDayChange={(v) => onChange('tglTerbitPasporPasanganHari', v)} onMonthChange={(v) => onChange('tglTerbitPasporPasanganBulan', v)} onYearChange={(v) => onChange('tglTerbitPasporPasanganTahun', v)} />
            <DateField label="Masa Berlaku Paspor" dayValue={formData?.masaBerlakuPasporPasanganHari || ''} monthValue={formData?.masaBerlakuPasporPasanganBulan || ''} yearValue={formData?.masaBerlakuPasporPasanganTahun || ''} onDayChange={(v) => onChange('masaBerlakuPasporPasanganHari', v)} onMonthChange={(v) => onChange('masaBerlakuPasporPasanganBulan', v)} onYearChange={(v) => onChange('masaBerlakuPasporPasanganTahun', v)} />
            <TextField label="NPWP" value={formData?.npwpPasangan || ''} onChange={(e) => onChange('npwpPasangan', e.target.value)} placeholder="Nomor Pokok Wajib Pajak" />
          </div>
        </div>
      </div>

      {onLanjut && (
        <div className="flex justify-end pt-2">
          <button type="button" onClick={onLanjut} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer active:scale-95">Lanjut</button>
        </div>
      )}
    </div>
  );
};

export default InformasiPasangan;
