import express from "express";
import cors from "cors";
import { login } from "./controllers/LogInController"; // נתיב לקונטרולר ההתחברות
import { signup } from "./controllers/SignUpController"; // ייבוא קונטרולר ההרשמה החדש
import { connectDB } from "./DB/mongoConnector";

const app = express();
const PORT = process.env.PORT || 3000;

// הגדרות CORS - ודא שהן מתאימות לכתובת הלקוח שלך
app.use(cors({
  origin: 'http://localhost:5173', // או כל כתובת אחרת של הלקוח שלך
  credentials: true
}));

// Middleware לקריאת גוף הבקשה בפורמט JSON
app.use(express.json());

// נתיב בדיקה ראשי
app.get("/", (req, res) => {
  res.json({ message: "שלום עולם מ-Express + TypeScript!" });
});

// נתיב להתחברות משתמש קיים
//POST api/logIn
app.post("/api/logIn", (req, res) => {
  login(req, res);
});

// נתיב להרשמת משתמש חדש
//POST api/signup
app.post("/api/signup", (req, res) => {
  signup(req, res);
});

// התחברות למסד הנתונים והפעלת השרת
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 השרת רץ על http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error("❌ Failed to connect to the database, server not started.", error);
  process.exit(1); // יציאה מהתהליך אם החיבור למסד הנתונים נכשל
});
