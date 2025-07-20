// client/src/types/Recipe.ts

// הגדרת הממשק עבור רכיב
export interface IIngredient {
  name: string;
  quantity: string; // שונה ל-string כדי להתאים ל-TextField
  unit: string;
  isDivisible?: boolean; // ברירת מחדל: true אם לא צוין
}

// הגדרת הממשק עבור מתכון מלא (כפי שמועבר ל-Backend ביצירה/עדכון)
export interface IFullRecipeData {
title: string; // שם השדה שונה מ-name ל-title
description?: string;
instructions: string[]; // שונה ל-string[]
ingredients: IIngredient[];
imageUrl?: string;
prepTime?: string; // חדש
cookTime?: string;  // חדש
servings?: string;  // חדש
category?: string;  // חדש
cuisine?: string;   // חדש
dietaryRestrictions?: string[]; // חדש
}

// הגדרת הממשק עבור מתכון שמתקבל מה-Backend (כולל ID)
export interface IRecipe {
_id: string; // ה-ID של מונגו נקרא _id
title: string; // שם השדה שונה מ-name ל-title
description?: string;
instructions: string[]; // שונה ל-string[]
ingredients: IIngredient[];
owner: string; // Owner ID
imageUrl?: string;
prepTime?: string; // חדש
cookTime?: string;  // חדש
servings?: string;  // חדש
category?: string;  // חדש
cuisine?: string;   // חדש
dietaryRestrictions?: string[]; // חדש
createdAt: string;
updatedAt: string;
}