import React from 'react';

export interface ObyekPembiayaanProps {
  colForm: any;
  onChange: (field: string, value: any) => void;
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

export const ObyekPembiayaan: React.FC<ObyekPembiayaanProps> = ({
  colForm,
  onChange,
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
  // Apakah user sudah memilih Tipe Jaminan / Objek?
  const isObjectSelected = Boolean(colForm?.tipeJaminan && colForm.tipeJaminan !== '');

  // Sub-tipe options berdasarkan tipe jaminan
  const getSubTipeOptions = () => {
    const t = colForm?.tipeJaminan;
    if (t === 'Tanah Dan Bangunan') {
      return [
        { label: '- SELECT -', value: '' },
        { label: 'Bgn/IMB diatas tnh SHGU perpanj', value: 'BgnIMB diatas tnh SHGU perpanj' },
        { label: 'Rumah Tinggal', value: 'Rumah Tinggal' },
        { label: 'Rusun/Apartemen', value: 'Rusun/Apartemen' },
        { label: 'Ruko / Rukan', value: 'Ruko / Rukan' },
        { label: 'Tanah & Bangunan Pabrik', value: 'Tanah & Bangunan Pabrik' },
      ];
    }
    if (t === 'Tanah') {
      return [
        { label: '- SELECT -', value: '' },
        { label: 'Tanah Kosong / Kavling', value: 'Tanah Kosong / Kavling' },
        { label: 'Tanah Perkebunan', value: 'Tanah Perkebunan' },
        { label: 'Tanah Pertanian', value: 'Tanah Pertanian' },
      ];
    }
    if (t === 'Bangunan') {
      return [
        { label: '- SELECT -', value: '' },
        { label: 'Bangunan Rumah Tinggal', value: 'Bangunan Rumah Tinggal' },
        { label: 'Bangunan Rusun / Apartemen', value: 'Bangunan Rusun / Apartemen' },
        { label: 'Bangunan Gudang / Pabrik', value: 'Bangunan Gudang / Pabrik' },
      ];
    }
    return [
      { label: '- SELECT -', value: '' },
      { label: 'Bgn/IMB diatas tnh SHGU perpanj', value: 'BgnIMB diatas tnh SHGU perpanj' },
      { label: 'Rumah Tinggal', value: 'Rumah Tinggal' },
      { label: 'Rusun / Apartemen', value: 'Rusun / Apartemen' },
    ];
  };

  // Header code title
  const getHeaderTitle = () => {
    if (!isObjectSelected) return 'OBYEK PEMBIAYAAN';
    if (colForm.tipeJaminan === 'Tanah Dan Bangunan') return 'OBYEK PEMBIAYAAN H03';
    if (colForm.tipeJaminan === 'Tanah') return 'OBYEK PEMBIAYAAN H01';
    if (colForm.tipeJaminan === 'Bangunan') return 'OBYEK PEMBIAYAAN H02';
    return 'OBYEK PEMBIAYAAN H03';
  };

  const handleCariLokasi = () => {
    onChange('lokasiAgunanKode', '162');
    onChange('lokasiAgunanDesc', 'ACEH BARAT, KAB.');
  };

  const handleCariSertifikat = () => {
    onChange('tipeSertifikatKode', '0217');
    onChange('tipeSertifikatDesc', 'SERTIFIKAT');
  };

  const handleCariProyek = () => {
    onChange('developer', 'PT CIPUTRA DEVELOPMENT TBK');
    onChange('proyek', 'CITRA RAYA RESIDENCE BLOK C');
  };

  const handleCariZip = () => {
    onChange('kodepos', '10260');
    onChange('alamat2', 'JAKARTA');
    onChange('alamat3', 'JAKARTA');
  };

  return (
    <div className="space-y-4 font-sans text-[11px] text-gray-800">

      {/* =========================================================================
          CARD: OBYEK PEMBIAYAAN (Sesuai Gambar 1 - 5 CuBES eLO Asli)
      ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.07),0_2px_6px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-4px_rgba(0,94,93,0.12)] transition-all duration-300 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#F15A24] via-[#F37021] to-[#E05A10] text-white font-extrabold text-center py-2.5 text-xs tracking-widest uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2">
          {getHeaderTitle()}
        </div>

        <div className="p-2">
          {/* JIKA BELUM MEMILIH OBYEK: Tampilkan Form Pemilihan Awal (media_1789443543860.png) */}
          {!isObjectSelected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#cce8e8]">
              {/* Kolom Kiri: Pilihan Kategori & Tipe Jaminan */}
              <div>
                <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
                  <tbody>
                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Kategori Pembiayaan :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.kategoriPembiayaan || ''}
                          onChange={(e) => onChange('kategoriPembiayaan', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">- SELECT -</option>
                          <option value="Baru">Baru</option>
                          <option value="Top Up">Top Up</option>
                          <option value="Take Over">Take Over</option>
                          <option value="Renovasi">Renovasi</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Tipe Jaminan/Objek yang Dibiayai :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.tipeJaminan || ''}
                          onChange={(e) => onChange('tipeJaminan', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">- SELECT -</option>
                          <option value="Tanah">Tanah</option>
                          <option value="Bangunan">Bangunan</option>
                          <option value="Tanah Dan Bangunan">Tanah Dan Bangunan</option>
                          <option value="Rumah Susun / Apartemen">Rumah Susun / Apartemen</option>
                          <option value="Kendaraan Bermotor">Kendaraan Bermotor</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Nama Sales Developer :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.namaSalesDeveloper || ''}
                          onChange={(e) => onChange('namaSalesDeveloper', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        No. KTP Sales Developer :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.noKtpSalesDeveloper || ''}
                          onChange={(e) => onChange('noKtpSalesDeveloper', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table></div>
              </div>

              {/* Kolom Kanan: Kosong sebelum memilih objek */}
              <div className="hidden md:block p-4 text-center text-gray-400 italic">
                Pilih Tipe Jaminan/Objek yang Dibiayai untuk menampilkan rincian formulir.
              </div>
            </div>
          ) : (
            /* JIKA SUDAH MEMILIH OBYEK: Tampilkan Form Detail Lengkap (media_1789443704239.png & media_1789443783224.png) */
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#cce8e8]">
              {/* Kolom Kiri */}
              <div>
                <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
                  <tbody>
                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Kategori Pembiayaan :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.kategoriPembiayaan || ''}
                          onChange={(e) => onChange('kategoriPembiayaan', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">- SELECT -</option>
                          <option value="Baru">Baru</option>
                          <option value="Top Up">Top Up</option>
                          <option value="Take Over">Take Over</option>
                          <option value="Renovasi">Renovasi</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Tipe Jaminan/Objek yang Dibiayai :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.tipeJaminan || ''}
                          onChange={(e) => onChange('tipeJaminan', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">- SELECT -</option>
                          <option value="Tanah">Tanah</option>
                          <option value="Bangunan">Bangunan</option>
                          <option value="Tanah Dan Bangunan">Tanah Dan Bangunan</option>
                          <option value="Rumah Susun / Apartemen">Rumah Susun / Apartemen</option>
                          <option value="Kendaraan Bermotor">Kendaraan Bermotor</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Tipe Sub Jaminan/ Sub Objek yang Dibiayai :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.tipeSubJaminan || ''}
                          onChange={(e) => onChange('tipeSubJaminan', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          {getSubTipeOptions().map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Status :</td>
                      <td className="p-1">
                        <div className="flex items-center gap-3 text-xs">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusCol"
                              checked={colForm?.status === 'Developer PKS'}
                              onChange={() => onChange('status', 'Developer PKS')}
                            />
                            <span>Developer PKS</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusCol"
                              checked={colForm?.status === 'Developer Non PKS'}
                              onChange={() => onChange('status', 'Developer Non PKS')}
                            />
                            <span>Developer Non PKS</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusCol"
                              checked={colForm?.status === 'Perorangan' || !colForm?.status}
                              onChange={() => onChange('status', 'Perorangan')}
                            />
                            <span>Perorangan</span>
                          </label>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Status Indent :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.statusIndent || 'NON-INDEN'}
                          onChange={(e) => onChange('statusIndent', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="NON-INDEN">NON-INDEN</option>
                          <option value="INDEN">INDEN</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Area :</td>
                      <td className="p-1">
                        <select
                          value={colForm?.area || 'JAKARTA'}
                          onChange={(e) => onChange('area', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="JAKARTA">JAKARTA</option>
                          <option value="SERANG">SERANG</option>
                          <option value="BANTEN">BANTEN</option>
                          <option value="JAWA BARAT">JAWA BARAT</option>
                        </select>
                      </td>
                    </tr>

                    {/* Conditional: Developer vs Umum (Perorangan) */}
                    {colForm?.status?.startsWith('Developer') ? (
                      <>
                        <tr className="border-b border-[#e5f2f2]">
                          <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                            Developer :
                          </td>
                          <td className="p-1">
                            <input
                              type="text"
                              value={colForm?.developer || ''}
                              onChange={(e) => onChange('developer', e.target.value)}
                              className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                            />
                          </td>
                        </tr>
                        <tr className="border-b border-[#e5f2f2]">
                          <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                            Proyek :
                          </td>
                          <td className="p-1">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={colForm?.proyek || ''}
                                onChange={(e) => onChange('proyek', e.target.value)}
                                className="w-full max-w-[200px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                              />
                              <button
                                type="button"
                                onClick={handleCariProyek}
                                className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-medium rounded-xs"
                              >
                                Cari
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr className="border-b border-[#e5f2f2]">
                        <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Umum :</td>
                        <td className="p-1">
                          <input
                            type="text"
                            value={colForm?.umum || ''}
                            onChange={(e) => onChange('umum', e.target.value)}
                            className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                        </td>
                      </tr>
                    )}

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Nama Sales Developer :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.namaSalesDeveloper || ''}
                          onChange={(e) => onChange('namaSalesDeveloper', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        No. KTP Sales Developer :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.noKtpSalesDeveloper || ''}
                          onChange={(e) => onChange('noKtpSalesDeveloper', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Sales Developer (Pihak ke-3) :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.salesDevPihak3 || ''}
                          onChange={(e) => onChange('salesDevPihak3', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">--SELECT--</option>
                          <option value="PT CIPUTRA PROPERTY">PT CIPUTRA PROPERTY</option>
                          <option value="PT SINARMAS LAND">PT SINARMAS LAND</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Tipe Properti :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.tipeProperti || 'TANAH/KAVLING'}
                          onChange={(e) => onChange('tipeProperti', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="TANAH/KAVLING">TANAH/KAVLING</option>
                          <option value="RUMAH TINGGAL">RUMAH TINGGAL</option>
                          <option value="RUKO/RUKAN">RUKO/RUKAN</option>
                          <option value="APARTEMEN">APARTEMEN</option>
                        </select>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Status Agen Properti :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-3 text-xs">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusAgenProperti"
                              checked={colForm?.statusAgenProperti === 'PKS'}
                              onChange={() => onChange('statusAgenProperti', 'PKS')}
                            />
                            <span>PKS</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusAgenProperti"
                              checked={colForm?.statusAgenProperti === 'Non PKS'}
                              onChange={() => onChange('statusAgenProperti', 'Non PKS')}
                            />
                            <span>Non PKS</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name="statusAgenProperti"
                              checked={colForm?.statusAgenProperti === 'Perorangan' || !colForm?.statusAgenProperti}
                              onChange={() => onChange('statusAgenProperti', 'Perorangan')}
                            />
                            <span>Perorangan</span>
                          </label>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Agen Properti :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.agenProperti || ''}
                          onChange={(e) => onChange('agenProperti', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Sales Agen Properti (Pihak ke-3) :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.salesAgenPihak3 || ''}
                          onChange={(e) => onChange('salesAgenPihak3', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="">--SELECT-- (Pilih area terlebih dahulu)</option>
                          <option value="ERA INDONESIA">ERA INDONESIA</option>
                          <option value="RAY WHITE">RAY WHITE</option>
                          <option value="CENTURY 21">CENTURY 21</option>
                        </select>
                      </td>
                    </tr>

                    {/* Alamat Agunan (3 baris) */}
                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap align-top pt-1.5">
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={Boolean(colForm?.sameAddress)}
                            onChange={(e) => onChange('sameAddress', e.target.checked)}
                          />
                          <span>Alamat :</span>
                        </label>
                      </td>
                      <td className="p-1 space-y-1">
                        <input
                          type="text"
                          value={colForm?.alamat1 || ''}
                          onChange={(e) => onChange('alamat1', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                        <input
                          type="text"
                          value={colForm?.alamat2 || ''}
                          onChange={(e) => onChange('alamat2', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                        <input
                          type="text"
                          value={colForm?.alamat3 || ''}
                          onChange={(e) => onChange('alamat3', e.target.value)}
                          className="w-full max-w-[260px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        RT / RW :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            maxLength={3}
                            value={colForm?.rt || ''}
                            onChange={(e) => onChange('rt', e.target.value)}
                            className="w-12 h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <span>/</span>
                          <input
                            type="text"
                            maxLength={3}
                            value={colForm?.rw || ''}
                            onChange={(e) => onChange('rw', e.target.value)}
                            className="w-12 h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs text-center focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="w-48 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Kodepos :</td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            maxLength={5}
                            value={colForm?.kodepos || ''}
                            onChange={(e) => onChange('kodepos', e.target.value)}
                            className="w-20 h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <button
                            type="button"
                            onClick={handleCariZip}
                            className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-medium rounded-xs"
                          >
                            Cari
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table></div>
              </div>

              {/* Kolom Kanan: Rincian Fisik & Legalitas Agunan */}
              <div>
                <div className="overflow-x-auto w-full"><table className="w-full text-[11px]">
                  <tbody>
                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Lokasi Agunan :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={colForm?.lokasiAgunanKode || ''}
                            onChange={(e) => onChange('lokasiAgunanKode', e.target.value)}
                            className="w-14 h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <input
                            type="text"
                            value={colForm?.lokasiAgunanDesc || ''}
                            onChange={(e) => onChange('lokasiAgunanDesc', e.target.value)}
                            className="w-44 h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <button
                            type="button"
                            onClick={handleCariLokasi}
                            className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-medium rounded-xs"
                          >
                            Cari
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Luas Bangunan :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={colForm?.luasBangunan || ''}
                            onChange={(e) => onChange('luasBangunan', e.target.value)}
                            className="w-20 h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <span>m2</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Luas Area :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={colForm?.luasArea || ''}
                            onChange={(e) => onChange('luasArea', e.target.value)}
                            className="w-20 h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <span>m2</span>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Perkiraan Harga :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.perkiraanHarga || ''}
                          onChange={(e) => onChange('perkiraanHarga', e.target.value)}
                          className="w-full max-w-[200px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs text-right focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Tipe Sertifikat :
                      </td>
                      <td className="p-1">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={colForm?.tipeSertifikatKode || ''}
                            onChange={(e) => onChange('tipeSertifikatKode', e.target.value)}
                            className="w-14 h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <input
                            type="text"
                            value={colForm?.tipeSertifikatDesc || ''}
                            onChange={(e) => onChange('tipeSertifikatDesc', e.target.value)}
                            className="w-36 h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                          />
                          <button
                            type="button"
                            onClick={handleCariSertifikat}
                            className="h-[22px] px-2 bg-gray-100 hover:bg-gray-200 border border-slate-300 rounded text-[11px] font-medium rounded-xs"
                          >
                            Cari
                          </button>
                        </div>
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        No. Sertifikat :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.noSertifikat || ''}
                          onChange={(e) => onChange('noSertifikat', e.target.value)}
                          className="w-full max-w-[220px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Nomor/Unit :
                      </td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.nomorUnit || ''}
                          onChange={(e) => onChange('nomorUnit', e.target.value)}
                          className="w-full max-w-[220px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Tower :</td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.tower || ''}
                          onChange={(e) => onChange('tower', e.target.value)}
                          className="w-full max-w-[220px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr className="border-b border-[#e5f2f2]">
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">Lantai :</td>
                      <td className="p-1">
                        <input
                          type="text"
                          value={colForm?.lantai || ''}
                          onChange={(e) => onChange('lantai', e.target.value)}
                          className="w-full max-w-[220px] h-[22px] px-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="w-44 text-right pr-2 py-1 font-normal text-gray-700 whitespace-nowrap">
                        Market Segment :
                      </td>
                      <td className="p-1">
                        <select
                          value={colForm?.marketSegment || 'Secondary Market'}
                          onChange={(e) => onChange('marketSegment', e.target.value)}
                          className="w-full max-w-[220px] h-[22px] px-1 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/25 focus:border-[#F15A24]"
                        >
                          <option value="Secondary Market">Secondary Market</option>
                          <option value="Primary Market">Primary Market</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table></div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button: Tambah / Ubah Agunan */}
        <div className="bg-[#f0f4f4] py-1.5 px-4 text-center border-t border-[#cce8e8] flex items-center justify-center gap-2">
          {editingIndex !== null ? (
            <>
              <button
                type="button"
                onClick={onUpdateCollateral || onAddCollateral}
                className="px-6 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow cursor-pointer"
              >
                Ubah
              </button>
              {onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs border border-slate-300 rounded rounded-xs cursor-pointer"
                >
                  Batal
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={onAddCollateral}
              className="px-6 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow cursor-pointer"
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
      <div className="border border-[#d35400] overflow-hidden bg-white">
        <div className="overflow-x-auto w-full"><table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-[#E05A10] text-white font-bold text-center">
              <th className="py-1 px-3 border-r border-orange-400 text-left font-semibold">Tipe</th>
              <th className="py-1 px-3 border-r border-orange-400 text-center font-semibold">Kisaran Harga</th>
              <th className="py-1 px-3 border-r border-orange-400 text-center font-semibold">Jenis Properti</th>
              <th className="py-1 px-3 text-center font-semibold">Function</th>
            </tr>
          </thead>
          <tbody>
            {collaterals.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-1.5 px-3 text-center text-gray-500 font-mono">
                  &lt; &gt;
                </td>
              </tr>
            ) : (
              collaterals.map((col, idx) => (
                <tr key={idx} className={idx % 2 === 1 ? 'bg-[#fef8f5]' : 'bg-white'}>
                  <td className="py-1 px-3 border-t border-gray-200 font-medium text-gray-800">
                    {col.tipe || col.tipeJaminan || 'Tanah Dan Bangunan'}
                  </td>
                  <td className="py-1 px-3 border-t border-gray-200 text-center font-mono">
                    {col.kisaranHarga || col.perkiraanHarga || '-'}
                  </td>
                  <td className="py-1 px-3 border-t border-gray-200 text-center text-gray-700">
                    {col.jenisProperti || col.tipeProperti || 'TANAH/KAVLING'}
                  </td>
                  <td className="py-1 px-3 border-t border-gray-200 text-center space-x-2">
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
        </table></div>
      </div>

      {/* =========================================================================
          TOMBOL LANJUT: Centered Black Button
      ========================================================================= */}
      <div className="flex items-center justify-center pt-2 pb-6">
        <button
          type="button"
          onClick={onLanjut}
          disabled={isSubmitting}
          className="px-8 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xs shadow transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'Menyimpan...' : 'Lanjut'}
        </button>
      </div>

    </div>
  );
};
