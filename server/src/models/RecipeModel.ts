import mongoose, { Schema, Document } from "mongoose";

// הגדרת הממשק עבור רכיב
export interface IIngredient {
  name: string;
  quantity: string; // שונה ל-string
  unit: string;
  isDivisible?: boolean; // נשאר אותו דבר
}

// הגדרת הממשק עבור המתכון
export interface IRecipe extends Document {
  title: string; // שם השדה שונה מ-name ל-title
  description?: string;
  instructions: string[]; // שונה ל-string[]
  ingredients: IIngredient[];
  owner: mongoose.Schema.Types.ObjectId;
  imageUrl?: string;
  prepTime?: string; // חדש
  cookTime?: string; // חדש
  servings?: string; // חדש
  category?: string; // חדש
  cuisine?: string; // חדש
  dietaryRestrictions?: string[]; // חדש
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema: Schema = new Schema(
  {
    name: { type: String, required: true }, // הוספתי required: true
    quantity: { type: String }, // שונה ל-String
    unit: { type: String },
    isDivisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true }, // שם השדה שונה מ-name ל-title
    description: { type: String },
    instructions: { type: [String], required: true }, // שונה ל-[String]
    ingredients: [IngredientSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    prepTime: { type: String }, // חדש
    cookTime: { type: String },  // חדש
    servings: { type: String },  // חדש
    category: { type: String },  // חדש
    cuisine: { type: String },   // חדש
    dietaryRestrictions: { type: [String] }, // חדש
  },
  { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema);