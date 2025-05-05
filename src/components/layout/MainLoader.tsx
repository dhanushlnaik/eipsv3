export function ExperienceLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-10 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-lg text-center animate-pulse space-y-4">
      <div className="text-2xl md:text-3xl font-semibold text-white animate-pulse">
        Loading your experience...
      </div>
      <div className="w-10 h-10 border-4 border-t-purple-500 border-white/20 rounded-full animate-spin" />
      <p className="text-white/70 text-sm">
        Hang tight, fetching everything for you ✨
      </p>
    </div>
  );
}

export function GraphLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-md w-full h-64 animate-pulse">
      <div className="w-24 h-24 rounded-full border-4 border-t-purple-500 border-opacity-20 animate-spin mb-4" />
      <p className="text-white text-sm text-opacity-70">Loading graph data...</p>
    </div>
  );
}
