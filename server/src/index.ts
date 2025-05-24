import express from "express";
import cors from "cors";
import dotenv from 'dotenv'; 
import { login } from "./controllers/LogInController";
import { signup } from "./controllers/SignUpController";
import { connectDB } from "./DB/mongoConnector";


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001; // שיניתי ל-3001 כדי למנוע התנגשות אם יש משהו אחר על 3000

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // אפשר להגדיר גם את זה ב-.env
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "היי!! האתר שלי באויררררר" });
});

app.post("/api/logIn", login); 
app.post("/api/signup", signup); 


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("❌ Failed to connect to the database, server not started.", error);
  process.exit(1);
});
