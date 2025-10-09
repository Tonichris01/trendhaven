# TrendHaven - AI Fashion Assistant App

A modern AI-powered fashion assistant that analyzes your outfits, provides style ratings, and gives personalized recommendations.

## Features

- 📸 **AI Outfit Analysis** - Upload photos and get detailed style ratings
- 👗 **Smart Wardrobe** - Organize and categorize your outfits
- ✨ **Personalized Recommendations** - Get outfit suggestions based on mood, occasion, and weather
- 🔐 **Secure Authentication** - Sign up, sign in, or use anonymous mode
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode support

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 Vision
- **Authentication**: JWT + Supabase Auth

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a [Supabase](https://supabase.com) project
2. Run the database migration from `supabase/migrations/001_initial_schema.sql`
3. Get your project URL and service role key from Supabase settings

### 3. Configure Environment

Run the setup script:

```bash
npm run setup
```

Or manually create `.env.local` with:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret
JWT_SECRET=your-jwt-secret

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 4. Start Development Server

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
trendhaven/
├── server/                 # Node.js backend
│   ├── index.js           # Main server file
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   └── routes/            # API routes
├── src/                   # React frontend
│   ├── lib/api/          # API client functions
│   └── components/       # React components
└── supabase/             # Database migrations
```

## API Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in with email/password
- `POST /api/auth/signin-anonymous` - Sign in anonymously
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `POST /api/outfits/upload` - Upload and analyze outfit
- `GET /api/outfits` - Get user's outfits
- `POST /api/outfits/recommendations` - Get outfit recommendations
- `PATCH /api/outfits/:id/favorite` - Toggle favorite status
- `DELETE /api/outfits/:id` - Delete outfit

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Set up environment variables
npm run setup
```

## Deployment

1. Build the frontend: `npm run build`
2. Deploy the backend to your preferred platform (Vercel, Railway, etc.)
3. Set environment variables in your deployment platform
4. Update the API_BASE_URL in the frontend if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
