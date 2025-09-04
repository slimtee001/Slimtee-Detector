
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        verdict: {
            type: Type.STRING,
            enum: ['Likely Real', 'Likely Fake', 'Uncertain'],
            description: "The final verdict on the news article's authenticity."
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A score from 0 to 100 representing the confidence in the verdict. 100 means high confidence, 0 means low."
        },
        explanation: {
            type: Type.STRING,
            description: "A detailed, neutral explanation for the verdict, summarizing the key findings."
        },
        keyIndicators: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            },
            description: "A list of key factors or red flags that influenced the decision (e.g., 'Emotional Language', 'Lack of Verifiable Sources', 'Unprofessional Tone')."
        }
    },
    required: ['verdict', 'confidenceScore', 'explanation', 'keyIndicators']
};

function getApiKey(): string {
    let apiKey: string | undefined;
    // This defensive check is necessary for browser environments
    // where 'process' may not be defined.
    if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.API_KEY;
    }

    if (!apiKey) {
        // This error will be displayed in the UI.
        throw new Error("Configuration Error: The API_KEY environment variable is not set or accessible. Please ensure it is configured correctly.");
    }
    return apiKey;
}

export async function analyzeNewsArticle(articleText: string): Promise<AnalysisResult> {
    try {
        // Get key and initialize AI client here to prevent app crash on load
        // if the environment variable is missing.
        const apiKey = getApiKey();
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `Analyze the following news article for signs of being fake news or misinformation. Evaluate it based on factors like emotional language, sensationalism, lack of sources, unverifiable claims, and overall tone. Provide a structured analysis based on the schema.
        
        ARTICLE TEXT:
        ---
        ${articleText}
        ---
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema,
                temperature: 0.1,
            }
        });
        
        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as AnalysisResult;
        
        // Clamp confidence score to be between 0 and 100
        parsedResult.confidenceScore = Math.max(0, Math.min(100, parsedResult.confidenceScore));

        return parsedResult;

    } catch (error) {
        if (error instanceof Error) {
            // Forward config errors to the UI
            if (error.message.startsWith("Configuration Error")) {
                throw error;
            }
        }
        
        console.error("Error calling Gemini API:", error);
        // Provide a more user-friendly error for other API issues.
        throw new Error("Analysis failed. The content might be blocked, the API may be unavailable, or there was an internal error. Please check the console and try again.");
    }
}
