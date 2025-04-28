import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  AlertTriangle,
  FileText,
  MessageSquare,
  Users,
  DollarSign,
  ClipboardCheck,
  Info
} from 'lucide-react';

import { Helmet } from 'react-helmet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import ProjectHeader from '@/components/hire/project/ProjectHeader';
import ProjectOverview from '@/components/hire/project/ProjectOverview';
import ProjectFiles from '@/components/hire/project/ProjectFiles';
import ProjectMessages from '@/components/hire/project/ProjectMessages';
import ProjectTeam from '@/components/hire/project/ProjectTeam';
import { MilestoneTracker, MilestoneWithStatus } from '@/components/hire/milestone/MilestoneTracker';
import { PaymentScheduler, ScheduledPayment } from '@/components/hire/payment/PaymentScheduler';
import { ProjectStatus } from '@/components/hire/project/ProjectCard';

// Mock project data (this would come from your API)
const mockProject = {
  id: 'proj-001',
  title: 'E-commerce Website Redesign',
  description: 'Complete redesign of an e-commerce platform with improved UI/UX and responsive design. The project includes new product pages, checkout process optimization, and mobile-first approach to ensure better conversion rates across all devices.',
  status: 'active' as ProjectStatus,
  priority: 'high' as const,
  progress: 65,
  startDate: '2025-03-15',
  endDate: '2025-05-30',
  budget: '$4,500',
  client: {
    id: 'client-001',
    name: 'Michael Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
  },
  freelancer: {
    id: 'freelancer-001',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
  },
  team: [
    { id: 'user-1', name: 'John Smith', avatarUrl: '', role: 'Designer' },
    { id: 'user-2', name: 'Jane Doe', avatarUrl: '', role: 'Developer' }
  ],
  contractId: 'contract-001',
  lastActivity: '2 hours ago',
  tags: ['web design', 'e-commerce', 'responsive'],
  unreadMessages: 3,
  totalMessages: 24,
  totalFiles: 15
};

// Mock milestones
const mockMilestones: MilestoneWithStatus[] = [
  {
    id: 'milestone-1',
    title: 'Wireframes and UI Design',
    description: 'Create wireframes and UI design mockups for all major pages',
    dueDate: '2025-04-01',
    amount: '$1,200',
    paymentTrigger: 'approval',
    deliverables: 'Figma design files with all screens and components',
    status: 'completed',
    completedDate: '2025-03-30',
    rejectionReason: '',
    attachments: [
      {
        id: 'attachment-1',
        name: 'e-commerce-wireframes.fig',
        size: '4.2 MB',
        type: 'application/figma',
        url: '#'
      }
    ]
  },
  {
    id: 'milestone-2',
    title: 'Homepage & Category Pages',
    description: 'Develop responsive homepage and category listing pages',
    dueDate: '2025-04-15',
    amount: '$1,100',
    paymentTrigger: 'approval',
    deliverables: 'Responsive HTML/CSS/JS for homepage and category pages',
    status: 'completed',
    completedDate: '2025-04-12',
  },
  {
    id: 'milestone-3',
    title: 'Product Detail & Cart',
    description: 'Implement product detail pages and shopping cart functionality',
    dueDate: '2025-04-30',
    amount: '$1,300',
    paymentTrigger: 'approval',
    deliverables: 'Fully functional product pages with add-to-cart features',
    status: 'in_progress',
  },
  {
    id: 'milestone-4',
    title: 'Checkout Process',
    description: 'Build checkout flow including payment gateway integration',
    dueDate: '2025-05-15',
    amount: '$1,400',
    paymentTrigger: 'approval',
    deliverables: 'Complete checkout system with payment processing',
    status: 'pending',
  },
  {
    id: 'milestone-5',
    title: 'Testing & Launch',
    description: 'Complete testing, bug fixes, and site launch',
    dueDate: '2025-05-30',
    amount: '$500',
    paymentTrigger: 'approval',
    deliverables: 'Fully tested site ready for production',
    status: 'pending',
  }
];

