export interface Document {
  title: string;
  header: {
    organization: string;
    unit: string;
    address: string;
    phone: string;
    fax: string;
    email: string;
    website: string;
  };
  nomor_surat: string;
  lampiran: string;
  hal: string;
  penerima: string;
  lokasi_penerima: string;
  isi_surat: string;
  penutup_surat: string;
  footer: {
    greeting: string;
    position: string;
    signature: string;
    name: string;
    disclaimer: string;
  };
  tembusan: string[];
  pengaduan: {
    message: string;
    contact: string;
  };
}