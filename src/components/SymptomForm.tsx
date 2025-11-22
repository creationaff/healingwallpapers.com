'use client';

import { useState } from 'react';

interface SymptomFormProps {
  onSubmit: (symptoms: string, device: string) => void;
  isLoading: boolean;
}

export default function SymptomForm({ onSubmit, isLoading }: SymptomFormProps) {
  const [symptoms, setSymptoms] = useState('');
  const [device, setDevice] = useState('iphone');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      onSubmit(symptoms, device);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div>
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-2">
          Describe your symptoms
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., I have a headache and a sore throat..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 min-h-[150px]"
          required
        />
      </div>

      <div>
        <label htmlFor="device" className="block text-sm font-medium text-gray-700 mb-2">
          Select your device for wallpaper
        </label>
        <select
          id="device"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-white"
        >
          <option value="iphone">iPhone (Default)</option>
          <option value="android">Android</option>
          <option value="desktop">Desktop</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Analyzing...' : 'Heal Me'}
      </button>
    </form>
  );
}

