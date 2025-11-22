'use client';

export default function Logo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg ring-2 ring-emerald-100">
          <span className="text-white text-2xl">✺</span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-3xl sm:text-4xl font-playfair font-bold text-emerald-900 leading-tight">
            HealingWallpapers
            <span className="text-emerald-600">.com</span>
          </span>
          <span className="text-[11px] tracking-[0.25em] uppercase text-emerald-700/70 mt-1">
            Natural Healing Visuals
          </span>
        </div>
      </div>
    </div>
  );
}


