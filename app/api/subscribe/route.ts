import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (for production, use Vercel KV or Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 requests per minute per IP

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

    // Timestamp check - prevent too-fast submissions (likely bots)
    if (submitTimestamp) {
      const timeDiff = Date.now() - submitTimestamp;
      if (timeDiff < 2000) { // Less than 2 seconds = likely bot
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
        { error: 'Demasiadas solicitudes. Por favor intenta en un minuto.' },
        { status: 429 }
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

    // Check for duplicate email
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, email, created_at')
      .eq('email', normalizedEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (existingLead) {
      // Check if it was recent (within last hour)
      const lastSubmission = new Date(existingLead.created_at).getTime();
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      if (lastSubmission > oneHourAgo) {
        return NextResponse.json(
          { error: 'Ya te has registrado recientemente. Revisa tu email.' },
          { status: 409 }
        );
      }
      // If older than an hour, allow but don't send duplicate welcome email
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

    const isNewLead = !existingLead;

    // Send welcome email via Resend (only for new leads)
    if (isNewLead) {
      try {
        await resend.emails.send({
        from: 'ParceFX <onboarding@resend.dev>', // Replace with your verified domain
        to: email,
        subject: '🎯 Tu Estrategia de Trading Está Lista',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #FFD700, #FFED4E);
                color: #0D0D0D;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                text-transform: uppercase;
                letter-spacing: 2px;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .content h2 {
                color: #FFD700;
                margin-top: 0;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #FFD700, #FFED4E);
                color: #0D0D0D;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                text-transform: uppercase;
                margin: 20px 0;
                letter-spacing: 1px;
              }
              .benefits {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .benefits li {
                margin: 10px 0;
                padding-left: 25px;
                position: relative;
              }
              .benefits li:before {
                content: '✅';
                position: absolute;
                left: 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>PARCEFX</h1>
            </div>
            <div class="content">
              <h2>¡Bienvenido, ${nombre}! 🚀</h2>
              <p>Gracias por unirte a la comunidad de ParceFX. Estás a punto de dar el primer paso para transformar tu trading.</p>
              
              <div class="benefits">
                <h3>Lo que vas a recibir:</h3>
                <ul>
                  <li><strong>Estrategia Completa de Trading</strong> - El método exacto que uso</li>
                  <li><strong>Gestión de Riesgo</strong> - Protege tu capital como un profesional</li>
                  <li><strong>Setups de Alta Probabilidad</strong> - Los patrones que funcionan</li>
                  <li><strong>Psicología del Trader</strong> - Domina tu mentalidad</li>
                </ul>
              </div>

              <p><strong>¿Listo para el siguiente nivel?</strong></p>
              <p>Únete al Parce VIP y opera en vivo conmigo. Aprende viendo exactamente cómo analizo el mercado y ejecuto trades en tiempo real.</p>

              <center>
                <a href="https://whop.com/parce4x-s-whop/parce-vip-senales-mentoria" class="cta-button">
                  🎯 ÚNETE AL PARCE VIP
                </a>
              </center>

              <p style="margin-top: 30px; font-size: 14px; color: #666;">
                <strong>Opera en Vivo Conmigo:</strong><br>
                ✅ London & New York Sessions<br>
                ✅ Análisis Pre & Post-Trade<br>
                ✅ Gestión de Riesgo Real<br>
                ✅ Solo $97/mes
              </p>
            </div>
            <div class="footer">
              <p>ParceFX - Miami, Florida</p>
              <p>Trading implica riesgos. Los resultados pasados no garantizan resultados futuros.</p>
            </div>
          </body>
          </html>
        `,
        });
      } catch (emailError) {
        console.error('Resend error:', emailError);
        // Don't fail the request if email fails
        // Lead is already saved to database
      }
    }

    // Send notification to you (optional)
    try {
      await resend.emails.send({
        from: 'ParceFX Leads <onboarding@resend.dev>', // Replace with your verified domain
        to: 'your-email@example.com', // Replace with your email
        subject: `🔔 Nuevo Lead: ${nombre}`,
        html: `
          <h2>Nuevo Lead Capturado</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${normalizedEmail}</p>
          <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
          <p><strong>Fuente:</strong> Landing Page</p>
          ${utm_source ? `<p><strong>UTM Source:</strong> ${utm_source}</p>` : ''}
          ${utm_campaign ? `<p><strong>UTM Campaign:</strong> ${utm_campaign}</p>` : ''}
          ${utm_medium ? `<p><strong>UTM Medium:</strong> ${utm_medium}</p>` : ''}
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
        `,
      });
    } catch (notificationError) {
      console.error('Notification email error:', notificationError);
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
