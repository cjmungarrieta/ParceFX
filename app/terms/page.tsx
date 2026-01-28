import Link from 'next/link';
import '../globals.css';

export default function TermsPage() {
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
          Términos de Uso
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
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar el sitio web de ParceFX y nuestros servicios, aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestros servicios.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              2. Descripción del Servicio
            </h2>
            <p style={{ marginBottom: '15px' }}>
              ParceFX proporciona:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Contenido educativo sobre trading y análisis de mercados financieros</li>
              <li>Estrategias de trading y materiales educativos gratuitos</li>
              <li>Servicios premium opcionales (grupo VIP, análisis diario)</li>
            </ul>
            <p>
              <strong>No somos:</strong> Un asesor financiero registrado, un bróker, ni proporcionamos asesoramiento financiero personalizado.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              3. Advertencia de Riesgo
            </h2>
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid #EF4444',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <p style={{ marginBottom: '15px', fontWeight: '600' }}>
                ⚠️ ADVERTENCIA IMPORTANTE:
              </p>
              <ul style={{ marginLeft: '30px' }}>
                <li>El trading de divisas, futuros y otros instrumentos financieros conlleva un <strong>riesgo sustancial de pérdida</strong></li>
                <li>Puedes perder <strong>más de tu capital inicial</strong></li>
                <li>El trading no es adecuado para todas las personas</li>
                <li>Los resultados pasados <strong>NO garantizan</strong> resultados futuros</li>
                <li>Nunca operes con dinero que no puedas permitirte perder</li>
                <li>Busca asesoramiento financiero independiente antes de operar</li>
              </ul>
            </div>
            <p>
              Al utilizar nuestros servicios, reconoces que entiendes y aceptas estos riesgos.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              4. Uso del Contenido
            </h2>
            <p style={{ marginBottom: '15px' }}>
              El contenido proporcionado es para <strong>fines educativos únicamente</strong>. No constituye:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Asesoramiento financiero personalizado</li>
              <li>Recomendaciones de inversión</li>
              <li>Garantías de ganancias</li>
              <li>Solicitudes de compra o venta de instrumentos financieros</li>
            </ul>
            <p>
              Eres responsable de todas las decisiones de trading que tomes. ParceFX no se hace responsable de pérdidas financieras resultantes del uso de nuestra información.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              5. Propiedad Intelectual
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Todo el contenido del sitio web, incluyendo pero no limitado a:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Textos, gráficos, logos, imágenes</li>
              <li>Estrategias de trading y materiales educativos</li>
              <li>Videos y contenido multimedia</li>
            </ul>
            <p>
              Es propiedad de ParceFX y está protegido por leyes de derechos de autor. No puedes reproducir, distribuir, modificar o crear obras derivadas sin nuestro permiso escrito.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              6. Cuentas y Registro
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Al registrarte, te comprometes a:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Proporcionar información precisa y actualizada</li>
              <li>Mantener la seguridad de tu cuenta</li>
              <li>Ser mayor de 18 años</li>
              <li>No compartir tu cuenta con terceros</li>
            </ul>
            <p>
              Nos reservamos el derecho de suspender o terminar cuentas que violen estos términos.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              7. Servicios Premium
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Si te suscribes a nuestros servicios premium (grupo VIP):
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Los pagos se procesan a través de terceros (Whop, Stripe, etc.)</li>
              <li>Las suscripciones se renuevan automáticamente según el plan seleccionado</li>
              <li>Puedes cancelar tu suscripción en cualquier momento</li>
              <li>No ofrecemos reembolsos por servicios ya prestados</li>
              <li>Los precios pueden cambiar con previo aviso</li>
            </ul>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              8. Limitación de Responsabilidad
            </h2>
            <p style={{ marginBottom: '15px' }}>
              <strong>ParceFX no será responsable de:</strong>
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '15px' }}>
              <li>Pérdidas financieras resultantes del trading</li>
              <li>Decisiones de inversión basadas en nuestro contenido</li>
              <li>Interrupciones del servicio o errores técnicos</li>
              <li>Contenido de sitios web de terceros enlazados</li>
              <li>Daños indirectos, incidentales o consecuentes</li>
            </ul>
            <p>
              En la máxima medida permitida por la ley, nuestra responsabilidad total no excederá el monto que hayas pagado por nuestros servicios en los últimos 12 meses.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              9. Indemnización
            </h2>
            <p>
              Aceptas indemnizar y eximir de responsabilidad a ParceFX, sus afiliados, empleados y contratistas de cualquier reclamo, daño, pérdida, responsabilidad y gasto (incluyendo honorarios legales) que surjan de tu uso de nuestros servicios o violación de estos términos.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              10. Modificaciones de los Términos
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. Es tu responsabilidad revisar estos términos periódicamente. El uso continuado de nuestros servicios después de los cambios constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              11. Terminación
            </h2>
            <p>
              Podemos terminar o suspender tu acceso a nuestros servicios inmediatamente, sin previo aviso, por cualquier motivo, incluyendo pero no limitado a violación de estos términos. Al terminar, tu derecho a usar los servicios cesará inmediatamente.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              12. Ley Aplicable y Jurisdicción
            </h2>
            <p>
              Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos. Cualquier disputa relacionada con estos términos o nuestros servicios será resuelta en los tribunales competentes de Miami-Dade County, Florida.
            </p>
          </section>

          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-oswald), sans-serif',
              fontSize: '1.8rem',
              color: '#FFD700',
              marginBottom: '20px'
            }}>
              13. Contacto
            </h2>
            <p style={{ marginBottom: '15px' }}>
              Si tienes preguntas sobre estos términos, puedes contactarnos:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:legal@parcefx.com" style={{ color: '#FFD700' }}>legal@parcefx.com</a><br />
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
            <strong>Reconocimiento:</strong> Al utilizar nuestros servicios, reconoces que has leído, entendido y aceptas estar sujeto a estos Términos de Uso. Si no estás de acuerdo con estos términos, no debes utilizar nuestros servicios.
          </p>
        </div>
      </div>
    </div>
  );
}
