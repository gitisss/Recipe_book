// server/src/controllers/RecipeController.ts
import { Request, Response } from 'express';
import { Recipe } from '../models/RecipeModel'; // ייבוא בעל שם { Recipe }
import { User } from '../models/UserModel';     // ייבוא בעל שם { User }

// הרחבת הטיפוס Request של Express כדי לכלול userId
// חשוב: לוודא שאין רווחים או תווים נסתרים בשורה 'express-serve-static-core'
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string; // ה-userId נוסף על ידי מידלוור האימות
  }
}

// יצירת מתכון חדש
export const createRecipe = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'משתמש לא מאומת. יש להתחבר מחדש.' });
    }

    const { name, description, instructions, ingredients, imageUrl } = req.body;

    const newRecipe = new Recipe({
      name,
      description,
      instructions,
      ingredients,
      imageUrl,
      owner: req.userId, // קישור המתכון למשתמש המחובר
    });

    await newRecipe.save();
    res.status(201).json({ message: 'מתכון נוצר בהצלחה!', recipe: newRecipe });
  } catch (error: any) {
    console.error('שגיאה ביצירת מתכון:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: 'שגיאה פנימית בשרת בעת יצירת מתכון.' });
  }
};

// שליפת כל המתכונים של המשתמש המחובר
export const getRecipes = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }
    const recipes = await Recipe.find({ owner: req.userId });
    res.status(200).json(recipes);
  } catch (error: any) {
    console.error('שגיאה בשליפת מתכונים:', error);
    res.status(500).json({ message: 'שגיאה פנימית בשרת בעת שליפת מתכונים.' });
  }
};

// שליפת מתכון בודד לפי ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }
    const recipe = await Recipe.findOne({ _id: req.params.id, owner: req.userId });

    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה לגשת אליו.' });
    }
    res.status(200).json(recipe);
  } catch (error: any) {
    console.error('שגיאה בשליפת מתכון לפי ID:', error);
    if (error.name === 'CastError') { // אם ה-ID לא בפורמט הנכון של ObjectId
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }
    res.status(500).json({ message: 'שגיאה פנימית בשרת בעת שליפת מתכון.' });
  }
};

// עדכון מתכון קיים
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }
    const { id } = req.params;
    const { name, description, instructions, ingredients, imageUrl } = req.body;

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, owner: req.userId }, // וודא שרק הבעלים יכול לעדכן
      { name, description, instructions, ingredients, imageUrl },
      { new: true, runValidators: true } // new: true מחזיר את המסמך המעודכן, runValidators: true מפעיל ולידציה
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה לעדכן אותו.' });
    }
    res.status(200).json({ message: 'מתכון עודכן בהצלחה!', recipe: updatedRecipe });
  } catch (error: any) {
    console.error('שגיאה בעדכון מתכון:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }
    res.status(500).json({ message: 'שגיאה פנימית בשרת בעת עדכון מתכון.' });
  }
};

// מחיקת מתכון
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }
    const { id } = req.params;

    const deletedRecipe = await Recipe.findOneAndDelete({ _id: id, owner: req.userId }); // וודא שרק הבעלים יכול למחוק

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה למחוק אותו.' });
    }
    res.status(200).json({ message: 'מתכון נמחק בהצלחה!' });
  } catch (error: any) {
    console.error('שגיאה במחיקת מתכון:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }
    res.status(500).json({ message: 'שגיאה פנימית בשרת בעת מחיקת מתכון.' });
  }
};