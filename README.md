# 📖 פרויקט ספר מתכונים (Recipe Book App)

פרויקט זה מטרתו לבנות אפליקציית אינטרנט לניהול מתכונים, עם יכולות אימות משתמשים, ניהול מתכונים מלא (CRUD) ותכונות מתקדמות עתידיות המבוססות על AI וסריקת מסמכים.

## 📁 מבנה הפרויקט

זהו פרויקט מסוג **Monorepo** עם שתי תיקיות ראשיות:
- `client/`: מכיל את קוד ה-Frontend (React, TypeScript, Vite).
- `server/`: מכיל את קוד ה-Backend (Node.js, Express, TypeScript, Mongoose).

## 🌟 סטטוס הפרויקט - מה בוצע עד כה:

### 🚀 Backend (שרת - Node.js, Express, TypeScript, Mongoose)
- **מודלים וחיבור ל-DB:** מודלים מוגדרים עבור משתמשים ומתכונים, וקיים חיבור ל-MongoDB Atlas.
- **אימות משתמשים (Auth):** מנגנוני הרשמה והתחברות באמצעות bcrypt ו-JWT.
- **ניהול מתכונים (CRUD):** בקר (`RecipeController.ts`) עם פונקציות מלאות ליצירה, קריאה, עדכון ומחיקת מתכונים.
- **נתיבי API מוגנים:** נתיבי API עבור פעולות המתכונים מוגנים באמצעות מידלוור אימות JWT.
- **הכנה ופריסה ל-Render.com:** הוגדרו פקודות (`npm run build`, `npm start`) ונתיבים לפריסה ב-Render.com.

### 💻 Frontend (לקוח - React, TypeScript, Vite, Material-UI)
- **מבנה בסיסי:** פרויקט React עם Vite ו-Material-UI.
- **ריפקטור לקומפוננטות:** `DashboardPage.tsx` פורק לקומפוננטות מודולריות וקלות לניהול.
    - `AddRecipeModal.tsx`: מודאל ייעודי ליצירת מתכון עם טופס מורחב ודינמי לרכיבים.
    - **פלייסבולדרים ל-AI וסריקה:** כפתורים מושבתים ל"בקש מתכון מה-AI שלנו" ו"העלה צילום מתכון לסריקה" בתוך מודאל יצירת המתכון.
    - **קומפוננטות UI נוספות:** `RecipeCard.tsx`, `RecipeList.tsx`, `AppHeader.tsx`, `SearchAndFilterSection.tsx`, `AppFooter.tsx`.
    - **טיפוסיות משותפת:** קובץ `client/src/types/Recipe.ts` לטיפוסי TypeScript עקביים.

## 🗓️ מה בתכנון:

### 🔗 חיבור Frontend ל-Backend
- **שליפת מתכונים:** חיבור `DashboardPage` ל-API של השרת לשליפת מתכונים אמיתיים.
- **יצירת, עדכון ומחיקת מתכונים:** מימוש לוגיקת ה-CRUD המלאה מול השרת.

### ✨ תכונות מתקדמות (בהתאם לתוכנית הפרויקט המקורית)
- התאמת כמויות מתכון ב-Frontend.
- אינטגרציית AI (ג'מיני) להצעות מתכונים (Backend + Frontend).
- סריקת מסמכים (OCR + AI Structuring) להוספת מתכונים מתמונה (Backend + Frontend).

## 💡 פרטים חשובים לזכור:

* **הפעלה מקומית:**
    * **Backend:** נווטו לתיקיית `server/` והריצו `npm install` ואז `npm run dev`.
    * **Frontend:** נווטו לתיקיית `client/` והריצו `npm install` ואז `npm run dev`.
* **פריסת Backend (Render.com):**
    * השרת פרוס ב-Render.com.
    * **URL נוכחי של השרת:** `https://recipe-book-oxv7.onrender.com` (זהו ה-URL שאליו ה-Frontend צריך לשלוח בקשות).
    * **פקודות בניה/הפעלה ב-Render:** `Build Command: npm run build`, `Start Command: npm start`.
    * **Root Directory ב-Render:** `./server`.
* **פריסת Frontend (מומלץ Netlify):**
    * יש להריץ `npm run build` בתיקיית `client/` כדי ליצור את תיקיית ה-`dist` (הקבצים הסטטיים לפריסה).
    * ניתן לחבר את הריפו ל-Netlify (או לגרור את תיקיית ה-`dist` באופן ידני).
* **משתני סביבה (Environment Variables) ב-Render (עבור ה-Backend):**
    * חובה להגדיר את המשתנים הבאים ב"Environment Variables" של שירות ה-Web Service ב-Render:
        * `MONGO_URI`: כתובת החיבור המלאה ל-MongoDB Atlas.
        * `JWT_SECRET`: מחרוזת סודית חזקה המשמשת לחתימת טוקני JWT.
        * `CLIENT_ORIGIN`: **חשוב!** כרגע הוא `http://localhost:5173`. **לאחר שה-Frontend יעלה לנטליפיי ויקבל URL ציבורי, יש לעדכן את הערך של `CLIENT_ORIGIN` ב-Render ל-URL המלא של ה-Frontend המאורח.** זה קריטי לאבטחת CORS בייצור.
* **אינטגרציית Git ב-Render:** Render עוקב אוטומטית אחרי פושים לענף הראשי של הריפוזיטורי הציבורי שלכם (על ידי polling) ומפעיל פריסות מחדש.

---