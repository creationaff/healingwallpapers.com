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
            'radial-gradient(circle at 30% 0%, #bbf7d0 0, #f9fafb 50%, #e0f2fe 100%)',
        }}
      >
        <div
          style={{
            height: 44,
            width: 44,
            borderRadius: 20,
            background:
              'linear-gradient(135deg, #22c55e, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
          }}
        >
          <span
            style={{
              fontSize: 30,
              color: '#ecfdf5',
            }}
          >
            ✺
          </span>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}


