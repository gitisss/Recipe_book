import express from "express";
import cors from "cors";
import dotenv from 'dotenv'; 
import { login } from "./controllers/LogInController";
import { signup } from "./controllers/SignUpController";
import { connectDB } from "./DB/mongoConnector";


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


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("❌ Failed to connect to the database, server not started.", error);
  process.exit(1);
});
