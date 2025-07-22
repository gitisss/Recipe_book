// server/src/controllers/AiController.ts
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY ="AIzaSyC1xW0G3ryDJKdtUihZ5vo9HUPguonnv2k"

if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables. Please set it in your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY as string);
export const generateRecipeSuggestion = async (req: Request, res: Response) => {
  try {
    const { ingredients, diet, cuisine, mealType, mood } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Generate a realistic and complete recipe in strict JSON format based on these criteria:
      Ingredients: ${ingredients || 'any suitable'}.
      Diet: ${diet || 'none'}.
      Cuisine: ${cuisine || 'any'}.
      Meal Type: ${mealType || 'any'}.
      Style: ${mood || 'any'}.

      JSON schema: {
        "title": "string",
        "description": "string",
        "ingredients": [{"name":"string","quantity":"string","unit":"string"}],
        "instructions": ["string"],
        "prepTime": "string",
        "cookTime": "string",
        "servings": "string",
        "category": "string",
        "cuisine": "string",
        "dietaryRestrictions": ["string"]
      }
      CRITICAL: All fields marked as (REQUIRED) and their sub-fields MUST be populated with valid and meaningful content.
      Specifically, 'title' MUST be filled, 'instructions' MUST contain at least one step, and 'ingredients' MUST contain at least one ingredient with a 'name'.
      Generate all recipe content (values for fields) in Hebrew.
      IMPORTANT: For 'category' and 'cuisine' fields, use the exact singular Hebrew terms from the following lists:
      Categories: "עיקרית", "קינוח", "ארוחת בוקר", "מרק", "סלט", "מאפה".
      Cuisines: "ישראלי", "איטלקי", "אסייתי", "מזרח תיכוני", "אמריקאי".
      Return JSON ONLY. Do not add any introductory or concluding text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let suggestedRecipe;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        suggestedRecipe = JSON.parse(jsonMatch[1]);
      } else {
        suggestedRecipe = JSON.parse(text);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError, 'Original text:', text);
      throw new Error('AI generated an invalid recipe format. Original text was: ' + text);
    }

    res.status(200).json(suggestedRecipe);

  } catch (error: any) {
    console.error('Error generating recipe suggestion:', error);
    if (error.response && error.response.status) {
      res.status(error.response.status).json({ message: 'שגיאה מה-AI API: ' + error.message, error: error.response.data });
    } else if (error.message && error.message.includes('API_KEY')) {
      res.status(500).json({ message: 'שגיאה במפתח ה-API של גיני. וודא שהוא מוגדר נכון.', error: error.message });
    } else {
      res.status(500).json({ message: 'אירעה שגיאה ביצירת הצעת מתכון מה-AI.', error: error.message });
    }
  }
};