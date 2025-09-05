import React from 'react';

export const Header = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          RUGIPO Fake News Detector
        </h1>
      </div>
    </header>
  );
};