// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { login } from "./controllers/LogInController";
import { signup } from "./controllers/SignUpController";
import { connectDB } from "./DB/mongoConnector";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./controllers/RecipeController";
import { generateRecipeSuggestion } from  "./controllers/AIController";
import { verifyToken } from './middleware/auth';


dotenv.config();
console.log('DEBUG: GEMINI_API_KEY from process.env:', process.env.GEMINI_API_KEY); 

const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "השרת עובד!" });
});

app.post("/api/logIn", login);
app.post("/api/signup", signup);

// נתיבי API למתכונים - מוגנים באמצעות מידלוור verifyToken
app.post("/api/recipes", verifyToken, createRecipe); // יצירת מתכון
app.get("/api/recipes", verifyToken, getRecipes); // שליפת כל המתכונים של המשתמש
app.get("/api/recipes/:id", verifyToken, getRecipeById); // שליפת מתכון בודד
app.put("/api/recipes/:id", verifyToken, updateRecipe); // עדכון מתכון
app.delete("/api/recipes/:id", verifyToken, deleteRecipe); // מחיקת מתכון

// נתיב API חדש להצעות מתכונים מה-AI - מוגן באמצעות מידלוור verifyToken
app.post("/api/ai/suggest-recipe", verifyToken, generateRecipeSuggestion); // חדש!


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("❌ Failed to connect to the database, server not started.", error);
  process.exit(1);
});