import React from 'react';
import { TextField, SelectField, CheckboxField, CurrencyField, DateField } from '@template/shared';

export interface PekerjaanPasanganProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onCariZipKantorPasangan?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const PekerjaanPasangan: React.FC<PekerjaanPasanganProps> = ({
  formData,
  onChange,
  onCariZipKantorPasangan,
  onLanjut,
}) => {
  const handleCariZip = () => {
    if (onCariZipKantorPasangan) onCariZipKantorPasangan();
    else if (formData?.kodeposKantorPasangan) onChange('kotaKantorPasangan', 'Petamburan JAKARTA');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center shadow-2xs">
          PEKERJAAN PASANGAN
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-xs bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <SelectField label="Tipe Pekerjaan" value={formData?.tipePekerjaanPasangan || ''} onChange={(e) => onChange('tipePekerjaanPasangan', e.target.value)} options={['Karyawan Tetap', 'Karyawan Kontrak', 'Wiraswasta', 'Profesional', 'PNS', 'TNI/Polri', 'BUMN', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            <SelectField label="Kepemilikan Perusahaan" value={formData?.kepemilikanPerusahaanPasangan || ''} onChange={(e) => onChange('kepemilikanPerusahaanPasangan', e.target.value)} options={['Bukan Pemilik', 'Pemilik Mayoritas (>50%)', 'Pemilik Minoritas (<=50%)'].map(v => ({ label: v, value: v }))} />
            <TextField label="Nama Perusahaan" value={formData?.namaPerusahaanPasangan || ''} onChange={(e) => onChange('namaPerusahaanPasangan', e.target.value)} placeholder="PT / CV / Instansi" />
            <TextField label="Alamat Perusahaan" value={formData?.alamatPerusahaanPasangan1 || ''} onChange={(e) => onChange('alamatPerusahaanPasangan1', e.target.value)} placeholder="Gedung, lantai, jalan" />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Kodepos" maxLength={10} value={formData?.kodeposKantorPasangan || ''} onChange={(e) => onChange('kodeposKantorPasangan', e.target.value)} placeholder="Contoh: 10260" />
              </div>
              <button type="button" onClick={handleCariZip} className="px-3 py-1.5 bg-[#F15A24] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
            </div>
            <TextField label="Kota" disabled value={formData?.kotaKantorPasangan || ''} onChange={(e) => onChange('kotaKantorPasangan', e.target.value)} placeholder="Kota otomatis terisi" />
            <SelectField label="Jabatan Pekerjaan" value={formData?.jabatanPekerjaanPasangan || ''} onChange={(e) => onChange('jabatanPekerjaanPasangan', e.target.value)} options={['TIDAK BEKERJA', 'Direktur / Pejabat Tinggi', 'Manager', 'Supervisor / Team Leader', 'Staff', 'Non-Staff / Pelaksana'].map(v => ({ label: v, value: v }))} />
            <SelectField label="Jenis Bidang Usaha" value={formData?.jenisBidangUsahaPasangan || ''} onChange={(e) => onChange('jenisBidangUsahaPasangan', e.target.value)} options={['Perdagangan', 'Manufaktur / Pabrik', 'Jasa Keuangan / Perbankan', 'Konstruksi / Properti', 'Teknologi Informasi', 'Pendidikan / Kesehatan', 'Pemerintahan', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Posisi" value={formData?.posisiPasangan || ''} onChange={(e) => onChange('posisiPasangan', e.target.value)} options={['Direktur', 'General Manager', 'Manager', 'Supervisor', 'Officer / Staff', 'Operator'].map(v => ({ label: v, value: v }))} />
              <TextField label="Departemen" value={formData?.departemenPasangan || ''} onChange={(e) => onChange('departemenPasangan', e.target.value)} placeholder="Divisi / Departemen" />
            </div>
            <TextField label="NIP / Employee ID" value={formData?.nipPasangan || ''} onChange={(e) => onChange('nipPasangan', e.target.value)} placeholder="Nomor Induk Pegawai" />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            <CheckboxField label="Join Income" checked={Boolean(formData?.joinIncomePasanganJob)} onChange={(e) => onChange('joinIncomePasanganJob', e.target.checked)} />
            <CurrencyField label="Pendapatan Pasangan (per Bulan)" value={formData?.pendapatanPasangan || 0} onChangeValue={(val) => onChange('pendapatanPasangan', val)} />
            <CurrencyField label="Pendapatan Lain Pasangan (per Bulan)" value={formData?.pendapatanLainPasangan || 0} onChangeValue={(val) => onChange('pendapatanLainPasangan', val)} />
            <CurrencyField label="Total Pendapatan Pasangan (per Bulan)" value={formData?.totalPendapatanPasangan || 0} onChangeValue={(val) => onChange('totalPendapatanPasangan', val)} />
            <SelectField label="Tipe Perusahaan" value={formData?.tipePerusahaanSekarangPasangan || ''} onChange={(e) => onChange('tipePerusahaanSekarangPasangan', e.target.value)} options={['BUMN', 'BUMD', 'PMA', 'Swasta Nasional', 'Instansi Pemerintah', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            <DateField label="Tanggal Mulai Bekerja" dayValue={formData?.tglMulaiBekerjaPasanganHari || ''} monthValue={formData?.tglMulaiBekerjaPasanganBulan || ''} yearValue={formData?.tglMulaiBekerjaPasanganTahun || ''} onDayChange={(v) => onChange('tglMulaiBekerjaPasanganHari', v)} onMonthChange={(v) => onChange('tglMulaiBekerjaPasanganBulan', v)} onYearChange={(v) => onChange('tglMulaiBekerjaPasanganTahun', v)} />
            <div className="grid grid-cols-4 gap-2">
              <TextField label="Area" maxLength={4} value={formData?.telpKantorPasanganArea || ''} onChange={(e) => onChange('telpKantorPasanganArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="No. Telp Kantor" value={formData?.telpKantorPasanganNumber || ''} onChange={(e) => onChange('telpKantorPasanganNumber', e.target.value)} placeholder="1234567" />
              </div>
              <TextField label="Ext" maxLength={6} value={formData?.telpKantorPasanganExt || ''} onChange={(e) => onChange('telpKantorPasanganExt', e.target.value)} placeholder="101" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Email Kantor" type="email" value={formData?.emailKantorPasangan || ''} onChange={(e) => onChange('emailKantorPasangan', e.target.value)} placeholder="office@company.com" />
              <TextField label="NPWP Perusahaan" value={formData?.npwpPerusahaanPasangan || ''} onChange={(e) => onChange('npwpPerusahaanPasangan', e.target.value)} placeholder="NPWP Perusahaan" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Lama Bekerja (Tahun)" value={formData?.lamaBekerjaPasanganTahun || ''} onChange={(e) => onChange('lamaBekerjaPasanganTahun', e.target.value)} placeholder="Tahun" />
              <TextField label="Lama Bekerja (Bulan)" value={formData?.lamaBekerjaPasanganBulan || ''} onChange={(e) => onChange('lamaBekerjaPasanganBulan', e.target.value)} placeholder="Bulan" />
            </div>
            <TextField label="Perusahaan Sebelumnya" value={formData?.namaPerusahaanSebelumnyaPasangan || ''} onChange={(e) => onChange('namaPerusahaanSebelumnyaPasangan', e.target.value)} placeholder="Nama perusahaan sebelumnya (opsional)" />
          </div>
        </div>
      </div>

      {onLanjut && (
        <div className="flex justify-end pt-2">
          <button type="button" onClick={onLanjut} className="px-6 py-2 bg-gradient-to-r from-[#F15A24] to-[#E05A10] hover:from-[#E05A10] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer active:scale-95">Lanjut</button>
        </div>
      )}
    </div>
  );
};

export default PekerjaanPasangan;
