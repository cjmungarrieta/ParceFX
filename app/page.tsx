'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { FaInstagram, FaTelegram, FaYoutube, FaDiscord } from 'react-icons/fa';

const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const reducedMotion = useReducedMotion();
  const motionTransition = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExitIntentOpen, setIsExitIntentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [formLoadTimestamp] = useState(() => Date.now()); // Capture when form loads for bot detection

  // Capture UTM parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const utmParams: Record<string, string> = {};
      ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'].forEach(key => {
        const value = params.get(key);
        if (value) utmParams[key] = value;
      });
      // Store in sessionStorage for API call
      if (Object.keys(utmParams).length > 0) {
        sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
      }
    }
  }, []);

  // Exit intent detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if exit intent has already been shown
    const exitIntentShown = sessionStorage.getItem('exitIntentShown');
    if (exitIntentShown === 'true') return;

    // Wait at least 5 seconds before enabling exit intent (prevents immediate triggers)
    const startTime = Date.now();
    const minTimeOnPage = 5000; // 5 seconds

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if user has been on page for at least 5 seconds
      if (Date.now() - startTime < minTimeOnPage) return;
      
      // Only trigger if mouse is leaving toward the top of the page
      if (e.clientY <= 0) {
        setIsExitIntentOpen(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    // Track modal open event
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'vip_modal_open', {
        event_category: 'engagement',
        event_label: 'pricing_modal'
      });
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // Save form reference before async operations
    setIsSubmitting(true);
    setSubmitMessage('');
    setFieldErrors({});
    setErrorMessage('');

    // Track submit started
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'lead_submit_started', {
        event_category: 'conversion',
        event_label: 'form_submission'
      });
    }

    const formData = new FormData(form);
    const honeypot = formData.get('website') as string; // Honeypot field

    // Check honeypot
    if (honeypot && honeypot.trim() !== '') {
      setErrorMessage('Spam detected');
      setIsSubmitting(false);
      return;
    }

    const data = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      telefono: formData.get('telefono') as string || null,
      website: formData.get('website') as string, // Honeypot
      submitTimestamp: formLoadTimestamp, // Use form load time for bot detection (not submit time)
      utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : null,
      utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null,
      utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : null,
      utm_content: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_content') : null,
      utm_term: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_term') : null,
    };

    // Client-side validation
    const errors: Record<string, string> = {};
    if (!data.nombre || data.nombre.trim().length < 2) {
      errors.nombre = 'Por favor ingresa tu nombre completo';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage('success');
        form.reset();
        setFieldErrors({});
        
        // Track success
        if (typeof window !== 'undefined') {
          window.gtag?.('event', 'lead_submit_success', {
            event_category: 'conversion',
            event_label: 'form_submission',
            value: 1
          });
        }
        
        // Open modal after successful submission
        setTimeout(() => openModal(), 500);
      } else {
        setSubmitMessage('error');
        setErrorMessage(result.error || 'Error al enviar. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage('error');
      setErrorMessage('Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-effect">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* Scrolling Banner */}
      <ScrollingBanner />

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={motionTransition}
      >
        <div className="container">
          <div className="header-content">
            <div className="brand">
              <div className="logo">
                PARCE<span style={{ color: 'var(--accent-white)' }}>FX</span>
              </div>
              <p className="header-tagline">
                Trader Independiente | Miami, FL
              </p>
            </div>
            <div className="social-links">
              <a href="https://instagram.com/parcefx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram /> <span>Instagram</span>
              </a>
              <a href="https://t.me/+qs8TLnt4TyhjMDFh" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FaTelegram /> <span>Telegram</span>
              </a>
              <a href="https://www.youtube.com/@ParceTrades" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube /> <span>YouTube</span>
              </a>
              <a href="https://discord.gg/mPF5X3aY" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <FaDiscord /> <span>Discord</span>
              </a>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.section
        className="hero"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        transition={motionTransition}
      >
        <div className="container">
          <motion.div className="hero-content" variants={staggerItem}>
            <h1>
              El Trading No Es Magia.<br />
              Es <span className="highlight">Disciplina</span>.
            </h1>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.8' }}>
              De $0 a $10K en 90 días no sucede por suerte. Sucede cuando entiendes gestión de riesgo, psicología del mercado, y ejecutas con disciplina.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '20px' }}>
              Soy un trader independiente operando desde Miami. Aquí comparto exactamente lo que hago—sin exagerar ganancias, sin prometer millones, sin venderte cursos de $2,000.
            </p>
          </motion.div>
          <motion.div className="hero-image-wrapper" variants={staggerItem}>
            <Image 
              src="/hero-image.jpg" 
              alt="ParceFX Trader Success" 
              className="hero-image"
              width={500}
              height={500}
              priority
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="lead-section container"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={motionTransition}
      >
        <div className="lead-content">
          <h2>📥 Recibe Mi Estrategia de Entrada Gratis</h2>
          <p className="subtitle">
            La misma que uso para identificar setups de alta probabilidad.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '10px', marginBottom: '30px' }}>
            → Registro simple. Sin tarjeta. Sin spam.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot field - hidden from users */}
            <input 
              type="text" 
              name="website" 
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px' }}
              aria-hidden="true"
            />
            <div>
              <input 
                type="text" 
                name="nombre"
                placeholder="Tu Nombre Completo" 
                required
                disabled={isSubmitting}
                autoComplete="name"
                inputMode="text"
                aria-invalid={fieldErrors.nombre ? 'true' : 'false'}
                aria-describedby={fieldErrors.nombre ? 'nombre-error' : undefined}
              />
              {fieldErrors.nombre && (
                <div id="nombre-error" style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '5px' }}>
                  {fieldErrors.nombre}
                </div>
              )}
            </div>
            <div>
              <input 
                type="email" 
                name="email"
                placeholder="Tu Mejor Email" 
                required
                disabled={isSubmitting}
                autoComplete="email"
                inputMode="email"
                aria-invalid={fieldErrors.email ? 'true' : 'false'}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <div id="email-error" style={{ color: '#EF4444', fontSize: '0.9rem', marginTop: '5px' }}>
                  {fieldErrors.email}
                </div>
              )}
            </div>
            <div>
              <input 
                type="tel" 
                name="telefono"
                placeholder="WhatsApp (Opcional)"
                disabled={isSubmitting}
                autoComplete="tel"
                inputMode="tel"
              />
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '⏳ ENVIANDO...' : '📥 DESCARGAR ESTRATEGIA GRATIS'}
            </button>
          </form>

          {submitMessage === 'success' && (
            <div 
              role="status"
              aria-live="polite"
              style={{ 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '2px solid #22C55E', 
                borderRadius: '12px', 
                padding: '20px', 
                marginTop: '20px',
                textAlign: 'center',
                color: '#22C55E'
              }}
            >
              <strong>✅ ¡Perfecto!</strong> Revisa tu email en los próximos minutos.
            </div>
          )}

          {submitMessage === 'error' && (
            <div
              role="alert"
              aria-live="assertive"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid #EF4444',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px',
                textAlign: 'center',
                color: '#EF4444'
              }}
            >
              <strong>❌</strong> {errorMessage || 'No se pudo enviar. Por favor intenta de nuevo.'}
              <p style={{ fontSize: '0.85rem', marginTop: '10px', opacity: 0.9 }}>Si sigue fallando, espera 1 minuto o escríbenos por Instagram.</p>
            </div>
          )}

          <div className="guarantee" style={{ marginTop: '30px' }}>
            <p className="guarantee-text" style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
              ✅ Estrategia completa en PDF<br />
              ✅ Video explicativo (12 min)<br />
              ✅ Template de diario de trading<br />
              <strong style={{ color: 'var(--yellow-bright)', marginTop: '10px', display: 'block' }}>
                🔒 Tus datos están seguros. Nunca los compartimos.
              </strong>
            </p>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '20px', fontStyle: 'italic', textAlign: 'center' }}>
            <strong>Disclaimer:</strong> Trading implica riesgo de pérdida. Resultados pasados no garantizan resultados futuros.
          </p>
        </div>
      </motion.section>

      {/* Rest of sections... */}
      <WhyDifferentSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={motionTransition}
      >
        <div className="container">
          <div className="footer-content">
            <div className="footer-social">
              <a href="https://instagram.com/parcefx" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram /> <span>Instagram</span>
              </a>
              <a href="https://t.me/+qs8TLnt4TyhjMDFh" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FaTelegram /> <span>Telegram</span>
              </a>
              <a href="https://www.youtube.com/@ParceTrades" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube /> <span>YouTube</span>
              </a>
              <a href="https://discord.gg/mPF5X3aY" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                <FaDiscord /> <span>Discord</span>
              </a>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>
              ParceFX | Trading Real Sin Filtros
            </p>
            <p>Miami, Florida</p>
            <p style={{ marginTop: '20px', fontSize: '0.85rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6' }}>
              <strong>Disclaimer:</strong> El trading implica riesgo sustancial de pérdida. No es adecuado para todos. Opera solo con capital que puedas permitirte perder. Los resultados mostrados son experiencias individuales y no representan ganancias típicas.
            </p>
            <p style={{ marginTop: '15px', fontSize: '0.85rem' }}>
              <a href="/privacy" style={{ color: 'var(--yellow-primary)', textDecoration: 'underline' }}>Política de Privacidad</a> | 
              <a href="/terms" style={{ color: 'var(--yellow-primary)', textDecoration: 'underline', marginLeft: '5px' }}> Términos de Uso</a>
            </p>
            <p style={{ marginTop: '15px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              © 2026 ParceFX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Modal */}
      {isModalOpen && <Modal closeModal={closeModal} />}

      {/* Exit Intent Popup */}
      {isExitIntentOpen && (
        <ExitIntentPopup 
          closePopup={() => setIsExitIntentOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

// Exit Intent Popup Component
function ExitIntentPopup({
  closePopup,
  isSubmitting: parentIsSubmitting
}: {
  closePopup: () => void;
  isSubmitting: boolean;
}) {
  const [email, setEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [popupLoadTimestamp] = useState(() => Date.now()); // Capture when popup opens for bot detection

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitStatus('error');
      setErrorMessage('Por favor ingresa un email válido');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: 'Exit Intent Lead',
          email: email.trim().toLowerCase(),
          telefono: null,
          website: '', // Honeypot
          submitTimestamp: popupLoadTimestamp, // Use popup load time for bot detection
          utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') : null,
          utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') : null,
          utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') : null,
          utm_content: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_content') : null,
          utm_term: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_term') : null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Track exit intent conversion
        if (typeof window !== 'undefined') {
          window.gtag?.('event', 'exit_intent_conversion', {
            event_category: 'conversion',
            event_label: 'exit_intent_popup',
            value: 1
          });
        }
        // Close popup after 3 seconds
        setTimeout(() => {
          closePopup();
        }, 3000);
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Error al enviar. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Exit intent submission error:', error);
      setSubmitStatus('error');
      setErrorMessage('Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="exit-intent-overlay"
      onClick={closePopup}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.95)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div 
        className="exit-intent-popup"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, var(--black-secondary), var(--black-tertiary))',
          borderRadius: '20px',
          padding: '0',
          maxWidth: '600px',
          width: '100%',
          border: '3px solid var(--yellow-primary)',
          boxShadow: '0 0 100px rgba(255, 215, 0, 0.5)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <button
          onClick={closePopup}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: '#FFFFFF',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 10001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)';
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Image Section */}
          <div style={{
            width: '100%',
            height: '300px',
            position: 'relative',
            background: '#1A1A1A'
          }}>
            <Image
              src="/ebook-cover.png"
              alt="Estrategia de Trading Gratis"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Content Section */}
          <div style={{ padding: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '2rem',
              color: 'var(--yellow-primary)',
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              ¡Espera! No Te Vayas Sin Tu Estrategia
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              Recibe tu estrategia de trading completa en PDF + video explicativo. 
              <strong style={{ color: 'var(--yellow-bright)' }}> 100% Gratis.</strong>
            </p>

            <form onSubmit={handleFormSubmit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu Email"
                required
                disabled={isSubmitting || submitStatus === 'success'}
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  fontSize: '1.1rem',
                  border: submitStatus === 'error' ? '2px solid #EF4444' : '2px solid rgba(255, 215, 0, 0.3)',
                  background: 'var(--black-primary)',
                  color: 'var(--text-primary)',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--yellow-primary)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              
              {submitStatus === 'success' && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '2px solid #22C55E',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  color: '#22C55E',
                  fontSize: '0.95rem'
                }}>
                  ✅ ¡Perfecto! Revisa tu email en los próximos minutos.
                </div>
              )}

              {submitStatus === 'error' && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid #EF4444',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '20px',
                  textAlign: 'center',
                  color: '#EF4444',
                  fontSize: '0.95rem'
                }}>
                  ❌ {errorMessage || 'No se pudo enviar. Por favor intenta de nuevo.'}
                  <p style={{ fontSize: '0.8rem', marginTop: '8px', opacity: 0.9 }}>Si sigue fallando, espera 1 minuto.</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                style={{
                  width: '100%',
                  padding: '20px',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  background: submitStatus === 'success' 
                    ? 'rgba(34, 197, 94, 0.3)' 
                    : 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-bright))',
                  color: 'var(--black-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (isSubmitting || submitStatus === 'success') ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontFamily: 'var(--font-oswald), sans-serif',
                  transition: 'all 0.3s',
                  boxShadow: '0 10px 40px rgba(255, 215, 0, 0.4)',
                  opacity: (isSubmitting || submitStatus === 'success') ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && submitStatus !== 'success') {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 215, 0, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255, 215, 0, 0.4)';
                }}
              >
                {isSubmitting ? '⏳ ENVIANDO...' : submitStatus === 'success' ? '✅ ENVIADO' : '📥 DESCARGAR ESTRATEGIA GRATIS'}
              </button>
            </form>

            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              marginTop: '20px',
              lineHeight: '1.6'
            }}>
              ✅ PDF + Video incluidos<br />
              🔒 Sin spam. Cancela cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Scrolling Banner Component
