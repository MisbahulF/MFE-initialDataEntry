import React from 'react';
import { TextField, SelectField } from '@template/shared';

export interface KontakEmergencyProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onCariZipEmergency?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
}

export const KontakEmergency: React.FC<KontakEmergencyProps> = ({
  formData,
  onChange,
  onCariZipEmergency,
  onLanjut,
}) => {
  const handleCariZip = () => {
    if (onCariZipEmergency) onCariZipEmergency();
    else if (formData?.kodeposEmergency) onChange('kotaEmergency', 'Petamburan JAKARTA');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white border border-orange-300/70 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] px-4 py-2 text-white font-bold text-xs uppercase tracking-wider text-center shadow-2xs">
          KONTAK EMERGENCY
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 text-xs bg-[#f8fafb]">
          <div className="space-y-3 border-b lg:border-b-0 lg:border-r border-gray-200 lg:pr-6 pb-4 lg:pb-0">
            <TextField label="Nama Depan" required value={formData?.namaDepanEmergency || ''} onChange={(e) => onChange('namaDepanEmergency', e.target.value)} placeholder="Nama depan kontak darurat" />
            <TextField label="Nama Tengah" value={formData?.namaTengahEmergency || ''} onChange={(e) => onChange('namaTengahEmergency', e.target.value)} placeholder="Nama tengah" />
            <TextField label="Nama Belakang" value={formData?.namaBelakangEmergency || ''} onChange={(e) => onChange('namaBelakangEmergency', e.target.value)} placeholder="Nama belakang" />
            <TextField label="Alamat Kontak Emergency" value={formData?.alamatEmergency1 || ''} onChange={(e) => onChange('alamatEmergency1', e.target.value)} placeholder="Jalan, RT/RW, No. Rumah" />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="RT" maxLength={5} value={formData?.rtEmergency || ''} onChange={(e) => onChange('rtEmergency', e.target.value)} placeholder="001" />
              <TextField label="RW" maxLength={5} value={formData?.rwEmergency || ''} onChange={(e) => onChange('rwEmergency', e.target.value)} placeholder="002" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <TextField label="Kodepos" maxLength={10} value={formData?.kodeposEmergency || ''} onChange={(e) => onChange('kodeposEmergency', e.target.value)} placeholder="Contoh: 10260" />
              </div>
              <button type="button" onClick={handleCariZip} className="px-3 py-1.5 bg-[#F15A24] hover:bg-[#D94E1B] text-white rounded text-xs font-semibold shadow-xs cursor-pointer shrink-0 mb-0.5">Cari</button>
            </div>
            <TextField label="Kota" disabled value={formData?.kotaEmergency || ''} onChange={(e) => onChange('kotaEmergency', e.target.value)} placeholder="Kota otomatis terisi" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <TextField label="Kode Area" maxLength={4} value={formData?.telpRumahEmergencyArea || ''} onChange={(e) => onChange('telpRumahEmergencyArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="No. Telp Rumah" value={formData?.telpRumahEmergencyNumber || ''} onChange={(e) => onChange('telpRumahEmergencyNumber', e.target.value)} placeholder="1234567" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <TextField label="Area" maxLength={4} value={formData?.telpKantorEmergencyArea || ''} onChange={(e) => onChange('telpKantorEmergencyArea', e.target.value)} placeholder="021" />
              <div className="col-span-2">
                <TextField label="No. Telp Kantor" value={formData?.telpKantorEmergencyNumber || ''} onChange={(e) => onChange('telpKantorEmergencyNumber', e.target.value)} placeholder="1234567" />
              </div>
              <TextField label="Ext" maxLength={6} value={formData?.telpKantorEmergencyExt || ''} onChange={(e) => onChange('telpKantorEmergencyExt', e.target.value)} placeholder="101" />
            </div>
            <TextField label="No. Handphone" required value={formData?.noHpEmergency || ''} onChange={(e) => onChange('noHpEmergency', e.target.value)} placeholder="0812xxxxxxxx" />
            <SelectField
              label="Hubungan dengan Debitur"
              required
              value={formData?.hubunganEmergency || ''}
              onChange={(e) => onChange('hubunganEmergency', e.target.value)}
              options={[
                { label: 'Orang Tua', value: 'Orang Tua' },
                { label: 'Anak', value: 'Anak' },
                { label: 'Saudara Kandung', value: 'Saudara Kandung' },
                { label: 'Keluarga Lainnya', value: 'Keluarga Lainnya' },
                { label: 'Teman / Rekan Kerja', value: 'Teman / Rekan Kerja' },
                { label: 'Lainnya', value: 'Lainnya' },
              ]}
            />
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

export default KontakEmergency;
