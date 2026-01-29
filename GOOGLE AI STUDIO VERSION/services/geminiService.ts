
import { GoogleGenAI, Type } from "@google/genai";
import { ClipType, AIAnalysis } from "../types";

const API_KEY = process.env.API_KEY || '';

export const analyzeContent = async (content: string, type: ClipType): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are Qklipto AI, an expert content analyzer. 
    Analyze the provided ${type} snippet.
    - If it's text: provide a summary, sentiment, and key points.
    - If it's code: explain what it does, identify the language, and suggest optimizations.
    - Always return structured JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: 'A concise summary of the content.' },
      category: { type: Type.STRING, description: 'A one-word category label.' },
      keyPoints: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Key takeaways or main points.' 
      },
      explanation: { type: Type.STRING, description: 'Detailed explanation (especially for code).' },
      sentiment: { type: Type.STRING, description: 'Emotional tone (for text).' }
    },
    required: ['summary', 'category', 'keyPoints']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: content,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      },
    });

    const result = JSON.parse(response.text || '{}');
    return result as AIAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Data: string): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Data.split(',')[1] || base64Data,
    },
  };

  const prompt = "Describe this image in detail, extract any visible text, and categorize it.";

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: 'A concise description of the image.' },
      category: { type: Type.STRING, description: 'A one-word category label.' },
      keyPoints: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: 'Key objects or text found in the image.' 
      }
    },
    required: ['summary', 'category', 'keyPoints']
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema
      }
    });

    return JSON.parse(response.text || '{}') as AIAnalysis;
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw error;
  }
};
