import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar: string;
}

interface ClientPortalHeaderProps {
  client: Client;
}

const ClientPortalHeader: React.FC<ClientPortalHeaderProps> = ({ client }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={client.avatar} alt={client.name} />
          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{client.company}</h1>
          <p className="text-muted-foreground">Welcome back, {client.name}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default ClientPortalHeader;
