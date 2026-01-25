import { userModel } from "../models/user.js";
import { hashSync, compareSync } from "bcryptjs";

// שליפת כל המשתמשים
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find({ status: true }, { password: 0 });
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת משתמשים", message: err.message });
    }
};

// שליפת משתמש בודד לפי ID (חדש - נדרש לפי הניתוב)
export const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id, { password: 0 });
        if (!user) return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת משתמש", message: err.message });
    }
};

// רישום משתמש חדש (שינוי שם מ-addUser ל-register להתאמה ל-Routes)
export const register = async (req, res) => {
    try {
        const { username, password, email, profileImageUrl } = req.body;
        if (!username || !password || !email)
            return res.status(400).json({ title: "נתונים חסרים", message: "שם משתמש, אימייל וסיסמה הם חובה" });

        let existingUser = await userModel.findOne({ email });
        if (existingUser) return res.status(409).json({ title: "משתמש קיים", message: "קיים כבר משתמש עם כתובת מייל זו" });

        const hashedPassword = hashSync(password, 10);
        const newUser = new userModel({ username, password: hashedPassword, email, profileImageUrl });
        await newUser.save();

        const { password: p, ...userData } = newUser.toObject();
        return res.status(201).json(userData);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה ברישום", message: err.message });
    }
};

// התחברות
export const login = async (req, res) => {
    try {
        const { email, password: pass } = req.body;
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

// עדכון פרופיל (שינוי שם ל-updateUser להתאמה ל-Routes)
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        ).select("-password");
        if (!updatedUser) return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });
        return res.json(updatedUser);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון", message: err.message });
    }
};

// עדכון סיסמה
export const updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body; // בדף התיעוד המורה לא ביקשה סיסמה ישנה, אך זה מומלץ. התאמתי לפי הפשטות של התיעוד.
        const user = await userModel.findById(req.params.id);
        if (!user) return res.status(404).json({ title: "לא נמצא", message: "משתמש לא נמצא" });

        user.password = hashSync(newPassword, 10);
        await user.save();
        return res.json({ message: "הסיסמה עודכנה בהצלחה" });
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון סיסמה", message: err.message });
    }
};