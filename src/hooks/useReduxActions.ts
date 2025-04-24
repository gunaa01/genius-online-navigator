import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';

// Auth actions
import { 
  login, 
  logout, 
  register, 
  checkAuthStatus, 
  resetAuthError, 
  updateUserProfile 
} from '@/store/slices/authSlice';

// UI actions
import { 
  setTheme, 
  toggleSidebar, 
  setSidebarOpen, 
  addNotification, 
  markNotificationAsRead, 
  clearNotifications, 
  removeNotification 
} from '@/store/slices/uiSlice';

// Ad Campaign actions
import {
  fetchCampaigns,
  fetchCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  setSelectedCampaign,
  setFilters as setCampaignFilters,
  resetFilters as resetCampaignFilters,
  setSort as setCampaignSort,
  resetError as resetCampaignError
} from '@/store/slices/adCampaignSlice';

// Social Media actions
import {
  fetchPosts,
  fetchAccounts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  schedulePost,
  publishPost,
  connectAccount,
  disconnectAccount,
  setSelectedPost,
  setFilters as setSocialFilters,
  resetFilters as resetSocialFilters,
  setSort as setSocialSort,
  resetError as resetSocialError,
  addTag,
  removeTag
} from '@/store/slices/socialMediaSlice';

// AI Content actions
import {
  fetchTemplates,
  fetchGeneratedContents,
  fetchTemplateById,
  fetchContentById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  generateContent,
  deleteContent,
  setSelectedTemplate,
  setSelectedContent,
  setFilters as setContentFilters,
  resetFilters as resetContentFilters,
  setSort as setContentSort,
  resetError as resetContentError
} from '@/store/slices/aiContentSlice';

// Analytics actions
import {
  fetchAnalyticsData,
  setActiveDateRange,
  setCustomDateRange,
  toggleComparisonMode,
  setActiveMetrics,
  addActiveMetric,
  removeActiveMetric,
  resetError as resetAnalyticsError
} from '@/store/slices/analyticsSlice';

/**
 * Custom hook that provides access to all Redux actions and selectors
 * This makes it easier to use Redux in components and keeps the code DRY
 */
