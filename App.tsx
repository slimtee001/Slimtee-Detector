
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { NewsInput } from './components/NewsInput.tsx';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { analyzeNewsArticle } from './services/geminiService.ts';
import { AnalysisResult } from './types.ts';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialState, setInitialState] = useState<boolean>(true);

  const handleAnalyze = useCallback(async (articleText: string) => {
    if (!articleText.trim()) {
      setError("Please paste an article to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setInitialState(false);

    try {
      const result = await analyzeNewsArticle(articleText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during analysis. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-slate-400 mb-8">
            Paste the text of a news article below. Our AI will analyze it for common indicators of misinformation and provide a detailed report.
          </p>
          <NewsInput onAnalyze={handleAnalyze} isLoading={isLoading} />

          <div className="mt-10 min-h-[300px]">
            {isLoading && <LoadingSpinner />}
            {error && (
              <div className="text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                <p className="font-bold">Configuration Error</p>
                <p>{error}</p>
              </div>
            )}
            {analysisResult && <AnalysisResultDisplay result={analysisResult} />}
            {initialState && (
                <div className="text-center text-slate-500 pt-16">
                    <p className="text-2xl">Awaiting analysis...</p>
                    <p>Your report will appear here.</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-slate-600 text-sm">
        <p></p>
      </footer>
    </div>
  );
};

export default App;