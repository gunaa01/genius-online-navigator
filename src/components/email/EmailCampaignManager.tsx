import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Users, 
  Clock, 
  Calendar, 
  BarChart2, 
  Send, 
  Edit, 
  Copy, 
  Trash, 
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface EmailCampaignManagerProps {
  campaigns?: Array<{
    id: string;
    name: string;
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
    type: 'regular' | 'automated' | 'drip';
    subject: string;
    sentDate?: string;
    scheduledDate?: string;
    recipients: number;
    openRate?: number;
    clickRate?: number;
  }>;
  lists?: Array<{
    id: string;
    name: string;
    subscribers: number;
    tags?: string[];
    description?: string;
  }>;
  templates?: Array<{
    id: string;
    name: string;
    thumbnail?: string;
    category: string;
  }>;
  onCreateCampaign?: (campaign: any) => Promise<boolean>;
  onSaveDraft?: (campaign: any) => Promise<boolean>;
  onScheduleCampaign?: (campaignId: string, date: string) => Promise<boolean>;
  onDeleteCampaign?: (campaignId: string) => Promise<boolean>;
}

/**
 * Email Campaign Manager Component
 * Manages email marketing campaigns with drip sequences and automation
 */
const EmailCampaignManager: React.FC<EmailCampaignManagerProps> = ({
  campaigns = [],
  lists = [],
  templates = [],
  onCreateCampaign,
  onSaveDraft,
  onScheduleCampaign,
  onDeleteCampaign
}) => {
  const [activeTab, setActiveTab] = useState<string>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  
  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    type: 'regular',
    listId: '',
    templateId: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
    isPersonalized: false,
    isScheduled: false,
    isDrip: false,
    dripSequence: [
      { days: 0, subject: '', content: '' },
      { days: 3, subject: '', content: '' },
      { days: 7, subject: '', content: '' }
    ]
  });

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setNewCampaign({
      ...newCampaign,
      [field]: value
    });
  };

  // Handle drip sequence changes
  const handleDripChange = (index: number, field: string, value: any) => {
    const updatedSequence = [...newCampaign.dripSequence];
    updatedSequence[index] = {
      ...updatedSequence[index],
      [field]: value
    };
    
    setNewCampaign({
      ...newCampaign,
      dripSequence: updatedSequence
    });
  };

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    if (onCreateCampaign) {
      const success = await onCreateCampaign(newCampaign);
      if (success) {
        setIsCreating(false);
        // Reset form
        setNewCampaign({
          name: '',
          subject: '',
          type: 'regular',
          listId: '',
          templateId: '',
          content: '',
          scheduledDate: '',
          scheduledTime: '',
          isPersonalized: false,
          isScheduled: false,
          isDrip: false,
          dripSequence: [
            { days: 0, subject: '', content: '' },
            { days: 3, subject: '', content: '' },
            { days: 7, subject: '', content: '' }
          ]
        });
      }
    }
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'scheduled': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-purple-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Render campaign creation form
  const renderCampaignForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            placeholder="Summer Sale Announcement"
            value={newCampaign.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="campaign-type">Campaign Type</Label>
          <Select
            value={newCampaign.type}
            onValueChange={(value) => handleInputChange('type', value)}
          >
            <SelectTrigger id="campaign-type">
              <SelectValue placeholder="Select campaign type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Campaign</SelectItem>
              <SelectItem value="automated">Automated Campaign</SelectItem>
              <SelectItem value="drip">Drip Sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="campaign-subject">Email Subject</Label>
        <Input
          id="campaign-subject"
          placeholder="Your Summer Discount Inside!"
          value={newCampaign.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="recipient-list">Recipient List</Label>
        <Select
          value={newCampaign.listId}
          onValueChange={(value) => handleInputChange('listId', value)}
        >
          <SelectTrigger id="recipient-list">
            <SelectValue placeholder="Select recipient list" />
          </SelectTrigger>
          <SelectContent>
            {lists.map(list => (
              <SelectItem key={list.id} value={list.id}>
                {list.name} ({list.subscribers} subscribers)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="email-template">Email Template</Label>
        <Select
          value={newCampaign.templateId}
          onValueChange={(value) => handleInputChange('templateId', value)}
        >
          <SelectTrigger id="email-template">
            <SelectValue placeholder="Select email template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="email-content">Email Content</Label>
        <Textarea
          id="email-content"
          placeholder="Write your email content here..."
          className="min-h-[200px]"
          value={newCampaign.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="personalize"
          checked={newCampaign.isPersonalized}
          onCheckedChange={(checked) => handleInputChange('isPersonalized', checked)}
        />
        <Label htmlFor="personalize">Personalize with recipient name and custom fields</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="schedule"
          checked={newCampaign.isScheduled}
          onCheckedChange={(checked) => handleInputChange('isScheduled', checked)}
        />
        <Label htmlFor="schedule">Schedule for later</Label>
      </div>
      
      {newCampaign.isScheduled && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="schedule-date">Date</Label>
            <Input
              id="schedule-date"
              type="date"
              value={newCampaign.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="schedule-time">Time</Label>
            <Input
              id="schedule-time"
              type="time"
              value={newCampaign.scheduledTime}
              onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
            />
          </div>
        </div>
      )}
      
      {newCampaign.type === 'drip' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Drip Sequence</h3>
            <Button variant="outline" size="sm" onClick={() => {
              const updatedSequence = [...newCampaign.dripSequence];
              const lastEmail = updatedSequence[updatedSequence.length - 1];
              updatedSequence.push({
                days: lastEmail.days + 3,
                subject: '',
                content: ''
              });
              handleInputChange('dripSequence', updatedSequence);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Email
            </Button>
          </div>
          
          {newCampaign.dripSequence.map((email, index) => (
            <Card key={index} className="border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between">
                  <span>Email {index + 1}</span>
                  <span className="text-sm text-muted-foreground">
                    {email.days === 0 ? 'Immediately' : `Day ${email.days}`}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor={`drip-subject-${index}`}>Subject</Label>
                  <Input
                    id={`drip-subject-${index}`}
                    placeholder="Email subject"
                    value={email.subject}
                    onChange={(e) => handleDripChange(index, 'subject', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`drip-content-${index}`}>Content</Label>
                  <Textarea
                    id={`drip-content-${index}`}
                    placeholder="Email content"
                    className="min-h-[100px]"
                    value={email.content}
                    onChange={(e) => handleDripChange(index, 'content', e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <Label htmlFor={`drip-day-${index}`}>Send after (days)</Label>
                  <Input
                    id={`drip-day-${index}`}
                    type="number"
                    className="w-20"
                    min={0}
                    value={email.days}
                    onChange={(e) => handleDripChange(index, 'days', parseInt(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsCreating(false)}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => onSaveDraft && onSaveDraft(newCampaign)}>
          Save Draft
        </Button>
        <Button onClick={handleCreateCampaign}>
          {newCampaign.isScheduled ? 'Schedule Campaign' : 'Create Campaign'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="campaigns">
              <Mail className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="subscribers">
              <Users className="h-4 w-4 mr-2" />
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Edit className="h-4 w-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="automation">
              <Clock className="h-4 w-4 mr-2" />
              Automation
            </TabsTrigger>
          </TabsList>
          
          {activeTab === 'campaigns' && !isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          )}
        </div>
        
        <TabsContent value="campaigns">
          {isCreating ? (
            renderCampaignForm()
          ) : (
            <div className="space-y-4">
              {campaigns.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-4 p-3 border-b bg-muted/50 text-sm font-medium">
                    <div className="col-span-3">Campaign</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Recipients</div>
                    <div className="col-span-2">Performance</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="grid grid-cols-12 gap-4 p-3 border-b last:border-0 items-center">
                      <div className="col-span-3">
                        <div className="font-medium">{campaign.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{campaign.subject}</div>
                      </div>
                      <div className="col-span-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {campaign.scheduledDate ? new Date(campaign.scheduledDate).toLocaleDateString() : 
                           campaign.sentDate ? new Date(campaign.sentDate).toLocaleDateString() : ''}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="capitalize">{campaign.type}</div>
                      </div>
                      <div className="col-span-2">
                        <div>{campaign.recipients.toLocaleString()}</div>
                      </div>
                      <div className="col-span-2">
                        {campaign.openRate !== undefined ? (
                          <div className="space-y-1">
                            <div className="text-sm">
                              <span className="font-medium">{campaign.openRate}%</span> Open Rate
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{campaign.clickRate}%</span> Click Rate
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">No data yet</div>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end space-x-1">
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDeleteCampaign && onDeleteCampaign(campaign.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first email campaign to get started.</p>
                  <Button onClick={() => setIsCreating(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="subscribers">
          <div className="space-y-4">
            {lists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists.map(list => (
                  <Card key={list.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{list.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">{list.subscribers.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground mb-3">{list.description || 'No description'}</p>
                      
                      {list.tags && list.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {list.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          View Subscribers
                        </Button>
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No subscriber lists yet</h3>
                <p className="text-muted-foreground mb-4">Create your first subscriber list to get started.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Subscriber List
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="space-y-4">
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card key={template.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative">
                      {template.thumbnail ? (
                        <img 
                          src={template.thumbnail} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Mail className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">{template.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button size="sm">Use Template</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No email templates yet</h3>
                <p className="text-muted-foreground mb-4">Create your first email template to get started.</p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="automation">
          <div className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Automated Email Workflows</h3>
              <p className="text-muted-foreground mb-4">
                Create automated email sequences triggered by subscriber actions or time-based events.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Welcome Series</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automatically send a series of welcome emails to new subscribers.
                    </p>
                    <Button variant="outline" size="sm">Set Up</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Abandoned Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Remind customers about products left in their shopping cart.
                    </p>
                    <Button variant="outline" size="sm">Set Up</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Re-engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Win back inactive subscribers with targeted content.
                    </p>
                    <Button variant="outline" size="sm">Set Up</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">GDPR Compliance Tools</h3>
              <p className="text-muted-foreground mb-4">
                Ensure your email marketing complies with GDPR and other privacy regulations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Consent Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start mb-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Double Opt-in Enabled</p>
                        <p className="text-sm text-muted-foreground">
                          Subscribers must confirm their email address before being added to your list.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Consent Tracking Active</p>
                        <p className="text-sm text-muted-foreground">
                          The system records when and how subscribers gave consent.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Unsubscribe Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start mb-4">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">One-Click Unsubscribe</p>
                        <p className="text-sm text-muted-foreground">
                          Subscribers can easily opt-out with a single click.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Preference Center</p>
                        <p className="text-sm text-muted-foreground">
                          Not configured. Set up a preference center to let subscribers manage their email preferences.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCampaignManager;
