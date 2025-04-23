import type { Meta, StoryObj } from '@storybook/react';
import LoadingScreen, { CardSkeleton, TableSkeleton, FormSkeleton, DashboardSkeleton } from './LoadingScreen';

const meta: Meta<typeof LoadingScreen> = {
  title: 'Components/Common/LoadingScreen',
  component: LoadingScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    fullScreen: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingScreen>;

export const Default: Story = {
  args: {
    message: 'Loading...',
    fullScreen: true,
  },
};

export const CustomMessage: Story = {
  args: {
    message: 'Preparing your dashboard...',
    fullScreen: true,
  },
};

export const Contained: Story = {
  args: {
    message: 'Loading content...',
    fullScreen: false,
  },
  decorators: [
    (Story) => (
      <div className="w-full h-[400px] border rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export const CardSkeletonStory: StoryObj<typeof CardSkeleton> = {
  name: 'Card Skeleton',
  render: () => <CardSkeleton />,
  parameters: {
    layout: 'centered',
  },
};

export const CardSkeletonGroup: StoryObj<typeof CardSkeleton> = {
  name: 'Card Skeleton Group',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
};

export const TableSkeletonStory: StoryObj<typeof TableSkeleton> = {
  name: 'Table Skeleton',
  render: () => <TableSkeleton rows={5} columns={4} />,
  parameters: {
    layout: 'centered',
  },
};

export const FormSkeletonStory: StoryObj<typeof FormSkeleton> = {
  name: 'Form Skeleton',
  render: () => <FormSkeleton fields={4} />,
  parameters: {
    layout: 'centered',
  },
};

export const DashboardSkeletonStory: StoryObj<typeof DashboardSkeleton> = {
  name: 'Dashboard Skeleton',
  render: () => <DashboardSkeleton />,
  parameters: {
    layout: 'centered',
  },
};
