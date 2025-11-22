'use client';

import { useState } from 'react';
import SymptomForm from '@/components/SymptomForm';
import DiagnosisResult from '@/components/DiagnosisResult';

interface AnalysisResult {
  sickness: string;
  probability: number;
  modalities: string[];
  explanation: string;
  wallpaperUrl?: string;
  question?: string;
}

interface HistoryItem {
  question: string;
  answer: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const [device, setDevice] = useState('iphone');
  const [symptoms, setSymptoms] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleAnalyze = async (input: string, selectedDevice: string) => {
    setIsLoading(true);
    
    // If this is the first submission, set base symptoms
    const currentSymptoms = result?.question ? symptoms : input;
    if (!result?.question) {
        setSymptoms(input);
        setDevice(selectedDevice);
    }

    // If answering a follow-up, add to history
    let currentHistory = history;
    if (result?.question) {
        currentHistory = [...history, { question: result.question, answer: input }];
        setHistory(currentHistory);
    } else {
        // Reset history on new start
        currentHistory = [];
        setHistory([]);
    }
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            symptoms: currentSymptoms,
            history: currentHistory 
        }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateWallpaper = async () => {
    if (!result) return;
    
    setIsGeneratingWallpaper(true);
    try {
      const response = await fetch('/api/wallpaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          diagnosis: result, 
          device,
          symptoms 
        }),
      });

      if (!response.ok) throw new Error('Wallpaper generation failed');

      const data = await response.json();
      setResult(prev => prev ? { ...prev, wallpaperUrl: data.url } : null);
    } catch (error) {
      console.error(error);
      alert('Could not generate wallpaper. Please try again.');
    } finally {
      setIsGeneratingWallpaper(false);
    }
  };

  const handleStartOver = () => {
    setResult(null);
    setHistory([]);
    setSymptoms('');
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full flex flex-col items-center">
        <header className="text-center mb-12 space-y-4 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-bold text-emerald-800 font-playfair tracking-tight">
            HealingWallpapers<span className="text-emerald-600">.com</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Discover natural healing modalities tailored to your symptoms and receive a custom wallpaper to guide your daily recovery.
          </p>
        </header>

        {!result || result.question ? (
          <SymptomForm 
            onSubmit={handleAnalyze} 
            isLoading={isLoading} 
            followUpQuestion={result?.question}
          />
        ) : (
          <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
            <DiagnosisResult 
              result={result} 
              onGenerateWallpaper={handleGenerateWallpaper}
              isGeneratingWallpaper={isGeneratingWallpaper}
            />
            <button 
              onClick={handleStartOver}
              className="text-stone-500 hover:text-stone-800 underline underline-offset-4 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
