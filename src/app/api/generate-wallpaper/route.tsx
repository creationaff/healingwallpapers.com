import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Healing';
    const items = searchParams.get('items')?.split(',') || [];
    const width = parseInt(searchParams.get('width') || '1080');
    const height = parseInt(searchParams.get('height') || '1920');

    // Helper to get emoji for modality (replicated here for SSG/Edge access)
    const getEmoji = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes('tea')) return '🍵';
      if (lower.includes('oil') || lower.includes('herb')) return '🌿';
      if (lower.includes('rest') || lower.includes('sleep')) return '🛌';
      if (lower.includes('water') || lower.includes('hydrat')) return '💧';
      if (lower.includes('food') || lower.includes('diet') || lower.includes('eat') || lower.includes('charcoal') || lower.includes('ginger')) return '🥗';
      if (lower.includes('meditat') || lower.includes('breath')) return '🧘';
      if (lower.includes('sun')) return '☀️';
      if (lower.includes('magnesium') || lower.includes('zinc') || lower.includes('probiotic')) return '💊';
      return '✨';
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F5F4', // stone-100
            backgroundImage: 'radial-gradient(circle at 50% 0%, #f0fdf4, #f5f5f4)',
            padding: '40px',
            textAlign: 'center',
            fontFamily: 'serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '40px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              border: '2px solid rgba(255,255,255,0.8)',
              maxWidth: '90%',
            }}
          >
            <h1
              style={{
                fontSize: width > 1200 ? '80px' : '60px',
                fontWeight: 'bold',
                color: '#065F46', // emerald-800
                marginBottom: '40px',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                alignItems: 'flex-start',
              }}
            >
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: width > 1200 ? '40px' : '32px',
                    color: '#44403C', // stone-700
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: '16px 32px',
                    borderRadius: '20px',
                    width: '100%',
                  }}
                >
                  <span style={{ marginRight: '20px', fontSize: '40px' }}>{getEmoji(item)}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '60px',
                fontSize: '24px',
                color: '#78716C', // stone-500
              }}
            >
              HealingWallpapers.com
            </div>
          </div>
        </div>
      ),
      {
        width,
        height,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}

