import { useState, useEffect } from 'react';
import { 
  Search, 
  UploadCloud, 
  Grid, 
  List, 
  Filter, 
  SortAsc,
  SortDesc,
  Plus,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import our file management components
import FileList, { ProjectFile, FileType } from './files/FileList';
import FileUploader from './files/FileUploader';
import FileFolderNav, { Folder } from './files/FileFolderNav';

// Mock folders
const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Deliverables',
    path: '/Deliverables',
    fileCount: 8,
    children: [
      {
        id: 'folder-1-1',
        name: 'Wireframes',
        path: '/Deliverables/Wireframes',
        fileCount: 3,
        parentId: 'folder-1'
      },
      {
        id: 'folder-1-2',
        name: 'Mockups',
        path: '/Deliverables/Mockups',
        fileCount: 5,
        parentId: 'folder-1'
      }
    ]
  },
  {
    id: 'folder-2',
    name: 'Documents',
    path: '/Documents',
    fileCount: 5
  },
  {
    id: 'folder-3',
    name: 'Assets',
    path: '/Assets',
    fileCount: 12,
    children: [
      {
        id: 'folder-3-1',
        name: 'Images',
        path: '/Assets/Images',
        fileCount: 8,
        parentId: 'folder-3'
      },
      {
        id: 'folder-3-2',
        name: 'Logos',
        path: '/Assets/Logos',
        fileCount: 4,
        parentId: 'folder-3'
      }
    ]
  },
  {
    id: 'folder-4',
    name: 'Contracts',
    path: '/Contracts',
    fileCount: 2
  }
];

// Mock files
const mockFiles: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'Homepage Wireframe.fig',
    type: 'image' as FileType,
    extension: 'fig',
    size: '2.4 MB',
    sizeInBytes: 2457600,
    createdAt: '2025-03-15T10:30:00Z',
    updatedAt: '2025-03-15T10:30:00Z',
    url: '#',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Homepage+Wireframe',
    uploadedBy: {
      id: 'user-1',
      name: 'John Smith',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    folder: 'folder-1-1',
    permissions: 'view',
    status: 'approved'
  },
  {
    id: 'file-2',
    name: 'Product Page Mockup.png',
    type: 'image' as FileType,
    extension: 'png',
    size: '1.8 MB',
    sizeInBytes: 1887436,
    createdAt: '2025-03-18T14:20:00Z',
    updatedAt: '2025-03-18T14:20:00Z',
    url: '#',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Product+Page',
    uploadedBy: {
      id: 'user-2',
      name: 'Jane Doe',
      avatarUrl: ''
    },
    folder: 'folder-1-2',
    permissions: 'edit',
    status: 'review'
  },
  {
    id: 'file-3',
    name: 'Project Requirements.docx',
    type: 'document' as FileType,
    extension: 'docx',
    size: '245 KB',
    sizeInBytes: 245000,
    createdAt: '2025-03-10T09:15:00Z',
    updatedAt: '2025-03-12T11:45:00Z',
    url: '#',
    uploadedBy: {
      id: 'user-3',
      name: 'Michael Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
    },
    folder: 'folder-2',
    permissions: 'admin',
    status: 'approved'
  },
  {
    id: 'file-4',
    name: 'Logo Assets.zip',
    type: 'archive' as FileType,
    extension: 'zip',
    size: '4.2 MB',
    sizeInBytes: 4404019,
    createdAt: '2025-03-20T16:30:00Z',
    updatedAt: '2025-03-20T16:30:00Z',
    url: '#',
    uploadedBy: {
      id: 'user-1',
      name: 'John Smith',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    folder: 'folder-3-2',
    permissions: 'view'
  },
  {
    id: 'file-5',
    name: 'Project Timeline.xlsx',
    type: 'spreadsheet' as FileType,
    extension: 'xlsx',
    size: '320 KB',
    sizeInBytes: 320000,
    createdAt: '2025-03-14T13:45:00Z',
    updatedAt: '2025-03-21T10:15:00Z',
    url: '#',
    uploadedBy: {
      id: 'user-3',
      name: 'Michael Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
    },
    folder: 'folder-2',
    permissions: 'edit'
  },
  {
    id: 'file-6',
    name: 'Banner Image.jpg',
    type: 'image' as FileType,
    extension: 'jpg',
    size: '1.2 MB',
    sizeInBytes: 1258291,
    createdAt: '2025-03-19T11:20:00Z',
    updatedAt: '2025-03-19T11:20:00Z',
    url: '#',
    thumbnailUrl: 'https://via.placeholder.com/300x100?text=Banner',
    uploadedBy: {
      id: 'user-2',
      name: 'Jane Doe',
      avatarUrl: ''
    },
    folder: 'folder-3-1',
    permissions: 'view'
  }
];

