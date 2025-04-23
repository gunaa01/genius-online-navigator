import { useState } from 'react';
import { 
  FileIcon, 
  FileTextIcon, 
  FileImageIcon, 
  FileArchiveIcon, 
  FileCode2Icon,
  FilePieChartIcon,
  FileX2Icon,
  FileSpreadsheetIcon,
  MoreHorizontal,
  Download,
  Trash2,
  Link,
  Share2,
  Pencil,
  Eye,
  CalendarClock,
  CheckCircle2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// File types
export type FileType = 'image' | 'document' | 'spreadsheet' | 'presentation' | 'archive' | 'code' | 'video' | 'audio' | 'other';

// File interface
export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  extension: string;
  size: string; // "1.2 MB" format for display
  sizeInBytes: number; // Raw bytes for sorting
  createdAt: string;
  updatedAt: string;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  folder: string;
  description?: string;
  isStarred?: boolean;
  isShared?: boolean;
  permissions: 'view' | 'edit' | 'admin';
  version?: number;
  tags?: string[];
  status?: 'draft' | 'review' | 'approved' | 'rejected';
}

interface FileListProps {
  files: ProjectFile[];
  viewMode: 'grid' | 'list';
  selectedFiles: string[];
  onFileSelect: (fileId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onFileAction: (action: string, fileId: string) => void;
  onFileClick: (fileId: string) => void;
}

const FileList = ({
  files,
  viewMode,
  selectedFiles,
  onFileSelect,
  onSelectAll,
  onFileAction,
  onFileClick
}: FileListProps) => {
  const allSelected = files.length > 0 && selectedFiles.length === files.length;
  const someSelected = selectedFiles.length > 0 && selectedFiles.length < files.length;
  
  // Get appropriate icon for file type
  const getFileIcon = (fileType: FileType, extension: string) => {
    switch (fileType) {
      case 'image':
        return <FileImageIcon className="h-10 w-10 text-blue-500" />;
      case 'document':
        return <FileTextIcon className="h-10 w-10 text-amber-500" />;
      case 'spreadsheet':
        return <FileSpreadsheetIcon className="h-10 w-10 text-green-500" />;
      case 'presentation':
        return <FilePieChartIcon className="h-10 w-10 text-red-500" />;
      case 'archive':
        return <FileArchiveIcon className="h-10 w-10 text-purple-500" />;
      case 'code':
        return <FileCode2Icon className="h-10 w-10 text-slate-500" />;
      default:
        return <FileIcon className="h-10 w-10 text-slate-400" />;
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (viewMode === 'grid') {
    return (
      <div>
        {/* Header with select all */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center">
            <Checkbox 
              checked={allSelected} 
              indeterminate={someSelected}
              onCheckedChange={(checked) => onSelectAll(!!checked)}
              aria-label="Select all files"
              className="mr-2"
            />
            <span className="text-sm font-medium">
              {selectedFiles.length > 0 ? 
                `${selectedFiles.length} selected` : 
                `${files.length} items`}
            </span>
          </div>
        </div>
        
        {/* Grid view */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div 
              key={file.id}
              className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              {/* File preview/thumbnail */}
              <div 
                className="h-32 bg-muted flex items-center justify-center cursor-pointer relative"
                onClick={() => onFileClick(file.id)}
              >
                {file.type === 'image' && file.thumbnailUrl ? (
                  <div 
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
                  />
                ) : (
                  getFileIcon(file.type, file.extension)
                )}
                
                {/* Selection checkbox overlay */}
                <div 
                  className="absolute top-2 left-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(file.id, !selectedFiles.includes(file.id));
                  }}
                >
                  <Checkbox 
                    checked={selectedFiles.includes(file.id)}
                    aria-label={`Select ${file.name}`}
                  />
                </div>
                
                {file.status && (
                  <Badge 
                    variant="outline" 
                    className={`absolute bottom-2 right-2 ${
                      file.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      file.status === 'review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      file.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {file.status === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                  </Badge>
                )}
              </div>
              
              {/* File info */}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-grow min-w-0">
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.size} • {formatDate(file.updatedAt)}
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onFileAction('download', file.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFileAction('rename', file.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onFileAction('share', file.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onFileAction('delete', file.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6">
                          {file.uploadedBy.avatarUrl ? (
                            <AvatarImage src={file.uploadedBy.avatarUrl} alt={file.uploadedBy.name} />
                          ) : (
                            <AvatarFallback>{file.uploadedBy.name.substring(0, 2)}</AvatarFallback>
                          )}
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Uploaded by {file.uploadedBy.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button variant="ghost" size="sm" className="h-7" onClick={() => onFileAction('preview', file.id)}>
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // List view
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 bg-muted p-3 text-xs font-medium text-muted-foreground">
        <div className="col-span-1 flex items-center">
          <Checkbox 
            checked={allSelected} 
            indeterminate={someSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            aria-label="Select all files"
            className="mr-2"
          />
        </div>
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Modified</div>
        <div className="col-span-1 text-right">Size</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-1 text-right"></div>
      </div>
      
      {/* Table body */}
      <div className="divide-y">
        {files.map((file) => (
          <div 
            key={file.id} 
            className={`grid grid-cols-12 gap-2 p-3 hover:bg-muted/50 items-center ${
              selectedFiles.includes(file.id) ? 'bg-muted/80' : ''
            }`}
          >
            <div className="col-span-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={(checked) => onFileSelect(file.id, !!checked)}
                  aria-label={`Select ${file.name}`}
                  className="mr-2"
                />
              </div>
            </div>
            
            <div className="col-span-5">
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => onFileClick(file.id)}
              >
                <div className="flex-shrink-0">
                  {file.type === 'image' && file.thumbnailUrl ? (
                    <div 
                      className="w-10 h-10 rounded bg-center bg-cover"
                      style={{ backgroundImage: `url(${file.thumbnailUrl})` }}
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center">
                      {getFileIcon(file.type, file.extension)}
                    </div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="uppercase">{file.extension}</span>
                    {file.status && (
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${
                          file.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                          file.status === 'review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          file.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {file.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center text-sm text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
              <span>{formatDate(file.updatedAt)}</span>
            </div>
            
            <div className="col-span-1 text-right text-sm">{file.size}</div>
            
            <div className="col-span-2">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  {file.uploadedBy.avatarUrl ? (
                    <AvatarImage src={file.uploadedBy.avatarUrl} alt={file.uploadedBy.name} />
                  ) : (
                    <AvatarFallback>{file.uploadedBy.name.substring(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm truncate">{file.uploadedBy.name}</span>
              </div>
            </div>
            
            <div className="col-span-1 text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onFileAction('download', file.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('preview', file.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('rename', file.id)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('share', file.id)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onFileAction('delete', file.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
