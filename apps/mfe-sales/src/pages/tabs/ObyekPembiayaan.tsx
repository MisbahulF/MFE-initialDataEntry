import { SearchZipcodeModal } from '../../components/SearchZipcodeModal';
import React, { useState, useEffect } from 'react';
import { Search, X, Check, MapPin, FileText, Building2, Loader2 } from 'lucide-react';
import { MASTER_LOKASI_INDONESIA } from '../../data/masterLokasiBi';
import { MASTER_PROYEK_INDONESIA, ProyekItem } from '../../data/masterProyek';
import { MASTER_AREA_CUBES } from '../../data/masterArea';
import { referenceService } from '../../services/referenceService';
import { ZipcodeResult } from '../../types/ide.types';

export interface ObyekPembiayaanProps {
  colForm: any;
  onChange: (field: string, value: any) => void;
  formData?: any;
  onAddCollateral?: () => void;
  onUpdateCollateral?: () => void;
  collaterals?: any[];
  onDeleteCollateral?: (index: number) => void;
  onEditCollateral?: (index: number) => void;
  onLanjut?: (e?: React.FormEvent) => void;
  editingIndex?: number | null;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
}


export const SUB_TIPE_TANAH_DAN_BANGUNAN = [
  { value: '', label: '- SELECT -' },
  { value: '10', label: 'Bgn IMB diatas tnh yg djmnkan' },
  { value: '39', label: 'Bgn tnp IMB diatas tanah SHM' },
  { value: '40', label: 'Bgn tnp IMB diatas tanah SHGB' },
  { value: '41', label: 'Bgn tnp IMB diatas tanah SHU' },
  { value: '42', label: 'Bgn tnp IMB diatas tanah SHP' },
  { value: '43', label: 'T & B dgn bukti SKGR' },
  { value: '44', label: 'BgnIMB diatas tnh SHGB perpanj' },
  { value: '45', label: 'BgnIMB diatas tnh SHGU perpanj' },
  { value: '46', label: 'Bgn IMB diatas tnh SHP perpanj' },
];

export const SUB_TIPE_TANAH = [
  { value: '', label: '- SELECT -' },
  { value: '01', label: 'Tanah Kosong / Kavling' },
  { value: '02', label: 'Tanah Perkebunan' },
  { value: '03', label: 'Tanah Pertanian' },
];

export const SUB_TIPE_BANGUNAN = [
  { value: '', label: '- SELECT -' },
  { value: '20', label: 'Bangunan Rumah Tinggal' },
  { value: '21', label: 'Bangunan Rusun / Apartemen' },
  { value: '22', label: 'Bangunan Gudang / Pabrik' },
];

export const SUB_TIPE_KENDARAAN = [
  { value: '', label: '- SELECT -' },
  { value: '30', label: 'Mobil Penumpang' },
  { value: '31', label: 'Mobil Angkutan / Niaga' },
  { value: '32', label: 'Sepeda Motor' },
];

export const STATUS_INDENT_OPTIONS = [
  { value: '', label: '- SELECT -' },
  { value: '0001', label: 'INDEN' },
  { value: '0002', label: 'NON-INDEN' },
  { value: '0003', label: 'TOP UP' },
];

export const TIPE_PROPERTI_OPTIONS = [
  { value: '', label: '- SELECT -' },
  { value: '001', label: 'RUMAH' },
  { value: '002', label: 'APARTEMENT' },
  { value: '003', label: 'RUKO / RUKAN' },
  { value: '005', label: 'VILLA' },
  { value: '006', label: 'TANAH/KAVLING' },
];

const MASTER_SERTIFIKAT = [
  { code: '0217', desc: 'SHM - SERTIFIKAT HAK MILIK' },
  { code: '0218', desc: 'SHGB - SERTIFIKAT HAK GUNA BANGUNAN' },
  { code: '0219', desc: 'SHMASRS - SERTIFIKAT HAK MILIK ATAS SATUAN RUMAH SUSUN (STRATA TITLE)' },
  { code: '0220', desc: 'SHGU - SERTIFIKAT HAK GUNA USAHA' },
  { code: '0221', desc: 'SHP - SERTIFIKAT HAK PAKAI' },
  { code: '0222', desc: 'AJB - AKTA JUAL BELI (NOTARIL)' },
  { code: '0223', desc: 'PPJB - PERJANJIAN PENGIKATAN JUAL BELI' },
  { code: '0224', desc: 'GIRIK / LETTER C' },
  { code: '0048', desc: 'LAIN-LAIN / LAINNYA' },
];

// MASTER_PROYEK diimpor dari masterProyek.ts (78+ Proyek se-Indonesia)

