// server/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// הרחבת ה-Request object של אקספרס כדי לכלול את user id
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      userId?: string; // הוספנו את זה בעבר כדי למנוע שגיאות קומפילציה
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // קבלת הטוקן מה-header של הבקשה
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // אם אין טוקן, החזר שגיאת 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: 'גישה נדחתה. נדרש טוקן אימות.' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ message: 'שגיאת שרת פנימית: JWT secret לא מוגדר.' });
    }

    // אימות הטוקן
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // הוספת מזהה המשתמש לאובייקט ה-request
    req.userId = decoded.userId; 
    
    // המשך לפונקציית הבקר הבאה בשרשרת
    next();
  } catch (error) {
    console.error('שגיאת אימות טוקן:', error);
    // אם הטוקן לא תקין או פג תוקף
    res.status(403).json({ message: 'טוקן לא תקין או פג תוקף.' });
  }
};