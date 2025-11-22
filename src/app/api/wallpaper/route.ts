import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { diagnosis, device } = await request.json();
    
    // Mock delay
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(1000);

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

    // Prepare params for the image generation route
    const params = new URLSearchParams({
      title: diagnosis.sickness,
      items: diagnosis.modalities.slice(0, 4).join(','),
      width: width.toString(),
      height: height.toString(),
    });
    
    // In a real deployment, you'd want to use the actual host URL
    // For now, we'll return a relative URL that the frontend can use
    const wallpaperUrl = `/api/generate-wallpaper?${params.toString()}`;

    return NextResponse.json({
      url: wallpaperUrl
    });

  } catch (error) {
    console.error('Wallpaper generation error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
