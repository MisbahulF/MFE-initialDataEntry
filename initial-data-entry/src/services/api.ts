/**
 * BNI eLO Konsumer - Initial Data Entry API Service
 * Centralized HTTP client consuming ASP.NET Core backend (Port 5139)
 */

import { getApiBaseUrl } from '@template/shared';
import { ApiResponse, ProspectItem, IdeFormData, CollateralItem } from '../types/ide.types';

export const API_BASE = getApiBaseUrl();

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const prospectService = {
  async getProspectList(): Promise<ApiResponse<ProspectItem[]>> {
    try {
      const res = await fetch(`${API_BASE}/DataEntry/prospect-list`, { headers: defaultHeaders });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      console.warn('[prospectService] getProspectList fallback to empty list', e);
    }
    return { isSuccess: false, message: 'Gagal mengambil data prospek', data: [] };
  },

  async getApplicationById(id: string): Promise<ApiResponse<any>> {
    try {
      const res = await fetch(`${API_BASE}/DataEntry/application/${encodeURIComponent(id)}`, { headers: defaultHeaders });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('[prospectService] getApplicationById error', e);
    }
    return { isSuccess: false, message: 'Data aplikasi tidak ditemukan' };
  }
};

export const ideApi = {
  async saveApplication(payload: {
    noAplikasi: string;
    noProspek: string;
    namaDebitur: string;
    ktp: string;
    produk: string;
    cabang: string;
    status: string;
    data: any;
  }): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/DataEntry/applications`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveSourceApplicant(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/SourceApplicant/save-applicant-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveDebiturInfo(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/DebiturInformation/save-debitur-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveDebiturJob(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/DebiturJob/save-debitur-job-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveSpouseInfo(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/SpouseInformation/save-spouse-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveSpouseJob(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/SpouseJobInformation/save-spouse-job-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveEmergencyContact(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/EmergencyContact/save-emergency-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveBankInfo(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/BankInformation/save-bank-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveCollateral(payload: CollateralItem): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/Collateral/save-collateral-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async saveMemoSkdr(payload: any): Promise<ApiResponse<any>> {
    const res = await fetch(`${API_BASE}/MemoSkdr/save-memo-griya`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(payload),
    });
    return res.json();
  }
};
