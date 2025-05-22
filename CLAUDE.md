# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript check first)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally
- `npm run update-types` - Generate TypeScript types from Supabase database schema

## Architecture Overview

This is a React + TypeScript wedding website using Vite, with Supabase as the backend database.

### Application Structure
- **Entry Flow**: `main.tsx` → `BrowserRouter` → `App.tsx` (layout wrapper) → Page components
- **Layout Pattern**: App.tsx provides persistent Header/Footer with `<Outlet />` for page content
- **Routing**: React Router v6 with nested routes (/, /contact, /registry, /gallery, /activities, /rsvp)

### Data Flow Pattern
- **Forms**: React Hook Form + Zod validation schemas → direct Supabase client calls → local state updates
- **No Global State**: Uses local component state with React hooks, no Redux/Zustand
- **Type Safety**: Full TypeScript integration with generated database types from Supabase

### Supabase Integration
- **Client**: Centralized in `supabaseClient.ts` with typed Database interface
- **Tables**: `rsvps`, `contact_us`, `guest_book`
- **Type Generation**: Run `npm run update-types` after schema changes
- **Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Key Technologies
- **Styling**: Tailwind CSS with custom sage/ivory color palette
- **Components**: Shadcn/ui design system with Radix UI primitives
- **Maps**: Leaflet + React-Leaflet for interactive location features
- **Validation**: Zod schemas define data structures and form validation
- **Path Aliases**: `@/` maps to `src/` directory

### Configuration Notes
- **Deployment**: `public/_redirects` handles SPA routing for static hosting
- **Import Aliases**: `@/` is configured in both `vite.config.ts` and `tsconfig.json`
- **Build Tool**: Vite with React plugin for fast development and optimized builds