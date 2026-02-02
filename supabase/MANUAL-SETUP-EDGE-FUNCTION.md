# Supabase sends the welcome email (dashboard only – no CLI)

Do everything from [Supabase Dashboard](https://supabase.com/dashboard). No terminal needed.

---

## Step 1: Run the SQL

1. Open your project at **supabase.com/dashboard**.
2. In the left sidebar click **SQL Editor**.
3. Click **New query**.
4. Open the file `supabase/MANUAL-SETUP.sql` in this repo, copy **all** of it, paste into the query box.
5. Click **Run** (or press Ctrl+Enter).

You should see “Success. No rows returned” (or similar). The `leads` table is ready.

---

## Step 2: Add your secrets (for the Edge Function)

1. In the left sidebar click **Edge Functions**.
2. Go to **Secrets** (or **Manage secrets** / **Environment variables** – same place).
3. Add these **secrets** (name = Key, value = Value):

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | Your Resend API key (starts with `re_`) |
| `STRATEGY_PDF_URL` | `https://dboapuwnmcxfrrskqjgk.supabase.co/storage/v1/object/public/content/ParceFX_Trading_Guide_PRO%20(1).pdf` |

Optional:

| Name | Value |
|------|--------|
| `NOTIFY_EMAIL` | Your email (to get a notification for each new lead) |
| `FROM_EMAIL` | e.g. `ParceFX <hello@yourdomain.com>` (must be verified in Resend) |

4. Save.

---

## Step 3: Create the Edge Function (paste code)

1. In the left sidebar click **Edge Functions**.
2. Click **Deploy a new function** (or **Create function**).
3. Choose **Via Editor** (not “Via GitHub”).
4. **Function name:** `send-welcome-email` (exactly).
5. In the code editor, **delete** any template code and paste the code below instead.

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const STRATEGY_PDF_URL = Deno.env.get("STRATEGY_PDF_URL");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "ParceFX <onboarding@resend.dev>";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL");

interface LeadPayload {
  type: "INSERT";
  table: string;
  record: { id: string; nombre: string; email: string; telefono: string | null; created_at: string };
}

const handler = async (req: Request): Promise<Response> => {
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: "RESEND_API_KEY not set" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  try {
    const payload: LeadPayload = await req.json();
    if (payload.type !== "INSERT" || payload.table !== "leads" || !payload.record) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { nombre, email } = payload.record;
    const attachments: { filename: string; path: string }[] = [];
    if (STRATEGY_PDF_URL) {
      attachments.push({ filename: "Estrategia-ParceFX.pdf", path: STRATEGY_PDF_URL });
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: "🎯 Tu Estrategia de Trading Está Lista",
        html: getWelcomeHtml(nombre, !!STRATEGY_PDF_URL),
        ...(attachments.length > 0 && { attachments }),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    if (NOTIFY_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `🔔 Nuevo Lead: ${nombre}`,
          html: `<p><strong>Nombre:</strong> ${nombre}<br/><strong>Email:</strong> ${email}<br/><strong>Fecha:</strong> ${new Date().toISOString()}</p>`,
        }),
      });
    }
    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

function getWelcomeHtml(nombre: string, hasPdf: boolean): string {
  return (
    `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFD700, #FFED4E); color: #0D0D0D; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .content h2 { color: #FFD700; margin-top: 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFED4E); color: #0D0D0D; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; margin: 20px 0; letter-spacing: 1px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h1>PARCEFX</h1></div>
  <div class="content">
    <h2>¡Bienvenido, ${nombre}! 🚀</h2>
    <p>Gracias por unirte a la comunidad de ParceFX.</p>
    ${hasPdf ? "<p><strong>📎 Tu estrategia en PDF está adjunta a este email.</strong> Descárgala y guárdala.</p>" : ""}
    <p>¿Listo para el siguiente nivel? Únete al Parce VIP y opera en vivo conmigo.</p>
    <p style="text-align:center;"><a href="https://whop.com/parce4x-s-whop/parce-vip-senales-mentoria" class="cta-button">🎯 ÚNETE AL PARCE VIP</a></p>
  </div>
  <div class="footer"><p>ParceFX - Miami, Florida</p><p>Trading implica riesgos. Los resultados pasados no garantizan resultados futuros.</p></div>
</body>
</html>
  `.trim()
  );
}

Deno.serve(handler);
```

6. Click **Deploy function** (or **Save** then **Deploy**). Wait until it says the function is deployed.

---

## Step 4: Create the Database Webhook (trigger on new lead)

1. In the left sidebar click **Database**.
2. Click **Webhooks**.
3. Click **Create a new webhook**.
4. Fill in:
   - **Name:** e.g. `Send welcome email on lead`
   - **Table:** `leads`
   - **Events:** tick **Insert**
   - **Type:** **Supabase Edge Function**
   - **Edge Function:** select `send-welcome-email`
5. Click **Create** (or **Save**).

---

## Done

When someone submits the form on your site:

1. Vercel saves the lead into the `leads` table.
2. Supabase runs the webhook and calls `send-welcome-email`.
3. The function sends the welcome email (with your strategy PDF) via Resend and, if you set it, a notification to you.

All of this is done from the Supabase dashboard; no CLI required.
