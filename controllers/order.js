import { orderModel } from "../models/order.js"; // וודא שהנתיב למודל נכון

// 1. שליפת כל ההזמנות
export async function getOrders(req, res) {
    try {
        let allOrders = await orderModel.find();
        return res.json(allOrders);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בשליפת הזמנות", message: err.message });
    }
}

// 2. שליפת הזמנה לפי ID
export async function getOrderById(req, res) {
    let id = req.params.id;
    try {
        let order = await orderModel.findById(id);
        if (!order) return res.status(404).json({ title: "לא נמצא", message: "הזמנה לא קיימת" });
        return res.json(order);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה", message: err.message });
    }
}

// 3. שליפת הזמנות לפי משתמש
export async function getOrdersByUser(req, res) {
    let userId = req.params.userId;
    try {
        let orders = await orderModel.find({ userId: userId });
        return res.json(orders);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה", message: err.message });
    }
}

// 4. הוספת הזמנה חדשה
export async function addOrder(req, res) {
    try {
        let newOrder = new orderModel(req.body);
        await newOrder.save();
        return res.status(201).json(newOrder);
    } catch (err) {
        return res.status(400).json({ title: "שגיאה בהוספת הזמנה", message: err.message });
    }
}

// 5. עדכון סטטוס (הפונקציה ששלחת)
export async function updatePaymentStatus(req, res) {
    let orderId = req.params.id;
    let { status } = req.body; 
    try {
        let order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ title: "הזמנה לא נמצאה", message: "לא קיימת הזמנה עם מזהה זה" });

        order.status = status || 'paid'; 
        await order.save();
        return res.json(order);
    } catch (err) {
        return res.status(500).json({ title: "שגיאה בעדכון ההזמנה", message: err.message });
    }
}

// 6. ביטול/מחיקת הזמנה
export async function cancelOrder(req, res) {
    let id = req.params.id;
    try {
        let deletedOrder = await orderModel.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ title: "לא נמצא", message: "לא ניתן למחוק הזמנה שאינה קיימת" });
        return res.json({ message: "ההזמנה בוטלה בהצלחה" });
    } catch (err) {
        return res.status(500).json({ title: "שגיאה", message: err.message });
    }
}