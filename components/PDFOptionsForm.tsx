"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PDFOptions } from '@/types/pdf-options';

interface PDFOptionsFormProps {
  onSubmit: (html: string, options: PDFOptions) => void;
  isLoading: boolean;
  initialHtml?: string;
  initialOptions?: PDFOptions;
}

const paperFormats = [
  'A4', 'A3', 'A2', 'A1', 'A0', 'A5', 'A6',
  'Letter', 'Legal', 'Tabloid', 'Ledger'
];

const defaultOptions: PDFOptions = {
  scale: 1,
  displayHeaderFooter: false,
  headerTemplate: '',
  footerTemplate: '',
  printBackground: false,
  landscape: false,
  pageRanges: '',
  format: 'A4',
  width: '',
  height: '',
  margin: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0'
  },
  omitBackground: false,
  preferCSSPageSize: false,
  outline: false,
  tagged: true,
  timeout: 30000,
  waitForFonts: true
};

export default function PDFOptionsForm({ onSubmit, isLoading, initialHtml, initialOptions }: PDFOptionsFormProps) {
  const [html, setHtml] = useState(initialHtml || '<h1>Hello PDF</h1><div class="page-break"></div><p>Next page</p>');
  const [options, setOptions] = useState<PDFOptions>({ ...defaultOptions, ...initialOptions });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(html, options);
  };

  const updateOption = (key: keyof PDFOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateMargin = (side: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      margin: { ...prev.margin, [side]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>HTML Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={8}
            placeholder="Enter your HTML content here..."
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Basic Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scale">Scale</Label>
              <Input
                id="scale"
                type="number"
                min="0.1"
                max="2"
                step="0.1"
                value={options.scale}
                onChange={(e) => updateOption('scale', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={options.format} onValueChange={(value) => updateOption('format', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {paperFormats.map(format => (
                    <SelectItem key={format} value={format}>{format}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={options.width}
                onChange={(e) => updateOption('width', e.target.value)}
                placeholder="e.g., 8.5in, 210mm"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={options.height}
                onChange={(e) => updateOption('height', e.target.value)}
                placeholder="e.g., 11in, 297mm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="pageRanges">Page Ranges</Label>
            <Input
              id="pageRanges"
              value={options.pageRanges}
              onChange={(e) => updateOption('pageRanges', e.target.value)}
              placeholder="e.g., 1-5, 8, 11-13"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="landscape"
              checked={options.landscape}
              onCheckedChange={(checked) => updateOption('landscape', checked)}
            />
            <Label htmlFor="landscape">Landscape orientation</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Margins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="marginTop">Top</Label>
              <Input
                id="marginTop"
                value={options.margin?.top}
                onChange={(e) => updateMargin('top', e.target.value)}
                placeholder="e.g., 1in, 2.54cm"
              />
            </div>
            <div>
              <Label htmlFor="marginBottom">Bottom</Label>
              <Input
                id="marginBottom"
                value={options.margin?.bottom}
                onChange={(e) => updateMargin('bottom', e.target.value)}
                placeholder="e.g., 1in, 2.54cm"
              />
            </div>
            <div>
              <Label htmlFor="marginLeft">Left</Label>
              <Input
                id="marginLeft"
                value={options.margin?.left}
                onChange={(e) => updateMargin('left', e.target.value)}
                placeholder="e.g., 1in, 2.54cm"
              />
            </div>
            <div>
              <Label htmlFor="marginRight">Right</Label>
              <Input
                id="marginRight"
                value={options.margin?.right}
                onChange={(e) => updateMargin('right', e.target.value)}
                placeholder="e.g., 1in, 2.54cm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Header & Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="displayHeaderFooter"
              checked={options.displayHeaderFooter}
              onCheckedChange={(checked) => updateOption('displayHeaderFooter', checked)}
            />
            <Label htmlFor="displayHeaderFooter">Display header and footer</Label>
          </div>

          {options.displayHeaderFooter && (
            <>
              <div>
                <Label htmlFor="headerTemplate">Header Template</Label>
                <Textarea
                  id="headerTemplate"
                  value={options.headerTemplate}
                  onChange={(e) => updateOption('headerTemplate', e.target.value)}
                  placeholder="HTML template with .date, .title, .url, .pageNumber, .totalPages"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="footerTemplate">Footer Template</Label>
                <Textarea
                  id="footerTemplate"
                  value={options.footerTemplate}
                  onChange={(e) => updateOption('footerTemplate', e.target.value)}
                  placeholder="HTML template with .date, .title, .url, .pageNumber, .totalPages"
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                value={options.timeout}
                onChange={(e) => updateOption('timeout', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="printBackground"
                checked={options.printBackground}
                onCheckedChange={(checked) => updateOption('printBackground', checked)}
              />
              <Label htmlFor="printBackground">Print background graphics</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="omitBackground"
                checked={options.omitBackground}
                onCheckedChange={(checked) => updateOption('omitBackground', checked)}
              />
              <Label htmlFor="omitBackground">Omit background (transparency)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="preferCSSPageSize"
                checked={options.preferCSSPageSize}
                onCheckedChange={(checked) => updateOption('preferCSSPageSize', checked)}
              />
              <Label htmlFor="preferCSSPageSize">Prefer CSS @page size rules</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="waitForFonts"
                checked={options.waitForFonts}
                onCheckedChange={(checked) => updateOption('waitForFonts', checked)}
              />
              <Label htmlFor="waitForFonts">Wait for fonts to load</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="outline"
                checked={options.outline}
                onCheckedChange={(checked) => updateOption('outline', checked)}
              />
              <Label htmlFor="outline">Generate PDF outline/bookmarks (experimental)</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="tagged"
                checked={options.tagged}
                onCheckedChange={(checked) => updateOption('tagged', checked)}
              />
              <Label htmlFor="tagged">Generate tagged/accessible PDF (experimental)</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Generating PDF...' : 'Generate PDF'}
      </Button>
    </form>
  );
}