import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/UserModel'; // ודא שהנתיב למודל המשתמש נכון

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // בדיקה אם כל השדות הנדרשים התקבלו
  if (!username || !password) {
    res.status(400).json({ message: 'שם משתמש וסיסמה הם שדות חובה.' });
    return;
  }

  try {
    // חיפוש המשתמש לפי שם המשתמש
    const user = await User.findOne({ username });

    // אם המשתמש לא נמצא, או אם הסיסמה אינה תואמת
    if (!user) {
      res.status(401).json({ message: 'שם משתמש או סיסמה שגויים.' }); // Unauthorized
      return;
    }

    // השוואת הסיסמה שהתקבלה עם הסיסמה המוצפנת השמורה
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'שם משתמש או סיסמה שגויים.' }); // Unauthorized
      return;
    }

    // אם שם המשתמש והסיסמה נכונים
    // בעתיד, כאן ננפיק טוקן JWT
    res.status(200).json({ message: 'התחברות מוצלחת!' /* , token: "YOUR_JWT_TOKEN_HERE" */ });

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: error.message });
    } else {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: 'Unknown error' });
    }
  }
};
