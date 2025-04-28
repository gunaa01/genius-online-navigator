import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ExportFormat, exportData } from '@/utils/exportUtils';
import { Download, FileText, FileSpreadsheet, FileCode } from 'lucide-react';

interface ExportDialogProps {
  data: any[];
  columns: { header: string; dataKey: string }[];
  defaultFilename: string;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
}

/**
 * Export Dialog Component
 * 
 * Provides a dialog for exporting data in various formats (PDF, Excel, CSV)
 * with customization options.
 */
const ExportDialog: React.FC<ExportDialogProps> = ({
  data,
  columns,
  defaultFilename,
  title = 'Export Data',
  description = 'Choose your export format and options',
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [filename, setFilename] = useState(defaultFilename);
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [customTitle, setCustomTitle] = useState('AI Insights Report');
  const [customSubtitle, setCustomSubtitle] = useState('Generated from Genius Online Navigator');

  const handleExport = () => {
    exportData(data, columns, {
      filename,
      format,
      title: includeTitle ? customTitle : undefined,
      subtitle: includeTitle ? customSubtitle : undefined,
      includeTimestamp
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="filename" className="text-right">
              Filename
            </Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Format</Label>
            <RadioGroup
              value={format}
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="col-span-3 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center cursor-pointer">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  PDF Document
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                  Excel Spreadsheet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center cursor-pointer">
                  <FileCode className="h-4 w-4 mr-2 text-orange-600" />
                  CSV File
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id="timestamp"
                  checked={includeTimestamp}
                  onCheckedChange={(checked) => setIncludeTimestamp(!!checked)}
                />
                <Label htmlFor="timestamp" className="cursor-pointer">
                  Include timestamp in filename
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="title"
                  checked={includeTitle}
                  onCheckedChange={(checked) => setIncludeTitle(!!checked)}
                />
                <Label htmlFor="title" className="cursor-pointer">
                  Include title and subtitle (PDF only)
                </Label>
              </div>
            </div>
          </div>
          
          {includeTitle && format === 'pdf' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="custom-title"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom-subtitle" className="text-right">
                  Subtitle
                </Label>
                <Input
                  id="custom-subtitle"
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleExport}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
