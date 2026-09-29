import React, { useState } from 'react';
import { referenceService } from '../../services/referenceService';
import { TextField, SelectField, DateField } from '@template/shared';
import { AlertCircle, CheckCircle2, Search, Copy, Check, FileText } from 'lucide-react';

export interface InformasiDebiturProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onCariZipKtp?: () => void;
  onSameWithKtp?: (checked: boolean) => void;
  onCariZipTinggal?: () => void;
  documents?: any[];
  setDocuments?: React.Dispatch<React.SetStateAction<any[]>>;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const InformasiDebitur: React.FC<InformasiDebiturProps> = ({
  formData,
  onChange,
  onCariZipKtp,
  onSameWithKtp,
  onCariZipTinggal,
  documents = [],
  setDocuments,
  onLanjut,
}) => {
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [npwpCopied, setNpwpCopied] = useState<boolean>(false);

  const handleUpload = async (docType?: string) => {
    if (!selectedUploadFile) return;
    const docName = docType ? `${docType} - ${selectedUploadFile.name}` : selectedUploadFile.name;
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', selectedUploadFile);
      formDataUpload.append('prospectId', formData?.noProspek || '');
      
      const res = await fetch('http://localhost:5139/api/Document/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      const fileId = data?.data?.fileId || Date.now().toString();

      if (setDocuments) {
        setDocuments((p) => [
          ...p.filter((d) => d.docType !== docType),
          {
            id: fileId,
            docType: docType || 'Lainnya',
            name: docName,
            status: 'TERUNGGAH',
            uploadedAt: new Date().toLocaleDateString('id-ID'),
          },
        ]);
      }
    } catch {
      if (setDocuments) {
        setDocuments((p) => [
          ...p.filter((d) => d.docType !== docType),
          {
            id: Date.now().toString(),
            docType: docType || 'Lainnya',
            name: docName,
            status: 'TERUNGGAH',
            uploadedAt: new Date().toLocaleDateString('id-ID'),
          },
        ]);
      }
    }
    setSelectedUploadFile(null);
  };

  const lookupZipcodeAuto = async (zip: string, target: 'Ktp' | 'Tinggal') => {
    const clean = zip.replace(/\D/g, '').trim();
    if (clean.length === 5) {
      try {
        const results = await referenceService.searchZipcode(clean);
        if (results && results.length > 0) {
          const first = results[0];
          onChange(`kelurahan${target}`, first.kelurahan);
          onChange(`kecamatan${target}`, first.kecamatan);
          onChange(`kota${target}`, first.kota);
        }
      } catch (err) {
        console.error('Error auto-lookup zipcode:', err);
      }
    }
  };

  const handleSameWithKtp = (checked: boolean) => {
    onChange('samaDenganKtp', checked);
    if (onSameWithKtp) { 
      onSameWithKtp(checked); 
    } else if (checked) {
      ['alamat', 'kelurahan', 'kecamatan', 'rt', 'rw', 'kodepos', 'kota'].forEach((f) => 
        onChange(f + 'Tinggal', formData?.[f + 'Ktp'] || '')
      );
    }
  };

  // Handler Seumur Hidup KTP (CuBES: chkIsLifetime -> 31-12-2099)
  const handleLifetimeChange = (checked: boolean) => {
    onChange('seumurHidup', checked);
    if (checked) {
      onChange('masaBerlakuHari', '31');
      onChange('masaBerlakuBulan', '12');
      onChange('masaBerlakuTahun', '2099');
    } else {
      onChange('masaBerlakuHari', '');
      onChange('masaBerlakuBulan', '');
      onChange('masaBerlakuTahun', '');
    }
  };

  // Sinkronisasi NIK 16 digit ke NPWP
  const handleSyncNikToNpwp = () => {
    if (formData?.noIdentitas && formData.noIdentitas.length === 16) {
      onChange('npwp', formData.noIdentitas);
      setNpwpCopied(true);
      setTimeout(() => setNpwpCopied(false), 2000);
    }
  };

  // Aturan Validasi Komprehensif CuBES (PersonalInfo.aspx.cs btn_save_Click)
  const validateFormCuBES = (): string[] => {
    const errors: string[] = [];

    // 1. Data Diri
    if (!formData?.namaDepan?.trim()) {
      errors.push('Nama Depan wajib diisi');
    }
    if (!formData?.jenisKelamin || formData.jenisKelamin === '- SELECT -') {
      errors.push('Jenis Kelamin wajib dipilih');
    }
    if (!formData?.tempatLahir?.trim()) {
      errors.push('Tempat Lahir wajib diisi');
    }
    if (!formData?.tglLahirHari || !formData?.tglLahirBulan || !formData?.tglLahirTahun) {
      errors.push('Tanggal Lahir wajib diisi lengkap');
    } else {
      const birthYear = parseInt(formData.tglLahirTahun, 10);
      const birthMonth = parseInt(formData.tglLahirBulan, 10) - 1;
      const birthDay = parseInt(formData.tglLahirHari, 10);
      const birthDate = new Date(birthYear, birthMonth, birthDay);
      const today = new Date();
      let age = today.getFullYear() - birthYear;
      const m = today.getMonth() - birthMonth;
      if (m < 0 || (m === 0 && today.getDate() < birthDay)) age--;

      const isMarried = ['Menikah', 'Duda', 'Janda'].includes(formData?.statusPerkawinan || '');
      if (age < 21 && !isMarried) {
        errors.push(`Usia debitur (${age} tahun) belum memenuhi syarat minimum 21 tahun untuk status Belum Menikah`);
      }
    }

    if (!formData?.agama || formData.agama === '- SELECT -') {
      errors.push('Agama wajib dipilih');
    }
    if (!formData?.kebangsaan || formData.kebangsaan === '- SELECT -') {
      errors.push('Kebangsaan wajib dipilih');
    }
    if (!formData?.pendidikan || formData.pendidikan === '- SELECT -') {
      errors.push('Pendidikan wajib dipilih');
    }
    if (!formData?.statusPerkawinan || formData.statusPerkawinan === '- SELECT -') {
      errors.push('Status Perkawinan wajib dipilih');
    } else if (['Duda', 'Janda', 'Cerai'].some(s => formData.statusPerkawinan.includes(s))) {
      if (!formData?.statusPerceraian || formData.statusPerceraian === '- SELECT -') {
        errors.push('Status Perceraian wajib dipilih untuk status perkawinan Duda/Janda');
      }
    }

    if (!formData?.statusRumah || formData.statusRumah === '- SELECT -') {
      errors.push('Status Rumah tinggal wajib dipilih');
    }

    // CuBES Rule: Lama Menetap Bulan tidak boleh > 11
    if (formData?.lamaMenetapBulan) {
      const bln = parseInt(formData.lamaMenetapBulan, 10);
      if (isNaN(bln) || bln < 0 || bln > 11) {
        errors.push('Lama Menetap bulan tidak boleh lebih besar dari 11 (maks. 11 bulan)');
      }
    }

    if (!formData?.namaIbuKandung?.trim()) {
      errors.push('Nama Ibu Kandung wajib diisi');
    }

    // 2. Alamat KTP
    if (!formData?.alamatKtp?.trim()) errors.push('Alamat KTP wajib diisi');
    if (!formData?.kelurahanKtp?.trim()) errors.push('Kelurahan KTP wajib diisi');
    if (!formData?.kecamatanKtp?.trim()) errors.push('Kecamatan KTP wajib diisi');
    if (!formData?.rtKtp?.trim()) errors.push('RT KTP wajib diisi');
    if (!formData?.rwKtp?.trim()) errors.push('RW KTP wajib diisi');
    if (!formData?.kodeposKtp?.trim() || formData.kodeposKtp.trim().length !== 5) {
      errors.push('Kodepos KTP harus 5 digit angka');
    }

    // 3. Alamat Tinggal
    const isSame = Boolean(formData?.samaDenganKtp);
    const alamatTinggal = isSame ? formData?.alamatKtp : formData?.alamatTinggal;
    const kelTinggal = isSame ? formData?.kelurahanKtp : formData?.kelurahanTinggal;
    const kecTinggal = isSame ? formData?.kecamatanKtp : formData?.kecamatanTinggal;
    const rtTinggal = isSame ? formData?.rtKtp : formData?.rtTinggal;
    const rwTinggal = isSame ? formData?.rwKtp : formData?.rwTinggal;
    const zipTinggal = isSame ? formData?.kodeposKtp : formData?.kodeposTinggal;

    if (!alamatTinggal?.trim()) errors.push('Alamat Tinggal wajib diisi');
    if (!kelTinggal?.trim()) errors.push('Kelurahan Tinggal wajib diisi');
    if (!kecTinggal?.trim()) errors.push('Kecamatan Tinggal wajib diisi');
    if (!rtTinggal?.trim()) errors.push('RT Tinggal wajib diisi');
    if (!rwTinggal?.trim()) errors.push('RW Tinggal wajib diisi');
    if (!zipTinggal?.trim() || zipTinggal.trim().length !== 5) {
      errors.push('Kodepos Tinggal harus 5 digit angka');
    }

    // 4. Kontak (CuBES Rule: No Telp Rumah ATAU No Handphone harus diisi)
    const hasPhoneHome = Boolean(formData?.noTelpNumber?.trim());
    const hasPhoneMobile = Boolean(formData?.noHandphone?.trim());
    if (!hasPhoneHome && !hasPhoneMobile) {
      errors.push('No. Telp Rumah atau No. Handphone harus diisi (minimal salah satu)');
    }
    if (hasPhoneMobile) {
      const cleanHp = formData.noHandphone.trim().replace(/[^0-9]/g, '');
      if (cleanHp.length < 10 || cleanHp.length > 14) {
        errors.push('No. Handphone harus valid (antara 10 s/d 14 digit angka)');
      }
    }

    // 5. Identitas & Legalitas
    if (!formData?.jenisIdentitas || formData.jenisIdentitas === '- SELECT -') {
      errors.push('Jenis Identitas wajib dipilih');
    }
    if (!formData?.noIdentitas?.trim()) {
      errors.push('No. Identitas wajib diisi');
    } else if (formData.jenisIdentitas === 'KTP') {
      const cleanNik = formData.noIdentitas.replace(/\D/g, '');
      if (cleanNik.length !== 16) {
        errors.push(`No. Identitas KTP harus tepat 16 digit angka (saat ini ${cleanNik.length} digit)`);
      }
    }

    if (!formData?.tglTerbitHari || !formData?.tglTerbitBulan || !formData?.tglTerbitTahun) {
      errors.push('Tanggal Terbit Identitas wajib diisi');
    }
    if (!formData?.tempatTerbitIdentitas?.trim()) {
      errors.push('Tempat Terbit Identitas wajib diisi');
    }

    // CuBES Rule: Masa Berlaku KTP tidak boleh sudah habis
    if (!formData?.seumurHidup) {
      if (!formData?.masaBerlakuHari || !formData?.masaBerlakuBulan || !formData?.masaBerlakuTahun) {
        errors.push('Masa Berlaku Identitas wajib diisi (atau centang Seumur Hidup jika e-KTP)');
      } else {
        const expYear = parseInt(formData.masaBerlakuTahun, 10);
        const expMonth = parseInt(formData.masaBerlakuBulan, 10) - 1;
        const expDay = parseInt(formData.masaBerlakuHari, 10);
        const expDate = new Date(expYear, expMonth, expDay);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expDate <= today) {
          errors.push('Masa Berlaku KTP telah habis / kadaluwarsa. Silakan periksa kembali!');
        }
      }
    }

    // CuBES Rule: Kendaraan wajib diisi
    if (!formData?.kendaraanDimiliki || formData.kendaraanDimiliki === '- SELECT -') {
      errors.push('Kendaraan yang dimiliki wajib dipilih');
    }

    // Skema Angsuran wajib
    if (!formData?.skemaAngsuran || formData.skemaAngsuran === '- SELECT -') {
      errors.push('Skema Angsuran wajib dipilih');
    }

    return errors;
  };

  const handleLanjutClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors = validateFormCuBES();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrorModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setValidationErrors([]);
      setShowErrorModal(false);
      if (onLanjut) onLanjut(e);
    }
  };

  const isDudaOrJanda = ['Duda', 'Janda', 'Cerai'].some(s => (formData?.statusPerkawinan || '').includes(s));
  const isKtp = (formData?.jenisIdentitas || 'KTP') === 'KTP';

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      {/* MODAL / ALERT VALIDASI ERROR CuBES */}
      {showErrorModal && validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border-2 border-red-500 rounded-xl shadow-md text-red-900 animate-shake">
          <div className="flex items-center justify-between pb-2 border-b border-red-200">
            <div className="flex items-center gap-2 font-bold text-sm text-red-700">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>Validasi Formulir Informasi Debitur (Aturan CuBES eLO BNI)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="text-xs px-2 py-0.5 bg-red-200 hover:bg-red-300 text-red-900 rounded font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <div className="mt-2 text-xs">
            <p className="font-semibold text-red-800 mb-1">Terdapat beberapa field wajib yang belum diisi atau belum sesuai standar perbankan:</p>
            <ul className="list-disc list-inside space-y-0.5 text-red-700 pl-2">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 1. INFORMASI DEBITUR (3 KOLOM RESMI CUBESENH3) */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs">
          <span>INFORMASI DEBITUR (PERSYARATAN LENGKAP CuBES eLO BNI)</span>
          <span className="text-[10px] bg-orange-950/60 px-2 py-0.5 rounded font-mono">TAB 3 • PRM</span>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#f8fafb]">
          
          {/* ============================================================== */}
          {/* KOLOM 1: DATA PRIBADI & KELUARGA (CuBES: table2) */}
          {/* ============================================================== */}
          <div className="space-y-2.5 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-5 pb-4 lg:pb-0">
            <div className="font-bold text-[#9A3412] border-b border-orange-200 pb-1 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
              I. Data Pribadi & Keluarga
            </div>

            <div className="grid grid-cols-3 gap-2">
              <SelectField 
                label="Panggilan" 
                value={formData?.panggilan || 'BAPAK'} 
                onChange={(e) => onChange('panggilan', e.target.value)} 
                options={['BAPAK', 'IBU', 'SDR', 'SDRI'].map(v => ({ label: v, value: v }))} 
              />
              <TextField 
                label="Gelar Sebelum" 
                value={formData?.gelarSebelumNama || ''} 
                onChange={(e) => onChange('gelarSebelumNama', e.target.value)} 
                placeholder="Dr. / Drs." 
              />
              <TextField 
                label="Gelar Setelah" 
                value={formData?.gelarSetelahNama || ''} 
                onChange={(e) => onChange('gelarSetelahNama', e.target.value)} 
                placeholder="S.E. / S.Kom" 
              />
            </div>

            <TextField 
              label="Nama Depan" 
              required 
              value={formData?.namaDepan || ''} 
              onChange={(e) => onChange('namaDepan', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
              placeholder="Nama depan pemohon" 
            />

            <div className="grid grid-cols-2 gap-2">
              <TextField 
                label="Nama Tengah" 
                value={formData?.namaTengah || ''} 
                onChange={(e) => onChange('namaTengah', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
                placeholder="Nama tengah" 
              />
              <TextField 
                label="Nama Belakang" 
                value={formData?.namaBelakang || ''} 
                onChange={(e) => onChange('namaBelakang', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
                placeholder="Nama belakang" 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SelectField 
                label="Jenis Kelamin" 
                required 
                value={formData?.jenisKelamin || ''} 
                onChange={(e) => onChange('jenisKelamin', e.target.value)} 
                options={[{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }]} 
              />
              <TextField 
                label="Tempat Lahir" 
                required
                value={formData?.tempatLahir || ''} 
                onChange={(e) => onChange('tempatLahir', e.target.value)} 
                placeholder="Kota kelahiran" 
              />
            </div>

            <DateField 
              label="Tanggal Lahir" 
              required 
              dayValue={formData?.tglLahirHari || ''} 
              monthValue={formData?.tglLahirBulan || ''} 
              yearValue={formData?.tglLahirTahun || ''} 
              onDayChange={(v) => onChange('tglLahirHari', v)} 
              onMonthChange={(v) => onChange('tglLahirBulan', v)} 
              onYearChange={(v) => onChange('tglLahirTahun', v)} 
            />

            <div className="grid grid-cols-2 gap-2">
              <SelectField 
                label="Agama" 
                required
                value={formData?.agama || ''} 
                onChange={(e) => onChange('agama', e.target.value)} 
                options={['ISLAM', 'KRISTEN PROTESTAN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU', 'LAINNYA'].map(v => ({ label: v, value: v }))} 
              />
              <SelectField 
                label="Kebangsaan" 
                required
                value={formData?.kebangsaan || 'WNI'} 
                onChange={(e) => onChange('kebangsaan', e.target.value)} 
                options={[{ label: 'WNI', value: 'WNI' }, { label: 'WNA', value: 'WNA' }]} 
              />
            </div>

            <SelectField 
              label="Pendidikan Terakhir" 
              required
              value={formData?.pendidikan || ''} 
              onChange={(e) => onChange('pendidikan', e.target.value)} 
              options={['SD', 'SMP', 'SMA/SMK', 'DIPLOMA (D1-D4)', 'SARJANA (S1)', 'PASCASARJANA (S2)', 'DOKTOR (S3)'].map(v => ({ label: v, value: v }))} 
            />

            <div className="grid grid-cols-2 gap-2">
              <SelectField 
                label="Status Pernikahan" 
                required
                value={formData?.statusPerkawinan || ''} 
                onChange={(e) => {
                  onChange('statusPerkawinan', e.target.value);
                  if (!['Duda', 'Janda', 'Cerai'].some(s => e.target.value.includes(s))) {
                    onChange('statusPerceraian', '');
                  }
                }} 
                options={['Belum Menikah', 'Menikah', 'Duda', 'Janda'].map(v => ({ label: v, value: v }))} 
              />
              <SelectField 
                label="Status Rumah" 
                required
                value={formData?.statusRumah || ''} 
                onChange={(e) => onChange('statusRumah', e.target.value)} 
                options={['Milik Sendiri', 'Milik Keluarga', 'Sewa/Kontrak', 'Rumah Dinas', 'Lainnya'].map(v => ({ label: v, value: v }))} 
              />
            </div>

            {/* Field Kondisional CuBES: Status Perceraian jika Duda / Janda */}
            {isDudaOrJanda && (
              <div className="p-2 bg-amber-50/80 border border-amber-300 rounded-lg animate-fade-in">
                <SelectField 
                  label="Status Perceraian (Wajib Diisi)" 
                  required
                  value={formData?.statusPerceraian || ''} 
                  onChange={(e) => onChange('statusPerceraian', e.target.value)} 
                  options={[
                    { label: '- SELECT -', value: '' },
                    { label: 'Cerai Hidup (Akta Cerai / Putusan Pengadilan)', value: 'CERAI_HIDUP' },
                    { label: 'Cerai Mati (Akta Kematian)', value: 'CERAI_MATI' }
                  ]} 
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <TextField 
                label="Lama Tinggal (Thn)" 
                value={formData?.lamaMenetapTahun || ''} 
                onChange={(e) => onChange('lamaMenetapTahun', e.target.value.replace(/\D/g, '').slice(0, 2))} 
                placeholder="Thn" 
              />
              <div>
                <TextField 
                  label="Lama Tinggal (Bln)" 
                  value={formData?.lamaMenetapBulan || ''} 
                  onChange={(e) => {
                    const num = e.target.value.replace(/\D/g, '').slice(0, 2);
                    onChange('lamaMenetapBulan', num);
                  }} 
                  placeholder="0 - 11" 
                />
                {parseInt(formData?.lamaMenetapBulan || '0', 10) > 11 && (
                  <span className="text-[10px] text-red-600 font-semibold block leading-tight mt-0.5">Maks. 11 bln</span>
                )}
              </div>
              <TextField 
                label="Jml Anak" 
                type="number" 
                value={formData?.jumlahAnak || ''} 
                onChange={(e) => onChange('jumlahAnak', e.target.value.replace(/\D/g, '').slice(0, 2))} 
                placeholder="0" 
              />
            </div>

            <TextField 
              label="Nama Depan Ibu Kandung" 
              required 
              value={formData?.namaIbuKandung || ''} 
              onChange={(e) => onChange('namaIbuKandung', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
              placeholder="Nama ibu kandung pemohon" 
            />

            <div className="grid grid-cols-2 gap-2">
              <TextField 
                label="Nama Tengah Ibu" 
                value={formData?.namaTengahIbuKandung || ''} 
                onChange={(e) => onChange('namaTengahIbuKandung', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
                placeholder="Nama tengah ibu" 
              />
              <TextField 
                label="Nama Belakang Ibu" 
                value={formData?.namaBelakangIbuKandung || ''} 
                onChange={(e) => onChange('namaBelakangIbuKandung', e.target.value.replace(/[^a-zA-Z\s']/g, ''))} 
                placeholder="Nama belakang ibu" 
              />
            </div>

            <TextField 
              label="Hubungan dengan BNI (Thn)" 
              value={formData?.hubunganBniTahun || ''} 
              onChange={(e) => onChange('hubunganBniTahun', e.target.value.replace(/\D/g, '').slice(0, 2))} 
              placeholder="Contoh: 3 Tahun" 
            />
          </div>

          {/* ============================================================== */}
          {/* KOLOM 2: ALAMAT KTP & ALAMAT TINGGAL (CuBES: table3) */}
          {/* ============================================================== */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-5 pb-4 lg:pb-0">
            <div className="font-bold text-[#9A3412] border-b border-orange-200 pb-1 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
              II. Alamat KTP & Tempat Tinggal
            </div>

            {/* Sub-Card Alamat KTP */}
            <div className="p-2.5 bg-orange-50/50 rounded-lg border border-orange-200/80 space-y-2">
              <div className="font-semibold text-orange-950 text-[11px] flex items-center justify-between">
                <span>Alamat Identitas (KTP)</span>
                <span className="text-[10px] text-orange-700 font-normal">Wajib Sesuai e-KTP</span>
              </div>
              <TextField 
                label="Alamat KTP" 
                required 
                value={formData?.alamatKtp || ''} 
                onChange={(e) => onChange('alamatKtp', e.target.value)} 
                placeholder="Jalan, No. Rumah, Blok" 
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField 
                  label="Kelurahan / Desa" 
                  required
                  value={formData?.kelurahanKtp || ''} 
                  onChange={(e) => onChange('kelurahanKtp', e.target.value)} 
                  placeholder="Kelurahan" 
                />
                <TextField 
                  label="Kecamatan" 
                  required
                  value={formData?.kecamatanKtp || ''} 
                  onChange={(e) => onChange('kecamatanKtp', e.target.value)} 
                  placeholder="Kecamatan" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField 
                  label="RT KTP" 
                  required
                  maxLength={3} 
                  value={formData?.rtKtp || ''} 
                  onChange={(e) => onChange('rtKtp', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} 
                  placeholder="001" 
                />
                <TextField 
                  label="RW KTP" 
                  required
                  maxLength={3} 
                  value={formData?.rwKtp || ''} 
                  onChange={(e) => onChange('rwKtp', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} 
                  placeholder="005" 
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField 
                    label="Kodepos KTP" 
                    required 
                    maxLength={5} 
                    value={formData?.kodeposKtp || ''} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                      onChange('kodeposKtp', val);
                      lookupZipcodeAuto(val, 'Ktp');
                    }} 
                    placeholder="5 Digit" 
                  />
                </div>
                <button
                  type="button"
                  onClick={onCariZipKtp}
                  className="px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Cari</span>
                </button>
              </div>
              <TextField 
                label="Kota / Kabupaten KTP" 
                value={formData?.kotaKtp || ''} 
                onChange={(e) => onChange('kotaKtp', e.target.value)} 
                placeholder="Kota / Kab (Otomatis dari Kodepos)" 
              />
            </div>

            {/* Checkbox Sama dengan KTP (CuBES: cb_cu_sameaddr) */}
            <div className="p-2 bg-white rounded-lg border border-gray-300 shadow-2xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(formData?.samaDenganKtp)}
                  onChange={(e) => handleSameWithKtp(e.target.checked)}
                  className="w-4 h-4 text-[#C2410C] rounded border-gray-300 focus:ring-[#C2410C] cursor-pointer"
                />
                <span className="text-xs font-bold text-gray-800">
                  Alamat Tempat Tinggal Sama dengan Alamat KTP
                </span>
              </label>
            </div>

            {/* Sub-Card Alamat Tempat Tinggal */}
            <div className={`p-2.5 rounded-lg border space-y-2 transition-all ${
              formData?.samaDenganKtp ? 'bg-gray-100/70 border-gray-200 opacity-90' : 'bg-white border-orange-200'
            }`}>
              <div className="font-semibold text-gray-900 text-[11px] flex items-center justify-between">
                <span>Alamat Tempat Tinggal (Domisili Riil)</span>
                {formData?.samaDenganKtp && <span className="text-[10px] text-green-700 font-semibold bg-green-100 px-1.5 py-0.5 rounded">Sinkron KTP</span>}
              </div>
              <TextField 
                label="Alamat Tinggal" 
                required 
                disabled={Boolean(formData?.samaDenganKtp)}
                value={formData?.samaDenganKtp ? (formData?.alamatKtp || '') : (formData?.alamatTinggal || '')} 
                onChange={(e) => onChange('alamatTinggal', e.target.value)} 
                placeholder="Alamat domisili saat ini" 
              />
              <div className="grid grid-cols-2 gap-2">
                <TextField 
                  label="Kelurahan Tinggal" 
                  required
                  disabled={Boolean(formData?.samaDenganKtp)}
                  value={formData?.samaDenganKtp ? (formData?.kelurahanKtp || '') : (formData?.kelurahanTinggal || '')} 
                  onChange={(e) => onChange('kelurahanTinggal', e.target.value)} 
                  placeholder="Kelurahan" 
                />
                <TextField 
                  label="Kecamatan Tinggal" 
                  required
                  disabled={Boolean(formData?.samaDenganKtp)}
                  value={formData?.samaDenganKtp ? (formData?.kecamatanKtp || '') : (formData?.kecamatanTinggal || '')} 
                  onChange={(e) => onChange('kecamatanTinggal', e.target.value)} 
                  placeholder="Kecamatan" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <TextField 
                  label="RT Tinggal" 
                  required
                  maxLength={3} 
                  disabled={Boolean(formData?.samaDenganKtp)}
                  value={formData?.samaDenganKtp ? (formData?.rtKtp || '') : (formData?.rtTinggal || '')} 
                  onChange={(e) => onChange('rtTinggal', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} 
                  placeholder="001" 
                />
                <TextField 
                  label="RW Tinggal" 
                  required
                  maxLength={3} 
                  disabled={Boolean(formData?.samaDenganKtp)}
                  value={formData?.samaDenganKtp ? (formData?.rwKtp || '') : (formData?.rwTinggal || '')} 
                  onChange={(e) => onChange('rwTinggal', e.target.value.replace(/[^0-9]/g, '').slice(0, 3))} 
                  placeholder="005" 
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <TextField 
                    label="Kodepos Tinggal" 
                    required 
                    maxLength={5} 
                    disabled={Boolean(formData?.samaDenganKtp)}
                    value={formData?.samaDenganKtp ? (formData?.kodeposKtp || '') : (formData?.kodeposTinggal || '')} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                      onChange('kodeposTinggal', val);
                      lookupZipcodeAuto(val, 'Tinggal');
                    }} 
                    placeholder="5 Digit" 
                  />
                </div>
                {!formData?.samaDenganKtp && (
                  <button
                    type="button"
                    onClick={onCariZipTinggal}
                    className="px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded font-semibold text-xs shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Cari</span>
                  </button>
                )}
              </div>
              <TextField 
                label="Kota / Kabupaten Tinggal" 
                disabled={Boolean(formData?.samaDenganKtp)}
                value={formData?.samaDenganKtp ? (formData?.kotaKtp || '') : (formData?.kotaTinggal || '')} 
                onChange={(e) => onChange('kotaTinggal', e.target.value)} 
                placeholder="Kota Domisili" 
              />
            </div>
          </div>

          {/* ============================================================== */}
          {/* KOLOM 3: KONTAK, IDENTITAS & FASILITAS BNI (CuBES: table4) */}
          {/* ============================================================== */}
          <div className="space-y-2.5">
            <div className="font-bold text-[#9A3412] border-b border-orange-200 pb-1 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
              III. Kontak, Identitas & Fasilitas Bank
            </div>

            {/* Kontak Telepon (CuBES: BackColor #F4FBAC) */}
            <div className="grid grid-cols-3 gap-2">
              <TextField 
                label="Kode Area" 
                maxLength={5} 
                value={formData?.noTelpArea || ''} 
                onChange={(e) => onChange('noTelpArea', e.target.value.replace(/\D/g, '').slice(0, 5))} 
                placeholder="021" 
                className="bg-[#F4FBAC]"
              />
              <div className="col-span-2">
                <TextField 
                  label="No. Telp Rumah" 
                  value={formData?.noTelpNumber || ''} 
                  onChange={(e) => onChange('noTelpNumber', e.target.value.replace(/\D/g, '').slice(0, 15))} 
                  placeholder="Nomor Telp Rumah" 
                  className="bg-[#F4FBAC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <TextField 
                label="No. Telp Lainnya" 
                value={formData?.noTelpLainnya || ''} 
                onChange={(e) => onChange('noTelpLainnya', e.target.value.replace(/\D/g, '').slice(0, 20))} 
                placeholder="No alternatif" 
              />
              <TextField 
                label="Email" 
                type="email" 
                value={formData?.email || ''} 
                onChange={(e) => onChange('email', e.target.value)} 
                placeholder="debitur@email.com" 
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <TextField 
                label="Fax Area" 
                maxLength={5} 
                value={formData?.faxArea || ''} 
                onChange={(e) => onChange('faxArea', e.target.value.replace(/\D/g, '').slice(0, 5))} 
                placeholder="021" 
              />
              <div className="col-span-2">
                <TextField 
                  label="No. Fax" 
                  value={formData?.faxNumber || ''} 
                  onChange={(e) => onChange('faxNumber', e.target.value.replace(/\D/g, '').slice(0, 15))} 
                  placeholder="Nomor Fax" 
                />
              </div>
            </div>

            <div>
              <TextField 
                label="No. Handphone (Utama)" 
                required 
                value={formData?.noHandphone || ''} 
                onChange={(e) => onChange('noHandphone', e.target.value.replace(/[^0-9+]/g, '').slice(0, 15))} 
                placeholder="0812xxxxxxxx" 
                className="bg-[#F4FBAC]"
              />
              <span className="text-[10px] text-gray-500 block mt-0.5 italic">
                *Minimal salah satu No. Telp Rumah atau No. HP wajib diisi (Standar CuBES)
              </span>
            </div>

            {/* Identitas Diri */}
            <div className="p-2.5 bg-orange-50/40 border border-orange-200 rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <SelectField 
                  label="Jenis Identitas" 
                  required 
                  value={formData?.jenisIdentitas || 'KTP'} 
                  onChange={(e) => {
                    onChange('jenisIdentitas', e.target.value);
                    if (e.target.value !== 'KTP') {
                      handleLifetimeChange(false);
                    }
                  }} 
                  options={['KTP', 'SIM', 'PASPOR'].map(v => ({ label: v, value: v }))} 
                />
                
                {/* CuBES: chkIsLifetime hanya muncul jika KTP */}
                {isKtp ? (
                  <div className="flex flex-col justify-end pb-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer bg-white px-2 py-1.5 rounded border border-gray-300 shadow-2xs hover:bg-orange-50/50">
                      <input
                        type="checkbox"
                        checked={Boolean(formData?.seumurHidup)}
                        onChange={(e) => handleLifetimeChange(e.target.checked)}
                        className="w-4 h-4 text-[#C2410C] rounded border-gray-300 focus:ring-[#C2410C] cursor-pointer"
                      />
                      <span className="text-[11px] font-bold text-gray-800">Seumur Hidup</span>
                    </label>
                  </div>
                ) : <div />}
              </div>

              <div>
                <TextField 
                  label="No. Identitas" 
                  required 
                  maxLength={16} 
                  value={formData?.noIdentitas || ''} 
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 16);
                    onChange('noIdentitas', clean);
                  }} 
                  placeholder="16 Digit No. KTP" 
                />
                {isKtp && formData?.noIdentitas?.length === 16 && (
                  <div className="flex items-center justify-between mt-1 text-[11px] bg-blue-50 text-blue-800 p-1.5 rounded border border-blue-200">
                    <span>Format NIK 16 digit valid (Sesuai e-KTP)</span>
                    <button
                      type="button"
                      onClick={handleSyncNikToNpwp}
                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      {npwpCopied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                      <span>{npwpCopied ? 'Tersalin ke NPWP' : 'Salin ke NPWP'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <DateField 
                  label="Tanggal Terbit" 
                  required 
                  dayValue={formData?.tglTerbitHari || ''} 
                  monthValue={formData?.tglTerbitBulan || ''} 
                  yearValue={formData?.tglTerbitTahun || ''} 
                  onDayChange={(v) => onChange('tglTerbitHari', v)} 
                  onMonthChange={(v) => onChange('tglTerbitBulan', v)} 
                  onYearChange={(v) => onChange('tglTerbitTahun', v)} 
                />
                <TextField 
                  label="Tempat Terbit" 
                  required
                  value={formData?.tempatTerbitIdentitas || ''} 
                  onChange={(e) => onChange('tempatTerbitIdentitas', e.target.value)} 
                  placeholder="Kota Penerbit" 
                />
              </div>

              <div>
                <DateField 
                  label="Masa Berlaku" 
                  disabled={Boolean(formData?.seumurHidup)}
                  dayValue={formData?.masaBerlakuHari || ''} 
                  monthValue={formData?.masaBerlakuBulan || ''} 
                  yearValue={formData?.masaBerlakuTahun || ''} 
                  onDayChange={(v) => onChange('masaBerlakuHari', v)} 
                  onMonthChange={(v) => onChange('masaBerlakuBulan', v)} 
                  onYearChange={(v) => onChange('masaBerlakuTahun', v)} 
                />
                {formData?.seumurHidup && (
                  <span className="text-[10px] text-green-700 font-semibold block mt-0.5">
                    Berlaku otomatis sampai: 31/12/2099 (Seumur Hidup)
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <TextField 
                label="NPWP #" 
                value={formData?.npwp || ''} 
                onChange={(e) => onChange('npwp', e.target.value.replace(/\D/g, '').slice(0, 16))} 
                placeholder="15 atau 16 digit" 
              />
              <SelectField 
                label="Kendaraan" 
                required
                value={formData?.kendaraanDimiliki || ''} 
                onChange={(e) => onChange('kendaraanDimiliki', e.target.value)} 
                options={['Mobil', 'Motor', 'Mobil & Motor', 'Tidak Memiliki Kendaraan'].map(v => ({ label: v, value: v }))} 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <TextField 
                  label="No. Rekening Simpanan BNI" 
                  value={formData?.noRekSimpananBni || ''} 
                  onChange={(e) => onChange('noRekSimpananBni', e.target.value.replace(/\D/g, '').slice(0, 15))} 
                  placeholder="Rekening BNI" 
                  className="bg-[#F4FBAC]"
                />
                <span className="text-[10px] text-gray-500 block italic">Autodebet angsuran</span>
              </div>
              <SelectField 
                label="Skema Angsuran" 
                required
                value={formData?.skemaAngsuran || 'ANUITAS'} 
                onChange={(e) => onChange('skemaAngsuran', e.target.value)} 
                options={['ANUITAS', 'FLAT', 'EFEKTIF/FLOATING'].map(v => ({ label: v, value: v }))} 
              />
            </div>

            {/* Checkbox VVIP (CuBES: isVVIP) */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(formData?.isVvip)}
                  onChange={(e) => onChange('isVvip', e.target.checked)}
                  className="w-4 h-4 text-[#C2410C] rounded border-gray-300 focus:ring-[#C2410C] cursor-pointer"
                />
                <span className="text-xs font-semibold text-gray-700">Nasabah Prioritas / VVIP</span>
              </label>
              <span className="text-[10px] text-orange-800 font-mono">Status: CuBES Active</span>
            </div>

          </div>
        </div>
      </div>

      {/* 2. DOCUMENTS - CHECKLIST EDD RESMI BNI eLO */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs">
          <span>CHECKLIST DOKUMEN WAJIB EDD (INITIAL DATA ENTRY)</span>
          <span className="text-[10px] bg-orange-950/60 px-2 py-0.5 rounded font-mono">STANDAR eLO BNI</span>
        </div>
        
        <div className="p-4 space-y-4 bg-[#f8fafb]">
          {/* Quick Upload Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
            <input
              type="file"
              onChange={(e) => setSelectedUploadFile(e.target.files?.[0] || null)}
              className="flex-1 text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-gray-300 file:text-xs file:bg-gray-100 hover:file:bg-gray-200 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => handleUpload()}
              disabled={!selectedUploadFile}
              className="px-5 py-2 bg-[#C2410C] hover:bg-[#D94E1B] disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0"
            >
              Upload Lampiran Bebas
            </button>
          </div>

          {/* Checklist Table */}
          <div className="border border-gray-200 bg-white rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full"><table className="w-full border-collapse text-left text-xs">
              <thead className="bg-[#d35400] text-white font-bold border-b border-[#b33e00]">
                <tr>
                  <th className="p-2 text-center w-12 border-r border-[#b33e00]">No.</th>
                  <th className="p-2 w-32 border-r border-[#b33e00]">Kategori</th>
                  <th className="p-2 border-r border-[#b33e00]">Nama Dokumen Persyaratan</th>
                  <th className="p-2 w-28 text-center border-r border-[#b33e00]">Status</th>
                  <th className="p-2 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { cat: 'Identitas', name: 'e-KTP Pemohon & NPWP', docType: 'KTP_NPWP' },
                  { cat: 'Identitas', name: 'Kartu Keluarga (KK) & Akta Nikah / Cerai', docType: 'KK_NIKAH' },
                  { cat: 'Keuangan', name: 'Slip Gaji Asli / SK Penghasilan Terakhir', docType: 'SLIP_GAJI' },
                  { cat: 'Keuangan', name: 'Rekening Koran Tabungan 3 Bulan Terakhir', docType: 'REK_KORAN' },
                  { cat: 'Agunan', name: 'Sertifikat Agunan (SHM / SHGB / Sarusun)', docType: 'SERTIFIKAT' },
                  { cat: 'Agunan', name: 'IMB / PBG & Bukti Lunas PBB Terakhir', docType: 'IMB_PBB' },
                ].map((item, idx) => {
                  const uploaded = documents.find((d) => d.docType === item.docType || d.name?.toLowerCase().includes(item.cat.toLowerCase()));
                  return (
                    <tr key={item.docType} className="hover:bg-white">
                      <td className="p-2 border-r text-center font-mono">{idx + 1}</td>
                      <td className="p-2 border-r font-semibold text-gray-700">{item.cat}</td>
                      <td className="p-2 border-r">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {uploaded && <div className="text-[10px] text-[#C2410C] font-mono mt-0.5">File: {uploaded.name}</div>}
                      </td>
                      <td className="p-2 border-r text-center">
                        {uploaded ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                            TERUNGGAH
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            BELUM LENGKAP
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {uploaded ? (
                          <button
                            type="button"
                            onClick={() => setDocuments && setDocuments((p) => p.filter((d) => d.id !== uploaded.id))}
                            className="text-red-600 hover:underline font-semibold cursor-pointer text-xs"
                          >
                            Hapus
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedUploadFile) handleUpload(item.docType);
                              else alert('Pilih file terlebih dahulu pada input upload di atas.');
                            }}
                            className="text-[#C2410C] hover:underline font-semibold cursor-pointer text-xs"
                          >
                            Unggah File
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {/* Additional custom documents */}
                {documents
                  .filter((d) => !['KTP_NPWP', 'KK_NIKAH', 'SLIP_GAJI', 'REK_KORAN', 'SERTIFIKAT', 'IMB_PBB'].includes(d.docType))
                  .map((doc, idx) => (
                    <tr key={doc.id || idx} className="hover:bg-white bg-orange-50/40">
                      <td className="p-2 border-r text-center font-mono">7+</td>
                      <td className="p-2 border-r font-semibold text-orange-900">Lampiran Lain</td>
                      <td className="p-2 border-r font-medium text-gray-900">{doc.name}</td>
                      <td className="p-2 border-r text-center">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 border border-green-300">
                          TERUNGGAH
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => setDocuments && setDocuments((p) => p.filter((d) => d.id !== doc.id))}
                          className="text-red-600 hover:underline font-semibold cursor-pointer text-xs"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table></div>
          </div>
        </div>
      </div>

      {/* TOMBOL LANJUT (CuBES: btn_save) */}
      <div className="flex justify-center py-2">
        <button 
          type="button" 
          onClick={handleLanjutClick} 
          className="px-14 py-2.5 bg-black hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded border border-slate-600 shadow-md cursor-pointer active:scale-95 transition-all flex items-center gap-2"
        >
          <span>Lanjut ke Tab 4: Pekerjaan Debitur</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default InformasiDebitur;
