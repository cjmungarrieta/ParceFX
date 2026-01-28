# ParceFX Landing Page

High-converting landing page with Supabase + Resend email integration deployed on Vercel.

## 🚀 Features

- ✅ Lead capture form with email validation
- ✅ Supabase database integration
- ✅ Resend email automation (welcome emails)
- ✅ Whop pricing modal with multiple tiers
- ✅ Real-time countdown timer
- ✅ Mobile-optimized responsive design
- ✅ Yellow/black McLaren-inspired design
- ✅ Deployed on Vercel

## 📋 Prerequisites

1. **Supabase Account** - https://supabase.com
2. **Resend Account** - https://resend.com
3. **Vercel Account** - https://vercel.com
4. **GitHub Account** (for deployment)

## 🛠️ Setup Instructions

### 1. Setup Supabase

1. Go to https://supabase.com and create a new project
2. Once created, go to **SQL Editor** in the sidebar
3. Copy the contents of `supabase-schema.sql` and run it
4. Go to **Project Settings** > **API**
5. Copy:
   - `Project URL` (starts with https://xxx.supabase.co)
   - `anon public` key
   - `service_role` key (click "Reveal" to see it)

### 2. Setup Resend

1. Go to https://resend.com and sign up
2. Go to **API Keys** and create a new key
3. Copy your API key (starts with `re_`)
4. (Optional) Add and verify your domain in **Domains** section
   - If you don't have a domain, you can use `onboarding@resend.dev` for testing
   - For production, verify your own domain

### 3. Update Email Settings

In `app/api/subscribe/route.ts`, update these lines:

```typescript
// Line 44 - Change to your verified domain
from: 'ParceFX <hello@yourdomain.com>',

// Line 116 - Change to your email to receive notifications
to: 'your-email@example.com',
```

### 4. Deploy to Vercel

#### Option A: Deploy via GitHub (Recommended)

1. Create a new GitHub repository
2. Push this code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/parcefx-landing.git
   git push -u origin main
   ```

3. Go to https://vercel.com
4. Click **"Add New"** > **"Project"**
5. Import your GitHub repository
6. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
   - `RESEND_API_KEY` = Your Resend API key
   - `NEXT_PUBLIC_APP_URL` = Your Vercel domain (e.g., https://parcefx.vercel.app)

7. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add environment variables via Vercel dashboard

### 5. Test Your Setup

1. Visit your deployed URL (e.g., `https://parcefx.vercel.app`)
2. Fill out the lead capture form
3. Check:
   - Supabase dashboard to see if lead was saved
   - Your email to see if you received the welcome email
   - Your notification email for the lead notification

## 🎨 Customization

### Change Colors

Edit CSS variables in `app/page.tsx` around line 500:

```css
:root {
  --yellow-primary: #FFD700;  /* Main yellow */
  --yellow-bright: #FFED4E;   /* Bright yellow */
  --black-primary: #0D0D0D;   /* Background */
}
```

### Update Pricing Tiers

Edit the `PricingOptions` component in `app/page.tsx` around line 150.

### Modify Email Templates

Edit the email HTML in `app/api/subscribe/route.ts` starting at line 47.

## 📁 Project Structure

```
parcefx-landing/
├── app/
│   ├── api/
│   │   └── subscribe/
│   │       └── route.ts          # API endpoint for lead capture
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main landing page
├── public/
│   └── hero-image.jpg            # McLaren hero image
├── .env.example                  # Environment variables template
├── supabase-schema.sql           # Database schema
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🔧 Local Development

1. Clone the repository
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your environment variables
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run development server:
   ```bash
   npm run dev
   ```
6. Open http://localhost:3000

## 📊 Database Schema

The `leads` table stores all captured leads:

- `id` - UUID primary key
- `nombre` - Full name (required)
- `email` - Email address (required)
- `telefono` - Phone/WhatsApp (optional)
- `source` - Traffic source (default: 'landing_page')
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 📧 Email Flow

1. User submits form
2. Lead saved to Supabase
3. Welcome email sent to user via Resend
4. Notification email sent to you
5. Modal opens with Whop pricing tiers

## 🚨 Troubleshooting

### Emails not sending

- Verify your Resend API key is correct
- Check that the `from` email is verified in Resend
- For testing, use `onboarding@resend.dev`

### Database errors

- Verify Supabase credentials are correct
- Make sure you ran the SQL schema
- Check Row Level Security policies

### Deployment issues

- Ensure all environment variables are set in Vercel
- Check build logs for errors
- Verify Next.js version compatibility

## 📈 Analytics & Tracking

To add analytics:

1. **Google Analytics**: Add to `app/layout.tsx`
2. **Meta Pixel**: Add to `app/layout.tsx`
3. **Supabase**: Query the `leads` table for conversion metrics

## 🔐 Security Notes

- Never commit `.env.local` or `.env` files
- Use `service_role` key only in server-side code
- Keep API keys secure in Vercel environment variables
- Enable RLS (Row Level Security) in Supabase

## 📞 Support

For issues or questions:
- Check Vercel deployment logs
- Review Supabase error logs
- Test API endpoints at `/api/subscribe`

## 🎯 Next Steps

- [ ] Add custom domain in Vercel
- [ ] Verify email domain in Resend
- [ ] Set up Google Analytics
- [ ] Add Meta Pixel
- [ ] Create email automation sequence
- [ ] A/B test different copy variations

## 📝 License

Private project for ParceFX
