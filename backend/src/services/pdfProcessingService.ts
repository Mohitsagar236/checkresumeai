import pdfParse from 'pdf-parse';
import { logger } from '../utils/logger.js';
import { ExternalServiceError } from '../middleware/errorHandler.js';

export interface ProcessedResumeData {
  text: string;
  pages: number;
  metadata?: {
    title?: string | undefined;
    author?: string | undefined;
    creator?: string | undefined;
    producer?: string | undefined;
    creationDate?: Date | undefined;
    modificationDate?: Date | undefined;
  };
  wordCount: number;
  characterCount: number;
}

/**
 * Process PDF buffer and extract text content
 */
export const processResumePDF = async (buffer: Buffer): Promise<string> => {
  try {
    logger.debug('Starting PDF processing');
    
    const data = await pdfParse(buffer, {
      // PDF parsing options
      max: 0, // No limit on pages
      version: 'v1.10.100', // Use specific version for consistency
    });

    const extractedText = data.text.trim();
    
    if (!extractedText || extractedText.length < 50) {
      throw new ExternalServiceError('Unable to extract readable text from PDF. Please ensure the PDF is not scanned or password-protected.');
    }

    logger.info(`PDF processed successfully. Extracted ${extractedText.length} characters from ${data.numpages} pages`);
    
    return extractedText;

  } catch (error) {
    logger.error('PDF processing failed:', error);
    
    if (error instanceof ExternalServiceError) {
      throw error;
    }
    
    throw new ExternalServiceError('Failed to process PDF file. Please ensure the file is a valid, readable PDF document.');
  }
};

/**
 * Process PDF buffer and return detailed information
 */
export const processResumePDFDetailed = async (buffer: Buffer): Promise<ProcessedResumeData> => {
  try {
    logger.debug('Starting detailed PDF processing');
    
    const data = await pdfParse(buffer);
    
    const extractedText = data.text.trim();
    
    if (!extractedText || extractedText.length < 50) {
      throw new ExternalServiceError('Unable to extract readable text from PDF');
    }    const processedData: ProcessedResumeData = {
      text: extractedText,
      pages: data.numpages,
      metadata: data.info ? {
        title: data.info.Title || undefined,
        author: data.info.Author || undefined,
        creator: data.info.Creator || undefined,
        producer: data.info.Producer || undefined,
        creationDate: data.info.CreationDate ? new Date(data.info.CreationDate) : undefined,
        modificationDate: data.info.ModDate ? new Date(data.info.ModDate) : undefined,
      } : undefined,
      wordCount: extractedText.split(/\s+/).filter((word: string) => word.length > 0).length,
      characterCount: extractedText.length,
    };

    logger.info(`Detailed PDF processing completed. Pages: ${processedData.pages}, Words: ${processedData.wordCount}`);
    
    return processedData;

  } catch (error) {
    logger.error('Detailed PDF processing failed:', error);
    
    if (error instanceof ExternalServiceError) {
      throw error;
    }
    
    throw new ExternalServiceError('Failed to process PDF file');
  }
};

/**
 * Clean and normalize extracted text
 */
export const cleanResumeText = (text: string): string => {
  return text
    // Remove excessive whitespace
    .replace(/\s{3,}/g, ' ')
    // Remove excessive line breaks
    .replace(/\n{3,}/g, '\n\n')
    // Remove special characters that might interfere with analysis
    .replace(/[^\w\s@.-]/g, ' ')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
};

/**
 * Extract sections from resume text
 */
export const extractResumeSections = (text: string): { [key: string]: string } => {
  const sections: { [key: string]: string } = {};
  
  // Common section headers and their variations
  const sectionPatterns = {
    contact: /(?:contact|personal)\s*(?:information|details|info)?/i,
    summary: /(?:summary|profile|objective|about)/i,
    experience: /(?:experience|work|employment|career|professional)/i,
    education: /(?:education|academic|qualification|degree)/i,
    skills: /(?:skills|competencies|abilities|expertise|technical)/i,
    projects: /(?:projects|portfolio|work samples)/i,
    certifications: /(?:certifications?|certificates?|licenses?)/i,
    achievements: /(?:achievements?|accomplishments?|awards?|honors?)/i,
    references: /(?:references?|recommendations?)/i,
  };

  // Split text into potential sections
  const lines = text.split('\n');
  let currentSection = 'other';
  let sectionContent = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Check if this line is a section header
    let foundSection = false;
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmedLine) && trimmedLine.length < 50) {
        // Save previous section
        if (sectionContent.trim()) {
          sections[currentSection] = (sections[currentSection] || '') + '\n' + sectionContent.trim();
        }
        
        currentSection = sectionName;
        sectionContent = '';
        foundSection = true;
        break;
      }
    }

    if (!foundSection) {
      sectionContent += '\n' + trimmedLine;
    }
  }

  // Save the last section
  if (sectionContent.trim()) {
    sections[currentSection] = (sections[currentSection] || '') + '\n' + sectionContent.trim();
  }

  return sections;
};

/**
 * Validate resume content quality
 */
export const validateResumeContent = (text: string): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check minimum length
  if (text.length < 200) {
    issues.push('Resume content is too short (minimum 200 characters required)');
  }

  // Check for contact information
  if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    issues.push('No email address found');
  }

  if (!/\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/.test(text)) {
    issues.push('No phone number found');
  }

  // Check for key sections
  const hasExperience = /(?:experience|work|employment|job|position|role)/i.test(text);
  const hasEducation = /(?:education|degree|university|college|school)/i.test(text);
  const hasSkills = /(?:skills|competencies|abilities)/i.test(text);

  if (!hasExperience) {
    issues.push('No work experience section found');
  }

  if (!hasEducation) {
    issues.push('No education section found');
  }

  if (!hasSkills) {
    issues.push('No skills section found');
  }

  // Check word count
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  if (wordCount < 150) {
    issues.push('Resume is too brief (minimum 150 words recommended)');
  } else if (wordCount > 1000) {
    issues.push('Resume is too lengthy (maximum 1000 words recommended)');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};
