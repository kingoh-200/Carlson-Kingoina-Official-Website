# Personal Website

A personal portfolio site built with Next.js, TypeScript, Tailwind CSS, and Lucide React.

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx            # Home page
│   ├── about/page.tsx      # About page
│   ├── projects/page.tsx   # Projects page
│   ├── contact/page.tsx    # Contact page
│   ├── api/contact/route.ts# Contact form API (Resend)
│   ├── layout.tsx          # Root layout (header + footer)
│   └── globals.css         # Tailwind CSS theme
├── components/
│   ├── Header.tsx          # Responsive navigation
│   ├── Footer.tsx          # Footer with social links
│   ├── Hero.tsx            # Homepage hero section
│   ├── Section.tsx         # Reusable section wrapper
│   ├── ProjectCard.tsx     # Project card component
│   ├── ContactForm.tsx     # Contact form with validation
│   └── InfoCards.tsx       # Skill and info card components
└── lib/
    └── data.ts             # Site config, projects, skills
```

## Customization

1. Edit `src/lib/data.ts` to update your name, bio, projects, and skills
2. Update `src/app/layout.tsx` metadata for SEO
3. Replace placeholder social links in `Header.tsx` and `Footer.tsx`
4. Add your Resend API key to `.env.local` for the contact form

## Deployment

Push to GitHub and deploy on [Vercel](https://vercel.com) — it works out of the box.
