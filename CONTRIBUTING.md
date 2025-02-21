# Contributing Guide

Welcome to our freelancer portfolio platform! This guide will help you set up the project locally and understand our development workflow.

## Project Overview

This is a strategic freelancer portfolio platform designed to maximize professional visibility through dynamic, markdown-driven content management and interactive storytelling.

### Tech Stack

- Frontend: React + TypeScript + Vite
- UI Framework: shadcn/ui + Tailwind CSS
- Backend: Express.js
- Database: PostgreSQL
- Content: Markdown-based with gray-matter for frontmatter
- State Management: TanStack Query

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

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
   ```

4. Start the development server:
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
│   ├── process/        # Process steps
│   ├── projects/       # Project showcases
│   ├── services/       # Service offerings
│   └── testimonials/   # Client testimonials
├── server/             # Backend Express application
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data access layer
│   └── utils/          # Utility functions
└── shared/             # Shared TypeScript types and schemas
```

## Configuration

The project uses several configuration files:

- `vite.config.ts`: Vite bundler configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `theme.json`: UI theme configuration
- `tsconfig.json`: TypeScript configuration
- `drizzle.config.ts`: Database ORM configuration

### Theme Customization

1. Edit `theme.json` to modify the color scheme and appearance:
```json
{
  "primary": "#0066cc",
  "variant": "professional",
  "appearance": "system",
  "radius": 0.5
}
```

### Content Management

Content is managed through Markdown files in the `content/` directory. Each content type follows a specific frontmatter schema:

```markdown
---
title: Example Title
description: Brief description
icon: IconName    # From lucide-react
---

Content in Markdown format
```

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