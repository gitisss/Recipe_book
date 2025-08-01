# 📖 פרויקט ספר מתכונים (Recipe Book App)

פרויקט זה מטרתו לבנות אפליקציית אינטרנט לניהול מתכונים, עם יכולות אימות משתמשים, ניהול מתכונים מלא (CRUD) ותכונות מתקדמות המבוססות על AI וסריקת מסמכים.

## 📁 מבנה הפרויקט

זהו פרויקט מסוג **Monorepo** עם שתי תיקיות ראשיות:
- `client/`: מכיל את קוד ה-Frontend (React, TypeScript, Vite).
- `server/`: מכיל את קוד ה-Backend (Node.js, Express, TypeScript, Mongoose).

## 🌟 סטטוס הפרויקט - מה בוצע עד כה:

### 🚀 Backend (שרת - Node.js, Express, TypeScript, Mongoose)
-   **מודלים וחיבור ל-DB:** מודלים מוגדרים עבור משתמשים ומתכונים (כולל שדות חדשים כמו `prepTime`, `cookTime`, `servings`, `category`, `cuisine`, `dietaryRestrictions`), וקיים חיבור ל-MongoDB Atlas. שדה שם המתכון שונה מ-`name` ל-`title`.
-   **אימות משתמשים (Auth):** מנגנוני הרשמה והתחברות באמצעות bcrypt ו-JWT.
-   **ניהול מתכונים (CRUD):** בקר (`RecipeController.ts`) עם פונקציות מלאות ליצירה, קריאה, עדכון ומחיקת מתכונים.
-   **נתיבי API מוגנים:** נתיבי API עבור פעולות המתכונים מוגנים באמצעות מידלוור אימות JWT.
-   **אינטגרציית AI (ג'מיני):** נתיב API חדש להצעות מתכונים מה-AI (`AIController.ts`) המשתמש במודל `gemini-2.5-flash` ומחזיר מתכונים בפורמט JSON קפדני עם תוכן בעברית וקטגוריות/מטבחים ספציפיים.
-   **הכנה ופריסה ל-Render.com:** הוגדרו פקודות (`npm run build`, `npm start`) ונתיבים לפריסה ב-Render.com.

### 💻 Frontend (לקוח - React, TypeScript, Vite, Material-UI)
-   **מבנה בסיסי:** פרויקט React עם Vite ו-Material-UI.
-   **מנגנון אימות וניתוב:** כולל דפי התחברות (`LoginPage.tsx`) והרשמה (`SignUpPage.tsx`) וניתוב מוגן ללוח הבקרה (`DashboardPage.tsx`).
-   **חיבור Frontend ל-Backend (CRUD מלא):** `DashboardPage.tsx` מחובר ל-API של השרת לשליפה, יצירה, עדכון ומחיקת מתכונים.
-   **מודאלי עריכה וצפייה:**
    -   `AddRecipeModal.tsx`: מודאל ייעודי ליצירת/עריכת מתכון עם טופס מורחב ודינמי לרכיבים והוראות.
    -   `ViewRecipeModal.tsx`: מודאל לצפייה בפרטי מתכון, כולל התאמת כמויות דינמית של רכיבים על בסיס מכפיל שהוזן.
-   **קומפוננטות מודולריות:** `DashboardPage.tsx` פורק לקומפוננטות מודולריות וקלות לניהול, כולל `RecipeCard.tsx`, `RecipeList.tsx`, `AppHeader.tsx`, `AppFooter.tsx`, `SearchAndFilterSection.tsx`, `RecipeFormFields.tsx`, `IngredientsSection.tsx`, `InstructionsSection.tsx`.
-   **טיפוסיות משותפת:** קובץ `client/src/types/Recipe.ts` לטיפוסי TypeScript עקביים בין הקומפוננטות.
-   **אינטגרציית AI (ג'מיני) ב-Frontend:** ממשק משתמש ב-`AddRecipeModal.tsx` המאפשר לבקש מתכון מה-AI על בסיס קריטריונים, והמתכון המוצע מאכלס אוטומטית את שדות הטופס.


## 🗓️ מה בתכנון:

### ✨ תכונות מתקדמות
-   סריקת מסמכים (OCR + AI Structuring) להוספת מתכונים מתמונה (Backend + Frontend).

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