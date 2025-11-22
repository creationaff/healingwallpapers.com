import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { diagnosis, device } = await request.json();
    
    // Mock delay
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(1500);

    // Determine dimensions based on device
    let width = 1080;
    let height = 1920; // iPhone/Mobile default
    
    if (device === 'desktop') {
      width = 1920;
      height = 1080;
    } else if (device === 'android') {
      width = 1080;
      height = 2400; 
    }

    // Helper to get emoji for modality
    const getEmoji = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes('tea')) return '🍵';
      if (lower.includes('oil') || lower.includes('herb')) return '🌿';
      if (lower.includes('rest') || lower.includes('sleep')) return '🛌';
      if (lower.includes('water') || lower.includes('hydrat')) return '💧';
      if (lower.includes('food') || lower.includes('diet') || lower.includes('eat')) return '🥗';
      if (lower.includes('meditat') || lower.includes('breath')) return '🧘';
      if (lower.includes('sun')) return '☀️';
      if (lower.includes('magnesium') || lower.includes('zinc')) return '💊';
      return '✨';
    };

    // Format text with emojis
    const title = diagnosis.sickness;
    const healingItems = diagnosis.modalities.slice(0, 4).map((m: string) => {
      return `${getEmoji(m)} ${m}`;
    }).join('\n');

    const text = `${title}\n\n${healingItems}`;
    const encodedText = encodeURIComponent(text);
    
    // Using placehold.co for dynamic text image generation
    // Added a more nature-themed color palette
    const wallpaperUrl = `https://placehold.co/${width}x${height}/E2E8F0/1E293B/png?text=${encodedText}&font=playfair-display`;

    return NextResponse.json({
      url: wallpaperUrl
    });

  } catch (error) {
    console.error('Wallpaper generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
