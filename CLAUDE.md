# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian-based blog built with Next.js 15 and React 19. The project converts Obsidian markdown notes into a static blog with WikiLink support.

## Commands

```bash
# Development
pnpm dev      # Start dev server with Turbopack on http://localhost:3000

# Build & Deploy
pnpm build    # Create production build
pnpm start    # Start production server

# Code Quality
pnpm lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.3.5 with App Router
- **UI**: React 19.0.0 with TypeScript
- **Styling**: Tailwind CSS 4 (Alpha)
- **Markdown**: gray-matter, remark, remark-html
- **Package Manager**: pnpm

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
- `notes/` - Obsidian markdown files (blog content source)
- `plans/` - Project planning documents with detailed requirements

### Key Implementation Requirements
1. **WikiLink Support**: Convert `[[note-name]]` syntax to clickable links
2. **Markdown Processing**: Parse frontmatter and convert to HTML
3. **ISR**: Use Incremental Static Regeneration for performance
4. **Korean Support**: Ensure proper handling of Korean content
5. **Deployment**: Optimized for Vercel deployment

## Current Phase

The project is in Phase 1 (Infrastructure Setup) with the following priorities:
1. Implement markdown file processing from `notes/` directory
2. Create blog post pages with dynamic routing
3. Implement WikiLink parsing and navigation
4. Set up basic blog layout and navigation

Refer to `plans/p1-tasks.md` for the detailed task checklist and progress tracking.