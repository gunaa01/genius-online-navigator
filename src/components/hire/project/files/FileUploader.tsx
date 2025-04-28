import { useState, useRef } from 'react';
import { 
  UploadCloud, 
  X, 
  FilePlus, 
  Loader2, 
  FileIcon,
  FileTextIcon,
  FileImageIcon,
  CheckCircle2,
  AlertCircle,
  Clipboard
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
}

interface FileUploaderProps {
  onUpload: (files: File[], folderId: string, description: string) => Promise<void>;
  folders: { id: string; name: string }[];
  currentFolderId: string;
  isOpen: boolean;
  onClose: () => void;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[]; // e.g., ['image/png', 'image/jpeg']
}

const FileUploader = ({
  onUpload,
  folders,
  currentFolderId,
  isOpen,
  onClose,
  maxFileSize = 50 * 1024 * 1024, // 50 MB default
  acceptedFileTypes = []
}: FileUploaderProps) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(currentFolderId);
  const [errors, setErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Process files from drop or file input
  const processFiles = (files: FileList) => {
    const newErrors: string[] = [];
    const validFiles: UploadingFile[] = [];
    
    // Check each file
    Array.from(files).forEach(file => {
      // Check file type if required
      if (acceptedFileTypes.length > 0 && !acceptedFileTypes.includes(file.type)) {
        newErrors.push(`"${file.name}" has an unsupported file type.`);
        return;
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        const maxSizeMB = maxFileSize / (1024 * 1024);
        newErrors.push(`"${file.name}" exceeds the maximum file size of ${maxSizeMB} MB.`);
        return;
      }
      
      // Create preview for images
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      validFiles.push({
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: 'uploading',
        preview
      });
    });
    
    setErrors(newErrors);
    
    if (validFiles.length > 0) {
      setUploadingFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  
  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };
  
  // Remove a file from the upload list
  const handleRemoveFile = (fileId: string) => {
    setUploadingFiles(prev => {
      const updatedFiles = prev.filter(f => f.id !== fileId);
      return updatedFiles;
    });
  };
  
  // Simulate upload progress
  const simulateProgress = () => {
    const interval = setInterval(() => {
      setUploadingFiles(prev => {
        const updatedFiles = prev.map(file => {
          if (file.status === 'uploading') {
            const newProgress = Math.min(file.progress + Math.random() * 20, 99);
            return { ...file, progress: newProgress };
          }
          return file;
        });
        
        // If all files are at 99%, we're ready for completion
        const allNearlyDone = updatedFiles.every(f => f.status !== 'uploading' || f.progress >= 99);
        if (allNearlyDone) {
          clearInterval(interval);
        }
        
        return updatedFiles;
      });
    }, 500);
    
    return interval;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (uploadingFiles.length === 0) return;
    
    setIsUploading(true);
    const progressInterval = simulateProgress();
    
    try {
      // Extract the actual File objects
      const files = uploadingFiles.map(f => f.file);
      
      // Call the upload function provided by parent
      await onUpload(files, selectedFolderId, description);
      
      // Update all files to success
      setUploadingFiles(prev => 
        prev.map(file => ({ ...file, status: 'success', progress: 100 }))
      );
      
      // Wait a moment to show success state
      setTimeout(() => {
        onClose();
        // Reset state after dialog closes
        setUploadingFiles([]);
        setDescription('');
        setErrors([]);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      // Handle errors
      setUploadingFiles(prev => 
        prev.map(file => ({ 
          ...file, 
          status: 'error', 
          error: 'Upload failed. Please try again.'
        }))
      );
      
      setErrors([...(error instanceof Error ? [error.message] : ['Upload failed. Please try again.'])]);
      setIsUploading(false);
    } finally {
      clearInterval(progressInterval);
    }
  };
  
  // Get appropriate icon for file
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImageIcon className="h-6 w-6 text-blue-500" />;
    } else if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileTextIcon className="h-6 w-6 text-amber-500" />;
    }
    return <FileIcon className="h-6 w-6 text-slate-500" />;
  };
  
  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to your project. Drag and drop or select files from your computer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drop zone */}
          <div 
            className={`border-2 border-dashed rounded-lg ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            } transition-colors flex flex-col items-center justify-center p-8 cursor-pointer relative`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud 
              className={`h-12 w-12 mb-4 ${
                isDragging ? 'text-primary' : 'text-muted-foreground'
              }`} 
            />
            <p className="text-sm font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop your files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <Button 
              type="button" 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              accept={acceptedFileTypes.join(',')}
            />
          </div>
          
          {/* File selection info */}
          {acceptedFileTypes.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Accepted file types: {acceptedFileTypes.map(type => type.replace('image/', '.')).join(', ')}
            </p>
          )}
          
          {/* Error messages */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {/* File list */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
                  {/* File preview or icon */}
                  <div className="w-10 h-10 flex-shrink-0 rounded bg-white flex items-center justify-center overflow-hidden">
                    {file.preview ? (
                      <img src={file.preview} alt={file.file.name} className="w-full h-full object-cover" />
                    ) : (
                      getFileIcon(file.file)
                    )}
                  </div>
                  
                  {/* File info and progress */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate" title={file.file.name}>
                          {file.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>
                      
                      {/* Status indicator */}
                      {file.status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : file.status === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Progress bar */}
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.progress} className="h-1" />
                      </div>
                    )}
                    
                    {/* Error message */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-destructive mt-1">{file.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Folder selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Save to folder</Label>
            <Select
              value={selectedFolderId}
              onValueChange={setSelectedFolderId}
              disabled={isUploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders.map(folder => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Description field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description"
              placeholder="Add a description for these files..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              disabled={isUploading}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={uploadingFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                Upload {uploadingFiles.length > 0 ? `${uploadingFiles.length} ${uploadingFiles.length === 1 ? 'File' : 'Files'}` : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
