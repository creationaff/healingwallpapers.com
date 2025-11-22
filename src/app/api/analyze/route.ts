import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client only if a key is present
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

type Analysis = {
  sickness: string;
  probability: number;
  question: string | null;
  modalities: string[];
  explanation: string;
};

function ruleBasedFallback(symptoms: string): Analysis {
  const text = symptoms.toLowerCase();

  if (text.includes('headache') || text.includes('migraine')) {
    return {
      sickness: 'Tension Headache',
      probability: 80,
      question: 'Is the pain like a tight band around your head, and does it get worse with stress?',
      modalities: [
        'Peppermint oil on temples',
        'Neck and shoulder stretching',
        'Magnesium supplementation',
        'Ginger or chamomile tea',
      ],
      explanation:
        'Your description suggests a tension-type headache. These modalities support muscle relaxation and circulation.',
    };
  }

  if (text.includes('stomach') || text.includes('bloating') || text.includes('fat stomach')) {
    return {
      sickness: 'Digestive Imbalance / Bloating',
      probability: 75,
      question:
        'Is the discomfort worse after eating certain foods (like bread, dairy, or sugar), and do you feel gassy or bloated?',
      modalities: [
        'Ginger tea before or after meals',
        'Light evening meals, avoid eating 2–3 hours before bed',
        'Probiotic-rich foods (sauerkraut, kimchi, unsweetened yogurt)',
        'Gentle walking after meals to aid digestion',
      ],
      explanation:
        'The symptoms point toward sluggish digestion or mild gut imbalance. These natural supports can help reset digestion.',
    };
  }

  if (text.includes('tired') || text.includes('fatigue') || text.includes('exhausted')) {
    return {
      sickness: 'General Fatigue / Low Vitality',
      probability: 70,
      question:
        'How many hours of sleep do you get on average, and do you wake feeling rested or still tired?',
      modalities: [
        'Regular sleep schedule (same sleep/wake time daily)',
        'Ashwagandha or rhodiola (adaptogenic herbs, if safe for you)',
        'Hydration with mineral-rich water ( pinch of sea salt or electrolyte mix )',
        'Daily light movement or walking outdoors',
      ],
      explanation:
        'Your symptoms suggest low vitality. Sleep, minerals, and gentle movement are core pillars for restoring energy.',
    };
  }

  return {
    sickness: 'General Imbalance',
    probability: 60,
    question:
      'Where in your body do you feel the symptoms most strongly, and how long have they been present?',
    modalities: [
      'Warm herbal tea (ginger, chamomile, or peppermint)',
      'Adequate hydration throughout the day',
      'Gentle stretching or yoga for 10–15 minutes',
      'Mindful breathing exercises to calm the nervous system',
    ],
    explanation:
      'Your description is a bit broad, so this is a general balancing protocol while we clarify your symptoms.',
  };
}

export async function POST(request: Request) {
  try {
    const { symptoms, history = [] } = await request.json();

    // If Gemini is not configured, immediately use fallback logic
    if (!genAI) {
      console.warn('GEMINI_API_KEY is not set. Using rule-based fallback.');
      const fallback = ruleBasedFallback(symptoms);
      return NextResponse.json(fallback);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let contextString = '';
      if (history.length > 0) {
        contextString =
          'Previous Q&A History:\n' +
          history
            .map((h: any) => `Q: ${h.question}\nA: ${h.answer}`)
            .join('\n') +
          '\n\n';
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

      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(cleanJson) as Analysis;

      // Basic validation – if required fields are missing, fall back
      if (!analysis.sickness || typeof analysis.probability !== 'number') {
        throw new Error('AI response missing required fields');
      }

      return NextResponse.json(analysis);
    } catch (aiError) {
      console.error('Gemini AI error, using fallback analysis:', aiError);
      const fallback = ruleBasedFallback(symptoms);
      return NextResponse.json(fallback);
    }
  } catch (error) {
    console.error('Analysis fatal error:', error);
    const fallback = ruleBasedFallback(''); // very generic
    return NextResponse.json(fallback);
  }
}

