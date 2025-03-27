# Contributing Guide

Welcome to our freelancer portfolio platform! This guide will help you set up the project locally, understand our development workflow, and provide detailed instructions for managing content.

## Project Overview

This is a strategic freelancer portfolio platform designed to maximize professional visibility through dynamic, markdown-driven content management and interactive storytelling.

### Tech Stack

- Frontend: React + TypeScript + Vite
- UI Framework: shadcn/ui + Tailwind CSS
- Backend: Express.js
- Database: PostgreSQL
- Content: Markdown-based with gray-matter for frontmatter
- State Management: TanStack Query

## Content Management

This portfolio uses a markdown-based content management system for all dynamic content. The system is designed to be easy to extend and modify without requiring code changes. Below is a detailed explanation of how to work with different content types.

### Adding Content Cards

The portfolio uses a card-based UI pattern for displaying various types of content. Each content type (Features, Services, Projects, Blog Posts) follows a similar pattern but with specific requirements. Here's how to add new content cards for each type:

#### 1. Feature Cards

Feature cards highlight your key professional strengths and capabilities.

**File Location**: `content/features/your-feature-name.md`

**Required Frontmatter**:
```md
---
title: Feature Title
icon: Code2
description: A brief description of the feature (1-2 sentences)
highlights:
  - First key point about this feature
  - Second key point about this feature
  - Third key point about this feature
---

Content goes here in Markdown format.
```

