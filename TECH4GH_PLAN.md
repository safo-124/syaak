# TechForUGH Learning Web App – v1 Plan

Build a clear marketing + light learning/enrollment site for TechForUGH using the existing Next.js + Prisma Postgres + Tailwind + shadcn setup. The app will model courses and leads in Prisma, scaffold marketing pages and course views, add simple enrollment/lead capture, and leave room for a future learner/admin portal.

## Steps

1. **Define Core Data Models (Prisma)**
   - In `prisma/schema.prisma`, add:
     - `Course` (title, slug, description, level, format, duration, price, tech flags like `isPython`, `isR`, `isExcel`, `isWord`, `isPowerPoint`, `isPublished`, `heroImageUrl`, `shortSummary`, `tags`).
     - `CourseSection` (for syllabus; `courseId`, `title`, `order`, `contentMarkdown`).
     - `Lead` (or `Enrollment`: `id`, `name`, `email`, `phone?`, `courseId?`, `message?`, `source`, `status`).
     - Enums: `CourseLevel` (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`), `LeadStatus` (`NEW`, `CONTACTED`, `ENROLLED`, `LOST`).
   - Keep existing `User` for now; ignore `Habit` models in the new UX.
   - Run:
     - `npx prisma generate`
     - `npx prisma db push`

2. **Add Data Helpers & Seed Script**
   - Create `lib/courses.ts` with helpers:
     - `getPublishedCourses()`, `getCourseBySlug(slug)`, `getLeads()`, `createLead(input)`.
   - Create `scripts/seed.ts` to insert sample TechForUGH courses:
     - “Data Science with Python”
     - “Data Analysis with Excel”
     - “R for Data Science”
     - “PowerPoint for Data Storytelling”
     - “Mastering Microsoft Word for Reports”
   - Add `db:seed` script in `package.json` and run it locally.

3. **Set Up Route Structure & Layouts**
   - Create marketing route group:
     - `app/(marketing)/layout.tsx`: shared header/footer, container, using shadcn (`Button`, nav, etc.) and `cn` from `lib/utils`.
   - Pages under `(marketing)`:
     - `app/(marketing)/page.tsx`: new home with hero, featured courses, CTA.
     - `app/(marketing)/about/page.tsx`: mission, who TechForUGH serves.
     - `app/(marketing)/courses/page.tsx`: list of courses (grid, filter by Python/R/Excel/MS tools).
     - `app/(marketing)/courses/[slug]/page.tsx`: single course details + syllabus + “Apply/Enroll” form.
     - `app/(marketing)/contact/page.tsx`: general inquiry form.
   - Reserve future app/admin group:
     - `app/(app)/layout.tsx`, `app/(app)/dashboard/page.tsx`, `app/(app)/admin/page.tsx` (placeholders).

4. **Design Components with shadcn**
   - Use / generate shadcn primitives in `components/ui/`:
     - `button`, `input`, `textarea`, `card`, `badge`, `alert`, `dialog`, `navigation-menu`.
   - Create marketing components in `components/marketing/`:
     - `hero-TechForUGH.tsx` (hero with key tagline and primary CTA).
     - `course-card.tsx` (used on catalog and home).
     - `feature-grid.tsx` (highlights Python, R, Excel, Word, PowerPoint).
     - `testimonials.tsx`.
     - `cta-section.tsx` (strong call-to-action block).
   - Shared layout components in `components/layout/`:
     - `site-header.tsx` (logo “TechForUGH”, nav links).
     - `site-footer.tsx`.

5. **Wire Enrollment / Lead Capture**
   - API routes:
     - `app/api/leads/route.ts`:
       - `POST` creates a `Lead` with name, email, optional phone, `courseId`, message, source (`"course-page"`, `"contact-page"`, etc.) using `prisma` from `lib/prisma`.
   - Frontend forms:
     - Course detail page: inline enrollment/interest form posting to `/api/leads`.
     - Contact page: general form also posting to `/api/leads` with different `source`.
   - Handle success/error with shadcn `Alert` or toasts.

6. **Admin/Review Views (Simple v1)**
   - Under `app/(app)/admin/`:
     - `leads/page.tsx`: table of recent leads (name, email, course, status, createdAt) via `getLeads()`.
     - `courses/page.tsx`: list of courses with publish status.
   - Gate admin routes very simply at first (e.g., check `process.env.ADMIN_EMAILS` and a hard-coded email until real auth is added).

7. **Branding, Content & Polish**
   - Adjust `app/globals.css` and Tailwind config (if needed) for TechForUGH brand colors and typography.
   - Make sure hero, course cards, and CTAs are mobile-friendly and accessible (labels, aria, focus states).
   - Add metadata (`export const metadata`) to key routes for SEO: home, courses, each course `[slug]`, about, contact.
   - Replace placeholders with real TechForUGH copy for:
     - Course descriptions and outcomes.
     - Hero and CTA texts.
     - About page narrative.

## Further Considerations

1. Decide if v1 is **marketing + lead capture only** (no login) or if you want to add simple auth before launch; the plan above keeps auth as a later phase.
2. You can incrementally migrate from the existing `User`/habit demo by leaving that data in place but no longer exposing it in the UI.
3. Once v1 is live, future phases can add a learner dashboard, lesson content models (`Lesson`, `Module`, `Resource`), payments (Stripe), and email notifications (Resend/SendGrid) on top of this foundation.


i need to build the admin and student more