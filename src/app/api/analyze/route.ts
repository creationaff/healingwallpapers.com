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

    // Switched to 'gemini-pro' or 'gemini-1.5-pro-latest' as 'gemini-1.5-flash' might be in preview/restricted
    // Using 'gemini-pro' is generally the most stable public alias
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
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
      
      Return ONLY a valid JSON object with this exact structure (do not include Markdown code blocks):
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
      // Clean up markdown code blocks if present
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(cleanJson);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw response:", responseText);
      throw new Error("Failed to parse AI response");
    }

  } catch (error: any) {
    console.error('Analysis error details:', error);
    // Safely handle error object structure
    const errorMessage = error?.message || 'Unknown error occurred';
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: errorMessage
    }, { status: 500 });
  }
}
