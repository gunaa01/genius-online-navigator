# Deployment Guide

This guide provides comprehensive instructions for deploying the Genius Online Navigator application to various environments, including local development, staging, and production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring and Logging](#monitoring-and-logging)
- [Rollback Procedures](#rollback-procedures)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)

## Prerequisites

Before deploying the Genius Online Navigator application, ensure you have the following:

- Node.js (v16.x or later)
- npm (v8.x or later)
- Git
- Access to the deployment environment (Netlify, Vercel, or your preferred hosting platform)
- API keys and credentials for all integrated services
- Access to the backend API server

## Environment Configuration

The application uses environment variables for configuration. Create the following `.env` files for different environments:

### `.env.development` (Local Development)

```
VITE_API_URL=http://localhost:8000/api/v1
VITE_ENVIRONMENT=development
VITE_ENABLE_MOCK_API=true
VITE_ENABLE_REDUX_LOGGER=true
```

### `.env.staging` (Staging Environment)

```
VITE_API_URL=https://api-staging.geniusonlinenavigator.com/api/v1
VITE_ENVIRONMENT=staging
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_REDUX_LOGGER=false
```

### `.env.production` (Production Environment)

```
VITE_API_URL=https://api.geniusonlinenavigator.com/api/v1
VITE_ENVIRONMENT=production
VITE_ENABLE_MOCK_API=false
VITE_ENABLE_REDUX_LOGGER=false
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Base URL for the backend API | https://api.geniusonlinenavigator.com/api/v1 |
| VITE_ENVIRONMENT | Current environment | development, staging, production |
| VITE_ENABLE_MOCK_API | Enable mock API responses | true, false |
| VITE_ENABLE_REDUX_LOGGER | Enable Redux logger middleware | true, false |

## Local Development

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/genius-online-navigator.git
   cd genius-online-navigator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.development` file with your local configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The application will be available at `http://localhost:5173`.

### Building for Local Testing

To build and test the production build locally:

1. Build the application:
   ```bash
   npm run build
   ```

2. Preview the built application:
   ```bash
   npm run preview
   ```

3. The application will be available at `http://localhost:4173`.

## Staging Deployment

The staging environment is used for testing before deploying to production. We use Netlify for our staging environment.

### Manual Deployment to Staging

1. Build the application with staging environment variables:
   ```bash
   npm run build:staging
   ```

2. Deploy to Netlify using the Netlify CLI:
   ```bash
   netlify deploy --dir=dist --site=your-staging-site-id
   ```

### Automated Deployment to Staging

The CI/CD pipeline automatically deploys to staging when changes are pushed to the `develop` branch. See the [CI/CD Pipeline](#cicd-pipeline) section for more details.

## Production Deployment

The production environment is the live environment used by end users. We use Netlify for our production environment.

### Manual Deployment to Production

1. Build the application with production environment variables:
   ```bash
   npm run build:production
   ```

2. Deploy to Netlify using the Netlify CLI:
   ```bash
   netlify deploy --dir=dist --prod --site=your-production-site-id
   ```

### Automated Deployment to Production

The CI/CD pipeline automatically deploys to production when changes are pushed to the `main` branch. See the [CI/CD Pipeline](#cicd-pipeline) section for more details.

## CI/CD Pipeline

We use GitHub Actions for our CI/CD pipeline. The pipeline is defined in `.github/workflows/ci-cd.yml`.

### Pipeline Stages

1. **Lint**: Runs ESLint and TypeScript type checking
2. **Test**: Runs Jest tests and uploads coverage reports
3. **Accessibility**: Runs accessibility tests using axe-cli
4. **Build**: Builds the application and uploads artifacts
5. **Security**: Runs security scans using npm audit and Snyk
6. **Performance**: Runs performance checks using Lighthouse CI
7. **Deploy to Staging**: Deploys to the staging environment (develop branch only)
8. **Deploy to Production**: Deploys to the production environment (main branch only)

### Triggering the Pipeline

- Push to the `develop` branch: Triggers the pipeline up to the "Deploy to Staging" stage
- Push to the `main` branch: Triggers the full pipeline including "Deploy to Production"
- Pull request to `develop` or `main`: Triggers the pipeline up to the "Performance" stage

### Pipeline Configuration

The pipeline requires the following secrets to be configured in GitHub:

- `NETLIFY_AUTH_TOKEN`: Netlify authentication token
- `NETLIFY_STAGING_SITE_ID`: Netlify site ID for staging
- `NETLIFY_PRODUCTION_SITE_ID`: Netlify site ID for production
- `CODECOV_TOKEN`: Token for uploading coverage reports to Codecov
- `SNYK_TOKEN`: Token for Snyk security scanning

## Monitoring and Logging

### Application Monitoring

We use the following tools for monitoring the application:

- **Performance Monitoring**: The application includes a performance monitoring utility (`src/utils/performance.ts`) that tracks web vitals, component render times, API response times, and resource metrics.

- **Error Tracking**: We use Sentry for error tracking. The ErrorBoundary component captures and reports JavaScript errors.

### Setting Up Sentry

1. Create a Sentry account and project at https://sentry.io
2. Add the Sentry DSN to your environment variables:
   ```
   VITE_SENTRY_DSN=https://your-sentry-dsn
   ```
3. Sentry is already integrated in the ErrorBoundary component.

### Logging

The application logs important events to the console in development and sends them to our logging service in production. The logging utility is defined in `src/utils/logger.ts`.

## Rollback Procedures

### Rolling Back a Netlify Deployment

1. Go to the Netlify dashboard
2. Select your site
3. Go to the "Deploys" tab
4. Find the previous working deployment
5. Click the "Publish deploy" button to roll back to that deployment

### Rolling Back Using Git

1. Find the commit hash of the last working version
2. Create a new branch from that commit:
   ```bash
   git checkout -b rollback-branch <commit-hash>
   ```
3. Push the branch to GitHub:
   ```bash
   git push origin rollback-branch
   ```
4. Create a pull request from `rollback-branch` to `main` or `develop`
5. Merge the pull request to trigger a new deployment

## Security Considerations

### JWT Token Storage

The application stores JWT tokens in localStorage. To enhance security:

- Tokens are encrypted before storage
- Tokens have a short expiration time (1 hour)
- Refresh tokens are used to obtain new access tokens
- Tokens are automatically cleared on logout or session expiration

### API Security

The API uses the following security measures:

- HTTPS for all API requests
- CORS configuration to restrict access to known domains
- Rate limiting to prevent abuse
- Input validation using Zod
- JWT authentication for protected endpoints

### Content Security Policy

The application includes a Content Security Policy (CSP) to prevent XSS attacks. The CSP is defined in the `index.html` file.

## Performance Optimization

The application includes several performance optimizations:

### Code Splitting

The application uses React.lazy and Suspense for code splitting. Each route is loaded on demand, reducing the initial bundle size.

### Image Optimization

The Image component (`src/components/ui/image.tsx`) includes several optimizations:

- Lazy loading
- Responsive images
- Blur-up loading
- WebP format support

### Caching

The application includes an LRU cache utility (`src/utils/cache.ts`) for caching API responses and expensive calculations.

### Bundle Size Optimization

To keep the bundle size small:

- Use the dynamic import utility (`src/utils/dynamicImport.ts`) for importing large dependencies
- Run `npm run analyze` to analyze the bundle size and identify large dependencies
- Use tree-shaking compatible imports (e.g., `import { Button } from '@/components/ui'` instead of `import Button from '@/components/ui/button'`)

## Troubleshooting

### Common Deployment Issues

#### Build Fails with TypeScript Errors

1. Run `npm run type-check` locally to identify the errors
2. Fix the TypeScript errors and commit the changes
3. Push the changes to trigger a new deployment

#### API Connectivity Issues

1. Check that the API URL is correctly set in the environment variables
2. Verify that the API server is running and accessible
3. Check for CORS issues in the browser console
4. Verify that the JWT token is being correctly sent in the Authorization header

#### Performance Issues

1. Run Lighthouse locally to identify performance issues:
   ```bash
   npx lighthouse https://your-site.netlify.app --view
   ```
2. Check for large bundle sizes using the bundle analyzer:
   ```bash
   npm run analyze
   ```
3. Optimize images and other assets
4. Implement additional code splitting if needed

## Conclusion

This deployment guide covers the basic procedures for deploying the Genius Online Navigator application. For more detailed information, refer to the specific documentation for your hosting platform (Netlify, Vercel, etc.) and the CI/CD system (GitHub Actions).

If you encounter any issues not covered in this guide, please contact the development team or create an issue in the GitHub repository.

---

© 2025 Genius Online Navigator. All rights reserved.
