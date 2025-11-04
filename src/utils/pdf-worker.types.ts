/**
 * PDF Worker Types
 */

export interface PdfWorkerConfig {
  workerSrc: string;
  workerPort?: MessagePort;
}

export interface PdfLoadingOptions {
  data: ArrayBuffer | Uint8Array;
  password?: string;
  useWorkerFetch?: boolean;
  standardFontDataUrl?: string;
  cMapUrl?: string;
  cMapPacked?: boolean;
}
