# Muscle Tech Gym - Complete Membership Management System

## Requirements
Build a comprehensive membership registration and management system featuring:
- Multi-branch Staff Management with password-protected access
- Member registration with payment approval workflow
- Mobile + OTP authentication for members
- Exclusive content access for approved active members
- Revenue tracking and WhatsApp messaging features

## Technical Context

### Current Stack
- **Framework**: Next.js 15 (App Router) with Bun
- **UI**: Tailwind CSS 4, Framer Motion, Shadcn UI (Radix)
- **Database**: Supabase (to be integrated)
- **Existing Components**: JoinNowModal, Navbar, Admin dashboard, Dialog, Input, Select, Tabs, Table components

### Branches
1. Beeramguda Kaman
2. Beeramguda
3. Madinaguda
4. Chandanagar

### Branch Passwords (from AGENTS.md pattern)
- Default admin password: `muscle_01tech`
- Each branch will have its own password for staff access

---

## Database Schema (Supabase)

### Tables Required

```sql
-- Branches table
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  branch_id UUID REFERENCES branches(id),
  membership_type TEXT NOT NULL, -- '3_months', '6_months', '1_year', 'duo_plan'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  payment_mode TEXT NOT NULL, -- 'cash', 'upi'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'expired', 'rejected'
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  is_authenticated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID
);

-- Staff notifications table
CREATE TABLE staff_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id),
  member_id UUID REFERENCES members(id),
  type TEXT NOT NULL, -- 'new_registration', 'payment_pending'
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Implementation Phases

### Phase 1: Supabase Setup & Database Configuration
- Create `lib/supabase.ts` client configuration
- Set up environment variables for Supabase URL and anon key
- Create database tables via Supabase dashboard or migrations
- Seed initial branch data with hashed passwords

### Phase 2: Enhanced Join Now Modal (Membership Registration)
- Update `JoinNowModal.tsx` with new fields:
  - Full Name (existing)
  - Mobile Number (existing)
  - Membership Start Date
  - Membership End Date (auto-calculate option or manual)
  - Membership Type dropdown (3 Months, 6 Months, 1 Year, Duo Plans)
  - Payment Amount (manual input)
  - Payment Mode (Cash / UPI radio buttons)
  - Branch Selection dropdown
- Cash payment: Show "Pay at reception counter" message
- UPI payment: Show "Scan QR at counter" message + notification to staff
- Submit creates `pending` member record
- Show "Your request is being processed" confirmation
- Create staff notification for new registration

### Phase 3: Staff Management System (New Route)
- Create `/app/staff/page.tsx` - Staff portal entry
- Add "Staff Management" to Navbar (visible to all but protected)
- Staff login flow:
  1. Branch selection dropdown
  2. Password input field
  3. Validate against branch password
  4. On success: Access branch-specific dashboard
- Store authenticated branch in session/localStorage

### Phase 4: Staff Dashboard Features
- Create `/app/staff/dashboard/page.tsx`
- **Tabs/Sections**:
  1. **Pending Requests**: Table of new membership requests
     - Accept/Reject buttons with confirmation
     - On Accept: Update status to 'active', send notification
  2. **Active Members**: Table with all member details
     - Name, Mobile, Type, Start/End Date, Amount, Mode, Status
     - WhatsApp "Send Message" button per row
  3. **Revenue Overview**: 
     - Total revenue card (sum of approved payments)
     - Revenue breakdown by membership type
  4. **Notifications Bell**: 
     - Real-time new registration alerts
     - Mark as read functionality

### Phase 5: Member Authentication (Mobile + OTP)
- Create `/app/member/login/page.tsx`
- Login flow:
  1. Enter mobile number
  2. Check if member exists and is 'active'
  3. Generate 6-digit OTP, store in database with expiry (5 min)
  4. Display OTP on screen (simulated - in production use SMS service)
  5. User enters OTP to verify
  6. On success: Set session, redirect to exclusive content
- Add "Member Login" to Navbar
- Create `MemberAuthContext` for managing member session

### Phase 6: Exclusive Content Section (Members Only)
- Create `/app/exclusive/page.tsx` - Protected route
- Add "Exclusive Items" to Navbar (show only when member authenticated)
- **Content Sections**:
  1. **BMI Calculator**: 
     - Height/Weight inputs
     - Calculate and display BMI with category
  2. **Diet Recommendations**:
     - Basic diet tips
     - Bulk diet chart (card/accordion)
     - Shredding/Fat loss diet chart
     - Water intake guidance with calculator
  3. **Exercise Library**:
     - Categorized by muscle group
     - Triceps, Chest, Back, Shoulders, Legs, Core
     - Each exercise: Image, name, description, tips
- Middleware/guard to check member authentication

### Phase 7: Navigation & Access Control Updates
- Update `Navbar.tsx`:
  - Add "Staff Management" link
  - Add "Member Login" link
  - Conditionally show "Exclusive Items" for authenticated members
  - Add member name/logout button when logged in
- Create route protection middleware
- Update Footer to hide on staff/member auth pages

### Phase 8: WhatsApp Integration
- Create WhatsApp message templates:
  - Renewal reminder template
  - Welcome message template
- Generate WhatsApp deep links with pre-filled messages
- Format: `https://wa.me/91{phone}?text={encoded_message}`