function ScrollingBanner() {
  return (
    <div className="scrolling-banner">
      <div className="scrolling-banner-content">
        <span>📥 ESTRATEGIA GRATIS - REGISTRA TU EMAIL Y RECÍBELA AHORA</span>
        <span>📥 ESTRATEGIA GRATIS - REGISTRA TU EMAIL Y RECÍBELA AHORA</span>
        <span>📥 ESTRATEGIA GRATIS - REGISTRA TU EMAIL Y RECÍBELA AHORA</span>
        <span>📥 ESTRATEGIA GRATIS - REGISTRA TU EMAIL Y RECÍBELA AHORA</span>
        <span>📥 ESTRATEGIA GRATIS - REGISTRA TU EMAIL Y RECÍBELA AHORA</span>
      </div>
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer() {
  const [time, setTime] = useState({ hours: 23, minutes: 47, seconds: 32 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      
      if (diff <= 0) {
        // Reset to next midnight if past midnight
        midnight.setDate(midnight.getDate() + 1);
        const newDiff = midnight.getTime() - now.getTime();
        const hours = Math.floor(newDiff / (1000 * 60 * 60));
        const minutes = Math.floor((newDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((newDiff % (1000 * 60)) / 1000);
        setTime({ hours, minutes, seconds });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTime({ hours, minutes, seconds });
      }
    };

    // Initial update
    updateCountdown();

    // Set up interval
    const interval = setInterval(updateCountdown, 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown">
      <div className="countdown-item">
        <span className="countdown-number">{String(time.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Horas</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{String(time.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Minutos</span>
      </div>
      <div className="countdown-item">
        <span className="countdown-number">{String(time.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">Segundos</span>
      </div>
    </div>
  );
}

// Modal Component
function Modal({ closeModal }: { closeModal: () => void }) {
  return (
    <div className="modal" style={{ display: 'block' }} onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🎯 ¡ÚNETE AL PARCE VIP!</h3>
          <span className="close" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          <h4>Opera en Vivo con un Trader Real</h4>
          <p>+6 Años de Experiencia Operando</p>
          
          <PricingOptions />

          <ul className="modal-benefits">
            <li><strong>Operativa en Vivo</strong> - London & New York Sessions</li>
            <li><strong>Análisis Pre & Post-Trade</strong> - Por qué entramos y salimos</li>
            <li><strong>Gestión de Riesgo Real</strong> - Sin gambling, solo estrategia</li>
            <li><strong>Psicología de Trading</strong> - Mentalidad para consistencia</li>
            <li><strong>Acceso Continuo</strong> - Durante toda tu suscripción</li>
          </ul>

          <a 
            href="https://whop.com/parce4x-s-whop/parce-vip-senales-mentoria" 
            target="_blank" 
            rel="noopener noreferrer"
            className="modal-cta"
            onClick={() => {
              // Track VIP click
              if (typeof window !== 'undefined') {
                window.gtag?.('event', 'vip_click_whop', {
                  event_category: 'conversion',
                  event_label: 'whop_checkout',
                  value: 1
                });
              }
            }}
          >
            🚀 CONTINUAR CON EL PAGO
          </a>

          <div className="modal-trust">
            <p><strong>⭐ 5.0 Estrellas</strong> - Basado en 3 reseñas</p>
            <p><strong>👥 31 Miembros Activos</strong> - Únete a la comunidad</p>
            <p style={{ marginTop: '20px', fontSize: '0.85rem' }}>
              Esto no es para curiosos. Es para traders que quieren dejar de improvisar<br />
              y empezar a operar con un plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pricing Options Component
function PricingOptions() {
  const [selected, setSelected] = useState('monthly');

  return (
    <div className="pricing-options">
      {[
        { id: 'monthly', price: '$97.00', period: '/ mes', discount: null },
        { id: '3months', price: '$219.00', period: '/ 3 meses', discount: '25% off' },
        { id: '6months', price: '$349.00', period: '/ 6 meses', discount: '40% off', highlight: true },
        { id: 'yearly', price: '$499.00', period: '/ año', discount: '57% off', best: true },
      ].map((option) => (
        <div 
          key={option.id}
          className="pricing-option" 
          onClick={() => setSelected(option.id)}
        >
          <div className="pricing-header">
            <div className="pricing-main">
              <span className="price">{option.price}</span>
              <span className="period">{option.period}</span>
              {option.discount && (
                <span className={`discount ${option.highlight ? 'highlight' : ''} ${option.best ? 'best' : ''}`}>
                  {option.discount}
                </span>
              )}
            </div>
            <div className="pricing-radio">
              <input 
                type="radio" 
                name="pricing" 
                id={option.id} 
                value={option.id}
                checked={selected === option.id}
                onChange={() => setSelected(option.id)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Why Different Section
function WhyDifferentSection() {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };
  return (
    <motion.section
      className="features container"
      style={{ padding: '80px 0' }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={t}
    >
      <h2>¿Por Qué Esto Es Diferente?</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
        La mayoría de "mentores" te muestran sus mejores trades en Lamborghinis.<br />
        Yo te muestro:
      </p>
      <motion.div
        className="features-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        <motion.div className="feature" variants={staggerItem}>
          <div className="feature-icon">✅</div>
          <h3>Mis Pérdidas</h3>
          <p>Porque todos las tenemos. Te muestro los errores que cometí perdiendo $3,200 en mi primer mes.</p>
        </motion.div>
        <motion.div className="feature" variants={staggerItem}>
          <div className="feature-icon">📊</div>
          <h3>Mi Ratio Real</h3>
          <p>Mi ratio de riesgo/beneficio real. Sin exagerar. Sin ocultar las pérdidas.</p>
        </motion.div>
        <motion.div className="feature" variants={staggerItem}>
          <div className="feature-icon">🎯</div>
          <h3>Proceso, No Resultados</h3>
          <p>No vendo resultados. Enseño proceso. Esto es lo que separa a los que sobreviven de los que explotan su cuenta.</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      text: "Después de perder $4K con 'gurús', encontré a ParceFX. Su enfoque en gestión de riesgo cambió todo. Llevo 4 meses positivo.",
      author: "Carlos M.",
      location: "Pequeño empresario"
    },
    {
      text: "No promete Lamborghinis. Te enseña a no explotar tu cuenta. Eso vale oro.",
      author: "María G.",
      location: "Madre soltera que tradea part-time"
    },
    {
      text: "Perdí mi primera cuenta ($800). Con lo que aprendí aquí, estoy recuperándome sistemáticamente.",
      author: "José R.",
      location: "Estudiante universitario"
    }
  ];

  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };
  return (
    <motion.section
      className="proof-section container"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={t}
    >
      <h2>Qué Dicen Otros Traders</h2>
      <motion.div
        className="testimonials"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {testimonials.map((t, i) => (
          <motion.div key={i} className="testimonial" variants={staggerItem}>
            <p className="testimonial-text">{t.text}</p>
            <p className="testimonial-author">— {t.author}</p>
            <p className="testimonial-location">{t.location}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: '📊', title: 'Mi Estrategia de Setups', text: 'Los 3 patrones que busco cada día en Forex y futuros. Explicados con ejemplos reales de mis operaciones.' },
    { icon: '🛡️', title: 'Gestión de Riesgo Profesional', text: 'Cómo nunca arriesgar más del 1-2% por operación. Esto es lo que separa a los que sobreviven de los que explotan su cuenta.' },
    { icon: '🧠', title: 'Diario de Trading', text: 'Mi template exacto para documentar cada operación y mejorar consistentemente.' },
    { icon: '🎯', title: 'Checklist Pre-Trade', text: 'Las 7 preguntas que me hago antes de presionar "buy" o "sell". Esto me salvó de pérdidas impulsivas.' }
  ];

  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };
  return (
    <motion.section
      className="features container"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={t}
    >
      <h2>Lo Que Aprenderás (Gratis)</h2>
      <motion.div
        className="features-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {features.map((f, i) => (
          <motion.div key={i} className="feature" variants={staggerItem}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function FAQSection() {
  const faqs = [
    { q: '¿Por qué es gratis?', a: 'Porque construyo comunidad primero. Si te sirve, eventualmente algunos se unen a mi grupo VIP para análisis diario. Pero la estrategia base es tuya sin compromiso.' },
    { q: '¿Funciona para principiantes?', a: 'Sí. De hecho, si nunca has operado, mejor—no tienes malos hábitos que desaprender.' },
    { q: '¿Cuánto capital necesito?', a: 'Puedes practicar con cuenta demo $0. Para operar real, $500 mínimo. Pero primero domina la estrategia en demo.' },
    { q: '¿Me vas a bombardear con emails?', a: 'No. Recibirás la estrategia inmediatamente, luego 1 email semanal con análisis de mercado. Cancela cuando quieras.' }
  ];

  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };
  return (
    <motion.section
      className="faq-section"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={t}
    >
      <h2>Preguntas Frecuentes</h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
      >
        {faqs.map((faq, i) => (
          <motion.div key={i} variants={staggerItem}>
            <FAQItem question={faq.q} answer={faq.a} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        {question}
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

function FinalCTASection({ onSubmit, isSubmitting }: any) {
  const reducedMotion = useReducedMotion();
  const t = reducedMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' as const };
  return (
    <motion.section
      className="lead-section container"
      style={{ marginBottom: 0 }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={t}
    >
      <div className="lead-content">
        <h2>🎯 Descarga Tu Estrategia Ahora</h2>
        <p className="subtitle">
          Acceso inmediato. Sin tarjeta. Sin trampas.
        </p>
        <form onSubmit={onSubmit}>
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px' }}
            aria-hidden="true"
          />
          <input
            type="text"
            name="nombre"
            placeholder="Tu Nombre"
            required
            disabled={isSubmitting}
            autoComplete="name"
            inputMode="text"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu Email"
            required
            disabled={isSubmitting}
            autoComplete="email"
            inputMode="email"
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '⏳ ENVIANDO...' : '📥 ENVIAR ESTRATEGIA →'}
          </button>
        </form>
      </div>
    </motion.section>
  );
}

