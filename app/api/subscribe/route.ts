import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend for email sending (optional - only if RESEND_API_KEY is set)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL || 'ParceFX <onboarding@resend.dev>';
const STRATEGY_PDF_URL = process.env.STRATEGY_PDF_URL || null;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || null;

// Simple in-memory rate limiting (for production, use Vercel KV or Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 requests per minute per IP

// Helper function to normalize email
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Helper function to get client IP
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return realIP || 'unknown';
}

// Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// Welcome email HTML template
function getWelcomeHtml(nombre: string, hasPdf: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FFD700, #FFED4E); color: #0D0D0D; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .content h2 { color: #B8860B; margin-top: 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #FFD700, #FFED4E); color: #0D0D0D; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; margin: 10px 0; letter-spacing: 1px; }
    .telegram-button { display: inline-block; background: #0088cc; color: #FFFFFF; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; margin: 10px 0; letter-spacing: 1px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header"><h1>PARCEFX</h1></div>
  <div class="content">
    <h2>¡Bienvenido, ${nombre}! 🚀</h2>
    <p>Gracias por unirte a la comunidad de ParceFX.</p>
    ${hasPdf ? '<p><strong>📎 Tu estrategia en PDF está adjunta a este email.</strong> Descárgala y guárdala.</p>' : ''}
    <p><strong>Únete a nuestro grupo de Telegram</strong> para recibir análisis diarios, señales y conectar con otros traders:</p>
    <p style="text-align:center;"><a href="https://t.me/+qs8TLnt4TyhjMDFh" class="telegram-button">📱 UNIRSE AL TELEGRAM</a></p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
    <p>¿Listo para el siguiente nivel? Únete al <strong>Parce VIP</strong> y opera en vivo conmigo.</p>
    <p style="text-align:center;"><a href="https://whop.com/parce4x-s-whop/parce-vip-senales-mentoria" class="cta-button">🎯 ÚNETE AL PARCE VIP</a></p>
  </div>
  <div class="footer"><p>ParceFX - Miami, Florida</p><p>Trading implica riesgos. Los resultados pasados no garantizan resultados futuros.</p></div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      email, 
      telefono, 
      website, // Honeypot field
      utm_source,
      utm_campaign,
      utm_medium,
      utm_content,
      utm_term,
      submitTimestamp // Client-side timestamp
    } = body;

    // Honeypot check
    if (website) {
      console.warn('Honeypot triggered');
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    // Timestamp check - reject only suspiciously fast submissions (e.g. bots, < 500ms)
    if (submitTimestamp && typeof submitTimestamp === 'number') {
      const timeDiff = Date.now() - submitTimestamp;
      if (timeDiff < 0 || timeDiff < 500) {
        console.warn('Submission too fast, likely bot');
        return NextResponse.json(
          { error: 'Por favor espera un momento antes de enviar nuevamente' },
          { status: 429 }
        );
      }
    }

    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Espera un minuto antes de enviar de nuevo. Límite de envíos por seguridad.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // Validate required fields
    if (!nombre || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Normalize and validate email
    const normalizedEmail = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Check for duplicate email - one signup per email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, email')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingLead) {
      return NextResponse.json(
        { error: 'Este email ya está registrado. Revisa tu bandeja de entrada y carpeta de spam.' },
        { status: 409 }
      );
    }

    // Save to Supabase with UTM parameters
    const leadData: any = {
      nombre: nombre.trim(),
      email: normalizedEmail,
      telefono: telefono ? telefono.trim() : null,
      created_at: new Date().toISOString(),
      source: 'landing_page',
      utm_source: utm_source || null,
      utm_campaign: utm_campaign || null,
      utm_medium: utm_medium || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
    };

    const { data: lead, error: dbError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase error:', dbError);
      
      // Handle duplicate email error gracefully
      if (dbError.code === '23505' || dbError.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado. Revisa tu bandeja de entrada.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Error guardando el lead. Por favor intenta nuevamente.' },
        { status: 500 }
      );
    }

    // Send welcome email in background (don't block the response)
    if (resend) {
      const hasPdf = !!STRATEGY_PDF_URL;
      const attachments: { filename: string; path: string }[] = [];
      if (STRATEGY_PDF_URL) {
        attachments.push({ filename: 'Estrategia-ParceFX.pdf', path: STRATEGY_PDF_URL });
      }

      // Fire and forget - don't await, so response is instant
      resend.emails.send({
        from: FROM_EMAIL,
        to: normalizedEmail,
        subject: '🎯 Tu Estrategia de Trading Está Lista',
        html: getWelcomeHtml(nombre.trim(), hasPdf),
        ...(attachments.length > 0 && { attachments }),
      }).then(() => {
        console.log(`Welcome email sent to ${normalizedEmail}`);
      }).catch((err) => {
        console.error('Error sending welcome email:', err);
      });

      // Optional: send notification to admin (also fire and forget)
      if (NOTIFY_EMAIL) {
        resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject: `🔔 Nuevo Lead: ${nombre.trim()}`,
          html: `<p><strong>Nombre:</strong> ${nombre.trim()}<br/><strong>Email:</strong> ${normalizedEmail}<br/><strong>Fecha:</strong> ${new Date().toISOString()}</p>`,
        }).catch((err) => {
          console.error('Error sending admin notification:', err);
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead guardado exitosamente',
      lead
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
