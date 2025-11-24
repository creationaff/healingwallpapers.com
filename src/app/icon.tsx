import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(circle at 25% 20%, #34d399 0%, #0f172a 70%, #020617 100%)',
        }}
      >
        <div
          style={{
            height: 48,
            width: 48,
            borderRadius: 18,
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.9))',
            border: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#ecfdf5',
              fontFamily: 'serif',
            }}
          >
            HW
          </span>
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              width: 10,
              height: 10,
              background: 'radial-gradient(circle, #fef3c7 0%, rgba(253,230,138,0.4) 70%, transparent 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 6px rgba(252,211,77,0.8)',
            }}
          />
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}

