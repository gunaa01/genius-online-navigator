import uiReducer, {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  removeNotification
} from '@/store/slices/uiSlice';

describe('UI Slice', () => {
  const initialState = {
    theme: 'system' as const,
    sidebarOpen: true,
    notifications: [],
  };

  it('should handle initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual({
      theme: 'system',
      sidebarOpen: true,
      notifications: [],
    });
  });

  it('should handle setTheme', () => {
    const actual = uiReducer(initialState, setTheme('dark'));
    expect(actual.theme).toEqual('dark');
  });

  it('should handle toggleSidebar', () => {
    const actual = uiReducer(initialState, toggleSidebar());
    expect(actual.sidebarOpen).toEqual(false);

    const nextState = uiReducer(actual, toggleSidebar());
    expect(nextState.sidebarOpen).toEqual(true);
  });

  it('should handle setSidebarOpen', () => {
    const actual = uiReducer(initialState, setSidebarOpen(false));
    expect(actual.sidebarOpen).toEqual(false);
  });

  it('should handle addNotification', () => {
    const notification = {
      type: 'success' as const,
      message: 'Test notification',
    };
    
    const actual = uiReducer(initialState, addNotification(notification));
    expect(actual.notifications).toHaveLength(1);
    expect(actual.notifications[0].type).toEqual('success');
    expect(actual.notifications[0].message).toEqual('Test notification');
    expect(actual.notifications[0].read).toEqual(false);
    expect(actual.notifications[0].id).toBeDefined();
  });

  it('should handle markNotificationAsRead', () => {
    // First add a notification
    const stateWithNotification = uiReducer(
      initialState,
      addNotification({
        type: 'info' as const,
        message: 'Test notification',
      })
    );
    
    const notificationId = stateWithNotification.notifications[0].id;
    
    // Then mark it as read
    const actual = uiReducer(stateWithNotification, markNotificationAsRead(notificationId));
    expect(actual.notifications[0].read).toEqual(true);
  });

  it('should handle clearNotifications', () => {
    // First add some notifications
    let state = uiReducer(
      initialState,
      addNotification({
        type: 'info' as const,
        message: 'Test notification 1',
      })
    );
    
    state = uiReducer(
      state,
      addNotification({
        type: 'success' as const,
        message: 'Test notification 2',
      })
    );
    
    expect(state.notifications).toHaveLength(2);
    
    // Then clear them
    const actual = uiReducer(state, clearNotifications());
    expect(actual.notifications).toHaveLength(0);
  });

  it('should handle removeNotification', () => {
    // First add some notifications
    let state = uiReducer(
      initialState,
      addNotification({
        type: 'info' as const,
        message: 'Test notification 1',
      })
    );
    
    state = uiReducer(
      state,
      addNotification({
        type: 'success' as const,
        message: 'Test notification 2',
      })
    );
    
    const notificationId = state.notifications[0].id;
    
    // Then remove one
    const actual = uiReducer(state, removeNotification(notificationId));
    expect(actual.notifications).toHaveLength(1);
    expect(actual.notifications[0].id).not.toEqual(notificationId);
  });
});