export const useReduxActions = () => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const auth = useAppSelector((state: RootState) => state.auth);
  const ui = useAppSelector((state: RootState) => state.ui);
  const adCampaign = useAppSelector((state: RootState) => state.adCampaign);
  const socialMedia = useAppSelector((state: RootState) => state.socialMedia);
  const aiContent = useAppSelector((state: RootState) => state.aiContent);
  const analytics = useAppSelector((state: RootState) => state.analytics);
  
  // Auth actions
  const authActions = {
    login: useCallback((email: string, password: string) => 
      dispatch(login({ email, password })), [dispatch]),
    
    logout: useCallback(() => 
      dispatch(logout()), [dispatch]),
    
    register: useCallback((data: { email: string; password: string; firstName: string; lastName: string }) => 
      dispatch(register(data)), [dispatch]),
    
    checkAuthStatus: useCallback(() => 
      dispatch(checkAuthStatus()), [dispatch]),
    
    resetAuthError: useCallback(() => 
      dispatch(resetAuthError()), [dispatch]),
    
    updateUserProfile: useCallback((data: any) => 
      dispatch(updateUserProfile(data)), [dispatch]),
  };
  
  // UI actions
  const uiActions = {
    setTheme: useCallback((theme: 'light' | 'dark' | 'system') => 
      dispatch(setTheme(theme)), [dispatch]),
    
    toggleSidebar: useCallback(() => 
      dispatch(toggleSidebar()), [dispatch]),
    
    setSidebarOpen: useCallback((isOpen: boolean) => 
      dispatch(setSidebarOpen(isOpen)), [dispatch]),
    
    addNotification: useCallback((notification: { type: 'info' | 'success' | 'warning' | 'error'; message: string }) => 
      dispatch(addNotification(notification)), [dispatch]),
    
    markNotificationAsRead: useCallback((id: string) => 
      dispatch(markNotificationAsRead(id)), [dispatch]),
    
    clearNotifications: useCallback(() => 
      dispatch(clearNotifications()), [dispatch]),
    
    removeNotification: useCallback((id: string) => 
      dispatch(removeNotification(id)), [dispatch]),
  };
  
  // Ad Campaign actions
  const adCampaignActions = {
    fetchCampaigns: useCallback(() => 
      dispatch(fetchCampaigns()), [dispatch]),
    
    fetchCampaignById: useCallback((id: string) => 
      dispatch(fetchCampaignById(id)), [dispatch]),
    
    createCampaign: useCallback((campaign: any) => 
      dispatch(createCampaign(campaign)), [dispatch]),
    
    updateCampaign: useCallback((id: string, data: any) => 
      dispatch(updateCampaign({ id, data })), [dispatch]),
    
    deleteCampaign: useCallback((id: string) => 
      dispatch(deleteCampaign(id)), [dispatch]),
    
    setSelectedCampaign: useCallback((campaign: any) => 
      dispatch(setSelectedCampaign(campaign)), [dispatch]),
    
    setFilters: useCallback((filters: any) => 
      dispatch(setCampaignFilters(filters)), [dispatch]),
    
    resetFilters: useCallback(() => 
      dispatch(resetCampaignFilters()), [dispatch]),
    
    setSort: useCallback((sort: any) => 
      dispatch(setCampaignSort(sort)), [dispatch]),
    
    resetError: useCallback(() => 
      dispatch(resetCampaignError()), [dispatch]),
  };
  
  // Social Media actions
  const socialMediaActions = {
    fetchPosts: useCallback(() => 
      dispatch(fetchPosts()), [dispatch]),
    
    fetchAccounts: useCallback(() => 
      dispatch(fetchAccounts()), [dispatch]),
    
    fetchPostById: useCallback((id: string) => 
      dispatch(fetchPostById(id)), [dispatch]),
    
    createPost: useCallback((post: any) => 
      dispatch(createPost(post)), [dispatch]),
    
    updatePost: useCallback((id: string, data: any) => 
      dispatch(updatePost({ id, data })), [dispatch]),
    
    deletePost: useCallback((id: string) => 
      dispatch(deletePost(id)), [dispatch]),
    
    schedulePost: useCallback((id: string, scheduledDate: string) => 
      dispatch(schedulePost({ id, scheduledDate })), [dispatch]),
    
    publishPost: useCallback((id: string) => 
      dispatch(publishPost(id)), [dispatch]),
    
    connectAccount: useCallback((platform: string) => 
      dispatch(connectAccount(platform)), [dispatch]),
    
    disconnectAccount: useCallback((id: string) => 
      dispatch(disconnectAccount(id)), [dispatch]),
    
    setSelectedPost: useCallback((post: any) => 
      dispatch(setSelectedPost(post)), [dispatch]),
    
    setFilters: useCallback((filters: any) => 
      dispatch(setSocialFilters(filters)), [dispatch]),
    
    resetFilters: useCallback(() => 
      dispatch(resetSocialFilters()), [dispatch]),
    
    setSort: useCallback((sort: any) => 
      dispatch(setSocialSort(sort)), [dispatch]),
    
    resetError: useCallback(() => 
      dispatch(resetSocialError()), [dispatch]),
    
    addTag: useCallback((tag: string) => 
      dispatch(addTag(tag)), [dispatch]),
    
    removeTag: useCallback((tag: string) => 
      dispatch(removeTag(tag)), [dispatch]),
  };
  
  // AI Content actions
  const aiContentActions = {
    fetchTemplates: useCallback(() => 
      dispatch(fetchTemplates()), [dispatch]),
    
    fetchGeneratedContents: useCallback(() => 
      dispatch(fetchGeneratedContents()), [dispatch]),
    
    fetchTemplateById: useCallback((id: string) => 
      dispatch(fetchTemplateById(id)), [dispatch]),
    
    fetchContentById: useCallback((id: string) => 
      dispatch(fetchContentById(id)), [dispatch]),
    
    createTemplate: useCallback((template: any) => 
      dispatch(createTemplate(template)), [dispatch]),
    
    updateTemplate: useCallback((id: string, data: any) => 
      dispatch(updateTemplate({ id, data })), [dispatch]),
    
    deleteTemplate: useCallback((id: string) => 
      dispatch(deleteTemplate(id)), [dispatch]),
    
    generateContent: useCallback((params: { templateId: string; parameters: any }) => 
      dispatch(generateContent(params)), [dispatch]),
    
    deleteContent: useCallback((id: string) => 
      dispatch(deleteContent(id)), [dispatch]),
    
    setSelectedTemplate: useCallback((template: any) => 
      dispatch(setSelectedTemplate(template)), [dispatch]),
    
    setSelectedContent: useCallback((content: any) => 
      dispatch(setSelectedContent(content)), [dispatch]),
    
    setFilters: useCallback((filters: any) => 
      dispatch(setContentFilters(filters)), [dispatch]),
    
    resetFilters: useCallback(() => 
      dispatch(resetContentFilters()), [dispatch]),
    
    setSort: useCallback((sort: any) => 
      dispatch(setContentSort(sort)), [dispatch]),
    
    resetError: useCallback(() => 
      dispatch(resetContentError()), [dispatch]),
  };
  
  // Analytics actions
  const analyticsActions = {
    fetchAnalyticsData: useCallback((params: { dateRange: '7d' | '30d' | '90d' | 'custom'; comparison?: boolean }) => 
      dispatch(fetchAnalyticsData(params)), [dispatch]),
    
    setActiveDateRange: useCallback((dateRange: '7d' | '30d' | '90d' | 'custom') => 
      dispatch(setActiveDateRange(dateRange)), [dispatch]),
    
    setCustomDateRange: useCallback((dateRange: { start: string; end: string }) => 
      dispatch(setCustomDateRange(dateRange)), [dispatch]),
    
    toggleComparisonMode: useCallback(() => 
      dispatch(toggleComparisonMode()), [dispatch]),
    
    setActiveMetrics: useCallback((metrics: string[]) => 
      dispatch(setActiveMetrics(metrics)), [dispatch]),
    
    addActiveMetric: useCallback((metric: string) => 
      dispatch(addActiveMetric(metric)), [dispatch]),
    
    removeActiveMetric: useCallback((metric: string) => 
      dispatch(removeActiveMetric(metric)), [dispatch]),
    
    resetError: useCallback(() => 
      dispatch(resetAnalyticsError()), [dispatch]),
  };
  
  return {
    // State
    auth,
    ui,
    adCampaign,
    socialMedia,
    aiContent,
    analytics,
    
    // Actions
    authActions,
    uiActions,
    adCampaignActions,
    socialMediaActions,
    aiContentActions,
    analyticsActions,
  };
};

export default useReduxActions;
