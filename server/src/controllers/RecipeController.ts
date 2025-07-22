import { Request, Response } from 'express';
import { Recipe } from '../models/RecipeModel';

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const { title, description, ingredients, instructions, imageUrl, prepTime, cookTime, servings, category, cuisine, dietaryRestrictions } = req.body;
    const owner = req.userId;

    if (!owner) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }

    const newRecipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      owner,
      imageUrl,
      prepTime,
      cookTime,
      servings,
      category: category === 'ללא קטגוריה' ? '' : category, // שמור ריק אם נבחר "ללא קטגוריה"
      cuisine,
      dietaryRestrictions,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error: any) {
    console.error('שגיאה ביצירת מתכון:', error);
    res.status(400).json({ message: 'שגיאה ביצירת מתכון', error: error.message });
  }
};

export const getRecipes = async (req: Request, res: Response) => {
  try {
    const owner = req.userId;
    if (!owner) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }

    const { category } = req.query;

    const filter: any = { owner };
    if (category) {
      if (category === 'ללא קטגוריה') {
        filter.category = { $in: [null, '', undefined] }; // חפש מתכונים ללא קטגוריה
      } else {
        filter.category = category;
      }
    }

    const recipes = await Recipe.find(filter);
    res.status(200).json(recipes);
  } catch (error: any) {
    console.error('שגיאה בשליפת מתכונים:', error);
    res.status(500).json({ message: 'שגיאה בשליפת מתכונים', error: error.message });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.userId;
    if (!owner) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }

    const recipe = await Recipe.findOne({ _id: id, owner });
    if (!recipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא.' });
    }
    res.status(200).json(recipe);
  } catch (error: any) {
    console.error('שגיאה בשליפת מתכון לפי ID:', error);
    res.status(500).json({ message: 'שגיאה בשליפת מתכון', error: error.message });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, ingredients, instructions, imageUrl, prepTime, cookTime, servings, category, cuisine, dietaryRestrictions } = req.body;
    const owner = req.userId;

    if (!owner) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: id, owner },
      { 
        title, 
        description, 
        ingredients, 
        instructions, 
        imageUrl, 
        prepTime, 
        cookTime, 
        servings, 
        category: category === 'ללא קטגוריה' ? '' : category, // שמור ריק אם נבחר "ללא קטגוריה"
        cuisine, 
        dietaryRestrictions 
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה לערוך אותו.' });
    }
    res.status(200).json(updatedRecipe);
  } catch (error: any) {
    console.error('שגיאה בעדכון מתכון:', error);
    res.status(400).json({ message: 'שגיאה בעדכון מתכון', error: error.message });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = req.userId;

    if (!owner) {
      return res.status(401).json({ message: 'משתמש לא מאומת.' });
    }

    const deletedRecipe = await Recipe.findOneAndDelete({ _id: id, owner });

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'מתכון לא נמצא או שאין לך הרשאה למחוק אותו.' });
    }
    res.status(200).json({ message: 'מתכון נמחק בהצלחה.' });
  } catch (error: any) {
    console.error('שגיאה במחיקת מתכון:', error);
    res.status(500).json({ message: 'שגיאה במחיקת מתכון', error: error.message });
  }
};