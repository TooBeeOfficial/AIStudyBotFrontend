import { inject, Injectable } from '@angular/core';
import { MessageDialogComponent } from './dialogs/success-dialog/success-dialog';

import * as pdfjsLib from 'pdfjs-dist';
import { MatDialog } from '@angular/material/dialog';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.mjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  dialog = inject(MatDialog);

  readText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  }

  async extractPdfText(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item: any) => item.str).join(' ');

      fullText += pageText + '\n';
    }
    return fullText.trim();
  }

  async handleFile(file: File): Promise<string> {
    const name = file.name.toLowerCase();
    const type = file.type;

    this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Loading!',
        message: `Your file is being processed. You can close this tab.`,
      },
    });

    if (type === 'application/pdf' || name.endsWith('.pdf')) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return await this.extractPdfText(file);
    }

    if (
      type.startsWith('text') ||
      name.endsWith('.txt') ||
      name.endsWith('.md') ||
      name.endsWith('.json') ||
      name.endsWith('.csv') ||
      name.endsWith('.html') ||
      name.endsWith('.css') ||
      name.endsWith('.js') ||
      name.endsWith('.ts')
    ) {
      return await this.readText(file);
    }

    this.dialog.open(MessageDialogComponent, {
      data: {
        title: 'Failed!',
        message: `Unsupported file type: ${file.type}. \nSupported file types: .txt, .md, .json, .csv, .pdf.`,
      },
    });
    return '';
  }

  formatQuestionFromJson(input: string): string {
    try {
      const data = typeof input === 'string' ? JSON.parse(input) : input;

      if (!data?.questions || !Array.isArray(data.questions)) {
        return '';
      }

      return data.questions
        .map((q: any) => {
          const question = q?.question ?? '';

          const answers = Array.isArray(q?.answers) ? q.answers : Object.values(q?.answers ?? {});

          return [question, ...answers.map((a: any) => `- ${a}`)].join('\n');
        })
        .join('\n\n');
    } catch (err) {
      console.error('Invalid JSON:', err);
      return input;
    }
  }
}
