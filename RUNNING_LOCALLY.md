# Running the Portfolio Application Locally

This comprehensive guide will help you set up, run, and customize the Portfolio application on your local machine or any platform outside of Replit.

## Overview

This application is a modern, performance-optimized professional portfolio website built with:

- **Frontend**: React 18 with TypeScript, Vite for fast development, TailwindCSS for styling
- **UI Components**: shadcn/ui component library for consistent design patterns
- **Backend**: Express.js API server with TypeScript
- **Database**: PostgreSQL for data persistence with Drizzle ORM
- **Content Management**: Markdown-based content system with frontmatter
- **State Management**: TanStack React Query for efficient data fetching
- **Performance**: Memoized components and server-side caching
- **Design**: Consistent card styling with border-top treatments across all components

The application is designed to showcase professional services, expertise, project work, and blog content in a cohesive, visually appealing format. All content maintains a consistent second-person plural voice (we, us, our) throughout to present a unified professional brand.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) (version 8.x or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 14.x or higher)
- Git (optional, for cloning the repository)

## Setup Instructions

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

Or download and extract the zip file from the repository.

### 2. Install Dependencies

Install all required Node.js packages:

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a PostgreSQL database for the application:

```bash
createdb portfolio_db
```

Alternatively, you can create the database using pgAdmin or any other PostgreSQL client.

### 4. Configure Environment Variables

Create a `.env` file in the root directory of the project with the following content:

```
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
PORT=5000
```

Replace `username` and `password` with your PostgreSQL credentials. If you're using a PostgreSQL instance without a password on localhost, you can use:

```
DATABASE_URL=postgresql://localhost:5432/portfolio_db
```

Note: The default port is set to 5000 to match the Replit configuration.

### 5. Initialize the Database Schema

The application uses Drizzle ORM for database operations. To set up your database schema, run:

```bash
npm run db:push
```

This command will create all necessary tables in your database based on the schema defined in `shared/schema.ts`.

### 6. Adding Initial Content

The application loads content from Markdown files in the `content` directory. The repository includes sample content in these directories:

- `content/blog/` - Blog posts
- `content/projects/` - Portfolio projects
- `content/services/` - Service offerings (individual service details)
- `content/features/` - Professional expertise categories (higher-level service domains)

The content will be automatically synced to the database when the application starts.

#### Site Structure

The portfolio website consists of the following main sections:

1. **Hero Section** - Professional introduction with profile information
2. **Professional Expertise** - High-level service domains with key highlights (from `features` content)
3. **Services** - Detailed professional services with specialized offerings (from `services` content)
4. **Projects** - Showcased project work with case studies (from `projects` content)
5. **Blog** - Professional articles and publications (from `blog` content)
6. **Contact** - Contact information and social links

Note: The application intentionally doesn't include Process or Testimonials sections as they've been removed from the design for a more streamlined user experience.

### 7. Starting the Application

To start the application in development mode with hot reloading:

```bash
npm run dev
```

This command runs both the Express backend server and the Vite development server.

For production environments:

```bash
npm run build
npm start
```

The application will be available at `http://localhost:5000`.

## Application Structure

- `client/` - React frontend built with Vite
  - `src/components/` - UI components (includes optimized memoized components)
  - `src/pages/` - Page components 
  - `src/hooks/` - Custom React hooks
  - `src/lib/` - Utility functions and configuration
- `server/` - Express backend
  - `*-utils.ts` - Content loading utilities for features, services, blog posts, and projects
  - `storage.ts` - Database interface with caching
  - `routes.ts` - API endpoints
  - `db.ts` - Database connection
  - `cache-service.ts` - In-memory caching service for performance
- `shared/` - Shared TypeScript types and schema definitions
- `content/` - Markdown content for various sections
- `uploads/` - User uploaded files (created at runtime)

## Content Management

The application uses a hybrid approach for content management:

1. Content is authored as Markdown files in the `content/` directory
2. On application startup, content is synchronized to the PostgreSQL database
3. The application serves content from the database for performance

### Adding New Services

Create a new markdown file in `content/services/` following this template:

