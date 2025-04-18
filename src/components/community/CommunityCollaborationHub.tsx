
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HandshakeIcon, Coffee, BookOpen, Store, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Collaboration = {
  id: string;
  title: string;
  description: string;
  business: {
    name: string;
    logo: string;
    type: string;
  };
  status: "pending" | "active" | "completed";
  tags: string[];
};

const CommunityCollaborationHub = () => {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([
    {
      id: "1",
      title: "Coffee + Books Bundle",
      description: "10% off when customers show receipt from our store at Downtown Books",
      business: {
        name: "Downtown Books",
        logo: "/placeholder.svg",
        type: "Bookstore"
      },
      status: "active",
      tags: ["discount", "bundle", "books"]
    },
    {
      id: "2",
      title: "Summer Festival Joint Booth",
      description: "Share a booth with Organic Grocery for the Downtown Summer Festival",
      business: {
        name: "Organic Grocery",
        logo: "/placeholder.svg",
        type: "Grocery Store"
      },
      status: "pending",
      tags: ["event", "festival", "booth"]
    }
  ]);

  const [newCollaboration, setNewCollaboration] = useState({
    title: "",
    description: "",
    businessName: ""
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateCollaboration = () => {
    if (!newCollaboration.title || !newCollaboration.description || !newCollaboration.businessName) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newCollab: Collaboration = {
      id: (collaborations.length + 1).toString(),
      title: newCollaboration.title,
      description: newCollaboration.description,
      business: {
        name: newCollaboration.businessName,
        logo: "/placeholder.svg",
        type: "Local Business"
      },
      status: "pending",
      tags: ["new", "collaboration"]
    };

    setCollaborations([...collaborations, newCollab]);
    setNewCollaboration({ title: "", description: "", businessName: "" });
    setDialogOpen(false);

    toast({
      title: "Collaboration created!",
      description: "Your new collaboration has been created successfully",
    });
  };

  const deleteCollaboration = (id: string) => {
    setCollaborations(collaborations.filter(collab => collab.id !== id));
    toast({
      title: "Collaboration deleted",
      description: "The collaboration has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Collaborations</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  value={newCollaboration.title}
                  onChange={(e) => setNewCollaboration({...newCollaboration, title: e.target.value})}
                  placeholder="e.g. Coffee + Books Bundle"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="business">Partner Business</label>
                <Input 
                  id="business"
                  value={newCollaboration.businessName}
                  onChange={(e) => setNewCollaboration({...newCollaboration, businessName: e.target.value})}
                  placeholder="e.g. Downtown Books"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Input 
                  id="description"
                  value={newCollaboration.description}
                  onChange={(e) => setNewCollaboration({...newCollaboration, description: e.target.value})}
                  placeholder="Describe the collaboration details"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCollaboration}>Create Collaboration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((collab) => (
          <Card key={collab.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{collab.title}</CardTitle>
                <Badge variant={collab.status === "active" ? "default" : collab.status === "pending" ? "outline" : "secondary"}>
                  {collab.status === "active" ? "Active" : collab.status === "pending" ? "Pending" : "Completed"}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <img src={collab.business.logo} alt={collab.business.name} />
                </Avatar>
                <span>With {collab.business.name}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{collab.description}</p>
              <div className="flex gap-2 mt-3">
                {collab.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <HandshakeIcon className="h-4 w-4 mr-2" />
                {collab.status === "pending" ? "Accept" : "Manage"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteCollaboration(collab.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityCollaborationHub;