export const ObyekPembiayaan: React.FC<ObyekPembiayaanProps> = ({
  colForm,
  onChange,
  formData,
  onAddCollateral,
  onUpdateCollateral,
  collaterals = [],
  onDeleteCollateral,
  onEditCollateral,
  onLanjut,
  editingIndex = null,
  onCancelEdit,
  isSubmitting = false,
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // State Modals Lookup
  const [isLokasiModalOpen, setIsLokasiModalOpen] = useState(false);
  const [lokasiQuery, setLokasiQuery] = useState('');

  const [isSertifikatModalOpen, setIsSertifikatModalOpen] = useState(false);
  const [sertifikatQuery, setSertifikatQuery] = useState('');

  const [isProyekModalOpen, setIsProyekModalOpen] = useState(false);
  const [proyekQuery, setProyekQuery] = useState('');
  const [proyekRegionFilter, setProyekRegionFilter] = useState<'ALL' | 'BANTEN' | 'JABODETABEK' | 'JAWA_BARAT' | 'JAWA_TENGAH_TIMUR' | 'LUAR_JAWA'>('ALL');

  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [zipQuery, setZipQuery] = useState('');
  const [zipResults, setZipResults] = useState<ZipcodeResult[]>([]);
  const [isZipLoading, setIsZipLoading] = useState(false);

  // Debounced search for nationwide Indonesian postal codes & subdistricts
  useEffect(() => {
    if (!isZipModalOpen) return;
    setIsZipLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await referenceService.searchZipcode(zipQuery);
        setZipResults(data);
      } catch (err) {
        console.error('Error searching zipcode:', err);
      } finally {
        setIsZipLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [isZipModalOpen, zipQuery]);

  // Format number to Indonesian thousand separator
  const formatRupiah = (val: string | number) => {
    if (val === undefined || val === null || val === '') return '';
    const clean = String(val).replace(/\D/g, '');
    if (!clean) return '';
    return new Intl.NumberFormat('id-ID').format(Number(clean));
  };

  // Auto lookup kota based on kodepos prefix
  const getCityByZip = (zip: string) => {
    if (!zip) return '';
    const prefix = zip.slice(0, 2);
    if (['10', '11', '12', '13', '14'].includes(prefix)) return 'JAKARTA';
    if (prefix === '42') return 'SERANG';
    if (prefix === '15') return 'TANGERANG';
    if (prefix === '16') return 'BOGOR / DEPOK';
    if (prefix === '17') return 'BEKASI';
    if (prefix === '40' || prefix === '41') return 'BANDUNG';
    if (prefix === '60') return 'SURABAYA';
    if (prefix === '50') return 'SEMARANG';
    if (prefix === '20') return 'MEDAN';
    if (prefix === '70') return 'BANJARMASIN';
    if (prefix === '90') return 'MAKASSAR';
    if (prefix === '80') return 'DENPASAR';
    return 'JAKARTA';
  };

  // Apakah user sudah memilih Tipe Jaminan / Objek?
  const isObjectSelected = Boolean(colForm?.tipeJaminan && colForm.tipeJaminan.trim() !== '' && colForm.tipeJaminan !== '- SELECT -');

    // Sub-tipe options berdasarkan tipe jaminan CuBES
  const getSubTipeOptions = () => {
    const t = colForm?.tipeJaminan;
    if (t === 'Tanah Dan Bangunan' || t === 'H03') {
      return SUB_TIPE_TANAH_DAN_BANGUNAN;
    }
    if (t === 'Tanah' || t === 'H01') {
      return SUB_TIPE_TANAH;
    }
    if (t === 'Bangunan' || t === 'H02') {
      return SUB_TIPE_BANGUNAN;
    }
    if (t === 'Kendaraan Bermotor' || t === 'C01') {
      return SUB_TIPE_KENDARAAN;
    }
    return SUB_TIPE_TANAH_DAN_BANGUNAN;
  };

  const getSubTipeValue = () => {
    const val = colForm?.tipeSubJaminan;
    if (!val) return '40'; // CuBES default selected is 40 (Bgn tnp IMB diatas tanah SHGB)
    const opts = getSubTipeOptions();
    const found = opts.find((o) => o.value === val || o.label === val);
    return found ? found.value : val;
  };

  const getStatusIndentValue = () => {
    const v = colForm?.statusIndent;
    if (v === '0001' || v === 'INDEN') return '0001';
    if (v === '0002' || v === 'NON-INDEN') return '0002';
    if (v === '0003' || v === 'TOP UP') return '0003';
    return v || '0002';
  };

  const getAreaValue = () => {
    const v = colForm?.area;
    if (!v) return '2001';
    const found = MASTER_AREA_CUBES.find((a) => a.value === v || a.label.toUpperCase() === v.toUpperCase());
    return found ? found.value : v;
  };

  const getTipePropertiValue = () => {
    const v = colForm?.tipeProperti;
    if (!v) return '001';
    if (v === '001' || v === 'RUMAH' || v === 'RUMAH TINGGAL') return '001';
    if (v === '002' || v === 'APARTEMENT' || v === 'APARTEMEN') return '002';
    if (v === '003' || v === 'RUKO / RUKAN' || v === 'RUKO/RUKAN') return '003';
    if (v === '005' || v === 'VILLA') return '005';
    if (v === '006' || v === 'TANAH/KAVLING' || v === 'TANAH KAVLING') return '006';
    const found = TIPE_PROPERTI_OPTIONS.find((p) => p.value === v || p.label === v);
    return found ? found.value : v;
  };

  // Header code title (CuBES H01, H02, H03, C01)
  const getHeaderTitle = () => {
    if (!isObjectSelected) return 'OBYEK PEMBIAYAAN H03';
    if (colForm.tipeJaminan === 'Tanah Dan Bangunan' || colForm.tipeJaminan === 'H03') return 'OBYEK PEMBIAYAAN H03';
    if (colForm.tipeJaminan === 'Tanah' || colForm.tipeJaminan === 'H01') return 'OBYEK PEMBIAYAAN H01';
    if (colForm.tipeJaminan === 'Bangunan' || colForm.tipeJaminan === 'H02') return 'OBYEK PEMBIAYAAN H02';
    if (colForm.tipeJaminan === 'Kendaraan Bermotor' || colForm.tipeJaminan === 'C01') return 'OBYEK PEMBIAYAAN C01';
    return 'OBYEK PEMBIAYAAN H03';
  };

  // Status & Market Segment logic
  const handleStatusChange = (newStatus: string) => {
    onChange('status', newStatus);
    if (newStatus.startsWith('Developer PKS') || newStatus === 'Baru') {
      onChange('marketSegment', 'Primary Market');
    } else {
      onChange('marketSegment', 'Secondary Market');
    }
  };

  // Handle "Sama dengan Alamat Debitur/KTP"
  const handleToggleSameAddress = (checked: boolean) => {
    onChange('sameAddress', checked);
    if (checked) {
      const srcAddr1 = formData?.alamatKtp || 'Jl. Jend. Sudirman Kav. 52-53';
      const srcAddr2 = formData?.kelurahanKtp ? `Kel. ${formData.kelurahanKtp}` : 'Kel. Senayan';
      const srcAddr3 = formData?.kecamatanKtp ? `Kec. ${formData.kecamatanKtp}` : 'Kec. Kebayoran Baru';
      const srcRt = (formData?.rtKtp || formData?.rt || '001').replace(/\D/g, '').slice(0, 3);
      const srcRw = (formData?.rwKtp || formData?.rw || '002').replace(/\D/g, '').slice(0, 3);
      const srcZip = (formData?.kodeposKtp || '12190').replace(/\D/g, '').slice(0, 5);
      const srcKota = formData?.kotaKtp || getCityByZip(srcZip) || 'JAKARTA';

      onChange('alamat1', srcAddr1);
      onChange('alamat2', srcAddr2);
      onChange('alamat3', srcAddr3);
      onChange('rt', srcRt);
      onChange('rw', srcRw);
      onChange('kodepos', srcZip);
      onChange('kota', srcKota);
    }
  };

  // Filtered master lookup results across entire 514 Indonesian regencies & cities
  const filteredLokasi = MASTER_LOKASI_INDONESIA.filter(
    (l) =>
      l.desc.toLowerCase().includes(lokasiQuery.toLowerCase()) ||
      l.code.includes(lokasiQuery) ||
      l.prov.toLowerCase().includes(lokasiQuery.toLowerCase())
  );

  const filteredSertifikat = MASTER_SERTIFIKAT.filter(
    (s) => s.desc.toLowerCase().includes(sertifikatQuery.toLowerCase()) || s.code.includes(sertifikatQuery)
  );

  const filteredProyek = MASTER_PROYEK_INDONESIA.filter((p) => {
    const matchQuery =
      !proyekQuery ||
      p.proyek.toLowerCase().includes(proyekQuery.toLowerCase()) ||
      p.developer.toLowerCase().includes(proyekQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(proyekQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(proyekQuery.toLowerCase()) ||
      (p.pksNumber && p.pksNumber.toLowerCase().includes(proyekQuery.toLowerCase()));
    const matchRegion = proyekRegionFilter === 'ALL' || p.region === proyekRegionFilter;
    return matchQuery && matchRegion;
  });

    // Mandatory check according to CuBES Collateral.aspx cek_mandatory
  const validateCollateral = (): boolean => {
    const missing: string[] = [];

    if (!colForm?.kategoriPembiayaan) missing.push('Kategori Pembiayaan');
    if (!colForm?.tipeJaminan) missing.push('Tipe Jaminan/Objek yang Dibiayai');
    if (!colForm?.tipeSubJaminan) missing.push('Tipe Sub Jaminan/ Sub Objek yang Dibiayai');
    if (!colForm?.status) missing.push('Status');
    if (!colForm?.statusIndent) missing.push('Status Indent');
    if (!colForm?.area) missing.push('Area');

    const isDevPks = colForm?.status === 'Developer PKS' || colForm?.status === 'Baru' || !colForm?.status;
    const isDevNonPks = colForm?.status === 'Developer Non PKS' || colForm?.status === 'Lama';
    const isPerorangan = colForm?.status === 'Perorangan';

    if (isDevPks) {
      if (!colForm?.developer?.trim() && !colForm?.developerCode?.trim()) missing.push('Developer');
      if (!colForm?.proyek?.trim() && !colForm?.proyekId?.trim()) missing.push('Proyek');
      if (!colForm?.namaSalesDeveloper?.trim()) missing.push('Nama Sales Developer');
      if (!colForm?.noKtpSalesDeveloper?.trim()) missing.push('No. KTP Sales Developer');
    } else if (isDevNonPks) {
      if (!colForm?.developer?.trim()) missing.push('Developer');
      if (!colForm?.proyek?.trim()) missing.push('Proyek');
    }

    // Agen Properti mandatory if status agen is PKS
    if (colForm?.statusAgenProperti === 'PKS' || !colForm?.statusAgenProperti) {
      if (!colForm?.agenProperti?.trim()) missing.push('Agen Properti');
      if (!colForm?.namaSalesAgen?.trim()) missing.push('Nama Sales Agen Properti');
      if (!colForm?.noKtpSalesAgen?.trim()) missing.push('No. KTP Sales Agen Properti');
    }

    if (!colForm?.tipeProperti) missing.push('Tipe Properti');
    if (!colForm?.alamat1?.trim()) missing.push('Alamat');
    if (!colForm?.lokasiAgunanKode?.trim()) missing.push('Lokasi Agunan');

    // Luas Bangunan & Luas Area (CuBES txt_buildingarea & txt_landarea)
    if (colForm?.tipeJaminan !== 'Tanah' && colForm?.tipeJaminan !== 'H01' && !colForm?.luasBangunan?.trim()) {
      missing.push('Luas Bangunan');
    }
    if (colForm?.tipeJaminan !== 'Bangunan' && colForm?.tipeJaminan !== 'H02' && !colForm?.luasArea?.trim()) {
      missing.push('Luas Area');
    }

    if (!colForm?.perkiraanHarga?.trim()) missing.push('Perkiraan Harga');
    if (!colForm?.tipeSertifikatKode?.trim()) missing.push('Tipe Sertifikat');
    if (!colForm?.nomorUnit?.trim()) missing.push('Nomor/Unit');

    if (missing.length > 0) {
      setValidationErrors(missing);
      return false;
    }

    setValidationErrors([]);
    return true;
  };

  const handleActionTambahAgunan = () => {
    if (!validateCollateral()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    if (onAddCollateral) onAddCollateral();
  };

  const handleActionUpdateAgunan = () => {
    if (!validateCollateral()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    if (onUpdateCollateral) onUpdateCollateral();
  };

  const handleActionLanjut = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (collaterals.length === 0) {
      alert('Obyek Pembiayaan Belum Ada. Mohon tambahkan minimal 1 obyek pembiayaan ke dalam daftar terlebih dahulu.');
      return;
    }
    if (onLanjut) onLanjut(e);
  };

  // CuBES Pale Yellow Mandatory Classes
  const mandatoryInputClass =
    'h-[24px] px-2 bg-[#f4fbac] border border-[#b7c46b] text-gray-900 text-xs rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-1 focus:ring-orange-700/25 focus:border-[#C2410C] focus:bg-[#fffde5] transition-all font-medium';
  const optionalInputClass =
    'h-[24px] px-2 bg-white border border-slate-300 text-gray-900 text-xs rounded focus:outline-none focus:ring-1 focus:ring-orange-700/25 focus:border-[#C2410C] transition-all';
  const readOnlyInputClass =
    'h-[24px] px-2 bg-gray-100 border border-slate-300 text-gray-700 text-xs rounded cursor-not-allowed font-medium';

  const isApartemen = colForm?.tipeProperti === 'APARTEMEN';
  const isAddressLocked = Boolean(colForm?.sameAddress);

  return (
    <div className="space-y-4 font-sans text-[11px] text-gray-800">
      {/* =========================================================================
          CARD: OBYEK PEMBIAYAAN (Sesuai CuBES Collateral.aspx Asli)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07),0_2px_6px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(194,65,12,0.12)] transition-all duration-300 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white font-extrabold text-center py-2.5 text-xs tracking-widest uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
          {getHeaderTitle()}
        </div>

        {/* Validation Errors Banner */}
        {validationErrors.length > 0 && (
          <div className="m-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-xs text-red-800 animate-fadeIn">
            <div className="flex items-center justify-between mb-1 font-bold text-red-900">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Mohon lengkapi field mandatory (kuning) berikut:
              </span>
              <button
                type="button"
                onClick={() => setValidationErrors([])}
                className="text-red-500 hover:text-red-700 text-sm font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-red-700">
              {validationErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3">
          {/* JIKA BELUM MEMILIH OBYEK: Tampilkan Form Pemilihan Awal */}
          {!isObjectSelected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#cce8e8]">
              {/* Kolom Kiri: Pilihan Kategori (Auto Terisi & Disabled) & Tipe Jaminan */}
              <div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-[11px]">
                    <tbody>
                      <tr className="border-b border-[#e5f2f2]" id="tr_kategori_pembiayaan_init">
                        <td className="w-52 text-right pr-2 py-1.5 font-medium text-gray-700 whitespace-nowrap">
                          Kategori Pembiayaan :
                        </td>
                        <td className="p-1">
                          <select
                            id="Ddl_Kategori_Pembiayaan_Init"
                            name="Ddl_Kategori_Pembiayaan"
                            disabled
                            value={colForm?.kategoriPembiayaan || formData?.kategoriPembiayaan || 'Pembelian'}
                            className={`w-full max-w-[260px] ${readOnlyInputClass} opacity-80 cursor-not-allowed`}
                          >
                            <option value="">- SELECT -</option>
                            <option value="Pembelian">Pembelian</option>
                            <option value="Pembangunan">Pembangunan</option>
                            <option value="Renovasi">Renovasi</option>
                            <option value="Take Over">Take Over</option>
                            <option value="Top Up">Top Up</option>
                            <option value="Multiguna">Multiguna</option>
                            <option value="Refinancing">Refinancing</option>
                          </select>
                          <span className="block text-[10px] text-gray-400 mt-0.5 italic">
                            *(Otomatis terisi dari Fasilitas / Tujuan Pembiayaan di Tab Informasi Source Aplikasi)
                          </span>
                        </td>
                      </tr>

                      <tr className="border-b border-[#e5f2f2]" id="tr_col_type_init">
                        <td className="w-52 text-right pr-2 py-1.5 font-medium text-gray-700 whitespace-nowrap">
                          Tipe Jaminan/Objek yang Dibiayai :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_col_type_init"
                            name="ddl_col_type"
                            value={colForm?.tipeJaminan || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange('tipeJaminan', val);
                              if (val === 'Tanah Dan Bangunan' || val === 'H03') {
                                onChange('tipeSubJaminan', '40'); // Default selected CuBES
                              } else {
                                onChange('tipeSubJaminan', '');
                              }
                            }}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            <option value="">- SELECT -</option>
                            <option value="Tanah Dan Bangunan">Tanah Dan Bangunan</option>
                            <option value="Bangunan">Bangunan</option>
                            <option value="Tanah">Tanah</option>
                            <option value="Kendaraan Bermotor">Kendaraan Bermotor</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kolom Kanan: Panduan Pemilihan */}
              <div className="hidden md:flex flex-col items-center justify-center p-6 text-center text-gray-400 italic">
                <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C2410C] mb-2 font-bold text-sm">
                  i
                </div>
                <span>Silakan pilih <b>Tipe Jaminan/Objek yang Dibiayai</b> untuk menampilkan formulir lengkap rincian agunan.</span>
              </div>
            </div>
          ) : (
                        /* JIKA SUDAH MEMILIH OBYEK: Tampilkan Form Detail Lengkap 2 Kolom (Sesuai CuBES Collateral.aspx) */
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#cce8e8]">
              {/* Kolom Kiri: Spesifikasi & Alamat */}
              <div className="pr-0 md:pr-2">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-[11px]">
                    <tbody>
                      {/* Kategori Pembiayaan */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_kategori_pembiayaan">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Kategori Pembiayaan :
                        </td>
                        <td className="p-1">
                          <select
                            id="Ddl_Kategori_Pembiayaan"
                            name="Ddl_Kategori_Pembiayaan"
                            disabled
                            value={colForm?.kategoriPembiayaan || formData?.kategoriPembiayaan || 'Pembelian'}
                            onChange={(e) => onChange('kategoriPembiayaan', e.target.value)}
                            className={`w-full max-w-[260px] ${readOnlyInputClass} opacity-80`}
                          >
                            <option value="">- SELECT -</option>
                            <option value="Pembelian">Pembelian</option>
                            <option value="Pembangunan">Pembangunan</option>
                            <option value="Renovasi">Renovasi</option>
                            <option value="Take Over">Take Over</option>
                            <option value="Top Up">Top Up</option>
                            <option value="Multiguna">Multiguna</option>
                            <option value="Refinancing">Refinancing</option>
                          </select>
                        </td>
                      </tr>

                      {/* Tipe Jaminan */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_col_type">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Tipe Jaminan/Objek yang Dibiayai :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_col_type"
                            name="ddl_col_type"
                            value={
                              colForm?.tipeJaminan === 'Tanah Dan Bangunan' || colForm?.tipeJaminan === 'H03'
                                ? 'Tanah Dan Bangunan'
                                : colForm?.tipeJaminan === 'Bangunan' || colForm?.tipeJaminan === 'H02'
                                ? 'Bangunan'
                                : colForm?.tipeJaminan === 'Tanah' || colForm?.tipeJaminan === 'H01'
                                ? 'Tanah'
                                : colForm?.tipeJaminan === 'Kendaraan Bermotor' || colForm?.tipeJaminan === 'V01'
                                ? 'Kendaraan Bermotor'
                                : colForm?.tipeJaminan || ''
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              onChange('tipeJaminan', val);
                              if (val === 'Tanah Dan Bangunan' || val === 'H03') {
                                onChange('tipeSubJaminan', '40'); // CuBES default selected
                              } else {
                                onChange('tipeSubJaminan', '');
                              }
                            }}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            <option value="">- SELECT -</option>
                            <option value="Tanah Dan Bangunan">Tanah Dan Bangunan</option>
                            <option value="Bangunan">Bangunan</option>
                            <option value="Tanah">Tanah</option>
                            <option value="Kendaraan Bermotor">Kendaraan Bermotor</option>
                          </select>
                        </td>
                      </tr>

                      {/* Tipe Sub Jaminan */}
                      <tr className="border-b border-[#e5f2f2]" id="Tr_sub_col_type">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Tipe Sub Jaminan/ Sub Objek yang Dibiayai :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_sub_Col_type"
                            name="ddl_sub_Col_type"
                            value={getSubTipeValue()}
                            onChange={(e) => onChange('tipeSubJaminan', e.target.value)}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            {getSubTipeOptions().map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Status */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_old_status">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">Status :</td>
                        <td className="p-1">
                          <div className="flex items-center gap-3 text-xs">
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="cb_new"
                                name="old_status"
                                checked={colForm?.status === 'Developer PKS' || colForm?.status === 'Baru' || !colForm?.status}
                                onChange={() => handleStatusChange('Developer PKS')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="cb_new" className="cursor-pointer">Developer PKS</label>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="cb_old"
                                name="old_status"
                                checked={colForm?.status === 'Developer Non PKS' || colForm?.status === 'Lama'}
                                onChange={() => handleStatusChange('Developer Non PKS')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="cb_old" className="cursor-pointer">Developer Non PKS</label>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="RB_PERORANGAN"
                                name="old_status"
                                checked={colForm?.status === 'Perorangan'}
                                onChange={() => handleStatusChange('Perorangan')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="RB_PERORANGAN" className="cursor-pointer">Perorangan</label>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Status Indent */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_status_indent">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Status Indent :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_status_indent"
                            name="ddl_status_indent"
                            value={getStatusIndentValue()}
                            onChange={(e) => onChange('statusIndent', e.target.value)}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            {STATUS_INDENT_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Area */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_area_id">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">Area :</td>
                        <td className="p-1">
                          <select
                            id="ddl_area_id"
                            name="ddl_area_id"
                            value={getAreaValue()}
                            onChange={(e) => onChange('area', e.target.value)}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            <option value="">- SELECT -</option>
                            {MASTER_AREA_CUBES.map((a) => (
                              <option key={a.value} value={a.value}>
                                {a.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Developer & Proyek Conditional Blocks */}
                      {colForm?.status?.startsWith('Developer PKS') || colForm?.status === 'Baru' || !colForm?.status ? (
                        <>
                          <tr className="border-b border-[#e5f2f2]" id="tr_dev_code">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              &nbsp;<span id="lbl_devcon">Developer</span> :
                            </td>
                            <td className="p-1">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  id="TXT_DEV_CODE"
                                  name="TXT_DEV_CODE"
                                  readOnly
                                  value={colForm?.developerCode || ''}
                                  placeholder="Kode"
                                  className={`w-14 font-mono text-center ${mandatoryInputClass}`}
                                />
                                <input
                                  type="text"
                                  id="TXT_DEV_DESC"
                                  name="TXT_DEV_DESC"
                                  readOnly
                                  value={colForm?.developer || ''}
                                  placeholder="Nama Developer"
                                  className={`w-52 ${optionalInputClass} bg-gray-50`}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-[#e5f2f2]" id="tr_proyek_id">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              Proyek :
                            </td>
                            <td className="p-1">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  id="TXT_PROYEKID"
                                  name="TXT_PROYEKID"
                                  readOnly
                                  value={colForm?.proyekId || ''}
                                  placeholder="Kode"
                                  className={`w-14 font-mono text-center ${mandatoryInputClass}`}
                                />
                                <input
                                  type="text"
                                  id="TXT_PROYEKDESC"
                                  name="TXT_PROYEKDESC"
                                  readOnly
                                  value={colForm?.proyek || ''}
                                  placeholder="Nama Proyek"
                                  className={`w-44 ${optionalInputClass} bg-gray-50`}
                                />
                                <button
                                  type="button"
                                  id="BTN_PROYEK"
                                  onClick={() => {
                                    setProyekQuery('');
                                    setIsProyekModalOpen(true);
                                  }}
                                  className="h-[24px] px-2.5 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-semibold text-gray-700 cursor-pointer flex items-center gap-1"
                                >
                                  <Search className="w-3 h-3 text-[#C2410C]" /> Cari
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-[#e5f2f2]" id="TR_NAMA_SALESD">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              Nama Sales Developer :
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                id="TXT_NAMA_SALESD"
                                name="TXT_NAMA_SALESD"
                                maxLength={50}
                                value={colForm?.namaSalesDeveloper || ''}
                                onChange={(e) => onChange('namaSalesDeveloper', e.target.value)}
                                className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                              />
                            </td>
                          </tr>
                          <tr className="border-b border-[#e5f2f2]" id="TR_NO_KTP_SALESD">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              No. KTP Sales Developer :
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                id="TXT_NO_KTP_SALESD"
                                name="TXT_NO_KTP_SALESD"
                                maxLength={30}
                                value={colForm?.noKtpSalesDeveloper || ''}
                                onChange={(e) => onChange('noKtpSalesDeveloper', e.target.value.replace(/\D/g, '').slice(0, 30))}
                                className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                              />
                            </td>
                          </tr>
                          <tr className="border-b border-[#e5f2f2]" id="tr_salesdev">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              Sales Developer (Pihak ke-3) :
                            </td>
                            <td className="p-1">
                              <select
                                id="ddlSalesDev"
                                name="ddlSalesDev"
                                value={colForm?.salesDevPihak3 || ''}
                                onChange={(e) => onChange('salesDevPihak3', e.target.value)}
                                className={`w-full max-w-[260px] ${optionalInputClass}`}
                              >
                                <option value="">--SELECT--</option>
                                <option value="PT CIPUTRA PROPERTY">PT CIPUTRA PROPERTY</option>
                                <option value="PT SINARMAS LAND">PT SINARMAS LAND</option>
                                <option value="PT SUMMARECON AGUNG">PT SUMMARECON AGUNG</option>
                              </select>
                            </td>
                          </tr>
                        </>
                      ) : colForm?.status?.startsWith('Developer Non PKS') || colForm?.status === 'Lama' ? (
                        <>
                          <tr className="border-b border-[#e5f2f2]" id="TR_DEVELOPER">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              Developer :
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                id="TXT_DEV_NPKS"
                                name="TXT_DEV_NPKS"
                                maxLength={30}
                                value={colForm?.developer || ''}
                                onChange={(e) => onChange('developer', e.target.value)}
                                placeholder="Nama Developer"
                                className={`w-full max-w-[240px] ${mandatoryInputClass}`}
                              />
                            </td>
                          </tr>
                          <tr className="border-b border-[#e5f2f2]" id="TR_PROYEK">
                            <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                              Proyek :
                            </td>
                            <td className="p-1">
                              <input
                                type="text"
                                id="TXT_PRJ_NPKS"
                                name="TXT_PRJ_NPKS"
                                maxLength={30}
                                value={colForm?.proyek || ''}
                                onChange={(e) => onChange('proyek', e.target.value)}
                                placeholder="Nama Proyek"
                                className={`w-full max-w-[240px] ${mandatoryInputClass}`}
                              />
                            </td>
                          </tr>
                        </>
                      ) : (
                        <tr className="border-b border-[#e5f2f2]" id="tr_umum">
                          <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">Umum :</td>
                          <td className="p-1">
                            <input
                              type="text"
                              id="TXT_UMUM"
                              name="TXT_UMUM"
                              maxLength={30}
                              value={colForm?.umum || ''}
                              onChange={(e) => onChange('umum', e.target.value)}
                              className={`w-full max-w-[240px] ${optionalInputClass}`}
                            />
                          </td>
                        </tr>
                      )}

                      {/* Tipe Properti */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_prop_type">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Tipe Properti :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_prop_type"
                            name="ddl_prop_type"
                            value={getTipePropertiValue()}
                            onChange={(e) => onChange('tipeProperti', e.target.value)}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          >
                            {TIPE_PROPERTI_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      {/* Status Agen Properti */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_kerjasama">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Status Agen Properti :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-3 text-xs">
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="RB_Properti1"
                                name="properti"
                                checked={colForm?.statusAgenProperti === 'PKS' || !colForm?.statusAgenProperti}
                                onChange={() => onChange('statusAgenProperti', 'PKS')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="RB_Properti1" className="cursor-pointer">PKS</label>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="RB_PROPERTI2"
                                name="properti"
                                checked={colForm?.statusAgenProperti === 'Non PKS'}
                                onChange={() => onChange('statusAgenProperti', 'Non PKS')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="RB_PROPERTI2" className="cursor-pointer">Non PKS</label>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer font-normal text-gray-800">
                              <input
                                type="radio"
                                id="Rb_Properti3"
                                name="properti"
                                checked={colForm?.statusAgenProperti === 'Perorangan'}
                                onChange={() => onChange('statusAgenProperti', 'Perorangan')}
                                className="accent-[#C2410C]"
                              />
                              <label htmlFor="Rb_Properti3" className="cursor-pointer">Perorangan</label>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Agen Properti Dropdown */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_agen">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Agen Properti :
                        </td>
                        <td className="p-1">
                          {colForm?.statusAgenProperti === 'PKS' || !colForm?.statusAgenProperti ? (
                            <>
                              <select
                                id="DDL_AGEN_PROPERTI"
                                name="DDL_AGEN_PROPERTI"
                                value={colForm?.agenProperti || ''}
                                onChange={(e) => onChange('agenProperti', e.target.value)}
                                className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                              >
                                <option value="">- SELECT -</option>
                                <option value="ERA INDONESIA">ERA INDONESIA</option>
                                <option value="RAY WHITE">RAY WHITE</option>
                                <option value="CENTURY 21">CENTURY 21</option>
                                <option value="LJ HOOKER">LJ HOOKER</option>
                                <option value="PROMEX">PROMEX</option>
                                <option value="GADING PRO">GADING PRO</option>
                                <option value="HARCOURTS">HARCOURTS</option>
                                <option value="INDEPENDENT AGENT">INDEPENDENT AGENT</option>
                              </select>
                              <div id="LBL_KET" className="text-[10px] text-gray-500 italic mt-0.5">
                                (Pilih area terlebih dahulu)
                              </div>
                            </>
                          ) : (
                            <input
                              type="text"
                              value={colForm?.agenProperti || ''}
                              onChange={(e) => onChange('agenProperti', e.target.value)}
                              placeholder="Nama Agen Properti"
                              className={`w-full max-w-[260px] ${optionalInputClass}`}
                            />
                          )}
                        </td>
                      </tr>

                      {/* Nama Sales Agen Properti */}
                      <tr className="border-b border-[#e5f2f2]" id="Tr_Nama_AgenP">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Nama Sales Agen Properti :
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="TXT_NAMA_AGENP"
                            name="TXT_NAMA_AGENP"
                            maxLength={50}
                            value={colForm?.namaSalesAgen || ''}
                            onChange={(e) => onChange('namaSalesAgen', e.target.value)}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* No. KTP Sales Agen Properti */}
                      <tr className="border-b border-[#e5f2f2]" id="Tr_No_KTP_AgenP">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          No. KTP Sales Agen Properti :
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="TXT_NO_KTP_AGENP"
                            name="TXT_NO_KTP_AGENP"
                            maxLength={30}
                            value={colForm?.noKtpSalesAgen || ''}
                            onChange={(e) => onChange('noKtpSalesAgen', e.target.value.replace(/\D/g, '').slice(0, 30))}
                            className={`w-full max-w-[260px] ${mandatoryInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* Sales Agen Properti (Pihak ke-3) */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_salesag">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Sales Agen Properti (Pihak ke-3) :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddlSalesAg"
                            name="ddlSalesAg"
                            value={colForm?.salesAgenPihak3 || ''}
                            onChange={(e) => onChange('salesAgenPihak3', e.target.value)}
                            className={`w-full max-w-[260px] ${optionalInputClass}`}
                          >
                            <option value="">--SELECT--</option>
                            <option value="ERA INDONESIA">ERA INDONESIA</option>
                            <option value="RAY WHITE">RAY WHITE</option>
                            <option value="CENTURY 21">CENTURY 21</option>
                          </select>
                          <span id="Label1" className="text-[10px] text-gray-500 italic ml-2">
                            (Pilih area terlebih dahulu)
                          </span>
                        </td>
                      </tr>

                      {/* Alamat Agunan (3 baris) + Checkbox Sama dengan Alamat KTP */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_pk_address1">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap align-top pt-1.5">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-gray-800">
                            <input
                              type="checkbox"
                              id="cb_sameaddr"
                              name="cb_sameaddr"
                              checked={isAddressLocked}
                              onChange={(e) => handleToggleSameAddress(e.target.checked)}
                              className="accent-[#C2410C]"
                            />
                            <span className="font-semibold text-gray-800">Alamat :</span>
                          </label>
                        </td>
                        <td className="p-1 space-y-1">
                          <input
                            type="text"
                            id="txt_pk_address1"
                            name="txt_pk_address1"
                            maxLength={30}
                            disabled={isAddressLocked}
                            value={colForm?.alamat1 || ''}
                            onChange={(e) => onChange('alamat1', e.target.value)}
                            placeholder="Alamat 1 (Wajib diisi)"
                            className={`w-full max-w-[260px] ${isAddressLocked ? readOnlyInputClass : mandatoryInputClass}`}
                          />
                          <input
                            type="text"
                            id="txt_pk_address2"
                            name="txt_pk_address2"
                            maxLength={30}
                            disabled={isAddressLocked}
                            value={colForm?.alamat2 || ''}
                            onChange={(e) => onChange('alamat2', e.target.value)}
                            placeholder="Alamat 2 (Kelurahan)"
                            className={`w-full max-w-[260px] ${isAddressLocked ? readOnlyInputClass : optionalInputClass}`}
                          />
                          <input
                            type="text"
                            id="txt_pk_address3"
                            name="txt_pk_address3"
                            maxLength={30}
                            disabled={isAddressLocked}
                            value={colForm?.alamat3 || ''}
                            onChange={(e) => onChange('alamat3', e.target.value)}
                            placeholder="Alamat 3 (Kecamatan)"
                            className={`w-full max-w-[260px] ${isAddressLocked ? readOnlyInputClass : optionalInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* RT / RW strictly numbers */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_pk_rtrw">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          RT / RW :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="txt_col_rt"
                              name="txt_col_rt"
                              maxLength={5}
                              disabled={isAddressLocked}
                              value={colForm?.rt || ''}
                              onChange={(e) => onChange('rt', e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="000"
                              className={`w-14 text-center ${isAddressLocked ? readOnlyInputClass : optionalInputClass}`}
                            />
                            <span className="font-bold text-gray-500">/</span>
                            <input
                              type="text"
                              id="txt_col_rw"
                              name="txt_col_rw"
                              maxLength={5}
                              disabled={isAddressLocked}
                              value={colForm?.rw || ''}
                              onChange={(e) => onChange('rw', e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="000"
                              className={`w-14 text-center ${isAddressLocked ? readOnlyInputClass : optionalInputClass}`}
                            />
                          </div>
                        </td>
                      </tr>

                      {/* Kodepos + Pencarian Cepat */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_pk_zipcode">
                        <td className="w-48 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Kodepos :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="txt_col_zip"
                              name="txt_col_zip"
                              maxLength={5}
                              disabled={isAddressLocked}
                              value={colForm?.kodepos || ''}
                              onChange={(e) => onChange('kodepos', e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="Kodepos"
                              className={`w-20 text-center ${isAddressLocked ? readOnlyInputClass : optionalInputClass}`}
                            />
                            <button
                              type="button"
                              id="btn_searchhmzip"
                              disabled={isAddressLocked}
                              onClick={() => {
                                setZipQuery(colForm?.kodepos || '');
                                setIsZipModalOpen(true);
                              }}
                              className="h-[24px] px-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-slate-300 rounded text-[11px] font-semibold text-gray-700 cursor-pointer flex items-center gap-1"
                            >
                              <Search className="w-3 h-3 text-[#C2410C]" /> Cari
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kolom Kanan: Fisik Bangunan, Legalitas Sertifikat & Nilai Pembiayaan */}
              <div className="pl-0 md:pl-2 pt-2 md:pt-0">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-[11px]">
                    <tbody>
                      {/* Lokasi Agunan */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_lokasi_agunan">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Lokasi Agunan :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="TXT_LOKASI"
                              name="TXT_LOKASI"
                              value={colForm?.lokasiAgunanKode || ''}
                              onChange={(e) => onChange('lokasiAgunanKode', e.target.value)}
                              placeholder="Kode"
                              className={`w-14 ${mandatoryInputClass}`}
                            />
                            <input
                              type="text"
                              id="TXT_LOKASI_DESC"
                              name="TXT_LOKASI_DESC"
                              readOnly
                              value={colForm?.lokasiAgunanDesc || ''}
                              placeholder="Deskripsi Lokasi"
                              className={`w-48 ${mandatoryInputClass}`}
                            />
                            <button
                              type="button"
                              id="btnLokasi"
                              onClick={() => {
                                setLokasiQuery(colForm?.lokasiAgunanDesc || '');
                                setIsLokasiModalOpen(true);
                              }}
                              className="h-[24px] px-2.5 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-semibold text-gray-700 cursor-pointer flex items-center gap-1"
                            >
                              <Search className="w-3 h-3 text-[#C2410C]" /> Cari
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Luas Bangunan */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_buildingarea">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Luas Bangunan :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="txt_buildingarea"
                              name="txt_buildingarea"
                              maxLength={7}
                              value={colForm?.luasBangunan || ''}
                              onChange={(e) => onChange('luasBangunan', e.target.value.replace(/[^0-9.]/g, ''))}
                              placeholder="0"
                              disabled={colForm?.tipeJaminan === 'Tanah' || colForm?.tipeJaminan === 'H01'}
                              className={`w-24 text-right ${colForm?.tipeJaminan === 'Tanah' || colForm?.tipeJaminan === 'H01' ? readOnlyInputClass : mandatoryInputClass}`}
                            />
                            <span className="font-semibold text-gray-600">m²</span>
                          </div>
                        </td>
                      </tr>

                      {/* Luas Area / Tanah */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_landarea">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Luas Area :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="txt_landarea"
                              name="txt_landarea"
                              maxLength={7}
                              value={colForm?.luasArea || ''}
                              onChange={(e) => onChange('luasArea', e.target.value.replace(/[^0-9.]/g, ''))}
                              placeholder="0"
                              disabled={colForm?.tipeJaminan === 'Bangunan' || colForm?.tipeJaminan === 'H02'}
                              className={`w-24 text-right ${colForm?.tipeJaminan === 'Bangunan' || colForm?.tipeJaminan === 'H02' ? readOnlyInputClass : mandatoryInputClass}`}
                            />
                            <span className="font-semibold text-gray-600">m²</span>
                          </div>
                        </td>
                      </tr>

                      {/* Perkiraan Harga */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_nominal_value">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          <span id="lbl_nominal_value">Perkiraan Harga :</span>
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="txt_nominal_value"
                              name="txt_nominal_value"
                              maxLength={15}
                              value={formatRupiah(colForm?.perkiraanHarga)}
                              onChange={(e) => {
                                const clean = e.target.value.replace(/\D/g, '');
                                onChange('perkiraanHarga', clean);
                                onChange('nilaiPembiayaan', clean); // Sync for compatibility
                              }}
                              placeholder="0"
                              className={`w-full max-w-[220px] text-right font-mono ${mandatoryInputClass}`}
                            />
                          </div>
                        </td>
                      </tr>

                      {/* Tipe Sertifikat with Lookup */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_certificate_type">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Tipe Sertifikat :
                        </td>
                        <td className="p-1">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              id="TXT_SERT_CODE"
                              name="TXT_SERT_CODE"
                              readOnly
                              value={colForm?.tipeSertifikatKode || ''}
                              placeholder="Kode"
                              className={`w-14 ${mandatoryInputClass}`}
                            />
                            <input
                              type="text"
                              id="TXT_SERT_DESC"
                              name="TXT_SERT_DESC"
                              readOnly
                              value={colForm?.tipeSertifikatDesc || ''}
                              placeholder="Jenis Sertifikat"
                              className={`w-44 ${mandatoryInputClass}`}
                            />
                            <button
                              type="button"
                              id="BTN_SERT"
                              onClick={() => {
                                setSertifikatQuery(colForm?.tipeSertifikatDesc || '');
                                setIsSertifikatModalOpen(true);
                              }}
                              className="h-[24px] px-2.5 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-semibold text-gray-700 cursor-pointer flex items-center gap-1"
                            >
                              <Search className="w-3 h-3 text-[#C2410C]" /> Cari
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* No. Sertifikat */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_certificate_sta">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          No. Sertifikat :
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="txt_certificate_sta"
                            name="txt_certificate_sta"
                            maxLength={20}
                            value={colForm?.noSertifikat || ''}
                            onChange={(e) => onChange('noSertifikat', e.target.value)}
                            placeholder="Nomor Sertifikat Agunan"
                            className={`w-full max-w-[220px] ${optionalInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* Nomor/Unit */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_nomor_unit">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Nomor/Unit :
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="txt_nomor_unit"
                            name="txt_nomor_unit"
                            maxLength={10}
                            value={colForm?.nomorUnit || ''}
                            onChange={(e) => onChange('nomorUnit', e.target.value)}
                            placeholder="Nomor Unit"
                            className={`w-full max-w-[220px] ${mandatoryInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* Tower */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_tower">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">Tower :</td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="txt_tower"
                            name="txt_tower"
                            maxLength={10}
                            value={colForm?.tower || ''}
                            onChange={(e) => onChange('tower', e.target.value)}
                            placeholder="Tower (opsional)"
                            className={`w-full max-w-[220px] ${optionalInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* Lantai */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_lantai">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">Lantai :</td>
                        <td className="p-1">
                          <input
                            type="text"
                            id="txt_lantai"
                            name="txt_lantai"
                            maxLength={10}
                            value={colForm?.lantai || ''}
                            onChange={(e) => onChange('lantai', e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Lantai"
                            className={`w-full max-w-[220px] ${optionalInputClass}`}
                          />
                        </td>
                      </tr>

                      {/* Market Segment */}
                      <tr className="border-b border-[#e5f2f2]" id="tr_market_segment">
                        <td className="w-44 text-right pr-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                          Market Segment :
                        </td>
                        <td className="p-1">
                          <select
                            id="ddl_market_segment"
                            name="ddl_market_segment"
                            disabled
                            value={colForm?.marketSegment === 'Secondary Market' ? '2' : '1'}
                            onChange={(e) => onChange('marketSegment', e.target.value === '2' ? 'Secondary Market' : 'Primary Market')}
                            className={`w-full max-w-[220px] ${readOnlyInputClass} opacity-80`}
                          >
                            <option value="">--SELECT--</option>
                            <option value="1">Primary Market</option>
                            <option value="2">Secondary Market</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Tambah / Ubah Agunan */}
        <div className="bg-[#f0f4f4] py-2 px-4 text-center border-t border-[#cce8e8] flex items-center justify-center gap-3">
          {editingIndex !== null ? (
            <>
              <button
                type="button"
                onClick={handleActionUpdateAgunan}
                className="px-6 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow cursor-pointer transition-all"
              >
                Ubah
              </button>
              {onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs border border-slate-300 rounded-xs cursor-pointer transition-all"
                >
                  Batal
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleActionTambahAgunan}
              className="px-6 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow cursor-pointer transition-all"
            >
              Tambah
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          ORANGE DATAGRID: DAFTAR AGUNAN / OBYEK PEMBIAYAAN
          (Sesuai DataGrid2 di Collateral.aspx & media_1789443826705.png)
      ========================================================================= */}
      <div className="border border-[#C2410C] overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#9A3412] text-white font-bold text-center">
                <th className="py-1.5 px-3 border-r border-orange-500/50 text-left font-semibold">Tipe</th>
                <th className="py-1.5 px-3 border-r border-orange-500/50 text-center font-semibold">Kisaran Harga</th>
                <th className="py-1.5 px-3 border-r border-orange-500/50 text-center font-semibold">Jenis Properti</th>
                <th className="py-1.5 px-3 text-center font-semibold">Function</th>
              </tr>
            </thead>
            <tbody>
              {collaterals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-2.5 px-3 text-center text-gray-500 font-mono">
                    &lt; &gt;
                  </td>
                </tr>
              ) : (
                collaterals.map((col, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-[#fef8f5]' : 'bg-white'}>
                    <td className="py-1.5 px-3 border-t border-gray-200 font-medium text-gray-800">
                      {col.tipe || col.tipeJaminan || 'Tanah Dan Bangunan'}
                    </td>
                    <td className="py-1.5 px-3 border-t border-gray-200 text-center font-mono">
                      {col.kisaranHarga
                        ? `Rp ${formatRupiah(col.kisaranHarga)}`
                        : col.perkiraanHarga
                        ? `Rp ${formatRupiah(col.perkiraanHarga)}`
                        : '-'}
                    </td>
                    <td className="py-1.5 px-3 border-t border-gray-200 text-center text-gray-700">
                      {col.jenisProperti || col.tipeProperti || 'RUMAH TINGGAL'}
                    </td>
                    <td className="py-1.5 px-3 border-t border-gray-200 text-center space-x-3">
                      <button
                        type="button"
                        onClick={() => onEditCollateral && onEditCollateral(idx)}
                        className="text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteCollateral && onDeleteCollateral(idx)}
                        className="text-blue-700 hover:text-blue-900 underline font-medium cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          TOMBOL LANJUT: Centered Black Button (CuBES btn_CONTINUE)
      ========================================================================= */}
      <div className="flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={handleActionLanjut}
          disabled={isSubmitting}
          className="px-8 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Lanjut'}
        </button>
      </div>

      {/* =========================================================================
          MODAL 1: LOOKUP LOKASI AGUNAN (514 Kota & Kabupaten se-Indonesia)
      ========================================================================= */}
      {isLokasiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  Lookup Lokasi Agunan (514 Kota & Kab. se-Indonesia)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLokasiModalOpen(false)}
                className="p-1 rounded hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={lokasiQuery}
                  onChange={(e) => setLokasiQuery(e.target.value)}
                  placeholder="Ketik nama kota, kabupaten, provinsi, atau kode lokasi BI..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-700 focus:border-[#C2410C]"
                  autoFocus
                />
              </div>
              <div className="mt-1.5 text-[10px] text-slate-500 flex justify-between">
                <span>Ditemukan: {filteredLokasi.length} wilayah</span>
                <span>Mencakup seluruh 38 Provinsi di Indonesia</span>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-4 pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold sticky top-0 bg-white">
                    <th className="py-2 px-2.5">Kode BI</th>
                    <th className="py-2 px-2.5">Lokasi Wilayah</th>
                    <th className="py-2 px-2.5">Provinsi</th>
                    <th className="py-2 px-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLokasi.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400 italic">
                        Lokasi tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredLokasi.slice(0, 50).map((l, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/60 transition">
                        <td className="py-2 px-2.5 font-mono font-bold text-orange-900">{l.code}</td>
                        <td className="py-2 px-2.5 font-medium text-slate-800">{l.desc}</td>
                        <td className="py-2 px-2.5 text-slate-500 text-[11px]">{l.prov}</td>
                        <td className="py-2 px-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onChange('lokasiAgunanKode', l.code);
                              onChange('lokasiAgunanDesc', l.desc);
                              setIsLokasiModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded text-[11px] font-semibold shadow-xs transition"
                          >
                            <Check className="w-3 h-3" /> Pilih
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {filteredLokasi.length > 50 && (
                <div className="py-2 text-center text-[10px] text-gray-500 italic bg-slate-50 rounded mt-2">
                  Menampilkan 50 data teratas. Ketik kata kunci lebih spesifik untuk mempersempit hasil.
                </div>
              )}
            </div>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLokasiModalOpen(false)}
                className="px-4 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: LOOKUP TIPE SERTIFIKAT (CuBES CariSert - rfsertype)
      ========================================================================= */}
      {isSertifikatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white" />
                <h3 className="font-bold text-xs uppercase tracking-wide">Lookup Jenis Sertifikat Agunan</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSertifikatModalOpen(false)}
                className="p-1 rounded hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={sertifikatQuery}
                  onChange={(e) => setSertifikatQuery(e.target.value)}
                  placeholder="Cari jenis sertifikat (SHM, SHGB, Strata Title, dll)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-700 focus:border-[#C2410C]"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto p-4 pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2 px-2.5">Kode</th>
                    <th className="py-2 px-2.5">Jenis Sertifikat</th>
                    <th className="py-2 px-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSertifikat.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-gray-400 italic">
                        Jenis sertifikat tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredSertifikat.map((s, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/60 transition">
                        <td className="py-2 px-2.5 font-mono font-bold text-orange-900">{s.code}</td>
                        <td className="py-2 px-2.5 font-medium text-slate-800">{s.desc}</td>
                        <td className="py-2 px-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onChange('tipeSertifikatKode', s.code);
                              onChange('tipeSertifikatDesc', s.desc);
                              setIsSertifikatModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded text-[11px] font-semibold shadow-xs transition"
                          >
                            <Check className="w-3 h-3" /> Pilih
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSertifikatModalOpen(false)}
                className="px-4 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: LOOKUP PROYEK DEVELOPER (CuBES CariProyek - SearchProyekDev.aspx)
      ========================================================================= */}
      {isProyekModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-[#C2410C] via-[#B43B0A] to-[#9A3412] text-white">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-white" />
                <h3 className="font-bold text-xs uppercase tracking-wide">Lookup Proyek Developer Rekanan PKS</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProyekModalOpen(false)}
                className="p-1 rounded hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={proyekQuery}
                  onChange={(e) => setProyekQuery(e.target.value)}
                  placeholder="Cari nama proyek, nama developer rekanan, kota, atau nomor PKS..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-700 focus:border-[#C2410C]"
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-500 mr-1">Wilayah:</span>
                {[
                  { id: 'ALL', label: 'Semua (78+ Proyek)' },
                  { id: 'BANTEN', label: 'Banten & Tangerang' },
                  { id: 'JABODETABEK', label: 'DKI Jakarta' },
                  { id: 'JAWA_BARAT', label: 'Jawa Barat' },
                  { id: 'JAWA_TENGAH_TIMUR', label: 'Jateng & Jatim' },
                  { id: 'LUAR_JAWA', label: 'Luar Jawa' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProyekRegionFilter(tab.id as any)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                      proyekRegionFilter === tab.id
                        ? 'bg-[#C2410C] text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto p-4 pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
                    <th className="py-2 px-2.5">ID Proyek</th>
                    <th className="py-2 px-2.5">Nama Proyek</th>
                    <th className="py-2 px-2.5">Developer Rekanan</th>
                    <th className="py-2 px-2.5">Area / Kota</th>
                    <th className="py-2 px-2.5">No. PKS BNI</th>
                    <th className="py-2 px-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProyek.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400 italic">
                        Proyek developer tidak ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredProyek.map((p, idx) => (
                      <tr key={idx} className="hover:bg-orange-50/60 transition">
                        <td className="py-2 px-2.5 font-mono font-bold text-orange-900">{p.id}</td>
                        <td className="py-2 px-2.5 font-medium text-slate-800">{p.proyek}</td>
                        <td className="py-2 px-2.5 text-slate-600 text-[11px] font-semibold">{p.developer}</td>
                        <td className="py-2 px-2.5 text-slate-500 text-[11px]">{p.area}</td>
                        <td className="py-2 px-2.5 font-mono text-slate-500 text-[10px]">{p.pksNumber || '-'}</td>
                        <td className="py-2 px-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onChange('proyek', p.proyek);
                              onChange('developer', p.developer);
                              if (p.devCode) onChange('developerCode', p.devCode);
                              if (p.pksNumber) onChange('noPksDeveloper', p.pksNumber);
                              if (p.area) onChange('area', p.area);
                              setIsProyekModalOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#C2410C] hover:bg-[#9A3412] text-white rounded text-[11px] font-semibold shadow-xs transition cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Pilih
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsProyekModalOpen(false)}
                className="px-4 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: LOOKUP KODE POS & WILAYAH SELURUH INDONESIA (7.285 KECAMATAN)
      ========================================================================= */}
      <SearchZipcodeModal
        isOpen={isZipModalOpen}
        onClose={() => setIsZipModalOpen(false)}
        title="Lookup Wilayah & Kode Pos Agunan"
        initialQuery={colForm?.kodepos || ''}
        onSelect={(z) => {
          onChange('kodepos', z.zipcode);
          onChange('kota', (z.kota || '').toUpperCase());
          if (!colForm?.alamat2 && z.kelurahan) onChange('alamat2', `Kel. ${z.kelurahan}`);
          if (!colForm?.alamat3 && z.kecamatan) onChange('alamat3', `Kec. ${z.kecamatan}`);
          if (z.kota) {
            onChange('lokasiAgunanDesc', z.kota);
          }
        }}
      />
    </div>
  );
};
