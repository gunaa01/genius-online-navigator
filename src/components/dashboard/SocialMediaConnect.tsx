
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Share2,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Link
} from "lucide-react";
import { SocialAccount } from "@/hooks/useDemoData";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface SocialMediaConnectProps {
  accounts: SocialAccount[];
  loading: boolean;
}

const SocialMediaConnect = ({ accounts, loading }: SocialMediaConnectProps) => {
  if (loading) {
    return (
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-16 animate-pulse bg-secondary rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-500" />;
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-primary" />
          Social Media
        </CardTitle>
        <Button variant="outline" size="sm">
          Schedule Post
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  {getPlatformIcon(account.platform)}
                </div>
                <div className="ml-4">
                  <div className="flex items-center">
                    <p className="font-medium">{getPlatformName(account.platform)}</p>
                    {account.connected && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200">
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.username} • {account.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Switch 
                  checked={account.connected} 
                  id={`switch-${account.id}`}
                />
                <label 
                  htmlFor={`switch-${account.id}`}
                  className="ml-2 text-sm cursor-pointer"
                >
                  {account.connected ? "Enabled" : "Disabled"}
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-5 border-t flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Connect more accounts to expand your reach
          </p>
          <Button size="sm">
            Add Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaConnect;
