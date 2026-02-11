import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB } from './config/db.js';

// ייבוא ה-Routes שעדכנו קודם
import clockRoutes from './routes/clock.js';
import userRoutes from './routes/user.js';
import orderRoutes from './routes/order.js';

// הגדרת משתני סביבה
dotenv.config();

const app = express();

// Middlewares בסיסיים
app.use(cors()); // מאפשר גישה מדפדפנים שונים
app.use(express.json()); // מאפשר לשרת לקרוא נתוני JSON ב-Body של הבקשה

// חיבור למסד הנתונים MongoDB
connectToDB();

/**
 * הגדרת הנתיבים הראשיים עם קידומת api
 * כאן אנחנו מחברים את כל הקבצים שיצרנו
 */
app.use('/api/clocks', clockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// הגדרת פורט והרצת השרת
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});