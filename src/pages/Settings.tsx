
import React from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Phone,
  Mail,
  MapPin,
  Building,
  Upload,
  Lock,
  Key,
  Languages,
  Moon,
  Sun
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </header>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-56">
              <TabsList className="flex flex-row md:flex-col w-full justify-start h-auto space-x-2 md:space-x-0 md:space-y-1 p-1 bg-transparent">
                <TabsTrigger value="profile" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="account" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <Settings className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="billing" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="appearance" className="w-full justify-start px-3 py-2 data-[state=active]:bg-secondary/50">
                  <Moon className="h-4 w-4 mr-2" />
                  Appearance
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information and business details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="text-2xl">JS</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium">John Smith</h3>
                        <p className="text-sm text-muted-foreground">john@example.com</p>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Change Photo</Button>
                          <Button variant="ghost" size="sm">Remove</Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input defaultValue="Smith" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input defaultValue="john@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input defaultValue="+1 (555) 123-4567" />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Business Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name</label>
                        <Input defaultValue="Acme Inc." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input defaultValue="https://example.com" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Company Description</label>
                        <Textarea 
                          defaultValue="Acme Inc. is a leading provider of digital marketing solutions for small and medium businesses." 
                          className="min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Industry</label>
                        <Select defaultValue="marketing">
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">Healthcare</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Size</label>
                        <Select defaultValue="small">
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solo">Solo Entrepreneur</SelectItem>
                            <SelectItem value="small">Small (1-10 employees)</SelectItem>
                            <SelectItem value="medium">Medium (11-50 employees)</SelectItem>
                            <SelectItem value="large">Large (51-200 employees)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (201+ employees)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Street Address</label>
                        <Input defaultValue="123 Business Ave, Suite 100" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input defaultValue="San Francisco" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">State / Province</label>
                        <Input defaultValue="California" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ZIP / Postal Code</label>
                        <Input defaultValue="94103" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Select defaultValue="us">
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-medium">Language & Regional</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Language</label>
                        <Select defaultValue="en">
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Time Zone</label>
                        <Select defaultValue="pst">
                          <SelectTrigger>
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                            <SelectItem value="cst">Central Time (CT)</SelectItem>
                            <SelectItem value="est">Eastern Time (ET)</SelectItem>
                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date Format</label>
                        <Select defaultValue="mdy">
                          <SelectTrigger>
                            <SelectValue placeholder="Select date format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                            <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                            <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Select defaultValue="usd">
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD ($)</SelectItem>
                            <SelectItem value="eur">EUR (€)</SelectItem>
                            <SelectItem value="gbp">GBP (£)</SelectItem>
                            <SelectItem value="cad">CAD (C$)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Account Access</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="font-medium">Account Status</div>
                          <div className="text-sm text-muted-foreground">Your account is currently active</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="font-medium">Free Trial</div>
                          <div className="text-sm text-muted-foreground">Your free trial ends in 5 days</div>
                        </div>
                        <Button variant="outline" size="sm">Upgrade Now</Button>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="font-medium">Data Retention</div>
                          <div className="text-sm text-muted-foreground">How long your data is stored in our system</div>
                        </div>
                        <Select defaultValue="90">
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">6 months</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <div className="font-medium">Account Deactivation</div>
                          <div className="text-sm text-muted-foreground">Temporarily disable your account</div>
                        </div>
                        <Button variant="destructive" size="sm">Deactivate</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Performance Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            Weekly summaries of your website's performance
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Campaign Results</h4>
                          <p className="text-sm text-muted-foreground">
                            Results and insights from your marketing campaigns
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Social Media Activity</h4>
                          <p className="text-sm text-muted-foreground">
                            Updates on your social media performance
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">New Features & Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            Learn about new features and platform updates
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Real-time Alerts</h4>
                          <p className="text-sm text-muted-foreground">
                            Get notified about important changes immediately
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Task Reminders</h4>
                          <p className="text-sm text-muted-foreground">
                            Reminders for scheduled content and deadlines
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium">Team Activity</h4>
                          <p className="text-sm text-muted-foreground">
                            Updates when team members take important actions
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium mb-4">Notification Frequency</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Summary Email Frequency</label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-secondary/30 p-4 rounded-lg border border-primary/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">Free Trial</h3>
                          <p className="text-sm text-muted-foreground">Your trial ends on May 1, 2025</p>
                        </div>
                        <Button>
                          Upgrade to Pro
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium">Payment Methods</h3>
                    <div className="border rounded-md p-4">
                      <p className="text-center text-muted-foreground">
                        No payment methods added yet.
                      </p>
                      <div className="flex justify-center mt-4">
                        <Button variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Add Payment Method
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium">Billing Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input placeholder="Name on card" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Company Name (Optional)</label>
                        <Input placeholder="Company name" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Street Address</label>
                        <Input placeholder="Address" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <Input placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">State / Province</label>
                        <Input placeholder="State/Province" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">ZIP / Postal Code</label>
                        <Input placeholder="ZIP/Postal code" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <h3 className="text-lg font-medium">Billing History</h3>
                    <div className="border rounded-md p-4 text-center">
                      <p className="text-muted-foreground">
                        No billing history available.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Billing Information</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <Input type="password" placeholder="•••••••••••" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <Input type="password" placeholder="•••••••••••" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input type="password" placeholder="•••••••••••" />
                      </div>
                      <div className="flex justify-end">
                        <Button className="mt-2">Update Password</Button>
                      </div>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Enable Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Setup 2FA
                      </Button>
                    </div>

                    <Separator />

                    <h3 className="text-lg font-medium">Login History</h3>
                    <div className="space-y-4">
                      <div className="bg-secondary/50 p-4 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Current Session</span>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                        </div>
                        <p className="text-sm mb-2">
                          <Globe className="h-4 w-4 inline mr-1" />
                          San Francisco, United States
                        </p>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>April 16, 2025 at 10:30 AM</span>
                          <span>IP: 192.168.1.1</span>
                        </div>
                      </div>
                      <div className="bg-secondary/30 p-4 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Previous Login</span>
                          <span className="text-xs text-muted-foreground">Chrome on Windows</span>
                        </div>
                        <p className="text-sm mb-2">
                          <Globe className="h-4 w-4 inline mr-1" />
                          San Francisco, United States
                        </p>
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>April 15, 2025 at 4:45 PM</span>
                          <span>IP: 192.168.1.1</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button variant="link" className="text-sm">View Full Login History</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize the look and feel of your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Theme</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose the theme for your dashboard
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </Button>
                        <Button variant="default" size="sm" className="flex items-center gap-2">
                          <div className="flex">
                            <Sun className="h-4 w-4" />
                            <Moon className="h-4 w-4 ml-0.5" />
                          </div>
                          System
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Dashboard Layout</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose how your dashboard is arranged
                        </p>
                      </div>
                      <Select defaultValue="default">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="expanded">Expanded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Sidebar Position</h4>
                        <p className="text-sm text-muted-foreground">
                          Choose the position of the navigation sidebar
                        </p>
                      </div>
                      <Select defaultValue="left">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Card Density</h4>
                        <p className="text-sm text-muted-foreground">
                          Change the spacing between cards and elements
                        </p>
                      </div>
                      <Select defaultValue="comfortable">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select density" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Show Help Tips</h4>
                        <p className="text-sm text-muted-foreground">
                          Display helpful tooltips throughout the interface
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-6 flex justify-between">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
