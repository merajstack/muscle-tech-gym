## Project Summary
Muscle Tech Premium Gym is a high-end fitness center web application featuring service displays, trainer profiles, and an integrated membership registration system with UPI/Cash payment options and an admin management dashboard.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Styling**: Tailwind CSS 4, Framer Motion
- **Icons**: Lucide React, Tabler Icons
- **Database**: Supabase (Planned/Configured)
- **Payments**: UPI Deep Linking
- **Communications**: WhatsApp Web Integration
- **Components**: Shadcn UI (Radix UI)

## Architecture
- `app/`: Next.js App Router pages (Admin, Fitness, Amenities, etc.)
- `components/`: Reusable UI components (Navbar, JoinNowModal, etc.)
- `lib/`: Utility functions and shared hooks
- `localStorage`: Used for temporary data persistence in the preview version

## User Preferences
- **Theme**: Dark-themed aesthetic with red accents (#DC2626)
- **Interactions**: Glass-morphism effects for modals and cards
- **Admin Password**: `muscle_01tech`

## Project Guidelines
- Use functional components and modern React patterns.
- Keep "use client" directives limited to interactive components.
- Maintain a premium, high-contrast visual style (Red on Black).
- Follow security best practices for payment and admin logic.

## Common Patterns
- Glass-morphism: `bg-white/10 backdrop-blur-xl border border-white/20`
- Animated Reveals: Framer Motion `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
