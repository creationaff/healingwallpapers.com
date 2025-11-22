import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { symptoms, history = [] } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("Missing GEMINI_API_KEY");
      return NextResponse.json({ 
        sickness: "Configuration Error",
        probability: 0,
        modalities: [],
        explanation: "Please configure the GEMINI_API_KEY in your environment variables to enable AI analysis."
      });
    }

    // Use specific generation config to enforce JSON
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

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
      2. If probability is < 95%, formulate a SINGLE, specific follow-up question to narrow down the diagnosis.
      3. If probability is >= 95% OR if you have enough info, provide the diagnosis, a set of 4-6 natural healing modalities.
      
      Output Schema:
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
    
    try {
      // Attempt to parse directly first
      const analysis = JSON.parse(responseText);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw response:", responseText);
      
      // Fallback cleanup if JSON mode didn't work perfectly (rare with responseMimeType set)
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      try {
         const analysis = JSON.parse(cleanJson);
         return NextResponse.json(analysis);
      } catch (retryError) {
         throw new Error("Failed to parse AI response");
      }
    }

  } catch (error: any) {
    console.error('Analysis error details:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}
