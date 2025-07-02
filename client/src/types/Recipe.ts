// client/src/types/Recipe.ts

// הגדרת הממשק עבור רכיב
export interface IIngredient {
    name: string;
    quantity: number;
    unit: string;
  }
  
  // הגדרת הממשק עבור מתכון מלא (כפי שמועבר ל-Backend ביצירה/עדכון)
  export interface IFullRecipeData {
    name: string;
    description?: string;
    instructions: string;
    ingredients: IIngredient[];
    imageUrl?: string;
  }
  
  // הגדרת הממשק עבור מתכון שמתקבל מה-Backend (כולל ID)
  export interface IRecipe {
    _id: string; // ה-ID של מונגו נקרא _id
    name: string;
    description?: string;
    instructions: string;
    ingredients: IIngredient[];
    owner: string; // Owner ID
    imageUrl?: string;
    createdAt: string; 
    updatedAt: string; 
  }