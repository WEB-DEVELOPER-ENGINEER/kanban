# Kanban Board

A modern task management application built with Next.js 14, TypeScript, and Material-UI.

## Features

- Drag-and-drop task management across columns (Backlog, In Progress, Review, Done)
- Create, edit, and delete tasks
- Search functionality across task titles and descriptions
- Infinite scroll for large task lists
- Responsive design with accessibility support

## Development

```bash
# Install dependencies
npm install

# Run development server with json-server API
npm run dev        # Next.js on http://localhost:3000
npm run api        # json-server on http://localhost:4000
```

## Production Deployment

The app is deployed on Vercel with Next.js API routes.

**Important Note**: The current implementation uses in-memory storage which resets between serverless function invocations. For a production application, you should integrate a persistent database such as:

- Vercel Postgres
- Supabase
- MongoDB Atlas
- PlanetScale
- Upstash Redis

The in-memory storage is suitable for demos and prototypes only.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit
- **API**: Next.js API Routes (production) / json-server (development)
