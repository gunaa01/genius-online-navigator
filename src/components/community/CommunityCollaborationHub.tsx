
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import CollaborationCard, { Collaboration } from "./CollaborationCard";
import NewCollaborationDialog from "./NewCollaborationDialog";

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

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateCollaboration = (data: { title: string, description: string, businessName: string }) => {
    const newCollab: Collaboration = {
      id: (collaborations.length + 1).toString(),
      title: data.title,
      description: data.description,
      business: {
        name: data.businessName,
        logo: "/placeholder.svg",
        type: "Local Business"
      },
      status: "pending",
      tags: ["new", "collaboration"]
    };

    setCollaborations([...collaborations, newCollab]);
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
        <NewCollaborationDialog 
          isOpen={dialogOpen} 
          onOpenChange={setDialogOpen}
          onCreateCollaboration={handleCreateCollaboration}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collaborations.map((collab) => (
          <CollaborationCard 
            key={collab.id} 
            collaboration={collab} 
            onDelete={deleteCollaboration}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityCollaborationHub;
