// server/src/index.ts
import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { login } from "./controllers/LogInController";
import { signup } from "./controllers/SignUpController";
import { connectDB } from "./DB/mongoConnector";
import { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from "./controllers/RecipeController";
import { verifyToken } from './middleware/auth';


dotenv.config();

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


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("❌ Failed to connect to the database, server not started.", error);
  process.exit(1);
});