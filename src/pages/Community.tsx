import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users, Store, Calendar, MessageSquare, BarChart, Rocket, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import CommunityCollaborationHub from "@/components/community/CommunityCollaborationHub";
import CommunityEvents from "@/components/community/CommunityEvents";
import CommunityDirectory from "@/components/community/CommunityDirectory";
import CommunityLoyaltyGroups from "@/components/community/CommunityLoyaltyGroups";
import CommunityMetrics from "@/components/community/CommunityMetrics";
import CommunityModerationTools from "@/components/community/CommunityModerationTools";
import CommunityGTM from "@/components/community/CommunityGTM";

const Community = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Community Hub</h1>
            <p className="text-muted-foreground">Connect with local businesses and customers to grow together</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search communities..." 
                className="pl-9 w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>
        </header>

        <Tabs defaultValue="collaboration" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-transparent">
            <TabsTrigger value="collaboration" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Store className="h-4 w-4 mr-2" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="directory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="h-4 w-4 mr-2" />
              Loyalty
            </TabsTrigger>
            <TabsTrigger value="metrics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="gtm" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Rocket className="h-4 w-4 mr-2" />
              Go-To-Market
            </TabsTrigger>
            <TabsTrigger value="moderation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Community
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="collaboration">
              <CommunityCollaborationHub />
            </TabsContent>
            
            <TabsContent value="directory">
              <CommunityDirectory searchQuery={searchQuery} />
            </TabsContent>
            
            <TabsContent value="events">
              <CommunityEvents />
            </TabsContent>
            
            <TabsContent value="loyalty">
              <CommunityLoyaltyGroups />
            </TabsContent>

            <TabsContent value="metrics">
              <CommunityMetrics />
            </TabsContent>

            <TabsContent value="gtm">
              <CommunityGTM />
            </TabsContent>

            <TabsContent value="moderation">
              <CommunityModerationTools />
            </TabsContent>

            <TabsContent value="community">
              <main className="container mx-auto px-4 py-16 min-h-screen text-foreground">
                <h1 className="text-4xl font-bold mb-6">Community</h1>
                <p className="mb-8 text-lg">Join the Genius community to connect, share, and grow together. Discover forums, events, and more.</p>
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-2">Forums & Groups</h2>
                  <p>Ask questions, share tips, and collaborate with other users in our discussion forums (coming soon!).</p>
                </section>
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-2">Events</h2>
                  <ul className="list-disc ml-6 text-lg">
                    <li>Monthly webinars on business growth</li>
                    <li>Live Q&A with the Genius team</li>
                    <li>Community meetups (virtual & in-person)</li>
                  </ul>
                </section>
                <section>
                  <h2 className="text-2xl font-semibold mb-2">Get Involved</h2>
                  <p>Want to contribute? Email us at <a href="mailto:community@genius.com" className="text-green-600 underline">community@genius.com</a>.</p>
                </section>
              </main>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;
