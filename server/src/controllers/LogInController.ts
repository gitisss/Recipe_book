import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel';


export const login = async (req: Request, res: Response): Promise<void> => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const { username, password } = req.body;

  if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
    res.status(500).json({ message: 'Internal server error: JWT secret not configured.' });
    return;
  }

  // בדיקה אם כל השדות הנדרשים התקבלו
  if (!username || !password) {
    res.status(400).json({ message: 'שם משתמש וסיסמה הם שדות חובה.' });
    return;
  }

  try {
    // חיפוש המשתמש לפי שם המשתמש
    const user = await User.findOne({ username });

    // אם המשתמש לא נמצא במסד הנתונים
    if (!user) {
      res.status(401).json({ message: 'שם משתמש או סיסמה שגויים.' });
      return;
    }

    // השוואת הסיסמה שהתקבלה מהלקוח עם הסיסמה המוצפנת השמורה במסד הנתונים
    const isMatch = await bcrypt.compare(password, user.password);

    // אם הסיסמאות אינן תואמות
    if (!isMatch) {
      res.status(401).json({ message: 'שם משתמש או סיסמה שגויים.' });
      return;
    }

    const payload = {
      userId: user._id, // מוגדר כ-userId
      username: user.username,
    };
    // יצירת הטוקן עם הסוד ותאריך תפוגה (למשל, שעה אחת)
    const token = jwt.sign(
      payload,
      JWT_SECRET, // שימוש בסוד ממשתנה הסביבה
      { expiresIn: '10h' } // הטוקן יהיה תקף לשעה. אפשר לשנות (למשל, '7d' לשבוע)
    );

    // שלח את הטוקן חזרה ללקוח, יחד עם הודעת הצלחה ופרטי משתמש בסיסיים (ללא הסיסמה)
    res.status(200).json({
      message: 'התחברות מוצלחת!',
      token: token, // הטוקן שנוצר
      user: { // מידע בסיסי על המשתמש שאפשר להשתמש בו בצד הלקוח
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: error.message });
    } else {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: 'Unknown error' });
    }
  }
};
