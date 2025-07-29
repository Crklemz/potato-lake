# Potato Lake Association Website

A custom CMS-powered website for the Potato Lake Association built with Next.js, Prisma, and NextAuth.js.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: Prisma ORM with Vercel Postgres
- **Authentication**: NextAuth.js (Credentials Provider)
- **Styling**: Tailwind CSS v4 (CSS-first approach)
- **Deployment**: Vercel

## Features

- **Public Pages**: Home, Resorts, Fishing, DNR Info, News & Events, Area Services, Association
- **Admin Panel**: Protected content management system
- **Responsive Design**: Mobile-first approach with Mountain Lake theme
- **Type Safety**: Full TypeScript implementation

## Theme Colors

The website uses a custom Mountain Lake color palette:

- Primary: `#18434E` (Deep teal)
- Accent: `#A1BCD0` (Light blue)
- Neutral Light: `#D8DEEA` (Light gray-blue)
- Neutral Dark: `#051615` (Very dark green)
- Sand Accent: `#78949F` (Muted blue-gray)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Vercel account (for deployment)
- Vercel Postgres database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd potato_lake_website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add the following to your `.env.local`:
```env
DATABASE_URL="your-vercel-postgres-url"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma db push
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Admin Access

- **URL**: `/admin`
- **Demo Credentials**: 
  - Username: `admin`
  - Password: `admin`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel routes
│   ├── api/               # API routes (NextAuth)
│   ├── resorts/           # Public pages
│   ├── fishing/
│   ├── dnr/
│   ├── news/
│   ├── area-services/
│   ├── association/
│   ├── globals.css        # Tailwind CSS v4 styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── SessionProvider.tsx
└── lib/                   # Utility functions
    ├── auth.ts            # NextAuth configuration
    └── prisma.ts          # Prisma client
```

## Database Schema

The application uses the following Prisma models:

- `HomePage` - Hero content and intro text
- `ResortsPage` & `Resort` - Resort listings
- `FishingPage` - Fishing information
- `DnrPage` - DNR regulations and info
- `NewsPage` & `Event` - News and events
- `AreaServicesPage` & `Sponsor` - Local businesses
- `AssociationPage` - Association information

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

- `DATABASE_URL` - Vercel Postgres connection string
- `NEXTAUTH_SECRET` - Random string for session encryption
- `NEXTAUTH_URL` - Your production domain

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Management

- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma db push` - Push schema changes to database
- `npx prisma generate` - Generate Prisma client

## Customization

### Adding New Pages

1. Create a new directory in `src/app/`
2. Add a `page.tsx` file
3. Update the navigation in `src/components/Header.tsx`

### Modifying Theme Colors

Edit the CSS variables in `src/app/globals.css`:

```css
@theme {
  --color-primary: #your-color;
  --color-accent: #your-color;
  /* ... other colors */
}
```

### Adding Admin Features

1. Create new admin routes in `src/app/admin/`
2. Add authentication checks using `useSession()`
3. Implement CRUD operations with Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the Potato Lake Association.
