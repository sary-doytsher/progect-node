import { userModel } from "../models/user.js";
import { hashSync, compareSync } from "bcryptjs";

/**
 * שליפת כל המשתמשים הפעילים (ללא סיסמה)
 */
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({ status: true }, { password: 0 });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת משתמשים", message: err.message });
    }
};

/**
 * הוספת משתמש חדש
 * כולל בדיקה אם קיים משתמש לא פעיל עם אותו מייל
 */
export const addUser = async (req, res) => {
    try {
        const { username, password, email, profileImageUrl } = req.body;

        // 1. בדיקת תקינות בסיסית - שדות חובה
        if (!username || !password || !email)
            return res.status(400).json({ title: "נתונים חסרים", message: "שם משתמש, אימייל וסיסמה הם חובה" });

        // 2. בדיקת תקינות מבנה אימייל (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).json({ title: "מייל לא תקין", message: "פורמט האימייל אינו תקין" });

        // 3. בדיקת אורך סיסמה (לפחות 6 תווים)
        if (password.length < 6)
            return res.status(400).json({ title: "סיסמה חלשה", message: "הסיסמה חייבת להכיל לפחות 6 תווים" });

        // 4. בדיקה אם המשתמש כבר קיים (כולל בדיקת סטטוס)
        let existingUser = await userModel.findOne({ email });
        if (existingUser) {
            if (existingUser.status === false) {
                // רעיון: אם המשתמש קיים אך לא פעיל, ניתן להחזיר אותו לפעילות במקום ליצור חדש
                existingUser.status = true;
                existingUser.username = username;
                existingUser.password = hashSync(password, 10);
                await existingUser.save();
                const { password: p, ...rest } = existingUser.toObject();
                return res.status(200).json({ title: "חשבון שוחזר", user: rest });
            }
            return res.status(409).json({ title: "משתמש קיים", message: "קיים כבר משתמש עם כתובת מייל זו" });
        }

        // הצפנת סיסמה ושמירה
        const hashedPassword = hashSync(password, 10);
        const newUser = new userModel({ username, password: hashedPassword, email, profileImageUrl });
        await newUser.save();

        const { password: p, ...userData } = newUser.toObject();
        return res.status(201).json(userData);

    } catch (err) {
        return res.status(500).json({ title: "שגיאה ביצירת משתמש", message: err.message });
    }
};

/**
 * התחברות למערכת
 */
export const login = async (req, res) => {
    try {
        const { email, password: pass } = req.body;
        if (!email || !pass)
            return res.status(400).json({ title: "נתונים חסרים", message: "אימייל וסיסמה הם חובה" });

        const user = await userModel.findOne({ email, status: true });
        if (!user || !compareSync(pass, user.password)) {
            return res.status(401).json({ title: "שגיאת התחברות", message: "אימייל או סיסמה אינם נכונים" });
        }

        const { password, ...userData } = user.toObject();
        return res.json(userData);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בהתחברות", message: err.message });
    }
};

/**
 * עדכון פרטי משתמש (שם, תמונה וכו' - ללא סיסמה)
 */
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, profileImageUrl } = req.body;

        // עדכון רק של השדות שנשלחו
        const updatedUser = await userModel.findByIdAndUpdate(
            id, 
            { username, profileImageUrl }, 
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser)
            return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });

        return res.json(updatedUser);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון פרטים", message: err.message });
    }
};

/**
 * עדכון סיסמה (דורש אימות של הסיסמה הישנה)
 */
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword)
            return res.status(400).json({ title: "נתונים חסרים", message: "חובה לשלוח סיסמה ישנה וחדשה" });

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });

        // בדיקה שהסיסמה הישנה אכן נכונה
        if (!compareSync(oldPassword, user.password))
            return res.status(401).json({ title: "אימות נכשל", message: "הסיסמה הישנה אינה נכונה" });

        // הצפנה ושמירה של הסיסמה החדשה
        user.password = hashSync(newPassword, 10);
        await user.save();

        return res.json({ message: "הסיסמה עודכנה בהצלחה" });
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון סיסמה", message: err.message });
    }
};

/**
 * מחיקה "רכה" (הפיכה ללא פעיל במקום למחוק מה-DB)
 */
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndUpdate(id, { status: false }, { new: true });
        
        if (!user) return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });
        
        return res.json({ message: "המשתמש הפך ללא פעיל" });
    } catch (err) {
        return res.status(500).json({ title: "שגיאה במחיקת משתמש", message: err.message });
    }
};