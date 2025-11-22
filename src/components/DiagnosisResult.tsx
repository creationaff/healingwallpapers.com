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
    <div className="w-full max-w-3xl glass-card rounded-3xl p-8 md:p-10 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 font-playfair">Analysis Result</h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold tracking-wide uppercase">
          <span>{result.probability}% Confidence match</span>
        </div>
        <div className="py-6">
          <p className="text-xl text-stone-600 mb-2">It appears you may be experiencing:</p>
          <h3 className="text-4xl md:text-5xl font-bold text-emerald-700 font-playfair">{result.sickness}</h3>
        </div>
        {result.explanation && (
          <p className="text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {result.explanation}
          </p>
        )}
      </div>

      <div className="bg-stone-50/50 rounded-2xl p-6 md:p-8 border border-stone-100">
        <h3 className="text-2xl font-bold text-stone-800 font-playfair mb-6 text-center">Recommended Healing Modalities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.modalities.map((modality, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mr-3">
                ✓
              </span>
              <span className="text-lg text-stone-700 font-medium">{modality}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-stone-200 flex flex-col items-center space-y-6">
        {result.wallpaperUrl ? (
          <div className="w-full space-y-6 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-stone-800 font-playfair">Your Personal Healing Wallpaper</h3>
            <div className="relative w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl ring-8 ring-white transform transition-transform hover:scale-[1.02]">
              <img 
                src={result.wallpaperUrl} 
                alt="Healing Wallpaper" 
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="pt-4">
              <a 
                href={result.wallpaperUrl} 
                download="healing-wallpaper.png"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-full shadow-lg text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Wallpaper
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-stone-500 italic">Ready to visualize your healing?</p>
            <button
              onClick={onGenerateWallpaper}
              disabled={isGeneratingWallpaper}
              className="w-full sm:w-auto px-10 py-4 rounded-full shadow-lg text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1"
            >
              {isGeneratingWallpaper ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Artwork...
                </span>
              ) : (
                'Generate Healing Wallpaper'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
