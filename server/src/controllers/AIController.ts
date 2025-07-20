// server/src/controllers/AiController.ts
import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// וודא ש-GEMINI_API_KEY מוגדר כמשתנה סביבה
// const API_KEY = process.env.GEMINI_API_KEY;
const API_KEY = "AIzaSyCuwesoJP4RxoqsdOXtWOO52JersOjjq1M"

// כאן ניתן לוודא שהמפתח קיים לפני שממשיכים, או לזרוק שגיאה
// במקרה של פיתוח מקומי, עדיף שזה יתרסק אם המפתח חסר כדי שנדע לתקן.
// עבור פריסה בייצור, מנגנון טיפול בשגיאות חזק יותר יהיה נחוץ.
if (!API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set in environment variables. Please set it in your .env file.');
  // במקרה של שגיאה קריטית, ניתן לא לטעון את השרת או לספק הודעה ברורה
  // for now, we will proceed but expect errors from Google API
}

// הגדרת מודל ג'מיני - המשתנה genAI מוגדר פעם אחת בלבד כאן
const genAI = new GoogleGenerativeAI(API_KEY as string);

export const generateRecipeSuggestion = async (req: Request, res: Response) => {
  try {
    const { ingredients, diet, cuisine, mealType, mood } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      צור מתכון חדש בפורמט JSON, בהתבסס על הקריטריונים הבאים:
      מרכיבים זמינים: ${ingredients || 'כל המרכיבים המתאימים'}.
      הגבלות תזונתיות (אם יש): ${diet || 'אין'}.
      מטבח מועדף (אם יש): ${cuisine || 'כל מטבח מתאים'}.
      סוג ארוחה (אם יש, לדוגמה: ארוחת ערב, ארוחת בוקר): ${mealType || 'כל סוג ארוחה'}.
      מצב רוח/סגנון (אם יש, לדוגמה: קל, מנחם, מהיר): ${mood || 'כל סגנון'}.

      המבנה של אובייקט ה-JSON צריך להיות כדלקמן (אל תכלול שום טקסט נוסף מחוץ לאובייקט ה-JSON):
      {
        "title": "שם המתכון",
        "description": "תיאור קצר של המתכון",
        "ingredients": [
          { "name": "שם מרכיב", "quantity": "כמות", "unit": "יחידה (לדוגמה: גרם, כוסות)" }
        ],
        "instructions": [
          "שלב 1",
          "שלב 2",
          "..."
        ],
        "prepTime": "זמן הכנה (לדוגמה: 20 דקות)",
        "cookTime": "זמן בישול (לדוגמה: 30 דקות)",
        "servings": "מספר מנות (לדוגמה: 4)",
        "category": "קטגוריה (לדוגמה: עיקרית, קינוח)",
        "cuisine": "מטבח (לדוגמה: ישראלי, איטלקי)",
        "dietaryRestrictions": ["הגבלה 1", "הגבלה 2"]
      }

      וודא שכל השדות קיימים ומתאימים לטיפוסים, גם אם הם ריקים (לדוגמה, מערך ריק עבור dietaryRestrictions אם אין הגבלות).
      הכן מתכון עם רכיבים והוראות אמיתיים בהתאם לקריטריונים.
      החזר רק את אובייקט ה-JSON.
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