```markdown
---
title: Service Name
icon: IconName
description: Brief description of the service
---

# Service Title

Detailed service description paragraph that explains what we offer to clients. 
Always use second-person plural voice (we, us, our) throughout all content.
Vary your introduction style for more engaging content rather than always starting 
with "We provide" or "We offer".

## Section Heading

- **Key Capability** - Detailed explanation of this capability and its benefits
- **Another Capability** - More information about what we can deliver
- **Third Capability** - Additional details about our service offerings

## Another Section

- **Implementation Approach** - How we implement this service effectively
- **Quality Assurance** - Our quality control processes
- **Delivery Timeline** - Typical timelines for this service
```

Icons should correspond to [Lucide icons](https://lucide.dev/icons/) names (e.g., `Code`, `Database`, `Cloud`, etc.).

### Adding Professional Expertise Categories

Create a new markdown file in `content/features/` following this template:

```markdown
---
title: Expertise Category
icon: IconName
description: Brief description of this expertise domain
highlights:
  - Key highlight one
  - Key highlight two
  - Key highlight three
  - Key highlight four
  - Key highlight five
---

# Full Category Title

Introduction paragraph explaining this expertise area. Always use second-person plural voice 
(we, us, our) throughout all content to maintain consistency.

## Section Heading

- **Capability One** - Detailed explanation of this capability with specific details
- **Capability Two** - More information about what we deliver in this area
- **Capability Three** - Additional details about our expertise
- **Capability Four** - Further information about our skills
- **Capability Five** - Final detail about this section

## Another Section

- **Another Capability** - Description of this capability
- **More Capabilities** - Additional specialized skills
- **Technical Depth** - Information about our technical expertise
- **Process Excellence** - Details about our methodology
- **Best Practices** - How we implement industry best practices
```

Icons for the Professional Expertise should be chosen from: `Database`, `Brain`, `Cloud`, `Shield`, `CreditCard`, or `Zap`.

### Adding New Projects

Create a new markdown file in `content/projects/` following this template:

```markdown
---
title: Project Title
slug: project-slug
description: Brief project description
thumbnail: /path/to/thumbnail.jpg
type: text
technologies:
  - Technology 1
  - Technology 2
challenge: Description of the challenge
approach: Description of your approach
implementation: Technical implementation details
outcomes:
  - Outcome 1
  - Outcome 2
---

# Project Title

Detailed project description. Use second-person plural voice (we, us, our) 
when describing how the project was executed and delivered.

## Additional Details

Any additional information about the project...
```

For project thumbnails, add images to the `client/public` directory and reference them with paths starting with `/`.

### Updating Blog Posts

Create or modify markdown files in `content/blog/` following this template:

```markdown
---
title: Blog Post Title
slug: blog-post-slug
excerpt: Brief excerpt of the blog post (appears in previews)
thumbnail: /path/to/thumbnail.jpg
publishedAt: 2023-01-01
---

# Blog Post Title

Blog post content in markdown format. You can use all standard markdown 
formatting including:

## Headings

- Bullet points
- More bullet points

### Code examples

```javascript
const example = "This is a code example";
console.log(example);
```

For blog post thumbnails, add images to the `client/public` directory and reference them with paths starting with `/`.

## Database Management

### Viewing Database Content

To view the content in your database, you can connect with any PostgreSQL client using your database credentials, or use the `psql` command line:

```bash
psql -d portfolio_db
```

Then explore the tables:

```sql
\dt                           -- list all tables
SELECT * FROM profile;        -- view profile information
SELECT * FROM projects;       -- view projects
SELECT * FROM blog_posts;     -- view blog posts
```

### Database Migrations

When you make changes to the database schema in `shared/schema.ts`, you need to update your database structure:

```bash
npm run db:push
```

Note: This will attempt to update the schema without data loss, but if breaking changes are detected, you'll be prompted to confirm.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify your PostgreSQL service is running: `service postgresql status` or equivalent for your OS
2. Check your DATABASE_URL in the .env file for correct syntax and credentials
3. Make sure your database user has appropriate permissions: `GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO username;`
4. Test the connection directly: `psql "postgresql://username:password@localhost:5432/portfolio_db"`

### Content Not Appearing

If you've added content but it doesn't appear:

1. Make sure your markdown files follow the correct format with proper frontmatter
2. Check that your files are in the correct directories with `.md` extension
3. Restart the application to reload content from files: `npm run dev`
4. Check the server logs for any errors during content loading
5. Verify the content was synced to the database by querying the appropriate tables

### API Endpoint Issues

If API endpoints are not working:

1. Check the server logs for errors
2. Verify that the endpoint path is correct (all endpoints start with `/api/`)
3. Check your browser's network tab to see the request/response details
4. Try accessing the endpoint directly, e.g., `http://localhost:5000/api/features`

### React Component Rendering Issues

If components aren't rendering properly:

1. Check browser console for JavaScript errors
2. Verify that the component is receiving the expected props
3. Use React Developer Tools to inspect component state and props
4. Add console logs to trace data flow through components

## Performance Optimizations

The application includes several performance optimizations:

### React.memo for Component Optimization

Key components have been memoized using React.memo to prevent unnecessary re-renders:

1. **BlogSection** - Optimized to only re-render when blog posts change
2. **Features** - Memoized to avoid re-rendering when other parts of the app update
3. **ProjectGrid** - Optimized for efficient rendering of project cards
4. **Services** - Memoized to improve performance for service card rendering

These optimizations help reduce the rendering workload, especially for complex components with many child elements.

### Caching System

The application implements a robust in-memory caching system:

1. **Server-Side Cache** - The `cache-service.ts` provides a singleton cache instance with automatic expiration
2. **API Response Caching** - Database query results are cached to minimize repeated database access
3. **Cache Invalidation** - The cache is automatically invalidated when related data is updated

You can customize the cache duration by modifying the `CACHE_DURATION` value in `server/cache-service.ts`.

## Customization

### Styling and Theming

The application uses Tailwind CSS with the shadcn/ui component library. To customize the appearance:

1. Modify `theme.json` to change the primary color and theme variant
2. Edit `tailwind.config.ts` to add custom color schemes or typography
3. Component styles can be customized in their respective files in `client/src/components/ui`

#### Card Styling Consistency

All cards across the website (service cards, project cards, blog cards, feature cards) follow a consistent visual style:

1. **Top Border Styling**: Each card has a `border-t-4 border-t-primary` class that creates the distinctive "black fade" border-top effect
2. **Hover Effects**: Consistent hover animations with subtle scaling (`hover:scale-[1.02]`) and shadow effects (`hover:shadow-lg`)
3. **Transition Effects**: All hover animations use smooth transitions with `transition-all`
4. **No Arrow Icons**: Cards intentionally don't include right arrow icons for cleaner design
5. **Rounded Corners**: All cards use the standard shadcn card component with consistent corner rounding

To maintain visual consistency, always use these styling conventions when adding new card components.

### Adding New Pages

To add a new page to the application:

1. Create a new React component in `client/src/pages/`
2. Register the route in `client/src/App.tsx` using the `wouter` routing library

### Adding Custom API Endpoints

To add new API endpoints:

1. Update the storage interface in `server/storage.ts` to add new data access methods
2. Add the new endpoint handlers in `server/routes.ts`
3. Implement any required utility functions in a dedicated file

## Deployment Considerations

When deploying to production environments:

1. Set up proper environment variables for production
2. Configure a production-ready PostgreSQL database with proper backup strategies
3. Use a process manager like PM2 to keep the application running
4. Set up proper NGINX or similar for routing and SSL
5. Consider adding a CDN for static assets
6. Implement proper logging and monitoring solutions

### Deployment to Major Cloud Providers

#### AWS

1. Use Elastic Beanstalk for the Node.js application or containerize with ECS/EKS
2. Set up RDS for PostgreSQL database
3. Configure S3 for file uploads and static assets
4. Use CloudFront as a CDN

#### Google Cloud Platform

1. Deploy the application to Cloud Run or GKE
2. Use Cloud SQL for PostgreSQL
3. Store files in Cloud Storage
4. Configure Cloud CDN

#### Microsoft Azure

1. Deploy to App Service or AKS
2. Use Azure Database for PostgreSQL
3. Store files in Azure Blob Storage
4. Configure Azure CDN

#### Heroku

1. Deploy with the Node.js buildpack
2. Add the Heroku PostgreSQL addon
3. Configure proper build scripts in package.json
4. Set up proper environment variables

For any deployment target, ensure you have appropriate monitoring, logging, and backup strategies in place.