function getWorkerSource(): string {
  // Use CDN version for both development and production
  return `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
} 