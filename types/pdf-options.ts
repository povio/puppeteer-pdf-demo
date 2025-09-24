export interface PDFOptions {
  scale?: number;
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
  landscape?: boolean;
  pageRanges?: string;
  format?: string;
  width?: string | number;
  height?: string | number;
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  omitBackground?: boolean;
  preferCSSPageSize?: boolean;
  outline?: boolean;
  tagged?: boolean;
  timeout?: number;
  waitForFonts?: boolean;
}

export interface PDFRequest {
  id: string;
  timestamp: string;
  html: string;
  options: PDFOptions;
  status: 'success' | 'error' | 'pending';
  error?: string;
}