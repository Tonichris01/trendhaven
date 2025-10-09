# TrendHaven Setup Guide - Node.js Backend with Supabase

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `trendhaven`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Supabase Credentials

1. Go to your project dashboard
2. Click on "Settings" → "API"
3. Copy the following values:
   - Project URL
   - Service role key (keep this secret!)

## 3. Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# OpenAI Configuration (for backend)
OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configuration (for backend)
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 4. Run Database Migration

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute the migration

## 5. Enable Authentication

1. Go to "Authentication" → "Settings" in your Supabase dashboard
2. Enable "Enable anonymous sign-ins" if you want to allow anonymous users
3. Configure email settings if needed

## 6. Test the Setup

1. Start your development server: `npm run dev`
   - This will start both the Node.js backend (port 3001) and React frontend (port 5173)
2. Try signing in anonymously or with email/password
3. Upload an outfit to test the AI analysis

## 7. Project Structure

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

## 8. API Endpoints

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

## Troubleshooting

- Make sure all environment variables are set correctly
- Check that the database migration ran successfully
- Verify that RLS policies are enabled and working
- Check the browser console for any authentication errors
- Ensure the Node.js backend is running on port 3001
- Check server logs for any backend errors
