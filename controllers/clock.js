import { clockModel } from "../models/clock.js";

/**
 * שליפת כל השעונים ממסד הנתונים
 */
export const getClocks = async (req, res) => {
    try {
        // שימוש במתודת find כדי להביא את כל הרשומות
        let clocks = await clockModel.find({});
        return res.json(clocks);
    } catch (err) {
        // במקרה של שגיאה בשרת, נחזיר סטטוס 500
        return res.status(500).json({ title: "שגיאה בשליפת השעונים", message: err.message });
    }
};

/**
 * שליפת שעון בודד לפי ה-ID שלו
 */
export const getClockById = async (req, res) => {
    try {
        const { id } = req.params; // חילוץ ה-ID מפרמטרי הבקשה
        
        // חיפוש לפי מזהה ייחודי של MongoDB
        let clock = await clockModel.findById(id);
        
        // אם לא נמצא שעון, נחזיר שגיאת 404
        if (!clock) {
            return res.status(404).json({ title: "לא נמצא", message: "לא נמצא שעון עם מזהה זה" });
        }

        return res.json(clock);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת הנתונים", message: err.message });
    }
};

/**
 * יצירת שעון חדש ושמירתו במסד הנתונים
 */
export const createClock = async (req, res) => {
    try {
        // בדיקה שהגוף של הבקשה (body) קיים
        if (!req.body) {
            return res.status(400).json({ title: "חסר תוכן", message: "לא נשלחו נתונים ליצירה" });
        }

        // חילוץ השדות מתוך ה-body לפי הסכימה שהגדרת
        const { company, price, imgUrl, description, countryOfManufacture } = req.body;

        // בדיקת תקינות בסיסית: שדות חובה ומחיר חיובי
        if (!company || !price || !imgUrl) {
            return res.status(400).json({ title: "נתונים חסרים", message: "חברה, מחיר ותמונה הם שדות חובה" });
        }
        if (price <= 0) {
            return res.status(400).json({ title: "מחיר לא תקין", message: "המחיר חייב להיות גבוה מ-0" });
        }

        // יצירת מופע חדש של המודל
        const newClock = new clockModel({ 
            company, 
            price, 
            imgUrl, 
            description, 
            countryOfManufacture 
        });

        // שמירה בפועל ב-Database
        let savedClock = await newClock.save();

        // החזרת האובייקט שנוצר עם סטטוס 201 (Created)
        return res.status(201).json(savedClock);

    } catch (err) {
        return res.status(500).json({ title: "שגיאה ביצירת השעון", message: err.message });
    }
};

/**
 * עדכון פרטי שעון קיים לפי מזהה
 */
export const updateClock = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // הנתונים החדשים לעדכון

        // אם מנסים לעדכן מחיר, נוודא שהוא חיובי
        if (updateData.price !== undefined && updateData.price <= 0) {
            return res.status(400).json({ title: "נתון לא תקין", message: "מחיר חייב להיות חיובי" });
        }

        // findByIdAndUpdate מבצע את העדכון ומחזיר את האובייקט
        // האופציה { new: true } גורמת לכך שיחזור האובייקט *אחרי* השינוי
        let updatedClock = await clockModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedClock) {
            return res.status(404).json({ title: "שגיאה בעדכון", message: "לא נמצא שעון לעדכון" });
        }

        return res.json(updatedClock);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בתהליך העדכון", message: err.message });
    }
};

/**
 * מחיקת שעון מהמערכת
 */
export const deleteClock = async (req, res) => {
    try {
        const { id } = req.params;

        // מחיקת השעון לפי מזהה
        let deletedClock = await clockModel.findByIdAndDelete(id);

        if (!deletedClock) {
            return res.status(404).json({ title: "שגיאה במחיקה", message: "השעון לא נמצא במערכת" });
        }

        // החזרת האובייקט שנמחק לאישור
        return res.status(200).json(deletedClock);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה במחיקה", message: err.message });
    }
};