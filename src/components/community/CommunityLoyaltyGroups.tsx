
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Crown, Gift, UserPlus, Award, Trash2, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type LoyaltyGroup = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  perks: string[];
  challenges: {
    title: string;
    progress: number;
    goal: number;
    unit: string;
  }[];
  tier: "bronze" | "silver" | "gold";
};

const CommunityLoyaltyGroups = () => {
  const [loyaltyGroups, setLoyaltyGroups] = useState<LoyaltyGroup[]>([
    {
      id: "1",
      name: "Coffee Lovers Club",
      description: "For caffeine enthusiasts who never miss their daily cup",
      memberCount: 127,
      perks: ["10% off every purchase", "Free coffee on birthdays", "Early access to new flavors"],
      challenges: [
        {
          title: "Visit 5 times this month",
          progress: 3,
          goal: 5,
          unit: "visits"
        },
        {
          title: "Try 3 different blends",
          progress: 2,
          goal: 3,
          unit: "blends"
        }
      ],
      tier: "gold"
    },
    {
      id: "2",
      name: "Bookworm Society",
      description: "For avid readers and literary enthusiasts",
      memberCount: 89,
      perks: ["15% off hardcovers", "Author meet-and-greet invites", "Monthly book recommendations"],
      challenges: [
        {
          title: "Read 2 books this month",
          progress: 1,
          goal: 2,
          unit: "books"
        }
      ],
      tier: "silver"
    }
  ]);

  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    perks: "",
    tier: "bronze" as "bronze" | "silver" | "gold"
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description || !newGroup.perks) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newLoyaltyGroup: LoyaltyGroup = {
      id: (loyaltyGroups.length + 1).toString(),
      name: newGroup.name,
      description: newGroup.description,
      memberCount: 0,
      perks: newGroup.perks.split(',').map(perk => perk.trim()),
      challenges: [],
      tier: newGroup.tier
    };

    setLoyaltyGroups([...loyaltyGroups, newLoyaltyGroup]);
    setNewGroup({
      name: "",
      description: "",
      perks: "",
      tier: "bronze"
    });
    setDialogOpen(false);

    toast({
      title: "Loyalty group created!",
      description: "Your new loyalty group has been created successfully",
    });
  };

  const deleteGroup = (id: string) => {
    setLoyaltyGroups(loyaltyGroups.filter(group => group.id !== id));
    toast({
      title: "Loyalty group deleted",
      description: "The loyalty group has been removed",
    });
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "gold":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "silver":
        return <Award className="h-4 w-4 text-gray-400" />;
      default:
        return <Award className="h-4 w-4 text-amber-700" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "gold":
        return "text-yellow-500 bg-yellow-50";
      case "silver":
        return "text-gray-500 bg-gray-50";
      default:
        return "text-amber-700 bg-amber-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Loyalty Groups</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Create Loyalty Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Loyalty Group</DialogTitle>
              <DialogDescription>
                Create a new loyalty group for your customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="group-name">Group Name</label>
                <Input 
                  id="group-name" 
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="e.g. Coffee Lovers Club"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Input 
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  placeholder="Describe your loyalty group"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="perks">Perks (comma-separated)</label>
                <Input 
                  id="perks"
                  value={newGroup.perks}
                  onChange={(e) => setNewGroup({...newGroup, perks: e.target.value})}
                  placeholder="e.g. 10% off every purchase, Free coffee on birthdays"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="tier">Tier</label>
                <select 
                  id="tier" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newGroup.tier}
                  onChange={(e) => setNewGroup({...newGroup, tier: e.target.value as "bronze" | "silver" | "gold"})}
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loyaltyGroups.map((group) => (
          <Card key={group.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge className={`ml-2 ${getTierColor(group.tier)}`} variant="outline">
                    <span className="flex items-center">
                      {getTierIcon(group.tier)}
                      <span className="ml-1 capitalize">{group.tier}</span>
                    </span>
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteGroup(group.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2" />
                <span>{group.memberCount} members</span>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Member Perks:</h4>
                <ul className="space-y-1">
                  {group.perks.map((perk, index) => (
                    <li key={index} className="text-sm flex items-center">
                      <Gift className="h-3.5 w-3.5 mr-1.5 text-primary" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
              
              {group.challenges.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Challenges:</h4>
                  <div className="space-y-3">
                    {group.challenges.map((challenge, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center">
                            <ClipboardCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
                            {challenge.title}
                          </span>
                          <span>{challenge.progress} / {challenge.goal} {challenge.unit}</span>
                        </div>
                        <Progress value={(challenge.progress / challenge.goal) * 100} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
              <Button>
                Create Challenge
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityLoyaltyGroups;
