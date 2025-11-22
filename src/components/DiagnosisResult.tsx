'use client';

interface DiagnosisResultProps {
  result: {
    sickness: string;
    probability: number;
    modalities: string[];
    wallpaperUrl?: string;
    explanation?: string;
  };
  onGenerateWallpaper: () => void;
  isGeneratingWallpaper: boolean;
}

export default function DiagnosisResult({ result, onGenerateWallpaper, isGeneratingWallpaper }: DiagnosisResultProps) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 space-y-6 animate-fade-in">
      <div className="text-center border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analysis Result</h2>
        <p className="mt-2 text-lg text-gray-600">
          Potential Condition: <span className="font-bold text-green-700">{result.sickness}</span>
        </p>
        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {result.probability}% Probability
        </div>
        {result.explanation && <p className="mt-4 text-gray-500 text-sm">{result.explanation}</p>}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Natural Healing Modalities</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {result.modalities.map((modality, index) => (
            <li key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
              <span className="text-green-500 mr-2">•</span>
              <span className="text-gray-700">{modality}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-6 border-t flex flex-col items-center">
        {result.wallpaperUrl ? (
          <div className="w-full space-y-4">
            <h3 className="text-lg font-medium text-center text-gray-800">Your Healing Wallpaper</h3>
            <div className="relative aspect-[9/16] w-64 mx-auto rounded-xl overflow-hidden shadow-xl ring-4 ring-green-100">
              <img 
                src={result.wallpaperUrl} 
                alt="Healing Wallpaper" 
                className="object-cover w-full h-full"
              />
            </div>
            <a 
              href={result.wallpaperUrl} 
              download="healing-wallpaper.png"
              className="block w-full max-w-xs mx-auto text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Download Wallpaper
            </a>
          </div>
        ) : (
          <button
            onClick={onGenerateWallpaper}
            disabled={isGeneratingWallpaper}
            className="w-full sm:w-auto px-8 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingWallpaper ? 'Generating Art...' : 'Generate Healing Wallpaper'}
          </button>
        )}
      </div>
    </div>
  );
}

