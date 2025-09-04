
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// API key is securely accessed from environment variables.
const API_KEY = process.env.API_KEY as string;

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from Gemini API.");
    }
}
