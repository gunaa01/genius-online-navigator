# Genius Online Navigator

A comprehensive marketing automation platform for managing ad campaigns, social media, AI content generation, and analytics.

![Genius Online Navigator](https://via.placeholder.com/1200x600?text=Genius+Online+Navigator)

## Project Overview

Genius Online Navigator is a powerful marketing automation platform designed to streamline digital marketing workflows. It provides a unified interface for managing ad campaigns, automating social media posts, generating AI-powered content, and analyzing performance metrics.

### Key Features

- **Ad Campaign Management**: Create, edit, and track performance of ad campaigns across multiple platforms
- **Social Media Automation**: Schedule and manage posts across various social media platforms
- **AI Content Generation**: Generate high-quality content with AI-powered templates
- **Analytics Dashboard**: Track key performance metrics with customizable dashboards
- **JWT Authentication**: Secure user authentication and authorization
- **Responsive Design**: Mobile-first approach with responsive UI components
- **Accessibility**: WCAG 2.1 AA compliant for maximum accessibility
- **Performance Optimized**: Code splitting, lazy loading, and resource optimization

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: React Router
- **Data Fetching**: TanStack Query
- **Backend**: FastAPI (Python)
- **Database**: Supabase
- **Authentication**: JWT
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/genius-online-navigator.git
cd genius-online-navigator
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Project Structure

```
genius-online-navigator/
├── docs/                  # Documentation files
├── public/                # Static assets
├── src/                   # Source code
│   ├── __tests__/         # Test files
│   ├── components/        # UI components
│   │   ├── auth/          # Authentication components
│   │   ├── hoc/           # Higher-order components
│   │   └── ui/            # UI components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── providers/         # Context providers
│   ├── services/          # API services
│   ├── store/             # Redux store
│   │   ├── middleware/    # Redux middleware
│   │   └── slices/        # Redux slices
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Entry point
├── .env                   # Environment variables
├── .eslintrc.js           # ESLint configuration
├── jest.config.js         # Jest configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Architecture

Genius Online Navigator follows a modern React architecture with the following key principles:

### Component Architecture

- **Atomic Design**: Components are organized following atomic design principles
- **Component Composition**: Complex components are built by composing smaller, reusable components
- **Separation of Concerns**: UI components are separated from business logic

### State Management

- **Redux**: Global state management with Redux Toolkit
- **Redux Persist**: Persistence of selected state slices
- **Local State**: Component-specific state using React hooks

### Data Flow

```
User Interaction → Component → Redux Action → Redux Reducer → State Update → UI Update
```

### Authentication Flow

```
Login Request → JWT Token → Store Token → Attach to Requests → Validate Token → Protected Routes
```

## Features in Detail

### Ad Campaign Management

The Ad Campaign Management module allows users to create, edit, and track performance of ad campaigns across multiple platforms.

**Key Capabilities:**
- Campaign creation with multi-platform support
- Budget management and allocation
- Performance tracking and reporting
- A/B testing and optimization

### Social Media Automation

The Social Media Automation module enables scheduling and management of posts across various social media platforms.

**Key Capabilities:**
- Post scheduling with platform-specific formatting
- Content calendar and planning
- Engagement tracking
- Account management and analytics

### AI Content Generation

The AI Content Generation module provides tools to create high-quality content using AI-powered templates.

**Key Capabilities:**
- Template-based content generation
- Multi-format support (blog posts, social media, ads)
- Content customization and personalization
- Content history and version management

### Analytics Dashboard

The Analytics Dashboard provides comprehensive insights into marketing performance across all channels.

**Key Capabilities:**
- Real-time performance metrics
- Custom date ranges and comparisons
- Channel-specific analytics
- Export and reporting functionality

## Performance Optimizations

Genius Online Navigator implements several performance optimizations:

- **Code Splitting**: Route-based code splitting with React.lazy
- **Lazy Loading**: Components and images are lazy-loaded
- **Bundle Optimization**: Minimized bundle size with tree shaking
- **Caching**: LRU cache for API responses and expensive calculations
- **Resource Optimization**: Optimized images and assets

## Accessibility

The application is designed to be WCAG 2.1 AA compliant with the following features:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA attributes and semantic HTML
- **Color Contrast**: Meets WCAG AA contrast requirements
- **Focus Management**: Visible focus indicators and logical tab order
- **Skip Links**: Skip navigation links for keyboard users

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Testing component interactions
- **Redux Tests**: Testing Redux actions, reducers, and selectors
- **Accessibility Tests**: Ensuring accessibility compliance

Run tests with:

```bash
npm test
```

Generate coverage report with:

```bash
npm run test:coverage
```

## Contributing

We welcome contributions to Genius Online Navigator! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact:

- Email: support@geniusonlinenavigator.com
- Website: https://geniusonlinenavigator.com

---

© 2025 Genius Online Navigator. All rights reserved.
