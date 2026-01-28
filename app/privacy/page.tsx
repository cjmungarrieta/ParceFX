import Link from 'next/link';
import '../globals.css';

export default function PrivacyPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0D0D0D', 
      color: '#FFFFFF',
      padding: '80px 20px'
    }}>
      <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ 
          color: '#FFD700', 
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '40px',
          fontWeight: '600'
        }}>
          ← Volver al inicio
        </Link>
        
        <h1 style={{ 
          fontFamily: 'var(--font-oswald), sans-serif',
          fontSize: '3rem',
          marginBottom: '30px',
          color: '#FFD700'
        }}>
          Política de Privacidad
        </h1>
        
            <p style={{ fontSize: '0.9rem', color: '#B8B8B8', marginBottom: '40px' }}>
          Última actualización: Enero 2026
        </p>

        <div style={{ lineHeight: '1.8', fontSize: '1rem' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              1. Información que Recopilamos
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Cuando te registras para recibir nuestra estrategia gratuita, recopilamos la siguiente información:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li><strong>Nombre completo:</strong> Para personalizar tu experiencia</li>
              <li><strong>Dirección de correo electrónico:</strong> Para enviarte la estrategia y comunicaciones relacionadas</li>
              <li><strong>Número de teléfono (opcional):</strong> Solo si decides proporcionarlo para WhatsApp</li>
              <li><strong>Parámetros UTM:</strong> Para entender cómo llegaste a nuestro sitio (fuente de tráfico, campaña, etc.)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              2. Cómo Usamos Tu Información
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Utilizamos tu información únicamente para:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Enviarte la estrategia de trading gratuita que solicitaste</li>
              <li>Enviarte análisis de mercado semanales (puedes cancelar en cualquier momento)</li>
              <li>Mejorar nuestros servicios y contenido</li>
              <li>Analizar el rendimiento de nuestras campañas de marketing</li>
            </ul>
            <p>
              <strong>Nunca vendemos, alquilamos o compartimos tu información personal con terceros</strong> para fines comerciales.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              3. Almacenamiento de Datos
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Tus datos se almacenan de forma segura en:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li><strong>Supabase:</strong> Base de datos segura con encriptación</li>
              <li><strong>Resend:</strong> Servicio de email para enviarte la estrategia y comunicaciones</li>
            </ul>
            <p>
              Todos nuestros proveedores cumplen con estándares de seguridad internacionales (GDPR, SOC 2).
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              4. Tus Derechos
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Tienes derecho a:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li><strong>Acceder:</strong> Solicitar una copia de tus datos personales</li>
              <li><strong>Rectificar:</strong> Corregir información incorrecta</li>
              <li><strong>Eliminar:</strong> Solicitar la eliminación de tus datos</li>
              <li><strong>Cancelar suscripción:</strong> Darte de baja de nuestros emails en cualquier momento</li>
            </ul>
            <p>
              Para ejercer estos derechos, envía un email a: <a href="mailto:privacy@parcefx.com" style={{ color: '#FFD700' }}>privacy@parcefx.com</a>
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              5. Cookies y Tecnologías de Seguimiento
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Utilizamos tecnologías estándar para:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Analizar el tráfico del sitio web (Google Analytics, si está configurado)</li>
              <li>Mejorar la experiencia del usuario</li>
              <li>Proteger contra spam y abuso</li>
            </ul>
            <p>
              Puedes desactivar las cookies en la configuración de tu navegador, aunque esto puede afectar la funcionalidad del sitio.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              6. Seguridad
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Encriptación de datos en tránsito (HTTPS/SSL)</li>
              <li>Encriptación de datos en reposo</li>
              <li>Acceso restringido a datos personales</li>
              <li>Monitoreo regular de seguridad</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              7. Menores de Edad
            </h2>
            <p>
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información de menores de edad. Si descubrimos que hemos recopilado información de un menor, la eliminaremos inmediatamente.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              8. Cambios a Esta Política
            </h2>
            <p>
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos de cambios significativos por email o mediante un aviso en nuestro sitio web. La fecha de "Última actualización" al inicio de este documento indica cuándo se realizó la última revisión.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              9. Contacto
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Si tienes preguntas sobre esta política de privacidad, puedes contactarnos:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:privacy@parcefx.com" style={{ color: '#FFD700' }}>privacy@parcefx.com</a><br />
              <strong>Ubicación:</strong> Miami, Florida, Estados Unidos
            </p>
          </section>
        </div>

        <div style={{ 
          marginTop: '60px', 
          padding: '30px', 
          background: 'rgba(255, 215, 0, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 215, 0, 0.2)'
        }}>
          <p style={{ fontSize: '0.9rem', color: '#B8B8B8', lineHeight: '1.8' }}>
            <strong>Nota Legal:</strong> Esta política de privacidad cumple con los requisitos del Reglamento General de Protección de Datos (GDPR) de la UE y las leyes de privacidad de Estados Unidos. Al utilizar nuestros servicios, aceptas esta política de privacidad.
          </p>
        </div>
      </div>
    </div>
  );
}
