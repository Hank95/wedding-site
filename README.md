# Wedding Website 💕

A modern, elegant wedding website built with React, TypeScript, and Supabase. Features a custom sage and ivory color palette, interactive components, and complete RSVP management system.

## 🌟 Live Demo

Visit the live site: [nobskaandhenry.com](https://nobskaandhenry.com)

## ✨ Features

### Core Functionality
- **Responsive Design** - Optimized for all devices (mobile, tablet, desktop)
- **RSVP Management** - Complete form handling with email notifications
- **Photo Gallery** - Elegant image showcase with lazy loading
- **Interactive Map** - Charleston area activities and venue locations
- **Contact System** - Direct communication with the couple
- **Gift Registry** - Integrated registry information

### Technical Highlights
- **Email Notifications** - Automated RSVP confirmations via Supabase Edge Functions
- **Calendar Integration** - Google Calendar, Outlook, and .ics downloads
- **SEO Optimized** - Meta tags, structured data, and performance optimization
- **Form Validation** - Zod schemas with React Hook Form
- **Accessibility** - WCAG compliant with proper ARIA labels
- **Performance** - Lazy loading, code splitting, and optimized assets

### User Experience
- **Countdown Timer** - Dynamic countdown to the wedding day
- **Custom Color Palette** - Sage and ivory theme throughout
- **Professional Typography** - Georgia serif fonts for elegance
- **Smooth Animations** - CSS transitions and loading states
- **Error Handling** - Graceful error boundaries and user feedback

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and suspense
- **TypeScript** - Full type safety and developer experience
- **Vite** - Fast development and optimized production builds
- **React Router v6** - Client-side routing with nested layouts
- **Tailwind CSS v4** - Utility-first styling with custom design system

### UI Components
- **Shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Supabase Auth** - User authentication (if needed)
- **Row Level Security** - Database security policies
- **Real-time Subscriptions** - Live data updates

### Maps & Location
- **Leaflet** - Interactive maps with custom markers
- **React Leaflet** - React integration for Leaflet maps
- **Custom Map Styling** - Branded map markers and popups

### Email & Notifications
- **Resend API** - Transactional email service
- **Supabase Edge Functions** - Serverless functions for email logic
- **Custom Email Templates** - Branded HTML email designs

### Development Tools
- **ESLint** - Code linting with TypeScript support
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixes

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui base components
│   ├── Header.tsx       # Navigation component
│   ├── Footer.tsx       # Footer with links
│   ├── PhotoGallery.tsx # Image gallery with modal
│   ├── InteractiveMap.tsx # Leaflet map component
│   ├── rsvp-form.tsx    # RSVP form with validation
│   └── ...
├── pages/               # Route components
│   ├── Home.tsx         # Landing page
│   ├── RSVPPage.tsx     # RSVP management
│   ├── GalleryPage.tsx  # Photo gallery
│   ├── ActivitiesMap.tsx # Charleston activities
│   └── ...
├── lib/                 # Utilities and configurations
│   ├── utils.ts         # Helper functions
│   ├── types.ts         # TypeScript interfaces
│   ├── rsvpSchema.ts    # Form validation schemas
│   └── BrowserRouter.tsx # Router configuration
├── api/                 # API integration
│   └── guestbook.ts     # Guestbook API calls
└── supabaseClient.ts    # Database client configuration

supabase/
└── functions/
    └── send-rsvp-notification/  # Email notification function
        ├── index.ts             # Edge function logic
        └── deno.json           # Deno configuration

public/
├── calendar/
│   └── wedding.ics     # Calendar download file
├── markers/            # Custom map markers
└── ...                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wedding-site.git
   cd wedding-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Generate TypeScript types from Supabase
   npm run update-types
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Database Schema

```sql
-- RSVP responses
CREATE TABLE rsvps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  attending boolean NOT NULL,
  dietary_restrictions text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Contact form submissions
CREATE TABLE contact_us (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Guest book entries
CREATE TABLE guest_book (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 📧 Email System

The email notification system uses Supabase Edge Functions with Resend:

### Features
- **RSVP Notifications** - Instant email to couple when RSVP submitted
- **Guest Confirmations** - Branded confirmation emails to guests
- **Calendar Integration** - Automatic calendar invites
- **Responsive Templates** - Beautiful HTML emails with sage/ivory branding

### Setup
1. Deploy the edge function: `supabase functions deploy send-rsvp-notification`
2. Set environment variable: `RESEND_API_KEY` in Supabase dashboard
3. Configure your domain email in the function

## 🎨 Design System

### Color Palette
```css
/* Sage Colors */
--sage-100: #f1f4ed;
--sage-200: #e3e9db;
--sage-300: #d5deca;
--sage-400: #c7d3b8;
--sage-500: #b9c8a6;
--sage-600: #9aad85;
--sage-700: #7c9264;
--sage-800: #5d7743;
--sage-900: #3f5c22;

/* Ivory Colors */
--ivory-100: #fefef9;
--ivory-200: #fdfdf3;
--ivory-300: #fcfced;
--ivory-400: #fbfbe7;
--ivory-500: #fafae1;
```

### Typography
- **Headers**: Georgia serif for elegance
- **Body**: System fonts for readability
- **Accent**: Custom wedding fonts where appropriate

## 📱 Responsive Design

- **Mobile First** - Optimized for small screens
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly** - Appropriate tap targets and spacing
- **Performance** - Optimized images and lazy loading

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint

# Database
npm run update-types    # Generate TypeScript types from Supabase

# Deployment
npm run build && npm run preview  # Test production build locally
```

## 🚀 Deployment

The site is optimized for static hosting services:

### Recommended Hosts
- **Netlify** - Automatic deployments from Git
- **Vercel** - Optimized for React applications  
- **Cloudflare Pages** - Fast global CDN

### Build Configuration
- Output: `dist/` directory
- SPA Routing: `public/_redirects` handles client-side routing
- Assets: Optimized and cached with proper headers

## 🔒 Security

- **Environment Variables** - Sensitive data in environment files
- **Row Level Security** - Database policies for data protection
- **Input Validation** - Zod schemas prevent invalid data
- **CORS Configuration** - Proper cross-origin settings

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with code splitting
- **Images**: WebP format with lazy loading

## 🎯 SEO Features

- **Meta Tags** - Complete Open Graph and Twitter Cards
- **Structured Data** - JSON-LD for rich snippets
- **Sitemap** - Auto-generated sitemap.xml
- **Semantic HTML** - Proper heading structure and landmarks

## 🧪 Testing

```bash
# Add testing framework of choice
npm install -D vitest @testing-library/react
```

## 📄 License

This project is private and created for personal use. Please don't use wedding photos or personal content.

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

---

**Built with ❤️ for Nobska & Henry's special day**