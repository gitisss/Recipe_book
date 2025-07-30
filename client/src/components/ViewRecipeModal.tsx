import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import type { IRecipe, IIngredient } from "../types/Recipe";

interface ViewRecipeModalProps {
  open: boolean;
  onClose: () => void;
  recipe: IRecipe | null;
}

const ViewRecipeModal: React.FC<ViewRecipeModalProps> = ({
  open,
  onClose,
  recipe,
}) => {
  const [multiplier, setMultiplier] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("1");
  const [showWarning, setShowWarning] = useState<boolean>(false);

  if (!recipe) {
    return null;
  }

  const handleMultiplierChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setInputValue(value);

    // טיפול במקרה של קלט ריק
    if (value === "") {
      setMultiplier(1);
      setShowWarning(false);
      return;
    }

    const parsed = parseFloat(value);

    if (!isNaN(parsed) && parsed > 0) {
      setMultiplier(parsed);
      // בדיקה מדויקת יותר אם המספר הוא לא שלם
      setShowWarning(!Number.isInteger(parsed));
    } else {
      setMultiplier(1);
      setShowWarning(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        פרטי מתכון: {recipe.title}
      </DialogTitle>
      <DialogContent dividers>
        {recipe.imageUrl && (
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        )}

        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            תיאור
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {recipe.description || "אין תיאור זמין."}
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            התאמת כמויות
          </Typography>
          <TextField
            label="כפול/חלק"
            type="number"
            variant="outlined"
            value={inputValue}
            onChange={handleMultiplierChange}
            helperText="למשל: 0.5 = חצי כמות, 2 = כפול כמות"
            inputProps={{ min: 0.1, step: 0.1 }}
            sx={{ mb: 2 }}
          />
          {showWarning && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              שימו לב: בהכפלה במספר שאינו שלם ייתכנו מרכיבים שאינם ניתנים לחלוקה בקלות (כגון חצי ביצה).
            </Typography>
          )}
          <Typography variant="h6" gutterBottom>
            רכיבים
          </Typography>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul>
              {recipe.ingredients.map(
                (ingredient: IIngredient, index: number) => (
                  <li key={index}>
                    <Typography variant="body1">
                      {ingredient.name} -{" "}
                      {
                        // הפונקציה toFixed(2) משמשת כדי לוודא שמוצגים שני מקומות אחרי הנקודה העשרונית
                        (ingredient.isDivisible !== false && !isNaN(parseFloat(ingredient.quantity))
                          ? (parseFloat(ingredient.quantity) * multiplier)
                          : ingredient.quantity
                        )
                      }{" "}
                      {ingredient.unit}
                    </Typography>
                  </li>
                )
              )}
            </ul>
          ) : (
            <Typography variant="body1">אין רכיבים זמינים.</Typography>
          )}
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            הוראות הכנה
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {recipe.instructions}
          </Typography>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
        <Button onClick={onClose} color="primary" variant="contained">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRecipeModal;