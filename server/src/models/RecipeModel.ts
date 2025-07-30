import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient {
  name: string;
  quantity: string; 
  unit: string;
  isDivisible?: boolean; 
}

export interface IRecipe extends Document {
  title: string; 
  description?: string;
  instructions: string[]; 
  ingredients: IIngredient[];
  owner: mongoose.Schema.Types.ObjectId;
  imageUrl?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  category?: string;
  cuisine?: string;
  dietaryRestrictions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema: Schema = new Schema(
  {
    name: { type: String, required: true }, 
    quantity: { type: String }, 
    unit: { type: String },
    isDivisible: { type: Boolean, default: true },
  },
  { _id: false }
);

const RecipeSchema: Schema = new Schema(
  {
    title: { type: String, required: true }, 
    description: { type: String },
    instructions: { type: [String], required: true }, 
    ingredients: [IngredientSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    prepTime: { type: String }, 
    cookTime: { type: String },  
    servings: { type: String },  
    category: { type: String },  
    cuisine: { type: String },   
    dietaryRestrictions: { type: [String] }
  },
  { timestamps: true }
);

export const Recipe = mongoose.model<IRecipe>("Recipe", RecipeSchema);