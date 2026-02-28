import { GoogleGenAI, Type } from "@google/genai";
import { CVData, UserContext, CVAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function searchJobTrends(domain: string, target: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for the latest CV trends, essential keywords, and highly valued skills for a ${target} position in the ${domain} domain for 2025-2026. Provide a concise summary of what recruiters are looking for.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  return response.text;
}

export async function analyzeAndImproveCV(
  currentCV: CVData | string,
  context: UserContext,
  trends: string
): Promise<CVAnalysis> {
  const cvString = typeof currentCV === 'string' ? currentCV : JSON.stringify(currentCV);
  
  const prompt = `
    You are an expert career coach and professional resume writer.
    
    USER CONTEXT:
    - Domain: ${context.domain}
    - Target: ${context.target}
    - Duration: ${context.duration}
    - Additional Info: ${context.additionalInfo}
    
    MARKET TRENDS:
    ${trends}
    
    CURRENT CV DATA:
    ${cvString}
    
    TASK:
    1. Analyze the current CV against the market trends and user goals.
    2. Provide specific suggestions for improvement.
    3. Identify missing keywords.
    4. Rewrite the CV content (summary, experience descriptions) to be more impactful, professional, and optimized for ATS (Applicant Tracking Systems).
    
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of specific improvements suggested."
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Keywords that should be included."
          },
          improvedCV: {
            type: Type.OBJECT,
            properties: {
              personalInfo: {
                type: Type.OBJECT,
                properties: {
                  fullName: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  website: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["fullName", "email", "summary"]
              },
              experiences: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    company: { type: Type.STRING },
                    position: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    school: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    field: { type: Type.STRING },
                    graduationDate: { type: Type.STRING }
                  }
                }
              },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    link: { type: Type.STRING }
                  }
                }
              },
              languages: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["personalInfo", "experiences", "education", "skills"]
          }
        },
        required: ["suggestions", "keywords", "improvedCV"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function parseRawInputToCV(input: string): Promise<CVData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract CV information from the following text and format it as JSON: \n\n${input}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          personalInfo: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedin: { type: Type.STRING },
              website: { type: Type.STRING },
              summary: { type: Type.STRING }
            }
          },
          experiences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                company: { type: Type.STRING },
                position: { type: Type.STRING },
                location: { type: Type.STRING },
                startDate: { type: Type.STRING },
                endDate: { type: Type.STRING },
                description: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                school: { type: Type.STRING },
                degree: { type: Type.STRING },
                field: { type: Type.STRING },
                graduationDate: { type: Type.STRING }
              }
            }
          },
          skills: { type: Type.ARRAY, items: { type: Type.STRING } },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                link: { type: Type.STRING }
              }
            }
          },
          languages: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  return JSON.parse(response.text);
}
