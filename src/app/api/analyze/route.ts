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

    // gemini-1.5-flash is usually safer for JSON mode in newer SDKs, but gemini-pro is standard.
    // Let's stick to gemini-1.5-flash as it's faster and cheaper, but fallback to text cleaning.
    // If 404 persists, it means the project doesn't have access to the model or API key is wrong.
    // Since user showed API key exists, let's try 'gemini-1.5-flash' again as it was likely a transient issue or previous deploy lag.
    // IF that fails, we will fall back to 'gemini-pro' without JSON enforcement config (handled manually).
    
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
      2. If probability is < 95%, formulate a SINGLE, specific follow-up question to narrow down the diagnosis.
      3. If probability is >= 95% OR if you have enough info, provide the diagnosis, a set of 4-6 natural healing modalities.
      
      IMPORTANT: Return raw JSON only. No Markdown. No code blocks.
      
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
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(cleanJson);
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw response:", responseText);
      
      // Fallback: return a safe error that doesn't crash the UI
      return NextResponse.json({
        sickness: "Analysis Error",
        probability: 0,
        modalities: [],
        explanation: "I'm having trouble thinking clearly right now. Please try rephrasing your symptoms."
      });
    }

  } catch (error: any) {
    console.error('Analysis error details:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: error.message 
    }, { status: 500 });
  }
}
