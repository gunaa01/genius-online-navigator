# Developer Documentation

This document provides detailed information for developers working on the Genius Online Navigator project. It covers architecture, code organization, development guidelines, and best practices.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Code Organization](#code-organization)
- [State Management](#state-management)
- [Component Guidelines](#component-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Security Guidelines](#security-guidelines)
- [API Integration](#api-integration)
- [Development Workflow](#development-workflow)

## Architecture Overview

Genius Online Navigator follows a modern React architecture with TypeScript for type safety. The application is built using Vite for fast development and optimized production builds.

### Key Architectural Patterns

- **Component-Based Architecture**: The UI is composed of reusable components
- **Flux Architecture**: One-way data flow using Redux
- **Container/Presentational Pattern**: Separation of logic and presentation
- **Higher-Order Components**: For cross-cutting concerns like accessibility
- **Custom Hooks**: For reusable stateful logic

### Technology Stack

- **Core**: React, TypeScript, Vite
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: React Router v6
- **UI Components**: shadcn-ui, Tailwind CSS
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form, Zod
- **Testing**: Jest, React Testing Library
- **Authentication**: JWT

## Code Organization

The project follows a feature-based organization with shared components and utilities:

```
src/
├── __tests__/           # Test files mirroring the src structure
├── components/          # Shared components
│   ├── auth/            # Authentication components
│   ├── hoc/             # Higher-order components
│   └── ui/              # UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components (route-based)
├── providers/           # Context providers
├── services/            # API services
├── store/               # Redux store
│   ├── middleware/      # Redux middleware
│   └── slices/          # Redux slices
└── utils/               # Utility functions
```

### Naming Conventions

- **Files**: PascalCase for components, camelCase for utilities
- **Components**: PascalCase (e.g., `Button.tsx`)
- **Hooks**: camelCase prefixed with "use" (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Tests**: Same name as the file being tested with `.test.ts(x)` suffix

## State Management

Genius Online Navigator uses Redux Toolkit for global state management with the following organization:

### Redux Store Structure

```
store/
├── index.ts             # Store configuration
├── hooks.ts             # Typed hooks (useAppDispatch, useAppSelector)
├── middleware/          # Custom middleware
│   ├── logger.ts        # Logging middleware
│   └── analytics.ts     # Analytics tracking middleware
└── slices/              # Feature slices
    ├── authSlice.ts     # Authentication state
    ├── uiSlice.ts       # UI state (theme, sidebar, notifications)
    ├── adCampaignSlice.ts  # Ad campaign state
    ├── socialMediaSlice.ts # Social media state
    ├── aiContentSlice.ts   # AI content state
    └── analyticsSlice.ts   # Analytics state
```

### State Management Guidelines

1. **Use Redux for Global State**: Application-wide state that is needed by multiple components
2. **Use Local State for Component State**: State that is only needed by a single component
3. **Use Redux Toolkit's `createSlice`**: For creating reducers and actions
4. **Use Typed Selectors**: For accessing state in a type-safe way
5. **Use Thunks for Async Logic**: For handling asynchronous operations
6. **Normalize Complex Data**: For efficient updates and lookups

### Example Redux Slice

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
}

const initialState: UiState = {
  theme: 'system',
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { setTheme, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
```

## Component Guidelines

### Component Structure

Components should follow this general structure:

```typescript
import React from 'react';
import { cn } from '@/utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'button-base',
          variant === 'outline' && 'button-outline',
          variant === 'ghost' && 'button-ghost',
          size === 'sm' && 'button-sm',
          size === 'lg' && 'button-lg',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
```

### Component Best Practices

1. **Use TypeScript**: Define proper interfaces for props
2. **Use `React.forwardRef`**: For forwarding refs to DOM elements
3. **Use `displayName`**: For better debugging
4. **Use Tailwind with `cn` utility**: For conditional class names
5. **Implement Accessibility**: Ensure components are accessible
6. **Implement Responsiveness**: Ensure components work on all screen sizes
7. **Use Composition**: Build complex components from simpler ones
8. **Minimize State**: Keep components as stateless as possible
9. **Document Components**: Add JSDoc comments for props and usage

## Performance Guidelines

Genius Online Navigator follows these performance guidelines to ensure fast load times and smooth user experience:

### Load Time Targets

- Initial page load: < 3 seconds
- Interactive content: < 1 second
- API response: < 500ms

### Performance Best Practices

1. **Code Splitting**: Use React.lazy for route-based code splitting
2. **Lazy Loading**: Lazy load images and non-critical components
3. **Memoization**: Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders
4. **Virtualization**: Use virtualized lists for long lists
5. **Bundle Size**: Keep bundle size under 200KB (gzipped)
6. **Image Optimization**: Optimize images, use WebP format, and proper dimensions
7. **Font Optimization**: Use system fonts or optimize web fonts
8. **CSS Optimization**: Use Tailwind's purge to remove unused CSS
9. **Tree Shaking**: Ensure proper imports for tree shaking
10. **Caching**: Implement proper caching strategies

### Performance Monitoring

The application includes a performance monitoring utility that tracks:

- Core Web Vitals (LCP, FID, CLS)
- Component render times
- API response times
- Resource loading times

## Accessibility Guidelines

Genius Online Navigator is designed to be WCAG 2.1 AA compliant with the following guidelines:

### Accessibility Requirements

- **Keyboard Navigation**: All interactive elements must be keyboard accessible
- **Screen Reader Support**: Use semantic HTML and ARIA attributes
- **Color Contrast**: Text must have a contrast ratio of at least 4.5:1
- **Focus Management**: Visible focus indicators and logical tab order
- **Error Handling**: Clear error messages and instructions
- **Form Labels**: All form fields must have proper labels
- **Alternative Text**: All images must have alt text
- **Headings**: Proper heading hierarchy

### Accessibility Tools

The project includes several accessibility utilities:

- **withAccessibility HOC**: Higher-order component for accessibility features
- **accessibility.ts**: Utility functions for accessibility
- **ARIA helpers**: Functions for generating ARIA attributes

### Example of Accessible Component

```typescript
import { withAccessibility } from '@/components/hoc/withAccessibility';
import { createButtonProps } from '@/utils/accessibility';

const BaseButton = ({ onClick, children, ...props }) => (
  <button {...createButtonProps(onClick)} {...props}>
    {children}
  </button>
);

export const AccessibleButton = withAccessibility(BaseButton, {
  role: 'button',
});
```

## Testing Guidelines

Genius Online Navigator follows these testing guidelines to ensure code quality and reliability:

### Testing Requirements

- **Minimum Coverage**: 80% code coverage
- **Unit Tests**: All components and utilities must have unit tests
- **Integration Tests**: Key user flows must have integration tests
- **Accessibility Tests**: Components must pass accessibility tests

### Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Testing React components
- **Mock Service Worker**: Mocking API requests
- **jest-axe**: Testing accessibility

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the correct class names', () => {
    render(<Button variant="outline" size="sm">Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button-outline');
    expect(button).toHaveClass('button-sm');
  });
});
```

## Security Guidelines

Genius Online Navigator follows these security guidelines to protect user data and prevent vulnerabilities:

### Security Requirements

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: All inputs must be validated
- **Output Encoding**: All outputs must be properly encoded
- **HTTPS**: All communication must be over HTTPS
- **CSRF Protection**: Implement CSRF tokens
- **XSS Protection**: Prevent cross-site scripting
- **Content Security Policy**: Implement CSP headers
- **Secure Dependencies**: Regular security audits of dependencies

### Authentication Implementation

The application uses JWT for authentication with the following flow:

1. User submits credentials
2. Server validates credentials and returns JWT
3. JWT is stored in localStorage
4. JWT is included in all API requests
5. Server validates JWT for protected routes
6. JWT is refreshed before expiration
7. User is logged out when JWT expires

## API Integration

Genius Online Navigator integrates with backend APIs using the following patterns:

### API Service Structure

```
services/
├── authService.ts       # Authentication API
├── adCampaignService.ts # Ad campaign API
├── socialMediaService.ts # Social media API
├── aiContentService.ts  # AI content API
└── analyticsService.ts  # Analytics API
```

### API Integration Guidelines

1. **Use Axios**: For HTTP requests
2. **Use TypeScript Interfaces**: For request and response types
3. **Use Error Handling**: Proper error handling and user feedback
4. **Use Authentication**: Include JWT token in requests
5. **Use Caching**: Cache responses when appropriate
6. **Use Loading States**: Show loading indicators during requests
7. **Use Retry Logic**: Implement retry logic for failed requests

### Example API Service

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Campaign {
  id: string;
  name: string;
  budget: number;
  status: 'active' | 'paused' | 'completed';
}

export const adCampaignService = {
  async getCampaigns(): Promise<Campaign[]> {
    const response = await axios.get(`${API_URL}/campaigns`);
    return response.data;
  },

  async getCampaign(id: string): Promise<Campaign> {
    const response = await axios.get(`${API_URL}/campaigns/${id}`);
    return response.data;
  },

  async createCampaign(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    const response = await axios.post(`${API_URL}/campaigns`, campaign);
    return response.data;
  },

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await axios.put(`${API_URL}/campaigns/${id}`, campaign);
    return response.data;
  },

  async deleteCampaign(id: string): Promise<void> {
    await axios.delete(`${API_URL}/campaigns/${id}`);
  },
};
```

## Development Workflow

### Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with required environment variables
4. Start the development server with `npm run dev`

### Development Process

1. **Create a Feature Branch**: `git checkout -b feature/feature-name`
2. **Implement the Feature**: Follow the guidelines in this document
3. **Write Tests**: Write unit and integration tests
4. **Create Documentation for New Features**: Document new features in relevant docs
5. **Submit PR for Review**: Create a PR on GitHub
6. **Run `npm run verify` Before Pushing**: Run `npm run verify` before pushing changes

### Testing Strategy

- **Unit Tests**: Test individual functions/components in isolation
- **Integration Tests**: Test component interactions
- **E2E Tests**: Critical user journeys (coming soon)
- **Visual Regression**: Storybook + Chromatic (coming soon)

### Performance Optimization

Key techniques used:

- Route-based code splitting
- Lazy loading of non-critical components
- Memoization of expensive calculations
- Optimized image loading
- Bundle analysis with `npm run analyze`

## Architecture Overview

The Genius Online Navigator follows a modern React application architecture with these key characteristics:

### Core Principles
- **Component-Based Architecture**: UI built with reusable, composable components
- **Unidirectional Data Flow**: Data flows down through props, events flow up
- **Separation of Concerns**: Clear division between UI, state management, and services
- **Type Safety**: TypeScript throughout the codebase
- **Performance First**: Code splitting, lazy loading, and optimized rendering

### Technical Stack

| Layer | Technologies |
|-------|-------------|
| **UI** | React 18, shadcn-ui, Tailwind CSS |
| **State** | Redux Toolkit, Redux Persist |
| **Routing** | React Router 6 |
| **Build** | Vite, esbuild |
| **Testing** | Jest, React Testing Library |
| **Linting** | ESLint, Prettier |
| **CI/CD** | GitHub Actions, Netlify |

## Code Organization

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # shadcn-ui components
│   └── features/    # Feature-specific components
├── hooks/           # Custom React hooks
├── pages/           # Page-level components
├── store/           # Redux store configuration
│   ├── slices/      # Redux feature slices
│   └── middleware/  # Redux middleware
├── services/        # API service layers
├── utils/           # Utility functions
├── styles/          # Global styles
└── assets/          # Static assets
```

## Contribution Guidelines

1. Follow TypeScript strict mode
2. Write JSDoc for all public APIs
3. Maintain 80%+ test coverage
4. Adhere to ESLint rules
5. Document new features in relevant docs
6. Update CHANGELOG.md for significant changes
