import type { Meta, StoryObj } from '@storybook/react';
import AIInsightsPanel, { Insight, InsightType, InsightCategory, InsightPriority, AutomationStatus } from './AIInsightsPanel';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagContext';
import { RBACProvider } from '@/contexts/RBACContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock user for feature flags
const mockUser = {
  id: 'user-001',
  email: 'admin@example.com',
  role: 'admin' as const,
  teams: ['development', 'management']
};

// Create sample insights for stories
const createSampleInsights = (): Insight[] => [
  {
    id: 'insight-1',
    title: 'Resource allocation optimization',
    description: 'Reallocating resources from Project A to Project B could improve overall efficiency by 15%.',
    type: 'recommendation',
    category: 'resource',
    priority: 'high',
    createdAt: new Date().toISOString(),
    relatedEntityId: 'project-b',
    relatedEntityType: 'project',
    relatedEntityName: 'Project B',
    confidence: 87,
    modelVersion: '2.3',
    metrics: [
      {
        name: 'Efficiency Score',
        value: '72%',
        change: 15,
        trend: 'up'
      },
      {
        name: 'Resource Utilization',
        value: '85%',
        change: 12,
        trend: 'up'
      }
    ],
    actions: [
      {
        id: 'action-1',
        label: 'Reallocate Resources',
        action: 'reallocateResources',
        description: 'Move 2 developers from Project A to Project B for the next sprint',
        params: { fromProject: 'project-a', toProject: 'project-b', count: 2 },
        automatable: true,
        automationStatus: 'available',
        estimatedImpact: {
          metric: 'Efficiency',
          value: '87%',
          change: 15,
          confidence: 85
        }
      },
      {
        id: 'action-2',
        label: 'Adjust Sprint Goals',
        action: 'adjustSprintGoals',
        description: 'Reduce Project A sprint goals by 20% to account for resource changes',
        params: { project: 'project-a', adjustmentPercent: -20 }
      }
    ]
  },
  {
    id: 'insight-2',
    title: 'Budget risk detected',
    description: 'Project C is trending 25% over budget based on current burn rate.',
    type: 'risk',
    category: 'financial',
    priority: 'critical',
    createdAt: new Date().toISOString(),
    relatedEntityId: 'project-c',
    relatedEntityType: 'project',
    relatedEntityName: 'Project C',
    confidence: 92,
    modelVersion: '2.3',
    metrics: [
      {
        name: 'Budget Variance',
        value: '+25%',
        change: 25,
        trend: 'up'
      },
      {
        name: 'Burn Rate',
        value: '$12,500/week',
        change: 15,
        trend: 'up'
      }
    ],
    actions: [
      {
        id: 'action-3',
        label: 'Reduce Scope',
        action: 'reduceProjectScope',
        description: 'Identify and remove non-essential features to reduce project scope',
        params: { project: 'project-c' },
        automatable: false
      },
      {
        id: 'action-4',
        label: 'Adjust Budget',
        action: 'adjustProjectBudget',
        description: 'Increase budget allocation by 20% to accommodate current scope',
        params: { project: 'project-c', adjustmentPercent: 20 },
        automatable: true,
        automationStatus: 'scheduled',
        automationSchedule: {
          frequency: 'weekly',
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          runCount: 2
        }
      }
    ]
  },
  {
    id: 'insight-3',
    title: 'Client satisfaction opportunity',
    description: 'Adding weekly status reports could improve client satisfaction scores by 18%.',
    type: 'opportunity',
    category: 'client',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    relatedEntityId: 'client-a',
    relatedEntityType: 'client',
    relatedEntityName: 'Acme Corp',
    confidence: 78,
    modelVersion: '2.3',
    metrics: [
      {
        name: 'Satisfaction Score',
        value: '72/100',
        change: 0,
        trend: 'neutral'
      }
    ],
    actions: [
      {
        id: 'action-5',
        label: 'Enable Weekly Reports',
        action: 'enableWeeklyReports',
        description: 'Turn on automated weekly status reports for this client',
        params: { client: 'client-a', frequency: 'weekly' },
        automatable: true,
        automationStatus: 'available',
        automationRecommended: true,
        automationConfidence: 90,
        estimatedImpact: {
          metric: 'Satisfaction',
          value: '90/100',
          change: 18,
          confidence: 78
        }
      }
    ]
  },
  {
    id: 'insight-4',
    title: 'Automated task assignment',
    description: 'Enable AI-powered task assignment to improve team productivity by 22%.',
    type: 'automation',
    category: 'automation',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    confidence: 85,
    modelVersion: '2.3',
    automationRecommended: true,
    automationConfidence: 92,
    metrics: [
      {
        name: 'Team Productivity',
        value: '78%',
        change: 0,
        trend: 'neutral'
      },
      {
        name: 'Assignment Time',
        value: '45 min/day',
        change: 0,
        trend: 'neutral'
      }
    ],
    actions: [
      {
        id: 'action-6',
        label: 'Enable Task Automation',
        action: 'enableTaskAutomation',
        description: 'Turn on AI-powered task assignment for all team members',
        params: { teams: ['development', 'design'] },
        automatable: true,
        automationStatus: 'available',
        estimatedImpact: {
          metric: 'Productivity',
          value: '95%',
          change: 22,
          confidence: 85
        }
      }
    ]
  }
];

// Create wrapper for context providers
const withProviders = (Story: React.ComponentType) => (
  <AuthProvider>
    <FeatureFlagProvider initialUser={mockUser}>
      <RBACProvider>
        <div className="p-4 max-w-4xl mx-auto">
          <Story />
        </div>
      </RBACProvider>
    </FeatureFlagProvider>
  </AuthProvider>
);

const meta: Meta<typeof AIInsightsPanel> = {
  title: 'Components/Innovation/AIInsightsPanel',
  component: AIInsightsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [withProviders],
  argTypes: {
    insights: { control: 'object' },
    isLoading: { control: 'boolean' },
    onRefresh: { action: 'refreshed' },
    onDismiss: { action: 'dismissed' },
    onFeedback: { action: 'feedback submitted' },
    onAction: { action: 'action triggered' },
    onAutomate: { action: 'automation scheduled' },
    onCancelAutomation: { action: 'automation cancelled' }
  },
};

export default meta;
type Story = StoryObj<typeof AIInsightsPanel>;

export const Default: Story = {
  args: {
    insights: createSampleInsights(),
    isLoading: false
  },
};

export const Loading: Story = {
  args: {
    insights: [],
    isLoading: true
  },
};

export const Empty: Story = {
  args: {
    insights: [],
    isLoading: false
  },
};

export const WithFeedback: Story = {
  args: {
    insights: createSampleInsights().map((insight, index) => ({
      ...insight,
      feedback: index % 2 === 0 ? 'helpful' : 'not_helpful',
      detailedFeedback: index % 2 === 0 ? 'This insight was very helpful for resource planning.' : undefined
    })),
    isLoading: false
  },
};
