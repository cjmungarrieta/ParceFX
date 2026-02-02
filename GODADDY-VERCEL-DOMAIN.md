# Connect GoDaddy domain to Vercel and go live

Use these steps to point your GoDaddy domain (e.g. `parcefx.com`) to your Vercel deployment so the site is live on your own domain.

---

## Part 1: Add your domain in Vercel

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)** and open your **ParceFX** project (the one connected to GitHub).
2. Click **Settings** (top tab).
3. In the left sidebar click **Domains**.
4. Under **Add**, type your domain, e.g.:
   - `parcefx.com` (root domain)
   - `www.parcefx.com` (optional; you can add both)
5. Click **Add**.
6. Vercel will show you which **DNS records** to create. Leave this tab open (or copy the values below).

**What Vercel will ask for (typical):**

- **Root domain (`parcefx.com`):**  
  - Type: **A**  
  - Name: **@** (or leave blank)  
  - Value: **76.76.21.21** (Vercel’s IP)

- **www (`www.parcefx.com`):**  
  - Type: **CNAME**  
  - Name: **www**  
  - Value: **cname.vercel-dns.com**

*(If Vercel shows different values, use the ones shown in the Domains page.)*

---

## Part 2: Configure DNS in GoDaddy

1. Go to **[GoDaddy](https://www.godaddy.com)** and sign in.
2. Click your **profile/account** (top right) → **My Products** (or **Domains**).
3. Find your domain (e.g. `parcefx.com`) and click **DNS** or **Manage DNS**.
4. You’ll add or edit records as follows.

### Option A: Use Vercel’s nameservers (recommended, simplest)

1. In **Domains** (or **Nameservers**), switch from “Default” to **Change nameservers** / **Custom**.
2. Set **two** nameservers (Vercel will show these when you add the domain):
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
3. Save. Propagation can take up to 24–48 hours (often 15–30 minutes).
4. In Vercel, **Domains** → your domain → **Refresh** until it shows **Valid Configuration**. No manual A/CNAME records needed in GoDaddy.

### Option B: Keep GoDaddy DNS and add A + CNAME

If you prefer to keep GoDaddy as DNS (no nameserver change):

1. **Root domain (`parcefx.com`):**
   - Click **Add** (or **Add Record**).
   - **Type:** A  
   - **Name:** @ (or leave blank for “root”)  
   - **Value / Points to:** `76.76.21.21`  
   - TTL: 600 or 1 Hour → **Save**.

2. **www:**
   - Click **Add** again.
   - **Type:** CNAME  
   - **Name:** www  
   - **Value / Points to:** `cname.vercel-dns.com`  
   - TTL: 600 or 1 Hour → **Save**.

3. If there is an existing **A** or **CNAME** for **@** or **www**, edit or remove it so only the records above point to Vercel.

4. Wait 5–30 minutes (up to 48 hours in rare cases). In Vercel → **Domains** → your domain → **Refresh** until it shows **Valid Configuration**.

---

## Part 3: SSL and “Valid Configuration”

- Vercel will issue a free **SSL certificate** (HTTPS) automatically once DNS is correct.
- In **Settings → Domains**, your domain should show **Valid Configuration** and **SSL** as active.
- If it stays “Invalid” or “Pending”, double‑check:
  - **Option A:** Nameservers are exactly `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
  - **Option B:** A record for **@** = `76.76.21.21`, CNAME for **www** = `cname.vercel-dns.com`, and no conflicting records.

---

## Part 4: Redirect www to root (optional)

If you want `https://parcefx.com` to be the main URL and `https://www.parcefx.com` to redirect to it:

1. Vercel → your project → **Settings** → **Domains**.
2. Add both `parcefx.com` and `www.parcefx.com`.
3. Click the **⋮** or settings next to `www.parcefx.com` and choose **Redirect to** → `parcefx.com` (or the primary domain you set).

---

## Part 5: Update env and app URL

1. In Vercel → your project → **Settings** → **Environment Variables**.
2. Set **`NEXT_PUBLIC_APP_URL`** to your live URL, e.g. `https://parcefx.com` (no trailing slash).
3. Redeploy: **Deployments** → latest deployment → **⋮** → **Redeploy** (so the app uses the new URL in metadata, links, etc.).

---

## Quick checklist

- [ ] Domain added in Vercel (**Settings** → **Domains**).
- [ ] DNS in GoDaddy: either **Vercel nameservers** (Option A) or **A + CNAME** (Option B).
- [ ] **Valid Configuration** and **SSL** in Vercel for your domain.
- [ ] `NEXT_PUBLIC_APP_URL` = `https://parcefx.com` (or your domain); redeploy once.
- [ ] Open `https://parcefx.com` in the browser and confirm the site loads.

After that, your ParceFX landing is live on your GoDaddy domain and fully deployed.
