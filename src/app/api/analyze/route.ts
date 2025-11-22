import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize Gemini API client only if a key is present
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Initialize OpenAI client only if a key is present
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
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
        'Teas: Ginger, chamomile, or peppermint tea to relax muscles and ease pain.',
        'Oils & Incense: Peppermint oil on temples; burn lavender or sandalwood incense to soften stress.',
        'Foods: Magnesium-rich foods (leafy greens, nuts, seeds) and stable blood-sugar meals.',
        '80/20 Focus: 80% gentle lifestyle tweaks (posture, breaks from screens, hydration), 20% targeted remedies like oils or supplements.',
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
        'Teas: Ginger, fennel, or peppermint tea to support digestion and reduce gas.',
        'Foods: High‑fiber veggies, lentils, and healthy fats; reduce white sugar and refined flour.',
        'Oils & Incense: Rub diluted peppermint or fennel oil on the belly; burn frankincense to create a calm, mindful eating space.',
        '80/20 Focus: 80% slow, mindful eating and consistent whole‑food choices, 20% herbs, teas, and supplements.',
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
        'Teas: Tulsi (holy basil), rooibos, or lemon balm tea to gently calm and restore.',
        'Foods: Iron- and B‑vitamin–rich foods (dark greens, beans, eggs if you eat them), plus healthy fats.',
        'Oils & Incense: Diffuse citrus or rosemary oil; burn uplifting incense like frankincense during morning routine.',
        '80/20 Focus: 80% consistent sleep, light movement, and hydration; 20% adaptogenic herbs and supplements if appropriate.',
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
      'Teas: Gentle daily herbal tea (ginger, chamomile, or peppermint) as a grounding ritual.',
      'Foods: Mostly whole foods—colorful vegetables, quality protein, and healthy fats; limit ultra‑processed snacks.',
      'Oils & Incense: Lavender, sandalwood, or frankincense incense/oils to anchor relaxation practices.',
      '80/20 Focus: 80% simple everyday habits (sleep, food, movement), 20% targeted extras like supplements and treatments.',
    ],
    explanation:
      'Your description is a bit broad, so this is a general balancing protocol while we clarify your symptoms.',
  };
}

export async function POST(request: Request) {
  try {
    const { symptoms, history = [] } = await request.json();

    let analysis: Analysis | null = null;

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
        3. If probability is >= 95% OR if you have enough info, provide the diagnosis, and 4–6 natural healing modalities that together cover:
           - at least one specific herbal TEA or infusion recommendation,
           - at least one FOOD pattern (what to eat more of, or less of),
           - at least one INCENSE / essential oil or scent to burn or diffuse,
           - at least one \"80/20\" style guidance line (what 80% to focus on daily vs the 20% extras).
        
        IMPORTANT: Return raw JSON only. No Markdown. No code blocks.
        
        {
          "sickness": "Name of condition",
          "probability": number,
          "question": "Follow up question string (null if probability >= 95)",
          "modalities": ["Short modality line 1", "Short modality line 2", ...],
          "explanation": "Brief explanation of why this diagnosis fits."
        }
      `;

    // 1) Try Gemini first (if configured)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson) as Analysis;
        if (parsed.sickness && typeof parsed.probability === 'number') {
          analysis = parsed;
        } else {
          throw new Error('Gemini response missing required fields');
        }
      } catch (aiError) {
        console.error('Gemini AI error, will try OpenAI next:', aiError);
      }
    }

    // 2) If Gemini failed or not configured, try OpenAI (if configured)
    if (!analysis && openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert holistic healer and diagnostician. Always respond with pure JSON, no markdown.',
            },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        });

        const message = completion.choices[0]?.message?.content;
        if (!message) throw new Error('Empty response from OpenAI');

        const parsed = JSON.parse(message) as Analysis;
        if (parsed.sickness && typeof parsed.probability === 'number') {
          analysis = parsed;
        } else {
          throw new Error('OpenAI response missing required fields');
        }
      } catch (openAiError) {
        console.error('OpenAI error, will fall back to rule-based:', openAiError);
      }
    }

    // 3) Final fallback: rule-based analysis (never fails)
    if (!analysis) {
      analysis = ruleBasedFallback(symptoms);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis fatal error:', error);
    const fallback = ruleBasedFallback(''); // very generic
    return NextResponse.json(fallback);
  }
}