// Mock payments
const mockPayments: ScheduledPayment[] = [
  {
    id: 'payment-1',
    amount: '$1,200',
    scheduledDate: '2025-04-01',
    status: 'released',
    description: 'Payment for Wireframes and UI Design',
    paymentMethod: 'credit_card',
    trigger: 'milestone_completion',
    milestoneId: 'milestone-1',
    milestoneName: 'Wireframes and UI Design',
    recipient: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    transactionId: 'tx-001',
    processingDate: '2025-03-31',
    releaseDate: '2025-04-01'
  },
  {
    id: 'payment-2',
    amount: '$1,100',
    scheduledDate: '2025-04-15',
    status: 'released',
    description: 'Payment for Homepage & Category Pages',
    trigger: 'milestone_completion',
    milestoneId: 'milestone-2',
    milestoneName: 'Homepage & Category Pages',
    recipient: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    transactionId: 'tx-002',
    processingDate: '2025-04-13',
    releaseDate: '2025-04-14'
  },
  {
    id: 'payment-3',
    amount: '$1,300',
    scheduledDate: '2025-04-30',
    status: 'pending',
    description: 'Payment for Product Detail & Cart',
    trigger: 'milestone_completion',
    milestoneId: 'milestone-3',
    milestoneName: 'Product Detail & Cart',
    recipient: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    }
  },
  {
    id: 'payment-4',
    amount: '$1,400',
    scheduledDate: '2025-05-15',
    status: 'scheduled',
    description: 'Payment for Checkout Process',
    trigger: 'milestone_completion',
    milestoneId: 'milestone-4',
    milestoneName: 'Checkout Process',
    recipient: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    }
  },
  {
    id: 'payment-5',
    amount: '$500',
    scheduledDate: '2025-05-30',
    status: 'scheduled',
    description: 'Payment for Testing & Launch',
    trigger: 'milestone_completion',
    milestoneId: 'milestone-5',
    milestoneName: 'Testing & Launch',
    recipient: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    }
  }
];

// Mock deadlines and activities
const mockDeadlines = [
  {
    id: 'deadline-1',
    title: 'Product Detail & Cart Completion',
    dueDate: '2025-04-30',
    type: 'milestone' as const
  },
  {
    id: 'deadline-2',
    title: 'Client Demo Meeting',
    dueDate: '2025-04-25',
    type: 'meeting' as const
  },
  {
    id: 'deadline-3',
    title: 'Invoice #3 Payment Due',
    dueDate: '2025-05-01',
    type: 'payment' as const
  }
];

const mockActivities = [
  {
    id: 'activity-1',
    title: 'Completed the homepage design revisions',
    timestamp: '2 hours ago',
    user: {
      id: 'freelancer-001',
      name: 'Alex Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop'
    },
    type: 'milestone' as const
  },
  {
    id: 'activity-2',
    title: 'Uploaded product catalog spreadsheet',
    timestamp: '5 hours ago',
    user: {
      id: 'user-2',
      name: 'Jane Doe',
      avatarUrl: ''
    },
    type: 'file' as const
  },
  {
    id: 'activity-3',
    title: 'Sent a message regarding mobile layout',
    timestamp: '1 day ago',
    user: {
      id: 'client-001',
      name: 'Michael Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
    },
    type: 'message' as const
  },
  {
    id: 'activity-4',
    title: 'Released payment for milestone #2',
    timestamp: '1 week ago',
    user: {
      id: 'client-001',
      name: 'Michael Johnson',
      avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop'
    },
    type: 'payment' as const
  }
];

// Mock payment methods
const mockPaymentMethods = [
  { id: 'payment-method-1', name: 'Visa', last4: '4242', brand: 'Visa', type: 'card' },
  { id: 'payment-method-2', name: 'PayPal', type: 'paypal' }
];

