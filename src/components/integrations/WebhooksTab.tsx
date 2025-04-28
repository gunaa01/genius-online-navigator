
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

interface WebhooksTabProps {
  webhooks: Webhook[];
  onAddWebhook: () => void;
  onEditWebhook: (name: string) => void;
}

const WebhooksTab = ({ 
  webhooks, 
  onAddWebhook, 
  onEditWebhook 
}: WebhooksTabProps) => {
  return (
    <Card className="card-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Webhooks</CardTitle>
        <CardDescription>
          Configure webhooks to receive real-time events from Genius
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 bg-secondary/50 p-3 font-medium text-sm">
            <div className="col-span-3">Name</div>
            <div className="col-span-4">URL</div>
            <div className="col-span-3">Events</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1"></div>
          </div>
          {webhooks.map((webhook) => (
            <div key={webhook.id} className="grid grid-cols-12 py-4 px-3 border-t">
              <div className="col-span-3 font-medium">{webhook.name}</div>
              <div className="col-span-4">
                <code className="bg-secondary/50 p-1 text-xs rounded break-all">{webhook.url}</code>
              </div>
              <div className="col-span-3">
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {event}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="col-span-1">
                {webhook.active ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                ) : (
                  <Badge variant="outline">Inactive</Badge>
                )}
              </div>
              <div className="col-span-1 text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEditWebhook(webhook.name)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onAddWebhook}>
          <Plus className="mr-2 h-4 w-4" /> Add Webhook
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhooksTab;
