import React, { useEffect } from 'react';
import {
  TextField,
  SelectField,
  DateField,
  CheckboxField
} from '@template/shared';

interface InformasiPasanganProps {
  formData?: any;
  onChange: (field: string, value: any) => void;
  onLanjut?: (e?: React.FormEvent) => void;
  onCariZipPasangan?: () => void;
  onCariZip?: () => void;
}

export const InformasiPasangan: React.FC<InformasiPasanganProps> = ({
  formData,
  onChange,
  onLanjut,
  onCariZipPasangan,
  onCariZip,
}) => {
  // CuBES: Status Pernikahan check
  const isMarried = formData?.statusPernikahan === '2' || formData?.statusPernikahan === 'MENIKAH';

  // CuBES: Jenis Kelamin Pasangan otomatis berlawanan dengan debitur (lbl_spsex)
  useEffect(() => {
    if (formData?.jenisKelamin) {
      const spouseSex = formData.jenisKelamin === 'L' || formData.jenisKelamin === '1' ? 'P' : 'L';
      const spouseSexLabel = spouseSex === 'P' ? 'Wanita / Perempuan' : 'Pria / Laki-laki';
      if (formData?.jenisKelaminPasangan !== spouseSexLabel) {
        onChange('jenisKelaminPasangan', spouseSexLabel);
      }
    }
  }, [formData?.jenisKelamin]);

  // CuBES: Checkbox "Sama dengan Alamat Pemohon"
  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSame = e.target.checked;
    onChange('isAlamatPasanganSama', isSame);
    if (isSame) {
      onChange('alamatKtpPasangan', formData?.alamatKtp || '');
      onChange('alamatKtpPasangan2', formData?.alamatKtp2 || '');
      onChange('rtPasangan', formData?.rt || '');
      onChange('rwPasangan', formData?.rw || '');
      onChange('kodeposPasangan', formData?.kodepos || '');
      onChange('kelurahanPasangan', formData?.kelurahan || '');
      onChange('kecamatanPasangan', formData?.kecamatan || '');
      onChange('kotaPasangan', formData?.kota || '');
    }
  };

  const lookupZipcodeAuto = async (zip: string) => {
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?keyword=${zip}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          onChange('kotaPasangan', item.city || item.kota || '');
          if (item.kecamatan && !formData?.kecamatanPasangan) onChange('kecamatanPasangan', item.kecamatan);
          if (item.kelurahan && !formData?.kelurahanPasangan) onChange('kelurahanPasangan', item.kelurahan);
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleCariZip = () => {
    if (onCariZipPasangan) onCariZipPasangan();
    else if (onCariZip) onCariZip();
    else if (formData?.kodeposPasangan) lookupZipcodeAuto(formData.kodeposPasangan);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        {/* Header CuBES: Informasi Pasangan & Checkbox Join Income (chk_CU_JOININCOME) */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 flex justify-between items-center text-white">
          <div className="font-bold text-xs uppercase tracking-wider">
            Informasi Pasangan
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors">
            <input
              type="checkbox"
              checked={Boolean(formData?.isJoinIncome)}
              onChange={(e) => onChange('isJoinIncome', e.target.checked)}
              className="rounded text-[#C2410C] focus:ring-0 w-3.5 h-3.5"
            />
            <span>JOIN INCOME (Gabung Penghasilan)</span>
          </label>
        </div>

        {!isMarried && (
          <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2">
            <span className="font-bold">Informasi:</span> Status pernikahan pemohon bukan "Menikah". Pengisian data pasangan bersifat opsional atau tidak mandatory.
          </div>
        )}

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            {/* Gelar Sebelum & Gelar Sesudah (CuBES: txt_cu_sptitle & txt_cu_sptitleaft) */}
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Gelar Sebelum"
                value={formData?.gelarSebelumPasangan || ''}
                onChange={(e) => onChange('gelarSebelumPasangan', e.target.value)}
                placeholder="Dr., Ir."
              />
              <TextField
                label="Gelar Setelah"
                value={formData?.gelarSetelahPasangan || ''}
                onChange={(e) => onChange('gelarSetelahPasangan', e.target.value)}
                placeholder="S.Kom, M.M."
              />
            </div>

            {/* Nama Pasangan: Depan, Tengah, Belakang (CuBES: txt_cu_spnmfirst, mid, last) */}
            <TextField
              label="Nama Depan Pasangan"
              required={isMarried}
              value={formData?.namaDepanPasangan || ''}
              onChange={(e) => onChange('namaDepanPasangan', e.target.value)}
              placeholder="Nama depan sesuai KTP"
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Nama Tengah Pasangan"
                value={formData?.namaTengahPasangan || ''}
                onChange={(e) => onChange('namaTengahPasangan', e.target.value)}
                placeholder="Nama tengah (opsional)"
              />
              <TextField
                label="Nama Belakang Pasangan"
                value={formData?.namaBelakangPasangan || ''}
                onChange={(e) => onChange('namaBelakangPasangan', e.target.value)}
                placeholder="Nama belakang / keluarga"
              />
            </div>

            {/* Jenis Kelamin Pasangan (CuBES: lbl_spsex - Otomatis berlawanan dengan pemohon) */}
            <TextField
              label="Jenis Kelamin Pasangan (Otomatis)"
              disabled
              value={formData?.jenisKelaminPasangan || 'Wanita / Perempuan'}
              placeholder="Otomatis berlawanan dengan pemohon"
            />

            {/* Nama Ibu Kandung Pasangan (CuBES: txt_sp_mmnmfirst) */}
            <TextField
              label="Nama Ibu Kandung Pasangan"
              value={formData?.namaIbuKandungPasangan || ''}
              onChange={(e) => onChange('namaIbuKandungPasangan', e.target.value)}
              placeholder="Nama gadis ibu kandung pasangan"
            />

            {/* Checkbox Sama dengan Alamat Pemohon (CuBES: cb_sameaddr) */}
            <div className="pt-1">
              <CheckboxField
                label="Alamat KTP Sama dengan Pemohon"
                checked={Boolean(formData?.isAlamatPasanganSama)}
                onChange={handleSameAddressChange}
              />
            </div>

            {/* Alamat KTP Pasangan */}
            <TextField
              label="Alamat KTP Pasangan (Baris 1)"
              required={isMarried}
              disabled={Boolean(formData?.isAlamatPasanganSama)}
              value={formData?.alamatKtpPasangan || ''}
              onChange={(e) => onChange('alamatKtpPasangan', e.target.value)}
              placeholder="Jalan, No. Rumah, Blok"
            />
            <TextField
              label="Alamat KTP Pasangan (Baris 2)"
              disabled={Boolean(formData?.isAlamatPasanganSama)}
              value={formData?.alamatKtpPasangan2 || ''}
              onChange={(e) => onChange('alamatKtpPasangan2', e.target.value)}
              placeholder="Kompleks / Gang (opsional)"
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Kelurahan"
                disabled={Boolean(formData?.isAlamatPasanganSama)}
                value={formData?.kelurahanPasangan || ''}
                onChange={(e) => onChange('kelurahanPasangan', e.target.value)}
                placeholder="Kelurahan"
              />
              <TextField
                label="Kecamatan"
                disabled={Boolean(formData?.isAlamatPasanganSama)}
                value={formData?.kecamatanPasangan || ''}
                onChange={(e) => onChange('kecamatanPasangan', e.target.value)}
                placeholder="Kecamatan"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="RT"
                maxLength={5}
                disabled={Boolean(formData?.isAlamatPasanganSama)}
                value={formData?.rtPasangan || ''}
                onChange={(e) => onChange('rtPasangan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="001"
              />
              <TextField
                label="RW"
                maxLength={5}
                disabled={Boolean(formData?.isAlamatPasanganSama)}
                value={formData?.rwPasangan || ''}
                onChange={(e) => onChange('rwPasangan', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="002"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField
                  label="Kodepos"
                  maxLength={10}
                  disabled={Boolean(formData?.isAlamatPasanganSama)}
                  value={formData?.kodeposPasangan || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onChange('kodeposPasangan', val);
                    if (val.length === 5) lookupZipcodeAuto(val);
                  }}
                  placeholder="Contoh: 10260"
                />
              </div>
              <button
                type="button"
                disabled={Boolean(formData?.isAlamatPasanganSama)}
                onClick={handleCariZip}
                className="px-3 py-1.5 bg-[#C2410C] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5 disabled:opacity-50"
              >
                Cari
              </button>
            </div>
            <TextField
              label="Kota"
              disabled
              value={formData?.kotaPasangan || ''}
              onChange={(e) => onChange('kotaPasangan', e.target.value)}
              placeholder="Kota otomatis terisi"
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            {/* Tempat & Tanggal Lahir (CuBES: txt_sp_pob, txt_spbirthdate, month, year) */}
            <TextField
              label="Tempat Lahir"
              value={formData?.tempatLahirPasangan || ''}
              onChange={(e) => onChange('tempatLahirPasangan', e.target.value)}
              placeholder="Kota tempat lahir"
            />
            <DateField
              label="Tanggal Lahir Pasangan"
              dayValue={formData?.tglLahirPasanganHari || ''}
              monthValue={formData?.tglLahirPasanganBulan || ''}
              yearValue={formData?.tglLahirPasanganTahun || ''}
              onDayChange={(v) => onChange('tglLahirPasanganHari', v)}
              onMonthChange={(v) => onChange('tglLahirPasanganBulan', v)}
              onYearChange={(v) => onChange('tglLahirPasanganTahun', v)}
            />

            {/* Kewarganegaraan & Pendidikan Terakhir (CuBES: ddl_cu_spnation & ddl_cu_spedcode) */}
            <div className="grid grid-cols-2 gap-3">
              <SelectField
                label="Kewarganegaraan"
                value={formData?.kebangsaanPasangan || 'WNI'}
                onChange={(e) => onChange('kebangsaanPasangan', e.target.value)}
                options={[
                  { label: 'WNI (Warga Negara Indonesia)', value: 'WNI' },
                  { label: 'WNA (Warga Negara Asing)', value: 'WNA' },
                ]}
              />
              <SelectField
                label="Pendidikan Terakhir"
                value={formData?.pendidikanPasangan || ''}
                onChange={(e) => onChange('pendidikanPasangan', e.target.value)}
                options={[
                  { label: '- SELECT -', value: '' },
                  { label: 'SD', value: 'SD' },
                  { label: 'SMP', value: 'SMP' },
                  { label: 'SMA / SMK', value: 'SMA' },
                  { label: 'DIPLOMA (D1 - D4)', value: 'DIPLOMA' },
                  { label: 'SARJANA (S1)', value: 'S1' },
                  { label: 'PASCASARJANA (S2)', value: 'S2' },
                  { label: 'DOKTOR (S3)', value: 'S3' },
                ]}
              />
            </div>

            {/* Email & No Handphone (CuBES: txt_cu_spemail & txt_cu_spmobile) */}
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Email Pasangan"
                type="email"
                value={formData?.emailPasangan || ''}
                onChange={(e) => onChange('emailPasangan', e.target.value)}
                placeholder="pasangan@email.com"
              />
              <TextField
                label="No. Handphone Pasangan"
                value={formData?.noHpPasangan || ''}
                onChange={(e) => {
                  let clean = e.target.value.replace(/[^0-9+]/g, '');
                  if (clean.indexOf('+') > 0) clean = clean.charAt(0) + clean.slice(1).replace(/\+/g, '');
                  onChange('noHpPasangan', clean.slice(0, clean.startsWith('+') ? 15 : 13));
                }}
                placeholder="0812xxxxxxxx"
              />
            </div>

            {/* No KTP Pasangan (CuBES: txt_cu_spktpnum, chkIsLifetime, txt_spktpdate, txt_spktpexpdate) */}
            <TextField
              label="No. KTP Pasangan"
              required={isMarried}
              maxLength={16}
              value={formData?.noKtpPasangan || ''}
              onChange={(e) => onChange('noKtpPasangan', e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="16 digit nomor KTP"
            />
            <CheckboxField
              label="Masa Berlaku KTP Seumur Hidup"
              checked={Boolean(formData?.isSeumurHidupPasangan)}
              onChange={(e) => onChange('isSeumurHidupPasangan', e.target.checked)}
            />
            <DateField
              label="Tanggal Terbit KTP Pasangan"
              dayValue={formData?.tglTerbitKtpPasanganHari || ''}
              monthValue={formData?.tglTerbitKtpPasanganBulan || ''}
              yearValue={formData?.tglTerbitKtpPasanganTahun || ''}
              onDayChange={(v) => onChange('tglTerbitKtpPasanganHari', v)}
              onMonthChange={(v) => onChange('tglTerbitKtpPasanganBulan', v)}
              onYearChange={(v) => onChange('tglTerbitKtpPasanganTahun', v)}
            />
            {!formData?.isSeumurHidupPasangan && (
              <DateField
                label="Masa Berlaku KTP Pasangan"
                dayValue={formData?.masaBerlakuKtpPasanganHari || ''}
                monthValue={formData?.masaBerlakuKtpPasanganBulan || ''}
                yearValue={formData?.masaBerlakuKtpPasanganTahun || ''}
                onDayChange={(v) => onChange('masaBerlakuKtpPasanganHari', v)}
                onMonthChange={(v) => onChange('masaBerlakuKtpPasanganBulan', v)}
                onYearChange={(v) => onChange('masaBerlakuKtpPasanganTahun', v)}
              />
            )}

            {/* No Paspor (CuBES: txt_cu_sppassnum, passdate, passexpdate - jika WNA) */}
            {formData?.kebangsaanPasangan === 'WNA' && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Data Paspor Pasangan (WNA)</div>
                <TextField
                  label="No. Paspor Pasangan"
                  value={formData?.pasporPasangan || ''}
                  onChange={(e) => onChange('pasporPasangan', e.target.value)}
                  placeholder="Nomor paspor"
                />
                <DateField
                  label="Tanggal Terbit Paspor"
                  dayValue={formData?.tglTerbitPasporPasanganHari || ''}
                  monthValue={formData?.tglTerbitPasporPasanganBulan || ''}
                  yearValue={formData?.tglTerbitPasporPasanganTahun || ''}
                  onDayChange={(v) => onChange('tglTerbitPasporPasanganHari', v)}
                  onMonthChange={(v) => onChange('tglTerbitPasporPasanganBulan', v)}
                  onYearChange={(v) => onChange('tglTerbitPasporPasanganTahun', v)}
                />
                <DateField
                  label="Masa Berlaku Paspor"
                  dayValue={formData?.masaBerlakuPasporPasanganHari || ''}
                  monthValue={formData?.masaBerlakuPasporPasanganBulan || ''}
                  yearValue={formData?.masaBerlakuPasporPasanganTahun || ''}
                  onDayChange={(v) => onChange('masaBerlakuPasporPasanganHari', v)}
                  onMonthChange={(v) => onChange('masaBerlakuPasporPasanganBulan', v)}
                  onYearChange={(v) => onChange('masaBerlakuPasporPasanganTahun', v)}
                />
              </div>
            )}

            {/* NPWP Pasangan (CuBES: txt_cu_spnpwp) */}
            <TextField
              label="NPWP Pasangan"
              maxLength={20}
              value={formData?.npwpPasangan || ''}
              onChange={(e) => onChange('npwpPasangan', e.target.value)}
              placeholder="15 / 16 digit NPWP pasangan"
            />

            {/* Perjanjian Pemisahan Harta (Pisah Harta) */}
            <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">Perjanjian Pemisahan Harta</div>
              <SelectField
                label="Apakah Ada Akta Perjanjian Pisah Harta?"
                value={formData?.isPisahHarta ? 'YA' : 'TIDAK'}
                onChange={(e) => onChange('isPisahHarta', e.target.value === 'YA')}
                options={[
                  { label: 'Tidak Ada (Harta Bersama)', value: 'TIDAK' },
                  { label: 'Ada (Pisah Harta Notaril)', value: 'YA' },
                ]}
              />
              {formData?.isPisahHarta && (
                <TextField
                  label="No. Akta Notaris Pisah Harta"
                  value={formData?.noAktaPisahHarta || ''}
                  onChange={(e) => onChange('noAktaPisahHarta', e.target.value)}
                  placeholder="Nomor akta notaris"
                />
              )}
            </div>
          </div>
        </div>
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

export default InformasiPasangan;
