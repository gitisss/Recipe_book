import express from "express";
import cors from "cors";
import { login } from "./controllers/LogInController";
import { connectDB } from "./DB/mongoConnector";

const app = express();
const PORT = process.env.PORT || 3000;
 //לאיזה כתובות אייפי מותר לגשת לשרת
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "שלום עולם מ-Express + TypeScript!" });
});

app.post("/api/logIn", (req, res) => {
  login(req, res);
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
});
