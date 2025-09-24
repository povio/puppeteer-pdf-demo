"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, RotateCcw, Calendar, Clock } from 'lucide-react';
import { PDFRequest } from '@/types/pdf-options';

interface RequestHistoryProps {
  requests: PDFRequest[];
  onRetry: (request: PDFRequest) => void;
  onClear: () => void;
}

export default function RequestHistory({ requests, onRetry, onClear }: RequestHistoryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Request History</CardTitle>
        {requests.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] px-6 pb-6">
          {requests.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice().reverse().map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(request.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <Badge
                      variant={
                        request.status === 'success'
                          ? 'default'
                          : request.status === 'error'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">HTML Preview:</p>
                    <div className="bg-muted rounded p-2 text-xs font-mono max-h-20 overflow-hidden">
                      {request.html.slice(0, 100)}
                      {request.html.length > 100 && '...'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Options:</p>
                    <div className="text-xs text-muted-foreground">
                      Format: {request.options.format || 'A4'} | 
                      Scale: {request.options.scale || 1} | 
                      {request.options.landscape ? 'Landscape' : 'Portrait'}
                      {request.options.printBackground && ' | Print BG'}
                    </div>
                  </div>

                  {request.status === 'error' && request.error && (
                    <div className="mb-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                      Error: {request.error}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(request)}
                    className="w-full h-8"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Retry
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}