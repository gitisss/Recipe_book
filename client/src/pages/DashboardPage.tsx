import React, { useEffect, useState } from 'react';
import './DashboardPage.css'; // ייבוא קובץ ה-CSS הייעודי לדאשבורד

// הגדרת מבנה לנתוני משתמש, אם השרת מחזיר אותם
interface UserData {
  id: string;
  username: string;
  // אפשר להוסיף עוד שדות אם רלוונטי
}

// הגדרת מבנה ל-props שהקומפוננטה מקבלת
interface DashboardPageProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

// דוגמה למבנה מתכון (לצורך נתוני הדמה)
interface Recipe {
  id: string;
  name: string;
  description: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ currentUser, onLogout }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // בעתיד: שליפת מתכונים מהשרת באמצעות apiClient
    // const fetchRecipes = async () => {
    //   if (!currentUser) return; // לא מנסים לשלוף אם אין משתמש מחובר
    //   try {
    //     // apiClient ישלח את הטוקן אוטומטית בזכות ה-interceptor
    //     const response = await apiClient.get('/recipes'); // נניח שיש נקודת קצה כזו
    //     setRecipes(response.data);
    //   } catch (error) {
    //     console.error("Failed to fetch recipes", error);
    //     // טיפול בשגיאה, אולי להציג הודעה למשתמש
    //   }
    // };
    // fetchRecipes();

    // נתוני דמה זמניים להדגמה
    const dummyRecipes: Recipe[] = [
      { id: '1', name: 'עוגת שוקולד מדהימה', description: 'עוגה טעימה וקלה להכנה, מושלמת לכל אירוע.' },
      { id: '2', name: 'סלט קינואה מרענן', description: 'סלט בריא, צבעוני ומשביע עם ירקות טריים וקינואה.' },
      { id: '3', name: 'פסטה ברוטב רוזה קלאסי', description: 'מנה איטלקית אהובה עם רוטב עגבניות ושמנת עשיר.' },
    ];
    setRecipes(dummyRecipes);
  }, [currentUser]); // ה-useEffect ירוץ מחדש אם currentUser משתנה

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <h1>דאשבורד המתכונים</h1>
        {currentUser && (
          <div style={{ textAlign: 'left', marginTop: '10px' }}>
            <span>שלום, {currentUser.username}!</span>
            <button 
              onClick={onLogout} 
              style={{ 
                marginLeft: '10px', 
                padding: '8px 12px', 
                cursor: 'pointer', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px' 
              }}
            >
              התנתק
            </button>
          </div>
        )}
      </div>
      <p className="dashboard-welcome-message">ברוכים הבאים! כאן תוכלו לראות ולנהל את כל המתכונים שלכם.</p>
      
      <h2>המתכונים שלי:</h2>
      {recipes.length > 0 ? (
        <ul className="recipe-list">
          {recipes.map(recipe => (
            <li key={recipe.id} className="recipe-item">
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-recipes-message">
          {currentUser ? "טוען מתכונים או שעדיין אין לכם מתכונים..." : "יש להתחבר כדי לראות מתכונים."}
        </p> 
      )}
    </div>
  );
};

export default DashboardPage;
