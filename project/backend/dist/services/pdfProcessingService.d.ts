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
export declare const processResumePDF: (buffer: Buffer) => Promise<string>;
export declare const processResumePDFDetailed: (buffer: Buffer) => Promise<ProcessedResumeData>;
export declare const cleanResumeText: (text: string) => string;
export declare const extractResumeSections: (text: string) => {
    [key: string]: string;
};
export declare const validateResumeContent: (text: string) => {
    isValid: boolean;
    issues: string[];
};
//# sourceMappingURL=pdfProcessingService.d.ts.map