import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { diagnosis, device } = await request.json();
    
    // TODO: Integrate with DALL-E 3 or Stable Diffusion API here
    // const image = await openai.images.generate({ ... });

    // Mock delay
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(2000);

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

    // Create a mock URL using a placeholder service that supports text
    // We'll encode the diagnosis text to put on the image
    const text = `${diagnosis.sickness}\n\n${diagnosis.modalities.slice(0, 3).join('\n')}`;
    const encodedText = encodeURIComponent(text);
    
    // Using placehold.co for dynamic text image generation
    const wallpaperUrl = `https://placehold.co/${width}x${height}/E6FFFA/064E3B/png?text=${encodedText}&font=playfair-display`;

    return NextResponse.json({
      url: wallpaperUrl
    });

  } catch (error) {
    console.error('Wallpaper generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

