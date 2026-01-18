import { Request, Response } from "express";

export const generateRecipeSuggestion = async (req: Request, res: Response) => {
  try {
    const { ingredients, diet, cuisine, mealType, mood } = req.body;

    const prompt = `
      You are a professional Michelin-star chef generator.
      Return a complete, realistic and culinary-sound recipe in STRICT JSON format only.

      All field VALUES must be written in Hebrew.

      Input preferences:
      Ingredients: ${ingredients || "any"}
      Diet: ${diet || "none"}
      Cuisine: ${cuisine || "any"}
      Meal type: ${mealType || "any"}
      Style: ${mood || "any"}

      JSON schema:
      {
        "title": "string",
        "description": "string",
        "ingredients": [
          { "name": "string", "quantity": "string", "unit": "string" }
        ],
        "instructions": ["string"],
        "prepTime": "string",
        "cookTime": "string",
        "servings": "string",
        "category": "עיקרית | קינוח | ארוחת בוקר | מרק | סלט | מאפה",
        "cuisine": "ישראלי | איטלקי | אסייתי | מזרח תיכוני | אמריקאי",
        "dietaryRestrictions": ["string"]
      }

      Rules:
      - JSON only, no markdown, no prose.
      - Ensure culinary logic: proportions must be realistic.
      - Category and cuisine must match EXACTLY one of the allowed values.
      `.trim();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.7, // איזון בין יצירתיות להיגיון
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama HTTP error ${response.status}`);
    }

    const data: any = await response.json();

    let recipe;
    try {
      recipe = JSON.parse(data.response);
    } catch (err) {
      console.error("AI returned invalid JSON:", data.response);
      return res.status(500).json({
        message: "ה-AI החזיר פורמט לא תקין",
        rawResponse: data.response,
      });
    }

    return res.status(200).json(recipe);
  } catch (error: any) {
    console.error("Recipe generation failed:", error);
    return res.status(500).json({
      message: "אירעה שגיאה ביצירת הצעת מתכון",
      error: error.message,
    });
  }
};
