
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HandshakeIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface NewCollaborationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCollaboration: (data: { title: string, description: string, businessName: string }) => void;
}

const NewCollaborationDialog = ({ 
  isOpen, 
  onOpenChange, 
  onCreateCollaboration 
}: NewCollaborationDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessName: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCreateCollaboration = () => {
    if (!formData.title || !formData.description || !formData.businessName) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    onCreateCollaboration(formData);
    setFormData({ title: "", description: "", businessName: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <HandshakeIcon className="h-4 w-4 mr-2" />
          New Collaboration
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collaboration</DialogTitle>
          <DialogDescription>
            Partner with local businesses to create promotions, events or bundles.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Collaboration Title</label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Coffee + Books Bundle"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="businessName">Partner Business</label>
            <Input 
              id="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Downtown Books"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Input 
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the collaboration details"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateCollaboration}>Create Collaboration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCollaborationDialog;
