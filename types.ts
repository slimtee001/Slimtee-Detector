
export type Verdict = 'Likely Real' | 'Likely Fake' | 'Uncertain';

export interface AnalysisResult {
  verdict: Verdict;
  confidenceScore: number;
  explanation: string;
  keyIndicators: string[];
}
