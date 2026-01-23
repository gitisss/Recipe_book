import { Request, Response } from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateRecipeSuggestion = async (req: Request, res: Response) => {
  try {
    const { ingredients, diet, cuisine, mealType, mood } = req.body;

    // הדפסת פרטי המתכון המבוקש
    console.log("\n🔍 === פרטי בקשה למתכון חדש ===");
    console.log("📝 מצרכים:", ingredients || "any");
    console.log("🥗 דיאטה:", diet || "none");
    console.log("🌍 מטבח:", cuisine || "any");
    console.log("🍽️  סוג ארוחה:", mealType || "any");
    console.log("😊 סגנון:", mood || "any");
    console.log("=====================================\n");


    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
      You are a professional Michelin-star chef generator.
      Return a complete, realistic and culinary-sound recipe in Hebrew.

      Input preferences:
      Ingredients: ${ingredients || "any"}
      Diet: ${diet || "none"}
      Cuisine: ${cuisine || "any"}
      Meal type: ${mealType || "any"}
      Style: ${mood || "any"}

      Return ONLY a JSON object following this structure:
      {
        "title": "שם המתכון",
        "description": "תיאור קצר",
        "ingredients": [
          { "name": "שם המצרך", "quantity": "כמות", "unit": "יחידה" }
        ],
        "instructions": ["שלב 1", "שלב 2"],
        "prepTime": "זמן הכנה",
        "cookTime": "זמן בישול",
        "servings": "מספר מנות",
        "category": "עיקרית | קינוח | ארוחת בוקר | מרק | סלט | מאפה",
        "cuisine": "ישראלי | איטלקי | אסייתי | מזרח תיכוני | אמריקאי",
        "dietaryRestrictions": ["מגבלה"]
      }
    `.trim();

    // הגדרת כותרות ל-Streaming
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    console.log("🤖 מתחיל לקבל תשובה מ-AI...\n");
    console.log("📡 === תשובת AI (streaming) ===");

    // ביצוע קריאת סטרימינג
    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText); // הדפסת כל חלק מהתשובה
      res.write(chunkText); // שליחת החלק שהתקבל ישירות לקליינט
    }

    console.log("\n=================================");
    console.log("✅ הושלם בהצלחה!\n");

    res.end();

  } catch (error: any) {
    console.error("Gemini generation failed:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        message: "אירעה שגיאה ביצירת הצעת מתכון",
        error: error.message,
      });
    } else {
      res.end();
    }
  }
};
