import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (welcome email is sent by Supabase Edge Function on insert)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Welcome email + PDF are sent by Supabase Edge Function (Database Webhook on leads INSERT)

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
