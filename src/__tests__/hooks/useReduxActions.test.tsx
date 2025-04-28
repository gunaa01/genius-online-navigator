import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@/utils/test-utils';
import useReduxActions from '@/hooks/useReduxActions';

// Create a wrapper with Redux Provider
const createWrapper = () => {
  const store = setupStore();
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useReduxActions Hook', () => {
  it('should return all state slices and action creators', () => {
    const { result } = renderHook(() => useReduxActions(), {
      wrapper: createWrapper(),
    });

    // Check if all state slices are available
    expect(result.current.auth).toBeDefined();
    expect(result.current.ui).toBeDefined();
    expect(result.current.adCampaign).toBeDefined();
    expect(result.current.socialMedia).toBeDefined();
    expect(result.current.aiContent).toBeDefined();
    expect(result.current.analytics).toBeDefined();

    // Check if all action groups are available
    expect(result.current.authActions).toBeDefined();
    expect(result.current.uiActions).toBeDefined();
    expect(result.current.adCampaignActions).toBeDefined();
    expect(result.current.socialMediaActions).toBeDefined();
    expect(result.current.aiContentActions).toBeDefined();
    expect(result.current.analyticsActions).toBeDefined();
  });

  it('should be able to dispatch UI actions', () => {
    const { result } = renderHook(() => useReduxActions(), {
      wrapper: createWrapper(),
    });

    // Initial theme should be 'system'
    expect(result.current.ui.theme).toBe('system');

    // Dispatch setTheme action
    act(() => {
      result.current.uiActions.setTheme('dark');
    });

    // Theme should be updated to 'dark'
    expect(result.current.ui.theme).toBe('dark');

    // Test sidebar toggle
    expect(result.current.ui.sidebarOpen).toBe(true);
    
    act(() => {
      result.current.uiActions.toggleSidebar();
    });
    
    expect(result.current.ui.sidebarOpen).toBe(false);
  });

  it('should be able to add and manage notifications', () => {
    const { result } = renderHook(() => useReduxActions(), {
      wrapper: createWrapper(),
    });

    // Initially there should be no notifications
    expect(result.current.ui.notifications).toHaveLength(0);

    // Add a notification
    act(() => {
      result.current.uiActions.addNotification({
        type: 'success',
        message: 'Test notification',
      });
    });

    // Should have one notification now
    expect(result.current.ui.notifications).toHaveLength(1);
    expect(result.current.ui.notifications[0].message).toBe('Test notification');
    expect(result.current.ui.notifications[0].type).toBe('success');
    expect(result.current.ui.notifications[0].read).toBe(false);

    // Mark notification as read
    const notificationId = result.current.ui.notifications[0].id;
    
    act(() => {
      result.current.uiActions.markNotificationAsRead(notificationId);
    });

    // Notification should be marked as read
    expect(result.current.ui.notifications[0].read).toBe(true);

    // Remove notification
    act(() => {
      result.current.uiActions.removeNotification(notificationId);
    });

    // Should have no notifications again
    expect(result.current.ui.notifications).toHaveLength(0);
  });
});
