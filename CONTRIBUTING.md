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
│   ├── services/       # Service offerings
│   └── projects/       # Project showcases
├── server/             # Backend Express application
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data access layer
│   └── utils/          # Utility functions
└── shared/             # Shared TypeScript types and schemas
```

## Adding New Content

### Adding Blog Posts
Create a new markdown file in `content/blogs/` with the following structure:
```markdown
---
title: Your Blog Title
excerpt: A brief description of your blog post
publishedAt: YYYY-MM-DD
thumbnail: /uploads/your-image.jpg
---

# Your Blog Content

Write your blog content here using Markdown.
```

### Adding Services
Create a new markdown file in `content/services/` with the following structure:
```markdown
---
title: Service Name
icon: IconName    # Use icon names from lucide-react
description: Brief service description
---

# Detailed Service Description

Write your service details here using Markdown.
```

### Adding Features
Create a new markdown file in `content/features/` with the following structure:
```markdown
---
title: Feature Name
icon: IconName    # Use icon names from lucide-react
description: Brief feature description
highlights:
  - Highlight point 1
  - Highlight point 2
  - Highlight point 3
---

# Detailed Feature Description

Write your feature details here using Markdown.
```

### Adding Projects
Projects can be added through the admin interface at `/admin`, or by creating a new markdown file in `content/projects/`:
```markdown
---
title: Project Name
description: Brief project description
type: text        # Options: text, pdf, slides, image
challenge: Project challenge description
approach: Your approach to solving the challenge
implementation: Implementation details
outcomes:
  - Outcome 1
  - Outcome 2
technologies:
  - Tech 1
  - Tech 2
thumbnail: /uploads/project-thumbnail.jpg
---

# Detailed Project Description

Write your project details here using Markdown.
```

### Content Card Components

Each content type (Blog Posts, Services, Features, Projects) uses specific React components for rendering:

#### Blog Posts (`BlogSection.tsx`)
- Displays blog post cards in a grid layout
- Each card shows:
  - Title
  - Publication date
  - Excerpt
  - Opens detailed content in a dialog

#### Services (`Services.tsx`)
- Renders service cards in a responsive grid
- Each card displays:
  - Service icon (from lucide-react)
  - Title
  - Brief description
  - Opens detailed content in a dialog

#### Features (`Features.tsx`)
- Shows feature cards in a two-column grid
- Each card contains:
  - Feature icon (from lucide-react)
  - Title
  - Description
  - Bullet points for highlights
  - Opens detailed content in a dialog

#### Projects (`ProjectGrid.tsx` and `CaseStudy.tsx`)
- Displays project cards in a grid
- Supports multiple content types (case studies, PDFs, slides)
- Case studies include:
  - Challenge
  - Approach
  - Implementation
  - Technologies used
  - Outcomes

### Adding New Card Types

To add a new type of content card:

1. Create the content type interface in `shared/schema.ts`:
```typescript
export interface NewContentType {
  title: string;
  description: string;
  // Add other required fields
}
```

2. Add the content loading function in `server/`:
```typescript
export async function loadNewContent(): Promise<NewContentType[]> {
  // Implementation
}
```

3. Update `server/storage.ts`:
```typescript
export interface IStorage {
  // Add new method
  getNewContent(): Promise<NewContentType[]>;
}
```

4. Create a new React component in `client/src/components/`:
```typescript
export default function NewContentSection({ items }: { items: NewContentType[] }) {
  // Implementation
}
```

5. Add the component to `client/src/pages/home.tsx`

### Styling Guidelines for Cards

Follow these guidelines when styling content cards:

```typescript
// Base card styles
className="hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"

// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// Card headers
className="flex items-center gap-4"

// Icons
className="text-primary h-8 w-8"

// Descriptions
className="text-muted-foreground"
```

### Component Integration

When adding new card types:

1. Use the existing `ContentDialog` component for detailed views
2. Implement proper loading states
3. Add error boundaries
4. Ensure responsive design
5. Follow accessibility guidelines

### Icon Guidelines
- Use icons from `lucide-react` for all icon fields
- Common icons:
  - Features: `Code2`, `GitMerge`, `AlertCircle`, `Zap`
  - Services: `Database`, `Cloud`, `Shield`, `Brain`, `ChartBar`

### Image Guidelines
- Store images in `uploads/` directory
- Use relative paths starting with `/uploads/`
- Recommended image sizes:
  - Blog thumbnails: 800x400px
  - Project thumbnails: 1200x630px
  - Profile photos: 400x400px

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