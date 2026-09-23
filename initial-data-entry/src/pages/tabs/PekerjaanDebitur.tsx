import React from 'react';
import { TextField, SelectField, CurrencyField, DateField } from '@template/shared';

export interface PekerjaanDebiturProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onCariZipPerusahaan?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const PekerjaanDebitur: React.FC<PekerjaanDebiturProps> = ({
  formData,
  onChange,
  onCariZipPerusahaan,
  onLanjut,
}) => {
  const handleCariZip = () => {
    if (onCariZipPerusahaan) onCariZipPerusahaan();
    else if (formData?.kodeposPerusahaan) onChange('kotaPerusahaan', 'Petamburan JAKARTA');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-[#007b83] rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-teal-700 via-[#007b83] to-teal-800 px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center shadow-2xs">
          PEKERJAAN DEBITUR
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-xs bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <DateField label="Tanggal Mulai Bekerja" dayValue={formData?.tglMulaiBekerjaHari || ''} monthValue={formData?.tglMulaiBekerjaBulan || ''} yearValue={formData?.tglMulaiBekerjaTahun || ''} onDayChange={(v) => onChange('tglMulaiBekerjaHari', v)} onMonthChange={(v) => onChange('tglMulaiBekerjaBulan', v)} onYearChange={(v) => onChange('tglMulaiBekerjaTahun', v)} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Tipe Pekerjaan" required value={formData?.tipePekerjaan || ''} onChange={(e) => onChange('tipePekerjaan', e.target.value)} options={['Karyawan Tetap', 'Karyawan Kontrak', 'Wiraswasta', 'Profesional', 'PNS', 'TNI/Polri', 'BUMN', 'Lainnya'].map(v => ({ label: v, value: v }))} />
              <SelectField label="Sumber Penghasilan" required value={formData?.sumberPenghasilan || ''} onChange={(e) => onChange('sumberPenghasilan', e.target.value)} options={['Gaji / Payroll', 'Hasil Usaha', 'Investasi', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Kepemilikan Perusahaan" value={formData?.kepemilikanPerusahaan || ''} onChange={(e) => onChange('kepemilikanPerusahaan', e.target.value)} options={['Bukan Pemilik', 'Pemilik Mayoritas (>50%)', 'Pemilik Minoritas (<=50%)'].map(v => ({ label: v, value: v }))} />
              <SelectField label="Kerjasama PKS" value={formData?.jenisKerjasamaPks || ''} onChange={(e) => onChange('jenisKerjasamaPks', e.target.value)} options={['Non - PKS', 'PKS Mitra Karya', 'PKS Instansi'].map(v => ({ label: v, value: v }))} />
            </div>
            <SelectField label="Status Pekerja" value={formData?.statusPekerjaPemohon || ''} onChange={(e) => onChange('statusPekerjaPemohon', e.target.value)} options={['Tetap', 'Kontrak', 'Outsourcing'].map(v => ({ label: v, value: v }))} />
            <TextField label="Nama Perusahaan" required value={formData?.namaPerusahaan || ''} onChange={(e) => onChange('namaPerusahaan', e.target.value)} placeholder="PT / CV / Instansi" />
            <TextField label="Alamat Perusahaan" value={formData?.alamatPerusahaan1 || ''} onChange={(e) => onChange('alamatPerusahaan1', e.target.value)} placeholder="Gedung, lantai, jalan" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="RT" maxLength={5} value={formData?.rtPerusahaan || ''} onChange={(e) => onChange('rtPerusahaan', e.target.value)} placeholder="001" />
              <TextField label="RW" maxLength={5} value={formData?.rwPerusahaan || ''} onChange={(e) => onChange('rwPerusahaan', e.target.value)} placeholder="002" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Kodepos" maxLength={10} value={formData?.kodeposPerusahaan || ''} onChange={(e) => onChange('kodeposPerusahaan', e.target.value)} placeholder="Contoh: 10260" />
              </div>
              <button type="button" onClick={handleCariZip} className="px-3 py-1.5 bg-[#007b83] hover:bg-teal-800 text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
            </div>
            <TextField label="Kota" disabled value={formData?.kotaPerusahaan || ''} onChange={(e) => onChange('kotaPerusahaan', e.target.value)} placeholder="Kota otomatis terisi" />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Jabatan" value={formData?.jabatanPekerjaan || ''} onChange={(e) => onChange('jabatanPekerjaan', e.target.value)} options={['Direktur / Pejabat Tinggi', 'Manager', 'Supervisor / Team Leader', 'Staff', 'Non-Staff / Pelaksana'].map(v => ({ label: v, value: v }))} />
              <SelectField label="Bidang Usaha" value={formData?.jenisBidangUsaha || ''} onChange={(e) => onChange('jenisBidangUsaha', e.target.value)} options={['Perdagangan', 'Manufaktur / Pabrik', 'Jasa Keuangan / Perbankan', 'Konstruksi / Properti', 'Teknologi Informasi', 'Pendidikan / Kesehatan', 'Pemerintahan', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Posisi" value={formData?.posisi || ''} onChange={(e) => onChange('posisi', e.target.value)} options={['Direktur', 'General Manager', 'Manager', 'Supervisor', 'Officer / Staff', 'Operator'].map(v => ({ label: v, value: v }))} />
              <TextField label="Departemen" value={formData?.departemen || ''} onChange={(e) => onChange('departemen', e.target.value)} placeholder="Divisi / Departemen" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="NIP" value={formData?.nip || ''} onChange={(e) => onChange('nip', e.target.value)} placeholder="Nomor Induk Pegawai" />
              <TextField label="Umur Pensiun" type="number" value={formData?.umurPensiun || ''} onChange={(e) => onChange('umurPensiun', e.target.value)} placeholder="55" />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            <CurrencyField label="Pendapatan Pokok (per Bulan)" required value={formData?.pendapatanPokok || 0} onChangeValue={(val) => onChange('pendapatanPokok', val)} />
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Pendapatan Lain" value={formData?.pendapatanLain || 0} onChangeValue={(val) => onChange('pendapatanLain', val)} />
              <TextField label="Asal Pendapatan Lain" value={formData?.asalPendapatanLain || ''} onChange={(e) => onChange('asalPendapatanLain', e.target.value)} placeholder="Bonus, sewa, dll" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField label="Total Pendapatan" value={formData?.totalPendapatan || 0} onChangeValue={(val) => onChange('totalPendapatan', val)} />
              <CurrencyField label="Total Pengeluaran" value={formData?.totalExpenses || 0} onChangeValue={(val) => onChange('totalExpenses', val)} />
            </div>
            <CurrencyField label="Tunjangan Hari Tua (THT)" value={formData?.tunjanganHariTua || 0} onChangeValue={(val) => onChange('tunjanganHariTua', val)} />
            <SelectField label="Tipe Perusahaan" value={formData?.tipePerusahaanSekarang || ''} onChange={(e) => onChange('tipePerusahaanSekarang', e.target.value)} options={['BUMN', 'BUMD', 'PMA', 'Swasta Nasional', 'Instansi Pemerintah', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            <div className="grid grid-cols-4 gap-2">
              <TextField label="Area" maxLength={4} value={formData?.telpPerusahaanArea || ''} onChange={(e) => onChange('telpPerusahaanArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="No. Telp Perusahaan" value={formData?.telpPerusahaanNumber || ''} onChange={(e) => onChange('telpPerusahaanNumber', e.target.value)} placeholder="1234567" />
              </div>
              <TextField label="Ext" maxLength={6} value={formData?.telpPerusahaanExt || ''} onChange={(e) => onChange('telpPerusahaanExt', e.target.value)} placeholder="101" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Email Perusahaan" type="email" value={formData?.emailPerusahaan || ''} onChange={(e) => onChange('emailPerusahaan', e.target.value)} placeholder="company@domain.com" />
              <TextField label="NPWP Perusahaan" value={formData?.npwpPerusahaan || ''} onChange={(e) => onChange('npwpPerusahaan', e.target.value)} placeholder="NPWP Perusahaan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Lama Bekerja (Thn)" value={formData?.lamaBekerjaTahun || ''} onChange={(e) => onChange('lamaBekerjaTahun', e.target.value)} placeholder="Tahun" />
              <TextField label="Lama Bekerja (Bln)" value={formData?.lamaBekerjaBulan || ''} onChange={(e) => onChange('lamaBekerjaBulan', e.target.value)} placeholder="Bulan" />
            </div>
            <SelectField label="Area Perusahaan" value={formData?.areaPerusahaan || ''} onChange={(e) => onChange('areaPerusahaan', e.target.value)} options={['JAKARTA', 'BODETABEK', 'JAWA BARAT', 'JAWA TENGAH', 'JAWA TIMUR', 'LUAR JAWA'].map(v => ({ label: v, value: v }))} />
            <TextField label="Perusahaan Sebelumnya" value={formData?.namaPerusahaanSebelumnya || ''} onChange={(e) => onChange('namaPerusahaanSebelumnya', e.target.value)} placeholder="Nama perusahaan sebelumnya (opsional)" />
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

export default PekerjaanDebitur;