interface ProjectFilesProps {
  projectId: string;
  isFreelancer?: boolean;
}

const ProjectFiles = ({ projectId, isFreelancer = false }: ProjectFilesProps) => {
  // State for files and folders
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles);
  const [folders, setFolders] = useState<Folder[]>(mockFolders);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Fetch files and folders (mock implementation)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // For now, we'll just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, we'd filter files by folder here
        // For now, we'll just use our mock data
        if (selectedFolderId && selectedFolderId !== 'starred' && selectedFolderId !== 'recent' && selectedFolderId !== 'shared') {
          const filteredFiles = mockFiles.filter(file => file.folder === selectedFolderId);
          setFiles(filteredFiles);
        } else if (selectedFolderId === 'starred') {
          const starredFiles = mockFiles.filter(file => file.isStarred);
          setFiles(starredFiles);
        } else if (selectedFolderId === 'recent') {
          // Sort by most recent first
          const recentFiles = [...mockFiles].sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          ).slice(0, 10); // Get 10 most recent
          setFiles(recentFiles);
        } else if (selectedFolderId === 'shared') {
          const sharedFiles = mockFiles.filter(file => file.isShared);
          setFiles(sharedFiles);
        } else {
          setFiles(mockFiles);
        }
      } catch (err) {
        console.error('Error fetching files:', err);
        setError('Failed to load files. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedFolderId, projectId]);
  
  // Filter files by search query
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortBy === 'size') {
      return sortDirection === 'asc'
        ? a.sizeInBytes - b.sizeInBytes
        : b.sizeInBytes - a.sizeInBytes;
    }
    return 0;
  });
  
  // Handle file selection
  const handleFileSelect = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };
  
  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFiles(sortedFiles.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  };
  
  // Handle file action (download, delete, etc.)
  const handleFileAction = (action: string, fileId: string) => {
    // In a real app, these would call API endpoints
    switch (action) {
      case 'download':
        console.log(`Downloading file: ${fileId}`);
        alert(`Downloading file: ${fileId}`);
        break;
      case 'delete':
        console.log(`Deleting file: ${fileId}`);
        setFiles(prev => prev.filter(file => file.id !== fileId));
        setSelectedFiles(prev => prev.filter(id => id !== fileId));
        break;
      case 'rename':
        console.log(`Renaming file: ${fileId}`);
        alert(`Rename file dialog would open here for: ${fileId}`);
        break;
      case 'share':
        console.log(`Sharing file: ${fileId}`);
        alert(`Share dialog would open here for: ${fileId}`);
        break;
      case 'preview':
        console.log(`Previewing file: ${fileId}`);
        alert(`File preview would open here for: ${fileId}`);
        break;
      default:
        console.log(`Action ${action} not implemented for file ${fileId}`);
    }
  };
  
  // Handle file click (open/preview)
  const handleFileClick = (fileId: string) => {
    console.log(`Opening file: ${fileId}`);
    alert(`File preview would open here for: ${fileId}`);
  };
  
  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
    setSelectedFiles([]);
  };
  
  // Handle folder creation
  const handleCreateFolder = (name: string, parentId?: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      path: parentId 
        ? `${folders.find(f => f.id === parentId)?.path || ''}/${name}`
        : `/${name}`,
      fileCount: 0,
      parentId
    };
    
    if (parentId) {
      // Add as child to parent folder
      setFolders(prev => {
        return prev.map(folder => {
          if (folder.id === parentId) {
            return {
              ...folder,
              children: [...(folder.children || []), newFolder]
            };
          }
          return folder;
        });
      });
    } else {
      // Add as root folder
      setFolders(prev => [...prev, newFolder]);
    }
  };
  
  // Handle folder rename
  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(prev => {
      return prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            name: newName
          };
        }
        
        // Check if it's a child folder
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.map(child => {
              if (child.id === folderId) {
                return {
                  ...child,
                  name: newName
                };
              }
              return child;
            })
          };
        }
        
        return folder;
      });
    });
  };
  
  // Handle folder deletion
  const handleDeleteFolder = (folderId: string) => {
    // In a real app, we'd need to check if the folder is empty first
    // For now, we'll just remove it from the list
    setFolders(prev => {
      // Remove from root level
      const filteredFolders = prev.filter(folder => folder.id !== folderId);
      
      // Remove from children if it's a child folder
      return filteredFolders.map(folder => {
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.filter(child => child.id !== folderId)
          };
        }
        return folder;
      });
    });
    
    // If the deleted folder was selected, reset selection
    if (selectedFolderId === folderId) {
      setSelectedFolderId('');
    }
  };
  
  // Handle folder sharing
  const handleShareFolder = (folderId: string) => {
    console.log(`Sharing folder: ${folderId}`);
    alert(`Share dialog would open here for folder: ${folderId}`);
  };
  
  // Handle file upload
  const handleUpload = async (files: File[], folderId: string, description: string) => {
    console.log(`Uploading ${files.length} files to folder ${folderId}`);
    console.log('Description:', description);
    
    // In a real app, this would be an API call to upload the files
    // For now, we'll just simulate a delay and add mock files
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock files from the uploaded files
    const newFiles: ProjectFile[] = files.map(file => {
      const isImage = file.type.startsWith('image/');
      const fileType: FileType = 
        isImage ? 'image' :
        file.type.includes('pdf') || file.type.includes('doc') ? 'document' :
        file.type.includes('spreadsheet') || file.type.includes('excel') ? 'spreadsheet' :
        file.type.includes('zip') || file.type.includes('rar') ? 'archive' :
        file.type.includes('code') || file.name.endsWith('.js') || file.name.endsWith('.html') ? 'code' :
        'other';
      
      return {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: fileType,
        extension: file.name.split('.').pop() || '',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        sizeInBytes: file.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        url: '#',
        thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined,
        uploadedBy: {
          id: 'current-user',
          name: 'Current User',
          avatarUrl: ''
        },
        folder: folderId || '',
        permissions: 'admin',
        status: 'draft'
      };
    });
    
    // Add the new files to the list
    setFiles(prev => [...prev, ...newFiles]);
    
    // Update the file count for the folder
    if (folderId) {
      setFolders(prev => {
        return prev.map(folder => {
          if (folder.id === folderId) {
            return {
              ...folder,
              fileCount: folder.fileCount + newFiles.length
            };
          }
          
          // Check if it's a child folder
          if (folder.children) {
            return {
              ...folder,
              children: folder.children.map(child => {
                if (child.id === folderId) {
                  return {
                    ...child,
                    fileCount: child.fileCount + newFiles.length
                  };
                }
                return child;
              })
            };
          }
          
          return folder;
        });
      });
    }
  };
  
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Sidebar with folders */}
      <div className="col-span-12 md:col-span-3 lg:col-span-2">
        <FileFolderNav
          folders={folders}
          selectedFolderId={selectedFolderId}
          onFolderSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onShareFolder={handleShareFolder}
        />
      </div>
      
      {/* Main content area */}
      <div className="col-span-12 md:col-span-9 lg:col-span-10">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex-grow max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-5" />
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Sort options */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SortAsc className="h-3.5 w-3.5 mr-1" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('name');
                    setSortDirection('asc');
                  }}
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('name');
                    setSortDirection('desc');
                  }}
                >
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('date');
                    setSortDirection('desc');
                  }}
                >
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('date');
                    setSortDirection('asc');
                  }}
                >
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('size');
                    setSortDirection('desc');
                  }}
                >
                  Largest first
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => {
                    setSortBy('size');
                    setSortDirection('asc');
                  }}
                >
                  Smallest first
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Upload button */}
            <Button onClick={() => setShowUploadDialog(true)}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
        
        {/* File list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
            <span className="text-lg">Loading files...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : sortedFiles.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? 
                `No files matching "${searchQuery}"` : 
                selectedFolderId ? 
                  'This folder is empty' : 
                  'Upload files to get started'
              }
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <FileList
            files={sortedFiles}
            viewMode={viewMode}
            selectedFiles={selectedFiles}
            onFileSelect={handleFileSelect}
            onSelectAll={handleSelectAll}
            onFileAction={handleFileAction}
            onFileClick={handleFileClick}
          />
        )}
      </div>
      
      {/* File uploader dialog */}
      <FileUploader
        onUpload={handleUpload}
        folders={folders}
        currentFolderId={selectedFolderId}
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        maxFileSize={50 * 1024 * 1024} // 50 MB
        acceptedFileTypes={[]} // Accept all file types
      />
    </div>
  );
};

export default ProjectFiles;
