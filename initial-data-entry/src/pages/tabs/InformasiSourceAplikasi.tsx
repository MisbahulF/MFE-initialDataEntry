import { Package, FileText, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { SearchableSelect } from '../../components/SearchableSelect';
import { useAuth } from '@template/shared';

export interface InformasiSourceAplikasiProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onSaveDraft?: () => void;
  onLanjut?: (e?: React.FormEvent) => void;
  isSubmitting?: boolean;
}


const DEFAULT_GROUPS = [
  { grouP_ID: '1', grouP_NAME: 'BNI GRIYA' },
  { grouP_ID: '2', grouP_NAME: 'BNI FLEKSI' },
  { grouP_ID: '3', grouP_NAME: 'BNI GRIYA MULTIGUNA' }
];

const DEFAULT_GRIYA_FACILITIES = [
  { productid: 'GRY_TOPUP', productname: 'BNI GRIYA TOP UP' },
  { productid: 'GRY_BANGUN_RUMAH', productname: 'GRIYA IDAMAN PEMBANGUNAN RUMAH TINGGAL' },
  { productid: 'GRY_BELI_RUMAH', productname: 'GRIYA IDAMAN PEMBELIAN RUMAH TINGGAL' },
  { productid: 'GRY_BELI_RUSUN', productname: 'GRIYA IDAMAN PEMBELIAN RUSUN' },
  { productid: 'GRY_REFINANCE_RUMAH', productname: 'GRIYA IDAMAN REFINANCING RUMAH TINGGAL' },
  { productid: 'GRY_REFINANCE_RUSUN', productname: 'GRIYA IDAMAN REFINANCING RUSUN' },
  { productid: 'GRY_RENOV_RUMAH', productname: 'GRIYA IDAMAN RENOVASI RUMAH TINGGAL' },
  { productid: 'GRY_TAKEOVER_RUMAH', productname: 'GRIYA IDAMAN TAKEOVER RUMAH TINGGAL' },
  { productid: 'GRY_TAKEOVER_RUSUN', productname: 'GRIYA IDAMAN TAKEOVER RUSUN' },
  { productid: 'GRY_IMPIAN_BANGUN_VILLA', productname: 'GRIYA IMPIAN PEMBANGUNAN VILLA' },
  { productid: 'GRY_IMPIAN_BELI_APT', productname: 'GRIYA IMPIAN PEMBELIAN APARTEMEN' },
  { productid: 'GRY_IMPIAN_BELI_KONDO', productname: 'GRIYA IMPIAN PEMBELIAN KONDOMINIUM' },
  { productid: 'GRY_IMPIAN_BELI_VILLA', productname: 'GRIYA IMPIAN PEMBELIAN VILLA' },
  { productid: 'GRY_IMPIAN_REFINANCE_APT', productname: 'GRIYA IMPIAN REFINANCING APARTEMEN' },
  { productid: 'GRY_IMPIAN_REFINANCE_KONDO', productname: 'GRIYA IMPIAN REFINANCING KONDOMINIUM' },
  { productid: 'GRY_IMPIAN_REFINANCE_VILLA', productname: 'GRIYA IMPIAN REFINANCING VILLA' },
  { productid: 'GRY_IMPIAN_RENOV_APT', productname: 'GRIYA IMPIAN RENOVASI APARTEMEN' },
  { productid: 'GRY_IMPIAN_RENOV_KONDO', productname: 'GRIYA IMPIAN RENOVASI KONDOMINIUM' },
  { productid: 'GRY_IMPIAN_RENOV_VILLA', productname: 'GRIYA IMPIAN RENOVASI VILLA' },
  { productid: 'GRY_IMPIAN_TAKEOVER_APT', productname: 'GRIYA IMPIAN TAKEOVER APARTEMEN' },
  { productid: 'GRY_IMPIAN_TAKEOVER_KONDO', productname: 'GRIYA IMPIAN TAKEOVER KONDOMINIUM' },
  { productid: 'GRY_IMPIAN_TAKEOVER_VILLA', productname: 'GRIYA IMPIAN TAKEOVER VILLA' },
  { productid: 'GRY_BAPERTARUM', productname: 'GRIYA PEMBANGUNAN BAPERTARUM' }
];

