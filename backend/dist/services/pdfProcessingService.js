import pdfParse from 'pdf-parse';
import { logger } from '../utils/logger.js';
import { ExternalServiceError } from '../middleware/errorHandler.js';
export const processResumePDF = async (buffer) => {
    try {
        logger.debug('Starting PDF processing');
        const data = await pdfParse(buffer, {
            max: 0,
            version: 'v1.10.100',
        });
        const extractedText = data.text.trim();
        if (!extractedText || extractedText.length < 50) {
            throw new ExternalServiceError('Unable to extract readable text from PDF. Please ensure the PDF is not scanned or password-protected.');
        }
        logger.info(`PDF processed successfully. Extracted ${extractedText.length} characters from ${data.numpages} pages`);
        return extractedText;
    }
    catch (error) {
        logger.error('PDF processing failed:', error);
        if (error instanceof ExternalServiceError) {
            throw error;
        }
        throw new ExternalServiceError('Failed to process PDF file. Please ensure the file is a valid, readable PDF document.');
    }
};
export const processResumePDFDetailed = async (buffer) => {
    try {
        logger.debug('Starting detailed PDF processing');
        const data = await pdfParse(buffer);
        const extractedText = data.text.trim();
        if (!extractedText || extractedText.length < 50) {
            throw new ExternalServiceError('Unable to extract readable text from PDF');
        }
        const processedData = {
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
            wordCount: extractedText.split(/\s+/).filter((word) => word.length > 0).length,
            characterCount: extractedText.length,
        };
        logger.info(`Detailed PDF processing completed. Pages: ${processedData.pages}, Words: ${processedData.wordCount}`);
        return processedData;
    }
    catch (error) {
        logger.error('Detailed PDF processing failed:', error);
        if (error instanceof ExternalServiceError) {
            throw error;
        }
        throw new ExternalServiceError('Failed to process PDF file');
    }
};
export const cleanResumeText = (text) => {
    return text
        .replace(/\s{3,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[^\w\s@.-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};
export const extractResumeSections = (text) => {
    const sections = {};
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
    const lines = text.split('\n');
    let currentSection = 'other';
    let sectionContent = '';
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine)
            continue;
        let foundSection = false;
        for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
            if (pattern.test(trimmedLine) && trimmedLine.length < 50) {
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
    if (sectionContent.trim()) {
        sections[currentSection] = (sections[currentSection] || '') + '\n' + sectionContent.trim();
    }
    return sections;
};
export const validateResumeContent = (text) => {
    const issues = [];
    if (text.length < 200) {
        issues.push('Resume content is too short (minimum 200 characters required)');
    }
    if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
        issues.push('No email address found');
    }
    if (!/\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/.test(text)) {
        issues.push('No phone number found');
    }
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
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 150) {
        issues.push('Resume is too brief (minimum 150 words recommended)');
    }
    else if (wordCount > 1000) {
        issues.push('Resume is too lengthy (maximum 1000 words recommended)');
    }
    return {
        isValid: issues.length === 0,
        issues
    };
};
