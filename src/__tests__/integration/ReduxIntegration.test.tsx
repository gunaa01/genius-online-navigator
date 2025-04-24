import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupStore } from '@/utils/test-utils';
import useReduxActions from '@/hooks/useReduxActions';

// Create a test component that uses our Redux hooks
const TestComponent = () => {
  const { ui, uiActions } = useReduxActions();
  
  return (
    <div>
      <div data-testid="theme-value">Current theme: {ui.theme}</div>
      <div data-testid="sidebar-value">Sidebar open: {ui.sidebarOpen ? 'true' : 'false'}</div>
      <div data-testid="notifications-count">Notifications: {ui.notifications.length}</div>
      
      <button onClick={() => uiActions.setTheme('dark')}>Set Dark Theme</button>
      <button onClick={() => uiActions.toggleSidebar()}>Toggle Sidebar</button>
      <button onClick={() => uiActions.addNotification({ type: 'success', message: 'Test notification' })}>
        Add Notification
      </button>
      
      {ui.notifications.map((notification) => (
        <div key={notification.id} data-testid={`notification-${notification.id}`}>
          <span>{notification.message}</span>
          <button onClick={() => uiActions.markNotificationAsRead(notification.id)}>Mark as Read</button>
          <button onClick={() => uiActions.removeNotification(notification.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

describe('Redux Integration', () => {
  it('correctly integrates Redux with React components', async () => {
    const store = setupStore();
    
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    // Check initial state
    expect(screen.getByTestId('theme-value')).toHaveTextContent('Current theme: system');
    expect(screen.getByTestId('sidebar-value')).toHaveTextContent('Sidebar open: true');
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('Notifications: 0');
    
    // Change theme
    await userEvent.click(screen.getByText('Set Dark Theme'));
    expect(screen.getByTestId('theme-value')).toHaveTextContent('Current theme: dark');
    
    // Toggle sidebar
    await userEvent.click(screen.getByText('Toggle Sidebar'));
    expect(screen.getByTestId('sidebar-value')).toHaveTextContent('Sidebar open: false');
    
    // Add notification
    await userEvent.click(screen.getByText('Add Notification'));
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('Notifications: 1');
    expect(screen.getByText('Test notification')).toBeInTheDocument();
    
    // Mark notification as read
    const notificationId = store.getState().ui.notifications[0].id;
    await userEvent.click(screen.getByText('Mark as Read'));
    
    // Check if notification is marked as read in the store
    expect(store.getState().ui.notifications[0].read).toBe(true);
    
    // Remove notification
    await userEvent.click(screen.getByText('Remove'));
    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('Notifications: 0');
    });
  });
  
  it('correctly handles async actions', async () => {
    // Create a mock store with thunks that resolve immediately
    const mockStore = setupStore();
    
    // Create a component that uses async actions
    const AsyncTestComponent = () => {
      const { auth, authActions } = useReduxActions();
      
      return (
        <div>
          <div data-testid="loading-state">Loading: {auth.isLoading ? 'true' : 'false'}</div>
          <div data-testid="auth-state">Authenticated: {auth.isAuthenticated ? 'true' : 'false'}</div>
          <div data-testid="error-state">Error: {auth.error || 'none'}</div>
          
          <button onClick={() => authActions.login('test@example.com', 'password')}>Login</button>
          <button onClick={() => authActions.logout()}>Logout</button>
        </div>
      );
    };
    
    render(
      <Provider store={mockStore}>
        <AsyncTestComponent />
      </Provider>
    );
    
    // Check initial state
    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading: false');
    expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated: false');
    
    // Trigger login
    await userEvent.click(screen.getByText('Login'));
    
    // First, it should set loading to true
    // Then it should set authenticated to true
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated: true');
    });
    
    // Trigger logout
    await userEvent.click(screen.getByText('Logout'));
    
    // It should set authenticated to false
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated: false');
    });
  });
});
