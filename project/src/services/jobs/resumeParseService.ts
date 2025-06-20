import { ParsedResumeData } from '../../types/jobs';
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import '../../utils/pdfjs-init.js';

// PDF.js worker is initialized in pdfjs-init.js

/**
 * Extracts text from a PDF file
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const typedArray = new Uint8Array(arrayBuffer);
  
  try {
    // Using PDF.js to extract text content from PDF
    const loadingTask = pdfjs.getDocument(typedArray);
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    
    // Iterate through each page to extract text
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      
      fullText += pageText + ' ';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

/**
 * Extracts text from a DOCX file
 */
async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    // Using mammoth.js to extract text content from DOCX
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

/**
 * Parses resume text using AI to extract relevant information
 */
async function parseResumeText(text: string): Promise<ParsedResumeData> {
  try {
    // In a real implementation, this would use an AI service
    // For now, we're using a simple keyword-based approach
    
    // Extract skills based on common programming languages, tools, and technologies
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++',
      'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Project Management', 'Agile', 'Scrum',
      'Machine Learning', 'AI', 'Data Science',
      'Communication', 'Leadership', 'Teamwork'
    ];
    
    // Extract job titles based on common positions
    const commonJobTitles = [
      'Software Engineer', 'Frontend Developer', 'Backend Developer',
      'Full Stack Developer', 'DevOps Engineer', 'Data Engineer',
      'Data Scientist', 'Product Manager', 'Project Manager',
      'UX Designer', 'UI Developer', 'QA Engineer',
      'Technical Writer', 'Systems Administrator'
    ];
    
    // Simple parsing logic - look for keywords in text
    const skills = commonSkills.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );
    
    const jobTitles = commonJobTitles.filter(title => 
      new RegExp(`\\b${title}\\b`, 'i').test(text)
    );
    
    // For more advanced implementations, consider using:
    // 1. Named Entity Recognition (NER) models
    // 2. Resume parsing APIs (like Affinda, Sovren, etc.)
    // 3. Custom trained models for resume section classification
    
    return {
      skills,
      jobTitles,
      experience: [], // Would extract work history in a real implementation
      education: [], // Would extract education details in a real implementation
      rawText: text
    };
  } catch (error) {
    console.error('Error parsing resume text:', error);
    throw new Error('Failed to parse resume content');
  }
}

/**
 * Main function to parse resume file and extract job-relevant information
 */
export async function parseResumeForJobs(file: File): Promise<ParsedResumeData> {
  try {
    let text = '';
    
    // Extract text based on file type
    if (file.name.toLowerCase().endsWith('.pdf')) {
      text = await extractTextFromPdf(file);
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      text = await extractTextFromDocx(file);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
    }
    
    if (!text || text.length < 10) {
      throw new Error('Could not extract any text from the resume. Please make sure the file is not password protected or corrupted.');
    }
    
    // Parse the extracted text to get structured resume data
    return await parseResumeText(text);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw error;
  }
}
