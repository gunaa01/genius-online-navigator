import { useState } from 'react';
import { 
  FolderIcon, 
  FolderPlus, 
  ChevronRight, 
  ChevronDown,
  Folder,
  Star,
  Clock,
  MoreHorizontal,
  Plus,
  FolderPen,
  Trash2,
  Share2
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
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

// Folder interface
export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  path: string;
  fileCount: number;
  children?: Folder[];
  isStarred?: boolean;
  isShared?: boolean;
  createdBy?: {
    id: string;
    name: string;
  };
}

interface FileFolderNavProps {
  folders: Folder[];
  selectedFolderId: string;
  onFolderSelect: (folderId: string) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onShareFolder: (folderId: string) => void;
}

const FileFolderNav = ({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onShareFolder
}: FileFolderNavProps) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showRenameFolderDialog, setShowRenameFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string | undefined>(undefined);
  const [folderToEdit, setFolderToEdit] = useState<string | undefined>(undefined);
  
  // Toggle folder expansion
  const toggleFolderExpansion = (folderId: string) => {
    setExpandedFolders(prev => {
      if (prev.includes(folderId)) {
        return prev.filter(id => id !== folderId);
      } else {
        return [...prev, folderId];
      }
    });
  };
  
  // Open new folder dialog
  const handleNewFolderClick = (parentId?: string) => {
    setParentFolderId(parentId);
    setNewFolderName('');
    setShowNewFolderDialog(true);
  };
  
  // Handle rename folder click
  const handleRenameFolderClick = (folderId: string, currentName: string) => {
    setFolderToEdit(folderId);
    setNewFolderName(currentName);
    setShowRenameFolderDialog(true);
  };
  
  // Create new folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), parentFolderId);
      setShowNewFolderDialog(false);
      setNewFolderName('');
    }
  };
  
  // Rename folder
  const handleRenameFolder = () => {
    if (folderToEdit && newFolderName.trim()) {
      onRenameFolder(folderToEdit, newFolderName.trim());
      setShowRenameFolderDialog(false);
      setNewFolderName('');
      setFolderToEdit(undefined);
    }
  };
  
  // Flatten folder structure for rendering
  const flattenFolders = (folders: Folder[], level = 0): (Folder & { level: number })[] => {
    return folders.reduce<(Folder & { level: number })[]>((acc, folder) => {
      const flatFolder = { ...folder, level };
      acc.push(flatFolder);
      
      if (folder.children && expandedFolders.includes(folder.id)) {
        acc.push(...flattenFolders(folder.children, level + 1));
      }
      
      return acc;
    }, []);
  };
  
  // Get root folders and their children
  const rootFolders = folders.filter(folder => !folder.parentId);
  const flatFolders = flattenFolders(rootFolders);
  
  // Find folder by ID
  const findFolder = (id: string) => folders.find(folder => folder.id === id);
  const selectedFolder = findFolder(selectedFolderId);
  
  return (
    <div className="space-y-4">
      {/* Header with new folder button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Folders</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleNewFolderClick()}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>
      
      {/* Quick filters */}
      <div className="space-y-1">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-sm",
            !selectedFolderId && "bg-muted"
          )}
          onClick={() => onFolderSelect('')}
        >
          <FolderIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          All Files
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm"
          onClick={() => onFolderSelect('starred')}
        >
          <Star className="h-4 w-4 mr-2 text-amber-500" />
          Starred
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm"
          onClick={() => onFolderSelect('recent')}
        >
          <Clock className="h-4 w-4 mr-2 text-blue-500" />
          Recent
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm"
          onClick={() => onFolderSelect('shared')}
        >
          <Share2 className="h-4 w-4 mr-2 text-green-500" />
          Shared
        </Button>
      </div>
      
      {/* Folder tree */}
      <div className="space-y-1">
        {flatFolders.map((folder) => (
          <div 
            key={folder.id}
            className={cn(
              "flex items-center",
              folder.level > 0 && `pl-${folder.level * 4}`
            )}
            style={{ paddingLeft: folder.level * 16 }}
          >
            <Button 
              variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-sm h-9",
              )}
              onClick={() => onFolderSelect(folder.id)}
            >
              <div 
                className="mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolderExpansion(folder.id);
                }}
              >
                {(folder.children?.length || 0) > 0 ? (
                  expandedFolders.includes(folder.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )
                ) : (
                  <div className="w-4" />
                )}
              </div>
              
              <Folder className={cn(
                "h-4 w-4 mr-2",
                folder.isStarred ? "text-amber-500" : "text-blue-500"
              )} />
              
              <span className="truncate flex-grow">{folder.name}</span>
              
              {folder.fileCount > 0 && (
                <span className="text-xs text-muted-foreground ml-2">
                  {folder.fileCount}
                </span>
              )}
            </Button>
            
            {/* Folder actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleNewFolderClick(folder.id)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Subfolder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRenameFolderClick(folder.id, folder.name)}>
                  <FolderPen className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShareFolder(folder.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDeleteFolder(folder.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        
        {flatFolders.length === 0 && (
          <div className="text-center py-8">
            <FolderIcon className="h-10 w-10 mx-auto text-muted-foreground/60 mb-3" />
            <h3 className="text-sm font-medium mb-1">No folders yet</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Create folders to organize your files
            </p>
          </div>
        )}
      </div>
      
      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Create new folder</DialogTitle>
            <DialogDescription>
              {parentFolderId ? 
                `Create a new subfolder in ${findFolder(parentFolderId)?.name}` : 
                'Create a new folder to organize your files'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Rename Folder Dialog */}
      <Dialog open={showRenameFolderDialog} onOpenChange={setShowRenameFolderDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Rename folder</DialogTitle>
            <DialogDescription>
              Choose a new name for this folder
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder name</Label>
              <Input
                id="folderName"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameFolder} disabled={!newFolderName.trim()}>
              Rename Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileFolderNav;
