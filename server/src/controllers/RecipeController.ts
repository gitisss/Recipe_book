// server/src/controllers/RecipeController.ts
import { Request, Response } from 'express';
import { Recipe } from '../models/RecipeModel';
import mongoose from 'mongoose';

// יצירת מתכון חדש
export const createRecipe = async (req: Request, res: Response) => {
  try {
    const { name, description, instructions, ingredients, imageUrl } = req.body;
    const owner = (req as any).user.id; // מזהה המשתמש מגיע ממידלוור האימות

    if (!name || !instructions || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'שם, הוראות ורכיבים הם שדות חובה.' });
    }

    const newRecipe = new Recipe({
      name,
      description,
      instructions,
      ingredients,
      owner,
      imageUrl,
    });

    await newRecipe.save();
    res.status(201).json({ message: 'מתכון נוצר בהצלחה!', recipe: newRecipe });
  } catch (error) {
    console.error('שגיאה ביצירת מתכון:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשרת בעת יצירת מתכון.' });
  }
};

// שליפת כל המתכונים של משתמש מסוים
export const getRecipes = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user.id; // מזהה המשתמש מגיע ממידלוור האימות
    const recipes = await Recipe.find({ owner }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    console.error('שגיאה בשליפת מתכונים:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשרת בעת שליפת מתכונים.' });
  }
};

// שליפת מתכון בודד לפי ID
export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }

    const recipe = await Recipe.findOne({ _id: id, owner });

    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה לגשת אליו.' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('שגיאה בשליפת מתכון לפי ID:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשרת בעת שליפת מתכון.' });
  }
};

// עדכון מתכון קיים
export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, owner },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה לעדכן אותו.' });
    }

    res.status(200).json({ message: 'מתכון עודכן בהצלחה!', recipe: updatedRecipe });
  } catch (error) {
    console.error('שגיאה בעדכון מתכון:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשרת בעת עדכון מתכון.' });
  }
};

// מחיקת מתכון
export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'מזהה מתכון לא תקין.' });
    }

    const deletedRecipe = await Recipe.findOneAndDelete({ _id: id, owner });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה למחוק אותו.' });
    }

    res.status(200).json({ message: 'מתכון נמחק בהצלחה!', recipe: deletedRecipe });
  } catch (error) {
    console.error('שגיאה במחיקת מתכון:', error);
    res.status(500).json({ message: 'אירעה שגיאה בשרת בעת מחיקת מתכון.' });
  }
};