import { ImageResponse } from 'next/og'

export const alt = 'ParceFX - Trader Independiente | Miami, FL | Estrategia de Trading Gratis'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D0D0D 0%, #1A1A1A 50%, #0D0D0D 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            fontSize: 28,
            color: '#B8B8B8',
            fontWeight: 600,
          }}
        >
          <span style={{ background: 'linear-gradient(135deg, #FFD700, #FFED4E)', color: '#0D0D0D', padding: '8px 16px', borderRadius: 8 }}>
            PARCEFX
          </span>
          <span>|</span>
          <span>Trader Independiente · Miami, FL</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: 72,
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          <span>El Trading No Es Magia.</span>
          <span style={{ color: '#FFD700' }}>Es Disciplina.</span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 26,
            color: '#B8B8B8',
            textAlign: 'center',
          }}
        >
          Recibe mi estrategia de entrada gratis — sin tarjeta, sin spam.
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #FFD700, #FFED4E)',
            color: '#0D0D0D',
            borderRadius: 12,
            fontSize: 22,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
          }}
        >
          Descargar estrategia gratis
        </div>
      </div>
    ),
    { ...size }
  )
}
