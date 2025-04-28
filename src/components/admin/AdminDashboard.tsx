
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Users, FileText, Settings, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-muted-foreground">+5 new this week</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">153</div>
          <p className="text-xs text-muted-foreground">+8 new this month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Integrations</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">All systems operational</p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions taken on the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">New user registered</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">New blog post published</p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <Settings className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">System settings updated</p>
              <p className="text-xs text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current status of platform services</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>All systems operational</AlertTitle>
            <AlertDescription>
              The platform is running normally with no reported issues.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm">API Service</p>
              <span className="flex items-center text-xs font-medium text-green-500">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Database</p>
              <span className="flex items-center text-xs font-medium text-green-500">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">Storage</p>
              <span className="flex items-center text-xs font-medium text-green-500">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500"></span>
                Operational
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
