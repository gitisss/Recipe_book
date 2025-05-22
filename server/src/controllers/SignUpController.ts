import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/UserModel';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  // בדיקה אם כל השדות הנדרשים התקבלו
  if (!username || !password) {
    res.status(400).json({ message: 'שם משתמש וסיסמה הם שדות חובה.' });
    return;
  }

  try {
    // בדיקה אם שם המשתמש כבר קיים במערכת
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: 'שם המשתמש כבר קיים במערכת.' }); // 409 Conflict
      return;
    }

    // הצפנת הסיסמה
    const saltRounds = 5; // מספר סבבי ההצפנה, ערך מקובל
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // יצירת משתמש חדש
    const newUser = new User({
      username,
      password: hashedPassword, // שמירת הסיסמה המוצפנת
    });

    // שמירת המשתמש במסד הנתונים
    await newUser.save();

    // החזרת תשובת הצלחה
    // בעתיד, אפשר להחזיר כאן גם טוקן JWT אם רוצים שהמשתמש יתחבר אוטומטית אחרי הרשמה
    res.status(201).json({ message: 'ההרשמה בוצעה בהצלחה!' }); // 201 Created

  } catch (error) {
    console.error('Signup error:', error);
    // טיפול בשגיאות כלליות, למשל בעיות בגישה למסד הנתונים
    if (error instanceof Error) {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: error.message });
    } else {
        res.status(500).json({ message: 'אירעה שגיאה פנימית בשרת.', error: 'Unknown error' });
    }
  }
};
