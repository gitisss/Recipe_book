import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://8526656:1WThE3gaYOUDeLta@cluster0.87rl3.mongodb.net/Recipe_book?retryWrites=true&w=majority&appName=Cluster0"
;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ מחובר ל־MongoDB בענן');
  } catch (error) {
    console.error('❌ שגיאה בחיבור ל־MongoDB:', error);
    process.exit(1);
  }
};
