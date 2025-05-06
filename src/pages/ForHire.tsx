
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Code2, 
  Palette, 
  ShoppingBag,
  Smartphone,
  Shield,
  Search,
  Share2,
  Pencil,
  Target,
  Play,
  Mail,
  HeadsetIcon,
  Bot,
  Database,
  ArrowRightLeft,
  Users,
  Truck,
  Briefcase,
  ListFilter
} from "lucide-react";
import GigListings from "@/components/GigListings";
import { MarketplaceProvider } from "@/contexts/MarketplaceContext";

const ForHire = () => {
  // Removed local filter/search state; now handled by MarketplaceContext

  const [activeTab, setActiveTab] = useState("roles");
  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/offline-to-online">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Guide
          </Link>
        </Button>
        
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-4">For Hire Marketplace</h1>
            <p className="text-lg text-muted-foreground">Find the right talent or browse available gigs for your online business</p>
          </header>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">
                <Briefcase className="h-4 w-4 mr-2" />
                Key Roles to Hire
              </TabsTrigger>
              <TabsTrigger value="gigs">
                <ListFilter className="h-4 w-4 mr-2" />
                Browse Available Gigs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="mt-6">
              <Tabs defaultValue="tech" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tech">Website & Tech</TabsTrigger>
              <TabsTrigger value="marketing">Marketing & Visibility</TabsTrigger>
              <TabsTrigger value="operations">Operations & Sales</TabsTrigger>
            </TabsList>

            <TabsContent value="tech" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      <CardTitle>Must-Hire Roles</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Code2 className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Web Developer</h4>
                          <p className="text-sm text-muted-foreground">Builds & maintains your website (WordPress, Shopify, custom sites)</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Palette className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">UI/UX Designer</h4>
                          <p className="text-sm text-muted-foreground">Ensures your site is user-friendly and visually appealing</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <ShoppingBag className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">E-commerce Specialist</h4>
                          <p className="text-sm text-muted-foreground">Sets up payment gateways, product listings, and inventory sync</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      <CardTitle>Optional (Advanced)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Smartphone className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Mobile App Developer</h4>
                          <p className="text-sm text-muted-foreground">If you need a dedicated mobile application</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Shield className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">IT Security Expert</h4>
                          <p className="text-sm text-muted-foreground">For data protection & PCI compliance</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="marketing" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Search className="h-5 w-5 text-primary" />
                      <CardTitle>Must-Hire Roles</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Search className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">SEO Specialist</h4>
                          <p className="text-sm text-muted-foreground">Optimizes your website for Google rankings</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Share2 className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Social Media Manager</h4>
                          <p className="text-sm text-muted-foreground">Runs Facebook, Instagram, LinkedIn campaigns</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Pencil className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Content Writer</h4>
                          <p className="text-sm text-muted-foreground">Creates blogs, product descriptions, and SEO content</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Target className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">PPC Ads Expert</h4>
                          <p className="text-sm text-muted-foreground">Manages Google & Facebook ads for leads/sales</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Play className="h-5 w-5 text-primary" />
                      <CardTitle>Optional (Scaling)</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Users className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Influencer Marketer</h4>
                          <p className="text-sm text-muted-foreground">Partners with micro-influencers for promotions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Play className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Video Editor</h4>
                          <p className="text-sm text-muted-foreground">For YouTube/TikTok ads & social content</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="operations" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <HeadsetIcon className="h-5 w-5 text-primary" />
                      <CardTitle>Support & Operations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Virtual Assistant (VA)</h4>
                          <p className="text-sm text-muted-foreground">Handles emails, scheduling, and admin tasks</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <HeadsetIcon className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Customer Support Rep</h4>
                          <p className="text-sm text-muted-foreground">Manages live chat, WhatsApp, and phone queries</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Bot className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Chatbot Developer</h4>
                          <p className="text-sm text-muted-foreground">Sets up AI chatbots for 24/7 support</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Database className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">CRM Specialist</h4>
                          <p className="text-sm text-muted-foreground">Manages customer data (HubSpot, Zoho)</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <ArrowRightLeft className="h-5 w-5 text-primary" />
                      <CardTitle>Sales & Logistics</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <ArrowRightLeft className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Sales Funnel Expert</h4>
                          <p className="text-sm text-muted-foreground">Sets up lead capture pages & email sequences</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <Truck className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium">Logistics Manager</h4>
                          <p className="text-sm text-muted-foreground">Handles warehousing, shipping & inventory</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
              </Tabs>

              <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Budget-Based Hiring Guide</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Low Budget</CardTitle>
                  <CardDescription>Essential roles to start with</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-4 space-y-2 text-sm">
                    <li>Web Developer</li>
                    <li>Virtual Assistant</li>
                    <li>SEO Specialist</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medium Budget</CardTitle>
                  <CardDescription>Expanded team capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-4 space-y-2 text-sm">
                    <li>Social Media Manager</li>
                    <li>PPC Expert</li>
                    <li>Content Writer</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>High Budget</CardTitle>
                  <CardDescription>Full-service solution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc ml-4 space-y-2 text-sm">
                    <li>Digital Marketing Agency</li>
                    <li>Sales Funnel Expert</li>
                    <li>CRM Specialist</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
              </div>
            </TabsContent>

            <TabsContent value="gigs" className="mt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Available Gigs</h2>
                <p className="text-muted-foreground mb-6">Browse through available gigs from talented freelancers ready to help with your online business needs.</p>
                
                <GigListings 
                  showFilters={true}
                  limit={6}
                />
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
};

      </MarketplaceProvider>
  );
};

export default ForHire;
