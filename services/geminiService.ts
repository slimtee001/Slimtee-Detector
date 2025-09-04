import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types.ts';

let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
    if (ai) {
        return ai;
    }
    // The API key is expected to be available in the process.env.API_KEY environment variable.
    // A polyfill in index.html ensures `process.env` exists, but the hosting environment
    // must populate the API_KEY itself.
    if (!process.env.API_KEY || typeof process.env.API_KEY !== 'string') {
        throw new Error("The API_KEY is not configured. Please ensure the API_KEY environment variable is set on your web server or hosting environment.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
}


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

export async function analyzeNewsArticle(articleText: string): Promise<AnalysisResult> {
    try {
        const client = getAiClient();
        const prompt = `Analyze the following news article for signs of being fake news or misinformation. Evaluate it based on factors like emotional language, sensationalism, lack of sources, unverifiable claims, and overall tone. Provide a structured analysis based on the schema.
        
        ARTICLE TEXT:
        ---
        ${articleText}
        ---
        `;

        const response = await client.models.generateContent({
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
        console.error("Error in analyzeNewsArticle:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
             throw error; // Re-throw the specific configuration error
        }
        // Provide a more user-friendly error for other API issues.
        throw new Error("Analysis failed. The content might be blocked, the API may be unavailable, or there was an internal error. Please check the console and try again.");
    }
}
