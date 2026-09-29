export interface InitialDataEntryData {
    //Source & Produk
    grupFasilitas: string;     // '1' (Griya), '4' (Fleksi), '5' (Multiguna)
    fasilitas: string;
    program: string;
    agunanKreditMacet: boolean;
    tipeNasabah: string;

    //Objek Agunan (Bisa lebih dari 1)
    collaterals: Array<{
        id: string;
        subTipeJaminan: string;  // SHGB/IMB, dll
        statusDeveloper: string; // Dev PKS / Non PKS / Perorangan
        nilaiPasar: number;
        nilaiNjop: number;
        alamat: string;
    }>;

    //Identitas Debitur
    applicant: {
        nik: string;
        namaLengkap: string;
        tanggalLahir: string;
        jenisKelamin: string;
        statusPernikahan: 'SINGLE' | 'MARRIED' | 'DIVORCED';
        noHp: string;
        alamatKtp: string;
        kodePos: string;
    };

    //Pekerjaan Debitur
    employment: {
        jenisPekerjaan: string;
        namaPerusahaan: string;
        lamaBekerjaTahun: number;
        thpBulanan: number; // Take Home Pay / Penghasilan Bersih
    };

    // Pasangan (Diisi jika MARRIED)
    spouse?: {
        nik: string;
        namaLengkap: string;
        tanggalLahir: string;
    };

    //Pekerjaan Pasangan
    spouseEmployment?: {
        bekerja: boolean;
        penghasilanBulanan: number;
        joinIncome: boolean;
    };

    //Kontak Darurat
    emergencyContact: {
        namaLengkap: string;
        hubungan: string;
        noHp: string;
    };

    // Perbankan & Memo
    bankingAndMemo: {
        rekeningBni: string;
        catatanMemo: string;
    };
}
