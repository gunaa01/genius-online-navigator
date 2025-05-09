# Genius Online Navigator - Digital Marketing Hub

![Genius Online Navigator](https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=Genius+Online+Navigator)

## Overview

Genius Online Navigator is a comprehensive digital marketing platform that serves as a central hub for all digital marketing activities. It integrates SEO, analytics, content management, social media, and client collaboration tools with a focus on user experience, performance, and scalability.

### Key Features

- **SEO Optimization**: XML sitemaps, schema markup, meta title/description customization, image alt-text optimization
- **Analytics & Tracking**: Google Analytics 4, Google Tag Manager, heatmap support, UTM parameter tracking
- **Content Management**: Blogging platform with categories, tags, and SEO-friendly URLs, multimedia support
- **Social Media & Ads**: Auto-posting to social platforms, dashboard for ad performance tracking
- **Lead Generation**: Form builder with CRM integration, A/B testing for CTAs and landing pages
- **Email Marketing**: Drip campaign automation, mobile-responsive templates, GDPR-compliant list management
- **Security & Compliance**: SSL/HTTPS, GDPR/CCPA cookie consent, data encryption
- **Client Collaboration**: Client portals for progress tracking, file sharing, role-based access control
- **Team Management**: Multi-tenancy support, real-time updates, role-based permissions
- **Content Management System**: Integrated Decap CMS for managing static pages, guides, and community posts

## Getting Started

### Prerequisites

- Node.js (v16+) & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/yourusername/genius-online-navigator.git

# Step 2: Navigate to the project directory
cd genius-online-navigator

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### Configuration

1. Create a `.env` file in the root directory based on `.env.example`
2. Add your API keys for third-party services:
   - Google Analytics 4
   - Google Tag Manager
   - Social media platforms (Facebook, Instagram, LinkedIn)
   - Email marketing services (Mailchimp, HubSpot)
   - Supabase URL and Anon Key

## Project Structure

```
genius-online-navigator/
├── src/
│   ├── components/      # UI components
│   │   ├── analytics/   # Analytics components
│   │   ├── collaboration/ # Client collaboration components
│   │   ├── compliance/  # GDPR/CCPA compliance components
│   │   ├── email/       # Email marketing components
│   │   ├── lead/        # Lead generation components
│   │   ├── seo/         # SEO components
│   │   ├── social/      # Social media components
│   │   ├── testing/     # A/B testing components
│   │   └── ui/          # Base UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API services
│   │   ├── analytics/   # Analytics services
│   │   ├── seo/         # SEO services
│   │   └── social-media/ # Social media services
│   ├── store/           # State management
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   └── routes.tsx       # Application routes
├── public/              # Static assets
├── content/             # Markdown content for Decap CMS
├── docs/                # Documentation
└── package.json         # Dependencies and scripts
```

## Technology Stack

### Frontend
- **Framework**: React.js with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router
- **Content Management**: Decap CMS

### Backend Integration
- **API Layer**: RESTful APIs
- **Database**: Supabase
- **Authentication**: Supabase Auth

### Third-Party Integrations
- **Analytics**: Google Analytics 4, Google Tag Manager
- **SEO**: SEMrush API, Google Search Console
- **Social Media**: Buffer/Hootsuite API
- **Email Marketing**: Mailchimp, HubSpot
- **Ads**: Google Ads API, Meta Ads API

## Core Modules

### 1. SEO Optimization

The SEO module provides tools for optimizing website content for search engines:

- **XML Sitemap Generator**: Automatically generates XML sitemaps for better search engine indexing
- **Schema Markup**: Implements JSON-LD structured data for rich snippets in search results
- **Meta Tag Management**: Tools for optimizing meta titles and descriptions
- **Image Alt-Text Optimizer**: Automatically generates descriptive alt text for images

### 2. Analytics & Tracking

Comprehensive analytics integration for tracking user behavior and marketing performance:

