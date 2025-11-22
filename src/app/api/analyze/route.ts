import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { symptoms, history = [] } = await request.json();

    // Mock logic for demonstration
    // In a real app, you'd send the entire conversation history to the LLM
    const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await mockDelay(1000);

    const symptomsLower = (symptoms + " " + history.map((h: any) => h.answer).join(" ")).toLowerCase();
    
    // Base logic
    let result: any = {
      sickness: "General Malaise",
      probability: 60,
      modalities: ["Rest", "Hydration", "Vitamin C"],
      explanation: "Your symptoms are a bit vague.",
      question: null
    };

    if (symptomsLower.includes("headache")) {
      if (!symptomsLower.includes("sensitivity") && !symptomsLower.includes("neck")) {
        // Needs more info to distinguish tension vs migraine
        result = {
          probability: 70,
          question: "Are you experiencing sensitivity to light or sound, or stiffness in your neck?",
          sickness: "Headache (Unspecified)"
        };
      } else if (symptomsLower.includes("sensitivity")) {
        result = {
          sickness: "Migraine",
          probability: 96,
          modalities: ["Dark Room Rest", "Cold Compress", "Magnesium", "Feverfew"],
          explanation: "Sensitivity to light/sound with a headache strongly suggests a migraine."
        };
      } else {
        result = {
          sickness: "Tension Headache",
          probability: 92, // Still not 95
          question: "Do you feel like there is a tight band around your head?",
          modalities: ["Peppermint Oil", "Neck Stretch", "Ginger Tea"]
        };
        // If they answer yes to tight band, we'd bump to 98%
        if (symptomsLower.includes("tight band") || symptomsLower.includes("yes")) {
           result = {
            sickness: "Tension Headache",
            probability: 98,
            modalities: ["Peppermint Oil", "Magnesium", "Neck Massage", "Hydration"],
            explanation: "The 'tight band' sensation is a classic sign of a tension headache."
           };
        }
      }
    } 
    else if (symptomsLower.includes("stomach")) {
      if (!symptomsLower.includes("fever") && !symptomsLower.includes("ate")) {
         result = {
          probability: 65,
          question: "Do you have a fever, or did you eat something unusual recently?",
          sickness: "Gastric Issues"
        };
      } else if (symptomsLower.includes("ate")) {
        result = {
          sickness: "Food Poisoning/Indigestion",
          probability: 95,
          modalities: ["Activated Charcoal", "Ginger", "Probiotics", "Fasting"],
          explanation: "Recent food intake correlating with symptoms suggests dietary cause."
        };
      }
    }

    // If probability is high enough, we don't need more questions
    if (result.probability >= 95) {
      return NextResponse.json(result);
    }

    // If we have a question, return it
    if (result.question) {
      return NextResponse.json({
        question: result.question,
        probability: result.probability,
        sickness: result.sickness // Temporary diagnosis
      });
    }

    // Fallback if no specific logic matched but probability is low (e.g. first random query)
    // Just return a low probability result or a generic question
    if (result.probability < 95 && !result.question) {
       return NextResponse.json({
        question: "Can you describe exactly where the pain is located and how long it has lasted?",
        probability: result.probability,
        sickness: result.sickness
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
