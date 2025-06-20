export interface ParsedResumeData {
  skills: string[];
  jobTitles: string[];
  experience: string[];
  education: string[];
  rawText: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  skills: string[];
  matchPercentage: number;
  salary?: string;
  datePosted?: string;
  jobType?: string; // full-time, part-time, contract, etc.
}
