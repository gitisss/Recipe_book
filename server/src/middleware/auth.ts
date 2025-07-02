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
    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    // הוספת מזהה המשתמש לאובייקט ה-request
    req.user = { id: decoded.id };

    // המשך לפונקציית הבקר הבאה בשרשרת
    next();
  } catch (error) {
    console.error('שגיאת אימות טוקן:', error);
    res.status(403).json({ message: 'טוקן לא תקין או פג תוקף.' });
  }
};