import mongoose, { Schema, Document } from "mongoose";

// הגדרת הממשק עבור רכיב
export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

// הגדרת הממשק עבור המתכון
export interface IRecipe extends Document {
  name: string;
  description?: string;
  instructions: string;
  ingredients: IIngredient[];
  owner: mongoose.Schema.Types.ObjectId;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema: Schema = new Schema(
  {
    name: String,
    quantity: Number,
    unit: String,
    isDivisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const RecipeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    instructions: { type: String, required: true },
    ingredients: [IngredientSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema);
