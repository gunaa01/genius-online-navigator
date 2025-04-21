# Genius Online Navigator Frontend

## Features
- Login, organization selection
- Team management (multi-tenancy)
- Real-time updates

## Setup
- Environment variables: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY
- Run: `npm start`

## Security
- All API calls use Authorization header
- UI hides admin-only features for non-admins

## Managing Content with Decap CMS

This project uses Decap CMS for managing static pages, guides, and community posts. Admins and editors can:

- **Pages**: Create and edit static pages (title, body, featured image)
- **Guides**: Add step-by-step "Offline-to-Online" guides
- **Community**: Post events, articles, and community updates

### How to Use Decap CMS
1. Go to `/admin` (or `/admin/decap/` for the embedded UI).
2. Login with your credentials (Git Gateway or configured provider).
3. Use the sidebar to manage Pages, Guides, and Community collections.
4. Save and publish content. The platform will automatically render:
   - `/pages/:slug` for static pages
   - `/guides` and `/guides/:slug` for guides
   - `/community` and `/community/:slug` for community posts

### Content Export
- Content is managed as Markdown in the `content/` directory and exported as JSON for the frontend.
- If needed, use a build script to convert Markdown to JSON for dynamic rendering.

### Routing
- All content is accessible via clean URLs (see `src/routes.tsx`).

For questions or advanced CMS customization, see the [Decap CMS documentation](https://decapcms.org/docs/intro/).
