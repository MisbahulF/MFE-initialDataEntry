import React, { useState } from 'react';
import { TextField, SelectField, CheckboxField, DateField } from '@template/shared';

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

  const handleSameWithKtp = (checked: boolean) => {
    if (onSameWithKtp) { onSameWithKtp(checked); }
    else if (checked) {
      ['alamat', 'kelurahan', 'kecamatan', 'rt', 'rw', 'kodepos', 'kota'].forEach((f) => onChange(f + 'Tinggal', formData?.[f + 'Ktp'] || ''));
    }
  };

  const handleCariKtp = () => (onCariZipKtp ? onCariZipKtp() : formData?.kodeposKtp && onChange('kotaKtp', 'Petamburan JAKARTA'));
  const handleCariTinggal = () => (onCariZipTinggal ? onCariZipTinggal() : formData?.kodeposTinggal && onChange('kotaTinggal', 'Petamburan JAKARTA'));

  return (
    <div className="space-y-4 animate-fade-in text-xs">
      {/* 1. INFORMASI DEBITUR */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center shadow-2xs">
          INFORMASI DEBITUR
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 bg-[#f8fafb]">
          {/* Kolom Kiri: Identitas & Alamat */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <div className="grid grid-cols-3 gap-2">
              <SelectField label="Panggilan" value={formData?.panggilan || ''} onChange={(e) => onChange('panggilan', e.target.value)} options={['BAPAK', 'IBU', 'SDR', 'SDRI'].map(v => ({ label: v, value: v }))} />
              <TextField label="Gelar Sebelum" value={formData?.gelarSebelumNama || ''} onChange={(e) => onChange('gelarSebelumNama', e.target.value)} placeholder="Dr." />
              <TextField label="Gelar Setelah" value={formData?.gelarSetelahNama || ''} onChange={(e) => onChange('gelarSetelahNama', e.target.value)} placeholder="S.Kom" />
            </div>
            <TextField label="Nama Depan" required value={formData?.namaDepan || ''} onChange={(e) => onChange('namaDepan', e.target.value)} placeholder="Nama depan" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Nama Tengah" value={formData?.namaTengah || ''} onChange={(e) => onChange('namaTengah', e.target.value)} placeholder="Nama tengah" />
              <TextField label="Nama Belakang" value={formData?.namaBelakang || ''} onChange={(e) => onChange('namaBelakang', e.target.value)} placeholder="Nama belakang" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Jenis Kelamin" required value={formData?.jenisKelamin || ''} onChange={(e) => onChange('jenisKelamin', e.target.value)} options={[{ label: 'Laki-laki', value: 'Laki-laki' }, { label: 'Perempuan', value: 'Perempuan' }]} />
              <TextField label="Tempat Lahir" value={formData?.tempatLahir || ''} onChange={(e) => onChange('tempatLahir', e.target.value)} placeholder="Kota tempat lahir" />
            </div>
            <DateField label="Tanggal Lahir" required dayValue={formData?.tglLahirHari || ''} monthValue={formData?.tglLahirBulan || ''} yearValue={formData?.tglLahirTahun || ''} onDayChange={(v) => onChange('tglLahirHari', v)} onMonthChange={(v) => onChange('tglLahirBulan', v)} onYearChange={(v) => onChange('tglLahirTahun', v)} />
            <div className="grid grid-cols-3 gap-2">
              <SelectField label="Agama" value={formData?.agama || ''} onChange={(e) => onChange('agama', e.target.value)} options={['ISLAM', 'KRISTEN PROTESTAN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU'].map(v => ({ label: v, value: v }))} />
              <SelectField label="Kebangsaan" value={formData?.kebangsaan || ''} onChange={(e) => onChange('kebangsaan', e.target.value)} options={[{ label: 'WNI', value: 'WNI' }, { label: 'WNA', value: 'WNA' }]} />
              <SelectField label="Pendidikan" value={formData?.pendidikan || ''} onChange={(e) => onChange('pendidikan', e.target.value)} options={['SD', 'SMP', 'SMA/SMK', 'DIPLOMA (D1-D4)', 'SARJANA (S1)', 'PASCASARJANA (S2)', 'DOKTOR (S3)'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Status Nikah" value={formData?.statusPerkawinan || ''} onChange={(e) => onChange('statusPerkawinan', e.target.value)} options={['Belum Menikah', 'Menikah', 'Duda', 'Janda'].map(v => ({ label: v, value: v }))} />
              <SelectField label="Status Rumah" value={formData?.statusRumah || ''} onChange={(e) => onChange('statusRumah', e.target.value)} options={['Milik Sendiri', 'Milik Keluarga', 'Sewa/Kontrak', 'Dinas', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Lama Menetap (Thn)" value={formData?.lamaMenetapTahun || ''} onChange={(e) => onChange('lamaMenetapTahun', e.target.value)} placeholder="Tahun" />
              <TextField label="Lama Menetap (Bln)" value={formData?.lamaMenetapBulan || ''} onChange={(e) => onChange('lamaMenetapBulan', e.target.value)} placeholder="Bulan" />
              <TextField label="Jumlah Anak" type="number" value={formData?.jumlahAnak || ''} onChange={(e) => onChange('jumlahAnak', e.target.value)} placeholder="0" />
            </div>
            <TextField label="Nama Ibu Kandung" required value={formData?.namaIbuKandung || ''} onChange={(e) => onChange('namaIbuKandung', e.target.value)} placeholder="Nama lengkap ibu kandung" />
            <TextField label="Hubungan dgn BNI (Thn)" value={formData?.hubunganBniTahun || ''} onChange={(e) => onChange('hubunganBniTahun', e.target.value)} placeholder="Contoh: 5" />
            <div className="pt-2 border-t border-gray-200">
              <div className="font-bold text-orange-900 pb-1 uppercase tracking-wide text-[11px]">Alamat KTP</div>
              <TextField label="Alamat KTP" required value={formData?.alamatKtp || ''} onChange={(e) => onChange('alamatKtp', e.target.value)} placeholder="Jalan, RT/RW, No. Rumah" />
              <div className="grid grid-cols-2 gap-3 mt-2">
                <TextField label="Kelurahan" value={formData?.kelurahanKtp || ''} onChange={(e) => onChange('kelurahanKtp', e.target.value)} placeholder="Kelurahan" />
                <TextField label="Kecamatan" value={formData?.kecamatanKtp || ''} onChange={(e) => onChange('kecamatanKtp', e.target.value)} placeholder="Kecamatan" />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <TextField label="RT" maxLength={5} value={formData?.rtKtp || ''} onChange={(e) => onChange('rtKtp', e.target.value)} placeholder="001" />
                <TextField label="RW" maxLength={5} value={formData?.rwKtp || ''} onChange={(e) => onChange('rwKtp', e.target.value)} placeholder="002" />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <div className="flex-1">
                  <TextField label="Kodepos" required maxLength={10} value={formData?.kodeposKtp || ''} onChange={(e) => onChange('kodeposKtp', e.target.value)} placeholder="10260" />
                </div>
                <button type="button" onClick={handleCariKtp} className="px-3 py-1.5 bg-[#F15A24] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
              </div>
              <TextField label="Kota" disabled value={formData?.kotaKtp || ''} onChange={(e) => onChange('kotaKtp', e.target.value)} placeholder="Kota otomatis" />
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between pb-1">
                <span className="font-bold text-orange-900 uppercase tracking-wide text-[11px]">Alamat Tinggal</span>
                <CheckboxField label="Sama dengan KTP" onChange={(e) => handleSameWithKtp(e.target.checked)} />
              </div>
              <TextField label="Alamat Tinggal" value={formData?.alamatTinggal || ''} onChange={(e) => onChange('alamatTinggal', e.target.value)} placeholder="Jalan, RT/RW, No. Rumah" />
              <div className="grid grid-cols-2 gap-3 mt-2">
                <TextField label="Kelurahan" value={formData?.kelurahanTinggal || ''} onChange={(e) => onChange('kelurahanTinggal', e.target.value)} placeholder="Kelurahan" />
                <TextField label="Kecamatan" value={formData?.kecamatanTinggal || ''} onChange={(e) => onChange('kecamatanTinggal', e.target.value)} placeholder="Kecamatan" />
              </div>
              <div className="flex items-end gap-2 mt-2">
                <div className="flex-1">
                  <TextField label="Kodepos" maxLength={10} value={formData?.kodeposTinggal || ''} onChange={(e) => onChange('kodeposTinggal', e.target.value)} placeholder="10260" />
                </div>
                <button type="button" onClick={handleCariTinggal} className="px-3 py-1.5 bg-[#F15A24] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
              </div>
              <TextField label="Kota" disabled value={formData?.kotaTinggal || ''} onChange={(e) => onChange('kotaTinggal', e.target.value)} placeholder="Kota otomatis" />
            </div>
          </div>

          {/* Kolom Kanan: Kontak & Identitas */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Area" maxLength={4} value={formData?.noTelpArea || ''} onChange={(e) => onChange('noTelpArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="No. Telp Rumah" value={formData?.noTelpNumber || ''} onChange={(e) => onChange('noTelpNumber', e.target.value)} placeholder="1234567" />
              </div>
            </div>
            <TextField label="No. Telp Lainnya" value={formData?.noTelpLainnya || ''} onChange={(e) => onChange('noTelpLainnya', e.target.value)} placeholder="Nomor alternatif" />
            <TextField label="Email" type="email" value={formData?.email || ''} onChange={(e) => onChange('email', e.target.value)} placeholder="debitur@email.com" />
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Fax Area" maxLength={4} value={formData?.faxArea || ''} onChange={(e) => onChange('faxArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="Fax #" value={formData?.faxNumber || ''} onChange={(e) => onChange('faxNumber', e.target.value)} placeholder="1234567" />
              </div>
            </div>
            <TextField label="No. Handphone" required value={formData?.noHandphone || ''} onChange={(e) => onChange('noHandphone', e.target.value)} placeholder="0812xxxxxxxx" />
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Jenis Identitas" required value={formData?.jenisIdentitas || ''} onChange={(e) => onChange('jenisIdentitas', e.target.value)} options={['KTP', 'SIM', 'PASPOR'].map(v => ({ label: v, value: v }))} />
              <TextField label="No. Identitas" required maxLength={16} value={formData?.noIdentitas || ''} onChange={(e) => onChange('noIdentitas', e.target.value)} placeholder="16 digit" />
            </div>
            <DateField label="Tanggal Terbit" dayValue={formData?.tglTerbitHari || ''} monthValue={formData?.tglTerbitBulan || ''} yearValue={formData?.tglTerbitTahun || ''} onDayChange={(v) => onChange('tglTerbitHari', v)} onMonthChange={(v) => onChange('tglTerbitBulan', v)} onYearChange={(v) => onChange('tglTerbitTahun', v)} />
            <TextField label="Tempat Terbit" value={formData?.tempatTerbitIdentitas || ''} onChange={(e) => onChange('tempatTerbitIdentitas', e.target.value)} placeholder="Kota terbit" />
            <DateField label="Masa Berlaku" dayValue={formData?.masaBerlakuHari || ''} monthValue={formData?.masaBerlakuBulan || ''} yearValue={formData?.masaBerlakuTahun || ''} onDayChange={(v) => onChange('masaBerlakuHari', v)} onMonthChange={(v) => onChange('masaBerlakuBulan', v)} onYearChange={(v) => onChange('masaBerlakuTahun', v)} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="NPWP" value={formData?.npwp || ''} onChange={(e) => onChange('npwp', e.target.value)} placeholder="Nomor NPWP" />
              <SelectField label="Kendaraan" value={formData?.kendaraanDimiliki || ''} onChange={(e) => onChange('kendaraanDimiliki', e.target.value)} options={['Motor', 'Mobil', 'Tidak Ada', 'Lainnya'].map(v => ({ label: v, value: v }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="No. Rek BNI" value={formData?.noRekSimpananBni || ''} onChange={(e) => onChange('noRekSimpananBni', e.target.value)} placeholder="Rekening BNI" />
              <SelectField label="Skema Angsuran" value={formData?.skemaAngsuran || ''} onChange={(e) => onChange('skemaAngsuran', e.target.value)} options={['ANUITAS', 'FLAT', 'EFEKTIF'].map(v => ({ label: v, value: v }))} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOCUMENTS - CHECKLIST EDD RESMI BNI eLO */}
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs">
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
              className="px-5 py-2 bg-[#F15A24] hover:bg-[#D94E1B] disabled:opacity-50 text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0"
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
                  { cat: 'Identitas', name: 'Kartu Keluarga (KK) & Akta Nikah', docType: 'KK_NIKAH' },
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
                        {uploaded && <div className="text-[10px] text-[#F15A24] font-mono mt-0.5">File: {uploaded.name}</div>}
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
                            className="text-[#F15A24] hover:underline font-semibold cursor-pointer text-xs"
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

      {onLanjut && (
        <div className="flex justify-center py-2">
          <button type="button" onClick={onLanjut} className="px-12 py-2 bg-black hover:bg-slate-800 text-white font-bold text-xs tracking-wider rounded border border-slate-600 shadow-md cursor-pointer active:scale-95">Lanjut</button>
        </div>
      )}
    </div>
  );
};

export default InformasiDebitur;
