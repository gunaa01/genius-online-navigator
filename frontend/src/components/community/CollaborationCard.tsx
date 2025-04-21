
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { HandshakeIcon, Trash2 } from "lucide-react";

export type Collaboration = {
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

interface CollaborationCardProps {
  collaboration: Collaboration;
  onDelete: (id: string) => void;
}

const CollaborationCard = ({ collaboration, onDelete }: CollaborationCardProps) => {
  return (
    <Card key={collaboration.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-lg">{collaboration.title}</CardTitle>
          <Badge variant={collaboration.status === "active" ? "default" : collaboration.status === "pending" ? "outline" : "secondary"}>
            {collaboration.status === "active" ? "Active" : collaboration.status === "pending" ? "Pending" : "Completed"}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <img src={collaboration.business.logo} alt={collaboration.business.name} />
          </Avatar>
          <span>With {collaboration.business.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{collaboration.description}</p>
        <div className="flex gap-2 mt-3">
          {collaboration.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <HandshakeIcon className="h-4 w-4 mr-2" />
          {collaboration.status === "pending" ? "Accept" : "Manage"}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(collaboration.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CollaborationCard;
