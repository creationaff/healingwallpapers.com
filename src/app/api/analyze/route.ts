import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { symptoms, history = [] } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      // Fallback for demo if no key is present, or throw error
      console.warn("Missing GEMINI_API_KEY");
      // You might want to return a mock response or error here
      // For now, let's return a friendly error to the UI
      return NextResponse.json({ 
        sickness: "Configuration Error",
        probability: 0,
        modalities: [],
        explanation: "Please configure the GEMINI_API_KEY in your environment variables to enable AI analysis."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct conversation history for context
    let contextString = "";
    if (history.length > 0) {
      contextString = "Previous Q&A History:\n" + history.map((h: any) => `Q: ${h.question}\nA: ${h.answer}`).join("\n") + "\n\n";
    }

    const prompt = `
      You are an expert holistic healer and diagnostician. 
      User Symptoms: "${symptoms}"
      ${contextString}

      Analyze the symptoms and history to determine the most likely illness/condition.
      
      Task:
      1. Estimate the probability (0-100%) that you have correctly identified the condition based ONLY on the information provided.
      2. If probability is < 95%, formulate a SINGLE, specific follow-up question to narrow down the diagnosis (e.g., asking about specific pain location, duration, accompanying symptoms like fever, etc.).
      3. If probability is >= 95% OR if you have enough info, provide the diagnosis, a set of 4-6 natural healing modalities (herbs, teas, foods, oils, lifestyle changes), and a brief explanation.
      
      Return ONLY a JSON object with this exact structure (no markdown formatting):
      {
        "sickness": "Name of condition",
        "probability": number,
        "question": "Follow up question string (null if probability >= 95)",
        "modalities": ["Modality 1", "Modality 2", ...],
        "explanation": "Brief explanation of why this diagnosis fits."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up markdown code blocks if present
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const analysis = JSON.parse(cleanJson);

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
