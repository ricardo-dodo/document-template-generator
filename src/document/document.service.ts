import { Injectable, NotFoundException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { Document } from './document.interface';
import * as pdf from 'pdf-parse';

@Injectable()
export class DocumentService {
  async generateDocument(templateName: string, pdfFile: Express.Multer.File): Promise<string> {
    if (!templateName) {
      throw new NotFoundException('Template name is required.');
    }

    const pdfText = await this.extractTextFromPDF(pdfFile);
    console.log('Extracted PDF Text:', pdfText); // Log the extracted text

    const data: Document = this.parsePDFContent(pdfText);

    const templatePath = `./src/templates/${templateName}.hbs`;
    const templateContent = await fs.promises.readFile(templatePath, 'utf-8');
    const template = Handlebars.compile(templateContent);
    const documentContent = template(data);

    await this.generateAuditReport(data);

    return documentContent;
  }

  private async extractTextFromPDF(pdfFile: Express.Multer.File): Promise<string> {
    const dataBuffer = pdfFile.buffer;
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  }

  private parsePDFContent(pdfText: string): Document {
    // Example parsing logic, adjust as needed
    const sections = pdfText.split('\n\n'); // Assuming sections are separated by double newlines
    return {
      title: sections[0] || 'Document Title',
      header: {
        organization: sections[1] || 'Organization Name',
        unit: sections[2] || 'Unit Name',
        address: sections[3] || 'Address',
        phone: sections[4] || 'Phone Number',
        fax: sections[5] || 'Fax Number',
        email: sections[6] || 'Email Address',
        website: sections[7] || 'Website URL'
      },
      nomor_surat: sections[8] || 'Nomor Surat',
      lampiran: sections[9] || 'Lampiran',
      hal: sections[10] || 'Hal',
      penerima: sections[11] || 'Penerima',
      lokasi_penerima: sections[12] || 'Lokasi Penerima',
      isi_surat: sections.slice(13, sections.length - 4).join('\n\n') || 'Isi Surat', // Combine remaining sections for isi_surat
      penutup_surat: sections[sections.length - 4] || 'Penutup Surat',
      footer: {
        greeting: sections[sections.length - 3] || 'Greeting',
        position: sections[sections.length - 2] || 'Position',
        signature: sections[sections.length - 1] || 'Signature',
        name: 'Name',
        disclaimer: 'Disclaimer'
      },
      tembusan: ['Tembusan 1', 'Tembusan 2'],
      pengaduan: {
        message: 'Pengaduan Message',
        contact: 'Pengaduan Contact'
      }
    };
  }

  private async generateAuditReport(document: Document): Promise<void> {
    const auditReport = {
      documentId: document.title, // Assuming title is unique
      contentLength: document.isi_surat.length,
      // Add more fields as needed
    };
    await fs.promises.writeFile('audit_report.json', JSON.stringify(auditReport, null, 2));
  }
}