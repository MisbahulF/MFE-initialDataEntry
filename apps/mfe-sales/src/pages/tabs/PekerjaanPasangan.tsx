import React, { useEffect } from 'react';
import {
  TextField,
  SelectField,
  CurrencyField,
  DateField
} from '@template/shared';

interface PekerjaanPasanganProps {
  formData?: any;
  onChange: (field: string, value: any) => void;
  onLanjut?: (e?: React.FormEvent) => void;
  onCariZipKantorPasangan?: () => void;
  onCariZip?: () => void;
}

export const PekerjaanPasangan: React.FC<PekerjaanPasanganProps> = ({
  formData,
  onChange,
  onLanjut,
  onCariZipKantorPasangan,
  onCariZip,
}) => {
  const isWorking = formData?.apakahPasanganBekerja !== 'TIDAK';

  // Hitung otomatis Total Pendapatan Pasangan: Pendapatan Pokok + Lain
  useEffect(() => {
    const pokok = Number(formData?.pendapatanPasangan) || 0;
    const lain = Number(formData?.pendapatanLainPasangan) || 0;
    const total = pokok + lain;
    if (formData?.totalPendapatanPasangan !== total) {
      onChange('totalPendapatanPasangan', total);
    }
  }, [formData?.pendapatanPasangan, formData?.pendapatanLainPasangan]);

  // Hitung otomatis Total Pengalaman Kerja Pasangan
  useEffect(() => {
    const thnNow = Number(formData?.lamaBekerjaPasanganTahun) || 0;
    const blnNow = Number(formData?.lamaBekerjaPasanganBulan) || 0;
    const thnPrev = Number(formData?.lamaBekerjaSebelumnyaPasanganTahun) || 0;
    const blnPrev = Number(formData?.lamaBekerjaSebelumnyaPasanganBulan) || 0;
    
    let totalBln = blnNow + blnPrev;
    let totalThn = thnNow + thnPrev + Math.floor(totalBln / 12);
    totalBln = totalBln % 12;

    const totLifeStr = `${totalThn} Tahun ${totalBln} Bulan`;
    if (formData?.totalPengalamanKerjaPasangan !== totLifeStr) {
      onChange('totalPengalamanKerjaPasangan', totLifeStr);
    }
  }, [
    formData?.lamaBekerjaPasanganTahun,
    formData?.lamaBekerjaPasanganBulan,
    formData?.lamaBekerjaSebelumnyaPasanganTahun,
    formData?.lamaBekerjaSebelumnyaPasanganBulan,
  ]);

  const lookupZipcodeAuto = async (zip: string) => {
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?keyword=${zip}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          onChange('kotaPerusahaanPasangan', item.city || item.kota || '');
          if (item.kecamatan && !formData?.kecamatanPerusahaanPasangan) onChange('kecamatanPerusahaanPasangan', item.kecamatan);
          if (item.kelurahan && !formData?.kelurahanPerusahaanPasangan) onChange('kelurahanPerusahaanPasangan', item.kelurahan);
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleCariZip = () => {
    if (onCariZipKantorPasangan) onCariZipKantorPasangan();
    else if (onCariZip) onCariZip();
    else if (formData?.kodeposPerusahaanPasangan) lookupZipcodeAuto(formData.kodeposPerusahaanPasangan);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        {/* Header CuBES: Pekerjaan Pasangan */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 flex justify-between items-center text-white">
          <div className="font-bold text-xs uppercase tracking-wider">
            Pekerjaan Pasangan
          </div>
          {formData?.isJoinIncome && (
            <div className="text-xs bg-emerald-700/80 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Join Income Aktif
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <SelectField
            label="Apakah Pasangan Bekerja / Memiliki Usaha?"
            value={formData?.apakahPasanganBekerja || 'YA'}
            onChange={(e) => onChange('apakahPasanganBekerja', e.target.value)}
            options={[
              { label: 'Ya (Bekerja / Wiraswasta / Profesional)', value: 'YA' },
              { label: 'Tidak (Ibu Rumah Tangga / Tidak Berpenghasilan)', value: 'TIDAK' },
            ]}
          />
        </div>

        {isWorking ? (
          <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
            {/* Kolom Kiri */}
            <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
              {/* Tanggal Mulai Bekerja Pasangan (CuBES: txt_SPOUSE_EMPL_DATE) */}
              <DateField
                label="Tanggal Mulai Bekerja Pasangan"
                dayValue={formData?.tglMulaiBekerjaPasanganHari || ''}
                monthValue={formData?.tglMulaiBekerjaPasanganBulan || ''}
                yearValue={formData?.tglMulaiBekerjaPasanganTahun || ''}
                onDayChange={(v) => onChange('tglMulaiBekerjaPasanganHari', v)}
                onMonthChange={(v) => onChange('tglMulaiBekerjaPasanganBulan', v)}
                onYearChange={(v) => onChange('tglMulaiBekerjaPasanganTahun', v)}
              />

              {/* Tipe Pekerjaan Pasangan (CuBES: ddl_cu_spjob_type) */}
              <SelectField
                label="Tipe Pekerjaan Pasangan"
                required
                value={formData?.tipePekerjaanPasangan || '01'}
                onChange={(e) => onChange('tipePekerjaanPasangan', e.target.value)}
                options={[
                  { label: 'Karyawan / Pegawai', value: '01' },
                  { label: 'Wiraswasta / Pengusaha', value: '02' },
                  { label: 'Profesional', value: '03' },
                ]}
              />

              {/* Bentuk Badan Usaha Pasangan (CuBES: ddl_cu_spcpcode) */}
              <SelectField
                label="Bentuk Badan Usaha"
                value={formData?.bentukBadanUsahaPasangan || ''}
                onChange={(e) => onChange('bentukBadanUsahaPasangan', e.target.value)}
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

              {/* Nama Perusahaan / Instansi (CuBES: txt_cu_spofname) */}
              <TextField
                label="Nama Perusahaan / Tempat Bekerja Pasangan"
                required
                value={formData?.namaPerusahaanPasangan || ''}
                onChange={(e) => onChange('namaPerusahaanPasangan', e.target.value)}
                placeholder="Nama kantor / instansi pasangan"
              />

              {/* Alamat Kantor Pasangan (CuBES: txt_cu_spofaddr1, 2, 3) */}
              <TextField
                label="Alamat Kantor Pasangan (Baris 1)"
                value={formData?.alamatPerusahaanPasangan || ''}
                onChange={(e) => onChange('alamatPerusahaanPasangan', e.target.value)}
                placeholder="Gedung, Jalan, No."
              />
              <TextField
                label="Alamat Kantor Pasangan (Baris 2)"
                value={formData?.alamatPerusahaanPasangan2 || ''}
                onChange={(e) => onChange('alamatPerusahaanPasangan2', e.target.value)}
                placeholder="Kompleks / Blok (opsional)"
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Kelurahan"
                  value={formData?.kelurahanPerusahaanPasangan || ''}
                  onChange={(e) => onChange('kelurahanPerusahaanPasangan', e.target.value)}
                  placeholder="Kelurahan"
                />
                <TextField
                  label="Kecamatan"
                  value={formData?.kecamatanPerusahaanPasangan || ''}
                  onChange={(e) => onChange('kecamatanPerusahaanPasangan', e.target.value)}
                  placeholder="Kecamatan"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="RT"
                  maxLength={5}
                  value={formData?.rtPerusahaanPasangan || ''}
                  onChange={(e) => onChange('rtPerusahaanPasangan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="001"
                />
                <TextField
                  label="RW"
                  maxLength={5}
                  value={formData?.rwPerusahaanPasangan || ''}
                  onChange={(e) => onChange('rwPerusahaanPasangan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="002"
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField
                    label="Kodepos"
                    maxLength={10}
                    value={formData?.kodeposPerusahaanPasangan || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                      onChange('kodeposPerusahaanPasangan', val);
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
                value={formData?.kotaPerusahaanPasangan || ''}
                onChange={(e) => onChange('kotaPerusahaanPasangan', e.target.value)}
                placeholder="Kota otomatis terisi"
              />

              {/* Jabatan & Bidang Usaha Pasangan (CuBES: ddl_cu_spjob & ddl_cu_spbusstype) */}
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Jabatan Pekerjaan"
                  value={formData?.jabatanPasangan || ''}
                  onChange={(e) => onChange('jabatanPasangan', e.target.value)}
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
                  value={formData?.bidangUsahaPasangan || ''}
                  onChange={(e) => onChange('bidangUsahaPasangan', e.target.value)}
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
                  value={formData?.posisiPasangan || ''}
                  onChange={(e) => onChange('posisiPasangan', e.target.value)}
                  placeholder="Kepala Divisi, Sales, dll"
                />
                <TextField
                  label="Departemen / Divisi"
                  value={formData?.departemenPasangan || ''}
                  onChange={(e) => onChange('departemenPasangan', e.target.value)}
                  placeholder="Finance, HRD, Operasional"
                />
              </div>

              <TextField
                label="NIP Pasangan"
                value={formData?.nipPasangan || ''}
                onChange={(e) => onChange('nipPasangan', e.target.value)}
                placeholder="Nomor Induk Pegawai Pasangan"
              />
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-3">
              {/* Penghasilan Pasangan (CuBES: txt_cu_spofincnetmm, txt_cu_spofincoth, txt_cu_spofincmmtot) */}
              <CurrencyField
                label="Pendapatan Pokok Pasangan (per Bulan)"
                required={Boolean(formData?.isJoinIncome)}
                value={formData?.pendapatanPasangan || 0}
                onChangeValue={(val) => onChange('pendapatanPasangan', val)}
              />
              <CurrencyField
                label="Pendapatan Lain Pasangan (per Bulan)"
                value={formData?.pendapatanLainPasangan || 0}
                onChangeValue={(val) => onChange('pendapatanLainPasangan', val)}
              />
              <CurrencyField
                label="Total Pendapatan Pasangan (per Bulan - Otomatis)"
                value={formData?.totalPendapatanPasangan || 0}
                onChangeValue={(val) => onChange('totalPendapatanPasangan', val)}
              />

              {/* Tipe Perusahaan Pasangan (CuBES: ddl_cu_spcomptype) */}
              <SelectField
                label="Tipe Perusahaan Pasangan"
                value={formData?.tipePerusahaanPasangan || ''}
                onChange={(e) => onChange('tipePerusahaanPasangan', e.target.value)}
                options={[
                  { label: '- SELECT -', value: '' },
                  { label: 'BUMN / BUMD', value: 'BUMN' },
                  { label: 'PMA (Penanaman Modal Asing)', value: 'PMA' },
                  { label: 'Swasta Nasional', value: 'SWASTA' },
                  { label: 'Instansi Pemerintah', value: 'GOV' },
                  { label: 'TNI / POLRI', value: 'APARAT' },
                  { label: 'Usaha Sendiri', value: 'SENDIRI' },
                  { label: 'Lainnya', value: 'LAINNYA' },
                ]}
              />

              {/* Telepon & Kontak Kantor Pasangan (CuBES: txt_cu_spofphnarea, num, ext, fax, email) */}
              <div className="grid grid-cols-4 gap-2">
                <TextField
                  label="Area"
                  maxLength={4}
                  value={formData?.telpKantorPasanganArea || ''}
                  onChange={(e) => onChange('telpKantorPasanganArea', e.target.value.replace(/\D/g, ''))}
                  placeholder="021"
                />
                <div className="col-span-2">
                  <TextField
                    label="No. Telp Kantor"
                    value={formData?.telpKantorPasanganNumber || ''}
                    onChange={(e) => onChange('telpKantorPasanganNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="1234567"
                  />
                </div>
                <TextField
                  label="Ext"
                  maxLength={6}
                  value={formData?.telpKantorPasanganExt || ''}
                  onChange={(e) => onChange('telpKantorPasanganExt', e.target.value.replace(/\D/g, ''))}
                  placeholder="101"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Email Kantor Pasangan"
                  type="email"
                  value={formData?.emailKantorPasangan || ''}
                  onChange={(e) => onChange('emailKantorPasangan', e.target.value)}
                  placeholder="office@company.com"
                />
                <TextField
                  label="NPWP Perusahaan Pasangan"
                  value={formData?.npwpPerusahaanPasangan || ''}
                  onChange={(e) => onChange('npwpPerusahaanPasangan', e.target.value)}
                  placeholder="15 digit NPWP"
                />
              </div>

              {/* Lama Bekerja Pasangan (CuBES: txt_cu_spoflifeyy, mm) */}
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="Lama Bekerja Pasangan (Tahun)"
                  type="number"
                  value={formData?.lamaBekerjaPasanganTahun || ''}
                  onChange={(e) => onChange('lamaBekerjaPasanganTahun', e.target.value)}
                  placeholder="Tahun"
                />
                <TextField
                  label="Lama Bekerja Pasangan (Bulan)"
                  type="number"
                  value={formData?.lamaBekerjaPasanganBulan || ''}
                  onChange={(e) => onChange('lamaBekerjaPasanganBulan', e.target.value)}
                  placeholder="Bulan"
                />
              </div>

              {/* Kepemilikan Saham Pasangan (CuBES: txt_cu_spownship) */}
              <TextField
                label="Kepemilikan Saham Pasangan (%)"
                type="number"
                maxLength={3}
                value={formData?.kepemilikanSahamPasangan || ''}
                onChange={(e) => onChange('kepemilikanSahamPasangan', e.target.value)}
                placeholder="Persentase kepemilikan (jika pemilik/pemegang saham)"
              />

              {/* Riwayat Perusahaan Sebelumnya Pasangan (CuBES: txt_cu_spprevofname, add, life) */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Pekerjaan Sebelumnya Pasangan</div>
                <TextField
                  label="Nama Perusahaan Sebelumnya"
                  value={formData?.perusahaanSebelumnyaPasangan || ''}
                  onChange={(e) => onChange('perusahaanSebelumnyaPasangan', e.target.value)}
                  placeholder="Nama perusahaan sebelumnya (opsional)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <TextField
                    label="Lama Bekerja (Tahun)"
                    type="number"
                    value={formData?.lamaBekerjaSebelumnyaPasanganTahun || ''}
                    onChange={(e) => onChange('lamaBekerjaSebelumnyaPasanganTahun', e.target.value)}
                    placeholder="Tahun"
                  />
                  <TextField
                    label="Lama Bekerja (Bulan)"
                    type="number"
                    value={formData?.lamaBekerjaSebelumnyaPasanganBulan || ''}
                    onChange={(e) => onChange('lamaBekerjaSebelumnyaPasanganBulan', e.target.value)}
                    placeholder="Bulan"
                  />
                </div>
              </div>

              <TextField
                label="Total Lama Pengalaman Kerja Pasangan (Otomatis)"
                disabled
                value={formData?.totalPengalamanKerjaPasangan || ''}
                placeholder="Otomatis terkalkulasi"
              />
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 italic bg-[#f8fafb]">
            Pasangan tidak berpenghasilan / tidak bekerja. Tidak ada data pekerjaan yang perlu diinputkan.
          </div>
        )}
      </div>

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

export default PekerjaanPasangan;
