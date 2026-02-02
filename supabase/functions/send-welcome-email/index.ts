// Supabase Edge Function: send welcome email when a lead is inserted
// Deploy: supabase functions deploy send-welcome-email
// Secrets: RESEND_API_KEY (required), STRATEGY_PDF_URL (optional – public URL to PDF for attachment)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const STRATEGY_PDF_URL = Deno.env.get("STRATEGY_PDF_URL"); // optional: public URL to strategy PDF
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "ParceFX <onboarding@resend.dev>";
const NOTIFY_EMAIL = Deno.env.get("NOTIFY_EMAIL"); // optional: your email for lead notifications

interface LeadPayload {
  type: "INSERT";
  table: "leads";
  record: {
    id: string;
    nombre: string;
    email: string;
    telefono: string | null;
    source?: string;
    created_at: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({ error: "RESEND_API_KEY not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const payload: LeadPayload = await req.json();
    if (payload.type !== "INSERT" || payload.table !== "leads" || !payload.record) {
      return new Response(
        JSON.stringify({ error: "Invalid payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { nombre, email } = payload.record;

    const attachments: { filename: string; path: string }[] = [];
    if (STRATEGY_PDF_URL) {
      attachments.push({ filename: "Estrategia-ParceFX.pdf", path: STRATEGY_PDF_URL });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
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
      console.error("Resend error:", data);
      return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Optional: send you a notification
    if (NOTIFY_EMAIL) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `🔔 Nuevo Lead: ${nombre}`,
          html: `<p><strong>Nombre:</strong> ${nombre}<br/><strong>Email:</strong> ${email}<br/><strong>Fecha:</strong> ${new Date().toISOString()}</p>`,
        }),
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

function getWelcomeHtml(nombre: string, hasPdf: boolean): string {
  return `
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
  `.trim();
}

Deno.serve(handler);
