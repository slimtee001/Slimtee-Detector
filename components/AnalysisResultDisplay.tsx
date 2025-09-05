import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon.jsx';
import { InfoIcon } from './icons/InfoIcon.jsx';
import { XCircleIcon } from './icons/XCircleIcon.jsx';

const VerdictIcon = ({ verdict }) => {
    switch (verdict) {
        case 'Likely Real':
            return <CheckCircleIcon className="w-8 h-8 text-green-400" />;
        case 'Likely Fake':
            return <XCircleIcon className="w-8 h-8 text-red-400" />;
        case 'Uncertain':
            return <InfoIcon className="w-8 h-8 text-yellow-400" />;
        default:
            return null;
    }
};

const Gauge = ({ score, verdict }) => {
    const circumference = 2 * Math.PI * 52; // 2 * pi * r
    const offset = circumference - (score / 100) * circumference;

    const colorClasses = {
        'Likely Real': { track: 'text-green-900', progress: 'text-green-400', text: 'text-green-300' },
        'Likely Fake': { track: 'text-red-900', progress: 'text-red-400', text: 'text-red-300' },
        'Uncertain': { track: 'text-yellow-900', progress: 'text-yellow-400', text: 'text-yellow-300' },
    };
    
    const colors = colorClasses[verdict] || colorClasses['Uncertain'];

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className={`stroke-current ${colors.track}`}
                    strokeWidth="8"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                />
                <circle
                    className={`stroke-current ${colors.progress} transition-all duration-1000 ease-out`}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className={`absolute flex flex-col items-center justify-center ${colors.text}`}>
                <span className="text-4xl font-bold">{score}</span>
                <span className="text-sm font-medium">Confidence</span>
            </div>
        </div>
    );
};


export const AnalysisResultDisplay = ({ result }) => {
  const { verdict, confidenceScore, explanation, keyIndicators } = result;
  
  const verdictClasses = {
    'Likely Real': 'text-green-300',
    'Likely Fake': 'text-red-300',
    'Uncertain': 'text-yellow-300'
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 animate-fade-in">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            <div className="flex-shrink-0">
                <Gauge score={confidenceScore} verdict={verdict} />
            </div>
            <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                    <VerdictIcon verdict={verdict} />
                    <h2 className={`text-3xl font-bold ${verdictClasses[verdict]}`}>{verdict}</h2>
                </div>
                <p className="text-slate-300 text-base leading-relaxed">
                    {explanation}
                </p>
            </div>
        </div>
        
        {keyIndicators && keyIndicators.length > 0 && (
            <div className="mt-6 border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-slate-200 mb-3">Key Indicators Found</h3>
                <div className="flex flex-wrap gap-2">
                    {keyIndicators.map((indicator, index) => (
                        <span key={index} className="bg-slate-700 text-cyan-300 text-sm font-medium px-3 py-1 rounded-full">
                            {indicator}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};