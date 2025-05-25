import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in environment variables.');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ מחובר ל־MongoDB בענן');
  } catch (error) {
    console.error('❌ שגיאה בחיבור ל־MongoDB:', error);
    process.exit(1);
  }
};