---

## File Structure (New Files)

```
lib/
├── supabase.ts              # Supabase client
├── auth/
│   └── member-context.tsx   # Member authentication context

app/
├── staff/
│   ├── page.tsx             # Staff login page
│   └── dashboard/
│       └── page.tsx         # Staff dashboard
├── member/
│   └── login/
│       └── page.tsx         # Member OTP login
├── exclusive/
│   ├── page.tsx             # Exclusive content hub
│   ├── bmi/
│   │   └── page.tsx         # BMI Calculator
│   ├── diet/
│   │   └── page.tsx         # Diet charts & recommendations
│   └── exercises/
│       └── page.tsx         # Exercise library

components/
├── JoinNowModal.tsx         # (Update) Enhanced registration
├── Navbar.tsx               # (Update) New nav items
├── staff/
│   ├── BranchLogin.tsx      # Branch selection + password
│   ├── MemberRequests.tsx   # Pending requests table
│   ├── MembersTable.tsx     # All members table
│   ├── RevenueCard.tsx      # Revenue statistics
│   └── NotificationBell.tsx # Staff notifications
├── member/
│   ├── OTPInput.tsx         # OTP verification component
│   └── MemberGuard.tsx      # Route protection wrapper
└── exclusive/
    ├── BMICalculator.tsx    # BMI calculation tool
    ├── DietCard.tsx         # Diet recommendation cards
    └── ExerciseCard.tsx     # Exercise display cards
```

---

## Security Considerations

1. **Staff Access**: Password-protected per branch, no public visibility
2. **Member Data**: Only accessible to authenticated staff of the same branch
3. **OTP Security**: 6-digit code with 5-minute expiry
4. **Session Management**: Secure tokens stored in httpOnly cookies or encrypted localStorage
5. **Revenue Data**: Strictly internal, visible only in staff dashboard
6. **API Routes**: Validate branch authentication on all staff endpoints

---

## UI/UX Guidelines (Following Existing Patterns)

- **Theme**: Dark background (#000), red accents (#DC2626)
- **Glass-morphism**: `bg-white/10 backdrop-blur-xl border border-white/20`
- **Cards**: `bg-zinc-900/50 border border-zinc-800 rounded-xl`
- **Buttons**: `bg-red-600 hover:bg-red-700 text-white font-bold`
- **Form Inputs**: `bg-zinc-950 border border-zinc-800 rounded-lg`
- **Animations**: Framer Motion for modals and transitions

---

## Dependencies to Add

```bash
bun add @supabase/supabase-js bcryptjs
bun add -D @types/bcryptjs
```

---

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
