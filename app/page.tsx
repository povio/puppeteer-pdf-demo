"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import PDFOptionsForm from '@/components/PDFOptionsForm';
import RequestHistory from '@/components/RequestHistory';
import { PDFOptions, PDFRequest } from '@/types/pdf-options';
import { Toaster } from '@/components/ui/sonner';
import { FileText, Download } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState<PDFRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<PDFRequest | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('pdf-requests');
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored requests:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pdf-requests', JSON.stringify(requests));
  }, [requests]);

  const generatePDF = async (html: string, options: PDFOptions) => {
    setIsLoading(true);
    
    const requestId = Date.now().toString();
    const newRequest: PDFRequest = {
      id: requestId,
      timestamp: new Date().toISOString(),
      html,
      options,
      status: 'pending'
    };

    setRequests(prev => [...prev, newRequest]);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ html, options }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update request status
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: 'success' as const } : req
        )
      );

      toast.success('PDF generated successfully!', {
        description: 'The PDF has been downloaded to your device.'
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Update request status with error
      setRequests(prev =>
        prev.map(req =>
          req.id === requestId 
            ? { ...req, status: 'error' as const, error: errorMessage } 
            : req
        )
      );

      toast.error('Failed to generate PDF', {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (request: PDFRequest) => {
    setSelectedRequest(request);
    generatePDF(request.html, request.options);
  };

  const clearHistory = () => {
    setRequests([]);
    toast.success('Request history cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Puppeteer PDF Tester</h1>
              <p className="text-sm text-gray-600">Test and experiment with Puppeteer PDF generation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PDF Form - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <PDFOptionsForm
              onSubmit={generatePDF}
              isLoading={isLoading}
              initialHtml={selectedRequest?.html}
              initialOptions={selectedRequest?.options}
            />
          </div>

          {/* Request History - Takes 1 column */}
          <div className="lg:col-span-1">
            <RequestHistory
              requests={requests}
              onRetry={handleRetry}
              onClear={clearHistory}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Built with Next.js and Puppeteer</p>
            <div className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>PDFs download automatically</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}