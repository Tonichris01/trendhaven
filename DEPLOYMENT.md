# TrendHaven Deployment Guide

## 🚀 Deploy to Vercel

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: TrendHaven AI Fashion Assistant"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/trendhaven.git

# Push to GitHub
git push -u origin main
```

### 2. Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure environment variables:**

   In Vercel dashboard → Project Settings → Environment Variables, add:

   ```
   OPENAI_API_KEY=your-openai-api-key
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret
   NODE_ENV=production
   ```

6. **Deploy!**

### 3. Environment Variables Setup

Make sure to set these in your Vercel project settings:

- `OPENAI_API_KEY` - Your OpenAI API key
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `JWT_SECRET` - A secure random string for JWT signing
- `NODE_ENV` - Set to `production`

### 4. Database Setup

1. **Run the migration** in your Supabase SQL Editor:
   - Copy the content from `supabase/migrations/001_initial_schema.sql`
   - Paste and run in Supabase SQL Editor

2. **Enable Row Level Security** (already included in migration)

### 5. Storage Setup

1. **Create a storage bucket** in Supabase:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `outfit-images`
   - Set it to public

### 6. Test Your Deployment

After deployment, test:
- ✅ Sign up functionality
- ✅ Sign in functionality  
- ✅ Anonymous sign in
- ✅ Outfit upload
- ✅ AI analysis

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
npm run setup

# Start development server
npm run dev
```

## 📱 Features

- **AI Outfit Analysis** - Upload photos for style ratings
- **Smart Wardrobe** - Organize and categorize outfits
- **Personalized Recommendations** - Get outfit suggestions
- **Secure Authentication** - Email/password and anonymous sign-in
- **Modern UI** - Responsive design with dark mode

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4 Vision
- **Deployment**: Vercel
- **Authentication**: JWT + Supabase Auth

## 📞 Support

If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure Supabase database migration is complete
4. Check Supabase storage bucket is created and public
