import React from 'react';
import {
  TextField,
  SelectField
} from '@template/shared';

interface KontakEmergencyProps {
  formData?: any;
  onChange: (field: string, value: any) => void;
  onLanjut?: (e?: React.FormEvent) => void;
  onCariZipEmergency?: () => void;
  onCariZip?: () => void;
}

export const KontakEmergency: React.FC<KontakEmergencyProps> = ({
  formData,
  onChange,
  onLanjut,
  onCariZipEmergency,
  onCariZip,
}) => {
  const lookupZipcodeAuto = async (zip: string) => {
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?keyword=${zip}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          onChange('kotaEmergency', item.city || item.kota || '');
          if (item.kecamatan && !formData?.kecamatanEmergency) onChange('kecamatanEmergency', item.kecamatan);
          if (item.kelurahan && !formData?.kelurahanEmergency) onChange('kelurahanEmergency', item.kelurahan);
        }
      }
    } catch (e) {
      // silent
    }
  };

  const handleCariZip = () => {
    if (onCariZipEmergency) onCariZipEmergency();
    else if (onCariZip) onCariZip();
    else if (formData?.kodeposEmergency) lookupZipcodeAuto(formData.kodeposEmergency);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        {/* Header CuBES: Kontak Darurat (Emergency Contact) */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center">
          Kontak Darurat (Keluarga Terdekat Tidak Serumah)
        </div>

        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <span className="font-bold">Ketentuan CuBES:</span> Kontak darurat harus merupakan keluarga/saudara kandung/orang tua yang tidak tinggal satu rumah dengan pemohon.
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 bg-[#f8fafb]">
          {/* Kolom Kiri */}
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            {/* Nama Kontak Darurat (CuBES: txt_cu_emnmfirst, mid, last) */}
            <TextField
              label="Nama Depan Kontak Darurat"
              required
              value={formData?.namaDepanEmergency || ''}
              onChange={(e) => onChange('namaDepanEmergency', e.target.value)}
              placeholder="Nama depan sesuai KTP"
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Nama Tengah Kontak Darurat"
                value={formData?.namaTengahEmergency || ''}
                onChange={(e) => onChange('namaTengahEmergency', e.target.value)}
                placeholder="Nama tengah (opsional)"
              />
              <TextField
                label="Nama Belakang Kontak Darurat"
                value={formData?.namaBelakangEmergency || ''}
                onChange={(e) => onChange('namaBelakangEmergency', e.target.value)}
                placeholder="Nama belakang / keluarga"
              />
            </div>

            {/* Hubungan Keluarga (CuBES: ddl_cu_emrelship) */}
            <SelectField
              label="Hubungan dengan Debitur"
              required
              value={formData?.hubunganEmergency || ''}
              onChange={(e) => onChange('hubunganEmergency', e.target.value)}
              options={[
                { label: '- SELECT -', value: '' },
                { label: 'Orang Tua (Ayah / Ibu)', value: 'ORANG_TUA' },
                { label: 'Mertua', value: 'MERTUA' },
                { label: 'Saudara Kandung (Kakak / Adik)', value: 'SAUDARA_KANDUNG' },
                { label: 'Anak', value: 'ANAK' },
                { label: 'Paman / Bibi', value: 'PAMAN_BIBI' },
                { label: 'Lainnya', value: 'LAINNYA' },
              ]}
            />

            {/* Alamat Lengkap (CuBES: txt_cu_emaddr1, 2, 3) */}
            <TextField
              label="Alamat Tempat Tinggal (Baris 1)"
              required
              value={formData?.alamatEmergency || ''}
              onChange={(e) => onChange('alamatEmergency', e.target.value)}
              placeholder="Jalan, No. Rumah, Blok"
            />
            <TextField
              label="Alamat Tempat Tinggal (Baris 2)"
              value={formData?.alamatEmergency2 || ''}
              onChange={(e) => onChange('alamatEmergency2', e.target.value)}
              placeholder="Kompleks / RT RW (opsional)"
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="Kelurahan"
                value={formData?.kelurahanEmergency || ''}
                onChange={(e) => onChange('kelurahanEmergency', e.target.value)}
                placeholder="Kelurahan"
              />
              <TextField
                label="Kecamatan"
                value={formData?.kecamatanEmergency || ''}
                onChange={(e) => onChange('kecamatanEmergency', e.target.value)}
                placeholder="Kecamatan"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField
                label="RT"
                maxLength={5}
                value={formData?.rtEmergency || ''}
                onChange={(e) => onChange('rtEmergency', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="001"
              />
              <TextField
                label="RW"
                maxLength={5}
                value={formData?.rwEmergency || ''}
                onChange={(e) => onChange('rwEmergency', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="002"
              />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField
                  label="Kodepos"
                  maxLength={10}
                  value={formData?.kodeposEmergency || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    onChange('kodeposEmergency', val);
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
              value={formData?.kotaEmergency || ''}
              onChange={(e) => onChange('kotaEmergency', e.target.value)}
              placeholder="Kota otomatis terisi"
            />
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-3">
            {/* No Telepon Rumah (CuBES: txt_cu_emhmphnarea & num) */}
            <div className="grid grid-cols-3 gap-2">
              <TextField
                label="Area"
                maxLength={4}
                value={formData?.telpRumahEmergencyArea || ''}
                onChange={(e) => onChange('telpRumahEmergencyArea', e.target.value.replace(/\D/g, ''))}
                placeholder="021"
              />
              <div className="col-span-2">
                <TextField
                  label="No. Telepon Rumah"
                  value={formData?.telpRumahEmergencyNumber || ''}
                  onChange={(e) => onChange('telpRumahEmergencyNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="1234567"
                />
              </div>
            </div>

            {/* No Telepon Kantor (CuBES: txt_cu_emofphnarea, num, ext) */}
            <div className="grid grid-cols-4 gap-2">
              <TextField
                label="Area"
                maxLength={4}
                value={formData?.telpKantorEmergencyArea || ''}
                onChange={(e) => onChange('telpKantorEmergencyArea', e.target.value.replace(/\D/g, ''))}
                placeholder="021"
              />
              <div className="col-span-2">
                <TextField
                  label="No. Telepon Kantor"
                  value={formData?.telpKantorEmergencyNumber || ''}
                  onChange={(e) => onChange('telpKantorEmergencyNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="1234567"
                />
              </div>
              <TextField
                label="Ext"
                maxLength={6}
                value={formData?.telpKantorEmergencyExt || ''}
                onChange={(e) => onChange('telpKantorEmergencyExt', e.target.value.replace(/\D/g, ''))}
                placeholder="101"
              />
            </div>

            {/* No Handphone (CuBES: txt_cu_emhpnum) */}
            <TextField
              label="No. Handphone Kontak Darurat"
              required
              value={formData?.noHpEmergency || ''}
              onChange={(e) => {
                let clean = e.target.value.replace(/[^0-9+]/g, '');
                if (clean.indexOf('+') > 0) clean = clean.charAt(0) + clean.slice(1).replace(/\+/g, '');
                onChange('noHpEmergency', clean.slice(0, clean.startsWith('+') ? 15 : 13));
              }}
              placeholder="Contoh: 0812xxxxxxxx"
            />
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

export default KontakEmergency;
