import React, { useEffect, useState } from 'react';
import '../styles/DashboardPage.css';

// דוגמה למבנה מתכון
interface Recipe {
  id: string;
  name: string;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // console.log("DashboardPage: useEffect is running."); // אפשר להשאיר את הלוגים או להסיר
    // נתוני דמה - בעתיד נקרא מהשרת
    const dummyRecipes: Recipe[] = [
      { id: '1', name: 'עוגת שוקולד מדהימה', description: 'עוגה טעימה וקלה להכנה, מושלמת לכל אירוע.' },
      { id: '2', name: 'סלט קינואה מרענן', description: 'סלט בריא, צבעוני ומשביע עם ירקות טריים וקינואה.' },
      { id: '3', name: 'פסטה ברוטב רוזה קלאסי', description: 'מנה איטלקית אהובה עם רוטב עגבניות ושמנת עשיר.' },
    ];
    setRecipes(dummyRecipes);
    // console.log("DashboardPage: dummyRecipes set:", dummyRecipes);
  }, []);

  // console.log("DashboardPage: Rendering component. isAuthenticated state in App.tsx should be true to see this.");
  // console.log("DashboardPage: Current recipes state:", recipes);

  return (
    <div className="dashboard-container"> {/* שימוש בקלאס מה-CSS */}
      <h1>דאשבורד המתכונים</h1>
      <p className="dashboard-welcome-message">ברוכים הבאים! כאן תוכלו לראות ולנהל את כל המתכונים שלכם.</p>
      
      {/* דוגמה לכפתור הוספת מתכון - אפשר להוסיף לו פונקציונליות בהמשך */}
      {/* <a href="#" className="add-recipe-button">הוסף מתכון חדש</a> */}

      <h2>המתכונים שלי:</h2>
      {recipes.length > 0 ? (
        <ul className="recipe-list"> {/* שימוש בקלאס מה-CSS */}
          {recipes.map(recipe => (
            <li key={recipe.id} className="recipe-item"> {/* שימוש בקלאס מה-CSS */}
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-recipes-message">טוען מתכונים או שעדיין אין לכם מתכונים...</p> 
      )}
    </div>
  );
};

export default DashboardPage;
