# 🚀 QUICK START DEPLOYMENT GUIDE
## Step-by-Step: Get Your Landing Page Live in 30 Minutes

## 📋 What You'll Need

- ✅ Supabase account (free)
- ✅ Resend account (free)
- ✅ Vercel account (free)
- ✅ GitHub account (free)

---

## Part 1: Supabase Setup (5 minutes)

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name it "parcefx-landing"
4. Set a strong database password
5. Choose region closest to you
6. Wait 2-3 minutes for setup

### Create Database Table

1. Click "SQL Editor" in left sidebar
2. Click "New Query"
3. Copy/paste contents from `supabase-schema.sql`
4. Click "Run"
5. You should see "Success. No rows returned"

**If you already have a leads table**, run `supabase-migration-utm.sql` instead to add UTM tracking fields.

### Get API Keys

1. Click "Project Settings" (gear icon)
2. Click "API" in left menu
3. **SAVE THESE 3 THINGS:**
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key** (long string starting with `eyJ`)
   - **service_role key** (click Reveal, then copy)

---

## Part 2: Resend Setup (5 minutes)

### Sign Up for Resend

1. Go to https://resend.com
2. Sign up with your email
3. Verify your email

### Create API Key

1. Click "API Keys" in dashboard
2. Click "Create API Key"
3. Name it "ParceFX Production"
4. Click "Add"
5. **SAVE THIS**: Copy the key (starts with `re_`)

### Update Email Address (Important!)

Open `app/api/subscribe/route.ts`:

**Line 53**: Change `from:` to your email
```typescript
from: 'ParceFX <hello@yourdomain.com>',
```

**Line 179**: Change `to:` to YOUR email (to receive lead notifications)
```typescript
to: 'your-email@example.com',
```

**For Testing**: Use `onboarding@resend.dev` as the from address  
**For Production**: Add your domain in Resend's Domains section

---

## Part 3: GitHub Setup (3 minutes)

### Create New Repository

1. Go to https://github.com/new
2. Repository name: `parcefx-landing`
3. Make it **Private**
4. Don't initialize with README
5. Click "Create repository"

### Push Code

```bash
# Navigate to your project
cd parcefx-landing-complete

# Initialize git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/parcefx-landing.git
git push -u origin main
```

---

## Part 4: Vercel Deployment (5 minutes)

### Import Project

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select your `parcefx-landing` repository
4. Click "Import"

### Add Environment Variables

Click "Environment Variables" and add these **5 variables**:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase → Settings → API → Reveal |
| `RESEND_API_KEY` | Your Resend key | Resend → API Keys |
| `NEXT_PUBLIC_APP_URL` | `https://parcefx.vercel.app` | Your Vercel domain (will know after deploy) |

### Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Click "Visit" when done
4. **COPY YOUR URL** (e.g., `https://parcefx-xxx.vercel.app`)

### Update APP_URL Variable

1. Go back to Vercel project
2. Click "Settings" → "Environment Variables"
3. Edit `NEXT_PUBLIC_APP_URL`
4. Paste your actual Vercel URL
5. Click "Save"
6. Trigger new deployment (or wait for auto-redeploy)

---

## Part 5: Test Everything (5 minutes)

### Test 1: Form Submission

1. Visit your deployed URL
2. Scroll to the form
3. Fill it out with **YOUR email**
4. Click submit
5. ✅ Should see success message

### Test 2: Database Check

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "leads" table
4. ✅ You should see your test entry

### Test 3: Email Check

1. Check your inbox (the email you submitted)
   - ✅ You should have received a welcome email
2. Check your notification email
   - ✅ You should have received a lead notification

### Test 4: Modal Check

1. Click "APRENDE SOBRE VIP" button
   - ✅ Modal should open with 4 pricing tiers
2. Click "CONTINUAR CON EL PAGO"
   - ✅ Should open Whop in new tab

---

## 🎉 You're Live!

Your landing page is now:

- ✅ Deployed on Vercel
- ✅ Connected to Supabase
- ✅ Sending emails via Resend
- ✅ Capturing leads
- ✅ Mobile optimized
- ✅ Protected against spam
- ✅ Tracking UTM parameters
- ✅ SEO optimized

---

## Next Steps:

### Add Custom Domain (Optional)

1. Vercel Settings → Domains
2. Add your domain
3. Update DNS records

### Verify Email Domain (Production)

1. Resend → Domains
2. Add your domain
3. Add DNS records
4. Update `from:` address in code

### Add Analytics

- Google Analytics
- Meta Pixel
- TikTok Pixel

See `app/layout.tsx` for where to add tracking scripts.

---

## 🚨 Common Issues

### "Email not sending"

- Check Resend API key is correct
- Use `onboarding@resend.dev` for testing
- Verify domain for production

### "Database error"

- Verify all 3 Supabase keys are correct
- Make sure SQL schema was run
- Check service_role key has no extra spaces

### "Build failed on Vercel"

- Check all environment variables are set
- No typos in variable names
- Click "Redeploy" after fixing

### "Form submits but no data in Supabase"

- Check service_role key (not anon key)
- Verify RLS policies were created
- Check Vercel function logs

### "Rate limit error"

- This is normal spam protection
- Wait 1 minute and try again
- Adjust rate limit in `app/api/subscribe/route.ts` if needed

---

## 📊 View Your Leads

### In Supabase:

1. Go to Supabase dashboard
2. Click "Table Editor"
3. Select "leads" table
4. See all captured leads with:
   - Name
   - Email
   - Phone
   - UTM parameters
   - Timestamp

### Export to CSV:

1. In Supabase Table Editor
2. Click the "..." menu
3. Select "Download as CSV"

---

## 🎯 Share Your Link!

Your landing page URL:
```
https://parcefx-xxx.vercel.app
```

Share it:
- Instagram bio
- TikTok bio
- YouTube description
- Facebook posts
- Twitter/X
- WhatsApp messages

---

## 💪 Pro Tips

- **Test on Mobile** - Most traffic will be mobile
- **Monitor Leads Daily** - Check Supabase dashboard
- **A/B Test Headlines** - Try different copy
- **Add Pixel Tracking** - Facebook Pixel, TikTok Pixel
- **Set Up Email Automation** - Create follow-up sequence
- **Track UTM Parameters** - See which campaigns convert best

---

## Need Help?

- Check Vercel deployment logs
- Review Supabase error messages
- Test API at: `https://your-site.vercel.app/api/subscribe`
- Check browser console for errors

Everything working? Share on social media! 🚀

---

## ⚠️ IMPORTANT SECURITY NOTES

1. **After deployment, delete the `.env.local` file and never commit it to GitHub!**
2. Never share your `service_role` key publicly
3. Keep your Resend API key secure
4. Use environment variables for all sensitive data
5. Enable 2FA on all your accounts (Supabase, Vercel, GitHub, Resend)

---

## 📝 What's New in This Version

This deployment includes:

- ✅ Spam protection (honeypot + rate limiting)
- ✅ UTM parameter tracking
- ✅ Email deduplication
- ✅ Better mobile form experience
- ✅ SEO optimization (OG tags, metadata)
- ✅ Performance improvements (optimized fonts, CSS)
- ✅ Analytics event tracking hooks
- ✅ Accessible form validation

---

**Ready to launch? Follow the steps above and you'll be live in 30 minutes!** 🚀
