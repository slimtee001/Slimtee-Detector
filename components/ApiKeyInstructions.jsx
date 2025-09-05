import React from 'react';

export const ApiKeyInstructions = ({ error }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-slate-800 border border-red-700 rounded-lg p-8 text-center shadow-2xl shadow-red-900/50">
        <svg className="w-16 h-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <h1 className="mt-4 text-3xl font-bold text-red-300">Configuration Error</h1>
        <p className="mt-2 text-slate-400">The application cannot connect to the AI service.</p>
        
        <div className="mt-6 text-left bg-slate-900 p-4 rounded-md font-mono text-sm text-red-300 whitespace-pre-wrap break-words">
          <strong>Error:</strong> {error}
        </div>

        <div className="mt-6 text-left text-slate-300 space-y-3">
          <p className="font-bold text-lg">How to Fix This:</p>
          <p>
            This application is running on a static web server and requires a Google Gemini API key to function.
            You must provide this key through an environment variable.
          </p>
          <p>
            Please configure your web server or hosting platform (like Netlify, Vercel, or a custom server) to inject the API key into the `window.process.env.API_KEY` object before the main application script runs.
          </p>
          <p>
            Refer to your hosting provider's documentation on setting environment variables for static sites.
          </p>
        </div>
      </div>
    </div>
  );
};
