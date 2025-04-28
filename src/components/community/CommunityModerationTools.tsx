
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Flag, MessageSquare, Image, Shield, CheckCircle, XCircle, BarChart, AlertCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommunityModerationTools = () => {
  const [selectedTab, setSelectedTab] = useState("flagged");
  const [automatedRules, setAutomatedRules] = useState({
    profanityFilter: true,
    spamDetection: true,
    imageModeration: true,
    contentApproval: false,
    userLimits: true
  });

  const handleRuleToggle = (rule: keyof typeof automatedRules) => {
    setAutomatedRules({
      ...automatedRules,
      [rule]: !automatedRules[rule]
    });
    toast({
      title: `Rule ${automatedRules[rule] ? "disabled" : "enabled"}`,
      description: `${rule} has been ${automatedRules[rule] ? "disabled" : "enabled"} successfully.`,
    });
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Content approved",
      description: "The content has been approved and is now visible to users.",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Content rejected",
      description: "The content has been rejected and removed from the community.",
    });
  };

  const flaggedContent = [
    {
      id: "1",
      type: "comment",
      content: "This local restaurant is terrible. The food was cold and service was awful!",
      reportedBy: "Mark Wilson",
      reportedAt: "2 hours ago",
      reason: "Negative content",
      status: "pending"
    },
    {
      id: "2",
      type: "photo",
      content: "inappropriate_image.jpg",
      reportedBy: "Sarah Johnson",
      reportedAt: "5 hours ago",
      reason: "Inappropriate content",
      status: "pending"
    },
    {
      id: "3",
      type: "post",
      content: "Check out these deals from our competitors! They're much better than what you'll find locally!",
      reportedBy: "Chris Lee",
      reportedAt: "1 day ago",
      reason: "Spam/Advertising",
      status: "reviewed"
    }
  ];

  const moderationStats = [
    { label: "Flagged Content", value: 12, change: "+3", period: "this week" },
    { label: "Approval Rate", value: "84%", change: "+2%", period: "vs last month" },
    { label: "Avg Response", value: "4.2h", change: "-0.5h", period: "vs last month" },
    { label: "Active Moderators", value: 3, change: "+1", period: "this month" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Community Moderation</h2>
        <div className="flex gap-2">
          <Select defaultValue="medium">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Moderation Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Basic Rules</SelectItem>
              <SelectItem value="medium">Medium - Standard</SelectItem>
              <SelectItem value="high">High - Strict</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Moderation Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {moderationStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-sm text-green-500">
                  {stat.change}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.period}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList>
          <TabsTrigger value="flagged">
            <Flag className="h-4 w-4 mr-2" />
            Flagged Content ({flaggedContent.filter(c => c.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="automated">
            <Settings className="h-4 w-4 mr-2" />
            Automated Rules
          </TabsTrigger>
          <TabsTrigger value="banned">
            <AlertCircle className="h-4 w-4 mr-2" />
            Banned Words & Phrases
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flagged" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content Review</CardTitle>
              <CardDescription>
                Review content that has been flagged by users or automated systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedContent.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        {item.type === "comment" && <MessageSquare className="h-4 w-4" />}
                        {item.type === "photo" && <Image className="h-4 w-4" />}
                        {item.type === "post" && <MessageSquare className="h-4 w-4" />}
                        <span className="font-medium capitalize">{item.type}</span>
                        <Badge variant={item.status === "pending" ? "outline" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <Badge variant="destructive">{item.reason}</Badge>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md my-2 text-sm">
                      {item.content}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6 mr-2">
                          <div className="bg-primary/10 w-full h-full flex items-center justify-center">
                            <User className="h-3 w-3" />
                          </div>
                        </Avatar>
                        Reported by {item.reportedBy} • {item.reportedAt}
                      </div>
                      
                      {item.status === "pending" && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleReject(item.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleApprove(item.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 bg-muted/30">
              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Showing 3 of 12 flagged items</span>
                <Button variant="outline">View All</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="automated" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Moderation Rules</CardTitle>
              <CardDescription>
                Configure AI-powered moderation tools to automatically monitor content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Profanity Filter</h3>
                    <p className="text-sm text-muted-foreground">Automatically detect and filter offensive language</p>
                  </div>
                  <Switch 
                    checked={automatedRules.profanityFilter}
                    onCheckedChange={() => handleRuleToggle('profanityFilter')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Spam Detection</h3>
                    <p className="text-sm text-muted-foreground">Flag content that appears to be spam or excessive promotion</p>
                  </div>
                  <Switch 
                    checked={automatedRules.spamDetection}
                    onCheckedChange={() => handleRuleToggle('spamDetection')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Image Moderation</h3>
                    <p className="text-sm text-muted-foreground">AI scan of images for inappropriate content</p>
                  </div>
                  <Switch 
                    checked={automatedRules.imageModeration}
                    onCheckedChange={() => handleRuleToggle('imageModeration')}
                  />
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Pre-approval Required</h3>
                    <p className="text-sm text-muted-foreground">All content requires moderator approval before publishing</p>
                  </div>
                  <Switch 
                    checked={automatedRules.contentApproval}
                    onCheckedChange={() => handleRuleToggle('contentApproval')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">User Rate Limits</h3>
                    <p className="text-sm text-muted-foreground">Limit number of posts per user to prevent flooding</p>
                  </div>
                  <Switch 
                    checked={automatedRules.userLimits}
                    onCheckedChange={() => handleRuleToggle('userLimits')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4">
              <Button className="w-full">Save Moderation Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="banned" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Banned Words & Phrases</CardTitle>
              <CardDescription>
                Configure words and phrases that will be automatically blocked
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Add word or phrase to ban" className="flex-1" />
                  <Button>Add</Button>
                </div>
                
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-muted/40">
                    <h3 className="font-medium">Currently Banned</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {['competitor names', 'offensive terms', 'spam phrases', 'scam keywords'].map((term) => (
                        <div key={term} className="flex items-center bg-secondary px-3 py-1 rounded-full">
                          <span className="text-sm">{term}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4">
                      The default banned word list contains common offensive terms and is updated automatically.
                      The words above are additional terms you've added specific to your community.
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Moderation Strategy</h3>
                  </div>
                  <p className="text-sm mt-2">
                    For offline businesses, we recommend focusing on preventing spam and competitor advertising
                    rather than implementing strict content moderation. This balances community growth with
                    maintaining a positive atmosphere.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Import Words from Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Risks & Mitigation</CardTitle>
          <CardDescription>How to handle common community challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Low Engagement</h3>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Risk:</p>
                  <p className="mb-2">Community feels empty and inactive</p>
                  
                  <p className="text-muted-foreground">Mitigation:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Start small with neighborhood-level communities</li>
                    <li>Pre-seed content like Local Heroes contest</li>
                    <li>Incentivize early participation</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Moderation Overhead</h3>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Risk:</p>
                  <p className="mb-2">Too much time spent on content moderation</p>
                  
                  <p className="text-muted-foreground">Mitigation:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Use AI to flag spam content automatically</li>
                    <li>Hire part-time community managers</li>
                    <li>Create clear community guidelines</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Feature Bloat</h3>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">Risk:</p>
                  <p className="mb-2">Platform becomes too complex for users</p>
                  
                  <p className="text-muted-foreground">Mitigation:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Keep community section optional</li>
                    <li>Focus on core features that drive engagement</li>
                    <li>Provide clear onboarding for new features</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline">Download Community Playbook</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CommunityModerationTools;