// Component for placeholder tabs that haven't been fully implemented yet
const PlaceholderTab = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title} Coming Soon</h3>
    <p className="text-muted-foreground text-center max-w-md">
      This section is under development and will be available in the next update.
    </p>
  </div>
);

const ProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // State for current project
  const [project, setProject] = useState<typeof mockProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for current section
  const [currentSection, setCurrentSection] = useState<'overview' | 'milestones' | 'payments' | 'files' | 'messages' | 'team'>('overview');
  
  // Fetch project data
  useEffect(() => {
    // Simulate API call to fetch project data
    setIsLoading(true);
    
    // Mock API fetch with timeout
    const fetchTimeout = setTimeout(() => {
      try {
        // Check if project ID matches our mock data
        if (projectId === mockProject.id || projectId === undefined) {
          setProject(mockProject);
          setError(null);
        } else {
          // Simulate not found error
          setProject(null);
          setError('Project not found. Please check the URL and try again.');
        }
      } catch (err) {
        setProject(null);
        setError('Failed to load project data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }, 800);
    
    return () => clearTimeout(fetchTimeout);
  }, [projectId]);
  
  // Handle project section change
  const handleSectionChange = (section: 'overview' | 'milestones' | 'payments' | 'files' | 'messages' | 'team') => {
    setCurrentSection(section);
  };
  
  // Handle project actions
  const handleProjectAction = (action: string, data?: any) => {
    switch (action) {
      case 'message':
        navigate(`/hire/messages?project=${projectId}`);
        break;
      case 'edit':
        // This would navigate to project edit form
        alert('Navigate to edit project form (mock)');
        break;
      case 'share':
        // This would open a share dialog
        alert('Open share dialog (mock)');
        break;
      case 'contract':
        navigate(`/hire/contracts/${project?.contractId}`);
        break;
      case 'archive':
        // This would archive the project
        alert('Archive project API call (mock)');
        break;
      case 'rate':
        // This would open rating dialog
        alert('Open rating dialog (mock)');
        break;
      case 'change_status':
        // Update project status (would be an API call in a real app)
        setProject(prev => {
          if (!prev) return prev;
          
          return {
            ...prev,
            status: prev.status === 'active' 
              ? 'on_hold' as ProjectStatus 
              : prev.status === 'on_hold' || prev.status === 'pending_start'
                ? 'active' as ProjectStatus
                : prev.status === 'completed'
                  ? 'active' as ProjectStatus
                  : 'active' as ProjectStatus
          };
        });
        break;
      case 'view_milestones':
        setCurrentSection('milestones');
        break;
      case 'view_payments':
        setCurrentSection('payments');
        break;
      case 'view_team':
        setCurrentSection('team');
        break;
      case 'add_team_member':
        // This would open add team member dialog
        alert('Open add team member dialog (mock)');
        break;
      default:
        console.log(`Action ${action} not implemented`);
    }
  };
  
  // Handle milestone actions
  const handleMilestoneAction = (milestoneId: string, action: 'start' | 'deliver' | 'approve' | 'reject' | 'release_payment', data?: any) => {
    // In a real app, this would be an API call to update milestone status
    // For now, we'll just log the action
    console.log(`Milestone action: ${action} on milestone ${milestoneId}`, data);
    alert(`Milestone action: ${action} on milestone ${milestoneId}`);
  };
  
  // Handle payment actions
  const handleReleasePayment = (paymentId: string) => {
    // In a real app, this would be an API call to release payment
    // For now, we'll just log the action
    console.log(`Release payment: ${paymentId}`);
    alert(`Payment released: ${paymentId}`);
  };
  
  // Handle attachment download
  const handleDownloadAttachment = (attachmentId: string) => {
    // In a real app, this would trigger a file download
    // For now, we'll just log the action
    console.log(`Download attachment: ${attachmentId}`);
    alert(`Downloading attachment: ${attachmentId}`);
  };
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2 text-primary" />
        <span className="text-lg">Loading project...</span>
      </div>
    );
  }
  
  // If error, show error state
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Project not found'}</AlertDescription>
        </Alert>
        
        <button 
          onClick={() => navigate('/hire/projects')}
          className="text-primary hover:underline flex items-center"
        >
          &larr; Back to Projects
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{project.title} | Genius Online Navigator</title>
        <meta name="description" content={`Manage ${project.title} project`} />
      </Helmet>
      
      {/* Project Header with tabs */}
      <ProjectHeader
        projectId={project.id}
        projectTitle={project.title}
        status={project.status}
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        client={project.client}
        freelancer={project.freelancer}
        startDate={project.startDate}
        endDate={project.endDate}
        isFreelancer={true} // This would be dynamic in a real app
        teamCount={project.team ? project.team.length : 0}
        filesCount={project.totalFiles || 0}
        messagesCount={project.totalMessages || 0}
        unreadMessages={project.unreadMessages || 0}
        onProjectAction={handleProjectAction}
      />
      
      {/* Tab content sections */}
      <Tabs value={currentSection} className="mt-6">
        <TabsContent value="overview" className="mt-0">
          <ProjectOverview
            projectId={project.id}
            title={project.title}
            description={project.description}
            status={project.status}
            progress={project.progress}
            startDate={project.startDate}
            endDate={project.endDate}
            budget={project.budget}
            client={project.client}
            freelancer={project.freelancer}
            team={project.team}
            milestones={mockMilestones}
            upcomingDeadlines={mockDeadlines}
            recentActivities={mockActivities}
            isFreelancer={true} // This would be dynamic in a real app
            onAction={handleProjectAction}
          />
        </TabsContent>
        
        <TabsContent value="milestones" className="mt-0">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Milestone Tracking</AlertTitle>
            <AlertDescription>
              Track and manage project milestones, submit deliverables, and release payments upon completion.
            </AlertDescription>
          </Alert>
          
          <MilestoneTracker
            contractId={project.contractId}
            milestones={mockMilestones}
            totalAmount={project.budget}
            isFreelancer={true} // This would be dynamic in a real app
            onMilestoneAction={handleMilestoneAction}
            onDownloadAttachment={handleDownloadAttachment}
          />
        </TabsContent>
        
        <TabsContent value="payments" className="mt-0">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Payment Management</AlertTitle>
            <AlertDescription>
              Manage milestone payments, schedule future payments, and track payment history.
            </AlertDescription>
          </Alert>
          
          <PaymentScheduler
            contractId={project.contractId}
            payments={mockPayments}
            totalAmount={project.budget}
            isFreelancer={true} // This would be dynamic in a real app
            paymentMethods={mockPaymentMethods}
            onReleasePayment={handleReleasePayment}
            onCancelPayment={(paymentId) => console.log(`Cancel payment: ${paymentId}`)}
            onDownloadInvoice={(paymentId) => console.log(`Download invoice: ${paymentId}`)}
          />
        </TabsContent>
        
        <TabsContent value="files" className="mt-0">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>File Management</AlertTitle>
            <AlertDescription>
              Upload, organize, and share project files and deliverables. All team members can access files based on their permissions.
            </AlertDescription>
          </Alert>
          
          <ProjectFiles
            projectId={project.id}
            isFreelancer={true} // This would be dynamic in a real app
          />
        </TabsContent>
        
        <TabsContent value="messages" className="mt-0">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Project Communication</AlertTitle>
            <AlertDescription>
              Communicate with your team members, share files, and keep all project-related discussions in one place.
            </AlertDescription>
          </Alert>
          
          <ProjectMessages
            projectId={project.id}
            isFreelancer={true} // This would be dynamic in a real app
          />
        </TabsContent>
        
        <TabsContent value="team" className="mt-0">
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Team Management</AlertTitle>
            <AlertDescription>
              Manage team members, assign roles, and control permissions for project collaboration.
            </AlertDescription>
          </Alert>
          
          <ProjectTeam
            projectId={project.id}
            isFreelancer={true} // This would be dynamic in a real app
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPage;
