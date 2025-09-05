import React from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full pt-16">
      <div className="w-12 h-12 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin" role="status" aria-label="Loading"></div>
      <p className="mt-4 text-lg text-slate-400">AI is analyzing the article...</p>
      <p className="text-sm text-slate-500">This may take a moment.</p>
    </div>
  );
};