/**
 * Export utilities for generating and downloading reports in various formats
 */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Types for export options
export type ExportFormat = 'pdf' | 'excel' | 'csv';

export interface ExportOptions {
  filename: string;
  format: ExportFormat;
  title?: string;
  subtitle?: string;
  includeTimestamp?: boolean;
}

/**
 * Export data to PDF format
 * @param data Data to export
 * @param columns Column definitions
 * @param options Export options
 */
export const exportToPdf = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions
) => {
  const { filename, title, subtitle, includeTimestamp = true } = options;
  const doc = new jsPDF();
  const finalFilename = `${filename}${includeTimestamp ? `_${getTimestamp()}` : ''}.pdf`;
  
  // Add title and subtitle
  if (title) {
    doc.setFontSize(18);
    doc.text(title, 14, 22);
  }
  
  if (subtitle) {
    doc.setFontSize(12);
    doc.text(subtitle, 14, 30);
  }
  
  const startY = title || subtitle ? 40 : 20;
  
  // Prepare table data
  const tableData = data.map(item => {
    return columns.map(col => item[col.dataKey] || '');
  });
  
  // Add table
  (doc as any).autoTable({
    head: [columns.map(col => col.header)],
    body: tableData,
    startY,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Add footer with date
  if (includeTimestamp) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Generated on ${new Date().toLocaleString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
  }
  
  // Save the PDF
  doc.save(finalFilename);
};

/**
 * Export data to Excel format
 * @param data Data to export
 * @param columns Column definitions
 * @param options Export options
 */
export const exportToExcel = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions
) => {
  const { filename, includeTimestamp = true } = options;
  const finalFilename = `${filename}${includeTimestamp ? `_${getTimestamp()}` : ''}.xlsx`;
  
  // Prepare worksheet data
  const wsData = [
    columns.map(col => col.header),
    ...data.map(item => columns.map(col => item[col.dataKey] || ''))
  ];
  
  // Create worksheet and workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Save the Excel file
  XLSX.writeFile(wb, finalFilename);
};

/**
 * Export data to CSV format
 * @param data Data to export
 * @param columns Column definitions
 * @param options Export options
 */
export const exportToCsv = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions
) => {
  const { filename, includeTimestamp = true } = options;
  const finalFilename = `${filename}${includeTimestamp ? `_${getTimestamp()}` : ''}.csv`;
  
  // Prepare CSV content
  const headers = columns.map(col => col.header).join(',');
  const rows = data.map(item => 
    columns.map(col => {
      const value = item[col.dataKey] || '';
      // Escape commas and quotes in values
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    }).join(',')
  );
  
  const csvContent = [headers, ...rows].join('\n');
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', finalFilename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to the specified format
 * @param data Data to export
 * @param columns Column definitions
 * @param options Export options
 */
export const exportData = (
  data: any[],
  columns: { header: string; dataKey: string }[],
  options: ExportOptions
) => {
  switch (options.format) {
    case 'pdf':
      exportToPdf(data, columns, options);
      break;
    case 'excel':
      exportToExcel(data, columns, options);
      break;
    case 'csv':
      exportToCsv(data, columns, options);
      break;
    default:
      console.error('Unsupported export format');
  }
};

/**
 * Get a timestamp string for filenames
 * @returns Timestamp string in YYYYMMDD_HHMMSS format
 */
const getTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};