- **Google Analytics 4**: Full integration with GA4 for advanced analytics
- **Google Tag Manager**: Centralized tag management for all marketing tags
- **Heatmap Support**: Integration with tools like Hotjar for visual analytics
- **UTM Parameter Tracking**: Automatic tracking of campaign parameters

### 3. Social Media & Ads

Tools for managing social media presence and advertising campaigns:

- **Social Media Publisher**: Schedule and publish content to multiple platforms
- **Ad Campaign Manager**: Create and monitor ad campaigns across platforms
- **Performance Dashboard**: Track ROAS, CTR, and other key metrics

### 4. Lead Generation

Features for capturing and nurturing leads:

- **Lead Capture Forms**: Customizable forms with CRM integration
- **A/B Testing**: Test different CTAs and landing pages for optimization
- **Form Analytics**: Track form submissions and conversion rates

### 5. Email Marketing

Comprehensive email marketing tools:

- **Email Campaign Manager**: Create and manage email campaigns
- **Drip Campaign Automation**: Set up automated email sequences
- **GDPR Compliance**: Tools for managing subscriber consent

### 6. Client Collaboration

Tools for working with clients and teams:

- **Client Portal**: Secure area for clients to track progress and share files
- **Role-Based Access**: Control permissions based on user roles
- **Project Tracking**: Monitor project status and milestones

### 7. Team Management

Features for managing multi-user access:

- **Multi-tenancy**: Support for organizations and teams
- **User Roles**: Define and manage user permissions
- **Real-time Updates**: Collaborative features with real-time sync

### 8. Content Management with Decap CMS

The platform uses Decap CMS for managing static pages, guides, and community posts:

- **Pages**: Create and edit static pages (title, body, featured image)
- **Guides**: Add step-by-step "Offline-to-Online" guides
- **Community**: Post events, articles, and community updates

#### How to Use Decap CMS
1. Go to `/admin` (or `/admin/decap/` for the embedded UI)
2. Login with your credentials (Git Gateway or configured provider)
3. Use the sidebar to manage Pages, Guides, and Community collections
4. Save and publish content

## Supabase Setup

### 1. Create Supabase Project
- Go to https://app.supabase.com and create a new project
- Note your Project URL and Anon Key

### 2. Configure Environment Variables
Create `.env.local` in your frontend root:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

### 3. Database Schema Migration
Run these SQL commands in Supabase SQL editor:
```sql
create table if not exists context_chain (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  model_type text not null,
  context jsonb not null,
  session_id uuid not null default uuid_generate_v4(),
  timestamp timestamptz not null default now()
);

create table if not exists ai_suggestions (
  id uuid primary key default uuid_generate_v4(),
  content_hash text not null,
  suggestions jsonb not null,
  created_at timestamptz not null default now()
);

alter table context_chain enable row level security;
alter table ai_suggestions enable row level security;
```

### 4. Enable Row Level Security (RLS)
- In Supabase dashboard, go to each table > RLS > Enable
- Add policies to allow access only for authenticated users

### 5. Usage in Code
- Use the `useMCP` hook for context chain management
- Use Supabase client for real-time AI suggestion updates

## Documentation

For more detailed documentation, please refer to the following resources:

- [Digital Marketing Platform Architecture](./docs/DIGITAL_MARKETING_PLATFORM.md)
- [API Documentation](./docs/API.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Developer Guide](./docs/DEVELOPER.md)
- [Supabase Integration](./docs/SUPABASE.md)

## Deployment

The application can be deployed to various hosting platforms:

- **Netlify**: Recommended for frontend deployment
- **Vercel**: Alternative for frontend deployment
- **AWS/Cloudways**: For more scalable hosting solutions

For detailed deployment instructions, see [Deployment Guide](./docs/DEPLOYMENT.md).

## Security
- All API calls use Authorization header
- UI hides admin-only features for non-admins
- Never expose service role keys in frontend code
- Always validate user input and enforce RLS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Decap CMS](https://decapcms.org/)
