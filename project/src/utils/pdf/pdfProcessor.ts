import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import { 
  getSimpleLoadingOptions,
  initializeSimpleWorker,
  ensureWorkerIsRunning
} from '../pdf-worker-simple';

export interface ProcessedResume {
  text: string;
  pages: number;
  metadata: {
    title?: string;
    author?: string;
    creationDate?: string;
    keywords?: string[];
  };
  sections: {
    education?: string;
    experience?: string;
    skills?: string;
    summary?: string;
  };
  // Advanced analysis metrics
  score: number;               // Overall resume quality score (0-100)
  keywordMatch: number;        // Percentage of keywords matched (0-100)
  formattingScore: number;     // Formatting quality score (0-100)
  skillsGap: string[];         // Missing or suggested skills
  atsCompatibility: number;    // ATS compatibility score (0-100)
}

// Interface for PDF metadata info
interface PdfInfo {
  Title?: string;
  Author?: string;
  CreationDate?: string;
  Keywords?: string[] | string;
}

export class ResumeProcessor {
  private static instance: ResumeProcessor;
  private workerInitialized = false;

  private constructor() {
    this.initializeWorker();
  }

  public static getInstance(): ResumeProcessor {
    if (!ResumeProcessor.instance) {
      ResumeProcessor.instance = new ResumeProcessor();
    }
    return ResumeProcessor.instance;
  }

  private async initializeWorker() {
    if (!this.workerInitialized) {      try {
        await initializeSimpleWorker();
        this.workerInitialized = true;
      } catch (error) {
        console.error('Failed to initialize PDF worker:', error);
        throw error;
      }
    }
  }

  private async destroyLoadingTask(task: pdfjsLib.PDFDocumentLoadingTask | null) {
    if (task && !task.destroyed) {
      try {
        await task.destroy();
      } catch (err) {
        console.warn('Error destroying PDF loading task:', err);
      }
    }
  }
  public async processResume(file: File | Blob): Promise<ProcessedResume> {
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask | null = null;
    try {
      // Ensure worker is initialized and running
      await ensureWorkerIsRunning();

      // Read file as array buffer
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);      // Load PDF document with simple options
      loadingTask = pdfjsLib.getDocument(
        getSimpleLoadingOptions(uint8Array)
      );

      const pdfDoc = await loadingTask.promise.catch(async (error) => {
        await this.destroyLoadingTask(loadingTask);
        
        // Check if this is a password-protected PDF error
        if (error.name === 'PasswordException') {
          throw new Error('This PDF is password-protected. Please remove the password and upload again.');
        }
        
        throw error;
      });

      try {
        // Extract metadata with fallback
        const meta = await pdfDoc.getMetadata().catch(() => ({ info: {} as PdfInfo }));
        const info = (meta as { info: PdfInfo }).info;

        // Process each page
        const numPages = pdfDoc.numPages;
        let fullText = '';
        const sections: ProcessedResume['sections'] = {};

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const textContent = await page.getTextContent();

          // Map TextItem entries to strings
          const pageText = (textContent.items as TextItem[])
            .map(item => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();

          fullText += pageText + '\n';

          // Basic section detection
          if (pageText.toLowerCase().includes('education')) {
            sections.education = this.extractSection(pageText, 'education');
          }
          if (pageText.toLowerCase().includes('experience') || pageText.toLowerCase().includes('work history')) {
            sections.experience = this.extractSection(pageText, 'experience');
          }
          if (pageText.toLowerCase().includes('skills') || pageText.toLowerCase().includes('qualifications')) {
            sections.skills = this.extractSection(pageText, 'skills');
          }
          if (pageText.toLowerCase().includes('summary') || pageText.toLowerCase().includes('objective')) {
            sections.summary = this.extractSection(pageText, 'summary');
          }
        }

        // Generate the result before cleanup
        const result = {
          text: fullText,
          pages: numPages,
          metadata: {
            title: info.Title,
            author: info.Author,
            creationDate: info.CreationDate,
            keywords: Array.isArray(info.Keywords)
              ? info.Keywords
              : typeof info.Keywords === 'string'
                ? info.Keywords.split(',').map(k => k.trim())
                : []
          },
          sections
        } as ProcessedResume;
        // Compute dummy analysis metrics for advanced features
        result.score = Math.min(100, Math.round(fullText.length / 1000));
        result.keywordMatch = 80; // Placeholder static value
        result.formattingScore = 85; // Placeholder static value
        result.skillsGap = ['Project Management', 'Leadership']; // Example suggestions
        result.atsCompatibility = 90; // Placeholder static value        // Cleanup PDF document resources
        try {
          pdfDoc.destroy();
        } catch (error) {
          console.warn('Error destroying PDF document:', error);
        }
        await this.destroyLoadingTask(loadingTask);

        return result;      } catch (error) {
        // Clean up resources on error
        try {
          pdfDoc?.destroy();
        } catch (cleanupError) {
          console.warn('Error destroying PDF document:', cleanupError);
        }
        await this.destroyLoadingTask(loadingTask);
        throw error;
      }    } catch (error: unknown) {
      console.error('Error processing resume:', error);
      
      // If the error is already a proper Error object with a message, pass it through
      if (error instanceof Error && error.message.includes('password-protected')) {
        throw error;
      }
      
      // Check for specific known errors - safely check properties
      const errorObj = error as { name?: string; message?: string; };
      
      if (errorObj.name === 'PasswordException' || 
          (errorObj.message && typeof errorObj.message === 'string' && 
           errorObj.message.includes('password'))) {
        throw new Error('This PDF is password-protected. Please remove the password protection and try uploading again.');
      }
      
      // Generic error for other cases
      throw new Error('Failed to process resume. Please ensure the file is a valid PDF.');
    }
  }

  private extractSection(text: string, sectionType: keyof ProcessedResume['sections']): string {
    const sectionMarkers = {
      education: /education|academic background/i,
      experience: /experience|work history|professional background/i,
      skills: /skills|qualifications|expertise|technical skills/i,
      summary: /summary|objective|professional summary/i
    };

    const marker = sectionMarkers[sectionType];
    if (!marker) return '';

    const match = text.match(new RegExp(`(?:${marker.source}).*?(?=(${Object.values(sectionMarkers).map(r => r.source).join('|')})|$)`, 'is'));
    return match ? match[0].trim() : '';
  }
}

// Export singleton instance
export const resumeProcessor = ResumeProcessor.getInstance();
