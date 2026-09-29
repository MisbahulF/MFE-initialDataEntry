export type LoanStatus = 
  | 'DRAFT'
  | 'SENT_TO_PROCESSING'
  | 'DTBO_TAKEN'
  | 'DUPE_CHECKED'
  | 'DATA_ENTRY_IN_PROGRESS'
  | 'DATA_ENTRY_COMPLETED';

export interface ProspectRecord {
  id: string;
  nomorAplikasi: string;
  namaDebitur: string;
  produk: string;
  program?: string;
  tglPengajuan: string;
  status: string;
  salesName?: string;
  salesId?: string;
  plafon?: string | number;
  tujuanPenggunaan?: string;
  channel?: string;
  keterangan?: string;
}

export interface DtboDocItem {
  id: string;
  code: string;
  name: string;
  type: string;
  isMandatory: boolean;
  checked: boolean;
}

export interface DtboDocumentMaker {
  id: string;
  salesId: string;
  salesName: string;
  salesRole: string;
  timestamp: string;
  isTaker: boolean;
  documents: DtboDocItem[];
}

export interface DupeCandidateRecord {
  id: string;
  nomorAplikasi: string;
  namaDebitur: string;
  namaPasangan?: string;
  noKtp: string;
  tglLahir: string;
  produk: string;
  plafon: string;
  tglPengajuan: string;
  status: string;
}

export interface BlacklistCheckResult {
  checkedAt: string;
  debiturStatus: 'CLEAR' | 'SUSPECT' | 'MATCH';
  pasanganStatus?: 'CLEAR' | 'SUSPECT' | 'MATCH';
  notes?: string;
}
