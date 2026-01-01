import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// ייבוא הראוטרים (Routes) המעודכנים
import clockRouter from "./routes/clock.js";
import userRouter from "./routes/user.js";
import orderRouter from "./routes/order.js";

// ייבוא פונקציית החיבור למסד הנתונים
import { connectToDB } from "./config/db.js";

// טעינת משתני סביבה מקובץ .env
dotenv.config();

const app = express();

// Middleware לטיפול בבקשות JSON
app.use(express.json());

// Middleware המאפשר גישה לשרת מדפדפנים חיצוניים (CORS)
app.use(cors());

// חיבור למסד הנתונים (MongoDB)
connectToDB();

/**
 * הגדרת נתיבי ה-API של המערכת
 */

// נתיב עבור פעולות על שעונים (הוספה, שליפה, עדכון, מחיקה)
app.use("/api/clocks", clockRouter); 

// נתיב עבור ניהול משתמשים (הרשמה, התחברות)
app.use("/api/users", userRouter);

// נתיב עבור ניהול הזמנות
app.use("/api/orders", orderRouter);

/**
 * הרצת השרת
 */
let port = process.env.PORT || 3000; // שימוש בפורט מהקובץ .env או ברירת מחדל 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});