export const InformasiSourceAplikasi: React.FC<InformasiSourceAplikasiProps> = ({
  formData,
  onChange,
  onLanjut,
  isSubmitting = false,
}) => {
  const { user } = useAuth();
  const userRegionalSales = user?.branch ? (user.branch.includes('STA') ? user.branch : `${user.branch} STA`) : 'SERANG STA';
  const userSalesName = user?.name && user?.userId 
    ? `${user.name} - ${user.userId}` 
    : (user?.name ? `${user.name} - SC70629` : 'SURYA HARJAYA - SC70629');

  useEffect(() => {
    if (!formData?.regionalSales) {
      onChange('regionalSales', userRegionalSales);
    }
    if (!formData?.namaSales) {
      onChange('namaSales', userSalesName);
    }
  }, [userRegionalSales, userSalesName]);

  
  const [groupFasilitasList, setGroupFasilitasList] = useState<any[]>(DEFAULT_GROUPS);
  const [fasilitasList, setFasilitasList] = useState<any[]>([]);
  const [programList, setProgramList] = useState<any[]>([
    { pR_CODE: 'REG', pR_DESC: 'REGULER' },
    { pR_CODE: 'HUT', pR_DESC: 'PROMO HUT BNI' },
    { pR_CODE: 'MIL', pR_DESC: 'BNI GRIYA MILENIAL / GUWE' },
    { pR_CODE: 'ASN', pR_DESC: 'PROGRAM KHUSUS ASN & BUMN' },
    { pR_CODE: 'PKS', pR_DESC: 'PROGRAM PKS DEVELOPER REKANAN' }
  ]);
  const [tujuanList, setTujuanList] = useState<any[]>([
    { id: '1', tujuaN_NAME: 'PEMBELIAN RUMAH TINGGAL / PROPERTI' },
    { id: '2', tujuaN_NAME: 'PEMBANGUNAN RUMAH TINGGAL' },
    { id: '3', tujuaN_NAME: 'RENOVASI PROPERTI' },
    { id: '4', tujuaN_NAME: 'REFINANCING PROPERTI' },
    { id: '5', tujuaN_NAME: 'TAKE OVER DARI BANK LAIN' },
    { id: '6', tujuaN_NAME: 'TOP UP PLAFON KREDIT' }
  ]);
  const [channelList, setChannelList] = useState<any[]>([
    { cH_CODE: '01', cH_DESC: 'Branch' },
    { cH_CODE: '02', cH_DESC: 'Developer' },
    { cH_CODE: '03', cH_DESC: 'Dealers' },
    { cH_CODE: '04', cH_DESC: 'Institusi' },
    { cH_CODE: '05', cH_DESC: 'BNI FLEKSI - Khusus WJS DIKNAS' },
    { cH_CODE: '06', cH_DESC: 'Instant Approval' },
    { cH_CODE: '07', cH_DESC: 'BAPERTARUM PNS - BUM GOL I' },
    { cH_CODE: '08', cH_DESC: 'BAPERTARUM PNS - BUM GOL II' },
    { cH_CODE: '09', cH_DESC: 'BAPERTARUM PNS - BUM GOL III' },
    { cH_CODE: '10', cH_DESC: 'Mail drop' },
    { cH_CODE: '11', cH_DESC: 'BAPERTARUM PNS - BTP PNS' },
    { cH_CODE: '12', cH_DESC: 'YKPP - BUM' },
    { cH_CODE: '13', cH_DESC: 'YKPP - PUM' },
    { cH_CODE: '14', cH_DESC: 'BPJS - JHT' },
    { cH_CODE: '15', cH_DESC: 'Eform' },
    { cH_CODE: '16', cH_DESC: 'Referral' },
    { cH_CODE: '17', cH_DESC: 'Mobile Banking' },
    { cH_CODE: '18', cH_DESC: 'Ringkas' },
    { cH_CODE: '19', cH_DESC: 'Member get member' },
    { cH_CODE: '20', cH_DESC: 'Others' },
    { cH_CODE: '21', cH_DESC: 'Pre-approved' },
    { cH_CODE: '22', cH_DESC: 'Printed Ad' },
    { cH_CODE: '23', cH_DESC: 'Take one' },
    { cH_CODE: '24', cH_DESC: 'Walk in' },
    { cH_CODE: '25', cH_DESC: 'Penjualan Sendiri' }
  ]);
  const [mediaList, setMediaList] = useState<any[]>([
    { mediaid: 'DS', medianame: 'DIRECT SALES' },
    { mediaid: 'TELE', medianame: 'TELEMARKETING' },
    { mediaid: 'ONLINE', medianame: 'WEBSITE / BNI MOBILE' },
    { mediaid: 'EXPO', medianame: 'EVENT / PROPERTY EXPO' },
    { mediaid: 'REF', medianame: 'REFERRAL NASABAH' }
  ]);
  const [tipeNasabahList, setTipeNasabahList] = useState<any[]>([
    { rN_CODE: 1, rN_DESC: 'NASABAH BARU' },
    { rN_CODE: 2, rN_DESC: 'NASABAH EKSISTING' },
    { rN_CODE: 3, rN_DESC: 'PAYROLL BNI' },
    { rN_CODE: 4, rN_DESC: 'NON PAYROLL' }
  ]);
  const [appraisalList, setAppraisalList] = useState<any[]>([]);
  const [asuransiList, setAsuransiList] = useState<any[]>([]);
  const [notarisList, setNotarisList] = useState<any[]>([]);
  const [investigationList, setInvestigationList] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch Group Fasilitas
    fetch('http://localhost:5139/api/Parameter/Dropdown_Group_Fasilitas')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setGroupFasilitasList(json.data);
        }
      })
      .catch(() => {});

    // 2. Fetch Channels
    fetch('http://localhost:5139/api/Parameter/Dropdown_Channel')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setChannelList(json.data);
        }
      })
      .catch(() => {});

    // 3. Fetch Media
    fetch('http://localhost:5139/api/Parameter/Dropdown_Media')
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setMediaList(json.data);
        }
      })
      .catch(() => {});

    // 4. Fetch Pihak Ketiga
    fetch('http://localhost:5139/api/Parameter/Dropdown_Appraisal')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setAppraisalList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Asuransi')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setAsuransiList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Notaris')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setNotarisList(json.data); })
      .catch(() => {});

    fetch('http://localhost:5139/api/Parameter/Dropdown_Investigation')
      .then(res => res.json())
      .then(json => { if (json?.isSuccess && Array.isArray(json.data)) setInvestigationList(json.data); })
      .catch(() => {});
  }, []);

  const loadProgramsByProduct = (facilityName: string) => {
    fetch('http://localhost:5139/api/Parameter/Kode_Program?productId=' + encodeURIComponent(facilityName))
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setProgramList(json.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (formData?.fasilitas) {
      loadProgramsByProduct(formData.fasilitas);
    }
  }, [formData?.fasilitas]);

  const loadFasilitasByGroup = (groupNameOrId: string) => {
    fetch('http://localhost:5139/api/Parameter/Dropdown_Fasilitas?groupId=' + encodeURIComponent(groupNameOrId))
      .then(res => res.json())
      .then(json => {
        if (json?.isSuccess && Array.isArray(json.data) && json.data.length > 0) {
          setFasilitasList(json.data);
        } else if (groupNameOrId.includes('GRIYA')) {
          setFasilitasList(DEFAULT_GRIYA_FACILITIES);
        }
      })
      .catch(() => {
        if (groupNameOrId.includes('GRIYA')) {
          setFasilitasList(DEFAULT_GRIYA_FACILITIES);
        }
      });
  };

  useEffect(() => {
    if (formData?.groupFasilitas) {
      loadFasilitasByGroup(formData.groupFasilitas);
    }
  }, [formData?.groupFasilitas]);

  const handleGroupFasilitasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange('groupFasilitas', val);
    onChange('fasilitas', '');
    onChange('kodeProgram', '');
    onChange('tujuanPembiayaan', '');
    setProgramList([]);
    if (val && val !== '- SELECT -') {
      loadFasilitasByGroup(val);
    } else {
      setFasilitasList([]);
    }
  };

  const handleFasilitasChange = (val: string) => {
    onChange('fasilitas', val);
    onChange('kodeProgram', '');

    if (!val || val === '- SELECT -') {
      setProgramList([]);
      return;
    }

    loadProgramsByProduct(val);

    if (val.includes('PEMBELIAN')) {
      onChange('tujuanPembiayaan', 'PEMBELIAN RUMAH TINGGAL / PROPERTI');
    } else if (val.includes('PEMBANGUNAN')) {
      onChange('tujuanPembiayaan', 'PEMBANGUNAN RUMAH TINGGAL');
    } else if (val.includes('RENOVASI')) {
      onChange('tujuanPembiayaan', 'RENOVASI PROPERTI');
    } else if (val.includes('REFINANCING')) {
      onChange('tujuanPembiayaan', 'REFINANCING PROPERTI');
    } else if (val.includes('TAKEOVER') || val.includes('TAKE OVER')) {
      onChange('tujuanPembiayaan', 'TAKE OVER DARI BANK LAIN');
    } else if (val.includes('TOP UP')) {
      onChange('tujuanPembiayaan', 'TOP UP PLAFON KREDIT');
    }
  };

  // Handler copy alamat KTP ke tinggal jika checkbox Sama dengan Alamat KTP dicentang
  
  const isGroupSelected = Boolean(formData?.groupFasilitas && formData.groupFasilitas !== '- SELECT -');
  const isFasilitasSelected = Boolean(isGroupSelected && formData?.fasilitas && formData.fasilitas !== '- SELECT -');

  const handleCheckboxSameAddress = (checked: boolean) => {
    onChange('samaDenganKtp', checked);
    if (checked) {
      onChange('alamatTinggal', formData?.alamatKtp || '');
      onChange('kelurahanTinggal', formData?.kelurahanKtp || '');
      onChange('kecamatanTinggal', formData?.kecamatanKtp || '');
      onChange('rtTinggal', formData?.rtKtp || '');
      onChange('rwTinggal', formData?.rwKtp || '');
      onChange('kodeposTinggal', formData?.kodeposKtp || '');
      onChange('kotaTinggal', formData?.kotaKtp || '');
    }
  };

  // Modal pencarian kodepos
  const [zipcodeModalOpen, setZipcodeModalOpen] = useState(false);
  const [zipcodeModalTarget, setZipcodeModalTarget] = useState<'Ktp' | 'Tinggal'>('Ktp');
  const [zipcodeSearchQuery, setZipcodeSearchQuery] = useState('');
  const [zipcodeSearchResults, setZipcodeSearchResults] = useState<any[]>([]);
  const [isSearchingZipcode, setIsSearchingZipcode] = useState(false);

  // Lookup kode pos otomatis (otomatis isi kota saat 5 digit dimasukkan)
  const lookupAndApplyZipcode = async (zip: string, target: 'Ktp' | 'Tinggal') => {
    const clean = zip.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 5) return;

    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Zipcode?zipcode=${clean}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const { kota, kelurahan, kecamatan } = json.data;
          if (kota) onChange(`kota${target}`, kota);
          if (kelurahan && !formData?.[ `kelurahan${target}` ]) onChange(`kelurahan${target}`, kelurahan);
          if (kecamatan && !formData?.[ `kecamatan${target}` ]) onChange(`kecamatan${target}`, kecamatan);
          if (target === 'Ktp' && formData?.samaDenganKtp) {
            if (kota) onChange('kotaTinggal', kota);
            if (kelurahan) onChange('kelurahanTinggal', kelurahan);
            if (kecamatan) onChange('kecamatanTinggal', kecamatan);
          }
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    // Fallback prefix kota di Indonesia
    let fallbackKota = 'KOTA SERANG';
    if (clean.startsWith('10')) fallbackKota = 'KOTA JAKARTA PUSAT';
    else if (clean.startsWith('11')) fallbackKota = 'KOTA JAKARTA BARAT';
    else if (clean.startsWith('12')) fallbackKota = 'KOTA JAKARTA SELATAN';
    else if (clean.startsWith('13')) fallbackKota = 'KOTA JAKARTA TIMUR';
    else if (clean.startsWith('14')) fallbackKota = 'KOTA JAKARTA UTARA';
    else if (clean.startsWith('15')) fallbackKota = 'KOTA TANGERANG';
    else if (clean.startsWith('16')) fallbackKota = clean.startsWith('164') ? 'KOTA DEPOK' : 'KOTA BOGOR';
    else if (clean.startsWith('17')) fallbackKota = 'KOTA BEKASI';
    else if (clean.startsWith('40')) fallbackKota = 'KOTA BANDUNG';
    else if (clean.startsWith('42')) {
      if (clean.startsWith('424')) fallbackKota = 'KOTA CILEGON';
      else if (clean.startsWith('422')) fallbackKota = 'KAB. PANDEGLANG';
      else if (clean.startsWith('423')) fallbackKota = 'KAB. LEBAK';
      else fallbackKota = 'KOTA SERANG';
    }
    else if (clean.startsWith('50')) fallbackKota = 'KOTA SEMARANG';
    else if (clean.startsWith('55')) fallbackKota = 'KOTA YOGYAKARTA';
    else if (clean.startsWith('60')) fallbackKota = 'KOTA SURABAYA';

    onChange(`kota${target}`, fallbackKota);
    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kotaTinggal', fallbackKota);
    }
  };

  const handleKodeposInputChange = (val: string, target: 'Ktp' | 'Tinggal') => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 5);
    onChange(`kodepos${target}`, clean);
    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kodeposTinggal', clean);
    }
    if (clean.length === 5) {
      lookupAndApplyZipcode(clean, target);
    }
  };

  const handleKodeposInputBlur = (target: 'Ktp' | 'Tinggal') => {
    const val = formData?.[ `kodepos${target}` ];
    if (val && val.length === 5) {
      lookupAndApplyZipcode(val, target);
    }
  };

  const openZipcodeModal = (target: 'Ktp' | 'Tinggal') => {
    setZipcodeModalTarget(target);
    setZipcodeModalOpen(true);
    const initQuery = formData?.[ `kodepos${target}` ] || formData?.[ `kota${target}` ] || 'SERANG';
    setZipcodeSearchQuery(initQuery);
    searchZipcodes(initQuery);
  };

  const searchZipcodes = async (q: string) => {
    setIsSearchingZipcode(true);
    try {
      const res = await fetch(`http://localhost:5139/api/Parameter/Search_Zipcode?query=${encodeURIComponent(q || '')}`);
      if (res.ok) {
        const json = await res.json();
        setZipcodeSearchResults(json.data || []);
      }
    } catch {
      setZipcodeSearchResults([]);
    } finally {
      setIsSearchingZipcode(false);
    }
  };

  const handleSelectZipcode = (item: any) => {
    const target = zipcodeModalTarget;
    const zCode = item.zipcode || item.ZIPCODE;
    const zKota = item.kota || item.KOTA;
    const zKel = item.kelurahan || item.KELURAHAN;
    const zKec = item.kecamatan || item.KECAMATAN;

    onChange(`kodepos${target}`, zCode);
    if (zKota) onChange(`kota${target}`, zKota);
    if (zKel) onChange(`kelurahan${target}`, zKel);
    if (zKec) onChange(`kecamatan${target}`, zKec);

    if (target === 'Ktp' && formData?.samaDenganKtp) {
      onChange('kodeposTinggal', zCode);
      if (zKota) onChange('kotaTinggal', zKota);
      if (zKel) onChange('kelurahanTinggal', zKel);
      if (zKec) onChange('kecamatanTinggal', zKec);
    }

    setZipcodeModalOpen(false);
  };

  // Format currency saat ketik maksimum kredit
  const handleMaksKreditChange = (val: string) => {
    // Bersihkan desimal lama jika ada (mencegah akumulasi nol berlipat)
    const raw = val.includes(',') ? val.split(',')[0] : val;
    const clean = raw.replace(/[^0-9]/g, '');
    if (!clean) {
      onChange('maksimumKredit', '');
      return;
    }
    const num = parseInt(clean, 10);
    if (isNaN(num)) {
      onChange('maksimumKredit', '');
      return;
    }
    // Format pemisah ribuan standar Indonesia tanpa menambahkan koma desimal palsu
    const formatted = new Intl.NumberFormat('id-ID').format(num);
    onChange('maksimumKredit', formatted);
  };

  return (
    <div className="space-y-4 font-sans text-[11px] text-gray-800">

      {/* =========================================================================
          SECTION 1: PRODUK (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(0,94,93,0.12)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#005E5D] via-[#007472] to-[#004a49] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <Package className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">PRODUK & FASILITAS KREDIT</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-teal-100 px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 1
                </span>
              </div>
              <p className="text-[10px] text-teal-100/80 font-normal">Pemilihan grup fasilitas kredit, program pembiayaan, dan rekanan pihak ketiga</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-teal-100 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            Step 1 / 9
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri: Produk */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#005E5D]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Produk & Program Pembiayaan</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Group Fasilitas :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.groupFasilitas || ''}
                      onChange={handleGroupFasilitasChange}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {groupFasilitasList.map((g: any) => (
                        <option key={g.grouP_ID || g.id} value={g.grouP_NAME || g.name}>
                          {g.grouP_NAME || g.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Fasilitas :</td>
                  <td className="p-1.5">
                    <SearchableSelect
                      value={formData?.fasilitas || ''}
                      onChange={handleFasilitasChange}
                      options={fasilitasList.map((f: any) => ({
                        value: f.productid || f.id || f.productname,
                        label: f.productname || f.name,
                      }))}
                      disabled={!isGroupSelected}
                      placeholder="- SELECT -"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kode Program :</td>
                  <td className="p-1.5">
                    <SearchableSelect
                      value={formData?.kodeProgram || ''}
                      onChange={(val) => onChange('kodeProgram', val)}
                      options={programList.map((p: any) => ({
                        value: p.pR_CODE || p.code || p.pR_DESC,
                        label: p.pR_DESC || p.name,
                      }))}
                      disabled={!isFasilitasSelected}
                      placeholder="- SELECT -"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Tujuan Pembiayaan :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.tujuanPembiayaan || ''}
                      onChange={(e) => onChange('tujuanPembiayaan', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {tujuanList.map((t: any) => (
                        <option key={t.id} value={t.tujuaN_NAME || t.name}>
                          {t.tujuaN_NAME || t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Maksimum Kredit :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.maksimumKredit || ''}
                      onChange={(e) => handleMaksKreditChange(e.target.value)}
                      className="w-full max-w-[140px] h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs text-left focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Jangka Waktu :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={formData?.jangkaWaktu || ''}
                        onChange={(e) => onChange('jangkaWaktu', e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-14 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <span className="text-gray-600">bulan</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kolom Kanan: Pihak Ketiga yang dipilih */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#E05A10]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Pihak Ketiga & Rekanan yang Dipilih</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Appraisal :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.appraisal || ''}
                      onChange={(e) => onChange('appraisal', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- SELECT -</option>
                      <option value="INTERNAL BNI">INTERNAL BNI</option>
                      <option value="KJPP KANASINTO">KJPP KANASINTO</option>
                      <option value="KJPP TOHA, OKY, HERU & REKAN">KJPP TOHA, OKY, HERU & REKAN</option>
                      <option value="KJPP MBPRU">KJPP MBPRU</option>
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Asuransi Jiwa :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.asuransiJiwa || ''}
                      onChange={(e) => onChange('asuransiJiwa', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- SELECT -</option>
                      <option value="BNI LIFE INSURANCE">BNI LIFE INSURANCE</option>
                      <option value="ASURANSI JIWASRAYA">ASURANSI JIWASRAYA</option>
                      <option value="ASURANSI ALLIANZ LIFE INDONESIA">ASURANSI ALLIANZ LIFE INDONESIA</option>
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Notaris :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.notaris || ''}
                      onChange={(e) => onChange('notaris', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- SELECT -</option>
                      <option value="NOTARIS BUDI SANTOSO, SH, M.KN (SERANG)">NOTARIS BUDI SANTOSO, SH, M.KN (SERANG)</option>
                      <option value="NOTARIS RATNA SARI, SH (SERANG)">NOTARIS RATNA SARI, SH (SERANG)</option>
                      <option value="NOTARIS H. AHMAD FAUZI, SH (SERANG)">NOTARIS H. AHMAD FAUZI, SH (SERANG)</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Investigation :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.investigation || ''}
                      onChange={(e) => onChange('investigation', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- SELECT -</option>
                      <option value="INTERNAL INVESTIGATION BNI">INTERNAL INVESTIGATION BNI</option>
                      <option value="PT SURVEYOR INDONESIA">PT SURVEYOR INDONESIA</option>
                      <option value="PT BIRO KLASIFIKASI INDONESIA">PT BIRO KLASIFIKASI INDONESIA</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: INFORMASI SOURCE APLIKASI (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(0,94,93,0.12)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#005E5D] via-[#007472] to-[#004a49] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <FileText className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">INFORMASI SOURCE APLIKASI</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-teal-100 px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 2
                </span>
              </div>
              <p className="text-[10px] text-teal-100/80 font-normal">Data asal permohonan, media promosi, dan unit referensi sales marketing</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-teal-100 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            No. Prospek: {formData?.noProspek || 'Auto Generate'}
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#005E5D]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Sumber Permohonan & Channels</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Prospek :</td>
                  <td className="p-1 font-mono text-xs font-semibold text-gray-800">
                    {formData?.noProspek || 'Auto Generate'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Channels :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.channels || formData?.sourceAplikasi || ''}
                      onChange={(e) => {
                        onChange('channels', e.target.value);
                        onChange('sourceAplikasi', e.target.value);
                      }}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {channelList.map((c: any) => (
                        <option key={c.cH_CODE || c.code} value={c.cH_DESC || c.name}>
                          {c.cH_DESC || c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Media :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.media || ''}
                      onChange={(e) => onChange('media', e.target.value)}
                      className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="">- SELECT -</option>
                      {mediaList.map((m: any) => (
                        <option key={m.mediaid || m.id} value={m.medianame || m.name}>
                          {m.medianame || m.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Regional Sales / Agensi :</td>
                  <td className="p-1.5">
                    <select
                      disabled
                      value={formData?.regionalSales || userRegionalSales}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-lg cursor-not-allowed opacity-90 focus:outline-none"
                    >
                      <option value={formData?.regionalSales || userRegionalSales}>
                        {formData?.regionalSales || userRegionalSales}
                      </option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Sales - UserID :</td>
                  <td className="p-1.5">
                    <select
                      disabled
                      value={formData?.namaSales || userSalesName}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-lg cursor-not-allowed opacity-90 focus:outline-none"
                    >
                      <option value={formData?.namaSales || userSalesName}>
                        {formData?.namaSales || userSalesName}
                      </option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kolom Kanan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#E05A10]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Unit Penjualan & Referensi Sales</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Marketing Org Type :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.marketingOrgType || 'STAFF STA'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Officer :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.namaOfficer || 'SURYA HARJAYA'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Sales Point/Cabang/Agensi :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.salesPoint || 'SERANG'}
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Supervisor :</td>
                  <td className="p-1 text-gray-800 font-medium">
                    {formData?.supervisor || ''}
                  </td>
                </tr>

                <tr>
                  <td className="w-44 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kode Cabang Pembukuan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kodeCabangPembukuan || '046'}
                      onChange={(e) => {
                        onChange('kodeCabangPembukuan', e.target.value);
                        if (e.target.value === '046') onChange('namaCabangPembukuan', 'SERANG');
                      }}
                      className="w-16 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3: INITIAL DATA ENTRY (3D Modern Elevated Card)
      ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_2px_8px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(0,94,93,0.12)] transition-all duration-300 overflow-hidden">
        {/* 3D Header Bar */}
        <div className="bg-gradient-to-r from-[#005E5D] via-[#007472] to-[#004a49] text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-2px_6px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
              <UserCheck className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase">INITIAL DATA ENTRY</h2>
                <span className="text-[9px] font-extrabold uppercase bg-white/20 text-teal-100 px-2 py-0.5 rounded-full border border-white/20">
                  Bagian 3
                </span>
              </div>
              <p className="text-[10px] text-teal-100/80 font-normal">Perekaman identitas KTP dan alamat domisili calon debitur perorangan</p>
            </div>
          </div>
          <div className="text-[10px] font-mono font-bold text-teal-100 bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 w-max">
            Debitur Perorangan
          </div>
        </div>

        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 bg-slate-50/40">
          {/* Kolom Kiri */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#005E5D]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Identitas Pribadi Sesuai e-KTP</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Gelar Sebelum :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.gelarSebelum || ''}
                      onChange={(e) => onChange('gelarSebelum', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Depan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaDepan || ''}
                      onChange={(e) => onChange('namaDepan', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Tengah :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaTengah || ''}
                      onChange={(e) => onChange('namaTengah', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Nama Belakang :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.namaBelakang || ''}
                      onChange={(e) => onChange('namaBelakang', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Gelar Sesudah :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.gelarSesudah || ''}
                      onChange={(e) => onChange('gelarSesudah', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat KTP :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.alamatKtp || ''}
                      onChange={(e) => onChange('alamatKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kelurahan/Desa :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kelurahanKtp || ''}
                      onChange={(e) => onChange('kelurahanKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kecamatan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kecamatanKtp || ''}
                      onChange={(e) => onChange('kecamatanKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Rt / Rw :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rtKtp || ''}
                        onChange={(e) => onChange('rtKtp', e.target.value)}
                        className="w-12 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <span>/</span>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rwKtp || ''}
                        onChange={(e) => onChange('rwKtp', e.target.value)}
                        className="w-12 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kodepos :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={5}
                        value={formData?.kodeposKtp || ''}
                        onChange={(e) => handleKodeposInputChange(e.target.value, 'Ktp')}
                        onBlur={() => handleKodeposInputBlur('Ktp')}
                        placeholder="Contoh: 42111"
                        className="w-20 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <button
                        type="button"
                        onClick={() => openZipcodeModal('Ktp')}
                        className="h-[28px] px-3 bg-gradient-to-b from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 active:scale-[0.98] border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all cursor-pointer"
                      >
                        Cari
                      </button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kota :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kotaKtp || ''}
                      onChange={(e) => onChange('kotaKtp', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kolom Kanan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <span className="w-2 h-2 rounded-full bg-[#E05A10]" />
              <span className="font-bold text-xs text-slate-800 tracking-wide uppercase">Alamat Domisili & Nomor Kontak</span>
            </div>
            <table className="w-full text-[11px]">
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat Tinggal :</td>
                  <td className="p-1.5">
                    <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={Boolean(formData?.samaDenganKtp)}
                        onChange={(e) => handleCheckboxSameAddress(e.target.checked)}
                        className="h-3.5 w-3.5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      />
                      <span>Sama dengan Alamat KTP</span>
                    </label>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">:</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.alamatTinggal || ''}
                      onChange={(e) => onChange('alamatTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className="w-full max-w-[260px] h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs disabled:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kelurahan/Desa :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kelurahanTinggal || ''}
                      onChange={(e) => onChange('kelurahanTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className="w-full max-w-[260px] h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs disabled:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kecamatan :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kecamatanTinggal || ''}
                      onChange={(e) => onChange('kecamatanTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className="w-full max-w-[260px] h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs disabled:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Rt / Rw :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rtTinggal || ''}
                        onChange={(e) => onChange('rtTinggal', e.target.value)}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        className="w-14 h-[28px] px-2 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs text-center rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                      />
                      <span>/</span>
                      <input
                        type="text"
                        maxLength={3}
                        value={formData?.rwTinggal || ''}
                        onChange={(e) => onChange('rwTinggal', e.target.value)}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        className="w-14 h-[28px] px-2 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs text-center rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kodepos :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        maxLength={5}
                        value={formData?.kodeposTinggal || ''}
                        onChange={(e) => handleKodeposInputChange(e.target.value, 'Tinggal')}
                        onBlur={() => handleKodeposInputBlur('Tinggal')}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        placeholder="Contoh: 42111"
                        className="w-24 h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => openZipcodeModal('Tinggal')}
                        disabled={Boolean(formData?.samaDenganKtp)}
                        className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-gray-400 text-[11px] font-medium rounded-xs transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cari
                      </button>
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Kota :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.kotaTinggal || ''}
                      onChange={(e) => onChange('kotaTinggal', e.target.value)}
                      disabled={Boolean(formData?.samaDenganKtp)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Telp :</td>
                  <td className="p-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="021"
                        maxLength={4}
                        value={formData?.noTelpArea || ''}
                        onChange={(e) => onChange('noTelpArea', e.target.value)}
                        className="w-14 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={formData?.noTelpNumber || ''}
                        onChange={(e) => onChange('noTelpNumber', e.target.value)}
                        className="w-32 h-[22px] px-1.5 bg-[#fffde6] border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">No. Handphone :</td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData?.noHandphone || ''}
                      onChange={(e) => onChange('noHandphone', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Alamat E-Mail :</td>
                  <td className="p-1.5">
                    <input
                      type="email"
                      value={formData?.email || ''}
                      onChange={(e) => onChange('email', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-white border border-slate-300 text-gray-800 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="w-40 text-right pr-3 py-1.5 font-medium text-slate-600 whitespace-nowrap text-[11px]">Tipe Nasabah :</td>
                  <td className="p-1.5">
                    <select
                      value={formData?.tipeNasabah || ''}
                      onChange={(e) => onChange('tipeNasabah', e.target.value)}
                      className="w-full max-w-[260px] h-[28px] px-2.5 bg-[#fffde6] border border-amber-300/80 text-gray-900 text-xs rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-[#007B83] transition-all"
                    >
                      <option value="">- SELECT -</option>
                      {tipeNasabahList.map((t: any) => (
                        <option key={t.rN_CODE || t.code || t.id} value={t.rN_DESC || t.name}>
                          {t.rN_DESC || t.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOMBOL AKSI: Single Centered Black Button "Lanjut" (Sesuai Screenshot Asli)
      ========================================================================= */}
      <div className="flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={onLanjut}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-3 px-16 py-3.5 rounded-2xl bg-gradient-to-r from-[#005E5D] via-[#007472] to-[#004a49] hover:from-[#004e4d] hover:to-[#003d3c] active:translate-y-0.5 active:scale-[0.98] text-white font-black text-xs uppercase tracking-widest shadow-[0_8px_24px_rgba(0,94,93,0.4),0_2px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,94,93,0.5)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-teal-400/30"
        >
          <span>{isSubmitting ? 'Menyimpan Draf...' : 'Simpan & Lanjut ke Obyek Pembiayaan'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>


      {/* Modal Popup Pencarian Kode Pos (Sesuai CuBES SearchZipCode) */}
      {zipcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white border border-teal-600/30 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden font-sans text-xs animate-scale-up">
            <div className="bg-gradient-to-r from-[#005E5D] via-[#007876] to-[#005E5D] text-white font-bold px-4 py-2.5 flex items-center justify-between shadow-xs">
              <span>Pencarian Kode Pos / Wilayah (CuBES eLO)</span>
              <button
                type="button"
                onClick={() => setZipcodeModalOpen(false)}
                className="text-white hover:text-red-200 font-bold text-sm leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-3 space-y-3 bg-[#f7fbfb]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zipcodeSearchQuery}
                  onChange={(e) => {
                    setZipcodeSearchQuery(e.target.value);
                    searchZipcodes(e.target.value);
                  }}
                  placeholder="Ketik nama Kota, Kecamatan, Kelurahan, atau Kode Pos..."
                  className="flex-1 h-7 px-2 bg-white border border-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => searchZipcodes(zipcodeSearchQuery)}
                  className="h-7 px-3 bg-[#007B83] text-white hover:bg-[#005f66] text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Cari
                </button>
              </div>

              <div className="border border-gray-300 max-h-64 overflow-y-auto bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#b9dede] text-[#004d40] sticky top-0 border-b border-[#007B83]/30 font-semibold">
                    <tr>
                      <th className="py-1 px-2">Kode Pos</th>
                      <th className="py-1 px-2">Kelurahan</th>
                      <th className="py-1 px-2">Kecamatan</th>
                      <th className="py-1 px-2">Kota / Kabupaten</th>
                      <th className="py-1 px-2">Provinsi</th>
                      <th className="py-1 px-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {zipcodeSearchResults.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500 italic">
                          {isSearchingZipcode ? 'Sedang mencari data...' : 'Tidak ada data ditemukan. Coba ketik kata kunci lain.'}
                        </td>
                      </tr>
                    ) : (
                      zipcodeSearchResults.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-teal-50 transition-colors cursor-pointer"
                          onClick={() => handleSelectZipcode(item)}
                        >
                          <td className="py-1 px-2 font-mono font-bold text-teal-800">{item.zipcode || item.ZIPCODE}</td>
                          <td className="py-1 px-2">{item.kelurahan || item.KELURAHAN}</td>
                          <td className="py-1 px-2">{item.kecamatan || item.KECAMATAN}</td>
                          <td className="py-1 px-2 font-semibold text-gray-800">{item.kota || item.KOTA}</td>
                          <td className="py-1 px-2 text-gray-600">{item.propinsi || item.PROPINSI}</td>
                          <td className="py-1 px-2 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectZipcode(item);
                              }}
                              className="px-2 py-0.5 bg-[#007B83] text-white hover:bg-[#005f66] text-[10px] font-medium rounded-xs cursor-pointer"
                            >
                              Pilih
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 pt-1 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setZipcodeModalOpen(false)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
