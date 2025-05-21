import express from "express";
import cors from "cors"; 
import { login } from "./controllers/LogInController";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

app.get("/", (req: express.Request, res: express.Response): void => {
  res.json({ message: "שלום עולם מ-Express + TypeScript!" });
});

app.post("/api/logIn", (req: express.Request, res: express.Response): void => {
  console.log(` הגיעה בקשה : ${req.method} ${req.url} `, req.body);
  login(req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
});
