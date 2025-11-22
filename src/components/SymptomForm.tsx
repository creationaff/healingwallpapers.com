'use client';

import { useState, useEffect } from 'react';

interface SymptomFormProps {
  onSubmit: (symptoms: string, device: string) => void;
  isLoading: boolean;
  followUpQuestion?: string;
}

export default function SymptomForm({ onSubmit, isLoading, followUpQuestion }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [device, setDevice] = useState('iphone');

  // Reset input when a new question comes in
  useEffect(() => {
    if (followUpQuestion) {
      setSymptoms('');
    }
  }, [followUpQuestion]);

  const submit = () => {
    if (symptoms.trim()) {
      onSubmit(symptoms, device);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-8 glass-card p-8 rounded-3xl animate-fade-in">
      <div className="space-y-2">
        <label htmlFor="symptoms" className="block text-lg font-medium text-stone-700 font-playfair">
          {followUpQuestion || "How are you feeling?"}
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={followUpQuestion ? "Your answer..." : "Describe your symptoms (e.g., splitting headache, feeling lethargic...)"}
          className="w-full p-5 border-none bg-stone-100/50 rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all min-h-[160px] text-stone-800 placeholder-stone-400 resize-none text-lg"
          required
          autoFocus={!!followUpQuestion}
        />
      </div>

      {!followUpQuestion && (
        <div className="space-y-2">
          <label htmlFor="device" className="block text-lg font-medium text-stone-700 font-playfair">
            Wallpaper Format
          </label>
          <div className="relative">
            <select
              id="device"
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              className="w-full p-4 pr-10 border-none bg-stone-100/50 rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all text-stone-800 appearance-none cursor-pointer text-lg"
            >
              <option value="iphone">iPhone / Mobile</option>
              <option value="android">Android</option>
              <option value="desktop">Desktop / Laptop</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          followUpQuestion ? 'Submit Answer' : 'Begin Healing Journey'
        )}
      </button>
    </form>
  );
}
