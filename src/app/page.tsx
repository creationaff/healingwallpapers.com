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
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isGeneratingWallpaper, setIsGeneratingWallpaper] = useState(false);
  const [device, setDevice] = useState('iphone');
  const [symptoms, setSymptoms] = useState('');

  const handleAnalyze = async (submittedSymptoms: string, selectedDevice: string) => {
    setIsLoading(true);
    setSymptoms(submittedSymptoms);
    setDevice(selectedDevice);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: submittedSymptoms }),
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-4">
            HealingWallpapers.com
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover natural healing modalities tailored to your symptoms and get a custom wallpaper to guide your recovery.
          </p>
        </header>

        {!result ? (
          <SymptomForm onSubmit={handleAnalyze} isLoading={isLoading} />
        ) : (
          <div className="w-full flex flex-col items-center space-y-8">
            <DiagnosisResult 
              result={result} 
              onGenerateWallpaper={handleGenerateWallpaper}
              isGeneratingWallpaper={isGeneratingWallpaper}
            />
            <button 
              onClick={() => setResult(null)}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