**Icon Options**: Use icon names from the [Lucide React](https://lucide.dev/) library. Common options include:
- `Code2` - For development features
- `GitMerge` - For version control/collaboration features
- `AlertCircle` - For quality assurance features
- `Zap` - For performance-related features

**Component Structure**:
- Card with hover effect and shadow
- Icon + Title in header
- Description text
- Bullet points for highlights
- Clicking opens a dialog with full content

#### 2. Service Cards

Service cards showcase the services you offer to clients.

**File Location**: `content/services/your-service-name.md`

**Required Frontmatter**:
```md
---
title: Service Title
icon: Database
description: A brief description of what this service entails
---

Detailed explanation of the service in Markdown format.
```

**Icon Options**: Use icon names from the [Lucide React](https://lucide.dev/) library. Common options include:
- `Database` - For database services
- `Cloud` - For cloud services
- `Shield` - For security services
- `Code` - For development services
- `Brain` - For AI/ML services
- `ChartBar` - For analytics services

**Component Structure**:
- Card with hover effect and shadow
- Icon + Title in header
- Description text
- Clicking opens a dialog with full content

#### 3. Project Cards

Project cards showcase your past work and portfolio items.

**File Location**: `content/projects/your-project-slug.md`

**Required Frontmatter**:
```md
---
title: Project Title
description: Brief overview of the project
thumbnail: /path/to/thumbnail.jpg
type: image
publishedAt: 2023-01-15
challenge: Description of the challenge you faced
approach: How you approached solving the problem
implementation: Technical details of implementation
outcomes:
  - First measurable outcome
  - Second measurable outcome
technologies:
  - React
  - Node.js
  - PostgreSQL
---

Detailed project description in Markdown format.
```

**Type Options**:
- `image` - Standard image thumbnail
- `pdf` - Project with PDF attachments
- `slides` - Project with slide deck
- `text` - Text-only project

**Component Structure**:
- Card with thumbnail image
- Title and brief description
- Publication date
- Clicking opens a case study view with:
  - Challenge section
  - Approach section
  - Implementation details
  - Outcomes list
  - Technologies used
  - Full content in Markdown

#### 4. Blog Post Cards

Blog post cards feature your articles and thought leadership content.

**File Location**: `content/blogs/your-post-slug.md`

**Required Frontmatter**:
```md
---
title: Blog Post Title
excerpt: A brief excerpt or summary (1-2 sentences)
thumbnail: /path/to/thumbnail.jpg
publishedAt: 2023-02-20
---

Blog post content in Markdown format.
```

**Component Structure**:
- Card with thumbnail image
- Title and excerpt
- Publication date
- Clicking opens the full blog post

### Card Component Implementation Details

All content cards are built using the `Card` component from Shadcn UI, which provides a consistent look and feel across the site. The card component includes:

1. **Card** - The main container with rounded borders and shadow
2. **CardHeader** - Contains the title and icon or image
3. **CardContent** - Contains the main content or description
4. **CardFooter** - Contains additional information or actions (optional)

#### Styling Guidelines

To maintain a consistent look across all cards:

1. Use the hover effect `hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]` for interactive cards
2. Use `text-primary` for icons to maintain brand color
3. Use `text-muted-foreground` for descriptions to maintain hierarchy
4. Maintain consistent spacing with `gap-4` for icon/content spacing
5. Use consistent padding with `p-6` for card content

#### Adding New Icon Types

If you need to add a new icon that isn't in the existing `iconMap`:

1. Import the icon from `lucide-react` in the appropriate component file
2. Add the icon to the `iconMap` at the top of the component
3. Use the icon name in the markdown frontmatter

Example:
```tsx
import { NewIcon } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  // Existing icons...
  NewIcon: <NewIcon className="h-8 w-8" />,
};
```

#### Image Guidelines

For thumbnails and images:

1. Use consistent dimensions (recommended: 16:9 aspect ratio)
2. Optimize images for web (compress to <100KB where possible)
3. Store images in the `public` directory
4. Use relative paths starting with `/` in frontmatter

### Content Dialog Integration

When a user clicks on a card, a `ContentDialog` component displays the full content. This component renders Markdown content as HTML, allowing for rich text formatting.

To modify the dialog behavior:

1. Update the `ContentDialog` component in `client/src/components/content-dialog.tsx`
2. Customize the dialog size, animation, or styling as needed

### Handling Markdown Content

The application uses the `marked` library to parse Markdown. Supported Markdown features include:

- Headers (H1-H6)
- Lists (ordered and unordered)
- Links and images
- Code blocks
- Blockquotes
- Tables
- Emphasis (bold, italic)

### Adding New Content Types

To add an entirely new content type:

1. Create a new directory in `/content` (e.g., `/content/testimonials`)
2. Define a schema in `shared/schema.ts`
3. Create a utils file in `/server` (e.g., `testimonials-utils.ts`)
4. Add loading function in the utils file
5. Update `server/storage.ts` to include the new content type
6. Create a React component to display the content
7. Add an API endpoint in `server/routes.ts`
8. Update the homepage to include the new component

## Prerequisites

- Node.js v20 or later
- PostgreSQL v15 or later
- Git

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install Node.js:
   - Required version: v20 or later
   - Download from: https://nodejs.org/

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up PostgreSQL:
   - Install PostgreSQL 15 or later
   - Create a new database:
     ```sql
     CREATE DATABASE portfolio;
     ```
   - The application uses Drizzle ORM for database management

5. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/portfolio

   # Optional: For image uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Optional: For Google Calendar integration
   GOOGLE_CALENDAR_ID=your_calendar_id
   ```

6. Initialize the database:
   ```bash
   npm run db:push
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`.

## Project Structure

```
├── attached_assets/      # Static assets like profile photos
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── pages/      # Page components
├── content/             # Markdown content
│   ├── blogs/          # Blog posts
│   ├── features/       # Feature descriptions
│   ├── services/       # Service offerings
│   └── projects/       # Project showcases
├── server/             # Backend Express application
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data access layer
│   └── utils/          # Utility functions
└── shared/             # Shared TypeScript types and schemas
```

## Production Deployment

### Cloud Platform Deployment

#### Deploying to Vercel

1. Set up your Vercel account and connect your repository
2. Configure the project:
   - Build Command: `npm run build`
   - Output Directory: `dist/client`
   - Environment Variables: Add your `DATABASE_URL` and any other secrets
   - Install Command: `npm ci`

3. Configure the serverless function:
   Create a `vercel.json` file in the root directory:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": { "distDir": "dist/client" }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "dist/client/$1"
       }
     ]
   }
   ```

4. Deploy using the Vercel CLI:
   ```bash
   vercel --prod
   ```

#### Deploying to Netlify

1. Set up your Netlify account and connect your repository
2. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist/client`
   - Environment Variables: Add all required secrets

3. Create a `netlify.toml` file:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist/client"
     functions = "netlify/functions"

   [functions]
     directory = "netlify/functions"
     node_bundler = "esbuild"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

4. Create a serverless function for the API:
   Create `netlify/functions/api.ts`:
   ```typescript
   import serverless from 'serverless-http';
   import { app } from '../../server/index';

   export const handler = serverless(app);
   ```

#### Deploying to Railway

1. Create an account on Railway.app
2. Connect your GitHub repository
3. Add PostgreSQL service from the dashboard
4. Configure project environment variables:
   - `DATABASE_URL` will be automatically linked to the PostgreSQL service
   - Add any other required secrets
5. Deploy with settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `/`

### Docker Deployment

1. Create a Dockerfile:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
```

2. Create docker-compose.yml:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/portfolio
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./content:/app/content
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=portfolio
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

3. Build and run:
```bash
docker-compose up --build
```

### Web Server Configuration

#### Nginx Setup
```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS (uncomment if you're sure)
    # add_header Strict-Transport-Security "max-age=63072000" always;

    # Root directory and index
    root /path/to/app/dist/client;
    index index.html;

    # Asset caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    }

    # Everything else goes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Apache Setup
```apache
# /etc/apache2/sites-available/portfolio.conf
<VirtualHost *:80>
    ServerName your-domain.com
    Redirect permanent / https://your-domain.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/app/dist/client

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem

    # API Proxy
    ProxyPreserveHost On
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api

    # CORS Headers
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization"

    # Asset Caching
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js)$">
        Header set Cache-Control "max-age=604800, public"
    </FilesMatch>

    # SPA Routing
    <Directory /path/to/app/dist/client>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>
</VirtualHost>
```

### SSL Certificate Setup

Using Let's Encrypt:

```bash
# Install certbot
sudo apt install certbot

# For Nginx
sudo apt install python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

# For Apache
sudo apt install python3-certbot-apache
sudo certbot --apache -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Local Development Troubleshooting

#### Database Issues
1. Connection Errors:
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql

   # Verify connection
   psql $DATABASE_URL -c '\conninfo'

   # Create database if missing
   createdb portfolio
   ```

2. Migration Issues:
   ```bash
   # Clear database and recreate
   dropdb portfolio
   createdb portfolio
   npm run db:push

   # View current schema
   drizzle-kit introspect:pg
   ```

3. Permission Issues:
   ```sql
   -- Grant necessary permissions
   GRANT ALL PRIVILEGES ON DATABASE portfolio TO your_user;
   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
   ```

#### Build Issues
1. Clean Install:
   ```bash
   # Remove dependencies and reinstall
   rm -rf node_modules
   rm package-lock.json
   npm cache clean --force
   npm install
   ```

2. TypeScript Errors:
   ```bash
   # Clear TypeScript cache
   rm -rf dist
   rm tsconfig.tsbuildinfo
   npm run type-check
   ```

3. Vite Issues:
   ```bash
   # Clear Vite cache
   rm -rf node_modules/.vite
   ```

### Database Management

#### Backup Procedures
1. Automated Daily Backups:
   ```bash
   #!/bin/bash
   # /etc/cron.daily/portfolio-backup

   BACKUP_DIR="/path/to/backups"
   FILENAME="portfolio-$(date +%Y%m%d).sql"

   # Create backup
   pg_dump $DATABASE_URL > "$BACKUP_DIR/$FILENAME"

   # Compress
   gzip "$BACKUP_DIR/$FILENAME"

   # Keep last 30 days
   find "$BACKUP_DIR" -type f -mtime +30 -delete
   ```

2. Manual Backup:
   ```bash
   # Full backup
   npm run db:backup

   # Backup specific tables
   pg_dump -t table_name $DATABASE_URL > table_backup.sql
   ```

#### Restore Procedures
```bash
# Full restore
psql $DATABASE_URL < backup.sql

# Restore specific tables
psql $DATABASE_URL < table_backup.sql
```

### Environment Configuration

Create different environment files for different environments:

`.env.development`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://localhost:5432/portfolio
VITE_API_URL=http://localhost:5000
```

`.env.production`:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://production:password@localhost:5432/portfolio
VITE_API_URL=https://your-domain.com
```

`.env.test`:
```env
NODE_ENV=test
PORT=5000
DATABASE_URL=postgresql://localhost:5432/portfolio_test
VITE_API_URL=http://localhost:5000
```

Load environment variables based on environment:
```bash
# Development
source .env.development

# Production
source .env.production

# Test
source .env.test
```

### PM2 Process Manager

1. Install PM2:
```bash
npm install -g pm2
```

2. Create ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'portfolio',
    script: 'dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
```

3. Start with PM2:
```bash
pm2 start ecosystem.config.js
```

### Systemd Service

1. Create service file `/etc/systemd/system/portfolio.service`:
```ini
[Unit]
Description=Portfolio Application
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/path/to/app
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

2. Enable and start service:
```bash
systemctl enable portfolio
systemctl start portfolio
```

## CI/CD Setup

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/app
            git pull
            npm ci --production
            npm run build
            pm2 reload portfolio
```

## Development vs Production

### Development Environment Features
- Hot module reloading
- Detailed error messages
- Source maps enabled
- In-memory caching
- Development-specific logging

### Production Environment Features
- Optimized builds
- Minified assets
- Error tracking
- Production logging levels
- Performance monitoring

### Production Checklist

Before deploying to production:

1. Security:
   - Enable CORS protection
   - Set up rate limiting
   - Configure security headers
   - Enable HTTPS
   - Set secure cookie options
   - Implement proper authentication

2. Performance:
   - Enable compression
   - Configure caching headers
   - Optimize static assets
   - Set up CDN
   - Configure database indexes

3. Monitoring:
   - Set up error tracking
   - Configure application logging
   - Implement health checks
   - Monitor database performance
   - Track API metrics

4. Backup:
   - Set up database backups
   - Configure content backups
   - Store configuration backups
   - Test restore procedures


## Scripts and Commands

Available npm scripts:

```bash
# Development
npm run dev          # Start development server
npm run type-check   # Run TypeScript type checking
npm run lint         # Run ESLint
npm run format      # Run Prettier formatting

# Database
npm run db:push     # Push schema changes to database
npm run db:generate # Generate new migration
npm run db:backup   # Create database backup

# Production
npm run build       # Build for production
npm run start       # Start production server
```

## Environment Variables

Required environment variables:

```env
# Database (Required)
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# Server (Optional)
PORT=5000                    # Default: 5000
NODE_ENV=production         # Default: development
VITE_API_URL=https://your-domain.com

# Image Upload (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Calendar (Optional)
GOOGLE_CALENDAR_ID=your_calendar_id
```

### Maintenance

1. Regular Updates:
   ```bash
   # Update dependencies
   npm update

   # Check for vulnerabilities
   npm audit

   # Run tests
   npm run test
   ```

2. Database Maintenance:
   ```bash
   # Backup database
   npm run db:backup

   # Check database health
   pg_healthcheck $DATABASE_URL

   # Vacuum database
   psql $DATABASE_URL -c "VACUUM ANALYZE;"
   ```

3. Monitoring:
   ```bash
   # Check application logs
   tail -f /var/log/portfolio.log

   # Monitor database connections
   psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"
   ```

4. Content Management:
   - Regular backups of content directory
   - Monitor disk usage
   - Clean up unused uploads
   - Validate markdown content

### Common Issues and Solutions

1. Database Connection Issues:
   ```bash
   # Check connection
   psql $DATABASE_URL -c '\conninfo'

   # Verify permissions
   psql $DATABASE_URL -c '\du'
   ```

2. Build Problems:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

3. Server Issues:
   ```bash
   # Check Node.js version
   node --version

   # Verify port availability
   lsof -i :5000
   ```

4. Content Problems:
   ```bash
   # Verify file permissions
   ls -la content/

   # Check file syntax
   npm run content:validate
   ```

### Support and Resources

If you need help:
1. Check the troubleshooting section above
2. Review application logs
3. Open an issue in the repository
4. Contact the development team

For additional resources:
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Database Management
### Backup and Restore

The project includes a script for backing up the database:

```bash
# Create a backup
npm run db:backup

# The backup will be saved in the backup/ directory with timestamp
```

To restore from a backup:

```bash
# Replace <backup-file> with the actual backup file name
psql $DATABASE_URL < backup/<backup-file>
```

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style guidelines

3. Test your changes locally:
   ```bash
   npm run test        # Run tests
   npm run lint        # Run linter
   npm run type-check  # Check TypeScript types
   ```

4. Commit your changes following conventional commits:
   ```
   feat: add new feature
   fix: resolve bug
   docs: update documentation
   style: format code
   refactor: restructure code
   test: add tests
   chore: update dependencies
   ```

5. Push your changes and create a pull request

## Testing Guidelines

- Write tests for new features
- Ensure existing tests pass
- Test across different screen sizes
- Check accessibility using the built-in tools

## Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Use shadcn/ui components when possible
- Keep components small and focused
- Use appropriate semantic HTML elements
- Follow the Tailwind CSS class order convention

## Performance Considerations

- Optimize images before adding them
- Lazy load components when appropriate
- Use proper caching strategies
- Monitor bundle size

## Need Help?

Feel free to:
- Open an issue for bugs
- Start a discussion for features
- Ask questions in our community channels

Thank you for contributing!