
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store, Users, Rocket, Download, Play, Calendar, Link, Copy, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CommunityGTM = () => {
  const [activeTab, setActiveTab] = useState("business");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const businessCampaigns = [
    {
      id: "1",
      title: "Turn Your Customers into a Community",
      type: "Webinar",
      date: "June 15, 2025",
      description: "Learn how to transform one-time buyers into loyal community members who drive repeat business.",
      status: "Scheduled",
      resources: [
        { name: "Slide Deck", url: "#" },
        { name: "Email Template", url: "#" }
      ]
    },
    {
      id: "2",
      title: "Community-Driven Growth Case Study",
      type: "Case Study",
      date: "Available Now",
      description: "How Local Gym 'FitLife' Grew Membership by 25% with Member Challenges",
      status: "Published",
      resources: [
        { name: "PDF Download", url: "#" },
        { name: "Social Graphics", url: "#" }
      ]
    },
    {
      id: "3",
      title: "Cross-Promotion Workshop",
      type: "In-Person",
      date: "July 8, 2025",
      description: "Hands-on session for businesses to create effective partnership campaigns.",
      status: "Planning",
      resources: [
        { name: "Workshop Guide", url: "#" }
      ]
    }
  ];

  const customerCampaigns = [
    {
      id: "4",
      title: "Downtown Insiders Club",
      type: "Loyalty Program",
      date: "Launching May 30",
      description: "Exclusive rewards and early access to events for members who shop at multiple downtown businesses.",
      status: "Preparing",
      resources: [
        { name: "SMS Template", url: "#" },
        { name: "Graphics Pack", url: "#" }
      ]
    },
    {
      id: "5",
      title: "Local Heroes Photo Contest",
      type: "UGC Campaign",
      date: "July 1-15, 2025",
      description: "Customers share photos supporting local businesses to win gift cards and experiences.",
      status: "Planning",
      resources: [
        { name: "Contest Rules", url: "#" },
        { name: "Social Toolkit", url: "#" }
      ]
    }
  ];

  const incentivePrograms = [
    {
      id: "6",
      title: "First Event Free",
      audience: "Businesses",
      description: "Free month of Enterprise tier for hosting a community event within 30 days of signup.",
      code: "FIRSTEVENT",
      claimUrl: "https://genius.com/promo/firstevent"
    },
    {
      id: "7",
      title: "Early Bird Bonus",
      audience: "Customers",
      description: "Double loyalty points for customers who join community groups in the first week.",
      code: "EARLYBIRD",
      claimUrl: "https://genius.com/promo/earlybird"
    },
    {
      id: "8",
      title: "Referral Reward",
      audience: "Both",
      description: "Businesses get $50 credit when referring another business that joins the platform.",
      code: "REFER50",
      claimUrl: "https://genius.com/promo/refer50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Community Go-to-Market Tools</h2>
        <Button>
          <Rocket className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="business">
            <Store className="h-4 w-4 mr-2" />
            Business Campaigns
          </TabsTrigger>
          <TabsTrigger value="customer">
            <Users className="h-4 w-4 mr-2" />
            Customer Campaigns
          </TabsTrigger>
          <TabsTrigger value="incentives">
            <Rocket className="h-4 w-4 mr-2" />
            Adoption Incentives
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">{campaign.type}</Badge>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{campaign.date}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={
                      campaign.status === "Published" ? "default" :
                      campaign.status === "Scheduled" ? "secondary" : "outline"
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{campaign.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Campaign Resources</h4>
                    <div className="space-y-2">
                      {campaign.resources.map((resource, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center">
                            <Link className="h-4 w-4 mr-2" />
                            <span className="text-sm">{resource.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-3">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm">Use Campaign</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customer" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">{campaign.type}</Badge>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{campaign.date}</span>
                      </CardDescription>
                    </div>
                    <Badge variant={
                      campaign.status === "Published" ? "default" :
                      campaign.status === "Preparing" ? "secondary" : "outline"
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{campaign.description}</p>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Campaign Resources</h4>
                    <div className="space-y-2">
                      {campaign.resources.map((resource, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center">
                            <Link className="h-4 w-4 mr-2" />
                            <span className="text-sm">{resource.name}</span>
                          </div>
                          <Button variant="ghost" size="sm">Download</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-3">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm">Use Campaign</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="incentives" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {incentivePrograms.map((program) => (
              <Card key={program.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{program.title}</CardTitle>
                    <Badge variant={
                      program.audience === "Businesses" ? "default" :
                      program.audience === "Customers" ? "secondary" : "outline"
                    }>
                      {program.audience}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{program.description}</p>
                  
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Promo code</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(program.code, `code-${program.id}`)}
                        className="h-6 px-2"
                      >
                        {copiedId === `code-${program.id}` ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <div className="text-base font-mono mt-1">{program.code}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/30 px-6 py-3">
                  <Button 
                    className="w-full"
                    onClick={() => copyToClipboard(program.claimUrl, `url-${program.id}`)}
                  >
                    {copiedId === `url-${program.id}` ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Copy Claim URL
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Custom Incentive Program</CardTitle>
              <CardDescription>Create a new incentive program for your community</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Incentive Title</label>
                    <Input id="title" placeholder="e.g. Summer Sign-up Bonus" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="audience" className="text-sm font-medium">Target Audience</label>
                    <select id="audience" className="w-full h-10 px-3 py-2 border border-input rounded-md bg-background">
                      <option value="businesses">Businesses</option>
                      <option value="customers">Customers</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea id="description" placeholder="Describe what users will get from this incentive" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">Promo Code</label>
                    <Input id="code" placeholder="e.g. SUMMER25" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="expiry" className="text-sm font-medium">Expiration Date</label>
                    <Input id="expiry" type="date" />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Incentive</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Example Workflows</CardTitle>
          <CardDescription>See how businesses are using community features successfully</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-4 relative">
              <div className="flex items-start gap-4">
                <div className="min-w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium">1</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Create a Loyalty Group</h3>
                  <p className="text-sm">Boutique creates "Style Squad" loyalty group with special perks</p>
                </div>
              </div>
              <div className="absolute left-5 top-14 bottom-0 w-px bg-border"></div>
            </div>

            <div className="bg-muted rounded-lg p-4 relative">
              <div className="flex items-start gap-4">
                <div className="min-w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium">2</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Enable Member Rewards</h3>
                  <p className="text-sm">Members get early access to sales and post outfit photos</p>
                </div>
              </div>
              <div className="absolute left-5 top-14 bottom-0 w-px bg-border"></div>
            </div>

            <div className="bg-muted rounded-lg p-4 relative">
              <div className="flex items-start gap-4">
                <div className="min-w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium">3</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Partner with Local Business</h3>
                  <p className="text-sm">Boutique partners with nearby salon for "Glow-Up Weekend" event</p>
                </div>
              </div>
              <div className="absolute left-5 top-14 bottom-0 w-px bg-border"></div>
            </div>

            <div className="bg-muted rounded-lg p-4 relative">
              <div className="flex items-start gap-4">
                <div className="min-w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium">4</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Auto-promote on Maps & Social</h3>
                  <p className="text-sm">Platform automatically promotes event on Google Maps and tracks sales</p>
                </div>
              </div>
              <div className="absolute left-5 top-14 bottom-0 w-px bg-border"></div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="min-w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-medium">5</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">Measure Impact</h3>
                  <p className="text-sm">Post-event analytics show 15% rise in repeat customers</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Play className="h-4 w-4 mr-2" />
            Watch Demo of Workflow
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunityGTM;
