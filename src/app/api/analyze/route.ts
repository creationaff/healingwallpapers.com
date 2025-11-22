import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { symptoms } = await request.json();

    // TODO: Integrate with OpenAI API or similar here
    // const completion = await openai.chat.completions.create({ ... });

    // Mock logic for demonstration
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(1500);

    const symptomsLower = symptoms.toLowerCase();
    let sickness = "General Malaise";
    let modalities = ["Rest", "Hydration", "Vitamin C"];
    let probability = 85;

    if (symptomsLower.includes("headache") || symptomsLower.includes("head")) {
      sickness = "Tension Headache";
      modalities = ["Peppermint Oil", "Magnesium", "Dark Room Rest", "Ginger Tea"];
      probability = 92;
    } else if (symptomsLower.includes("throat") || symptomsLower.includes("cough")) {
      sickness = "Common Cold";
      modalities = ["Honey & Lemon Tea", "Salt Water Gargle", "Eucalyptus Oil", "Zinc"];
      probability = 88;
    } else if (symptomsLower.includes("stomach") || symptomsLower.includes("nausea")) {
      sickness = "Gastric Upset";
      modalities = ["Ginger", "Peppermint Tea", "BRAT Diet (Bananas, Rice, Applesauce, Toast)", "Fennel Seeds"];
      probability = 75;
    }

    return NextResponse.json({
      sickness,
      probability,
      modalities,
      explanation: `Based on your report of "${symptoms}", there is a high likelihood of ${sickness}. These natural remedies are traditionally used to support recovery.`
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

