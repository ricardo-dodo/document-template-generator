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
    const data: Document = {
      title: 'Document Title',
      content: pdfText,
      author: 'Author Name',
      createdAt: new Date(),
      generalInfo: 'Informasi Umum',
      intro: 'Surat Pengantar',
      assignment: 'Surat Tugas',
      guidelines: 'Pedoman',
      reportSummary: 'Simpulan dan Rekomendasi',
      auditDetails: 'Uraian Audit',
      footer: 'Footer Content'
    };

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

  private async generateAuditReport(document: Document): Promise<void> {
    const auditReport = {
      documentId: document.title, // Assuming title is unique
      createdAt: document.createdAt,
      author: document.author,
      contentLength: document.content.length,
      // Add more fields as needed
    };
    await fs.promises.writeFile('audit_report.json', JSON.stringify(auditReport, null, 2));
  }
}