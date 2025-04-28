
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ApiKey {
  id: number;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

interface ApiKeysTabProps {
  apiKeys: ApiKey[];
  onGenerateApiKey: () => void;
  onRevokeApiKey: (id: number) => void;
}

const ApiKeysTab = ({ 
  apiKeys, 
  onGenerateApiKey, 
  onRevokeApiKey 
}: ApiKeysTabProps) => {
  return (
    <Card className="card-shadow mb-8">
      <CardHeader>
        <CardTitle className="text-lg">API Keys</CardTitle>
        <CardDescription>
          Manage API keys for third-party service integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-secondary/50 p-3 font-medium text-sm">
            <div className="col-span-3">Name</div>
            <div className="col-span-4">Key</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-2">Last Used</div>
            <div className="col-span-1"></div>
          </div>
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="grid grid-cols-12 py-4 px-3 border-t">
              <div className="col-span-3 font-medium">{apiKey.name}</div>
              <div className="col-span-4">
                <code className="bg-secondary/50 p-1 text-xs rounded">{apiKey.key}</code>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {new Date(apiKey.created).toLocaleDateString()}
              </div>
              <div className="col-span-2 text-sm text-muted-foreground">
                {new Date(apiKey.lastUsed).toLocaleDateString()}
              </div>
              <div className="col-span-1 text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRevokeApiKey(apiKey.id)}
                >
                  Revoke
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onGenerateApiKey}>
          <Plus className="mr-2 h-4 w-4" /> Generate New API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ApiKeysTab;
