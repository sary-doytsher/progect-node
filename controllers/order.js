import { clockModel } from '../models/clock.js';
import { orderModel } from '../models/order.js';
import { userModel } from '../models/user.js';

/**
 * שליפת כל ההזמנות הקיימות במערכת
 */
export async function getOrders(req, res) {
    try {
        let result = await orderModel.find();
        return res.json(result);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת הזמנות", message: err.message });
    }
}

/**
 * הוספת הזמנה חדשה לשעון
 */
export async function addOrder(req, res) {
    let { userId, productId, quantity } = req.body;

    // בדיקת תקינות נתונים בסיסית
    if (!userId || !productId || !quantity)
        return res.status(400).json({ title: "נתונים חסרים", message: "חובה לשלוח מזהה משתמש, מזהה מוצר וכמות" });

    if (quantity <= 0)
        return res.status(400).json({ title: "כמות לא תקינה", message: "כמות חייבת להיות גדולה מאפס" });

    try {
        // בדיקה שהמשתמש קיים במערכת
        let user = await userModel.findById(userId);
        if (!user)
            return res.status(404).json({ title: "משתמש לא נמצא", message: "לא קיים משתמש עם מזהה כזה" });

        // חיפוש השעון המבוקש במערכת
        let clock = await clockModel.findById(productId);
        if (!clock)
            return res.status(404).json({ title: "מוצר לא נמצא", message: "השעון המבוקש לא נמצא במערכת" });

        // יצירת אובייקט מצומצם של השעון לשמירה בתוך ההזמנה (Snapshot)
        let clockSnapshot = {
            _id: clock._id,
            company: clock.company,
            price: clock.price,
            imgUrl: clock.imgUrl
        };

        // יצירת ההזמנה ושמירתה
        let newOrder = new orderModel({ userId, product: clockSnapshot, quantity });
        await newOrder.save();

        return res.status(201).json(newOrder);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בהוספת הזמנה", message: err.message });
    }
}

/**
 * ביטול הזמנה (שינוי סטטוס ל-cancelled)
 */
export async function cancelOrder(req, res) {
    let orderId = req.params.id;
    try {
        let order = await orderModel.findById(orderId);
        if (!order)
            return res.status(404).json({ title: "הזמנה לא נמצאה", message: "לא קיימת הזמנה עם מזהה זה" });

        // ניתן לבטל הזמנה רק אם היא עדיין בסטטוס 'pending'
        if (order.status !== 'pending')
            return res.status(400).json({ title: "לא ניתן לבטל", message: "ניתן לבטל רק הזמנות הממתינות לאישור" });

        order.status = 'cancelled';
        await order.save();
        return res.json(order);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בביטול הזמנה", message: err.message });
    }
}

/**
 * עדכון סטטוס הזמנה (למשל: נשלח, הגיע ליעד)
 */
export async function updateOrderStatus(req, res) {
    let orderId = req.params.id;
    let { status } = req.body;

    // בדיקה שהסטטוס החדש תקין
    const validStatuses = ['shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status))
        return res.status(400).json({ title: "סטטוס לא תקין", message: "הסטטוס חייב להיות אחד מ: " + validStatuses.join(', ') });

    try {
        let order = await orderModel.findById(orderId);
        if (!order)
            return res.status(404).json({ title: "הזמנה לא נמצאה", message: "לא קיימת הזמנה עם מזהה זה" });

        // לוגיקה למעבר בין סטטוסים
        if (status === 'cancelled' && order.status !== 'pending')
            return res.status(400).json({ title: "שגיאה", message: "ניתן לבטל רק הזמנה הממתינה לאישור" });

        if (status === 'shipped' && order.status !== 'pending')
            return res.status(400).json({ title: "שגיאה", message: "ניתן לשלוח רק הזמנה שהיא בסטטוס 'pending'" });

        if (status === 'delivered' && order.status !== 'shipped')
            return res.status(400).json({ title: "שגיאה", message: "ניתן לסמן כ'נמסר' רק הזמנה שכבר נשלחה" });

        order.status = status;
        await order.save();
        return res.json(order);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון הסטטוס", message: err.message });
    }
}

/**
 * שליפת הזמנה בודדת לפי מזהה, כולל פרטי המשתמש שהזמין
 */
export async function getOrderById(req, res) {
    let orderId = req.params.id;
    try {
        // שימוש ב-populate כדי להביא את נתוני המשתמש (ללא סיסמה ופרטים רגישים)
        let order = await orderModel.findById(orderId)
            .populate('userId', '-password -status -__v -createdAt -updatedAt');

        if (!order)
            return res.status(404).json({ title: "לא נמצא", message: "הזמנה זו לא קיימת במערכת" });

        return res.json(order);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת ההזמנה", message: err.message });
    }
}

/**
 * שליפת כל ההזמנות שבוצעו על ידי משתמש ספציפי
 */
export async function getOrdersByUser(req, res) {
    let userId = req.params.userId;
    try {
        let orders = await orderModel.find({ userId: userId });
        return res.json(orders);
    }
    catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת הזמנות משתמש", message: err.message });
    }
}