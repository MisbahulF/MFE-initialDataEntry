import React, { useState, useEffect } from 'react';
import {
  TextField,
  SelectField,
  CurrencyField,
  DateField,
  CheckboxField
} from '@template/shared';
import { SearchPartnerModal } from '../../components/SearchPartnerModal';

interface PekerjaanDebiturProps {
  formData?: any;
  onChange: (field: string, value: any) => void;
  onLanjut?: () => void;
  onCariZip?: () => void;
  onCariZipPerusahaan?: () => void;
}

export const PekerjaanDebitur: React.FC<PekerjaanDebiturProps> = ({
  formData,
  onChange,
  onLanjut,
  onCariZip,
  onCariZipPerusahaan,
}) => {
  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false);
  const [isCgModalOpen, setIsCgModalOpen] = useState(false);

  // CuBES Job Type: 01 = Karyawan / Pegawai, 02 = Wiraswasta, 03 = Profesional
  const jobType = formData?.tipePekerjaan || '01';
  const isEmployee = jobType === '01';
  const isNotEmployee = jobType === '02' || jobType === '03';

  // PKS Flag: 1 = PKS Kerjasama Institusi, 2 = Non PKS
  const pksFlag = formData?.jenisKerjasamaPks || '1';

  // Mode Gaji: Netto vs Gross, Month vs Year
  const salaryMode = formData?.salaryMode || 'NETTO'; // 'NETTO' | 'GROSS'
  const salaryPeriod = formData?.salaryPeriod || 'MONTH'; // 'MONTH' | 'YEAR'

  // Hitung Total Pendapatan otomatis: Pendapatan Pokok + Pendapatan Lain
  useEffect(() => {
    const pokok = Number(formData?.pendapatanPokok) || 0;
    const lain = Number(formData?.pendapatanLain) || 0;
    const total = pokok + lain;
    if (formData?.totalPendapatan !== total) {
      onChange('totalPendapatan', total);
    }
  }, [formData?.pendapatanPokok, formData?.pendapatanLain]);

  // Hitung Total Pengalaman Kerja otomatis: Lama bekerja sekarang + lama bekerja sebelumnya
  useEffect(() => {
    const thnNow = Number(formData?.lamaBekerjaTahun) || 0;
    const blnNow = Number(formData?.lamaBekerjaBulan) || 0;
    const thnPrev = Number(formData?.lamaBekerjaSebelumnyaTahun) || 0;
    const blnPrev = Number(formData?.lamaBekerjaSebelumnyaBulan) || 0;
    
    let totalBln = blnNow + blnPrev;
    let totalThn = thnNow + thnPrev + Math.floor(totalBln / 12);
    totalBln = totalBln % 12;

    const totLifeStr = `${totalThn} Tahun ${totalBln} Bulan`;
    if (formData?.totalPengalamanKerja !== totLifeStr) {
      onChange('totalPengalamanKerja', totLifeStr);
    }
  }, [
    formData?.lamaBekerjaTahun,
    formData?.lamaBekerjaBulan,
    formData?.lamaBekerjaSebelumnyaTahun,
    formData?.lamaBekerjaSebelumnyaBulan,
  ]);

  const lookupZipcodeAuto = async (zip: string) => {
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?keyword=${zip}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          onChange('kotaPerusahaan', item.city || item.kota || '');
          if (item.kecamatan && !formData?.kecamatanPerusahaan) onChange('kecamatanPerusahaan', item.kecamatan);
          if (item.kelurahan && !formData?.kelurahanPerusahaan) onChange('kelurahanPerusahaan', item.kelurahan);
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleCariZip = () => {
    if (onCariZipPerusahaan) onCariZipPerusahaan();
    else if (onCariZip) onCariZip();
    else if (formData?.kodeposPerusahaan) lookupZipcodeAuto(formData.kodeposPerusahaan);
  };

  return (
    <div className="space-y-6">
      {/* 1. INFORMASI PEKERJAAN UTAMA */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          Pekerjaan Debitur
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            {/* Tanggal Mulai Bekerja (CuBES: txt_EMPLOYMENT_DATE) */}
            <DateField
              label="Tanggal Mulai Bekerja / Pengangkatan"
              dayValue={formData?.tglMulaiBekerjaHari || ''}
              monthValue={formData?.tglMulaiBekerjaBulan || ''}
              yearValue={formData?.tglMulaiBekerjaTahun || ''}
              onDayChange={(v) => onChange('tglMulaiBekerjaHari', v)}
              onMonthChange={(v) => onChange('tglMulaiBekerjaBulan', v)}
              onYearChange={(v) => onChange('tglMulaiBekerjaTahun', v)}
            />

            {/* Tipe Pekerjaan (CuBES: ddl_job_type_id) */}
            <SelectField
              label="Tipe Pekerjaan"
              required
              value={jobType}
              onChange={(e) => onChange('tipePekerjaan', e.target.value)}
              options={[
                { label: 'Karyawan / Pegawai', value: '01' },
                { label: 'Wiraswasta / Pengusaha', value: '02' },
                { label: 'Profesional', value: '03' },
              ]}
            />

            {/* Sumber Penghasilan */}
            <SelectField
              label="Sumber Penghasilan"
              value={formData?.sumberPenghasilan || 'GAJI'}
              onChange={(e) => onChange('sumberPenghasilan', e.target.value)}
              options={[
                { label: 'Gaji / Payroll', value: 'GAJI' },
                { label: 'Hasil Usaha / Bisnis', value: 'USAHA' },
                { label: 'Fee Profesional', value: 'FEE' },
                { label: 'Lainnya', value: 'LAINNYA' },
              ]}
            />

            {/* Bentuk Badan Usaha & Kepemilikan (CuBES: ddl_cp_code) */}
            <SelectField
              label="Bentuk Badan Usaha"
              value={formData?.bentukBadanUsaha || ''}
              onChange={(e) => onChange('bentukBadanUsaha', e.target.value)}
              options={[
                { label: '- SELECT -', value: '' },
                { label: 'PT (Perseroan Terbatas)', value: 'PT' },
                { label: 'CV (Persekutuan Komanditer)', value: 'CV' },
                { label: 'BUMN / BUMD', value: 'BUMN' },
                { label: 'Koperasi / Yayasan', value: 'KOP' },
                { label: 'Instansi Pemerintah / Kementerian', value: 'GOV' },
                { label: 'TNI / POLRI', value: 'APARAT' },
                { label: 'Perorangan / Toko / Dagang', value: 'PERORANGAN' },
              ]}
            />

            {/* Jika Wiraswasta: Pemilik Usaha & % Kepemilikan (CuBES: txt_cu_pemilik_usaha, txt_cu_ofownprs) */}
            {isNotEmployee && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-3">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">Data Kepemilikan Usaha</div>
                <TextField
                  label="Pemilik Usaha"
                  value={formData?.pemilikUsaha || ''}
                  onChange={(e) => onChange('pemilikUsaha', e.target.value)}
                  placeholder="Nama pemilik usaha"
                />
                <TextField
                  label="Persentase Kepemilikan Saham (%)"
                  type="number"
                  maxLength={3}
                  value={formData?.persenKepemilikanSaham || ''}
                  onChange={(e) => onChange('persenKepemilikanSaham', e.target.value)}
                  placeholder="Contoh: 100"
                />
              </div>
            )}

            {/* Jenis Kerjasama PKS (CuBES: RDO_PKS) */}
            <SelectField
              label="Jenis Kerjasama PKS"
              value={pksFlag}
              onChange={(e) => onChange('jenisKerjasamaPks', e.target.value)}
              options={[
                { label: 'PKS Kerjasama Institusi', value: '1' },
                { label: 'Non PKS / Non Kerjasama', value: '2' },
              ]}
            />

            {/* Jika PKS: Instansi Rekanan BNI (CuBES: TXT_INSTCODE & TXT_INSTDESC) */}
            {pksFlag === '1' ? (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Nama Institusi / Mitra Karya BNI *</label>
                <div className="flex gap-2">
                  <div className="w-24 shrink-0">
                    <TextField
                      value={formData?.kodeInstansi || ''}
                      disabled
                      placeholder="Kode"
                    />
                  </div>
                  <div className="flex-1">
                    <TextField
                      value={formData?.namaPerusahaan || ''}
                      disabled
                      placeholder="Pilih dari daftar rekanan BNI"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMitraModalOpen(true)}
                    className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5"
                  >
                    Cari
                  </button>
                </div>
              </div>
            ) : (
              <TextField
                label="Nama Perusahaan / Tempat Bekerja"
                required
                value={formData?.namaPerusahaan || ''}
                onChange={(e) => onChange('namaPerusahaan', e.target.value)}
                placeholder="Nama instansi/perusahaan tempat bekerja"
              />
            )}

            {/* Status Pekerja Pemohon (CuBES: ddl_status_pekerja_pemohon) */}
            {isEmployee && (
              <SelectField
                label="Status Kepegawaian Pemohon"
                value={formData?.statusPekerjaPemohon || 'TETAP'}
                onChange={(e) => onChange('statusPekerjaPemohon', e.target.value)}
                options={[
                  { label: 'Pegawai Tetap (Permanent)', value: 'TETAP' },
                  { label: 'Pegawai Kontrak (PKWT)', value: 'KONTRAK' },
                  { label: 'Outsourcing', value: 'OUTSOURCING' },
                ]}
              />
            )}

            {/* Alamat Kantor 1, 2, 3 */}
            <TextField
              label="Alamat Kantor (Baris 1)"
              required
              value={formData?.alamatPerusahaan || ''}
              onChange={(e) => onChange('alamatPerusahaan', e.target.value)}
              placeholder="Gedung, Jalan, No."
            />
            <TextField
              label="Alamat Kantor (Baris 2)"
              value={formData?.alamatPerusahaan2 || ''}
              onChange={(e) => onChange('alamatPerusahaan2', e.target.value)}
              placeholder="Kompleks / Blok (opsional)"
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Kelurahan"
                value={formData?.kelurahanPerusahaan || ''}
                onChange={(e) => onChange('kelurahanPerusahaan', e.target.value)}
                placeholder="Kelurahan"
              />
              <TextField
                label="Kecamatan"
                value={formData?.kecamatanPerusahaan || ''}
                onChange={(e) => onChange('kecamatanPerusahaan', e.target.value)}
                placeholder="Kecamatan"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="RT"
                maxLength={5}
                value={formData?.rtPerusahaan || ''}
                onChange={(e) => onChange('rtPerusahaan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="001"
              />
              <TextField
                label="RW"
                maxLength={5}
                value={formData?.rwPerusahaan || ''}
                onChange={(e) => onChange('rwPerusahaan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="002"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField
                  label="Kodepos"
                  maxLength={10}
                  value={formData?.kodeposPerusahaan || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onChange('kodeposPerusahaan', val);
                    if (val.length === 5) lookupZipcodeAuto(val);
                  }}
                  placeholder="Contoh: 10260"
                />
              </div>
              <button
                type="button"
                onClick={handleCariZip}
                className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5"
              >
                Cari
              </button>
            </div>
            <TextField
              label="Kota"
              disabled
              value={formData?.kotaPerusahaan || ''}
              onChange={(e) => onChange('kotaPerusahaan', e.target.value)}
              placeholder="Kota otomatis terisi"
            />

            {/* Jabatan & Bidang Usaha */}
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Jabatan Pekerjaan"
                value={formData?.jabatanPekerjaan || ''}
                onChange={(e) => onChange('jabatanPekerjaan', e.target.value)}
                options={[
                  { label: '- SELECT -', value: '' },
                  { label: 'Direktur / Pejabat Tinggi', value: 'Direktur / Pejabat Tinggi' },
                  { label: 'General Manager', value: 'General Manager' },
                  { label: 'Manager', value: 'Manager' },
                  { label: 'Supervisor / Team Leader', value: 'Supervisor / Team Leader' },
                  { label: 'Staff / Officer', value: 'Staff' },
                  { label: 'Non-Staff / Pelaksana', value: 'Non-Staff / Pelaksana' },
                ]}
              />
              <SelectField
                label="Jenis Bidang Usaha"
                value={formData?.jenisBidangUsaha || ''}
                onChange={(e) => onChange('jenisBidangUsaha', e.target.value)}
                options={[
                  { label: '- SELECT -', value: '' },
                  { label: 'Perdagangan', value: 'Perdagangan' },
                  { label: 'Manufaktur / Pabrik', value: 'Manufaktur / Pabrik' },
                  { label: 'Jasa Keuangan / Perbankan', value: 'Jasa Keuangan / Perbankan' },
                  { label: 'Konstruksi / Properti', value: 'Konstruksi / Properti' },
                  { label: 'Teknologi Informasi', value: 'Teknologi Informasi' },
                  { label: 'Pendidikan / Kesehatan', value: 'Pendidikan / Kesehatan' },
                  { label: 'Pemerintahan / Publik', value: 'Pemerintahan' },
                  { label: 'Lainnya', value: 'Lainnya' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Posisi / Detail Jabatan"
                value={formData?.posisi || ''}
                onChange={(e) => onChange('posisi', e.target.value)}
                placeholder="Kepala Divisi, Sales, dll"
              />
              <TextField
                label="Departemen / Divisi"
                value={formData?.departemen || ''}
                onChange={(e) => onChange('departemen', e.target.value)}
                placeholder="Finance, IT, Operasional"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="NIP / No. Induk Pegawai"
                value={formData?.nip || ''}
                onChange={(e) => onChange('nip', e.target.value)}
                placeholder="NIP / Employee ID"
              />
              <TextField
                label="Usia Pensiun (Tahun)"
                type="number"
                value={formData?.umurPensiun || ''}
                onChange={(e) => onChange('umurPensiun', e.target.value)}
                placeholder="55"
              />
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            {/* Mode Gaji (CuBES: rb_netto, rb_gross, rb_month, rb_year) */}
            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Basis Perhitungan Penghasilan</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryMode"
                      checked={salaryMode === 'NETTO'}
                      onChange={() => onChange('salaryMode', 'NETTO')}
                      className="text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    Netto (Bersih)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryMode"
                      checked={salaryMode === 'GROSS'}
                      onChange={() => onChange('salaryMode', 'GROSS')}
                      className="text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    Gross (Kotor)
                  </label>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryPeriod"
                      checked={salaryPeriod === 'MONTH'}
                      onChange={() => onChange('salaryPeriod', 'MONTH')}
                      className="text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    Bulanan
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="salaryPeriod"
                      checked={salaryPeriod === 'YEAR'}
                      onChange={() => onChange('salaryPeriod', 'YEAR')}
                      className="text-[#C2410C] focus:ring-[#C2410C]"
                    />
                    Tahunan
                  </label>
                </div>
              </div>
            </div>

            {/* Pendapatan Pokok */}
            <CurrencyField
              label={`Pendapatan Pokok (${salaryMode === 'NETTO' ? 'Netto' : 'Gross'} per ${salaryPeriod === 'MONTH' ? 'Bulan' : 'Tahun'})`}
              required
              value={formData?.pendapatanPokok || 0}
              onChangeValue={(val) => onChange('pendapatanPokok', val)}
            />

            {/* Pendapatan Lain & Asal */}
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label="Pendapatan Lain (per Bulan)"
                value={formData?.pendapatanLain || 0}
                onChangeValue={(val) => onChange('pendapatanLain', val)}
              />
              <TextField
                label="Asal Pendapatan Lain"
                value={formData?.asalPendapatanLain || ''}
                onChange={(e) => onChange('asalPendapatanLain', e.target.value)}
                placeholder="Bonus, sewa, dividen"
              />
            </div>

            {/* Total Pendapatan & Pengeluaran */}
            <div className="grid grid-cols-2 gap-3">
              <CurrencyField
                label="Total Pendapatan (per Bulan)"
                value={formData?.totalPendapatan || 0}
                onChangeValue={(val) => onChange('totalPendapatan', val)}
              />
              <CurrencyField
                label="Total Expenses / Pengeluaran"
                value={formData?.totalExpenses || 0}
                onChangeValue={(val) => onChange('totalExpenses', val)}
              />
            </div>

            {/* Tunjangan Hari Tua (THT) */}
            <CurrencyField
              label="Tunjangan Hari Tua (THT) per Bulan"
              value={formData?.tunjanganHariTua || 0}
              onChangeValue={(val) => onChange('tunjanganHariTua', val)}
            />

            {/* Kontak Perusahaan: Telepon, Fax, Email, NPWP */}
            <div className="grid grid-cols-4 gap-2">
              <TextField
                label="Area"
                maxLength={4}
                value={formData?.telpPerusahaanArea || ''}
                onChange={(e) => onChange('telpPerusahaanArea', e.target.value.replace(/\D/g, ''))}
                placeholder="021"
              />
              <div className="col-span-2">
                <TextField
                  label="No. Telp Perusahaan"
                  value={formData?.telpPerusahaanNumber || ''}
                  onChange={(e) => onChange('telpPerusahaanNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="1234567"
                />
              </div>
              <TextField
                label="Ext"
                maxLength={6}
                value={formData?.telpPerusahaanExt || ''}
                onChange={(e) => onChange('telpPerusahaanExt', e.target.value.replace(/\D/g, ''))}
                placeholder="101"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Email Perusahaan"
                type="email"
                value={formData?.emailPerusahaan || ''}
                onChange={(e) => onChange('emailPerusahaan', e.target.value)}
                placeholder="office@company.com"
              />
              <TextField
                label="NPWP Perusahaan"
                value={formData?.npwpPerusahaan || ''}
                onChange={(e) => onChange('npwpPerusahaan', e.target.value)}
                placeholder="15 digit NPWP"
              />
            </div>

            {/* Lama Bekerja Saat Ini */}
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Lama Bekerja Saat Ini (Tahun)"
                type="number"
                value={formData?.lamaBekerjaTahun || ''}
                onChange={(e) => onChange('lamaBekerjaTahun', e.target.value)}
                placeholder="Tahun"
              />
              <TextField
                label="Lama Bekerja Saat Ini (Bulan)"
                type="number"
                value={formData?.lamaBekerjaBulan || ''}
                onChange={(e) => onChange('lamaBekerjaBulan', e.target.value)}
                placeholder="Bulan"
              />
            </div>

            {/* Jika Wiraswasta: Tanggal/Masa Berdiri Perusahaan (CuBES: txt_Masa_Berdiri_Perusahaan) */}
            {isNotEmployee && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Masa Berdiri Perusahaan / Usaha</div>
                <div className="grid grid-cols-3 gap-2">
                  <TextField
                    label="Tahun"
                    type="number"
                    value={formData?.masaBerdiriThn || ''}
                    onChange={(e) => onChange('masaBerdiriThn', e.target.value)}
                    placeholder="Tahun"
                  />
                  <TextField
                    label="Bulan"
                    type="number"
                    value={formData?.masaBerdiriBln || ''}
                    onChange={(e) => onChange('masaBerdiriBln', e.target.value)}
                    placeholder="Bulan"
                  />
                  <TextField
                    label="Hari"
                    type="number"
                    value={formData?.masaBerdiriHari || ''}
                    onChange={(e) => onChange('masaBerdiriHari', e.target.value)}
                    placeholder="Hari"
                  />
                </div>
              </div>
            )}

            {/* Corporate Group (CuBES: TXT_CGID, TXT_CGDESC) */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700">Kode Group Perusahaan (Corporate Group)</label>
              <div className="flex gap-2">
                <div className="w-24 shrink-0">
                  <TextField
                    value={formData?.kodeCorporateGroup || ''}
                    onChange={(e) => onChange('kodeCorporateGroup', e.target.value)}
                    placeholder="Kode CG"
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    value={formData?.namaCorporateGroup || ''}
                    onChange={(e) => onChange('namaCorporateGroup', e.target.value)}
                    placeholder="Nama Corporate Group (opsional)"
                  />
                </div>
              </div>
            </div>

            {/* Area Perusahaan (CuBES: ddl_area_perusahaan) */}
            <SelectField
              label="Area Perusahaan"
              value={formData?.areaPerusahaan || ''}
              onChange={(e) => onChange('areaPerusahaan', e.target.value)}
              options={[
                { label: '- SELECT -', value: '' },
                { label: 'HEAD OFFICE', value: 'HEAD OFFICE' },
                { label: 'JAKARTA KOTA', value: 'JAKARTA KOTA' },
                { label: 'JAKARTA PUSAT', value: 'JAKARTA PUSAT' },
                { label: 'JAKARTA SENAYAN', value: 'JAKARTA SENAYAN' },
                { label: 'BANDUNG', value: 'BANDUNG' },
                { label: 'SEMARANG', value: 'SEMARANG' },
                { label: 'SURABAYA', value: 'SURABAYA' },
                { label: 'MEDAN', value: 'MEDAN' },
                { label: 'MAKASSAR', value: 'MAKASSAR' },
                { label: 'DENPASAR', value: 'DENPASAR' },
                { label: 'PALEMBANG', value: 'PALEMBANG' },
                { label: 'BANJARMASIN', value: 'BANJARMASIN' },
                { label: 'MANADO', value: 'MANADO' },
                { label: 'SERANG', value: 'SERANG' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* 2. RIWAYAT PEKERJAAN SEBELUMNYA (CuBES: txt_cu_ofprename, add, phn, life) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          Pekerjaan Sebelumnya (Riwayat Pengalaman Kerja)
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <TextField
              label="Nama Perusahaan Sebelumnya"
              value={formData?.namaPerusahaanSebelumnya || ''}
              onChange={(e) => onChange('namaPerusahaanSebelumnya', e.target.value)}
              placeholder="Nama perusahaan tempat bekerja sebelumnya"
            />
            <TextField
              label="Alamat Perusahaan Sebelumnya"
              value={formData?.alamatPerusahaanSebelumnya || ''}
              onChange={(e) => onChange('alamatPerusahaanSebelumnya', e.target.value)}
              placeholder="Alamat kantor sebelumnya"
            />
            <div className="grid grid-cols-3 gap-2">
              <TextField
                label="Area"
                maxLength={4}
                value={formData?.telpPerusahaanSebelumnyaArea || ''}
                onChange={(e) => onChange('telpPerusahaanSebelumnyaArea', e.target.value.replace(/\D/g, ''))}
                placeholder="021"
              />
              <div className="col-span-2">
                <TextField
                  label="No. Telepon Kantor Sebelumnya"
                  value={formData?.telpPerusahaanSebelumnyaNumber || ''}
                  onChange={(e) => onChange('telpPerusahaanSebelumnyaNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="1234567"
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Lama Bekerja Sebelumnya (Tahun)"
                type="number"
                value={formData?.lamaBekerjaSebelumnyaTahun || ''}
                onChange={(e) => onChange('lamaBekerjaSebelumnyaTahun', e.target.value)}
                placeholder="Tahun"
              />
              <TextField
                label="Lama Bekerja Sebelumnya (Bulan)"
                type="number"
                value={formData?.lamaBekerjaSebelumnyaBulan || ''}
                onChange={(e) => onChange('lamaBekerjaSebelumnyaBulan', e.target.value)}
                placeholder="Bulan"
              />
            </div>
            <TextField
              label="Total Lama Pengalaman Kerja (Otomatis)"
              disabled
              value={formData?.totalPengalamanKerja || ''}
              placeholder="Otomatis terkalkulasi"
            />
          </div>
        </div>
      </div>

      {/* Modal Lookup Rekanan Mitra Karya BNI */}
      <SearchPartnerModal
        isOpen={isMitraModalOpen}
        onClose={() => setIsMitraModalOpen(false)}
        title="Lookup Mitra Karya & Instansi Rekanan BNI"
        type="MITRA_KARYA"
        onSelect={(p) => {
          onChange('kodeInstansi', p.code || 'MK-01');
          onChange('namaPerusahaan', p.name);
          if (p.pks) onChange('noPksInstansi', p.pks);
          setIsMitraModalOpen(false);
        }}
      />

      {onLanjut && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onLanjut}
            className="px-6 py-2 bg-gradient-to-r from-[#C2410C] to-[#9A3412] hover:from-[#9A3412] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm cursor-pointer active:scale-95"
          >
            Lanjut
          </button>
        </div>
      )}
    </div>
  );
};

export default PekerjaanDebitur;
