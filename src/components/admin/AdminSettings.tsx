
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Genius Platform",
    siteDescription: "AI-powered marketing and growth platform for businesses",
    contactEmail: "admin@genius.com",
    timezone: "UTC",
    language: "en",
    enableBlog: true,
    enableUserRegistration: true,
    maintenanceMode: false
  });
  
  const handleGeneralChange = (name: string, value: string | boolean) => {
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveGeneral = () => {
    toast({
      title: "Settings Saved",
      description: "Your general settings have been updated."
    });
  };

  const handleIntegrationConnect = (name: string) => {
    toast({
      title: "Integration Connected",
      description: `${name} integration has been connected successfully.`
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure your Genius platform settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic settings for your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={generalSettings.siteName}
                  onChange={(e) => handleGeneralChange("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => handleGeneralChange("siteDescription", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => handleGeneralChange("contactEmail", e.target.value)}
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={generalSettings.timezone} 
                    onValueChange={(value) => handleGeneralChange("timezone", value)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time (ET)</SelectItem>
                      <SelectItem value="CST">Central Time (CT)</SelectItem>
                      <SelectItem value="MST">Mountain Time (MT)</SelectItem>
                      <SelectItem value="PST">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={generalSettings.language} 
                    onValueChange={(value) => handleGeneralChange("language", value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableBlog">Enable Blog</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to access the blog section of your site.
                    </p>
                  </div>
                  <Switch
                    id="enableBlog"
                    checked={generalSettings.enableBlog}
                    onCheckedChange={(checked) => handleGeneralChange("enableBlog", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableUserRegistration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register on your platform.
                    </p>
                  </div>
                  <Switch
                    id="enableUserRegistration"
                    checked={generalSettings.enableUserRegistration}
                    onCheckedChange={(checked) => handleGeneralChange("enableUserRegistration", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="text-red-500">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable maintenance mode to temporarily disable your site.
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleGeneralChange("maintenanceMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-4 cursor-pointer bg-white text-black flex items-center justify-center">
                    Light
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer bg-gray-900 text-white flex items-center justify-center">
                    Dark
                  </div>
                  <div className="border rounded-md p-4 cursor-pointer bg-gradient-to-r from-white to-gray-900 text-black flex items-center justify-center">
                    System
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  <div className="h-10 rounded-md bg-blue-500 cursor-pointer"></div>
                  <div className="h-10 rounded-md bg-green-500 cursor-pointer"></div>
                  <div className="h-10 rounded-md bg-purple-500 cursor-pointer"></div>
                  <div className="h-10 rounded-md bg-red-500 cursor-pointer"></div>
                  <div className="h-10 rounded-md bg-yellow-500 cursor-pointer"></div>
                  <div className="h-10 rounded-md bg-gray-500 cursor-pointer"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 border rounded-md flex items-center justify-center bg-muted">
                    Logo
                  </div>
                  <Button variant="outline">Upload New</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 border rounded-md flex items-center justify-center bg-muted">
                    Icon
                  </div>
                  <Button variant="outline">Upload New</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>
                Connect external services with your Genius platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Google Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track website metrics and user behavior.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleIntegrationConnect("Google Analytics")}>
                    Connect
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gaId">Tracking ID</Label>
                  <Input id="gaId" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXX" />
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Mailchimp</h3>
                    <p className="text-sm text-muted-foreground">
                      Email marketing integration.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleIntegrationConnect("Mailchimp")}>
                    Connect
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mailchimpApi">API Key</Label>
                  <Input id="mailchimpApi" type="password" placeholder="Enter your API key" />
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Stripe</h3>
                    <p className="text-sm text-muted-foreground">
                      Payment processing integration.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => handleIntegrationConnect("Stripe")}>
                    Connect
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stripePublic">Public Key</Label>
                    <Input id="stripePublic" placeholder="pk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecret">Secret Key</Label>
                    <Input id="stripeSecret" type="password" placeholder="sk_test_..." />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save All Integrations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email server settings and notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.yourprovider.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="username@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Password</Label>
                  <Input id="smtpPassword" type="password" placeholder="••••••••" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input id="fromName" placeholder="Genius Platform" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input id="fromEmail" placeholder="notifications@genius.com" />
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Notification Templates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Welcome Email</h4>
                      <p className="text-sm text-muted-foreground">Sent to new users after registration</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Password Reset</h4>
                      <p className="text-sm text-muted-foreground">Sent when users request password reset</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Campaign Completion</h4>
                      <p className="text-sm text-muted-foreground">Sent when a marketing campaign completes</p>
                    </div>
                    <Button variant="outline" size="sm">Edit Template</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Email Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced features and system settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cacheTime">Cache Timeout (seconds)</Label>
                <Input id="cacheTime" type="number" defaultValue="3600" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiLimit">API Rate Limit (requests per minute)</Label>
                <Input id="apiLimit" type="number" defaultValue="100" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxUploadSize">Maximum Upload Size (MB)</Label>
                <Input id="maxUploadSize" type="number" defaultValue="10" />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debugMode">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging for troubleshooting
                    </p>
                  </div>
                  <Switch id="debugMode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableCaching">Enable Caching</Label>
                    <p className="text-sm text-muted-foreground">
                      Improve performance with server-side caching
                    </p>
                  </div>
                  <Switch id="enableCaching" defaultChecked />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Operations</h3>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline">Clear Cache</Button>
                  <Button variant="outline">Run Database Maintenance</Button>
                </div>
                
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                  <p className="text-sm text-red-600 mb-4">
                    These actions can cause data loss and are not reversible.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="destructive">Reset Platform</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
